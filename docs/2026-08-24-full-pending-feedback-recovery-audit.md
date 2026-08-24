# ChatGPT — OPC Full Pending-Feedback Recovery Audit — 2026-08-24

DISCOVERY / RECONCILIATION ONLY. No website code was modified by this audit.

## Access limitations (stated honestly)
- The Google Sheets build tracker and all five Google Docs are sign-in gated from this
  environment. Tracker row statuses and old chat wording could NOT be read or updated.
  Where the tracker is the only source, this report says "specific wording not recovered".
- Google Drive is not accessible, so the report is delivered as this repo document
  instead of a Drive file. It should be copied into the Drive folder and Report Log
  by someone with access.
- Sources actually used: the uploaded "Emergent Visual Corrections Addendum — 2026-08-24"
  (T-230 / panel timing / filtered grid, full acceptance criteria), the uploaded
  "Launch-Today Audit & 10-Step Execution Handoff", the repo at d3ccb1d (base) and the
  pending launch branch `launch/opc-launch-today-2026-08-24` (commits 098f6bf, 616f066),
  git history (110 commits), `/app/docs/*` (43 working documents), `/app/memory/PRD.md`,
  `/app/memory/visual_fix_checklist.md`, `AGENTS.md`, and the live import chain read from
  `src/index.js` outward.

## Baseline verified
- Live chain at audit time: `index.js → AppV3.js → DeferredHouseStageV5 → HouseSceneV27
  → HouseSceneV19 + HouseModelV25 → parts (EnvelopeV9, AdditionV6, BackyardV3, DrivewayV5,
  InteriorV2, LandscapeV2, Shell)`.
- On the pending launch branch the orphaned `App.js` / `AppV2.js` were already deleted and
  the 13-project verified portfolio was already reconciled (see items R-04, R-16 below).

---

# 1. COMPLETE RECOVERED-PENDING LIST

### R-01 — T-230 — Shell Construction must look like the bones of a real house
- Area: Homepage chapter 01 (3D house, "The bones come first")
- Requested: shell state must read as the structural bones of the SAME house — real
  openings, columns, headers/lintels/tie beams, slabs, believable load path. Not a solid
  lime block, not mere transparency, no fake wood studs if wrong for South Florida.
- Current state: live `three/parts/Shell.jsx` builds large `boxGeometry` wall slabs;
  `HouseModel.jsx` (line ~309–313) lerps that shell material to OPC lime → whole massing
  reads as a highlighted solid volume.
- Evidence: code read on live chain; addendum Correction 01.
- Classification: OPEN (was misfiled post-launch per addendum). Priority: MUST FIX BEFORE LAUNCH.
- Files: `frontend/src/three/parts/Shell.jsx`, `frontend/src/three/HouseModel.jsx`
  (shell material track), relationship to `EnvelopeV9` openings.
- Acceptance test: first-time visitor identifies "structural shell of the house" without
  reading the panel; openings stay open; columns/headers/tie-beams/slabs visible; no
  floating members; reads correctly desktop/tablet/phone; lime highlights members, not
  the whole volume. FAIL if it still reads as a yellow box.

### R-02 — T-258 — Chapter panel must not cover the transformation reveal
- Area: Homepage chapters 01–05 choreography
- Requested sequence: transformation → completed house → brief hold → panel BESIDE house
  → panel exits → completed house alone briefly → next transformation. Responsive: panel
  must never obscure the chapter focal feature; stacking on narrow phones acceptable.
- Current state: `ChapterV3` panels fade in once (`whileInView`, `once: true`) and simply
  scroll with their 170vh section. No explicit exit-beat/hold choreography tied to the
  house track. Only ch-03 (Additions) carries a hand-tuned `panelLayout` + `compact`
  mitigation — evidence the problem was seen and patched once, on one chapter only.
- Evidence: `StoryV13.jsx` (ch-03 panelLayout), `ChapterV3.jsx` (once-only reveal),
  `HouseModelV25.jsx` tracks (holds exist but are not synchronized to panel exits).
- Classification: OPEN. Prior full implementation: specific wording/commit not recovered
  (addendum states the requirement fell through the tracker/version chain — treated as
  probable built-then-dropped, unproven). Priority: MUST FIX BEFORE LAUNCH.
- Files: `frontend/src/components/ChapterV3.jsx`, `StoryV13.jsx`,
  `frontend/src/three/HouseModelV25.jsx` (track keyframes), `scrollStore`.
- Acceptance test: per chapter — final state visible while panel present; panel beside,
  never over, the focal feature at 390/768/1440 widths; hold while panel visible; panel
  leaves before next transformation ramp; house alone for a beat after exit; no abrupt jump.

