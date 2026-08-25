/**
 * SINGLE SOURCE OF TRUTH for whether the interactive 3D house can be used.
 *
 * WHY THIS FILE EXISTS (T-273): behavioural policy used to be exported from the
 * versioned DeferredHouseStageV* components. ServicesV7 imported it from V2 while
 * AppV3 mounted V5, so the routed Services page consulted a policy two versions
 * stale. V2 marks every phone under 768px as static; V5 deliberately does not
 * (T-262). A phone got interactive 3D from the stage while the page believed it
 * was static-only and navigated away mid-choreography.
 *
 * A NON-VERSIONED module cannot go stale, which is the point. Never move this
 * logic back into a versioned component. src/__contract__ enforces it.
 */

/** Device/preference reasons never to attempt interactive 3D at all. */
export const shouldUseStaticHouse = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || connection?.saveData
    || ["slow-2g", "2g"].includes(connection?.effectiveType);
};

/**
 * THREE states, not two. A boolean cannot express the difference between
 * "the healthy scene has not finished loading yet" and "the scene is gone", and
 * collapsing them makes an early click on a healthy device skip the preview
 * entirely — a regression of T-188/T-262. PENDING must make the caller WAIT.
 */
export const HOUSE_PENDING = "pending";
export const HOUSE_READY = "ready";
export const HOUSE_FAILED = "failed";

/**
 * Per-stage records, keyed by an identity handed out at mount.
 *
 * A single shared object is NOT safe: ServicesStageGate deliberately stays mounted
 * for 800ms after leaving /services (AppV3.js) while Landing mounts a second stage.
 * With one shared record the departing stage's cleanup would reset state that the
 * healthy new stage had already published, and the new stage would not republish
 * because its own value had not changed.
 */
const stages = new Map();
let nextStageId = 0;

export const registerHouseStage = () => {
  const id = `stage-${(nextStageId += 1)}`;
  stages.set(id, { ready: false, failed: false });
  return id;
};
export const unregisterHouseStage = (id) => { stages.delete(id); };
export const setHouseStageReady = (id, ready) => {
  const record = stages.get(id);
  if (record) record.ready = ready;
};
export const setHouseStageFailed = (id, failed) => {
  const record = stages.get(id);
  if (record) { record.failed = failed; if (failed) record.ready = false; }
};

/** For tests only. */
export const _resetHouseStages = () => { stages.clear(); nextStageId = 0; };

/**
 * Aggregate state across every mounted stage.
 * READY   - at least one live stage is rendering.
 * FAILED  - the device refuses 3D, or every mounted stage has failed.
 * PENDING - stages exist but none has confirmed a frame yet. Callers must wait.
 */
export const houseStageStatus = () => {
  if (shouldUseStaticHouse()) return HOUSE_FAILED;
  const records = [...stages.values()];
  if (records.length === 0) return HOUSE_PENDING;
  if (records.some((r) => r.ready && !r.failed)) return HOUSE_READY;
  if (records.every((r) => r.failed)) return HOUSE_FAILED;
  return HOUSE_PENDING;
};

/** True ONLY when a stage is confirmed live. Never treat false as "failed". */
export const canPlayInteractivePreview = () => houseStageStatus() === HOUSE_READY;

/**
 * Wait out a PENDING stage instead of guessing. Resolves READY or FAILED.
 * Bounded by the same failsafe the stage itself uses, so a caller can never hang.
 */
export const whenHouseStageSettled = (timeoutMs = 4500) => new Promise((resolve) => {
  const immediate = houseStageStatus();
  if (immediate !== HOUSE_PENDING) { resolve(immediate); return; }
  const startedAt = performance.now();
  const poll = () => {
    const status = houseStageStatus();
    if (status !== HOUSE_PENDING) { resolve(status); return; }
    if (performance.now() - startedAt >= timeoutMs) { resolve(HOUSE_FAILED); return; }
    window.setTimeout(poll, 90);
  };
  window.setTimeout(poll, 90);
});
