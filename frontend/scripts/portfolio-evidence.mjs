import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url"; import { dirname, join } from "path";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "qa-evidence"); mkdirSync(OUT, { recursive: true });
const js = readFileSync(join(ROOT, "frontend/src/data/portfolioProjectsV3.js"), "utf8");
const P = JSON.parse(js.match(/export const PORTFOLIO_PROJECTS = (\[[\s\S]*?\]);\n\nexport const getPortfolioProject/)[1]);
const b = await chromium.launch();

async function settle(p) {
  await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=350){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,130));} });
  await p.waitForFunction(() => [...document.querySelectorAll("img")].every(i=>i.complete), null, {timeout:30000}).catch(()=>{});
}
for (const vp of [{n:"desktop-1440",width:1440,height:900},{n:"phone-390",width:390,height:844}]) {
  const ctx = await b.newContext({ viewport:{width:vp.width,height:vp.height} });
  const p = await ctx.newPage();
  await p.goto("http://localhost:4321/portfolio/", { waitUntil:"load" });
  await settle(p);
  await p.evaluate(()=>{ const el=document.querySelector('[data-testid="portfolio-grid"]');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 120); });
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${OUT}/GRID-${vp.n}.png` });          // viewport, cards revealed
  // one representative project, and one portrait-heavy one
  for (const id of ["salon-buildout","victoria-park-residence"]) {
    await p.goto(`http://localhost:4321/portfolio/${id}/`, { waitUntil:"load" });
    await settle(p); await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(900);
    await p.screenshot({ path: `${OUT}/PROJECT-${id}-${vp.n}.png` });
  }
  await ctx.close();
}
await b.close(); console.log("evidence captured");
