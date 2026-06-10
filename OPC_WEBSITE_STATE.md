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

**REWORK SCOPE (FINAL after 2026-06-09 EOD clarification — 3 rounds of correction):**
Priscila confirmed (final): *"I never said new build was right or kitchen actually went wrong."* — every service-page 3D built this session was off, not just the line-art versions.

**Status by prototype:**
- #09 Bath Plumbing Stack — *"didn't like those image much"* (3D but wrong subject)
- #10 NewBuild Sequential Assembly — wrong from start (lines)
- #11 Kitchen Exploded Cabinet — *"actually went wrong"* (3D but wrong)
- #15 Bath Waterproofing Wall Section — *"looks even worse than before"* (CSS layered)
- #16 Floor Plan → 3D Reveal — wrong (blueprint lines, never asked for)
- #17 Stucco Layer Section — wrong (CSS layered, more lines)

**Only acceptable path forward:** Fork Ricardo Oliva Alonso pens, recolor to OPC palette, drop into existing hero-right slot. Find Ricardo pens (or equivalent rendered 3D objects) for Bath + Stucco too instead of inventing.

**EXPLICIT PEN → PAGE MAPPING (Priscila final message 2026-06-09 EOD):**
*"I gave you the link for you to use new build was a house and kitchen was the kitchen room 3-D."*

| Ricardo CodePen | What's IN it | Service page |
|---|---|---|
| `yLOpNdZ` | 🏠 House 3D | **#10 NewBuild** |
| `LYxMWQN` | 🍳 Kitchen room 3D | **#11 Kitchen** |
| `KKbWGNZ` | ❓ TBD — ASK PRISCILA what's in this pen before assigning | TBD (was tentatively Renovation, verify first) |

