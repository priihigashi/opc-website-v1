import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("the active app uses the versioned mobile scroll cue composition", () => {
  assert.match(read("../index.js"), /AppV10/);
  assert.match(read("../AppV10.js"), /StoryV19/);
  assert.match(read("../components/StoryV19.jsx"), /ScrollDownCueV3/);
});

test("the cue adds a white first-fold label, stays longer, and preserves its placement", () => {
  const cue = read("../components/ScrollDownCueV3.jsx");
  assert.match(cue, /max-width: 767px/);
  assert.match(cue, /orientation: portrait/);
  assert.match(cue, /top: 76svh/);
  assert.match(cue, /bottom: max\(0\.75rem, env\(safe-area-inset-bottom\)\)/);
  assert.match(cue, /CUE_VISIBLE_VIEWPORTS = 2\.35/);
  assert.match(cue, />Scroll<\/span>/);
  assert.match(cue, /font-mono/);
  assert.match(cue, /text-\[#EEEDE9\]/);
  assert.match(cue, /transition-opacity duration-500/);
  assert.match(cue, /prefers-reduced-motion: reduce/);
});
