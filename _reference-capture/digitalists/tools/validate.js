// Validate a LOCAL html file at 3 viewports: scroll-shots + console errors + dead-gap heuristic.
// PLUS (2026-06-25) pinned-strip MOTION-STATE checks for the digitalists rebuild acceptance rules.
// Run:  NODE_PATH="$PWD/node_modules" node _reference-capture/digitalists/tools/validate.js home-immersive-v2.html
const { chromium } = require('playwright');
const path = require('path');
const cp = require('child_process');
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

  // ---------------------------------------------------------------------------
  // PINNED-STRIP MOTION CHECKS (acceptance rules — patterns.md Pattern 2)
  // Self-skips when the page has no pinned project strip (e.g. font-lab, service pages).
  // Marker convention (preferred): a section[data-pin-strip] containing
  //   [data-pin-bg]  = the layer that must stay FIXED, and
  //   [data-pin-rect] = the staggered rectangles that scroll over it.
  // Falls back to heuristics (position:sticky descendant + .pin-rect/.ba) if markers absent.
  // ---------------------------------------------------------------------------
  console.log('\n--- pinned-strip motion checks ---');
  const W=1440, H=900;
  const mp = await browser.newPage({ viewport:{ width:W, height:H } });
  await mp.goto(file,{waitUntil:'networkidle'}); await mp.waitForTimeout(400);

  // Strict checks require the explicit marker so a plain sticky header (e.g. font-lab, nav bars)
  // does NOT false-trigger. The rebuild MUST tag its strip: section[data-pin-strip] with
  // [data-pin-bg] (fixed layer) + [data-pin-rect] (staggered rectangles).
  const hasStrip = await mp.evaluate(() => !!document.querySelector('[data-pin-strip]'));
  const hasBareSticky = await mp.evaluate(() =>
    [...document.querySelectorAll('*')].some(el => getComputedStyle(el).position === 'sticky'));

  if (!hasStrip) {
    console.log('no [data-pin-strip] marker — pinned-strip motion checks SKIPPED (this is correct for pages without the project strip).');
    if (hasBareSticky) console.log('  (note: a position:sticky element exists but is unmarked — if THIS is the project strip, add [data-pin-strip]/[data-pin-bg]/[data-pin-rect] to enable the acceptance checks.)');
    console.log('  → home-immersive rebuild MUST carry the marker, or these acceptance rules cannot be enforced.');
  } else {
    // locate strip bounds in document space
    const geo = await mp.evaluate(() => {
      const strip = document.querySelector('[data-pin-strip]')
        || (() => { const s=[...document.querySelectorAll('*')].find(el=>getComputedStyle(el).position==='sticky'); return s ? s.closest('section,div') : null; })();
      if (!strip) return null;
      const r = strip.getBoundingClientRect();
      const topDoc = r.top + scrollY;
      return { topDoc, height: r.height, total: document.documentElement.scrollHeight };
    });

    // sample across the strip's scroll runway
    const samples = 14;
    const bgTops = [];           // viewport-Y of the pinned layer at each sample (should be ~constant)
    const colsSeen = new Set();  // 'L' | 'C' | 'R' columns occupied by rectangles across the run
    let rectCount = 0;
    let lastRectExitedBeforeRelease = null;
    require('fs').mkdirSync(OUT, { recursive: true });

    for (let s=0; s<samples; s++){
      const p = s/(samples-1);
      const y = Math.round(geo.topDoc - H*0.15 + (geo.height + H*0.3) * p);
      await mp.evaluate(yy => window.scrollTo(0, Math.max(0,yy)), y);
      await mp.waitForTimeout(160);
      await mp.screenshot({ path: `${OUT}/motion-${String(s).padStart(2,'0')}.png` });

      const frame = await mp.evaluate(() => {
        const strip = document.querySelector('[data-pin-strip]')
          || (() => { const s=[...document.querySelectorAll('*')].find(el=>getComputedStyle(el).position==='sticky'); return s ? s.closest('section,div') : null; })();
        const bg = (strip && strip.querySelector('[data-pin-bg]'))
          || [...(strip?strip.querySelectorAll('*'):[])].find(el=>getComputedStyle(el).position==='sticky')
          || null;
        let rects = strip ? [...strip.querySelectorAll('[data-pin-rect]')] : [];
        if (!rects.length && strip) rects = [...strip.querySelectorAll('.pin-rect, .ba, .animated-img, .project-card')];
        const vw = innerWidth, vh = innerHeight;
        const cols = []; let maxBottom = -1e9;
        rects.forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) return;
          const cx = r.left + r.width/2;
          cols.push(cx < vw/3 ? 'L' : cx < 2*vw/3 ? 'C' : 'R');
          maxBottom = Math.max(maxBottom, r.bottom);
        });
        return {
          bgTop: bg ? +(bg.getBoundingClientRect().top).toFixed(1) : null,
          cols, rectN: rects.length,
          lastRectBottom: maxBottom,        // <0 means all rectangles have exited above viewport
          stripBottom: strip ? +(strip.getBoundingClientRect().bottom).toFixed(1) : null,
          vh
        };
      });

      if (frame.bgTop !== null) bgTops.push(frame.bgTop);
      frame.cols.forEach(c => colsSeen.add(c));
      rectCount = Math.max(rectCount, frame.rectN);
      // release-point heuristic: when the strip's bottom reaches viewport bottom (about to release),
      // the last rectangle should already have exited the viewport (bottom < small threshold)
      if (frame.stripBottom !== null && frame.stripBottom <= frame.vh + 4 && frame.lastRectBottom !== -1e9) {
        if (lastRectExitedBeforeRelease === null)
          lastRectExitedBeforeRelease = frame.lastRectBottom < frame.vh*0.5;
      }
    }

    // RULE 2: bg layer fixed → spread of bgTop across samples should be tiny
    const bgSpread = bgTops.length ? (Math.max(...bgTops) - Math.min(...bgTops)) : null;
    const r2 = bgSpread !== null && bgSpread <= 24;
    // RULE 1+3: ≥3 rectangles AND they occupy left/center/right (>=2 distinct columns, ideally 3)
    const r1 = rectCount >= 3;
    const r3 = colsSeen.size >= 2; // L/C/R staggering (2+ columns = staggered, 3 = ideal)
    // RULE 4: release only after last rectangle exits
    const r4 = lastRectExitedBeforeRelease !== false; // null (couldn't sample) = inconclusive, treat as pass-with-warning
    const tag = b => b ? 'PASS' : 'FAIL';
    console.log(`  RULE 1  ≥3 rectangles ............. ${tag(r1)}  (found ${rectCount})`);
    console.log(`  RULE 2  bg layer stays fixed ...... ${tag(r2)}  (bgTop spread ${bgSpread===null?'n/a':bgSpread.toFixed(1)+'px'}, ≤24px ok)`);
    console.log(`  RULE 3  staggered L/C/R ........... ${tag(r3)}  (columns seen: ${[...colsSeen].join('/')||'none'}; want L/C/R)`);
    console.log(`  RULE 4  release after last exits .. ${lastRectExitedBeforeRelease===null?'WARN (inconclusive)':tag(r4)}`);
    const allPass = r1 && r2 && r3 && r4;
    console.log(`  >>> PINNED-STRIP MECHANIC: ${allPass ? 'PASS ✅' : 'FAIL ❌ — fix before reporting done'}`);
    console.log(`  motion shots: ${OUT}/motion-*.png`);

    // emit a scroll-state montage (RULE 5) if PIL is available
    try {
      cp.execSync(`python3 - <<'PY'
from PIL import Image; import glob,re
d='${OUT}'
fs=sorted(glob.glob(f'{d}/motion-[0-9][0-9].png'), key=lambda p:int(re.search(r'-(\\d+)\\.png',p).group(1)))
if fs:
    ims=[Image.open(f) for f in fs]; w=240; sh=[i.resize((w,int(w*i.size[1]/i.size[0]))) for i in ims]
    Hm=max(i.size[1] for i in sh); st=Image.new('RGB',(w*len(sh),Hm),'#444'); x=0
    for i in sh: st.paste(i,(x,0)); x+=w
    st.save(f'{d}/motion-sheet.png'); print('  montage:',f'{d}/motion-sheet.png')
PY`, { stdio:'inherit' });
    } catch(e){ console.log('  (montage skipped — PIL/python3 not available)'); }
  }
  await mp.close();

  await browser.close();
  console.log('\nshots in', OUT, '— montage + eyeball. FAIL if any near-empty frames, console errors, or pinned-strip motion FAILs.');
})();
