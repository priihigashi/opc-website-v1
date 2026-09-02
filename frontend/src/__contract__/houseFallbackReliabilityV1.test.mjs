import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("a slow startup is observable but never latched as a hard failure", () => {
  const stage = read("../components/DeferredHouseStageV10.jsx");
  assert.match(stage, /const STARTUP_DELAY_MS = 4000/);
  assert.match(stage, /setStartupDelayed\(true\)/);
  assert.doesNotMatch(stage, /STARTUP_DELAY_MS[\s\S]{0,500}setInteractiveFailed\(true\)/);
  assert.match(stage, /ownFramesRef\.current >= 2/);
  assert.match(stage, /setInteractiveReady\(true\)/);
});

test("the complete phone fallback and honest recovery control are isolated to V10", () => {
  const stage = read("../components/DeferredHouseStageV10.jsx");
  assert.match(stage, /house-static-fallback-mobile-v2\.png/);
  assert.match(stage, /object-contain object-center/);
  assert.match(stage, /interactiveFailed && isHome/);
  assert.match(stage, /Try refreshing for the interactive house/);
  assert.match(stage, /window\.location\.reload\(\)/);
  assert.match(stage, /focus-visible:ring-1/);
  assert.match(stage, /recoveryPromptInHero/);
  assert.match(stage, /onContextLost=\{failInteractive\}/);
  const scene = read("../three/HouseSceneV33.jsx");
  assert.match(scene, /gl\.domElement/);
  assert.match(scene, /addEventListener\("webglcontextlost", handleContextLost, false\)/);
  assert.match(scene, /removeEventListener\("webglcontextlost", handleContextLost, false\)/);
  assert.match(scene, /event\.preventDefault\(\)/);
});

test("the active app keeps V9 as a one-import rollback", () => {
  const app = read("../AppV14.js");
  assert.match(app, /DeferredHouseStageV10/);
  assert.match(read("../components/DeferredHouseStageV9.jsx"), /FIRST_FRAME_FAILSAFE_MS = 4000/);
});