### R-03 — T-259 — Filtered portfolio grid must balance card geometry per result set
- Area: /portfolio filtered views (example: FULL HOME REMODELS)
- Requested: two results → equal visual weight/geometry; three → intentional 1+2 pattern
  allowed if composition completes; larger sets → featured rhythm only when rows complete;
  mobile single column consistent; never crop photography to force the pattern.
- Current state: `PortfolioV7.jsx` `ProjectCard` applies `md:col-span-2` + 16:8 whenever
  `project.featured` is true, independent of filtered count. Dataset featured flags are
  Victoria Park + Kinney Shell Build (top and 4th by imageCount). FULL HOME REMODELS
  therefore renders Victoria Park wide + Dockside small — exactly the reported defect.
- Evidence: code read; dataset `featured` flags; addendum Correction 03.
- Classification: OPEN. Priority: MUST FIX BEFORE LAUNCH.
- Files: `frontend/src/pages/PortfolioV7.jsx` (layout decision must consider
  `shown.length`), `frontend/src/data/portfolioProjectsV3.js` +
  `scripts/generate-portfolio-data.py` (featured flags stay as data; layout logic in view).
- Acceptance test: for every one of the 8 filters: 1 result → single full-width or
  centered card, no orphan; 2 → identical geometry; 3 → balanced 1+2 or 3 equal;
  ALL view keeps current editorial rhythm; mobile stacks consistently; no new cropping.

### R-04 — T-242 — Before/After multi-row project galleries
- Requested: project galleries show construction sequence, multiple rows per project.
- History: built at f26178e, dropped by the PortfolioV2–V7 chain (recorded as LOST in
  `src/__contract__/featureContract.test.mjs`, T-242).
- Current state: FUNCTIONALLY RESTORED on the pending launch branch via the verified
  T-203/T-204 dataset — every project has phase-ordered rows and per-slide
  Before/During/Finished chips in `ProjectGalleryV3`.
- Classification: REGRESSED → restored (pending review of launch branch).
- Remaining action: promote the LOST contract entry to REQUIRED with a dataset-aware
  check (row/phase presence in `portfolioProjectsV3.js` + phase chip render in
  `ProjectGalleryV3.jsx`), so it can never silently drop again. Priority: with the
  implementation batch (hygiene, not visitor-facing).

### R-05 — Services headline + first-scroll motion committed to an orphaned file
- History: commit 844a130 applied both fixes to `App.js`, which nothing imports —
  reported done while the live site was unchanged. Corrected in d3ccb1d; the launch
  branch then deleted `App.js`/`AppV2.js` entirely and the feature-contract test now
  resolves the entry from `index.js`, making this failure class structurally impossible.
- Classification: FALSE DONE (historical) → ACTIVE AND CORRECT. No action.

### R-06 — T-245 — Centred-house hero composition
- Current state: implemented ONLY at `/preview/centered-house` (HouseSceneV28 +
  HouseModelV26); production route intentionally untouched pending Priscila's choice.
- Classification: OPEN DECISION (not a defect). Priority: CAN FIX AFTER LAUNCH
  (or decide during preview review).

### R-07 — Contact email delivery configuration (operational, not code)
- Current state: `api/enquiries.mjs` is live-path and tested (49 tests; rate limiter now
  keys on the IP digest). Until `OPC_LEAD_TO` / `OPC_SMTP_USER` / `OPC_SMTP_PASS` are set
  in the Vercel project, the API answers 503 `config_pending` and the site opens the
  visitor's mail app — no lead is silently lost, but no email is delivered either.
- Classification: OPEN (configuration). Priority: LAUNCH-DAY CONFIG — strongly
  recommended before cutover; the mailto fallback keeps it from being a hard blocker.
- Acceptance test: submit the form on the final preview with envs set → email received;
  remove envs → visible mail-app fallback with explanatory copy.

### R-08 — Real project photography replacing placeholders (old PRD P1)
- Classification: DONE on the pending launch branch — 13 verified projects, 79 images,
  948 responsive derivatives, all provenance traced to the T-203 EXPORT_MANIFEST.
  ACTIVE (pending review).

### R-09 — Blog restoration + CMS decision (+ Article markup for blog routes)
- Classification: POST-LAUNCH BY CHOICE (restart handoff 2026-08-19; launch package).

### R-10 — Search Console ownership / DNS verification
- Classification: POST-LAUNCH / external dependency (SEO final pass doc). Requires
  domain access — explicitly out of scope until production cutover is approved.

### R-11 — Analytics activation (GA4 / GTM)
- Current state: fully built and inert until `REACT_APP_GA4_ID` (or GTM id) is set;
  privacy page reflects actual state automatically; consent mode v2 defaults denied.
- Classification: OPEN DECISION at launch. Priority: launch-day config, not a blocker.

### R-12 — Upper-wall shadow flash during intro
- History: repaired via EnvelopeV9 (commit 949db82). The launch branch's first-real-frame
  gate now EXPOSES the first frames instead of hiding them behind a 2.4s cover; browser
  verification on the launch branch showed no stipple/flash on desktop or mobile.
