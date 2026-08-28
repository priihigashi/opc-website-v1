// Portfolio visual evidence capture.
//
// Reads the LIVE launch dataset — the same file the running site imports — so the
// projects it visits can never drift from the projects that actually ship. It used
// to read portfolioProjectsV3.js and visit a hardcoded "victoria-park-residence",
// a HELD project, which meant it reported success about content we do not publish.
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "qa-evidence");
mkdirSync(OUT, { recursive: true });

const DATASET = join(ROOT, "frontend/src/data/portfolioProjectsLaunchV1.js");
const { PORTFOLIO_PROJECTS } = await import(pathToFileURL(DATASET).href);

if (!Array.isArray(PORTFOLIO_PROJECTS) || PORTFOLIO_PROJECTS.length === 0) {
  console.error("FAIL: launch dataset is empty or unreadable — refusing to report success.");
  process.exit(1);
}

// Every published project gets visited. No hardcoded ids, no sampling.
const IDS = PORTFOLIO_PROJECTS.map((p) => p.id);
console.log(`capturing ${IDS.length} published projects: ${IDS.join(", ")}`);

const HELD = [
  "victoria-park", "victoria-park-residence", "harbor-court", "dockside-full-home-remodel",
  "kinney-shell-build", "miami-new-build", "opa-locka-airport", "pompano-kitchen-remodel",
  "pompano-patio-slab", "rio-vista-concrete", "weston-new-build"
];
const leaked = IDS.filter((id) => HELD.includes(id));
if (leaked.length) {
  console.error(`FAIL: held project(s) present in the launch dataset: ${leaked.join(", ")}`);
  process.exit(1);
}

const b = await chromium.launch();
let softFailures = [];
async function settle(p) {
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 350) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 130));
    }
  });
  // A swallowed timeout here used to let a page with never-loading images pass.
  try {
    await p.waitForFunction(
      () => [...document.querySelectorAll("img")].every((i) => !i.currentSrc || i.complete),
      null, { timeout: 30000 }
    );
  } catch {
    softFailures.push(`images never finished loading on ${p.url()}`);
  }
  // `complete` is true for a BROKEN image too, so naturalWidth is the real test.
  // But only judge images the browser actually STARTED: a lazy image that was
  // never scrolled into view has no currentSrc and is not a defect.
  const broken = await p.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter((i) => i.currentSrc && i.complete && i.naturalWidth === 0)
      .map((i) => i.currentSrc)
  );
  if (broken.length) softFailures.push(`${broken.length} image(s) rendered broken on ${p.url()}: ${broken.slice(0,3).join(", ")}`);
}

let failures = 0;
for (const vp of [{ n: "desktop-1440", width: 1440, height: 900 }, { n: "phone-390", width: 390, height: 844 }]) {
  const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height } });
  const p = await ctx.newPage();
  const broken = [];
  p.on("response", (r) => { if (r.status() >= 400 && /\.(jpg|jpeg|png|webp|avif)(\?|$)/i.test(r.url())) broken.push(`${r.status()} ${r.url()}`); });
  p.on("requestfailed", (r) => broken.push(`REQUEST FAILED ${r.failure()?.errorText || "?"} ${r.url()}`));
  p.on("pageerror", (e) => softFailures.push(`page error: ${String(e).slice(0, 120)}`));

  await p.goto("http://localhost:4321/portfolio/", { waitUntil: "load" });
  await settle(p);
  await p.evaluate(() => {
    const el = document.querySelector('[data-testid="portfolio-grid"]');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 120);
  });
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${OUT}/GRID-${vp.n}.png` });

  for (const id of IDS) {
    const res = await p.goto(`http://localhost:4321/portfolio/${id}/`, { waitUntil: "load" });
    if (res && res.status() >= 400) { console.error(`FAIL: /portfolio/${id}/ returned ${res.status()}`); failures++; }
    await settle(p);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(900);
    // Checked AFTER the app has rendered — `load` fires before React hydrates.
    // A 200 proves nothing on its own: an unknown id also returns the SPA shell
    // with 200 and only then redirects client-side.
    const title = PORTFOLIO_PROJECTS.find((x) => x.id === id).title;
    const landed = await p.evaluate(
      (t) => document.body.textContent.toLowerCase().includes(t.toLowerCase()),
      title                       // textContent: CSS uppercases the visible title
    );
    const url = p.url();
    if (!landed) { console.error(`FAIL: /portfolio/${id}/ did not render "${title}" (ended at ${url})`); failures++; }
    if (!url.includes(id)) { console.error(`FAIL: /portfolio/${id}/ redirected away to ${url}`); failures++; }
    await p.screenshot({ path: `${OUT}/PROJECT-${id}-${vp.n}.png` });
  }
  if (broken.length) { console.error(`FAIL: ${broken.length} image(s) failed on ${vp.n}:`); broken.slice(0, 8).forEach((x) => console.error("   " + x)); failures += broken.length; }
  await ctx.close();
}
await b.close();

if (softFailures.length) { console.error(`FAIL: ${softFailures.length} rendering problem(s):`); softFailures.slice(0, 10).forEach((f) => console.error("   " + f)); failures += softFailures.length; }
if (failures) { console.error(`evidence capture FAILED with ${failures} problem(s)`); process.exit(1); }
console.log(`evidence captured for ${IDS.length} projects across 2 viewports — no broken images, no failed routes`);
