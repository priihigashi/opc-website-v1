import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const frontendDir = dirname(scriptDir);
const buildDir = join(frontendDir, "build");
const templatePath = join(buildDir, "index.html");
const routesPath = join(frontendDir, "src", "data", "seoRoutesV1.json");
const siteOrigin = "https://oakpark-construction.com";

const [template, routeSource] = await Promise.all([
  readFile(templatePath, "utf8"),
  readFile(routesPath, "utf8"),
]);
const routes = JSON.parse(routeSource);
const verification = process.env.GOOGLE_SITE_VERIFICATION || process.env.REACT_APP_GOOGLE_SITE_VERIFICATION;

const escapeAttribute = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const setMeta = (html, selector, key, value) => {
  const escaped = escapeAttribute(value);
  const pattern = new RegExp(`<meta\\s+${selector}="${key}"[^>]*>`, "i");
  const replacement = `<meta ${selector}="${key}" content="${escaped}" />`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `  ${replacement}\n</head>`);
};

const renderRoute = (path, route) => {
  const canonical = `${siteOrigin}${path}`;
  const image = `${siteOrigin}${route.image}`;
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttribute(route.title)}</title>`);

  html = setMeta(html, "name", "description", route.description);
  html = setMeta(html, "name", "robots", route.robots || "index,follow");
  html = setMeta(html, "property", "og:type", route.type === "project" ? "article" : "website");
  html = setMeta(html, "property", "og:site_name", "Oak Park Construction");
  html = setMeta(html, "property", "og:title", route.title);
  html = setMeta(html, "property", "og:description", route.description);
  html = setMeta(html, "property", "og:url", canonical);
  html = setMeta(html, "property", "og:image", image);
  html = setMeta(html, "property", "og:image:alt", route.imageAlt);
  html = setMeta(html, "name", "twitter:card", "summary_large_image");
  html = setMeta(html, "name", "twitter:title", route.title);
  html = setMeta(html, "name", "twitter:description", route.description);
  html = setMeta(html, "name", "twitter:image", image);
  html = setMeta(html, "name", "twitter:image:alt", route.imageAlt);
  html = html.replace(/\s*<link\s+rel="canonical"[^>]*>/i, "");
  html = html.replace("</head>", `  <link rel="canonical" href="${escapeAttribute(canonical)}" />\n</head>`);

  if (verification) {
    html = setMeta(html, "name", "google-site-verification", verification);
  }

  return html;
};

for (const [path, route] of Object.entries(routes)) {
  const outputPath = path === "/" ? templatePath : join(buildDir, path.slice(1), "index.html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderRoute(path, route));
}

await writeFile(join(buildDir, "seo-route-manifest.json"), JSON.stringify({
  generatedAt: new Date().toISOString(),
  origin: siteOrigin,
  routes: Object.keys(routes),
  searchConsoleVerificationIncluded: Boolean(verification),
}, null, 2));
