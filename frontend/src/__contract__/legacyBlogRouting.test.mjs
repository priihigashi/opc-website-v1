// Contract: the 233 pre-existing WordPress blog URLs must keep answering after
// the domain moves to Vercel. Priscila's ruling 2026-08-27: rewriting the posts
// is later, but none of the addresses may break on cutover day.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "fs";

const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));
const manifest = JSON.parse(readFileSync("src/data/legacyBlogPaths.json", "utf8"));
const legacy = vercel.rewrites.filter((r) => r.destination === "/api/legacy");
const legacySources = new Set(legacy.map((r) => r.source));

test("the manifest carries exactly the 233 live blog paths", () => {
  assert.equal(manifest.paths.length, 233);
  assert.equal(new Set(manifest.paths).size, 233);
});

test("every manifest path is routed to the pass-through", () => {
  const missing = manifest.paths.filter((p) => !legacySources.has(p));
  assert.deepEqual(missing, [], `unrouted legacy paths: ${missing.slice(0, 5)}`);
});

test("no redirect shadows a legacy path — redirects run before rewrites on Vercel", () => {
  const redirected = new Set(vercel.redirects.map((r) => r.source.replace(/\/+$/, "")));
  const shadowed = manifest.paths.filter((p) => redirected.has(p.replace(/\/+$/, "")));
  assert.deepEqual(shadowed, [], `legacy paths shadowed by a redirect: ${shadowed}`);
});

test("legacy rewrites precede the SPA catch-all", () => {
  const firstLegacy = vercel.rewrites.findIndex((r) => r.destination === "/api/legacy");
  const catchAll = vercel.rewrites.findIndex((r) => /:path\*|\(\.\*\)/.test(r.source) && r.destination !== "/api/legacy");
  assert.ok(firstLegacy >= 0, "no legacy rewrites present");
  if (catchAll >= 0) assert.ok(firstLegacy < catchAll, "a catch-all rewrite precedes the legacy routes");
});

test("WordPress asset directories are routed too, or article images break", () => {
  assert.ok(legacySources.has("/wp-content/:path*"));
  assert.ok(legacySources.has("/wp-includes/:path*"));
});

test("the pass-through never exposes the origin's identity or admin surface", () => {
  const fn = readFileSync("api/legacy.js", "utf8");
  assert.ok(fn.includes('"GET"') && fn.includes('"HEAD"'), "must be read-only");
  assert.ok(fn.includes("set-cookie"), "must strip Set-Cookie");
  assert.ok(fn.includes("canonicalPath"), "must canonicalise before authorising");
  assert.ok(fn.includes("script-src 'none'"), "legacy pages must not run scripts under the new origin");
});

test("the sitemap lists every legacy post, or Google loses 233 indexed pages", () => {
  const xml = readFileSync("public/sitemap.xml", "utf8");
  const missing = manifest.paths.filter(
    (p) => !xml.includes(`<loc>https://oakpark-construction.com${p}</loc>`)
  );
  assert.deepEqual(missing.slice(0, 5), [], `${missing.length} legacy path(s) absent from sitemap.xml`);
});

test("the sitemap uses the served form, not the redirecting trailing slash", () => {
  const xml = readFileSync("public/sitemap.xml", "utf8");
  const slashed = manifest.paths.filter((p) => xml.includes(`${p}/</loc>`));
  assert.deepEqual(slashed, [], `sitemap lists redirecting URLs: ${slashed.slice(0, 3)}`);
});
