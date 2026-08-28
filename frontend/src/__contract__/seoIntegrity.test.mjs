// SEO integrity contract — T-215 / T-216 / T-217.
//
// WHY THIS EXISTS: the three moving parts of this site's SEO (the route
// metadata table, the sitemap, and a 289-rule effective redirect map) are maintained in
// three different files by three different processes. Nothing stopped them
// drifting apart, and the failure is silent: a URL that is advertised in the
// sitemap and simultaneously redirected away is a self-inflicted crawl error
// nobody sees until rankings move.
//
// It also fences the schema layer. Fabricated review counts and invented FAQ
// blocks are the standard way a contractor site earns a manual action, so the
// rule here is that structured data may only assert things the page can prove.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, "..", ...p), "utf8");

const routes = JSON.parse(read("data", "seoRoutesV1.json"));
const vercel = JSON.parse(readFileSync(join(here, "..", "..", "vercel.json"), "utf8"));
const sitemapXml = readFileSync(join(here, "..", "..", "public", "sitemap.xml"), "utf8");
const robotsTxt = readFileSync(join(here, "..", "..", "public", "robots.txt"), "utf8");
const schemas = read("lib", "seoSchemasV1.js");

const ORIGIN = "https://oakpark-construction.com";
const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1].replace(ORIGIN, "") || "/",
);
const redirectSources = new Set(vercel.redirects.map((r) => r.source));
const indexable = (path) => !(routes[path].robots || "").includes("noindex");

test("the sitemap and the route table describe the same site", () => {
  const advertised = new Set(sitemapPaths);
  const shouldBeListed = Object.keys(routes).filter(indexable);
  const missing = shouldBeListed.filter((p) => !advertised.has(p));
  assert.deepEqual(missing, [], `indexable routes absent from sitemap: ${missing}`);
  const unknown = sitemapPaths.filter((p) => !(p in routes));
  assert.deepEqual(unknown, [], `sitemap advertises unknown routes: ${unknown}`);
});

test("a noindex page is never advertised in the sitemap", () => {
  const leaked = Object.keys(routes)
    .filter((p) => !indexable(p))
    .filter((p) => sitemapPaths.includes(p));
  assert.deepEqual(leaked, [], `noindex routes in sitemap: ${leaked}`);
  assert.ok("/privacy" in routes, "the privacy route disappeared");
  assert.equal(routes["/privacy"].robots, "noindex,follow");
});

test("nothing is both advertised and redirected away", () => {
  const contradictions = sitemapPaths.filter(
    (p) => redirectSources.has(p) || redirectSources.has(`${p}/`),
  );
  assert.deepEqual(
    contradictions,
    [],
    `URLs in the sitemap that a redirect sends elsewhere: ${contradictions}`,
  );
  const routeConflicts = Object.keys(routes).filter((p) => redirectSources.has(p));
  assert.deepEqual(routeConflicts, [], `routes shadowed by a redirect: ${routeConflicts}`);
});

test("robots.txt points at the sitemap and does not block the site", () => {
  assert.match(robotsTxt, new RegExp(`Sitemap: ${ORIGIN}/sitemap\\.xml`));
  assert.ok(!/^Disallow:\s*\/\s*$/m.test(robotsTxt), "robots.txt disallows the whole site");
});

test("titles and descriptions are unique and within display limits", () => {
  const titles = new Map();
  const descriptions = new Map();
  for (const [path, route] of Object.entries(routes)) {
    assert.ok(route.title?.trim(), `${path} has no title`);
    assert.ok(route.description?.trim(), `${path} has no description`);
    assert.ok(route.title.length <= 65, `${path} title is ${route.title.length} chars`);
    assert.ok(route.description.length <= 165, `${path} description is ${route.description.length} chars`);
    assert.ok(!titles.has(route.title), `duplicate title: ${route.title}`);
    assert.ok(!descriptions.has(route.description), `duplicate description on ${path}`);
    titles.set(route.title, path);
    descriptions.set(route.description, path);
  }
});

test("every route carries a social image and its alt text", () => {
  for (const [path, route] of Object.entries(routes)) {
    assert.ok(route.image?.startsWith("/"), `${path} has no og:image`);
    assert.ok(route.imageAlt?.trim(), `${path} has no og:image alt text`);
  }
});

test("structured data asserts nothing the site cannot prove", () => {
  for (const claim of ["aggregateRating", "reviewCount", "ratingValue", "priceRange", "openingHours"]) {
    assert.ok(!schemas.includes(claim), `seoSchemasV1.js emits ${claim}, which nothing on the page substantiates`);
  }
  assert.ok(!schemas.includes("FAQPage"), "FAQ schema without visible FAQ content");
});

test("Article schema stays unused until a page has a real author and date", () => {
  assert.ok(schemas.includes("buildArticleSchemaV1"), "the builder was deleted");
  const routed = schemas.slice(schemas.indexOf("export const buildRouteSchemasV1"));
  assert.ok(
    !routed.includes("buildArticleSchemaV1"),
    "Article schema is now emitted for a route — verify a visible author and date exist first",
  );
});

test("the business identity is a single truthful node", () => {
  assert.ok(schemas.includes('"GeneralContractor"'));
  assert.ok(schemas.includes("+1-954-258-6769"), "telephone must match the site");
  assert.ok(schemas.includes("contact@oakpark-construction.com"));
  assert.ok(schemas.includes("BUSINESS_ID"), "schemas must share one business @id");
});
