// T-318 — AUTHORITY REGRESSION TEST.
//
// WHY THIS EXISTS: on 2026-08-24 the routed /services page (ServicesV7) imported
// shouldUseStaticHouse from DeferredHouseStageV2 while AppV3 mounted V5. V2 marks
// every phone under 768px as static; V5 deliberately does not (T-262). A phone
// therefore got interactive 3D from the stage while the page believed it was
// static-only and navigated away, skipping the choreography (T-273).
//
// The existing featureContract test could NOT catch this: it resolves the house
// chain from the FIRST DeferredHouseStage import in the app entry, finds V5, and
// never inspects what a page imports. All 15 of its tests passed with the bug live.
//
// THIS TEST MUST FAIL if a routed page ever imports behavioural authority from a
// versioned DeferredHouseStageV* component again.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(SRC, p), "utf8");

// Resolve the entry the way the browser does.
const entryName = /import App from "@\/([A-Za-z0-9_]+)"/.exec(read("index.js"))?.[1];
const app = read(`${entryName}.js`);

// Only pages the router actually renders are in scope. Unrouted legacy versions
// (ServicesV4/V5) are dead code and are scheduled for post-launch deletion; failing
// on them here would block a launch for files no visitor can reach.
function routedPageFiles() {
  const names = new Set();
  for (const m of app.matchAll(/element=\{<([A-Z][A-Za-z0-9_]*)/g)) names.add(m[1]);
  for (const m of app.matchAll(/lazy\(\(\) => import\("@\/pages\/([A-Za-z0-9_]+)"\)\)/g)) names.add(m[1]);
  const files = readdirSync(join(SRC, "pages"));
  return [...names].map((n) => `${n}.jsx`).filter((f) => files.includes(f));
}

test("the static-house policy has exactly one definition site", () => {
  const policy = read("lib/houseRenderPolicy.js");
  assert.match(policy, /export const shouldUseStaticHouse = \(\) =>/,
    "lib/houseRenderPolicy.js must be the definition site");
  assert.match(policy, /export const canPlayInteractivePreview/,
    "the policy must also answer the LIVE stage question, not just device preference");
  for (const token of ["HOUSE_PENDING", "HOUSE_READY", "HOUSE_FAILED", "HOUSE_STATIC"]) {
    assert.ok(policy.includes(token),
      `the policy needs THREE states: a boolean cannot separate "still loading" from "gone" (${token})`);
  }
  assert.match(policy, /registerHouseStage/,
    "stages must be tracked per-instance: two stages overlap by 800ms on route change and a shared flag lets the departing one clobber the healthy one");
});

test("no ROUTED page imports behavioural authority from a versioned DeferredHouseStageV*", () => {
  const offenders = [];
  for (const file of routedPageFiles()) {
    const src = read(`pages/${file}`);
    for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from\s*"@\/components\/(DeferredHouseStageV\d+)"/g)) {
      offenders.push(`pages/${file} imports {${m[1].trim()}} from ${m[2]}`);
    }
  }
  assert.deepEqual(offenders, [],
    "routed pages must import house policy from @/lib/houseRenderPolicy, never from a versioned stage");
});

test("the routed services page gates on the live stage, not device preference alone", () => {
  const routed = routedPageFiles().find((f) => /^Services/.test(f));
  assert.ok(routed, "a routed services page must exist");
  const src = read(`pages/${routed}`);
  assert.match(src, /houseStageStatus|canPlayInteractivePreview/,
    "services must ask the shared policy about the LIVE stage, not device preference alone");
  assert.match(src, /HOUSE_PENDING/,
    "services must handle PENDING separately from FAILED: a healthy scene still confirming its first frames must be WAITED for, not treated as broken (regression of T-188/T-262)");
  assert.match(src, /whenHouseStageSettled/,
    "services must wait out a pending stage rather than silently skipping the preview");
});

