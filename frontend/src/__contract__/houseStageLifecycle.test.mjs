// T-318b — LIFECYCLE tests for the shared house-render policy.
//
// The sibling houseRenderPolicy.test.mjs is structural: it proves the right symbols
// are imported in the right places. It passed while a real click race existed. These
// tests exercise the module's actual behaviour instead — registration, aggregation
// across overlapping stages, unmount ordering, and the pending waiter.
//
// Pure module, no DOM framework needed; navigator/window/performance are stubbed.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

globalThis.navigator ??= {};
globalThis.performance ??= { now: () => Date.now() };
globalThis.window = {
  matchMedia: () => ({ matches: false }),
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id),
};

const policy = await import("../lib/houseRenderPolicy.js");
const {
  registerHouseStage, unregisterHouseStage, setHouseStageReady, setHouseStageFailed,
  houseStageStatus, canPlayInteractivePreview, whenHouseStageSettled,
  _resetHouseStages, HOUSE_PENDING, HOUSE_READY, HOUSE_FAILED, HOUSE_STATIC,
} = policy;

beforeEach(() => { _resetHouseStages(); globalThis.navigator.connection = undefined; });

test("no stage mounted yet reads PENDING, never READY", () => {
  assert.equal(houseStageStatus(), HOUSE_PENDING);
  assert.equal(canPlayInteractivePreview(), false);
});

test("a freshly registered stage is PENDING until it confirms a frame", () => {
  registerHouseStage();
  assert.equal(houseStageStatus(), HOUSE_PENDING, "a loading scene must not read as failed");
});

test("PENDING and FAILED are distinguishable — the bug that skipped the preview", () => {
  const id = registerHouseStage();
  assert.equal(houseStageStatus(), HOUSE_PENDING);
  setHouseStageFailed(id, true);
  assert.equal(houseStageStatus(), HOUSE_FAILED);
  // A boolean API could not tell these apart, and ServicesV7 navigated on both.
});

test("a departing stage cannot clobber a healthy one (the 800ms overlap)", () => {
  const services = registerHouseStage();
  const home = registerHouseStage();
  setHouseStageReady(services, true);
  setHouseStageReady(home, true);
  assert.equal(houseStageStatus(), HOUSE_READY);
  unregisterHouseStage(services);              // ServicesStageGate finally unmounts
  assert.equal(houseStageStatus(), HOUSE_READY, "the healthy home stage must survive");
});

test("one failed stage does not condemn a live sibling", () => {
  const a = registerHouseStage();
  const b = registerHouseStage();
  setHouseStageFailed(a, true);
  setHouseStageReady(b, true);
  assert.equal(houseStageStatus(), HOUSE_READY);
});

test("every stage failing reads FAILED", () => {
  const a = registerHouseStage();
  const b = registerHouseStage();
  setHouseStageFailed(a, true);
  setHouseStageFailed(b, true);
  assert.equal(houseStageStatus(), HOUSE_FAILED);
});

test("failure clears readiness — a stage cannot be both", () => {
  const id = registerHouseStage();
  setHouseStageReady(id, true);
  setHouseStageFailed(id, true);
  assert.equal(houseStageStatus(), HOUSE_FAILED);
});

test("a released stage id is inert and cannot resurrect state", () => {
  const id = registerHouseStage();
  unregisterHouseStage(id);
  setHouseStageReady(id, true);
  assert.equal(houseStageStatus(), HOUSE_PENDING, "writes to a dead id must be dropped");
});

test("a static preference is distinct from a real failure", () => {
  const id = registerHouseStage();
  setHouseStageReady(id, true);
  globalThis.window.matchMedia = () => ({ matches: true }); // prefers-reduced-motion
  assert.equal(houseStageStatus(), HOUSE_STATIC);
  globalThis.window.matchMedia = () => ({ matches: false });
});

test("save-data and 2g refuse 3D", () => {
  registerHouseStage();
  globalThis.navigator.connection = { saveData: true };
  assert.equal(houseStageStatus(), HOUSE_STATIC);
  globalThis.navigator.connection = { effectiveType: "2g" };
  assert.equal(houseStageStatus(), HOUSE_STATIC);
});

test("the waiter resolves READY when a pending stage comes good", async () => {
  const id = registerHouseStage();
  setTimeout(() => setHouseStageReady(id, true), 150);
  assert.equal(await whenHouseStageSettled(3000), HOUSE_READY);
});

test("the waiter resolves FAILED when a pending stage gives up", async () => {
  const id = registerHouseStage();
  setTimeout(() => setHouseStageFailed(id, true), 150);
  assert.equal(await whenHouseStageSettled(3000), HOUSE_FAILED);
});

test("the waiter is bounded without turning elapsed time into a failure", async () => {
  registerHouseStage();                        // stays pending on purpose
  const startedAt = Date.now();
  assert.equal(await whenHouseStageSettled(400), HOUSE_PENDING);
  assert.ok(Date.now() - startedAt < 2000, "must give up near its own timeout");
});

test("an already-settled stage resolves without waiting", async () => {
  const id = registerHouseStage();
  setHouseStageReady(id, true);
  const startedAt = Date.now();
  assert.equal(await whenHouseStageSettled(5000), HOUSE_READY);
  assert.ok(Date.now() - startedAt < 120, "a ready stage must not cost the visitor a delay");
});
