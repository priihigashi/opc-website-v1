import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("the portfolio hero selects the mobile encode directly and retries blocked autoplay", () => {
  const page = read("../pages/PortfolioV10.jsx");
  assert.match(page, /mobile \? PORTFOLIO_HERO_VIDEO_MOBILE : PORTFOLIO_HERO_VIDEO/);
  assert.match(page, /video\.muted = true/);
  assert.match(page, /video\.defaultMuted = true/);
  assert.match(page, /video\.playsInline = true/);
  assert.match(page, /video\.play\(\)/);
  assert.match(page, /video\.currentTime < 0\.1/);
  assert.match(page, /data-testid="portfolio-video-play"/);
  assert.match(page, /if \(reduced\) return null/);
  assert.match(page, /preload="auto"/);
});

test("the mobile and desktop encodes and poster remain present", () => {
  const media = read("../pages/portfolioHeroMedia.js");
  for (const asset of [
    "../../public/video/portfolio-hero-intro-v5-mobile.mp4",
    "../../public/video/portfolio-hero-intro-v5.mp4",
    "../../public/video/portfolio-hero-poster-v2.jpg",
  ]) assert.ok(readFileSync(new URL(asset, import.meta.url)).length > 0, `missing ${asset}`);
  assert.match(media, /portfolio-hero-intro-v5-mobile\.mp4/);
});
