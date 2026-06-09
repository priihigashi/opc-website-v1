# OPC Website — Project State

**This file is the single source of truth for this project. Any Claude session opening this folder MUST read this first.**

- **Repo:** https://github.com/priihigashi/opc-website-v1
- **Live:** https://priihigashi.github.io/opc-website-v1/
- **Local:** `~/ClaudeWorkspace/opc-website/`
- **Tracker (sheet):** https://docs.google.com/spreadsheets/d/1AKwzJlO8gRiTE_PL5R8jnBzOe8aDhVy-PCaZY7QWIOI/edit
- **Drive mirror of this doc:** https://docs.google.com/document/d/1j2Y1z6rYRBS9fwE1Uk4seMvUNk9jFMZA-SZDAuCSZ2E/edit (ID `1j2Y1z6rYRBS9fwE1Uk4seMvUNk9jFMZA-SZDAuCSZ2E`)
- **Skill:** `/opc-website` (loader skill — reads this file on activation)

Last updated: **2026-06-09**

---

## 🚨 NEXT CHAT — READ THIS FIRST (REWORK NEEDED)

**Misread captured end-of-session 2026-06-09.** Priscila gave us Ricardo Oliva Alonso CodePens (`yLOpNdZ`, `KKbWGNZ`, `LYxMWQN`) that contain **actual rendered 3D objects**. Previous Claude treated them as vibe references and built line-style 3D from scratch. The correct approach was to **fork the pens and recolor to OPC palette**.

CodePen Cloudflare blocks bot fetch — that's why the misread happened. Next chat needs Priscila to **export each pen** (CodePen → ⚙️ → Export ZIP) OR paste the JS/CSS/HTML manually.

**REWORK SCOPE:**
- 🔴 **#10 NewBuild** → fork `yLOpNdZ` → recolor to OPC palette → drop into existing service-page scaffold
- 🔴 **#11 Kitchen** → fork `LYxMWQN` → recolor to OPC palette → drop into existing service-page scaffold
- 🟡 **Future Renovation page** → fork `KKbWGNZ` → recolor to OPC palette

**NOT affected — keep these:**
- ✅ #15 Bath Waterproof Section (CSS layered wall — no Ricardo pen for bath)
- ✅ #17 Stucco Layer Section (CSS layered wall — no Ricardo pen for stucco)
- ✅ #16 Floor Plan → 3D Reveal (Plan→3D approved in memo, not a Ricardo pen reference)

---

## 🎯 CURRENT FOCUS

