import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (path) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");

test("StoryV24 alone uses the short-height card and cue-aware rail versions", () => {
  const story = read("../components/StoryV24.jsx");
  assert.match(story, /ChapterV9/);
  assert.match(story, /StoryBannerRailV6/);
  assert.match(read("../components/StoryV23.jsx"), /ChapterV8/);
  assert.match(read("../components/StoryV23.jsx"), /StoryBannerRailV5/);
});

test("short-height cards preserve all content while reducing only presentation dimensions", () => {
  const card = read("../components/ChapterV9.jsx");
  assert.match(card, /max-height:700px/);
  assert.match(card, /h-\[clamp\(4rem,12vh,5rem\)\]/);
  assert.match(card, /ChapterCardV5/);
  assert.match(card, /\{body\}/);
  assert.match(card, /bullets\.map/);
  assert.match(card, /RecentProjectV2/);
  assert.equal((card.match(/max-height:700px\)\]:object-contain/g) || []).length, 2);
  assert.equal((card.match(/h-full w-full object-cover/g) || []).length, 2);
  assert.doesNotMatch(card, /overflow-y|line-clamp|hidden.*bullet/);
});

test("V6 rail includes the cue lane in both focus placement and readability", () => {
  const rail = read("../components/StoryBannerRailV6.jsx");
  assert.match(rail, /const safeBottom = compactDock \? 96 : 56/);
  assert.match(rail, /window\.innerHeight - safeBottom - panelHeight \/ 2/);
  assert.match(rail, /offsetHeight is integer-rounded/);
  assert.match(rail, /y \+ panelHeight <= window\.innerHeight - safeBottom \+ 1/);
  assert.match(rail, /ChapterCardV5/);
});
