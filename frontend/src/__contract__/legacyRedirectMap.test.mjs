// Legacy URL continuity contract — T-208-F (launch-safe realization of T-208-E).
//
// WHY THIS EXISTS: the redirect map is the only thing standing between the
// indexed WordPress URLs and a wall of 404s on cutover day. It is 289 effective
// rules; Vercel canonicalizes a trailing slash to the bare path before these
// redirects run because trailingSlash is false.
// long, it was assembled from a spreadsheet, and nobody can eyeball it. A
// broken rule is invisible until traffic is already lost, so the map is
// asserted here instead of being trusted.
//
// Runs on the project's existing runner (node:test) — no new framework, no
// network, no deployment required.
//
// VERCEL SEMANTICS ASSUMED (documented so a future reader can check them):
//   redirects[] are evaluated in order, first match wins, before rewrites[].
//   "permanent": true  => HTTP 308  (verified live 2026-08-21 on the 33 legacy rules)
//   "permanent": false => HTTP 307  (holding redirect; URL stays reclaimable)

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  readFileSync(join(here, "..", "..", "vercel.json"), "utf8"),
);

const redirects = config.redirects ?? [];
const rewrites = config.rewrites ?? [];

// Routes the SPA itself owns (AppV4.js <Route path=...>), plus the static
// rewrite targets. A redirect destination must land on one of these.
const SPA_ROUTES = new Set([
  "/",
  "/services",
  "/portfolio",
  "/service-areas",
  "/privacy",
]);
const REWRITE_SOURCES = new Set(rewrites.map((r) => r.source));

const isReachable = (dest) => {
  const path = dest.split("#")[0] || "/";
  return SPA_ROUTES.has(path) || REWRITE_SOURCES.has(path);
};

const statusFor = (rule) => (rule.permanent ? 308 : 307);

/** Minimal model of Vercel's first-match-wins redirect table. */
const resolve = (url) => {
  for (const rule of redirects) {
    if (rule.source === url) {
      return { status: statusFor(rule), location: rule.destination };
    }
  }
  return null;
};

/** Model the platform-owned canonicalization that precedes redirect rules. */
const resolvePlatformHop = (url) => {
  if (url !== "/" && url.endsWith("/")) {
    return { status: 308, location: url.slice(0, -1) };
  }
  return resolve(url);
};

test("Vercel's 1024-rule ceiling is not exceeded", () => {
  assert.equal(redirects.length, 289, "expected only effective bare-path rules");
  assert.ok(
    redirects.length <= 1024,
    `${redirects.length} redirects exceeds the platform limit of 1024`,
  );
});

test("no legacy URL is claimed by two different rules", () => {
  const seen = new Map();
  const dupes = [];
  for (const rule of redirects) {
    if (seen.has(rule.source)) dupes.push(rule.source);
    seen.set(rule.source, rule);
  }
  assert.deepEqual(dupes, [], `duplicate redirect sources: ${dupes.join(", ")}`);
});

test("every destination is a route that exists today", () => {
  const broken = redirects
    .filter((r) => !isReachable(r.destination))
    .map((r) => `${r.source} -> ${r.destination}`);
  assert.deepEqual(
    broken,
    [],
    // This is precisely the defect that made T-208-E unshippable: 260 of its
    // rules pointed at /blog/<slug> and there is no /blog route, so each 307
    // would have landed in a real 404.
    `destinations with no route:\n  ${broken.join("\n  ")}`,
  );
});

test("configured destinations create no application redirect chains or loops", () => {
  const sources = new Set(redirects.map((r) => r.source));
  const chained = redirects
    .filter((r) => {
      const path = r.destination.split("#")[0];
      return sources.has(path) || sources.has(`${path}/`);
    })
    .map((r) => `${r.source} -> ${r.destination}`);
  assert.deepEqual(chained, [], `chained redirects:\n  ${chained.join("\n  ")}`);

  const selfLoops = redirects
    .filter((r) => r.source === r.destination)
    .map((r) => r.source);
  assert.deepEqual(selfLoops, [], `self-referential redirects: ${selfLoops}`);
});

test("trailing-slash requests canonicalize once, then take the intended redirect", () => {
  for (const rule of redirects) {
    assert.ok(!rule.source.endsWith("/"), `${rule.source} is an unreachable slash rule`);

    const canonical = resolvePlatformHop(`${rule.source}/`);
    assert.deepEqual(canonical, { status: 308, location: rule.source });

    const intended = resolvePlatformHop(canonical.location);
    assert.deepEqual(intended, {
      status: statusFor(rule),
      location: rule.destination,
    });
  }
});

test("the painting-costs post is a reclaimable 307, not a permanent 308", () => {
  // T-208-E reclassified this post KEEP & FIX at 1,951 words. The permanent
  // rule shipped at bf1ead7 gave the address away for good; a 307 holds it.
  const slug =
    "/budget-friendly-interior-painting-costs-in-2025-for-your-florida-home-remodel";
  const hit = resolve(slug);
  assert.ok(hit, `${slug} has no redirect rule`);
  assert.equal(hit.status, 307, `${slug} must not be a permanent redirect`);
  assert.equal(hit.location, "/services/full-renovation");

  assert.deepEqual(resolvePlatformHop(`${slug}/`), { status: 308, location: slug });
});

test("keeper posts hold their address with 307 and dropped posts release it with 308", () => {
  const holding = redirects.filter((r) => !r.permanent);
  const released = redirects.filter((r) => r.permanent);
  assert.ok(holding.length > 0, "no holding redirects survived the merge");
  assert.ok(released.length > 0, "no permanent redirects survived the merge");
  assert.equal(holding.length, 130, "expected one canonical rule per keeper post");
});

test("category and tag archives are covered", () => {
  const categories = redirects.filter((r) => r.source.startsWith("/category/"));
  const tags = redirects.filter((r) => r.source.startsWith("/tag/"));
  assert.equal(categories.length, 9, "expected 9 category archives");
  assert.equal(tags.length, 14, "expected 14 tag archives");
  for (const rule of [...categories, ...tags]) {
    assert.ok(isReachable(rule.destination), `${rule.source} -> nowhere`);
  }
});

test("the pre-existing non-blog legacy redirects still fire", () => {
  // Regression guard: the blog package was appended, it must not have displaced
  // the /jobgallery, /expertise, /project-gallery or /gallery rules that were
  // verified live returning 308 on 2026-08-21.
  const expected = [
    ["/gallery", 308, "/portfolio"],
    ["/hub", 308, "/"],
    ["/contact-us", 308, "/#contact"],
    ["/jobgallery/full-home-remodel", 308, "/services/full-renovation"],
    ["/expertise/renovations", 308, "/services/full-renovation"],
    ["/expertise/accessory-dwelling-units-adus", 308, "/services/additions"],
    ["/project-gallery/new-build", 308, "/portfolio"],
    ["/portfolio/1270-harbor-court", 308, "/portfolio/harbor-court-residence"],
  ];
  for (const [url, status, location] of expected) {
    const hit = resolve(url);
    assert.ok(hit, `${url} lost its redirect`);
    assert.equal(hit.status, status, `${url} status`);
    assert.equal(hit.location, location, `${url} location`);
    assert.deepEqual(resolvePlatformHop(`${url}/`), { status: 308, location: url });
  }
});
