# CODEX BRIEF — mirror digitalists.at SPACE + TRANSITIONS into the OPC homepage prototype

**From:** Claude (handoff after 4 failed attempts). **For:** Codex.
**Skill:** use `website-reference-rebuild` (`~/.codex/skills/website-reference-rebuild/SKILL.md`).
**Target file:** `~/ClaudeWorkspace/opc-website/home-immersive-v2.html` (iterate it, or make `home-immersive-v3.html` for A/B — see §9).

---

## 0) THE JOB IN ONE SENTENCE
Make the OPC homepage prototype **feel like digitalists.at's spacing + scroll transitions** — generous whitespace, big calm type, buttery smooth eased scrolling, smooth section hand-offs — while keeping **100% OPC brand** (our colors, fonts, content). The reference dictates **space + motion ONLY**, never the look.

Priscila's verdict on Claude's attempts: *"you did not get space and transition mirrored — yours is ugly and different."* She is right. The structure was roughly copied; the **spacing rhythm and the transition quality** were not. That is the whole job.

---

## 1) HARD RULES (do not break)
1. **Brand lock (keep OURS):** palette + fonts + real OPC content below in §6. NEVER digitalists' yellow `#F1E500`, never their fonts, never their copy/images.
2. **Verify visually before "done":** render YOUR output in headless Playwright at **3 viewports** (1440×900, 1262×1932, 390×844), screenshot every 10%, montage, and LOOK. Tools provided in §4. **FAIL if any near-empty/dark frame or any console error.** Claude shipped broken versions 3× by NOT looking — do not repeat this.
3. **Versioning:** never overwrite a working base file. `home-immersive-v2.html` is the prototype — fine to iterate. If you want a side-by-side, create `home-immersive-v3.html` and register it in the lab banner.
4. **Don't ship reference assets:** original OPC only. Recreate the *feel*; do not port their WebGL shader or images.

---

## 2) WHAT THE REFERENCE ACTUALLY DOES (measured — not guessed)
Captured live with Playwright (its motion is a minified Three.js bundle, invisible in the HTML — see §3).

**Tech stack (this is the key to the FEEL):**
- **Lenis** (smooth-scroll library) ✅ — THIS is why it feels buttery/premium. Plain native scroll + transforms (what Claude used) feels janky by comparison. **Add Lenis (or equivalent eased smooth-scroll). This is the #1 fix.**
- **GSAP** ✅ — eased, scroll-linked animation.
- **Three.js** ✅ — a `<canvas>` shader in the hero (their yellow wave bg). **Do NOT replicate the shader.** Replace with an OPC full-bleed photo/gradient. The *motion feel* matters, not the shader.

**Layout / spacing facts:**
- Page is **~9800px ≈ 11 screens**, very airy. Each block gets room to breathe.
- **Hero = ~100vh** (`.hero-header`, one screen — NOT a giant pinned runway). Full-bleed. Foreground subject (a person) reads as pushing toward you / parallaxing over the animated bg as Lenis scrolls; small headline + mono label sit LOW with `padding-bottom:30px` on the content.
- Big calm type: hero/section headings ~**64px** (their font PP Neue Montreal), tiny **13px mono** labels (PP Fraktion Mono). Lots of negative space around them.
- Then a **giant project COUNT** ("250+ Projekte") that holds while project thumbnails cycle in on the right — big number, generous margins.
- Smooth **page-transition overlay** divs for case navigation (nice-to-have, not required).

**Reference screenshots are in `screens/`:** `ref-sheet.png`, `hero-ref-sheet.png` (dense hero motion 0→20%), and `mine-sheet.png` = Claude's WRONG attempt (study the contrast — Claude's is cramped + abrupt).

---

## 3) ⚠️ SETUP TIP THAT COST CLAUDE 3 ATTEMPTS
**digitalists' motion is NOT in its HTML** — `curl` shows nothing. It's `wp-content/themes/digitalists/dist/js/main.dist.js` (minified Three.js/GSAP/Lenis). You **must render the live site in a headless browser and scroll-screenshot it** to study spacing + transitions. The cookie modal (Borlabs) covers the hero — dismiss it first. Both behaviors are handled in the provided `capture-ref.js`.

Environment:
- Playwright is **already installed** in the repo: run node as `NODE_PATH="$PWD/node_modules" node <script>` from `~/ClaudeWorkspace/opc-website`.
- macOS has `curl`, not `wget`. Chrome is at `/Applications/Google Chrome.app/...` if you need a fallback.

---

## 4) RUNNABLE TOOLS (provided — just run them)
From `~/ClaudeWorkspace/opc-website`:

**Capture the reference** (desktop+portrait+mobile, dismisses cookie modal, 12 scroll positions):
```
NODE_PATH="$PWD/node_modules" node _reference-capture/digitalists/tools/capture-ref.js
# shots -> /tmp/refshots
```

