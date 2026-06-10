# OPC Website — Handoff (2026-06-10, end of session)

Next chat: read `OPC_WEBSITE_STATE.md` + `OPC_WEBSITE_IMPLEMENTATION_PLAN.md` first. This handoff lists what's NOT finished + the ready-to-paste content that was drafted in chat (and exists nowhere else).

**Canonical tracker:** `1q0_v9qYDXKURo59xoS-WISFdHbZWIdc9ukdCDbdDaUQ` ("OPC Website — Build Tracker", in Marketing › Website Projects). Higashi has its own separate tracker (`1nvnb_QnjPpNTjI1N3KaHn4D6dlitJEc7bDEasXBmz-I`).

---

## ✅ Shipped this session (don't redo)
- All 9 service pages now uniform dark template (stucco was the last outlier — fixed, commit `5056827`).
- County pages (Broward/Palm Beach/Miami-Dade) rebuilt dark. About, combined-lumen (glow restored, cursor removed), contact-atmosphere, house-3D glitch — all fixed.
- `home-b.html` converted to dark; `how-it-works.html`, `404.html`, favicon, manifest, sitemap.
- contact.html + projects.html MVPs exist. Privacy MVP exists.
- Two-tracker cleanup: OPC duplicate archived, Higashi tracker created, skill repointed.

