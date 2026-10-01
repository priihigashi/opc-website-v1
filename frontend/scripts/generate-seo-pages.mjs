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
  html = setMeta(html, "property", "og:type", (route.type === "project" || route.type === "article") ? "article" : "website");
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

const blogPosts = JSON.parse(await readFile(join(frontendDir, "src", "blog", "posts.json"), "utf8"));
const blogPaths = ["/blog", ...blogPosts.map((post) => `/${post.slug}`)];
const renderInline = (value) => String(value).split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part) => {
  const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (link) {
    const href = link[2];
    if (!href.startsWith("/") && !href.startsWith("https://")) return escapeAttribute(link[1]);
    return `<a href="${escapeAttribute(href)}">${escapeAttribute(link[1])}</a>`;
  }
  if (part.startsWith("**") && part.endsWith("**")) return `<strong>${escapeAttribute(part.slice(2, -2))}</strong>`;
  if (part.startsWith("*") && part.endsWith("*")) return `<em>${escapeAttribute(part.slice(1, -1))}</em>`;
  return escapeAttribute(part);
}).join("");
const renderArticleBody = (content) => content.split(/\n\s*\n/).filter(Boolean).map((block) => {
  if (block.startsWith("### ")) return `<h3>${escapeAttribute(block.slice(4))}</h3>`;
  if (block.startsWith("## ")) return `<h2>${escapeAttribute(block.slice(3))}</h2>`;
  if (block.startsWith("- ")) return `<ul>${block.split(/\n(?=- )/).map((item) => `<li>${renderInline(item.replace(/^- /, "").replace(/\n\s+/g, " "))}</li>`).join("")}</ul>`;
  return `<p>${renderInline(block.replace(/\n/g, " "))}</p>`;
}).join("\n");
const organization = { "@type": "Organization", name: "Oak Park Construction", url: siteOrigin };
const staticStyle = "max-width:960px;margin:auto;padding:7rem 1.5rem 5rem;font:16px/1.75 Inter,Arial,sans-serif;color:#111113";
const articleStyle = "max-width:720px;margin:auto";
const injectBlog = (html, content, schema) => html
  .replace('<div id="root"></div>', `<div id="root"><main style="${staticStyle}">${content}</main></div>`)
  .replace("</head>", `  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>\n</head>`);

const blogDescription = "Practical construction guidance for South Florida homeowners from Oak Park Construction.";
const blogRoute = { type: "blog", title: "Blog | Oak Park Construction", description: blogDescription, image: "/images/opc/addition-progress-1200w.webp", imageAlt: "Oak Park Construction project", robots: "index,follow" };
const blogCards = blogPosts.map((post) => `<article style="margin:2rem 0"><a href="/${escapeAttribute(post.slug)}"><img src="${escapeAttribute(post.image)}" alt="${escapeAttribute(post.imageAlt)}" width="480" style="max-width:100%;height:auto" /><h2>${escapeAttribute(post.title)}</h2></a><p><time datetime="${post.date}">${post.date}</time> · ${escapeAttribute(post.category)}</p></article>`).join("\n");
const blogContent = `<p><a href="/">Oak Park Construction</a> / Blog</p><h1>Ideas for building well.</h1><p>${blogDescription}</p>${blogCards}`;
await mkdir(join(buildDir, "blog"), { recursive: true });
await writeFile(join(buildDir, "blog", "index.html"), injectBlog(renderRoute("/blog", blogRoute), blogContent, { "@context": "https://schema.org", "@type": "CollectionPage", name: "Blog | Oak Park Construction", url: `${siteOrigin}/blog`, description: blogDescription }));

for (const post of blogPosts) {
  const path = `/${post.slug}`;
  const description = post.content.split(/\n\s*\n/)[0].replace(/\s+/g, " ").slice(0, 158);
  const route = { type: "article", title: `${post.title} | Oak Park Construction`, description, image: post.image, imageAlt: post.imageAlt, robots: "index,follow" };
  const content = `<p><a href="/blog">← All articles</a></p><h1>${escapeAttribute(post.title)}</h1><p>By ${escapeAttribute(post.author)} · <time datetime="${post.date}">${post.date}</time></p><img src="${escapeAttribute(post.image)}" alt="${escapeAttribute(post.imageAlt)}" width="960" style="max-width:100%;height:auto" /><article style="${articleStyle}">${renderArticleBody(post.content)}</article><p><a href="/blog">All articles</a></p>`;
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description, mainEntityOfPage: `${siteOrigin}${path}`, image: [`${siteOrigin}${post.image}`], datePublished: post.date, dateModified: post.modified, author: organization, publisher: organization };
  const output = join(buildDir, post.slug, "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, injectBlog(renderRoute(path, route), content, schema));
}

await writeFile(join(buildDir, "seo-route-manifest.json"), JSON.stringify({
  generatedAt: new Date().toISOString(),
  origin: siteOrigin,
  routes: [...Object.keys(routes), ...blogPaths],
  searchConsoleVerificationIncluded: Boolean(verification),
}, null, 2));
