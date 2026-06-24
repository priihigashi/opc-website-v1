# OPC Website — Implementation Plan (auditable)

**Created:** 2026-06-10 · **Owner:** Claude/Codex · **Repo:** priihigashi/opc-website-v1
**Source of truth:** `OPC_WEBSITE_STATE.md` + Tracker sheet `1q0_v9qYDXKURo59xoS-WISFdHbZWIdc9ukdCDbdDaUQ` — **OPC Website — Build Tracker**, in Marketing (shared drive) › Website Projects › 'OPC Website — Build Tracker' (canonical; old `1AKwzJlO8gRiTE_PL5R8jnBzOe8aDhVy-PCaZY7QWIOI` archived)
**Live:** https://priihigashi.github.io/opc-website-v1/

This doc is written so **Codex can audit each line**: every task has a **STATUS**, an **Audit check** (a concrete, verifiable test), and the **files** involved.

---

## 2026-06-24 audit overlay — canonical execution rows

The live execution plan is now the tracker's merged five-phase backlog, rows **T-142..T-157**, mirrored in `OPC_WEBSITE_STATE.md`. Treat older phase numbers below as historical context unless they agree with those tracker rows.

**Current gate:** **T-154 — LOCK HOME HERO DIRECTION** is Priscila-only. There are multiple viable hero directions in the project history (`Version-B` light/live index, dark-lime-glass, Novobudowa dark-luxury, Arc hero-video). Do not add more parallel hero experiments until this is decided.

**Recommended next build:** conversion plumbing first, not another prototype:
- **T-142** real server-side form backend is blocked on a Web3Forms/Formspree/Basin/serverless key.
- **T-143** legacy `mailto:` cleanup is **done 2026-06-24**: `about.html`, `privacy.html`, `index-legacy.html`, and lab `prototypes/contact-atmosphere.html` now route to `contact.html`; `rg "mailto:" --glob "*.html"` returns zero.
- **T-144** source/referrer/UTM fields and **T-146** GA4/call/form conversions are the next non-visual lead leaks to close once IDs/keys exist.

---

## PART A — AUDIT OF THE PROPOSED PHASE PLAN (the one pasted 2026-06-10)

The proposed plan's **strategy is correct**: stop building new prototypes, finish the commercial MVP, then SEO → analytics → gallery. Adopt that. But several **specifics are stale** — they describe a snapshot from *before* the 2026-06-09 work. Corrections:

| Proposed plan said | Reality (verify in git log / files) | Verdict |
|---|---|---|
| "Service pages still need to be built (Phase 2)" | 8 service pages were rebuilt **dark, with real content** on 2026-06-09 (hero + intro + included grid + 5-step process + real photo gallery + FAQ + CTA). Stucco remains the old/light outlier with a fake `action="#"` form and `mailto`. Commits `79d7085`, `3033e10`. | ⚠️ STALE — 8 content pages DONE; stucco needs cleanup; 3D hero component + before/after + real testimonials + forms remain |
| "Bathroom direction = Waterproofing Wall Section (#15)" | Priscila **rejected** #15: *"looks even worse than before"*, *"should be a bathroom 3d not tiles here on the left."* | ❌ WRONG — #15 is rejected; bathroom needs a **real 3D object**, source TBD |
| "Promote Bathroom #15 → replace #09; Floor Plan #16 → replace Wireframe #03" | Superseded. The line-art/CSS prototypes were replaced by **Ricardo forks**: #10· House 3D (`new-construction-house3d.html`), #11· Kitchen Room 3D (`kitchen-room3d.html`). #15/#16/#17 all flagged not-good. | ❌ WRONG — these promotions are obsolete |
| "Homepage hero = Floor Plan→3D Reveal OR Sequential Assembly" | Both **disliked** by Priscila (blueprint lines / line-art, *"I never asked for lines"*). | ❌ WRONG — see locked direction below |
| "Stucco 4-layer slice = approved" | The CSS slice exists (#17) but Priscila flagged it *"should be a 3d object, not lines/CSS layers."* Scroll-timing was fixed (`968188c`). Price-defense rationale is valid; execution contested. | ⚠️ PARTIAL |
| "Defer cursor orb + glow effects" | Cursor was **removed** on request (`8b32264`); the lime glow was **restored** on explicit request. | ⚠️ Already actioned, opposite of "defer" |
| "I can't edit the repo / repo not indexed / need a handoff" | That is the *other assistant's* connector limitation. The working agent (Claude/Codex in `~/ClaudeWorkspace/opc-website/`) has **full local edit access** and has been committing directly. | ℹ️ N/A to repo-resident agents |

**What the proposed plan got RIGHT and we adopt:**
- City-level local-SEO pages (e.g. "Stucco Contractor Fort Lauderdale") — real gap, **none exist** (only county pages). ✅ adopt as Phase 4.
- Analytics (GA4 / Search Console / GTM / call + form tracking) — **none installed**. ✅ adopt as Phase 3 (critical).
- Projects gallery from real Drive photos — **does not exist**. ✅ adopt as Phase 5.
- Before/After on service pages — not built. ✅ folded into Phase 2.
- Defer *new* prototypes / AI morph / experiments — ✅ agree.

### Locked direction (Priscila, 2026-06-09) — the premise the proposed plan is missing
- **Design system = dark / lime / glass** (the `combined-lumen-vision` + `contact-atmosphere` look). Light "Version B" parked (maybe Higashi). Decisions Log row logged.
- **Hero objects = Ricardo-style rendered 3D, recolored to OPC palette** (fork pens), NOT line-art, NOT CSS layered planes, NOT blueprints.
- Production homepage candidate = **`home-b.html`** (dark, full-bleed real-photo hero + numbered services + owners + areas + CTA).

---

## PART B — CURRENT STATE (verified 2026-06-10, audit each)

**DONE / LIVE:**
- ✅ 8 service pages dark + real content + per-page SEO (title/desc/canonical/OG/Service JSON-LD) plus FAQPage + BreadcrumbList schema. ⚠️ `services/stucco.html` is still the old/light outlier. *Audit: run the service audit loop; stucco reports `dark=no`, `FAQ=no`, `mailto=yes`, `form=yes`.*
- ✅ About dark/glass; combined-lumen (glow restored, cursor removed); contact-atmosphere fits viewport; 3 county pages dark with GeneralContractor schema. *Audit: `grep -c FAQPage`, visual check.*
- ✅ Ricardo 3D forks: `new-construction-house3d.html` (#10·), `kitchen-room3d.html` (#11·), z-fighting fixed (non-rotating float). *Audit: drag kitchen, watch house sway — no devil-flash.*
- ✅ `home-b.html` dark, `how-it-works.html` (HowTo schema), `404.html`, `favicon.svg`, `site.webmanifest`, `sitemap.xml`, `robots.txt`. Favicon injected sitewide.

**NOT DONE (the real gaps):**
- ❌ No analytics snippets in production HTML. *Audit: `rg -n "gtag|googletagmanager|GTM-" --glob "*.html" .` → empty.*
- 🟡 Contact page MVP exists at `/contact.html` with source-page/referrer hidden fields and sticky mobile Call/Quote bar, but the backend is still a placeholder `action="#"`. *Audit: open `contact.html`; backend TODO visible in source; no Formspree/Web3Forms key installed yet.*
- ❌ No city-level SEO pages (only county). *Audit: `ls areas/` → broward/palm-beach/miami-dade only.*
- 🟡 Projects gallery MVP exists at `/projects.html` with 12 verified real OPC photos and category filters. Next: expand with more Drive photos and project-detail pages. *Audit: open `projects.html`; filter buttons work; sitemap contains projects URL.*
- ❌ Production `index.html` is the old homepage, not the dark `home-b` direction. *Audit: diff `index.html` vs `home-b.html`.*
- ❌ Service-page **3D hero objects** not embedded into the real `services/*.html` (the forks live only as `prototypes/*`).
- ❌ No real testimonials / reviews / AggregateRating. No before/after sliders. Privacy MVP exists; Terms page still missing before ads.

---

## PART C — IN-DEPTH PLAN (execution order, auditable)

### PHASE 0 — Decisions that block downstream work (Priscila)
- **0.1** Bathroom 3D source: provide a 3D bathroom CodePen to fork, OR approve building an isometric bath cutaway from scratch. *Blocks Phase 2 bath hero.*
- **0.2** Production homepage: promote `home-b.html` → `index.html` (dark), yes/no? *Blocks Phase 1.*
- **0.3** KKbWGNZ bedroom (baked GLTF, warm cream — on-palette): use as-is on Additions, skip, or re-bake? *Blocks Additions hero.*
- **0.4** Stucco hero: keep the CSS 4-coat slice (fix to read as solid 3D) vs source a real 3D pen. *Blocks Stucco hero.*

### PHASE 1 — Production Homepage (highest commercial value)
- **1.1** Promote `home-b.html` (dark) to `index.html`. **Audit:** `index.html` hero = full-bleed real photo + "We build it whole" + numbered 9-service list + owners + areas + CTA; passes Lighthouse SEO ≥ 90.
- **1.2** Add **social proof** band: years (Est. 2017 → "20+ yrs"), # projects, Google rating (real). **Audit:** visible band with 3 stats; rating sourced from real GBP (not invented).
- **1.3** Add **Projects** teaser (links to Phase 5 gallery) + **Process** teaser (links to `how-it-works.html`) + **Testimonials** placeholder wired to real reviews (Phase 3.5). **Audit:** sections present; testimonials use real quotes or are hidden until sourced.
- **1.4** Primary CTA `Get Free Estimate` → contact/form; secondary `View Projects`. **Audit:** both CTAs present above the fold + repeated before footer.

### PHASE 2 — Service pages: finish the 3 priority heroes + proof
- **2.1 Stucco** (top priority — defends price). Hero 3D = solid-reading 4-coat slice (lath→scratch→brown→finish) OR forked 3D; + Before/After + common problems + OPC process + real projects + FAQ + estimate form. **Audit:** `services/stucco.html` has a 3D wall component that reads as a solid object (not flat stacked planes), before/after element, and a working form.
- **2.2 Bathroom** — pending 0.1. Real 3D bath object replaces the rejected CSS tiles; + waterproofing explainer + tile + before/after + portfolio + FAQ + form. **Audit:** no CSS "tile layer planes"; a recognizable 3D bathroom object on the right.
- **2.3 New Construction** — embed the approved **House 3D fork** (`new-construction-house3d`) as the hero; + sequential timeline + portfolio + financing note + estimate. **Audit:** `services/new-construction.html` hero renders the recolored 3D house (lazy-loaded), not a static photo only.
- **2.4** Add **Before/After slider** component (uses saved double-slider inspo) to remodel services (kitchen, bath, reno). **Audit:** draggable before/after on ≥3 service pages.
- **2.5** Renovation, Additions, Outdoor, Concrete, Decks — content DONE; add the same before/after + form. **Audit:** each has form + at least one proof element.

### PHASE 3 — Conversion infrastructure (do early; without it ads can't optimize)
- **3.1** Real **lead form** backend (Formspree / Web3Forms / serverless). **Status 2026-06-24:** backend still needs a key/provider; the separate legacy `mailto:` cleanup is done. **Audit:** submitting the form delivers an email to OPC + shows a success state; works on a machine with no mail client.
- **3.2** Two-stage progressive email capture (capture email on first field, save even on abandon) + **source-page** field. **Audit:** payload/notification includes which page it came from.
- **3.3** **Dedicated dark Contact page** (form + map + phone) replacing the `#contact` anchor. **Audit:** `/contact.html` exists, dark, with source tracking; backend endpoint still needs Formspree/Web3Forms/Basin key.
- **3.4** **GA4** + **Google Search Console** + **GTM**. **Audit:** `gtag`/GTM container present sitewide; GSC property verified; sitemap submitted.
- **3.5** **Call tracking** (`tel:` click → GA event) + **form-submit** conversion event. **Audit:** clicking the phone fires a GA event; form submit fires a conversion.
- **3.6** **Sticky mobile Call/Quote bar** (always-visible CTA on phones). **Audit:** fixed bar visible < 768px with Call + Quote.

### PHASE 4 — Local SEO (city × service pages)
Create indexable, schema-rich pages (1,200–1,800 words, real photos, FAQs, LocalBusiness/Service schema), e.g.:
- `areas/stucco-fort-lauderdale.html`, `stucco-oakland-park`, `stucco-pompano-beach`
- `general-contractor-fort-lauderdale`, `bathroom-remodeling-fort-lauderdale`, `kitchen-remodeling-fort-lauderdale`
**Audit:** each page word count ≥ 1,200; has ≥4 FAQs + FAQPage schema; in `sitemap.xml`; internally linked from the matching county + service page. (Tracker #23.)

### PHASE 5 — Projects gallery
Pull real photos from the New Construction shared drive; build a filterable gallery (by service + county) using the saved slider/showcase inspo. **Audit:** `/projects.html` (or gallery) lists ≥12 real projects, filter works, each has alt text; linked from homepage + nav. (Tracker #18.)

### PHASE 6 — Performance, polish, legal
- **6.1** WebP + `width`/`height` on Mike's JPEGs (stop CLS). **Audit:** Lighthouse CLS < 0.1; images served WebP.
- **6.2** Lazy-load Three.js / heavy heroes via IntersectionObserver + static fallback. **Audit:** LCP < 2.5s on a service page.
- **6.3** Accessibility: skip-link, `focus-visible`, aria labels, contrast audit. **Audit:** Lighthouse a11y ≥ 90.
- **6.4** Legal: Privacy Policy + Terms (**required before running Google Ads**). **Audit:** `/privacy.html` exists and is linked from contact; `/terms.html` still needs to be created and linked in footer.

### PHASE 7 — Deferred (do NOT spend time here until 1–6 ship)
New prototypes, AI wireframe→photo morph, CodePen experiments, extra cursor/glow tuning. (Keep the glow + removed cursor as-is.)

---

## EXECUTION ORDER (shortest path to leads)
1. Phase 0 decisions (Priscila) → 2. Homepage (1.1–1.4) → 3. Real form + Contact page + sticky bar (3.1–3.3, 3.6) → 4. Analytics + tracking (3.4–3.5) → 5. Stucco hero + before/after (2.1, 2.4) → 6. New Construction hero (2.3) → 7. Bathroom hero (2.2, after 0.1) → 8. Local SEO city pages (4) → 9. Projects gallery (5) → 10. Performance + legal (6).

**Definition of "MVP done":** dark homepage live as `index.html` · all 9 service pages with working forms · a real lead form delivering email · GA4 + conversion tracking firing · sticky mobile CTA · privacy/terms live · sitemap submitted to GSC.

---

## Tracker cross-reference
Open items already logged in Pending Tasks: forms (#15, #54), tracking (#16), sticky bar (#56), service 3D heroes (#17), gallery (#18), GBP/NAP (#19), PPC pages (#20), testimonials (#21), city pages (#23), WebP (#24, #60), before/after (#55), maps (#57), org schema (#58), internal linking (#59), Why-OPC (#62), legal (#63), a11y (#64), home FAQ (#65), bathroom 3D (#39), KKbWGNZ (#27), stucco 3D (#7). This plan groups them into auditable phases; the tracker remains the live checklist.
