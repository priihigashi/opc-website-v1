import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("V6 keeps one decorative cue continuously within the chapter range", () => {
  const cue = read("../components/ScrollDownCueV6.jsx");
  const story = read("../components/StoryV24.jsx");

  assert.match(story, /StoryCueRangeV1/);
  assert.match(story, /<StoryCueRangeV1>[\s\S]*chapters\.map[\s\S]*<\/StoryCueRangeV1>/);
  assert.match(cue, /IntersectionObserver/);
  assert.match(cue, /entry\.isIntersecting/);
  assert.match(cue, /const topInset = 72/);
  assert.match(cue, /window\.innerHeight - topInset - 2/);
  assert.match(cue, /rootMargin: `-\$\{topInset\}px 0px -\$\{bottomInset\}px 0px`/);
  assert.doesNotMatch(cue, /requestAnimationFrame|getBoundingClientRect|querySelector/);
  assert.match(cue, /aria-hidden="true"/);
  assert.match(cue, /pointer-events-none/);
  assert.doesNotMatch(cue, /onClick|<button|role="button"/);
  assert.match(story, /story-cue-v6-layout/);
  assert.match(story, /StoryBannerRailV6/);
});

test("V6 preserves the accepted cue presentation and compact safe lane", () => {
  const cue = read("../components/ScrollDownCueV6.jsx");

  assert.match(cue, />Scroll<\/span>/);
  assert.match(cue, /font-mono/);
  assert.match(cue, /text-\[#EEEDE9\]/);
  assert.match(cue, /z-\[15\]/);
  assert.match(cue, /story-cue-v6-layout/);
  assert.match(cue, /bottom: 3\.5rem/);
  assert.match(cue, /overflow: hidden/);
  assert.match(cue, /max-width: 1279px/);
  assert.match(cue, /bottom: max\(3\.5rem, calc\(env\(safe-area-inset-bottom\) \+ 3rem\)\)/);
  assert.match(cue, /opc-scroll-cue-v6_3\.4s_ease-in-out_infinite/);
  assert.match(cue, /0%, 100% \{ opacity: \.28; \}/);
  assert.doesNotMatch(cue, /translateY/);
  assert.match(cue, /prefers-reduced-motion: reduce/);
});
