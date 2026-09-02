import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("the active app uses the versioned mobile scroll cue composition", () => {
  assert.match(read("../index.js"), /AppV7/);
  assert.match(read("../AppV7.js"), /StoryV16/);
  assert.match(read("../components/StoryV16.jsx"), /ScrollDownCueV2/);
});

test("the cue is anchored below the portrait-phone house and preserves desktop placement", () => {
  const cue = read("../components/ScrollDownCueV2.jsx");
  assert.match(cue, /max-width: 767px/);
  assert.match(cue, /orientation: portrait/);
  assert.match(cue, /top: 76svh/);
  assert.match(cue, /bottom: max\(0\.75rem, env\(safe-area-inset-bottom\)\)/);
  assert.match(cue, /window\.scrollY < window\.innerHeight \* 2/);
  assert.match(cue, /prefers-reduced-motion: reduce/);
});