- Classification: ACTIVE AND CORRECT (re-verify on the final Vercel preview).

### R-13 — Truthful positioning (no "Since 1998", no invented counters, no "09/01/FL")
- Classification: ACTIVE AND CORRECT (`AboutV3`, `MarqueeV2` on live chain; truthful
  positioning ledger honored). Guard: any future About page must not reintroduce
  unverified claims.

### R-14 — Contact detail alternating emphasis (phone/counties semibold; email/languages regular)
- Classification: ACTIVE AND CORRECT — survived ContactV4 → ContactV6 (props preserved).

### R-15 — Cleaned portfolio hero montage v5 (playroom + mirror reflections removed)
- Classification: ACTIVE AND CORRECT (`portfolioHeroMedia.js`, reversible via
  `REACT_APP_PORTFOLIO_HERO=full`). The launch branch deliberately did NOT take the
  t204 branch's older v2 montage reference.

### R-16 — Opa Locka Airport = CONCRETE / concrete-repair (not Commercial Build-Out)
- Classification: CORRECTED on the pending launch branch (dataset + SEO route + generator
  override so regeneration cannot reintroduce it). ACTIVE (pending review).

### R-17 — Mobile menu discoverability, sticky filter contrast, first gallery row above fold
- Classification: ACTIVE AND CORRECT (commits 2e8a5ac, cc0df44, 2cd8755 in ancestry;
  components on live chain).

### R-18 — 2026-08-17 house-geometry checklist (windows, entry stack, cutaway layers…)
- Classification: ACTIVE (spot-verified via launch-branch browser screenshots: no roof/wall
  gaps, no missing walls, coherent geometry through first scroll). Full re-verification
  belongs to the final-preview QA pass.

### R-19 — About page, Liquid Glass polish, perfect centering, broad refactors
- Classification: POST-LAUNCH BY CHOICE (launch package explicitly excludes them).

### R-20 — Admin enquiries page / MongoDB storage (old PRD P2)
- Classification: SUPERSEDED INTENTIONALLY — architecture moved to Vercel serverless
  e-mail with no database; privacy page matches. No action.

---

# 2. MUST-FIX-BEFORE-LAUNCH
1. R-01 / T-230 — Shell bones (3D)
2. R-02 / T-258 — Chapter panel timing/placement choreography
3. R-03 / T-259 — Filtered portfolio grid balance
(+ R-07 SMTP env config as a launch-day operational step, and Priscila's visual approval
of the single final preview — both non-code.)

# 3. POST-LAUNCH
R-06 (centred-hero decision), R-09 (blog/CMS + article markup), R-10 (Search Console),
R-11 (analytics activation decision), R-19 (About/Liquid Glass/design refinement),
R-04's contract-promotion hygiene if not done inside the batch.

# 4. PREVIOUSLY CALLED DONE BUT NOT ACTUALLY ACTIVE
1. Services headline + first-scroll retiming (844a130 → orphaned App.js) — since corrected.
2. T-242 Before/After multi-row galleries — marked done historically, absent from routed
   PortfolioV2–V7 chain until the current launch-branch restoration.
(T-230 was mis-bucketed post-launch rather than falsely done.)

# 5. BUILT THEN DROPPED
1. T-242 multi-row Before/After galleries (proven: f26178e → LOST list) — restored.
2. T-258 chapter-panel choreography (probable — ch-03-only mitigation survives; the
   original full implementation could not be located in git: specific wording not recovered).

# 6. FILES / COMPONENTS INVOLVED
- `frontend/src/three/parts/Shell.jsx`, `frontend/src/three/HouseModel.jsx` (T-230)
- `frontend/src/components/ChapterV3.jsx`, `StoryV13.jsx`,
  `frontend/src/three/HouseModelV25.jsx` (T-258)
- `frontend/src/pages/PortfolioV7.jsx` (T-259)
- `frontend/src/__contract__/featureContract.test.mjs` (T-242 promotion + new contracts)
- Vercel project env vars (R-07, R-11)

# 7. CONSOLIDATED IMPLEMENTATION PACKAGE — see section G of the chat report.

## Summary numbers
- A. Unresolved requests recovered (requiring action or decision): 9
  (R-01, R-02, R-03, R-04-promotion, R-06, R-07, R-09, R-10, R-11)
- B. Launch blockers: 3 (T-230, T-258, T-259)
- C. Can wait until post-launch: 6 (R-04 hygiene, R-06, R-09, R-10, R-11, R-19)
- D. Previously "Done" but not actually active: 2
- E. Regressions / built-then-dropped: 2 (1 proven, 1 probable)
- F. Report location: this file (Drive inaccessible from this environment)
- G. Implementation prompt: delivered in chat alongside this report.
