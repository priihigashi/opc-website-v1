// Legacy WordPress pass-through.
//
// Keeps the 233 pre-existing blog-post URLs answering after the domain moves to
// Vercel. WordPress stays running on SiteGround and serves the article; the
// visitor and Google see the original address, unchanged.
//
// The origin has no stable hostname of its own (SiteGround serves it only under
// the apex, and subdomains are not vhosted), so we dial the fixed origin IP and
// pin both TLS SNI and the Host header to the apex. Resolving the apex normally
// would loop straight back into Vercel once DNS moves.
const https = require("node:https");
const { paths, originIp, originHost } = require("./_legacyManifest.js");

const ALLOWED = new Set(paths);
const ASSET_PREFIXES = ["/wp-content/", "/wp-includes/"];
const HOP_BY_HOP = new Set([
  "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
  "te", "trailer", "transfer-encoding", "upgrade", "set-cookie",
  "content-security-policy", "content-security-policy-report-only",
  "x-frame-options", "strict-transport-security", "cache-control", "expires", "pragma"
]);

const MAX_HTML_BYTES = 3 * 1024 * 1024;   // a WordPress article is ~270KB
const ASSET_EXT = /\.(css|js|mjs|jpe?g|png|gif|webp|avif|svg|ico|woff2?|ttf|eot|mp4|webm)$/i;

const normalise = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

// Decode and canonicalise BEFORE authorising. Authorising a raw string lets
// `/wp-content/../wp-admin/` (and its encoded variants) walk straight out of the
// asset directory and reach any endpoint on the WordPress origin.
const canonicalPath = (raw) => {
  let decoded;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;                                   // malformed percent-encoding
  }
  if (decoded.includes("\\") || decoded.includes("\0")) return null;
  const url = new URL(decoded, "https://origin.invalid");
  const pathname = url.pathname;
  if (pathname.split("/").some((seg) => seg === "." || seg === "..")) return null;
  if (pathname !== decoded.split("?")[0]) return null;   // normalisation changed it
  return pathname;
};

const isAllowed = (p) =>
  ALLOWED.has(normalise(p)) ||
  (ASSET_PREFIXES.some((prefix) => p.startsWith(prefix)) && ASSET_EXT.test(p));

module.exports = (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    return res.end("Method Not Allowed");
  }

  const target = req.url.split("#")[0];
  const [rawPath, query] = target.split("?");
  const safePath = canonicalPath(rawPath);
  if (!safePath || !isAllowed(safePath)) {
    res.statusCode = 404;
    return res.end("Not Found");
  }

  // WordPress canonicalises post URLs WITH a trailing slash and 301s to add it.
  // Ask for the canonical form directly so the origin never needs to redirect.
  const isPost = ALLOWED.has(normalise(safePath));
  // Drop the query string on article requests. WordPress ignores it, but
  // forwarding it lets anyone mint unlimited distinct cache keys and unlimited
  // origin hits against SiteGround.
  const originPath =
    isPost ? normalise(safePath) + "/" : safePath + (query ? "?" + query : "");

  const upstream = https.request(
    {
      host: originIp,
      servername: originHost,           // TLS SNI — the cert is *.oakpark-construction.com
      port: 443,
      path: originPath,
      method: req.method,
      headers: {
        host: originHost,              // vhost selection
        "user-agent": req.headers["user-agent"] || "opc-legacy-proxy",
        accept: req.headers.accept || "*/*",
        "accept-encoding": "identity",
        "x-forwarded-host": originHost,
        "x-forwarded-proto": "https"
      },
      timeout: 12000
    },
    (up) => {
      // A 3xx back to the apex would loop through Vercel for ever.
      const location = up.headers.location;
      if (location && /^https?:\/\/(www\.)?oakpark-construction\.com/i.test(location)) {
        const rel = location.replace(/^https?:\/\/(www\.)?oakpark-construction\.com/i, "");
        if (normalise(rel.split("?")[0]) === normalise(originPath.split("?")[0])) {
          res.statusCode = 508;
          return res.end("Origin redirect loop suppressed");
        }
      }
      res.statusCode = up.statusCode;
      for (const [k, v] of Object.entries(up.headers)) {
        if (!HOP_BY_HOP.has(k.toLowerCase())) res.setHeader(k, v);
      }
      res.setHeader("x-opc-legacy", "wordpress-origin");
      // These pages come from the OLD WordPress install and are served under the
      // NEW site's origin. Without this, any legacy plugin script would execute
      // with full same-origin authority over the React site — cookies, storage,
      // the lot. The articles are server-rendered and use native lazy loading,
      // so blocking scripts costs nothing visible.
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'none'; object-src 'none'; frame-ancestors 'none'; " +
          "form-action 'none'; base-uri 'none'; img-src 'self' data: https:; " +
          "style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:"
      );
      res.setHeader("X-Content-Type-Options", "nosniff");
      // These articles change rarely. Let the CDN hold them so a burst of blog
      // traffic does not become a burst of requests against SiteGround.
      res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      // The site sets trailingSlash:false, so Vercel serves these at /post while
      // WordPress still self-canonicalises to /post/. Left alone that is a
      // canonical pointing at a URL that redirects — an avoidable mixed signal
      // on exactly the 233 URLs we are trying to protect. Rewrite the self
      // references in the HTML to the URL actually being served.
      const type = String(up.headers["content-type"] || "");
      if (isPost && type.includes("text/html")) {
        const served = `https://${originHost}${normalise(safePath)}`;
        const slashed = served + "/";
        const chunks = [];
        let bytes = 0;
        up.on("data", (c) => {
          bytes += c.length;
          if (bytes > MAX_HTML_BYTES) { up.destroy(); res.statusCode = 502; return res.end("Legacy page too large"); }
          chunks.push(c);
        });
        up.on("end", () => {
          const html = Buffer.concat(chunks)
            .toString("utf8")
            // plain attributes: canonical, og:url, hreflang
            .split(`"${slashed}"`).join(`"${served}"`)
            // JSON-LD escapes its slashes, so the plain replace misses every
            // @id / url / mainEntityOfPage and leaves them pointing at a
            // URL that now redirects.
            .split(slashed.replace(/\//g, "\\/")).join(served.replace(/\//g, "\\/"));
          res.removeHeader("content-length");
          res.setHeader("content-length", Buffer.byteLength(html));
          res.end(html);
        });
        up.on("error", () => res.end());
        return;
      }
      up.pipe(res);
    }
  );

  upstream.on("timeout", () => upstream.destroy(new Error("origin timeout")));
  upstream.on("error", () => {
    res.statusCode = 502;
    res.end("Legacy origin unavailable");
  });
  upstream.end();
};
