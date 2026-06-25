// Validate a LOCAL html file at 3 viewports: scroll-shots + console errors + dead-gap heuristic.
// Run:  NODE_PATH="$PWD/node_modules" node _reference-capture/digitalists/tools/validate.js home-immersive-v2.html
const { chromium } = require('playwright');
const path = require('path');
const file = 'file://' + path.resolve(process.argv[2] || 'home-immersive-v2.html');
const OUT = '/tmp/valshots';
(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const [w,h,name] of [[1440,900,'desktop'],[1262,1932,'portrait'],[390,844,'mobile']]) {
    const page = await browser.newPage({ viewport:{width:w,height:h} });
    const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
    await page.goto(file,{waitUntil:'networkidle'}); await page.waitForTimeout(500);
    const total = await page.evaluate(()=>document.documentElement.scrollHeight);
    const steps=[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0]; let i=0; const dark=[];
    for (const p of steps){
      const y=Math.round((total-h)*p); await page.evaluate(yy=>window.scrollTo(0,yy),y); await page.waitForTimeout(300);
      const buf = await page.screenshot({path:`${OUT}/${name}-${String(i).padStart(2,'0')}.png`});
      // crude "is this frame almost entirely dark/empty?" check via average luminance of a downscale
      const lum = await page.evaluate(()=>{ // sample DOM text coverage as a proxy: how much visible text in viewport
        let chars=0; document.querySelectorAll('h1,h2,h3,p,a,span,img').forEach(el=>{const r=el.getBoundingClientRect(); if(r.bottom>0&&r.top<innerHeight&&r.width>2&&r.height>2){chars+=(el.tagName==='IMG'?40:(el.innerText||'').trim().length);}}); return chars;
      });
      if (lum < 12) dark.push(`${name} @${Math.round(p*100)}%`);
      i++;
    }
    console.log(name, 'screens', (total/h).toFixed(1), '| console/pageerrors:', errs.length?errs.slice(0,4):'none', '| near-empty frames:', dark.length?dark:'none');
    await page.close();
  }
  await browser.close();
  console.log('shots in', OUT, '— montage + eyeball. FAIL if any near-empty frames or console errors.');
})();
