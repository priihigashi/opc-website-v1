import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("the active app uses the reversible desktop clearance chain", () => {
  assert.match(read("../index.js"), /AppV15/);
  assert.match(read("../AppV15.js"), /StoryV22/);
  assert.match(read("../AppV15.js"), /DeferredHouseStageV11/);
  assert.match(read("../components/DeferredHouseStageV11.jsx"), /HouseSceneV34/);
  assert.match(read("../three/HouseSceneV34.jsx"), /HouseModelV31/);
});

test("animated and reduced-motion cards share the measured wide-desktop width and right lane", () => {
  for (const file of ["../components/StoryBannerRailV5.jsx", "../components/ChapterV8.jsx"]) {
    const source = read(file);
    assert.match(source, /xl:w-\[clamp\(340px,27vw,410px\)\]/);
    assert.match(source, /xl:col-start-7 xl:mr-2/);
    assert.match(source, /min-\[1366px\]:-mr-4/);
    assert.match(source, /min-\[1440px\]:-mr-16/);
  }
});

test("the rail and house correction activate only at 1280px and preserve earlier versions", () => {
  assert.match(read("../components/ChapterRailV3.jsx"), /right-3.*w-\[114px\].*xl:block/);
  const model = read("../three/HouseModelV31.jsx");
  assert.match(model, /desktopXBias=\{-0\.16\}/);
  assert.match(model, /desktopXBiasBreakpoint=\{1280\}/);
  assert.match(model, /desktopChapterScale=\{0\.96\}/);
  assert.match(model, /desktopPositionFactor=\{1\.12\}/);
  const engine = read("../three/HouseModel.jsx");
  assert.match(engine, /desktopXBias = 0/);
  assert.match(engine, /window\.innerWidth >= desktopXBiasBreakpoint/);
  assert.match(engine, /const chapterWindow = seg\(p, 0\.08, 0\.14\)/);
  assert.match(engine, /viewportPositionFactor/);
  assert.match(read("../AppV14.js"), /StoryV21/);
});
