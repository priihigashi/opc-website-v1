// Sticky mobile call bar (backlog M56). Source-scanning, like the other contracts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const src = (...parts) => readFileSync(join(here, "..", ...parts), "utf8");
const bar = src("components", "StickyCallBarV1.jsx");
const app = src("AppV20.js");
const analytics = src("lib", "analytics.js");
const footer = src("components", "FooterV3.jsx");

test("the bar is mounted once in the routed app", () => {
  assert.equal((app.match(/<StickyCallBarV1 \/>/g) || []).length, 1);
});

test("phones only: hidden from md up", () => {
  assert.match(bar, /data-testid="sticky-call-bar"[^>]*md:hidden/s);
});

test("same phone number as the footer", () => {
  const number = footer.match(/href="tel:(\+\d+)"/)[1];
  assert.match(bar, new RegExp(`href="tel:\\${number}"`));
});

test("both buttons report to analytics with an allowlisted placement", () => {
  assert.match(bar, /trackPhoneClick\("sticky-mobile"\)/);
  assert.match(bar, /trackCtaClick\("sticky-mobile"\)/);
  assert.match(analytics, /PHONE_PLACEMENTS = new Set\(\[[^\]]*"sticky-mobile"/);
  assert.match(analytics, /CTA_PLACEMENTS = new Set\(\[[^\]]*"sticky-mobile"/);
});

test("steps aside for the story chapter dock and the contact form", () => {
  assert.match(bar, /\[data-testid="story"\]/);
  assert.match(bar, /#contact/);
  assert.match(bar, /hidden \? "pointer-events-none translate-y-full"/);
});
