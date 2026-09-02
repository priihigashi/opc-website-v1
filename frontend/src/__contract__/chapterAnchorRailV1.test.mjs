import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("active story uses the persistent versioned chapter navigation", () => {
  assert.match(read("../index.js"), /AppV12/);
  assert.match(read("../AppV12.js"), /StoryV21/);
  assert.match(read("../components/StoryV21.jsx"), /ChapterRailV2 chapters=\{chapters\}/);
  assert.match(read("../components/StoryV21.jsx"), /StoryBannerRailV4/);
});

test("five semantic anchors support active state and smooth chapter focus", () => {
  const rail = read("../components/ChapterRailV2.jsx");
  for (const num of ["01", "02", "03", "04", "05"]) assert.match(rail, new RegExp(`\\[\\"${num}\\"`));
  assert.match(rail, /<nav ref=\{navRef\} aria-label="Build chapters"/);
  assert.match(rail, /href=\{`#ch-\$\{num\}`\}/);
  assert.match(rail, /aria-current=\{active === index \? "step"/);
  assert.match(rail, /scrollStore\.lenis\.scrollTo\(targetY, \{ duration: 1\.2 \}\)/);
  assert.match(rail, /history\.replaceState/);
  assert.match(rail, /focus-visible:ring/);
  assert.match(rail, /chapter-anchor-\$\{compact \? "compact" : "desktop"\}-\$\{num\}/);
  assert.match(rail, /tabIndex=\{visible \? 0 : -1\}/);
  assert.match(rail, /aria-hidden=\{visible \? undefined : "true"\}/);
});

test("desktop rail and compact dock are mutually exclusive and card travel reserves dock space", () => {
  const nav = read("../components/ChapterRailV2.jsx");
  const banner = read("../components/StoryBannerRailV4.jsx");
  assert.match(nav, /chapter-rail-desktop[\s\S]*xl:block/);
  assert.match(nav, /chapter-dock-compact[\s\S]*xl:hidden/);
  assert.match(banner, /compactDock = window\.innerWidth < 1280/);
  assert.match(banner, /safeBottom = 96/);
  assert.match(banner, /compactDock \? 92 : 8/);
  assert.match(banner, /bottom-24[\s\S]*overflow-hidden/);
  assert.match(banner, /xl:col-start-7 xl:mr-5/);
});

test("AppV9 remains intact as the one-step rollback", () => {
  assert.match(read("../AppV9.js"), /StoryV18/);
  assert.match(read("../components/StoryV18.jsx"), /ChapterV5/);
});
