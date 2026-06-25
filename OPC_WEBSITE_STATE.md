# OPC Website — Project State

**This file is the single source of truth for this project. Any Claude session opening this folder MUST read this first.**

- **Repo:** https://github.com/priihigashi/opc-website-v1
- **Live:** https://priihigashi.github.io/opc-website-v1/
- **Local:** `~/ClaudeWorkspace/opc-website/`
- **Tracker (sheet):** https://docs.google.com/spreadsheets/d/1q0_v9qYDXKURo59xoS-WISFdHbZWIdc9ukdCDbdDaUQ/edit  ← CANONICAL (Marketing (shared drive) › Website Projects › 'OPC Website — Build Tracker')
- **Drive mirror of this doc:** https://docs.google.com/document/d/1j2Y1z6rYRBS9fwE1Uk4seMvUNk9jFMZA-SZDAuCSZ2E/edit (ID `1j2Y1z6rYRBS9fwE1Uk4seMvUNk9jFMZA-SZDAuCSZ2E`)
- **Skill:** `/opc-website` (loader skill — reads this file on activation)

Last updated: **2026-06-25**

---

## 🚨 CURRENT TRUTH — READ THIS FIRST

The site has moved out of prototype-chasing and into commercial MVP work. The locked direction is **dark / lime / glass**, using real OPC photos and restrained Ricardo-style rendered 3D only where it helps.

