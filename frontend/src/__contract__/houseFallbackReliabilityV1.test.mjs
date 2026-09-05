import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("a slow startup is observable but never latched as a hard failure", () => {
  const stage = read("../components/DeferredHouseStageV12.jsx");
  assert.match(stage, /const STARTUP_DELAY_MS = 5000/);
  assert.match(stage, /setStartupDelayed\(true\)/);
  assert.doesNotMatch(stage, /STARTUP_DELAY_MS[\s\S]{0,500}setInteractiveFailed\(true\)/);
  assert.match(stage, /ownFramesRef\.current >= 2/);
  assert.match(stage, /setInteractiveReady\(true\)/);
});

test("pending startup uses the discreet loader and real failure keeps contained recovery", () => {
  const stage = read("../components/DeferredHouseStageV12.jsx");
  assert.match(stage, /HouseLoadingIndicatorV1/);
  assert.match(stage, /!interactiveReady && !showLightweight/);
  assert.match(stage, /house-static-fallback-mobile-v2\.png/);
  assert.match(stage, /object-contain/);
  assert.doesNotMatch(stage, /showStatic = !interactiveReady/);
  assert.match(stage, /failed && isHome && showRecovery/);
  assert.match(stage, /Try refreshing for the interactive house/);
  assert.match(stage, /window\.location\.reload\(\)/);
  assert.match(stage, /focus-visible:ring-1/);
  assert.match(stage, /recoveryPromptInHero/);
  assert.match(stage, /onContextLost=\{failInteractive\}/);
  const scene = read("../three/HouseSceneV34.jsx");
  assert.match(scene, /gl\.domElement/);
  assert.match(scene, /addEventListener\("webglcontextlost", handleContextLost, false\)/);
  assert.match(scene, /removeEventListener\("webglcontextlost", handleContextLost, false\)/);
  assert.match(scene, /event\.preventDefault\(\)/);
});

test("the active app retains prior visual files while exact rollback stays commit-level", () => {
  const app = read("../AppV18.js");
  assert.match(app, /DeferredHouseStageV12/);
  assert.match(read("../AppV15.js"), /DeferredHouseStageV11/);
  assert.match(read("../components/DeferredHouseStageV10.jsx"), /HouseSceneV33/);
  assert.match(read("../components/DeferredHouseStageV9.jsx"), /FIRST_FRAME_FAILSAFE_MS = 4000/);
  assert.match(read("../index.js"), /exact Candidate 2 rollback means redeploying its complete frozen commit/);
});
