# Story banner responsive research v1

Date: 2026-08-26

Branch: `release/banner-scroll-responsive-2026-08-26`

Frozen baseline: `4fc3491f168e6c415ef8be4c301d6b2e6a0835ae`

## Scope

READ: the live home story chain, preserved earlier banner versions, the active house
wrapper and its responsive values, existing contract tests, prior responsive reports,
and official responsive-layout guidance.

CHANGE: versioned banner movement/layout, a first-two-fold scroll cue, the routed app
version, and banner-specific verification.

LOCKED: house geometry, materials, lighting, camera, rotation, semantic stages and
timing; hero, navigation, portfolio, contact, copy, and all existing approved versions.
House group position or scale is a fallback only if visual collision evidence requires it.

## Evidence consulted before implementation

- Wix Studio: Designing Across Breakpoints
  https://support.wix.com/en/article/studio-editor-designing-across-breakpoints
- Wix Studio: Docking, Margins and Padding
  https://support.wix.com/en/article/studio-editor-working-with-docking-margins-and-padding
- Wix Studio: Cells and Grids
  https://support.wix.com/en/article/studio-editor-about-cells-and-grids
- MDN: Responsive Design
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
- MDN: `clamp()`
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp
- MDN: small viewport units, safe-area `env()`, and reduced motion
- web.dev: Responsive Web Design Basics
- Three.js: Responsive Design

## Reconciled findings

CORROBORATED:

- The active banner moves only 56px and derives movement from opacity, so it pops/fades
  instead of travelling through the viewport.
- `whileInView({ once: true })` prevents deterministic reverse-scroll presentation.
- The banner changes to desktop layout at 1024px while the house remains tablet through
  1099px. One spatial system must use the house boundary: mobile below 768px, tablet
  768–1099px, desktop 1100px and above.
- The five existing house-ready plateaus are correct and must remain the source of truth.
- Mobile cannot use a squeezed side-by-side desktop layout. Its readable focus is a lower
  lane while the house remains in the upper visual zone.

NOVEL AND ACCEPTED:

- Use one fixed, measured banner rail because exact semantic focus and pre-retract exit
  cannot both be guaranteed by normal flow. The rail uses a real responsive grid, safe
  gutters, panel measurement and direct progress-to-position mapping.
- Opacity is not the entrance/exit mechanism. At the same progress, the same panel
  coordinates are produced in either scroll direction.
- Keep the current house chain untouched for the first candidate. Only measured collision
  evidence may authorize a versioned house group-position/scale wrapper.

REJECTED:

- Refactoring or retiming the house for architectural cleanliness.
- Camera/FOV changes.
- Duplicating separate chapter structures per device.
- Treating canvas presence and lack of horizontal overflow as proof that the composition works.

## Completion contract

For all five chapters:

1. Lane order is right / left / right / left / right.
2. The whole panel begins below the viewport, travels continuously upward, is fully readable
   at its semantic focus, then exits above the viewport before the house retracts.
3. The corresponding house stage is complete at focus; house timing is unchanged.
4. Reverse scrolling reproduces the same coordinates within 2px.
5. No panel is cropped at focus, intersects navigation, or creates horizontal overflow.
6. Desktop/tablet use opposing lanes; mobile uses a lower reading lane without hiding content.
7. A minimal decorative down cue appears only through the first two viewport folds and does
   not pulse with reduced motion.
8. Existing feature, API, house lifecycle, and build checks remain green.

## Coverage manifest

| Item | Required evidence |
|---|---|
| Shell banner | full travel, right lane, shell complete at focus |
| Rooms banner | full travel, left lane, cutaway complete at focus |
| Addition banner | full travel, right lane, addition complete at focus |
| Outdoor banner | full travel, left lane, outdoor complete at focus |
| Concrete banner | full travel, right lane, concrete complete at focus |
| Scroll cue | visible folds 1–2, absent afterward, reduced-motion safe |
| Responsive | mobile, tablet, desktop, short landscape, 1099/1100 boundary |
| Regression | house chain unchanged, unrelated routes unchanged |
| Rollback | baseline commit and old component versions remain available |

## Required visual matrix

320×568, 360×800, 390×844, 430×932, 768×1024, 820×1180, 1024×768,
1100×800, 1366×768, 1440×900, 1726×650, 1920×1080 and 2560×1440,
plus reduced motion and reverse-scroll samples.

## Final verification evidence

- 49/49 feature, house-policy, stage-lifecycle, accessibility, and banner-timeline contracts passed.
- 54/54 contact and API tests passed.
- Production build compiled successfully.
- Every newly added or changed application file passed targeted ESLint.
- The repository-wide lint command still reports four pre-existing complexity findings in
  untouched legacy files (`ChapterV3`, `ServicesScene`, and `HouseModel`).
- Automated browser matrix: 14 viewports × 5 chapters = 70 recorded start/focus/end
  journeys, with zero panel crop, navigation collision, horizontal overflow, lane-order
  failure, reverse-position drift, offscreen-focus leak, console/page error, or scroll-cue
  failure. The evidence file also records reduced-motion and Home-versus-Services fallback checks.
- Representative screenshots were reviewed at mobile, tablet, 1099/1100 boundary,
  standard desktop, and 650px short desktop heights.
- The first mobile screenshot exposed focal-house coverage that numeric overflow checks did
  not detect. This activated the pre-authorized fallback: a candidate-only wrapper preserves
  all parts, materials, rotation, semantic timings, and camera while adjusting mobile group
  Y/scale after the hero. The static fallback mirrors the upper-house/lower-banner layout.
- A second Council audit stopped the first implementation because five fixed panels created
  five animation loops and left offscreen links keyboard-focusable. The corrected candidate
  uses one measured story rail, one loop, and only one travelling card in the DOM. The link
  is removed from tab order and the card from the accessibility tree until fully readable.
- The final mobile pass covered every semantic focus state. At 320×568, a short-phone-only
  group Y value preserves a compact but meaningful house above the complete readable card;
  360px and wider phones retain the larger upper-house/lower-banner composition.

Browser evidence is stored locally in `.artifacts/banner-verify/` and is intentionally not
part of the release commit.