**Validate your output** (3 viewports, console errors, near-empty-frame heuristic):
```
NODE_PATH="$PWD/node_modules" node _reference-capture/digitalists/tools/validate.js home-immersive-v2.html
# shots -> /tmp/valshots ; prints "near-empty frames" + "console errors" — both must be none
```
Note: on local `file://` runs the only expected console error is `favicon.svg ERR_FILE_NOT_FOUND` (the favicon uses an absolute `/opc-website-v1/` path that only resolves on GitHub Pages) — ignore that one; any OTHER error is a real failure.

**Montage any folder of shots to eyeball spacing/transitions:**
```
python3 - <<'PY'
from PIL import Image; import glob,re,os
d='/tmp/valshots'  # or /tmp/refshots
for name in ['desktop','portrait','mobile']:
    fs=sorted([f for f in glob.glob(f'{d}/{name}-*.png')], key=lambda p:int(re.search(r'-(\d+)\.png',p).group(1)))
    if not fs: continue
    ims=[Image.open(f) for f in fs]; w=300; sh=[i.resize((w,int(w*i.size[1]/i.size[0]))) for i in ims]
    H=max(i.size[1] for i in sh); st=Image.new('RGB',(w*len(sh),H),'#444'); x=0
    for i in sh: st.paste(i,(x,0)); x+=w
    st.save(f'{d}/{name}-sheet.png'); print('wrote',f'{d}/{name}-sheet.png')
PY
```

---

## 5) WHAT'S WRONG WITH `home-immersive-v2.html` RIGHT NOW (diagnose before rebuilding)
Read the file. Concrete problems vs the reference:
- **No smooth scroll** → motion feels janky/abrupt. (Reference uses Lenis.) **Add smooth eased scrolling.**
- **Spacing too tight / mechanical.** Sections are cramped; type isn't given room. Reference is airy — increase vertical padding, let headings breathe, bigger calm type.
- **Transitions are abrupt.** Hero→projects hand-off snaps. Reference eases section-to-section. Use scroll-linked eased transforms, overlap the hand-off so nothing pops.
- **Hero push-in is crude.** The far/near scale parallax is OK in concept but the easing + framing is off. Make it slow, subtle, premium; keep the subject a **house exterior** (NOT a kitchen) — see §7 for which images are real exteriors.
- It currently has GA4 + lab-banner already wired — KEEP those.

---

## 6) OPC BRAND LOCK (this is the part we KEEP — do not drift)
**CSS tokens (copy exactly):**
```
--black:#1b1a13; --obsidian:#141309; --cream:#F0EBE3; --lime:#CBCC10;
--lime-glow:rgba(203,204,16,.4); --walnut:#8B5A2B;
--line:rgba(240,235,227,.12); --muted:rgba(240,235,227,.6);
```
**Fonts (Google, already linked in the file):** `Anton` (display/headlines, UPPERCASE) · `Cormorant Garamond` italic (serif accent, lime, sparing) · `Roboto Mono` (labels/eyebrows) · `Inter` (body).
**Real OPC content:** brothers Matthew (GC) + Michael (PM); 9 services; Broward / Palm Beach / Miami-Dade; license **CBC1263425**; phone (954) 258-6769.
**Reuse the canonical components from `index.html`** (read it): `nav.top` (fixed top bar), the `.ba` before/after slider + its pointer-drag `<script>`, the `.svc` numbered service list (01–09 with hover `.reveal` image), the footer. Match its visual language.

---

