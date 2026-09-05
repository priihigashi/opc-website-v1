import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("the active app preserves the historical layer repair and V6 stays below moving story cards", () => {
  const entry = read("../index.js");
  const layer = read("../styles/storyCueLayerV1.css");
  const rail = read("../components/StoryBannerRailV5.jsx");
  const cue = read("../components/ScrollDownCueV6.jsx");

  assert.match(entry, /AppV19/);
  assert.match(entry, /storyCueLayerV1\.css/);
  assert.match(layer, /opc-story-scroll-cue-v5/);
  assert.match(layer, /z-index: 15 !important/);
  assert.match(cue, /z-\[15\]/);
  assert.match(rail, /z-20/);
});
