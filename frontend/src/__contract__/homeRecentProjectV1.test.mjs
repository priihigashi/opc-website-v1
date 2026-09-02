import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("active homepage uses the versioned recent-project story", () => {
  assert.match(read("../index.js"), /AppV9/);
  assert.match(read("../AppV9.js"), /StoryV18/);
});

test("every service card keeps one Recent Project image between link and bullets", () => {
  const story = read("../components/StoryV18.jsx");
  const chapter = read("../components/ChapterV5.jsx");
  assert.equal((story.match(/recentProject:/g) || []).length, 5);
  assert.match(chapter, /portfolio-link[\s\S]*RecentProjectV1[\s\S]*<ul/);
  assert.match(chapter, /Recent Project/);
  assert.match(chapter, /aspect-video/);
  assert.match(chapter, /loading="lazy"/);
});

test("the fixed rail measures and moves the whole card", () => {
  const rail = read("../components/StoryBannerRailV2.jsx");
  assert.match(rail, /ResizeObserver/);
  assert.match(rail, /panelHeight/);
  assert.match(rail, /ChapterCardV2/);
  assert.doesNotMatch(rail, /recentProject.*transform/s);
});
