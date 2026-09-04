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
import { readFileSync } from "node:fs";
import { PORTFOLIO_PROJECTS } from "../data/portfolioProjectsLaunchV1.js";
import assert from "node:assert/strict";
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
// Individual project pages are real SPA routes too — the router serves /portfolio/:id.
// Deriving them from the live dataset means a restored project can never look "unreachable"
// to this contract again, which is exactly what happened on 2026-09-03.
const PROJECT_ROUTES = PORTFOLIO_PROJECTS.map((p) => `/portfolio/${p.id}`);
const SPA_ROUTES = new Set([
  "/",
  "/services",
  "/portfolio",
  "/service-areas",
  "/privacy",
  ...PROJECT_ROUTES,
]);
const REWRITE_SOURCES = new Set(rewrites.map((r) => r.source));

const isReachable = (dest) => {
  // Query strings are part of a valid destination: /portfolio?category=ADDITIONS is a
  // real route. Stripping only "#" made every category link look like a dead end.
  const path = dest.split("#")[0].split("?")[0] || "/";
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
  // Was `assert.equal(redirects.length, 289)`. That number encoded the SUPERSEDED
  // policy of redirecting the old blog posts away. Priscila's ruling 2026-08-27 is
  // that all 233 keep their own addresses and are served through the pass-through,
  // so those redirects are gone by design. The ceiling is the real contract; the
  // exact count is not. A floor still catches an accidental mass deletion.
  assert.ok(redirects.length >= 40, `only ${redirects.length} redirects — did the non-blog legacy map get wiped?`);
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

test("the painting-costs post is served, not redirected to a service page", () => {
  // Was: assert it is a reclaimable 307. Under the current policy it is not redirected
  // at all — it was the ONE post that had been permanently redirected to
  // /services/full-renovation, which contradicted "all 233 survive". That redirect was
  // removed 2026-08-28; this now guards against it coming back.
  const slug = "/budget-friendly-interior-painting-costs-in-2025-for-your-florida-home-remodel";
  const hit = redirects.find((r) => r.source.replace(/\/+$/, "") === slug);
  assert.equal(hit, undefined, "the painting-costs post is being redirected away again");
  const routed = rewrites.some((r) => r.source === slug && r.destination === "/api/legacy");
  assert.ok(routed, "the painting-costs post lost its pass-through route");
});

test("every legacy post still answers at its own address", () => {
  // SUPERSEDED POLICY, kept for the record: this used to require 130 temporary (307)
  // "holding" redirects — one per keeper post — and permanent (308) ones for posts being
  // dropped. Priscila's ruling 2026-08-27: NO post is dropped; all 233 keep their exact
  // public address and are served from WordPress through the pass-through.
  //
  // That is a STRONGER guarantee than a holding redirect, so the assertion is stronger
  // too: no legacy post may be redirected anywhere, and every one must be routed.
  const legacy = new Set(
    JSON.parse(readFileSync(new URL("../data/legacyBlogPaths.json", import.meta.url), "utf8")).paths,
  );
  const redirectedAway = redirects.filter((r) => legacy.has(r.source.replace(/\/+$/, "")));
  assert.deepEqual(
    redirectedAway.map((r) => r.source),
    [],
    "a legacy post is being redirected away — redirects run before rewrites, so its article would never load",
  );
  const routed = new Set(rewrites.filter((r) => r.destination === "/api/legacy").map((r) => r.source));
  const unrouted = [...legacy].filter((p) => !routed.has(p));
  assert.deepEqual(unrouted, [], `legacy posts with no pass-through route: ${unrouted.slice(0, 5)}`);
  assert.equal(legacy.size, 233, "the legacy post set changed size unexpectedly");
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
    // Now that the addition project is published again, the old address goes to the project
    // itself rather than to a category listing. That is a better redirect, not a regression.
    ["/portfolio/1270-harbor-court", 308, "/portfolio/home-addition-outdoor-living"],
  ];
  for (const [url, status, location] of expected) {
    const hit = resolve(url);
    assert.ok(hit, `${url} lost its redirect`);
    assert.equal(hit.status, status, `${url} status`);
    assert.equal(hit.location, location, `${url} location`);
    assert.deepEqual(resolvePlatformHop(`${url}/`), { status: 308, location: url });
  }
});