- Lab phase — prototypes in `/prototypes/`, all `noindex,nofollow`. Production pages (root, services/*) are also live but not the final design.
- Settling on a hero / cursor / 3D vocabulary by comparing prototypes side-by-side (LAB banner on every page lets you jump between them).
- **Open right now:** rework #10 + #11 using actual Ricardo 3D objects (see REWORK section above), then review Bathroom Waterproofing Wall Section (15) and Floor Plan → 3D Reveal (16) for promote-to-production decision.

---

## ✅ PROTOTYPES BUILT

(also tracked in Tracker → Prototypes tab — keep both in sync)

| # | Name | Status | URL |
|---|------|--------|-----|
| 01 | Glass Components | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/liquid-glass-components.html) |
| 02 | Blueprint→Photo Transform | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/blueprint-property-transform.html) |
| 03 | 3D Wireframe House (Aura) | ✅ REBUILT 2026-06-09 | [link](https://priihigashi.github.io/opc-website-v1/prototypes/wireframe-house-aura.html) |
| 04 | Project Gallery Cube | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/project-gallery-cube.html) |
| 05 | Hover Gallery Tiles | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/hover-gallery-tiles.html) |
| 06 | Combined Vision (LUMEN) | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/combined-lumen-vision.html) |
| 07 | Combined Gold Glow | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/combined-gold-glow.html) |
| 08 | Concrete Rotating Bars (service tpl) | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/concrete-rotating-bars.html) |
| 09 | Bathroom Plumbing Stack (service tpl) | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/bathroom-plumbing-stack.html) |
| 10 | **New Construction · Sequential Assembly** (BRAND SIGNATURE) | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/new-construction-assembly.html) |
| 11 | Kitchen · Exploded Cabinet (service tpl) | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/kitchen-exploded-cabinet.html) |
| 12 | Contact Atmosphere | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/contact-atmosphere.html) |
| 13 | Project Gallery Split | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/project-gallery-split.html) |
| 14 | Background Swap Component | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/background-swap.html) |
| 15 | Bathroom · Waterproofing Wall Section | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/bathroom-waterproofing-section.html) |
| 16 | Floor Plan → 3D Reveal | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/floor-plan-3d-reveal.html) |

Lab banner cache-bust: **?v=9** (bump to ?v=10 on next page added)

---

## 🎨 DESIGN DECISIONS — LOCKED

- **Palette:** obsidian `#0A0A0A` / cream `#F0EBE3` / lime `#CBCC10` + walnut `#8B5A2B`
- **Typography:** Anton (display) · Cormorant Garamond italic (serif accent) · Roboto Mono (labels) · Inter (body)
- **3D pages:** all prototypes use Three.js loaded via importmap (CDN)
- **Cursor orb:** scoped to `combined-lumen-vision` + `combined-gold-glow` ONLY (too heavy combined with Three.js + bloom)
- **Bloom:** must NOT wash out the subject. Anchor params for reference: bathroom-plumbing-stack uses `UnrealBloomPass(0.7, 0.6, 0.4)` with `toneMappingExposure = 1.05` — that's the upper limit that still reads
- **Bathroom 3D replacement:** approved direction is **Tile + Waterproofing Wall Section** — framing → cement board → waterproofing membrane → mortar → tile → grout, with labels and real bath context photos (`IMG_6595`, `IMG_6425`).
- **Wireframe House Aura replacement:** approved direction is **Floor Plan → 3D Reveal** — top-down architectural plan first, then walls rise, camera tilts to isometric, roof/materials appear.
- **Service page 3D recommendations (priority order):**
  1. New Build — sequential assembly (footing → slab → framing → roof) — *brand signature*
  2. Bathroom — tile + waterproofing wall section — *shows invisible premium work under the finish* — ✅ APPROVED TO BUILD
  3. Stucco — 4-layer wall slice (lath → scratch → brown → finish) — *defends pricing*
  4. Kitchen — exploded cabinet
  5. Renovation — house cross-section split
  6. Additions — flying-in addition box
  7. Outdoor Living — pergola assembly
  8. Decks & Patios — paver pattern dropping
  9. Concrete — rebar + slab — ✅ BUILT

---

## 📐 ACTIVE AUTO-RULES (enforced by `/opc-website` skill)

These fire automatically when triggered. Priscila should NOT have to ask:

1. **New prototype HTML page created** → (a) add `<script src="../assets/js/lab-banner.js?v=N">` (b) add nav entry to `lab-banner.js` quick-links (c) bump cache-bust `?v=N+1` on ALL pages (d) add row to Tracker → Prototypes tab (e) append to this file
2. **CodePen / inspo link dropped** → save row to Tracker → Inspiration tab + add to this file under Inspiration. If no description, fetch title + flag "needs manual view"
3. **Priscila says "I don't like X" / "kill X" / "remove X" / "not using this anymore"** → append row to Tracker → Decisions Log + update this file's relevant section. Don't act on the removal until confirmed.
4. **After every report-back to Priscila** → append a dated bullet to "Activity Log" at bottom of this file
5. **Session start in this project** → READ this file FIRST + summarize Current Focus + list any 🔴 NEEDS items before doing anything else

---

## 💡 INSPIRATION SAVED

(also tracked in Tracker → Inspiration tab)

| Date | Source | Link | Note |
|------|--------|------|------|
| 2026-06-09 | CodePen — Justin Ross Rythorian | [GgqZzNa](https://codepen.io/Justin-Ross-Rythorian/pen/GgqZzNa) | "could we use this for FAQ? maybe" |
| 2026-06-09 | CodePen — Justin Ross Rythorian | [MYegaEO](https://codepen.io/Justin-Ross-Rythorian/pen/MYegaEO) | "nice glow" |
| 2026-06-09 | CodePen — Himanshu Santani | [gbaMbOR](https://codepen.io/Himanshu-Santani-the-bold/pen/gbaMbOR) | "not sure how we would use it" — ⛔ rejected for OPC production; keep archived |
| 2026-06-09 | CodePen — jerora98 | [zxoBxWg](https://codepen.io/jerora98/pen/zxoBxWg) | "this one has the glow in the back" — diffused gradient ref for combined-lumen-vision lime glow tuning |
| 2026-06-09 | CodePen — David DeSandro | [OJLYxEB](https://codepen.io/desandro/pen/OJLYxEB) | "maybe use it" — desandro = 3D / gallery effects (isotope/flickity author) |
| 2026-06-09 | CodePen — Ricardo Oliva Alonso | [yLOpNdZ](https://codepen.io/ricardoolivaalonso/pen/yLOpNdZ) | "maybe for 3D of the NEW BUILD page — need to adjust color" — **NEW BUILD candidate** |
| 2026-06-09 | CodePen — fbuireu | [XBGZdd](https://codepen.io/fbuireu/pen/XBGZdd) | "bottom of page before last black strip, same color, 2-3 elements max, maybe Contact" — **CONTACT/FOOTER candidate** |
| 2026-06-09 | CodePen — Nidal95 | [qENQPBp](https://codepen.io/Nidal95/pen/qENQPBp) | "gallery option — may add to Higashi too" — **GALLERY candidate (OPC + maybe Higashi)** |
| 2026-06-09 | CodePen — osmosupply | [wBGYEMd](https://codepen.io/osmosupply/pen/wBGYEMd) | "save as inspo" — defer; loading/microinteraction only |
| 2026-06-09 | CodePen — osmosupply | [RNaeYqp](https://codepen.io/osmosupply/pen/RNaeYqp) | "4 squares, click → image becomes background" — **BG-SWAP candidate (Hero/Services)** |
| 2026-06-09 | CodePen — hernandack | [GgjRbMq](https://codepen.io/hernandack/pen/GgjRbMq) | "not sure if I will use this but save it" — ⛔ rejected for OPC production; keep archived |
| 2026-06-09 | CodePen — Ricardo Oliva Alonso | [KKbWGNZ](https://codepen.io/ricardoolivaalonso/pen/KKbWGNZ) | "another Ricardo 3D — idk where to use it" — ✅ assigned to Renovation / interior sectional 3D |
| 2026-06-09 | CodePen — Ricardo Oliva Alonso | [LYxMWQN](https://codepen.io/ricardoolivaalonso/pen/LYxMWQN) | "kitchen 3D — may need better colors" — **KITCHEN candidate** |
| 2026-06-09 | russell-henderson.com | (reference) | Neon-tube orbital ring halo intensity — bloom inspiration |
| 2026-06-09 | LUMEN | (reference) | Cursor-follow orb — implemented on 06 + 07 |

### ✅ Direction decisions from visual memo
**Visual Direction Memo (saved 2026-06-09):** https://docs.google.com/document/d/1-ltwpYHCW9DX3PPB8Adnbe_hE8gKqB4VI3CnPHVeNsI/edit

- **Bathroom:** approved **A — Tile + Waterproofing Wall Section**. Do not keep plumbing-stack as final direction.
- **Wireframe House Aura:** approved **A — Floor Plan → 3D Reveal**. Rebuild as plan-first line-art, not generic solid house.
- **CodePen rejects:** `gbaMbOR` and `GgjRbMq` are rejected for OPC production but remain archived in Inspiration.
- **KKbWGNZ:** assigned to Renovation / interior sectional 3D, not Stucco.

### ✅ Resolved this session
- Bathroom lime ring — radius 2.1→3.8 (commit `9081541`)
- Concrete lime ring — radius 0.72→2.2 + moved to scene (commit `9081541`)

Drive Inspiration folder: `1ae7n4VwSZbu0_nt6nUX5WeLINGqYJ-CZ`

---

## 🚧 PENDING / BLOCKED

- ✅ **`wireframe-house-aura` REBUILT** (commit `61586b3`) — added solid 3D house geometry (walls cream / roof dark walnut / door walnut / lime accent strip / glass windows), crossfade wireframe→solid at scroll 40-65%, bloom dialed back (strength 0.55 / threshold 0.55 / exposure 0.95), thinner rings + smaller stars, flat photo overlay disabled. Test live + tune if needed.
- ⚠️ **Cursor orb perf** — on 3D-heavy pages, mix-blend-difference + lerp creates repaint storm. Already scoped OFF on 3D pages, but if cursor added elsewhere needs throttling.
- ⚠️ **AI image gen** ("do all options") — was approved before chat crashed. Wireframe↔photoreal morph using Seedream 4.5 + Imagen 4 + Nano Banana 2 (3 variants each, ~$0.018). Hold until wireframe rebuild lands so we know what we need.
- 📋 **Production SEO split** — when going to prod, service pages must use static hero image + Three.js lazy-load via IntersectionObserver (Core Web Vitals).
- 📋 **Build remaining 6 service 3D templates** — Stucco, Kitchen, Renovation, Additions, Outdoor, Decks. Use Bathroom + Concrete as patterns.

---

## 📍 WHERE THINGS LIVE (cold-start orientation)

- **Local repo:** `~/ClaudeWorkspace/opc-website/`
- **Pages:** `index.html`, `about.html`, `services/<name>.html`, `prototypes/<name>.html`
- **Assets:** `assets/js/lab-banner.js` (auto-injected on every page) · `assets/img/mike/<service>/` (real photos)
- **Three.js loading:** importmap via unpkg CDN (`three@0.160.0`)
- **GitHub Pages deploy:** auto on push to `main`
- **Tracker spreadsheet:** `1AKwzJlO8gRiTE_PL5R8jnBzOe8aDhVy-PCaZY7QWIOI` (Marketing > Claude Code Workspace)
- **Inspiration Drive folder:** `1ae7n4VwSZbu0_nt6nUX5WeLINGqYJ-CZ`
- **CodePen inspo doc (2026-06-09):** `1AQYwKAvnOf2s3i2EtXl_zMm18FGzcu_QAm-jOjRg-1c`

---

## 📝 ACTIVITY LOG (auto-appended by `/opc-website` skill after every report-back)

- **2026-06-09** — Combined-lumen-vision + combined-gold-glow: tuned lime/gold ambient gradient softer (spread 80vw→110vw, blur 40→80px, opacity 0.07→0.035), added PARTICLE cursor mode (glowing dot + 8-particle trail) alongside RING mode, RING/PARTICLE toggle bottom-left with localStorage persistence. Gold variant re-synced from lime base.
- **2026-06-09** — Built Floor Plan → 3D Reveal (16): approved House A replacement, CSS 3D floor plan with rising walls, camera tilt, roof drop-in, windows/door finish, and real OPC new-build photo context; lab/index/tracker cache-bust synced to `?v=9`.
- **2026-06-09** — Built Bathroom Waterproofing Wall Section (15): approved Bathroom A replacement, CSS 3D cut-away layers (framing → cement board → membrane → mortar → tile → grout), real bath photos, lab/index/tracker cache-bust synced to `?v=8`.
- **2026-06-09** — Audited Claude visual-direction memo: approved Bathroom A (Tile + Waterproofing Wall Section), approved House A (Floor Plan → 3D Reveal), rejected `gbaMbOR` + `GgjRbMq` for OPC production, assigned `KKbWGNZ` to Renovation/interior 3D.
- **2026-06-09** — Built Contact Atmosphere (12), Project Gallery Split (13), and Background Swap Component (14); lab banner/index/state cache-bust synced to `?v=7`. Claude delegated Bathroom 3D + Wireframe House Aura direction memo before rebuild.
- **2026-06-09** — Wireframe-house-aura REBUILT (commit `61586b3`): solid 3D house added (walls cream / roof walnut / lime accent strip / glass windows), crossfade wireframe→solid at scroll 40-65%, bloom restrained (strength 0.55, threshold 0.55, exposure 0.95), thinner rings + smaller stars, flat photo overlay disabled. Subject now visible at all scroll positions.
- **2026-06-09** — State system spun up: tracker sheet + this file + `/opc-website` skill + Google Doc mirror. Logged 10 prototypes, 5 CodePens, 13 design decisions. Answered screenshot fix (macOS JPG default).
- **2026-06-09** — Bathroom plumbing stack (09) shipped: 4-phase scroll (rough-in → supply → fixtures → finish), PVC drain stack + copper supply + fixtures fade-in, lime accent ring with bloom. Live at /prototypes/bathroom-plumbing-stack.html.
- **2026-06-09** — Combined Gold variant (07) + Concrete Rotating Bars service template (08) shipped. Cursor orb added to 06 + 07.
- **2026-06-08** — Wireframe House Aura initial build (03) — Three.js + orbital streaks + particles + drag-rotate. BLOOM ADDED LATER MADE SUBJECT INVISIBLE — see Pending.
- **2026-06-08** — Glass Components (01), Blueprint→Photo Transform (02), Project Gallery Cube (04), Hover Gallery Tiles (05) shipped. LAB banner extracted to shared script.
