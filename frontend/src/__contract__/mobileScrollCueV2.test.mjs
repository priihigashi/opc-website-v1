import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("the active app uses the versioned mobile scroll cue composition", () => {
  assert.match(read("../index.js"), /AppV14/);
  assert.match(read("../AppV14.js"), /StoryV21/);
  assert.match(read("../components/StoryV21.jsx"), /ScrollDownCueV5/);
});

test("the cue adds a white first-fold label, stays longer, and preserves its placement", () => {
  const cue = read("../components/ScrollDownCueV5.jsx");
  assert.match(cue, /max-width: 1279px/);
  assert.match(cue, /bottom: max\(3\.5rem, calc\(env\(safe-area-inset-bottom\) \+ 3rem\)\)/);
  assert.match(cue, /getBoundingClientRect\(\)\.bottom > 0/);
  assert.match(cue, />Scroll<\/span>/);
  assert.match(cue, /font-mono/);
  assert.match(cue, /text-\[#EEEDE9\]/);
  assert.match(cue, /transition-opacity duration-500/);
  assert.match(cue, /opc-scroll-cue-v5_3\.4s_ease-in-out_infinite/);
  assert.match(cue, /0%, 100% \{ opacity: \.28; \}/);
  assert.doesNotMatch(cue, /translateY/);
  assert.match(cue, /prefers-reduced-motion: reduce/);
});
