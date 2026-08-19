# T-169 — Backyard grill patio extension V2

Date: 2026-08-19

## Feedback

The Chapter 04 patio slab stopped before the full outdoor-kitchen footprint, making the grill appear to float beyond the paving.

## Change

- Preserved the original `Backyard` component.
- Added `BackyardV2` and made it active through `HouseModelV17` and `HouseSceneV18`.
- Kept the pergola, grill, pool and the patio's opposite edge fixed.
- Extended only the grill-side patio edge: width `7.0 → 7.8` model units, with its center adjusted `2.5 → 2.9` so the original opposite edge remains unchanged.
- Added a backward-compatible `BackyardComponent` injection point to the shared model; every older model continues to use the original backyard by default.

## Verification

- Targeted ESLint passed for all new active files and `App.js`.
- The shared model still reports its pre-existing complexity finding when linted directly; this change did not add a new complexity finding.
- Production build compiled successfully.
- Local rendered checks at Chapter 04 progress `0.69` and `0.72` confirmed the patio now continues beneath and slightly beyond the grill.

## Rollback

Switch `App.js` from `HouseSceneV18` back to preserved `HouseSceneV17`.
