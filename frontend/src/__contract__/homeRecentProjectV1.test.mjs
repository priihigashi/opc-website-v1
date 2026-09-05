import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("active homepage uses the versioned recent-project story", () => {
  assert.match(read("../index.js"), /AppV18/);
  assert.match(read("../AppV18.js"), /StoryV23/);
});

test("every service card keeps one Recent Project image between link and bullets", () => {
  const story = read("../components/StoryV23.jsx");
  const chapter = read("../components/ChapterV8.jsx");
  assert.equal((story.match(/recentProject:/g) || []).length, 5);
  assert.match(chapter, /portfolio-link[\s\S]*RecentProjectV1[\s\S]*<ul/);
  assert.match(chapter, /Recent Project/);
  assert.match(chapter, /aspect-video/);
  assert.match(chapter, /loading="lazy"/);
  assert.match(story, /bones-framing-v1/);
  assert.match(story, /w: 1600, h: 1200, widths: \[480, 768, 1200, 1600\]/);
  assert.match(story, /phase: "DURING", orientation: "landscape"/);
  assert.match(story, /addition-progress[\s\S]*phase: "DURING"/);
  assert.match(story, /rio-vista-groundwork-safe-v1/);
  assert.doesNotMatch(story, /src: "\/images\/opc\/concrete-driveway-finished-v1"/);
});

test("the fixed rail measures and moves the whole card", () => {
  const rail = read("../components/StoryBannerRailV5.jsx");
  assert.match(rail, /ResizeObserver/);
  assert.match(rail, /panelHeight/);
  assert.match(rail, /ChapterCardV3/);
  assert.doesNotMatch(rail, /recentProject.*transform/s);
});

test("every responsive homepage project image has every advertised derivative", () => {
  const variants = [
    ["bones-framing-v1", [480, 768, 1200, 1600]],
    ["addition-progress", [480, 768, 1200, 1800]],
    ["rio-vista-groundwork-safe-v1", [480, 768, 1200, 1600]],
  ];
  for (const [name, widths] of variants) {
    for (const width of widths) {
      for (const extension of ["avif", "webp", "jpg"]) {
        const asset = new URL(`../../public/images/opc/${name}-${width}w.${extension}`, import.meta.url);
        assert.ok(fs.existsSync(asset), `missing homepage image derivative: ${asset.pathname}`);
        assert.ok(fs.statSync(asset).size > 0, `empty homepage image derivative: ${asset.pathname}`);
      }
    }
  }
});
