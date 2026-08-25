// Feature Contract regression tests — ChatGPT cross-audit AUTHORIZED D, Rules 6/7/8.
//
// WHY THIS EXISTS: features were never lost from git. They were lost because a
// later component version was routed in App.js without checking that previously
// approved behaviour survived. PortfolioV7 replaced a rows-based gallery and
// silently dropped Before/After. These tests make that class of failure fail.
//
// Runs on the project's existing runner (node:test) — no new framework.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(SRC, p), "utf8");
// CRITICAL: resolve the entry the way the browser does. index.js imports the real
// app module (currently AppV3), NOT App.js. On 2026-08-23 a whole round of fixes was
// applied to App.js — which nothing imports — and appeared to pass review while the
// live site was unchanged. This test must never read a file the bundle does not use.
const entryName = /import App from "@\/([A-Za-z0-9_]+)"/.exec(read("index.js"))?.[1];
if (!entryName) throw new Error("could not resolve the app entry from index.js");
const app = read(`${entryName}.js`);

// Follow the real chain: entry -> DeferredHouseStage -> HouseScene -> HouseModel.
function liveHouseModel() {
  const stage = /import (DeferredHouseStage[A-Za-z0-9_]*) from/.exec(app)?.[1];
  const scene = /HomeHouse = lazy\(\(\) => import\("@\/three\/([A-Za-z0-9_]+)"\)\)/
    .exec(read(`components/${stage}.jsx`))?.[1];
  const model = /import (HouseModelV\d+) from/.exec(read(`three/${scene}.jsx`))?.[1];
  if (!model) throw new Error(`could not resolve live house model via ${stage} -> ${scene}`);
  return `three/${model}.jsx`;
}

test("entry chain is resolvable and the app entry is not the orphaned App.js", () => {
  assert.ok(entryName, "index.js must name an app module");
  assert.notEqual(entryName, "App", "index.js should import the live app module, not the orphaned App.js");
});

// Which component each public route actually renders, read from App.js itself.
function routedComponent(routePath) {
  const direct = app.match(
    new RegExp(`<Route\\s+path="${routePath.replace("/", "\\/")}"\\s+element=\\{<([A-Za-z0-9_]+)`)
  );
  return direct ? direct[1] : null;
}
function lazyTarget(constName) {
  const m = app.match(new RegExp(`const ${constName} = lazy\\(\\(\\) => import\\("@\\/pages\\/([A-Za-z0-9_]+)"\\)\\)`));
  return m ? m[1] : null;
}