**Next chat first actions:**
1. Confirm: is `KKbWGNZ` a Renovation/interior 3D, a Bathroom 3D, a Stucco wall 3D, or something else?
2. Ask Priscila to export `yLOpNdZ` + `LYxMWQN` (+ `KKbWGNZ` if approved for some page) as CodePen ZIPs OR paste JS/CSS/HTML
3. Find or ask for additional pens that contain a Bathroom 3D + Stucco 3D (since she said #15 #17 also look worse than originals)
4. Fork each → swap palette to OPC obsidian/cream/lime/walnut → drop into existing service-page hero scaffold (right column)

**Every service-page hero "image on the right" must be a Ricardo-style RENDERED 3D OBJECT, recolored to OPC palette only. Not CSS layered planes. Not Three.js wireframe. Not floor plan blueprints. Not exploded line blocks.**

- 🔴 **#10 NewBuild** (currently line-style Three.js house) → fork `yLOpNdZ` → recolor only
- 🔴 **#11 Kitchen** (currently exploded blocks) → fork `LYxMWQN` → recolor only
- 🔴 **#15 Bath Waterproof Section** (currently CSS layered planes) → needs Ricardo-style 3D bathroom object. Priscila: "looks even worse than before"
- 🔴 **#16 Floor Plan → 3D Reveal** (currently top-down blueprint→walls-rise) → NO BLUEPRINT. Replace with rendered 3D house, NOT line-art.
- 🔴 **#17 Stucco** (currently CSS layered planes — same family as #15) → needs Ricardo-style 3D object, possibly forked from a pen TBD
- 🟡 **Future Renovation page** → fork `KKbWGNZ` → recolor only

**Open question for Priscila (from EOD voice msg):** *"I already did the bedroom could be on..."* — voice-to-text garbled. Did she mean (a) already mapped a Ricardo pen to a service, (b) has a bathroom image ready, or (c) something else? Ask first thing next chat.

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
| 17 | Stucco 4-Coat Layer Section | ✅ LIVE | [link](https://priihigashi.github.io/opc-website-v1/prototypes/stucco-layer-section.html) |
| 10· | **New Construction · House 3D (Ricardo yLOpNdZ fork, OPC recolor)** | ✅ LIVE — REWORK of #10 | [link](https://priihigashi.github.io/opc-website-v1/prototypes/new-construction-house3d.html) |
| 11· | **Kitchen · Room 3D (Ricardo LYxMWQN fork, OPC recolor)** | ✅ LIVE — REWORK of #11 | [link](https://priihigashi.github.io/opc-website-v1/prototypes/kitchen-room3d.html) |

Lab banner cache-bust: **?v=10** (bump to ?v=11 on next page added)

**RICARDO FORKS — how they were built (so this never gets misread again):** source recovered via `curl https://cdpn.io/<user>/fullpage/<hash>` (clears Cloudflare). House (yLOpNdZ) + Kitchen (LYxMWQN) are **CSS-3D** (preserve-3d + hundreds of `.face` divs). Recolor = luminance-mapped hex swap: lavender/grey ramp → obsidian→walnut→tan→cream; blue/teal glass → lime ramp. Audio stripped from kitchen, drag-rotate + click-open kept. Old line-art #10 + exploded #11 left in place for compare (badge later if she wants).

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
| 2026-06-09 | Webflow — Sticky Stacking Cards | [live](https://sketchzlab-cloneable-7.webflow.io) · [made-in-webflow](https://webflow.com/made-in-webflow/website/sticky-stacking-cards) | "not sure I like it but maybe for FAQ" — cards pin + scale down as you scroll (layered stack). ⚠️ My note: better for a sequential PROCESS section (consult→design→build→walkthrough) than FAQ; FAQ wants an accordion since stacked cards hide earlier questions. Priscila unsure. |
| 2026-06-09 | Webflow — Custom Showcase Slider | [live](https://custom-showcase-slider.webflow.io) · [made-in-webflow](https://webflow.com/made-in-webflow/website/custom-showcase-slider) | "interesting for a gallery or service menu" — **SERVICE MENU / GALLERY candidate**: indexed list (01/02/03) where each item expands to reveal a large image/content panel on hover/click. Map to OPC numbered service menu (each service reveals a project image) or gallery nav. |
| 2026-06-09 | Webflow — Custom Double Slider (Tripzo) | [live](https://custom-double-slider.webflow.io) · [made-in-webflow](https://webflow.com/made-in-webflow/website/custom-double-slider) | "save as inspo, maybe interesting for galleries" — **PROJECT GALLERY candidate**: looping carousel, dual nav arrows, big heading + subtitle + play-button overlay (click-to-play video). Map to OPC project gallery (cards by address/service, click → before-after or video). |
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

### 🆕 LEAD-CAPTURE / FORM SYSTEM (NEW — Priscila 2026-06-09, plan for next tasks — do NOT use mailto)
**Problem she flagged:** `mailto:` links (e.g. the "Email OPC" button) only work if the visitor's computer has a desktop mail client configured. Most don't → the link does nothing → lead lost. We must NOT rely on the visitor's email app.

- **FORM-1 — Real server-side form (replaces every mailto link).** Proper form (name, phone, zip, message — matches the "START A PROJECT" glass card screenshot) that POSTs to a backend and emails OPC directly. Candidate backends (free/cheap, GH-Pages-compatible): Formspree / Web3Forms / Basin / our own GitHub Action or serverless endpoint. Keep "Call" + styled email line, but the PRIMARY CTA is the form, not mailto.
- **FORM-2 — Two-stage progressive email capture (the key idea).** The "CONNECT / Your email…" box captures the email the INSTANT it's submitted — BEFORE the full form. Then a fuller form pops up (name/phone/zip/project). If the visitor abandons the popup, **we still have their email** and OPC still gets a "someone tried to contact you" notification. Flow: (a) email submitted → fire capture immediately, (b) open detailed form modal, (c) modal submit → full lead, (d) abandon → partial lead still recorded + emailed.
- **FORM-3 — Source-page tracking.** Every submission must include which page it came from (e.g. "came from /services/stucco.html") + referrer/UTM, sent in the payload and the notification email subject/body so OPC knows intent.
- **Build order when we get to it:** FORM-1 backend → FORM-3 source field (trivial) → FORM-2 progressive capture UX. One coherent system. NOT started — planned per Priscila's "organize first, plan for next tasks."

---

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
- **Tracker spreadsheet:** `1AKwzJlO8gRiTE_PL5R8jnBzOe8aDhVy-PCaZY7QWIOI` (Marketing > Claude Code Workspace)
- **Inspiration Drive folder:** `1ae7n4VwSZbu0_nt6nUX5WeLINGqYJ-CZ`
- **CodePen inspo doc (2026-06-09):** `1AQYwKAvnOf2s3i2EtXl_zMm18FGzcu_QAm-jOjRg-1c`

---

## 📝 ACTIVITY LOG (auto-appended by `/opc-website` skill after every report-back)

- **2026-06-09** — Polished forks per Priscila (commit `338d00a`): house headline 'From slab to keys' (no dot) + more left gutter + idle sway; kitchen darker/browner + scaled-to-fit (0.78) + 'Down to the studs, back to life' + idle sway + constrained drag (full-spin was causing the mustard-flash/disappearing-cream-wall backface glitch). OPEN polish: (a) headlines are judgment calls — easy to swap if she wants different copy; (b) left-gutter consistency should be extended to ALL service pages (stucco/bath use different paddings); (c) kitchen drag glitch is mitigated via constrained range, not a true z-fighting fix — verify on live.
- **2026-06-09** — SHIPPED Ricardo forks: **#10· New Construction House 3D** (`new-construction-house3d.html`) + **#11· Kitchen Room 3D** (`kitchen-room3d.html`). Forked from yLOpNdZ + LYxMWQN via cdpn fullpage source, recolored to OPC palette only (luminance ramp → cream/walnut/obsidian, glass → lime). Screenshot-verified before ship. Lab-banner + index cards + tracker + cache-bust ?v=10 across 28 files. Kitchen keeps drag-rotate + click-open, audio stripped. KKbWGNZ still pending Priscila's call.
- **2026-06-09** — RICARDO PEN SOURCE RECOVERED via `cdpn.io/<user>/fullpage/<hash>` (clears Cloudflare, real code). Findings: **yLOpNdZ (house) + LYxMWQN (kitchen) are CSS-3D** (preserve-3d + hundreds of `.face` divs, NOT Three.js) → fork+recolor is clean hex swap. **KKbWGNZ is the only real Three.js** = baked GLTF interior room (model.glb + baked.jpg, OrbitControls) → colors baked into the texture, CANNOT recolor to OPC without Blender re-bake. KKbWGNZ decision pending.
- **2026-06-09** — Batch fixes shipped (commit `b2e7866`): combined-lumen transform title left-aligned to match other section titles; CBC prefix restyled to small mono label (like FL STATE LICENSED); bathroom 'never' serif enlarged to 1.5em feature size like combined hero; contact 'Mike direct' → 'Michael & Matthew' (Matt is co-owner); stucco labels translateZ(150px) so tilted planes stop covering FINISH COAT text.
- **2026-06-09** — NEW lead-capture/form system logged to Pending (FORM-1 server-side form replacing mailto, FORM-2 two-stage progressive email capture, FORM-3 source-page tracking). Planned, not started, per Priscila.
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
