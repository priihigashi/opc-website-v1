// Capture the LIVE digitalists.at (or any url) at many scroll positions + montage.
// Run:  NODE_PATH="$PWD/node_modules" node _reference-capture/digitalists/tools/capture-ref.js [url]
const { chromium } = require('playwright');
const URL = process.argv[2] || 'https://digitalists.at/';
const OUT = '/tmp/refshots';
(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const [w,h,name] of [[1440,900,'desktop'],[1262,1932,'portrait'],[390,844,'mobile']]) {
    const page = await browser.newPage({ viewport:{width:w,height:h} });
    await page.goto(URL, { waitUntil:'domcontentloaded', timeout:45000 });
    await page.waitForTimeout(3000);
    // dismiss Borlabs cookie modal (covers the hero) — try clicks then JS-hide leftovers
    for (const sel of ['a.borlabs-cookie-cmd-accept-all','button.borlabs-cookie-cmd-accept-all','text=/alle akzeptieren/i','text=/akzeptieren/i','text=/accept all/i']) {
      try { await page.click(sel,{timeout:1200}); break; } catch(e){}
    }
    await page.evaluate(()=>document.querySelectorAll('[id*=Borlabs],[class*=borlabs],[id*=CookieBox],[class*=cookie]').forEach(e=>{try{e.style.display='none'}catch(_){}}));
    await page.waitForTimeout(800);
    const total = await page.evaluate(()=>document.documentElement.scrollHeight);
    const steps=[0,0.03,0.06,0.1,0.14,0.18,0.25,0.4,0.55,0.7,0.85,1.0];
    let i=0;
    for (const p of steps){ const y=Math.round((total-h)*p); await page.evaluate(yy=>window.scrollTo(0,yy),y); await page.waitForTimeout(800); await page.screenshot({path:`${OUT}/${name}-${String(i).padStart(2,'0')}.png`}); i++; }
    console.log(name,'scrollHeight',total,'screens',(total/h).toFixed(1));
    await page.close();
  }
  await browser.close();
  console.log('shots in', OUT, '— montage them with a quick PIL script to study spacing + transitions');
})();
