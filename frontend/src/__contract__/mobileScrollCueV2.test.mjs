import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("the active app uses the versioned mobile scroll cue composition", () => {
  assert.match(read("../index.js"), /AppV16/);
  assert.match(read("../AppV16.js"), /StoryV22/);
  assert.match(read("../components/StoryV22.jsx"), /ScrollDownCueV5/);
});

test("the cue appears only below a safely separated active chapter card", () => {
  const cue = read("../components/ScrollDownCueV5.jsx");
  assert.match(cue, /max-width: 1279px/);
  assert.match(cue, /bottom: max\(3\.5rem, calc\(env\(safe-area-inset-bottom\) \+ 3rem\)\)/);
  assert.match(cue, /story\.getBoundingClientRect\(\)\.bottom > 0/);
  assert.match(cue, /story-banner-rail/);
  assert.match(cue, /panelRect\.bottom <= cueTop - 8/);
  assert.match(cue, /panelRect\.top >= 0/);
  assert.match(cue, />Scroll<\/span>/);
  assert.match(cue, /font-mono/);
  assert.match(cue, /text-\[#EEEDE9\]/);
  assert.match(cue, /transition-opacity duration-300/);
  assert.match(cue, /opc-scroll-cue-v5_3\.4s_ease-in-out_infinite/);
  assert.match(cue, /0%, 100% \{ opacity: \.28; \}/);
  assert.doesNotMatch(cue, /translateY/);
  assert.match(cue, /prefers-reduced-motion: reduce/);
});

test("the mobile story outro removes the reproduced dead-scroll tail while preserving desktop timing", () => {
  const story = read("../components/StoryV22.jsx");
  assert.match(story, /min-h-\[92svh\]/);
  assert.match(story, /min-\[768px\]:min-h-\[120vh\]/);
});

test("the phone hero instruction clears the compact chapter dock", () => {
  const hero = read("../components/HeroV8.jsx");
  assert.match(hero, /pb-20 sm:px-7 sm:pb-16/);
});