test("the live stage publishes its state to the shared policy", () => {
  const stage = /import (DeferredHouseStage[A-Za-z0-9_]*) from/.exec(app)?.[1];
  const src = read(`components/${stage}.jsx`);
  // The stage may publish directly or delegate to the shared registration hook;
  // either satisfies the contract, but it must not publish nothing at all.
  const delegates = /useHouseStageRegistration/.test(src);
  const publishesDirectly = /setHouseStageReady/.test(src) && /setHouseStageFailed/.test(src);
  assert.ok(delegates || publishesDirectly,
    `${stage} must publish its live state to @/lib/houseRenderPolicy, directly or via useHouseStageRegistration`);
  if (delegates) {
    const hook = read("lib/useHouseStageRegistration.js");
    assert.match(hook, /setHouseStageReady/, "the registration hook must publish ready state");
    assert.match(hook, /setHouseStageFailed/, "the registration hook must publish failure state");
    assert.match(hook, /unregisterHouseStage/, "a stage must deregister on unmount or its record leaks");
  }
  assert.match(src, /setInteractiveFailed/,
    "the stage must retain an explicit hard-failure path for render and WebGL errors");
  assert.doesNotMatch(src, /STARTUP_DELAY_MS[\s\S]{0,500}setInteractiveFailed\(true\)/,
    "a slow first frame is recoverable and must not be published as a permanent stage failure");
});

test("a stage confirms readiness from its OWN frames, never the shared window.__dbg", () => {
  // Two stages overlap by 800ms on a route change (AppV3 keeps ServicesStageGate
  // alive). window.__dbg is a single global written by every model, so counting
  // frames on it let a departing stage certify a brand-new, still-suspended stage
  // as ready: empty canvas revealed, failsafe cancelled, blank stage for the visitor.
  const stage = /import (DeferredHouseStage[A-Za-z0-9_]*) from/.exec(app)?.[1];
  const src = read(`components/${stage}.jsx`);
  assert.ok(!/if \(window\.__dbg\)|window\.__dbg\s*!==\s*undefined|__dbg\s*\)/.test(src),
    `${stage} must not read window.__dbg as a readiness source`);
  assert.match(src, /onFrame=\{/, `${stage} must pass a per-instance onFrame signal to its scene`);
});

test("BOTH scene chains forward the per-instance frame signal", () => {
  // Home AND Services. A dropped hop on either chain silently returns that stage to
  // certifying itself on whatever frames happen to be running.
  //
  // Follow JSX USAGE, not imports: HouseSceneV19 imports HouseModelV17 only as a
  // default parameter, while the real model arrives through ModelComponent={...}.
  const stage = /import (DeferredHouseStage[A-Za-z0-9_]*) from/.exec(app)?.[1];
  const stageSrc = read(`components/${stage}.jsx`);

  const entries = [];
  for (const key of ["HomeHouse", "ServicesHouse"]) {
    const m = new RegExp(`${key} = lazy\\(\\(\\) => import\\("@/(three|pages)/([A-Za-z0-9_]+)"\\)\\)`).exec(stageSrc);
    assert.ok(m, `could not resolve the ${key} chain from ${stage}`);
    entries.push([key, `${m[1]}/${m[2]}.jsx`]);
  }

  const visited = new Set();
  const walk = (label, file) => {
    if (visited.has(file)) return;
    visited.add(file);
    const src = read(file);
    assert.match(src, /onFrame/, `${label}: ${file} must forward onFrame`);
    const nextNames = new Set();
    for (const m of src.matchAll(/<(House(?:Scene|Model)V\d+)/g)) nextNames.add(m[1]);
    for (const m of src.matchAll(/ModelComponent=\{(House[A-Za-z0-9_]+)\}/g)) nextNames.add(m[1]);
    for (const name of nextNames) walk(label, `three/${name}.jsx`);
  };
  for (const [label, file] of entries) walk(label, file);

  // Both chains must genuinely land on the shared base component.
  assert.ok(visited.size >= 5, `expected several hops, walked: ${[...visited].join(", ")}`);
  const base = read("three/HouseModel.jsx");
  assert.match(base, /reportFrame\(onFrame\);/,
    "HouseModel must actually report each frame from inside its frame loop");
  assert.match(base, /const reportFrame = \(onFrame\) =>/,
    "the null guard must live at module scope: HouseModel is over the complexity threshold and its debt may not increase");
});