## 🔧 NOT finished — tell the next chat to do these (priority order)
1. **Promote `home-b.html` → `index.html`** (Phase 1). Follow the exact QA checklist in `OPC_WEBSITE_IMPLEMENTATION_PLAN.md` §2 (robots→index, title, meta desc, canonical, OG/Twitter, port GeneralContractor schema, **REMOVE lab-banner script**, CTAs → `/contact.html`, keep old as `index-legacy.html`). Use the TRUE trust band below — **no fabricated rating/testimonials.**
2. **Real contact-form backend** (FORM-1/2/3). contact.html is `action="#"`. NEEDS Priscila: a free Web3Forms or Formspree access key tied to her email. Then wire source-page hidden field + two-stage email capture (capture email before full form; save on abandon). Microcopy below.
3. **Analytics.** No GA4/GTM anywhere. NEEDS Priscila: GA4 Measurement ID + Search Console verification. Then add call-click + form-submit conversion events.
4. **Build the 3 city SEO pages** — copy is PASTE-READY below. Use the dark service template. Boca Raton links `/areas/palm-beach.html`. Add to sitemap + internal-link from county + service pages.
5. **Bathroom real-3D** (#39) — BLOCKED on decision: Priscila drops a 3D bathroom CodePen to fork, OR approves building an isometric bath cutaway from scratch.
6. **Bedroom fork (KKbWGNZ) → Additions** — Priscila chose Additions. Baked GLTF room (warm/on-palette), can't recolor → use as-is. Not built.
7. **Terms page** (privacy MVP exists; Terms required before running Google Ads).
8. **Projects gallery** — expand beyond the 12-photo MVP; add before/after sliders to remodel services (double-slider inspo saved in tracker).
9. **State.md** still has older prototype tables lower down — fine, but the top "CURRENT TRUTH" block is authoritative.

## Blocked-on-Priscila (the only things she must supply)
- Web3Forms/Formspree key (form backend) · GA4 ID + GSC verification · real Google rating + review count + 2–3 attributed customer quotes · bathroom-3D source decision.

---

## TRUE social-proof band (ship-now, all verifiable — NO invented rating)
- Licensed & insured — FL GC **CBC1263425**
- Est. 2017 in South Florida (20+ yrs in the trade)
- Owner-led — Michael & Matthew on every job
- 3 counties — Broward · Palm Beach · Miami-Dade
- 9 trades in-house

Drop-in once real reviews exist: `★ 4.x (NN Google reviews)` + 2–3 quotes `"…" — First L., City` + `AggregateRating`/`Review` schema. Until then, ship without.

---

## READY-TO-PASTE CITY SEO COPY (~1,200–1,500 words each)
> Mark `[VERIFY PRICING]` = keep qualitative line, no numbers until Mike confirms.

### `areas/stucco-contractor-fort-lauderdale.html`
- **Title:** Stucco Contractor in Fort Lauderdale | Repair, Recoat & Restucco — Oak Park Construction
- **Meta:** Licensed Fort Lauderdale stucco contractor (CBC1263425). Stucco repair, recoat, and full restucco built for South Florida salt-air and storms. Owner-supervised, free on-site estimate.
- **H1:** Fort Lauderdale Stucco Contractor
- **H2 Stucco built for Fort Lauderdale's salt-air:** Licensed FL GC (CBC1263425) building across Broward since 2017; stucco treated as a layered system, not a coat of paint. Las Olas crack chase to a Victoria Park full restucco — same owner-led crew start to finish.
- **H2 One-coat stucco is three coats short:** failures trace to fast spray jobs; real stucco = lath, scratch, brown, finish; salt-air punishes shortcuts → hairline cracks, brown stains, hollow spots.
- **H2 The OPC 4-coat system:** Lath & paper · Scratch · Brown · Finish (each its own cured day). Link `/services/stucco.html`.
- **H2 Common Fort Lauderdale stucco problems:** hairline/map cracking · water intrusion & brown staining · hollow/drummy spots · salt-air spalling on waterfront walls · failed one-coat patches.
- **H2 Repair, recoat, or full restucco?** honest call, no upsell.
- **H2 Neighborhoods:** Victoria Park · Las Olas · Coral Ridge · Rio Vista · Colee Hammock · Wilton Manors · Poinsettia Heights · Croissant Park.
- **H2 Our process:** Consult → assessment & estimate → prep & lath → coat-by-coat → cure & finish → walk-through. Owner on site, daily photos.
- **FAQ:** cost to restucco [VERIFY PRICING] · how long stucco lasts · repair vs restucco · permits · licensed & insured.
- **CTA:** Get your free Fort Lauderdale stucco estimate → (954) 258-6769
- **Links:** /services/stucco.html · /areas/broward.html · /contact.html  **Schema:** Service + GeneralContractor + FAQPage + BreadcrumbList (Home›Areas›Broward›Stucco).

### `areas/bathroom-remodeling-fort-lauderdale.html`
- **Title:** Bathroom Remodeling in Fort Lauderdale | Tub-to-Shower & Full Remodels — Oak Park Construction
- **Meta:** Licensed Fort Lauderdale bathroom remodeling contractor (CBC1263425). Tub-to-shower conversions to full gut remodels, built waterproof for South Florida humidity. Free on-site estimate.
- **H1:** Fort Lauderdale Bathroom Remodeling
- **H2 Built to last in South Florida humidity:** waterproofing is the whole job; system built right behind the tile; GC CBC1263425, owner on site daily.
- **H2 The part you never see matters most:** cement board, waterproof membrane, slope to drain before tile. Link `/services/bath.html`.
- **H2 What we build:** tub-to-shower (curbless, bench, niche, frameless glass) · full gut · primary & guest · aging-in-place.
- **H2 Process:** Consult → design & selections → permit → demo → waterproof & build → reveal.
- **H2 Cost:** scope-driven, firm line-item estimate after walk [VERIFY PRICING].
- **H2 Neighborhoods:** Victoria Park · Las Olas · Coral Ridge · Rio Vista · Wilton Manors · Poinsettia Heights · Colee Hammock.
- **FAQ:** timeline (3–5 wks) · why waterproofing matters here · tub-to-shower · permits · stay-in-home.
- **CTA/Links:** (954) 258-6769 · /services/bath.html · /areas/broward.html · /contact.html  **Schema:** Service + GeneralContractor + FAQPage + BreadcrumbList.

### `areas/kitchen-remodeling-boca-raton.html`  ⚠️ Boca = PALM BEACH county → link `/areas/palm-beach.html`
- **Title:** Kitchen Remodeling in Boca Raton | Custom Cabinetry & Full Remodels — Oak Park Construction
- **Meta:** Licensed Boca Raton kitchen remodeling contractor (CBC1263425). Custom cabinetry, full gut remodels, owner-supervised. Serving Palm Beach County. Free on-site estimate.
- **H1:** Boca Raton Kitchen Remodeling
- **H2 Built whole:** design + build as one project; owner on site daily; GC CBC1263425 serving Palm Beach County.
- **H2 We build cabinets, not just buy them:** real soft-close boxes sized to the room. Link `/services/kitchen.html`.
- **H2 Refresh to down-to-the-studs:** refresh · full gut · open-concept · island & storage.
- **H2 Process:** Consult → layout/cabinetry/finish selections → permit → demo → build → reveal.
- **H2 Cost:** refresh vs full gut, line-item, no vague allowances [VERIFY PRICING].
- **H2 Neighborhoods:** East Boca · Royal Palm Yacht & CC · Boca Bath & Tennis · Old Floresta · Boca Square · Mizner Park area + Delray, Boynton, Wellington, Jupiter.
- **FAQ:** timeline (4–8 wks) · do you build cabinets · stay-in-home · serve all Palm Beach County · licensed & insured.
- **CTA/Links:** (954) 258-6769 · /services/kitchen.html · **/areas/palm-beach.html** · /contact.html  **Schema:** Service + GeneralContractor + FAQPage + BreadcrumbList.

---

## CONTACT FORM MICROCOPY
- **Helpers:** Name "So we know who we're talking to." · Phone "Best number to reach you — we don't share it." · Email "Where we'll send your estimate." · ZIP "Helps us confirm we serve your area." · Service "Pick the closest — 'Not sure yet' is fine." · Message "A sentence is plenty. Timeline, budget range, and what you're picturing all help."
- **Errors:** Name "Please add your name so we can address you properly." · Phone "Please enter a phone number we can reach you at." · Email "That email doesn't look right — mind double-checking?" · ZIP "Please add your ZIP or city so we can confirm we serve you." · Empty submit "Almost there — a few fields still need filling in." · Network "Something went wrong on our end. Please try again, or call us at (954) 258-6769."
- **Success:** "Got it — thank you. Michael or Matthew will reach out within one business day. Need us sooner? Call (954) 258-6769."
- **Privacy note:** "We only use your details to respond to your inquiry — no spam, never sold. By submitting, you agree to our Privacy Policy."
- **Abandoned email follow-up (FORM-2):** Subject "Your Oak Park Construction estimate — want to finish telling us?" Body "Hi — you started reaching out to Oak Park Construction but didn't finish. No pressure. Whenever you're ready, reply with a sentence about your project, or call Michael or Matthew at (954) 258-6769. — Oak Park Construction · Licensed FL GC CBC1263425" Internal notify subject: "New partial lead (email only) — from [source_page]".

## PROJECTS GALLERY COPY
- Hero: "Built, not rendered." / "Real Oak Park Construction projects across Broward, Palm Beach & Miami-Dade — from slab to keys, by the same owner-led crew on every job."
- Filters: All · New Construction · Kitchens · Bathrooms · Stucco · Outdoor · Concrete · Decks · Commercial
- CTA: "See one you'd want for your home? — Get a free estimate → (954) 258-6769"
- Alt-text pattern: `[Service] — [project/location] — [what's shown], Oak Park Construction, [County]` (under ~125 chars, describe subject, no "image of").
