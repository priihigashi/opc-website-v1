import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");  // repo root

const BASE = "http://localhost:4321";
const OUT = join(ROOT, "qa-evidence");
mkdirSync(OUT, { recursive: true });

const js = readFileSync(join(ROOT, "frontend/src/data/portfolioProjectsV3.js"), "utf8");
const PROJECTS = JSON.parse(js.match(/export const PORTFOLIO_PROJECTS = (\[[\s\S]*?\]);\n\nexport const getPortfolioProject/)[1]);
const FILTERS = JSON.parse(js.match(/export const PORTFOLIO_FILTERS = (\[[\s\S]*?\]);/)[1]);

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "phone-390", width: 390, height: 844 },
];

const failures = [];
const fail = (m) => { failures.push(m); console.log("  FAIL " + m); };

async function auditPage(page, url, label) {
  const bad = [];
  page.on("response", (r) => {
    if (r.status() >= 400 && /\.(avif|webp|jpg|jpeg|png|mp4)$/i.test(r.url())) bad.push(`${r.status()} ${r.url()}`);
  });
  const resp = await page.goto(url, { waitUntil: "load", timeout: 60000 });
  if (!resp || resp.status() >= 400) fail(`${label}: route returned ${resp && resp.status()}`);

  // scroll the whole page so lazy images commit
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
    // settle back through the page at human speed so scroll-reveal state is real
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150));
    }
  });
  // wait for every image to actually finish decoding — a fixed sleep races lazy loading
  await page.waitForFunction(
    () => [...document.querySelectorAll("img")].every((i) => i.complete),
    null, { timeout: 45000 },
  ).catch(() => {});
  await page.waitForTimeout(400);
  // Wait for scroll-reveal animations to settle. A card that never reaches full opacity
  // is a blank box; a card caught mid-fade is not. Only the former should fail.
  await page.waitForFunction(
    () => [...document.querySelectorAll('[data-testid^="portfolio-project-"]')]
      .filter((a) => { const r = a.closest("article").getBoundingClientRect();
                       return r.bottom > 0 && r.top < window.innerHeight; })
      .every((a) => +getComputedStyle(a.closest("article")).opacity > 0.99),
    null, { timeout: 15000 },
  ).catch(() => {});

  const report = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")];
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      images: imgs.map((i) => {
        const r = i.getBoundingClientRect();
        const visible = r.bottom > -200 && r.top < window.innerHeight + 200
          && r.right > -200 && r.left < window.innerWidth + 200
          && r.width > 0 && r.height > 0;
        return {
          src: i.currentSrc || i.src, complete: i.complete, nw: i.naturalWidth, nh: i.naturalHeight,
          visible,
          rw: Math.round(r.width), rh: Math.round(r.height), alt: i.alt,
          testid: i.getAttribute("data-testid") || "",
          objectFit: getComputedStyle(i).objectFit,
        };
      }),
      emptyGrid: !!document.querySelector('[data-testid="portfolio-grid-empty"]'),
      // A card that renders but never becomes visible is a blank box to the user.
      // Assertions on image loading alone do not catch this; a screenshot did.
      invisibleCards: [...document.querySelectorAll('[data-testid^="portfolio-project-"]')]
        .map((a) => {
          const art = a.closest("article");
          const r = art.getBoundingClientRect();
          const onScreen = r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
          return { id: a.getAttribute("data-testid"), op: +getComputedStyle(art).opacity, onScreen };
        })
        .filter((c) => c.onScreen && c.op < 0.99),
    };
  });

  if (report.overflow) fail(`${label}: HORIZONTAL OVERFLOW (${report.scrollWidth} > ${report.innerWidth})`);
  for (const c of report.invisibleCards || []) fail(`${label}: INVISIBLE CARD ${c.id} (opacity ${c.op})`);
  for (const im of report.images) {
    if (!im.src) { fail(`${label}: <img> with no src`); continue; }
    // Only a VISIBLE image that failed to decode is a blank slot. An off-screen carousel
    // slide that has not loaded yet is lazy loading working correctly, not a defect.
    if (im.visible && (!im.complete || im.nw === 0)) fail(`${label}: BLANK VISIBLE SLOT ${im.src.split("/").pop()}`);
    if (im.testid === "portfolio-picture" && !im.alt.trim()) fail(`${label}: portfolio image with empty alt`);
    // distortion: rendered aspect must match natural aspect unless object-fit is doing the framing
    if (im.nw && im.rw > 24 && im.objectFit === "fill") {
      const na = im.nw / im.nh, ra = im.rw / im.rh;
      if (Math.abs(na - ra) / na > 0.02) fail(`${label}: DISTORTED ${im.src.split("/").pop()} (${na.toFixed(2)} vs ${ra.toFixed(2)})`);
    }
  }
  for (const b of bad) fail(`${label}: failed asset request ${b}`);
  return report;
}

const browser = await chromium.launch();
let totalImgs = 0;

for (const vp of VIEWPORTS) {
  console.log(`\n=== ${vp.name} ===`);
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  const r = await auditPage(page, `${BASE}/portfolio/`, `portfolio @${vp.name}`);
  console.log(`  /portfolio  images=${r.images.length} overflow=${r.overflow}`);
  if (r.emptyGrid) fail(`portfolio @${vp.name}: default view rendered the EMPTY state`);
  await page.screenshot({ path: `${OUT}/portfolio-${vp.name}.png`, fullPage: vp.name === "desktop-1440" || vp.name === "phone-390" });

  if (vp.name === "desktop-1440" || vp.name === "phone-390") {
    for (const p of PROJECTS) {
      const rr = await auditPage(page, `${BASE}/portfolio/${p.id}/`, `${p.id} @${vp.name}`);
      const gal = rr.images.filter((i) => i.testid === "portfolio-picture");
      totalImgs += gal.length;
      if (gal.length === 0) fail(`${p.id} @${vp.name}: rendered ZERO portfolio images`);
      console.log(`  /${p.id}  gallery-images=${gal.length} (expected ${p.imageCount}) overflow=${rr.overflow}`);
      if (vp.name === "desktop-1440") await page.screenshot({ path: `${OUT}/project-${p.id}.png` });
    }
  }
  await ctx.close();
}

// filter behaviour on desktop
console.log("\n=== filters ===");
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
for (const f of FILTERS) {
  const url = f === "ALL" ? `${BASE}/portfolio/` : `${BASE}/portfolio/?category=${encodeURIComponent(f)}`;
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(500);
  const n = await page.evaluate(() => document.querySelectorAll('[data-testid^="portfolio-project-"]').length);
  const expected = f === "ALL" ? PROJECTS.length : PROJECTS.filter((p) => p.tags.includes(f)).length;
  const mark = n === expected && n > 0 ? "ok" : "FAIL";
  if (mark === "FAIL") fail(`filter ${f}: rendered ${n} cards, expected ${expected}`);
  console.log(`  ${mark.padEnd(4)} ${f.padEnd(22)} cards=${n} expected=${expected}`);
}
await ctx.close();
await browser.close();

console.log(`\ngallery images rendered across all project routes: ${totalImgs}`);
console.log(failures.length ? `\nBROWSER QA FAILURES: ${failures.length}` : "\nBROWSER QA: ALL CHECKS PASSED");
process.exit(failures.length ? 1 : 0);