**3D status:**
- ✅ Ricardo forks exist: `new-construction-house3d.html` (#10· House 3D) and `kitchen-room3d.html` (#11· Kitchen Room 3D).
- ⛔ Superseded/rejected for production: #15 Bathroom Waterproofing Wall, #16 Floor Plan → 3D Reveal, and #17 Stucco Layer Section. They stay in the lab for audit/history only.
- 🟡 Future hero 3D should use rendered 3D object sources/forks, not line-art blueprints or flat CSS layer planes.

**Commercial MVP focus now:** conversion plumbing (real form backend + analytics), production service proof (before/after, testimonials, 3D hero promotion), local SEO/city pages, image performance, and tracker/backlog cleanup against the now-live site.

**🎬 VIDEO SOURCE NOTE (Priscila 2026-06-25, LOCKED):** any template/version with a HERO VIDEO uses **the intro video from the OG site** — `oakpark-construction.com` plays **`1intro.mov`** (local: `~/Downloads/Videos/Marketing/1intro.mov`) + `mgc-compress-1.mp4` (= `Timeline-Intro-MGC.mp4`). Use `1intro.mov` as the intro. ⚠️ It's only 480×266 (low-res) — re-export higher-res or use the MGC source (1280×720) and compress for web before shipping. Also logged in Tracker → 🎨 Design Decisions. Ties to Arc Projects hero-video inspo (row 40).

**📂 IMAGE/COPY/MIRROR SPACE (2026-06-25):** Tracker now has 3 new tabs — 🪞 Mirror Queue (incoming template URLs to analyze+mirror), 🖼 Image Provenance (which photo used where + phase), ✍️ Copy Bank (reusable sentences). Image rule: pick photos from the **📸 Photo Catalog** tab in Ideas & Inbox (`1IrFrCNGVIF7cvAr9cIuAXvCtUR_-eQN1mdCpHXpfbcU`) by the **Phase** column — showcase = AFTER/finished, never before/during/land. Memory: `feedback_image_selection_after_photos.md`.

---

## 🎯 CURRENT FOCUS

- Production site is live on GitHub Pages with `home-b` promoted to `index.html`, gallery/category viewers built from real OPC photos, service pages live, and shared nav/font/footer/readability layers applied.
- Prototypes remain in `/prototypes/` as lab/reference history, all `noindex,nofollow`; Ricardo-style 3D forks are the preferred future 3D family.
- **Open right now:** real form backend, GA4/GTM + conversion tracking, 3D fork promotion into production service pages, before/after/testimonials, city SEO, image performance/WebP, and cleanup of stale Backlog rows in the canonical tracker.

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
| 15 | Bathroom · Waterproofing Wall Section | ⛔ REJECTED / LAB ONLY | [link](https://priihigashi.github.io/opc-website-v1/prototypes/bathroom-waterproofing-section.html) |
| 16 | Floor Plan → 3D Reveal | ⛔ REJECTED / LAB ONLY | [link](https://priihigashi.github.io/opc-website-v1/prototypes/floor-plan-3d-reveal.html) |
| 17 | Stucco 4-Coat Layer Section | ⛔ SUPERSEDED / LAB ONLY | [link](https://priihigashi.github.io/opc-website-v1/prototypes/stucco-layer-section.html) |
| 18 | Reference Rebuild · Light Panel Hero (Novobudowa pattern, OPC original) | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/novobudowa-light-panel.html) |
| 10· | **New Construction · House 3D (Ricardo yLOpNdZ fork, OPC recolor)** | ✅ LIVE — REWORK of #10 | [link](https://priihigashi.github.io/opc-website-v1/prototypes/new-construction-house3d.html) |
| 11· | **Kitchen · Room 3D (Ricardo LYxMWQN fork, OPC recolor)** | ✅ LIVE — REWORK of #11 | [link](https://priihigashi.github.io/opc-website-v1/prototypes/kitchen-room3d.html) |
| B-home | **Home · Version B (architectural-minimal direction)** | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/home-b.html) |
| B-svc | **New Construction · Version B (service template, real content)** | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/new-construction-b.html) |
| A-digi | **Home Immersive v2 (digitalists scroll — hero parallax + Inception 3D house + pinned before/after)** | ✅ LIVE (lab) — Prototype A | [link](https://priihigashi.github.io/opc-website-v1/home-immersive-v2.html) |
| B-digi | **Projects List v2 (referenzen — hover-reveal list + grid/list toggle)** | ✅ LIVE (lab) — Prototype B | [link](https://priihigashi.github.io/opc-website-v1/projects-list-v2.html) |
| Font-lab | **Font + Palette Lab (5 type systems × 3 palettes, real OPC hero — decision tool)** | ✅ LIVE (lab) — awaiting pick (T-164) | [link](https://priihigashi.github.io/opc-website-v1/prototypes/font-lab.html) |

**🆕 VERSION B — architectural direction (2026-06-09):** Light/off-white (`#F4F1EA`) + off-black (`#0A0A0A`) theme, lime kept as a SPARING accent (hairlines, circular buttons, small labels), Anton titles + Cormorant italic serif accent + Roboto Mono labels. Inspired by Webflow *Architectural Bureau* (full-bleed photo hero, sideways nav label, circular outline buttons, thin rules, numbered indexed service list — showcase-slider inspo, whitespace) FUSED with OPC brand + REAL content (brothers, 9 services, counties, license) + real Mike photos. `home-b.html` (home) + `new-construction-b.html` (service template w/ included grid + 5-step process + photo gallery + FAQ accordion + CTA — also the fix-pattern for the 9 stub service pages). Not in production nav; in lab banner as ✨ Home B / ✨ Service B. Priscila brief: "off black and white title + my brand, real content, one home + one service."

Lab banner cache-bust: **?v=20** (bump to ?v=21 on next page added). **2026-06-24: lab banner reorganized into COLOR-CODED CATEGORY GROUPS** — Production (lime) · Home Directions (gold) · Galleries & Projects (blue) · Service/3D (walnut) · Effects/Atmosphere (purple) · Tools (pink) · Contact (teal). Each group is a labeled, colored chip cluster so versions compare apples-to-apples.

**RICARDO FORKS — how they were built (so this never gets misread again):** source recovered via `curl https://cdpn.io/<user>/fullpage/<hash>` (clears Cloudflare). House (yLOpNdZ) + Kitchen (LYxMWQN) are **CSS-3D** (preserve-3d + hundreds of `.face` divs). Recolor = luminance-mapped hex swap: lavender/grey ramp → obsidian→walnut→tan→cream; blue/teal glass → lime ramp. Audio stripped from kitchen, drag-rotate + click-open kept. Old line-art #10 + exploded #11 left in place for compare (badge later if she wants).

---

## 🎨 DESIGN DECISIONS — LOCKED

- **🔒 HERO DIRECTION LOCKED (Priscila 2026-06-25) — resolves T-154:** option **(c) Arc hero-video on Version-B light bones.** Meaning: light / architectural / editorial base; optional muted hero video or cinematic exterior motion; Digitalists-style scroll mechanics; **NOT** Novobudowa full dark-luxury as the main home direction; avoid harsh contrast — calm, premium, construction-real. (Novobudowa dark-luxury #18 stays a lab reference; Arc hero video = OG-site `1intro.mov`, see Video Source Note.) This + the font/palette pick (T-164) are the two gates before any home-immersive rebuild.
- **Palette:** obsidian `#0A0A0A` / cream `#F0EBE3` / lime `#CBCC10` + walnut `#8B5A2B`
- **Typography:** Anton (display) · Cormorant Garamond italic (serif accent) · Roboto Mono (labels) · Inter (body)
- **3D pages:** all prototypes use Three.js loaded via importmap (CDN)
- **Cursor orb:** scoped to `combined-lumen-vision` + `combined-gold-glow` ONLY (too heavy combined with Three.js + bloom)
- **Bloom:** must NOT wash out the subject. Anchor params for reference: bathroom-plumbing-stack uses `UnrealBloomPass(0.7, 0.6, 0.4)` with `toneMappingExposure = 1.05` — that's the upper limit that still reads
- **Rejected prototype note:** #15 Bathroom Waterproofing Wall and #16 Floor Plan → 3D Reveal were useful explorations but are not production candidates.
- **Future service 3D rule:** use Ricardo-style rendered 3D objects/forks where available. Avoid line-art blueprints and flat CSS layer planes as final service heroes.
- **Service page 3D recommendations (priority order):**
  1. New Build — sequential assembly (footing → slab → framing → roof) — *brand signature*
  2. Bathroom — needs a recognizable rendered 3D bath object or approved source
  3. Stucco — needs a solid rendered 3D wall/object, not flat CSS planes
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
6. **🔒 VERSIONING — never overwrite a working file** (Priscila 2026-06-24) → when iterating on an existing page/component, NEVER overwrite/break the base. Base keeps its name; the new one ships as a separate `*-v2 / -v3` file and goes in the lab under its category group so versions compare apples-to-apples. Matches existing convention (home-b, contact-v1/v2/v3, gallery-3d-v2). Memory: `feedback_versioning_never_overwrite.md`.

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
| 2026-06-09 | Webflow — Architectural Bureau (LINE studio) | [live](https://architectural-bureau.webflow.io) · [made-in-webflow](https://webflow.com/made-in-webflow/website/architectural-bureau) | "for Higashi site, maybe OPC too — clean & modern architecture site, I like something idk what" — **HIGASHI-PRIMARY** light/airy/luxe minimalism. Good: full-bleed photo hero + tiny type overlay, hairline rules + small uppercase labels, circular outline buttons, vertical sideways nav labels, huge whitespace, muted palette, award card w/ carousel arrows. OPC = borrow ELEMENTS only (circular buttons / full-bleed hero / hairlines), not a full reskin. Route to /hig-negocios for Higashi. |
| 2026-06-09 | Webflow — 49 North v2 | [made-in-webflow](https://webflow.com/made-in-webflow/website/49north-v2) | "save for creative parallax — it even changes direction sideways before continuing down" — **CREATIVE PARALLAX / scroll-direction-shift**: vertical scroll transitions into a horizontal (sideways) section then back to vertical. High-end architectural photography + whitespace. Map to OPC: a signature scroll moment (project showcase / 'how we build' scrolling sideways through phases). 🟡 view live. |
| 2026-06-09 | Webflow — Sticky Stacking Cards | [live](https://sketchzlab-cloneable-7.webflow.io) · [made-in-webflow](https://webflow.com/made-in-webflow/website/sticky-stacking-cards) | "not sure I like it but maybe for FAQ" — cards pin + scale down as you scroll (layered stack). ⚠️ My note: better for a sequential PROCESS section (consult→design→build→walkthrough) than FAQ; FAQ wants an accordion since stacked cards hide earlier questions. Priscila unsure. |
| 2026-06-09 | Webflow — Custom Showcase Slider | [live](https://custom-showcase-slider.webflow.io) · [made-in-webflow](https://webflow.com/made-in-webflow/website/custom-showcase-slider) | "interesting for a gallery or service menu" — **SERVICE MENU / GALLERY candidate**: indexed list (01/02/03) where each item expands to reveal a large image/content panel on hover/click. Map to OPC numbered service menu (each service reveals a project image) or gallery nav. |
| 2026-06-09 | Webflow — Custom Double Slider (Tripzo) | [live](https://custom-double-slider.webflow.io) · [made-in-webflow](https://webflow.com/made-in-webflow/website/custom-double-slider) | "save as inspo, maybe interesting for galleries" — **PROJECT GALLERY candidate**: looping carousel, dual nav arrows, big heading + subtitle + play-button overlay (click-to-play video). Map to OPC project gallery (cards by address/service, click → before-after or video). |
| 2026-06-09 | russell-henderson.com | (reference) | Neon-tube orbital ring halo intensity — bloom inspiration |
| 2026-06-09 | LUMEN | (reference) | Cursor-follow orb — implemented on 06 + 07 |
| 2026-06-11 | Dribbble — Glow Card Design | [shot](https://dribbble.com/shots/26140947-Glow-Card-Design) | Glassmorphism glow cards (floating stack) — gallery-3d polish: glass cards + bottom glow |
| 2026-06-11 | Axelerant UX guide | [blog](https://www.axelerant.com/blog/user-experience-design-guide) | Glass cards at an angle — card-design ref for 3D gallery cards |
| 2026-06-11 | Shutterstock — Holographic UI/UX | [img](https://www.shutterstock.com/image-photo/holographic-uiux-display-icons-uxui-designer-2613403555) | "save as holographic view — not using now" — HOLOGRAPHIC reference |
| 2026-06-11 | Instagram reel — 3D Glassmorphism | [reel](https://www.instagram.com/reel/DW_ot3Eivu3/) | GLASSMORPHISM target for gallery-3d v3 |
| 2026-06-11 | CodePen — aibuilders (glass) | [KwdQyPp](https://codepen.io/aibuilders/pen/KwdQyPp) | Glass-thickness ref for gallery-3d — ⚠️ source blocked, paste needed |
| 2026-06-23 | **Novobudowa** (Polish windows co.) | [novobudowa.pl/en](https://novobudowa.pl/en) | Pure-black scroll site, gradient "sunlight" light-panel hero, giant right-aligned headline w/ gradient-ink word, "consult project" pill+↘. Maps ~1:1 to OPC obsidian. **DARK-LUXURY direction** — prototype #18 built from this. (Tracker Inspiration row 39) |
| 2026-06-23 | **Arc Projects** (architecture studio) | [arcprojects.build](https://www.arcprojects.build) | Full-bleed cinematic **HERO VIDEO** → editorial grid; GSAP+Lenis scroll. Saved for the HERO-VIDEO idea (Priscila's intro video). (Tracker Inspiration row 40) |
| 2026-06-24 | **digitalists** (Austrian digital agency) | [digitalists.at](https://digitalists.at) | Yellow-accent agency site (#F1E500 ≈ OPC lime). **TWO PARTS Priscila wants:** (1) **HERO scroll-parallax** — subject moves on scroll while bg stays static; her *Inception* idea = make it a HOUSE EXTERIOR that morphs/folds into a 3D object (ties to T-154 hero lock + Ricardo house fork #10; hero image still undecided, maybe free-stock exterior → 3D). (2) **PROJECTS scroll** — bg pins/static while before/after overlays scroll over it, then bg releases into rest of page; project COUNT (use "X+") + animated arrow; before/after = split rectangle (left before / right after, we already have these in gallery). Must read LUXURIOUS not gimmicky. Build OPC-adapted prototype via /website-reference-rebuild. (Tracker Inspiration row 41) |
| 2026-06-24 | **digitalists — referenzen** (projects page) | [referenzen](https://digitalists.at/referenzen/) · [awwwards](https://www.awwwards.com/sites/digitalists-1) | Full-width edge-to-edge numbered project LIST (CS# + title + client + tags), hover → rectangle preview image w/ refined EDGES, **LIST vs GRID toggle**, scroll-shader portfolio + animated arrows (Awwwards). Priscila likes: hover-reveal edges, refined color, edge-to-edge, better alignment, the grid/list "select" option. We already have the base (`.svc` numbered list + `.ba` before/after on index.html). → **Prototype B** in OUR brand. (Tracker Inspiration row 42) |

### ⛔ Superseded direction decisions from visual memo
**Visual Direction Memo (saved 2026-06-09):** https://docs.google.com/document/d/1-ltwpYHCW9DX3PPB8Adnbe_hE8gKqB4VI3CnPHVeNsI/edit

- **Bathroom:** #15 Tile + Waterproofing Wall Section was built and then rejected for production.
- **Wireframe House Aura:** #16 Floor Plan → 3D Reveal was built and then rejected for production.
- **CodePen rejects:** `gbaMbOR` and `GgjRbMq` are rejected for OPC production but remain archived in Inspiration.
- **KKbWGNZ:** assigned to Renovation / interior sectional 3D, not Stucco.

### ✅ Resolved this session
- Bathroom lime ring — radius 2.1→3.8 (commit `9081541`)
- Concrete lime ring — radius 0.72→2.2 + moved to scene (commit `9081541`)

Drive Inspiration folder: `1ae7n4VwSZbu0_nt6nUX5WeLINGqYJ-CZ`

---

## 🚧 PENDING / BLOCKED

- 🔴 **Digitalists feedback 2026-06-25 — current `home-immersive-v2.html` still misses the core interaction.** Priscila clarified the reference mechanic: the project strip/background stays pinned for a while, while multiple rectangular project images independently scroll over it, staggered left/center/right; only after the last rectangle clears does the whole strip release and normal scrolling resumes. Current OPC version is wrong because it uses three centered full-screen card stages. Also wrong: current hero image is unfinished construction, not a final/luxury subject; hero should use a detached foreground object layer over a filled background, like the reference girl separating from the station background. Color/contrast pass also needed. Tracker rows: **T-160 project-strip rebuild**, **T-161 hero foreground-object extraction plan**, **T-162 color/contrast revision**.
- ✅ **`wireframe-house-aura` REBUILT** (commit `61586b3`) — added solid 3D house geometry (walls cream / roof dark walnut / door walnut / lime accent strip / glass windows), crossfade wireframe→solid at scroll 40-65%, bloom dialed back (strength 0.55 / threshold 0.55 / exposure 0.95), thinner rings + smaller stars, flat photo overlay disabled. Test live + tune if needed.
- ⚠️ **Cursor orb perf** — on 3D-heavy pages, mix-blend-difference + lerp creates repaint storm. Already scoped OFF on 3D pages, but if cursor added elsewhere needs throttling.
- ⚠️ **AI image gen** ("do all options") — was approved before chat crashed. Wireframe↔photoreal morph using Seedream 4.5 + Imagen 4 + Nano Banana 2 (3 variants each, ~$0.018). Hold until wireframe rebuild lands so we know what we need.
- 📋 **Production SEO split** — when going to prod, service pages must use static hero image + Three.js lazy-load via IntersectionObserver (Core Web Vitals).
- 📋 **Build remaining 6 service 3D templates** — Stucco, Kitchen, Renovation, Additions, Outdoor, Decks. Use Bathroom + Concrete as patterns.

### 🆕 LEAD-CAPTURE / FORM SYSTEM (NEW — Priscila 2026-06-09, plan for next tasks — do NOT use mailto)
**Problem she flagged:** `mailto:` links (e.g. the "Email OPC" button) only work if the visitor's computer has a desktop mail client configured. Most don't → the link does nothing → lead lost. We must NOT rely on the visitor's email app.

- **FORM-1 — Real server-side form (replaces every mailto link).** Proper form (name, phone, zip, message — matches the "START A PROJECT" glass card screenshot) that POSTs to a backend and emails OPC directly. Candidate backends (free/cheap, GH-Pages-compatible): Formspree / Web3Forms / Basin / our own GitHub Action or serverless endpoint. Keep "Call" + styled email line, but the PRIMARY CTA is the form, not mailto.
- **FORM-2 — Two-stage progressive email capture (the key idea).** The "CONNECT / Your email…" box captures the email the INSTANT it's submitted — BEFORE the full form. Then a fuller form pops up (name/phone/zip/project). If the visitor abandons the popup, **we still have their email** and OPC still gets a "someone tried to contact you" notification. Flow: (a) email submitted → fire capture immediately, (b) open detailed form modal, (c) modal submit → full lead, (d) abandon → partial lead still recorded + emailed.
- **FORM-3 — Source-page tracking.** ✅ Done 2026-06-24 for current non-prototype lead forms: `index.html`, `home-b.html`, `contact.html`, `contact-v1.html`, `contact-v2.html`, and `contact-v3.html` all include `source_page`, `referrer`, and UTM fields (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`). Notification email content still depends on FORM-1 backend selection.
- **FORM-1b — Legacy `mailto:` cleanup.** ✅ Done 2026-06-24: `about.html`, `privacy.html`, `index-legacy.html`, and lab `prototypes/contact-atmosphere.html` now route to the contact form path instead of opening a visitor's local email app. `rg "mailto:"` now only finds documentation notes.
- **Build order when we get to it:** FORM-1 backend → FORM-3 source field (trivial) → FORM-2 progressive capture UX. One coherent system. NOT started — planned per Priscila's "organize first, plan for next tasks."

---

### 🔒 LOCKED DECISION — AI ROOM VISION UX (Priscila 2026-06-16)
**Binding.** The AI design tool is NOT kitchen-only. Priscila explicitly rejected the kitchen-only version and requires:
1. **Multiple room types — at least 3** (currently 4: Kitchen · Bathroom · Exterior · Backyard).
2. **Single page — selecting a room must NOT open/navigate to a new page.** The container box updates *in place* (dynamic content swap) as you select.
3. **Adaptive** — picking a room changes the title, example image, and the questions shown.
- **Canonical page = `room-vision.html`** (multi-room). `kitchen-vision.html` (v1, kitchen-only) is RETIRED — do not wire it up. This resolves T-121.
- Quote: *"I want it for a bunch of stuff... at least like three different options of rooms... you select and it doesn't open a new page, just change the container box, it's dynamic and changes as you select."*
- ✅ Verified 2026-06-16: room-vision.html already implements all three (ROOMS object w/ 4 rooms, `show()` swaps `.step` divs in place, per-room adaptive questions). No rebuild needed — design polish + backend only.

### 🔒 LOCKED DECISION — REFERENCE-CAPTURE TOOLING (Priscila + Codex audit 2026-06-23)
**Binding.** When Priscila wants the site to "feel like" a reference site, we use our OWN free skill — NOT a paid third-party "site mirror" (rejected the $-Gumroad NT Site Mirror; engine = free open tools HTTrack/SingleFile/curl, rebuild = what Claude already does).
- **Skill = `website-reference-rebuild`** (a tool under the `/opc-website` hub). Framing: **reference capture + ethical OPC rebuild** — study the design pattern, rebuild ORIGINAL in OPC brand. NEVER a 1:1 clone, NEVER ships the source site's assets.
- **Skill ≠ Agent.** Tools are skills; `/opc-website` is the hub that pulls them in. Agents reserved for LATER + large research/comparison sweeps only ("compare 25 contractor sites, rank best hero/gallery/contact").
- Codex-tightened rules baked into the skill: no "clones every site" promise; curl/HTTrack (NOT wget — macOS has curl, not wget); only write to STATE.md once a rebuild actually ships to the live site.
- Tracker tasks: see Backlog T-137..T-141. Canonical skill file: `~/.agents/skills/website-reference-rebuild/SKILL.md` (symlinked into Claude and Codex).

## 🧭 WEBSITE BUILD BACKLOG + SEO/ADS RECOMMENDATIONS (audit 2026-06-09, Claude)
Built from: live oakpark-construction.com audit + repo audit + what I know about OPC. Priority = impact on leads/ranking/ads.

### ✅ Shipped this audit session (2026-06-09)
- About page: real two-owner section (Matthew=GC, Michael=PM) w/ headshots pulled from live site + brothers' Chicago→FL story.
- SEO: all 8 remaining service pages now have meta description + canonical + OG/Twitter + Service JSON-LD (only stucco had it before).
- 3 county landing pages (`areas/broward|palm-beach|miami-dade.html`) — localized, GeneralContractor schema, city chips, in sitemap. For local ranking + ads.
- Homepage schema upgraded LocalBusiness→GeneralContractor (founders, areaServed, priceRange, knowsAbout). Footer: full 9-service list + SERVICE AREAS column (internal links).
- Gutter consistency on service prototypes.

### 🔴 HIGH priority (leads + ads — do next)
1. **Real contact form + lead capture** (FORM-1/2/3 above) — mailto fails on machines w/o a mail client. Server-side form (Formspree/Web3Forms), two-stage email capture, source-page tracking. Biggest single lead leak.
2. **Analytics + conversion tracking** — GA4 + Google Ads conversion tags on form submit AND `tel:` click (click-to-call event). Without this, ads can't optimize. She explicitly wants ads alignment.
3. **Connect 3D forks → real service pages** — the recolored house/kitchen 3D heroes are still prototypes; promote into `services/new-construction.html` + `services/kitchen.html` (with static fallback + lazy Three.js for Core Web Vitals).
4. **Projects / portfolio page** — Mike has hundreds of real job photos; a filterable gallery (by service + county) drives conversion AND gives Google real local imagery. `#projects` is only an anchor now.
5. **NAP + Google Business Profile alignment** — site has no physical/service-area address; local-pack ranking needs consistent Name-Address-Phone + a GBP. Add a service-area-business address block.
6. **PPC landing pages per ad group** (service × county) — dedicated single-CTA + form + tracking pages so ad spend lands on a converting page, not the homepage. County pages are the foundation.

### 🟡 MEDIUM priority (ranking + trust)
7. **Testimonials / reviews section + AggregateRating schema** — social proof is entirely missing. Pull Google reviews.
8. **"How it works" / process page** — consultation → design → build → walkthrough. Reduces friction, ranks for "process" queries.
9. **City-level pages** for top cities (Fort Lauderdale, Boca Raton, Miami, Coral Springs) — deeper than county for high-intent local search.
10. **Image compression** — Mike's JPEGs are large; compress/serve WebP for Core Web Vitals (affects rank + ad Quality Score).
11. **Blog / cost guides** — "cost to remodel a kitchen in Broward" long-tail content SEO.
12. **Bathroom #15 real-3D replacement** (see plan below).

### 🟢 LOW priority (polish)
13. Favicon + default OG share image + web manifest. 14. Accessibility pass (contrast, focus states, form labels). 15. 404 page.

### 🛁 BATHROOM #15 — real-3D replacement plan
Current `bathroom-waterproofing-section.html` is CSS-layered planes (same family as stucco) — Priscila: "doesn't work, same as stucco." No Ricardo pen exists for a bathroom. Options, best→worst:
- **(A, recommended)** Reuse the **kitchen-room3d (LYxMWQN) fork pattern** but source a Ricardo *bathroom* room pen if one exists (search his CodePen profile) — same cdpn-fullpage → recolor pipeline that worked for #10/#11.
- **(B)** Keep the waterproofing wall-section concept but rebuild it as a proper isometric 3D cutaway (preserve-3d box like the stucco assembly but corrected) instead of flat stacked planes — shows framing→cement board→membrane→tile as a real 3D wall slice.
- **(C)** Commission a baked GLTF bath model (like KKbWGNZ) — highest fidelity, needs Blender/asset budget.
Decision needed from Priscila on direction before build.

---

## 📍 WHERE THINGS LIVE (cold-start orientation)

- **Local repo:** `~/ClaudeWorkspace/opc-website/`
- **Pages:** `index.html`, `about.html`, `services/<name>.html`, `prototypes/<name>.html`
- **Assets:** `assets/js/lab-banner.js` (auto-injected on every page) · `assets/img/mike/<service>/` (real photos)
- **Three.js loading:** importmap via unpkg CDN (`three@0.160.0`)
- **GitHub Pages deploy:** auto on push to `main`
- **Tracker spreadsheet:** `1q0_v9qYDXKURo59xoS-WISFdHbZWIdc9ukdCDbdDaUQ` (Marketing (shared drive) › Website Projects › 'OPC Website — Build Tracker'). OLD `1AKwzJlO8gRiTE_PL5R8jnBzOe8aDhVy-PCaZY7QWIOI` is ARCHIVED ('ZZ_ARCHIVED — OPC Website Tracker').
- **Inspiration Drive folder:** `1ae7n4VwSZbu0_nt6nUX5WeLINGqYJ-CZ`
- **CodePen inspo doc (2026-06-09):** `1AQYwKAvnOf2s3i2EtXl_zMm18FGzcu_QAm-jOjRg-1c`

---

## 📝 ACTIVITY LOG (auto-appended by `/opc-website` skill after every report-back)

- **2026-06-25** — HERO DIRECTION LOCKED + FONT-LAB SHIPPED + PINNED-STRIP RULES BAKED IN. (1) Priscila locked hero direction **(c) Arc hero-video on Version-B light bones** (resolves T-154) → recorded in Locked Decisions + Current Truth. (2) Built `prototypes/font-lab.html`: same real OPC hero block (Custom homes, built Whole. + Dockside exterior photo + 120+ count) in 5 display-type systems (Archivo Expanded / Space Grotesk / Bricolage Grotesque / Cabinet Grotesk via Fontshare / Ailerons-approx) with a live A/B/C palette toggle (Light-Arch / Warm-Cream / Charcoal-Brass). Ailerons shown honestly as a thin-wide-Archivo stand-in (not installed). Wired into lab banner (HOME DIRECTIONS group), cache-bust **?v=19→?v=20 across 64 files** (65 refs total). Validated clean at 3 viewports (0 console errors, 0 near-empty frames); montage eyeballed. (3) Patched `_reference-capture/digitalists/{CODEX_BRIEF.md, patterns.md, tools/validate.js}` with the **pinned-strip acceptance rules** (5 binding rules: tall runway · fixed bg layer · ≥3 staggered L/C/R rectangles · release only after last clears · validate by motion-state). `validate.js` now runs motion checks gated on a `[data-pin-strip]` marker (self-skips on non-strip pages — confirmed clean on font-lab). Tracker: Prototypes row added, **duplicate T-160 (mobile nav) relogged → T-163**, T-160 confirmed = pinned-strip rebuild, **T-164** added (Priscila picks font+palette; front-runner Archivo Expanded + Palette A). Room Vision left untouched (still blocked on Gemini billing / Gmail app pw / Vercel env).
- **2026-06-25** — DIGITALISTS FEEDBACK LOGGED: Priscila clarified the missed mechanic in `home-immersive-v2.html`: the reference pins the whole project strip/background while a stack of rectangular images scrolls over it, staggered left/center/right, then releases only after the last rectangle clears. Current implementation is wrong because it uses centered full-screen project cards. Also logged hero issue (needs detached final-looking foreground object over filled background, not unfinished construction photo) and color/contrast dislike. Added tracker Backlog **T-160..T-162** and pending note above; next pass should inspect `services-stacked__images`, `.animated-img`, `data-trigger`, Lenis + GSAP/ScrollTrigger behavior before rebuilding.
- **2026-06-25** — CODEX DIGITALISTS REBUILD PASS: read `_reference-capture/digitalists/CODEX_BRIEF.md`, ran provided `capture-ref.js` (reference confirmed desktop 10.9 screens / portrait 5.8 / mobile 10.8) and `validate.js` baseline, then rebuilt `home-immersive-v2.html` toward the measured feel: added Lenis smooth-scroll, changed hero to a true one-screen full-bleed exterior push-in, fixed the sticky-release dark gap, rebuilt the projects handoff as an airy cream count section with floating before/after cards, and expanded the service list to all 9 services. Tracker `🧪 Prototypes!D46:H46` updated. Final `validate.js`: desktop 7.8 screens, portrait 6.3, mobile 5.6; near-empty frames none; only expected local favicon `ERR_FILE_NOT_FOUND`; montage checked against reference.

- **2026-06-24** — CODEX HANDOFF for the digitalists mirror. After 4 Claude attempts at `home-immersive-v2.html` that Priscila rejected ("you did not get space and transition mirrored — yours is ugly and different"), wrote a full brief + runnable tools for Codex. Rendered the REAL digitalists.at with Playwright + measured it: stack = **GSAP + Lenis (smooth-scroll) + Three.js**; hero ≈ 100vh full-bleed (not a long runway); ~11 screens, very airy; big calm type. KEY MISS = no smooth scroll (Lenis) + spacing too tight + abrupt transitions. Deliverables in `_reference-capture/digitalists/`: `CODEX_BRIEF.md` (measured facts, exact diagnosis, brand lock, step-by-step, acceptance), `tools/capture-ref.js` + `tools/validate.js` (runnable, smoke-tested), `screens/` (real reference shots + `mine-sheet.png` = the wrong attempt). Goal: mirror SPACE+TRANSITIONS in OPC brand. Codex to iterate v2 or build v3. Reminder: brief/tools live in gitignored `_reference-capture/` (local-only; Codex reads local fine).

- **2026-06-24** — PROTOTYPE A REBUILT after Priscila flagged "did not work, bad distribution." Root cause (confirmed by Playwright scroll-shots): v1 was 8.9 screens with a 240vh pinned hero that left an EMPTY dead screen + a hand-coded CSS-3D house that didn't read. Rebuilt: hero = one clean screen (copy left, real photo right) with light scroll parallax; dropped the CSS-3D house (inception 3D can later reuse the real new-construction-house3d page); before/after pinned section tightened (static "120+" headline holds while 3 glass cards scroll over it, then releases). Now 6.8 screens, every viewport filled, 0 console errors. INSTALLED Playwright (devDep, node_modules gitignored) for real scroll-state validation — fixes the recurring "built blind" gap. Pushed `0c5af4e`. Lesson: validate prototypes with rendered scroll-shots BEFORE reporting done.
- **2026-06-24** — LAB BANNER NAV FIX: pinned 🧪 LAB / ALL / ✕ HIDE controls (only the group strip scrolls — close was getting pushed off-screen past item 12); added JS that drops each page's own fixed menu below the bar so the site menu is visible on every page (restores on close). Cache-bust ?v=18→v=19 across 64 files. Pushed `42a8430`.
- **2026-06-24** — DIGITALISTS BATCH SHIPPED (via /website-reference-rebuild). Captured digitalists.at home + referenzen to `_reference-capture/digitalists/` + wrote `patterns.md` (recipe; their motion is WebGL/Three.js shaders — we rebuilt the *feel* in light CSS/JS, OPC brand, no shader/asset copy). Built **Prototype A** `home-immersive-v2.html` (hero subject-parallax → flat-photo morphs into a CSS-3D house [Inception] + pinned-background before/after projects strip with "120+" count-up + animated arrow; reuses our nav/.ba/services/CTA/footer) and **Prototype B** `projects-list-v2.html` (full-bleed numbered projects list, LIST⇄GRID toggle, hover rectangle-preview with refined edges, animated arrows; 9 real OPC jobs). Both NEW files only — no base touched (versioning rule). **Reorganized lab banner into 7 color-coded category groups**; cache-bust bumped ?v=17→?v=18 across 64 HTML files. Validated: inline JS syntax OK both files, all image paths resolve. Logged: Inspiration rows 41+42, Prototypes rows (A+B). ⏳ Awaiting Priscila to view + react; Prototype A's final hero still gated on T-154.
- **2026-06-24** — INSPO DETAILED (RULE 2): `https://digitalists.at` row 41 updated with the TWO parts Priscila wants — (1) hero scroll-parallax + her "Inception" house→3D-object morph idea (gated on T-154 hero lock + Ricardo house fork #10), (2) projects section where bg pins/static while before/after overlays scroll over it then releases, with project count ("X+") + animated arrow + split-rectangle before/after fed by existing gallery photos. Raised to 🔴 High. Prototype planned (not yet built) — awaiting GO + scope decision (placeholder hero now vs wait on T-154).
- **2026-06-24** — INSPO SAVED (RULE 2): `https://digitalists.at` (Austrian digital agency) added to Tracker → Inspiration Links row 41 + state.md Inspiration table. Fetched + summarized the homepage (minimal nav, yellow-accent bg-image hero, 8-card services grid, case-studies carousel, inline contact form).
- **2026-06-24** — CONVERSION HYGIENE T-143 shipped: removed all live HTML `mailto:` links from `about.html`, `privacy.html`, `index-legacy.html`, plus lab `prototypes/contact-atmosphere.html`; routed users to `contact.html`/contact form path instead, updated tracker `📋 Backlog!F116:H116`, and verified `rg "mailto:"` now only finds documentation notes.
- **2026-06-24** — MASTER PLAN SYNC: added a dated audit overlay to `OPC_WEBSITE_IMPLEMENTATION_PLAN.md` so the old 2026-06-10 phase plan defers to canonical tracker rows T-142..T-157, records T-143 done, and surfaces T-154 as Priscila's hero-direction gate; recommended next build remains conversion plumbing/forms + analytics.
- **2026-06-24** — CONVERSION TRACKING T-144 shipped: added source/referrer/UTM hidden fields to all current non-prototype lead forms (`index.html`, `home-b.html`, `contact.html`, `contact-v1.html`, `contact-v2.html`, `contact-v3.html`) and fixed missing `name="email"` on hero email inputs; parser verification showed `missing_tracking=[]` and `has_email_name=True` for every form, tracker `📋 Backlog!F117:H117` marked done.
- **2026-06-24** — AUDIT + HYGIENE + PLAN (Claude). Audited Codex's work (verified prototype #18 renders LIVE clean — 0 console errors, no overflow; skill reconciliation correct: `.agents` canonical + `.claude`/`.codex` symlinks). FIXED drift: deleted phantom `website-reference-rebuild.copy-20260623_203918` backup that was showing as a duplicate skill. SYNCED state.md: added 7 missing inspiration rows (5× 2026-06-11 glass refs + Novobudowa + Arc) — table was stale since 06-09. TRACKER: fixed 37 garbled Backlog Status cells (legacy-migration dumped Notes into Status → moved to Notes, Status='New (legacy)', zero data lost); logged the merged 5-phase plan as Backlog **T-142..T-157**. STRATEGIC GAP flagged (Codex + Claude agree): 4 home-hero directions floating (Version-B light=live index / dark-lime-glass=state CURRENT TRUTH / Novobudowa dark-luxury / Arc hero-video) → **T-154 = Priscila must LOCK hero direction** before any more inspo/rebuilds. Recommended next build = Phase 1 conversion (forms+GA4), the real lead leak.
- **2026-06-24** — SHIPPED lab prototype #18 `novobudowa-light-panel.html`: first `website-reference-rebuild` test using Novobudowa as research reference only; created ignored `patterns.md`, built original OPC dark/light-panel hero with real OPC photos, wired lab banner + prototype index, cache-bust bumped to `?v=17`, tracker rows T-139/Prototypes updated.
- **2026-06-24** — DRIFT FIX: converted Claude `website-reference-rebuild` from a real copy into a symlink to `~/.agents/skills/website-reference-rebuild`, matching Codex; left timestamped backup `~/.claude/skills/website-reference-rebuild.copy-20260623_203918`.
- **2026-06-24** — REGISTRY FIX: reconciled `website-reference-rebuild` from Claude-only into shared skills (`~/.agents/skills/website-reference-rebuild/SKILL.md`) and Codex (`~/.codex/skills/website-reference-rebuild` symlink); updated `/opc-website` loader cheat sheet to point at the helper skill; tracker audit row T-141 closed with evidence.
- **2026-06-23** — NEW SKILL BUILT: `website-reference-rebuild` (reference capture + ethical OPC rebuild). Decision locked w/ Codex audit (rejected paid Gumroad "NT Site Mirror" — engine free via HTTrack/SingleFile/curl). Skill is now canonical at `~/.agents/skills/website-reference-rebuild/SKILL.md`, registered under `/opc-website` hub, logged to master plan (this file) + Backlog T-137..T-140 + Design Decisions tab + Skills & Agents registry. Framing: study patterns → rebuild ORIGINAL in OPC brand, never clone/ship source assets. Agents reserved for later large research sweeps.
- **2026-06-19** — ROOM VISION BUILD (Plan v3, post-audit). Implemented + locally verified: **T-117** contract repair (`validation.js` `sanitizeAnswers` now preserves room/focus/features + room-specific answers, malformed room safe-falls-back to kitchen) and **T-125** per-room behavior (`image.js` room-aware `buildPrompt` + room-aware `moderateUpload` so exterior/backyard photos aren't rejected; `submit.js` room-aware lead+customer email subjects/headers/filenames + `room` added to lead). **T-130** retired `kitchen-vision.html` non-destructively (robots→noindex,nofollow, canonical→room-vision.html, lab-banner labeled ARCHIVED; no production page routed to it; not in sitemap). **T-132** local Gemini test: moderation (gemini-2.5-flash) PASS on free tier; **image generation (gemini-2.5-flash-image) returned 429 free-tier quota=0 → image gen needs BILLING enabled (blocker under free-tier-only rule).** BLOCKERS remaining: (1) Gemini image billing, (2) Gmail app password (physical login), (3) Upstash+Blob provisioning. NOT done blind (would break working mock demo + untestable): T-114 storage, T-129 preflight, T-126/127/116/128 OTP/quota hardening, T-118/122/123/133/124 deploy chain. Canonical page = room-vision.html (T-121 closed).
- **2026-06-15** — Built the OPC Kitchen AI Vision backend scaffold with Vercel serverless endpoints, OTP email flow, AI engine routing, watermarking, smoke tests, and security/audit notes; production deploy waits on Vercel env vars + durable storage.
- **2026-06-15** — Audited canonical tracker sheet `1q0_v9qYDXKURo59xoS-WISFdHbZWIdc9ukdCDbdDaUQ` against repo: confirmed it lives in Marketing › Website Projects, updated Service Pages rows to current live URLs/status, refreshed the fonts design decision, appended 11 missing prototype rows, added recent Done rows, and added Backlog task `T-900` for stale backlog cleanup.
- **2026-06-12** — Alignment audit verified and tightened: 44 non-prototype pages now have canonical brand fonts, `opc-shared.css` as the final style layer, zero Roboto Condensed references, zero missing local refs, and standard `.wm`/`.lic` footer hooks; fixed leftover drift in `index-legacy.html`, `about.html`, `contact.html`, `privacy.html`, and `404.html`.
- **2026-06-12** — FULL SITE BUILD SESSION (autonomous): all 6 category viewers built from ⭐ stacked-swiper template w/ real photos (40 new job photos pulled from OPC Drive ‘Mikes Photos & Videos’: Victoria Park, Kinney Build, 1270 Harbor Ct, 9720 SW 92nd Ter, 122 Dockside concrete); 5 entry galleries wired to viewers + V1 Deck/V2 3D/V3 Swap switcher; palette unified to warm black on 20 pages; about.html fonts fixed; home-b PROMOTED to index.html w/ production SEO + GeneralContractor schema (index-legacy.html kept); sitemap 27 URLs; count-up stats + scroll-reveal animations. Tracker updated (categorized Gallery Menu vs Viewers).
- **2026-06-09** — Polished forks per Priscila (commit `338d00a`): house headline 'From slab to keys' (no dot) + more left gutter + idle sway; kitchen darker/browner + scaled-to-fit (0.78) + 'Down to the studs, back to life' + idle sway + constrained drag (full-spin was causing the mustard-flash/disappearing-cream-wall backface glitch). OPEN polish: (a) headlines are judgment calls — easy to swap if she wants different copy; (b) left-gutter consistency should be extended to ALL service pages (stucco/bath use different paddings); (c) kitchen drag glitch is mitigated via constrained range, not a true z-fighting fix — verify on live.
- **2026-06-10** — Commercial MVP pieces started: built production `projects.html` with 12 verified OPC photos + filters, built production `contact.html` with dark form UI + source/referrer hidden fields + sticky mobile Call/Quote bar, linked from `home-b.html`, and added both to sitemap. Backend endpoint + analytics still pending.
- **2026-06-09** — SHIPPED Ricardo forks: **#10· New Construction House 3D** (`new-construction-house3d.html`) + **#11· Kitchen Room 3D** (`kitchen-room3d.html`). Forked from yLOpNdZ + LYxMWQN via cdpn fullpage source, recolored to OPC palette only (luminance ramp → cream/walnut/obsidian, glass → lime). Screenshot-verified before ship. Lab-banner + index cards + tracker + cache-bust ?v=10 across 28 files. Kitchen keeps drag-rotate + click-open, audio stripped. KKbWGNZ still pending Priscila's call.
- **2026-06-09** — RICARDO PEN SOURCE RECOVERED via `cdpn.io/<user>/fullpage/<hash>` (clears Cloudflare, real code). Findings: **yLOpNdZ (house) + LYxMWQN (kitchen) are CSS-3D** (preserve-3d + hundreds of `.face` divs, NOT Three.js) → fork+recolor is clean hex swap. **KKbWGNZ is the only real Three.js** = baked GLTF interior room (model.glb + baked.jpg, OrbitControls) → colors baked into the texture, CANNOT recolor to OPC without Blender re-bake. KKbWGNZ decision pending.
- **2026-06-09** — Batch fixes shipped (commit `b2e7866`): combined-lumen transform title left-aligned to match other section titles; CBC prefix restyled to small mono label (like FL STATE LICENSED); bathroom 'never' serif enlarged to 1.5em feature size like combined hero; contact 'Mike direct' → 'Michael & Matthew' (Matt is co-owner); stucco labels translateZ(150px) so tilted planes stop covering FINISH COAT text.
- **2026-06-09** — NEW lead-capture/form system logged to Pending (FORM-1 server-side form replacing mailto, FORM-2 two-stage progressive email capture, FORM-3 source-page tracking). Planned, not started, per Priscila.
- **2026-06-09** — Combined-lumen-vision + combined-gold-glow: tuned lime/gold ambient gradient softer (spread 80vw→110vw, blur 40→80px, opacity 0.07→0.035), added PARTICLE cursor mode (glowing dot + 8-particle trail) alongside RING mode, RING/PARTICLE toggle bottom-left with localStorage persistence. Gold variant re-synced from lime base.
- **2026-06-09** — Built Floor Plan → 3D Reveal (16): CSS 3D floor plan with rising walls, camera tilt, roof drop-in, windows/door finish, and real OPC new-build photo context; later superseded by the Ricardo dark forks and kept as lab-only.
- **2026-06-09** — Built Bathroom Waterproofing Wall Section (15): CSS 3D cut-away layers (framing → cement board → membrane → mortar → tile → grout), real bath photos, lab/index/tracker cache-bust synced to `?v=8`; later rejected for production because Priscila wants a recognizable 3D bathroom object.
- **2026-06-09** — Audited Claude visual-direction memo: Bathroom A (Tile + Waterproofing Wall Section) and House A (Floor Plan → 3D Reveal) were tested, then superseded/rejected for production; `gbaMbOR` + `GgjRbMq` rejected for OPC production; `KKbWGNZ` assigned to Renovation/interior 3D.
- **2026-06-09** — Built Contact Atmosphere (12), Project Gallery Split (13), and Background Swap Component (14); lab banner/index/state cache-bust synced to `?v=7`. Claude delegated Bathroom 3D + Wireframe House Aura direction memo before rebuild.
- **2026-06-09** — Wireframe-house-aura REBUILT (commit `61586b3`): solid 3D house added (walls cream / roof walnut / lime accent strip / glass windows), crossfade wireframe→solid at scroll 40-65%, bloom restrained (strength 0.55, threshold 0.55, exposure 0.95), thinner rings + smaller stars, flat photo overlay disabled. Subject now visible at all scroll positions.
- **2026-06-09** — State system spun up: tracker sheet + this file + `/opc-website` skill + Google Doc mirror. Logged 10 prototypes, 5 CodePens, 13 design decisions. Answered screenshot fix (macOS JPG default).
- **2026-06-09** — Bathroom plumbing stack (09) shipped: 4-phase scroll (rough-in → supply → fixtures → finish), PVC drain stack + copper supply + fixtures fade-in, lime accent ring with bloom. Live at /prototypes/bathroom-plumbing-stack.html.
- **2026-06-09** — Combined Gold variant (07) + Concrete Rotating Bars service template (08) shipped. Cursor orb added to 06 + 07.
- **2026-06-08** — Wireframe House Aura initial build (03) — Three.js + orbital streaks + particles + drag-rotate. BLOOM ADDED LATER MADE SUBJECT INVISIBLE — see Pending.
- **2026-06-08** — Glass Components (01), Blueprint→Photo Transform (02), Project Gallery Cube (04), Hover Gallery Tiles (05) shipped. LAB banner extracted to shared script.