## 7) ASSETS — which images are real HOUSE EXTERIORS (use these for the hero, NOT a kitchen)
In `assets/img/mike/new-construction/`:
- `122-dockside-cir-IMG_6718.jpeg` — modern angular **roofline exterior** (best hero subject)
- `122-dockside-cir-IMG_6701.jpeg` — exterior under construction (block/framing)
- `122-dockside-cir-IMG_7200.jpeg` — pool / covered patio exterior
Before/after pairs (for the projects section) in `assets/img/gallery/`: `newbuild-a/-b`, `remodel-a/-b`, `kitchenbath-a/-b` (note `newbuild-b.jpg` is actually a KITCHEN interior — don't use it as the exterior hero).
If a better finished-exterior photo is needed, ask Priscila — she may drop one.

---

## 8) SUGGESTED BUILD ORDER
1. Run `capture-ref.js`, montage `/tmp/refshots`, and STUDY spacing + transitions (compare to `screens/mine-sheet.png`).
2. Add **Lenis smooth-scroll** (CDN or npm) wired to a rAF loop — this alone transforms the feel. Keep `prefers-reduced-motion` off-path.
3. Rebuild the **hero**: full-bleed, ~100vh-ish, subject = house exterior with a slow eased push-in/parallax over a held-back bg; headline + mono label sit low with generous space; small lime accent only.
4. Add an **airy hand-off** into a **big project COUNT** ("120+ PROJECTS") that holds while OPC before/after cards (the `.ba` component) ease in — mirror the reference's generous margins + smooth reveal.
5. Keep services teaser + CTA + footer, but give them the reference's breathing room.
6. **Validate** with `validate.js` at all 3 viewports. Fix every near-empty frame + console error. Montage and eyeball against the reference.
7. Tune easing/spacing until it reads calm + premium like the reference.

---

## 9) FINISH (auto-rules + tracking)
- If you edited `home-immersive-v2.html`: bump nothing extra. If you created `home-immersive-v3.html`: add it to `assets/js/lab-banner.js` (HOME DIRECTIONS group) and **bump the `?v=` cache-bust on EVERY html** (currently `?v=19` → `?v=20`) — there's 60+ files; do it with a sed/python loop.
- Update `OPC_WEBSITE_STATE.md` Activity Log + the tracker `🧪 Prototypes` tab (sheet `1q0_v9qYDXKURo59xoS-WISFdHbZWIdc9ukdCDbdDaUQ`).
- Commit + push (GitHub Pages auto-deploys). Per the audit-on-done rule, add a paired 🔍 AUDIT row.
- Report honestly: what captured, what's a feel-alike vs exact, any gaps.

## 9.5) 🔒 MISSING-MECHANIC ADDENDUM — PINNED PROJECT STRIP (BINDING, added 2026-06-25)
**Read this BEFORE you build. The previous prototype was rejected because it missed this exact mechanic.** Priscila's words: the projects section is NOT "cards with parallax." It is a **pinned background strip** where the section/background holds still while **staggered rectangle project images scroll over it**, and the page only releases once the **last rectangle has passed**. The old `home-immersive-v2.html` only half-got it (sticky background yes; true flowing staggered overlay stack no — it used three centered full-screen card stages, which is WRONG).

These are **acceptance requirements, not interpretation** (mirrored in `patterns.md` Pattern 2 + enforced by `tools/validate.js`):

**Pinned Project Strip** (rules 4–6 refined 2026-06-26 per Priscila's review of v3)
- Use a TALL scroll section (≥ ~300vh runway).
- Pin the background/content layer — its on-screen position must NOT move while the strip is active. **Activate a `position:fixed` pin layer ONLY while the strip fully covers the viewport (`strip.top<=0 && strip.bottom>=vh`), never the instant it peeks in** — otherwise it overlays the hero and breaks when the lab banner is hidden (real bug we hit).
- Let project rectangles move independently OVER it, kept in the **CENTER→RIGHT band** (first card on the right). The far-LEFT is the fixed "Before & After" headline + count — cards must NOT rest over it (transit pass-over is fine).
- **The LAST card does NOT fly off — it SETTLES fully visible (resting, with space, beside the text) and HOLDS** while the count finishes; the strip releases only after it's fully revealed, then hands off to the next section. Earlier cards exit upward.
- **The count animates AUTOMATICALLY** (timed ~1.5s count-up the first time the strip is revealed) — NOT scrubbed by scroll.

**Hero Foreground Object**
- Do NOT use an unfinished-construction image for the hero. Best = a **finished exterior** photo.
- Build two layers: (a) a background plate with the house/object removed/softened/inpainted, (b) a transparent foreground cutout of the house/object.
- Animate the foreground subtly on scroll so it separates from the background (the digitalists girl/train-station effect). Interior can work, but exterior is simpler + more OPC-clear.
- Asset pipeline: `/nano-banana-2` (inpaint/remove + background plate) + background-removal for the cutout PNG + `/photo-edit` (enhance). Source from `assets/img/mike/new-construction/` exteriors.

**Color/Contrast Lock**
- Current contrast choices are NOT approved. Pause before styling and pick a calmer/luxury palette that still feels OPC — not harsh or random. (This is the same open decision as the font/palette pick — resolve it via `prototypes/font-lab.html` FIRST. Palette A "Light Architectural" is the front-runner.)

**Better Validation (motion states, not vibes)**
- `validate.js` now adds motion checks: sticky-layer Y fixed across the scroll range, ≥3 rectangles with distinct left/center/right X-offsets, release-point check (section doesn't advance until the last rectangle exits), and a scroll-state montage. Blank-frame + console-error checks alone are NOT enough.

**Comparison method to use (per Codex):** capture the reference at fixed viewport sizes + fixed scroll percentages → make a scroll montage (not single shots) → inspect DOM class names + search the bundled JS for those selectors → build a per-section "mechanic map" (what is pinned / what moves / what triggers / when it starts / when it releases / what content changes). Rebuild the RELATIONSHIP (same scroll logic, pacing, layer behavior) with original OPC images/colors/copy — validate by comparing motion states.

## 10) ACCEPTANCE CHECKLIST
- [ ] Smooth eased scrolling (Lenis-style) — not janky native scroll.
- [ ] Hero: full-bleed, house exterior, slow premium push-in, headline overlaid low, generous space.
- [ ] **Hero foreground-object separation** (§9.5): 2-layer plate + cutout, subtle scroll parallax — NOT a flat single photo, NOT unfinished construction.
- [ ] **Pinned project strip (§9.5)** passes ALL 5 rules: tall runway · fixed bg layer · ≥3 left/center/right staggered rectangles · release only after last rectangle exits · NO centered full-screen card stages.
- [ ] Section spacing/whitespace is airy like the reference (not cramped, no huge dead gaps).
- [ ] Hand-offs between sections ease smoothly (nothing snaps/pops).
- [ ] Big project COUNT + before/after, mirroring reference spacing.
- [ ] **Color/contrast palette chosen + approved BEFORE styling** (§9.5) — front-runner Palette A from `font-lab.html`.
- [ ] OPC brand only (tokens + fonts + real content). Zero digitalists yellow/assets.
- [ ] Verified at 1440×900 + 1262×1932 + 390×844: **no near-empty frames, no console errors, motion-state checks PASS** (validate.js clean).
- [ ] Lab-banner/cache-bust/tracker/STATE.md/commit done.

## FILE MAP
- Target: `~/ClaudeWorkspace/opc-website/home-immersive-v2.html`
- Brand/components: `~/ClaudeWorkspace/opc-website/index.html`
- This brief + reference shots + tools + patterns.md: `~/ClaudeWorkspace/opc-website/_reference-capture/digitalists/`
- Skill: `~/.codex/skills/website-reference-rebuild/SKILL.md`
- State/rules: `~/ClaudeWorkspace/opc-website/OPC_WEBSITE_STATE.md`
- Playwright: repo `node_modules` (`NODE_PATH="$PWD/node_modules"`)

---
## ✅ RESOLVED FEEDBACK FROM PRISCILA — applied to `home-immersive-v3.html` (2026-06-26)
Two fixes on the live v3 — **both DONE** (commit folds into the v3 line). v3 section order is now hero(dark) → pin-strip/projects(light) → svc-teaser(**DARK**) → cta(dark) → footer(dark). Resolution notes are inline below each item.

**FB-1 ✅ DONE — 3rd strip (SERVICES teaser) is now DARK.** `.svc-teaser` → `background:#14130c`, cream text, lime accents, full-bleed via a `.svc-inner` max-width wrapper.
**FB-2 ✅ DONE — nav now adapts per-section for ALL links.** Sections tagged `data-nav="dark|light"`; a scroll detector sets `nav[data-navtheme]`; CSS uses `[data-navtheme] ... !important` (higher specificity than opc-shared's `nav.top .links a{...!important}`) so brand + every plain link + both dropdown toggles flip. Verified: "About" renders `rgb(10,10,10)` over the light strip, `rgb(240,235,227)` over dark sections.

<details><summary>original feedback (kept for context)</summary>

**FB-1 — 3rd strip (SERVICES teaser) must be DARK, not light.**
The `.svc-teaser` section (the "Nine services… New Construction / Renovation / Kitchens…" job-type list) is currently on the light `--bg` (cream). Make it DARK like the hero/CTA (dark bg, `--cream` text, lime accents). Priscila: *"the third strip, the one that has the job type, should be dark not light."* Keep the projects pin-strip as-is unless it reads better dark too — but the explicit ask is the services strip.

**FB-2 — Nav link colors must adapt to the section underneath (ALL links, not just the dropdowns).**
Bug: over the light strips, only `Services ▾` and `Areas ▾` (`.nav-drop-t`) turn dark; the plain `<a>` links (Home, Our Work, About, How We Work, Contact) stay `--cream`/white → invisible on cream. The current logic only toggles `nav.solid` past the hero (IntersectionObserver on hero only) and something is overriding the `nav.top.solid .links a` color for the anchors. 
Required: nav text adapts PER SECTION — **dark (`--ink`) over light sections, light (`--cream`) over dark sections** — applied uniformly to brand + every link + both dropdown toggles. Recommended robust approach: tag each section `data-nav="dark|light"` and an IntersectionObserver sets `nav` theme from whichever section is under the bar (not just hero). Priscila: *"black when on top of white/light, white when on top of dark… only Services and Areas are changing color, the others stay white."*

Validate with `tools/validate.js` + eyeball at desktop/portrait/mobile: nav legible over EVERY section; 3rd strip dark.

</details>