// ---------------------------------------------------------------- REQUIRED --
// Every entry must hold on the CURRENTLY ROUTED component. A route swap that
// drops one of these fails here rather than in production.
const REQUIRED = [
  { route: "/services", file: () => `pages/${routedComponent("/services")}.jsx`,
    name: "services headline reads 'Choose Its Next Chapter'",
    check: (s) => s.includes("Choose Its Next Chapter") },
  { route: "/services", file: () => `pages/${routedComponent("/services")}.jsx`,
    name: "services headline carries no 'One House.' prefix",
    check: (s) => !s.includes("One House.") },
  { route: "/services", file: () => `pages/${routedComponent("/services")}.jsx`,
    name: "services headline is the borderless editorial treatment, not the old glass box",
    check: (s) => s.includes("services-heading-v3") && !s.includes("services-heading-v2") },
  { route: "/services", file: () => `pages/${routedComponent("/services")}.jsx`,
    name: "services uses the modestly faster V5 timing while preserving the completed-view hold",
    check: (s) => s.includes("SERVICES_V5") && read("pages/servicesDataV5.js").includes("revealMs * 0.88")
      && read("pages/servicesDataV5.js").includes("SERVICES_V4") },
  { route: "/privacy", file: () => `pages/${lazyTarget("Privacy")}.jsx`,
    name: "privacy page discloses server-side enquiry handling, not mailto-only",
    check: (s) => /posted|our contact service|discard/i.test(s) },
  { route: "/privacy", file: () => `pages/${lazyTarget("Privacy")}.jsx`,
    name: "privacy page discloses website analytics",
    check: (s) => /analytics/i.test(s) },
  { route: "/", file: () => liveHouseModel(),
    name: "house begins moving on the first scroll (opening hold <= 0.02)",
    check: (s) => {
      // Each of the four tracks (rotation, position, vertical, scale) opens with a
      // flat hold: [0, v] then [hold, v]. Every hold must be <= 0.02 or the house
      // sits frozen through the hero again.
      const holds = [...s.matchAll(/\[0,\s*(?:-?[\d.]+|heroY)\],\s*\[([\d.]+),/g)].map((m) => Number(m[1]));
      return holds.length >= 4 && holds.every((h) => h <= 0.02);
    } },
  { route: "/", file: () => liveHouseModel(),
    name: "chapters 2-5 choreography preserved (late keyframes intact, T-258 retimed)",
    check: (s) => s.includes("[0.27, -2.3]") && s.includes("[0.912, 0.92]") },
  // T-258/T-261 — panel choreography: exact windows live in StoryV13 and the gate in ChapterV3.
  { route: "/", file: () => "components/StoryV13.jsx",
    name: "all five chapter panel windows are specified (T-258)",
    check: (s) => ["0.195", "0.37", "0.515", "0.7", "0.865"].every((v) => s.includes(`enter: ${v},`)) },
  { route: "/", file: () => "components/ChapterV3.jsx",
    name: "chapter panel is scroll-window gated, not always-on (T-258)",
    check: (s) => s.includes("exitStart") && s.includes("seg(p, enter, enter + 0.01)") },
  // T-259/T-261 — filtered grid balance: spans respond to the result set.
  { route: "/portfolio", file: () => `pages/${lazyTarget("Portfolio")}.jsx`,
    name: "two filtered results render as an equal matched pair (T-259)",
    check: (s) => s.includes('if (n === 2) return ["std", "std"]') && s.includes("computeCardSpans(shown") },
  // T-242 — PROMOTED from LOST: construction-sequence galleries are back via the
  // verified dataset (phase-ordered rows) and per-slide Before/During/Finished chips.
  { route: "/portfolio/:projectId", file: () => "data/portfolioProjectsV3.js",
    name: "projects carry phase-ordered rows (T-242 restored)",
    check: (s) => s.includes('"phases"') && s.includes('"BEFORE"') && s.includes('"rows"') },
  { route: "/portfolio/:projectId", file: () => `pages/${lazyTarget("ProjectGallery")}.jsx`,
    name: "gallery slides label Before/During/Finished (T-242 restored)",
    check: (s) => s.includes('image.phase === "AFTER" ? "Finished"') },
];

// ------------------------------------------------------------------- LOST ---
// Approved features that are currently ABSENT from the routed component.
// These are real regressions awaiting Priscila's decision, recorded so the set
// cannot grow silently. If one starts passing, promote it to REQUIRED.
const LOST = [
  // (empty) — T-242 Before/After multi-row galleries were restored on 2026-08-24 and
  // promoted to REQUIRED above. Add future genuine regressions here.
];

for (const f of REQUIRED) {
  test(`REQUIRED ${f.route} — ${f.name}`, () => {
    const path = f.file();
    assert.ok(path && !path.includes("null"), `could not resolve routed component for ${f.route}`);
    assert.ok(f.check(read(path)), `${f.route} routes to ${path}, which no longer satisfies: ${f.name}`);
  });
}

test("no NEW feature regressions — the LOST set has not grown", () => {
  for (const f of LOST) {
    const restored = f.check(read(f.file()));
    assert.equal(restored, false,
      `"${f.name}" now PASSES. That is good news — promote it from LOST to REQUIRED in this file.`);
  }
});

test("display headlines carry no trailing period (testimonials exempt)", () => {
  const files = ["components/StoryV13.jsx", "components/HeroV8.jsx", "components/AboutV3.jsx",
                 "components/GalleryV4.jsx", `pages/${lazyTarget("Portfolio")}.jsx`];
  for (const p of files) {
    const titles = [...read(p).matchAll(/title: \[([^\]]*)\]/g)].map((m) => m[1]);
    for (const t of titles) {
      assert.ok(!/\.",|\."\s*$/.test(t), `display headline still ends in a period in ${p}: ${t}`);
    }
  }
});

test("every routed component file actually exists", () => {
  for (const p of ["/services"].map((r) => `pages/${routedComponent(r)}.jsx`)
    .concat(["Portfolio", "Privacy", "ServiceAreas", "ServiceDetail"].map((c) => `pages/${lazyTarget(c)}.jsx`))) {
    assert.doesNotThrow(() => read(p), `App.js routes to a file that does not exist: ${p}`);
  }
});
