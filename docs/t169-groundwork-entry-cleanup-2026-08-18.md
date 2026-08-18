# T-169 — Groundwork entry cleanup

Date: 2026-08-18  
Review URL: https://opc-house-hero-preview.vercel.app/

## Feedback received

- Remove the isolated green bush beneath the pavilion glass.
- Keep the entrance legible between the two planters.
- Assess whether the stepping path should continue for the full driveway.
- Assess whether more landscaping belongs on the open right side.
- Avoid landscaping that reads as geometric blocks rather than real plants.

## Final design decision

- Removed the isolated third planter/bush beneath the pavilion glass.
- Restored the original four stepping slabs between the two entrance planters.
- Did not extend the slabs along the full driveway. The slabs now perform one clear job: they mark the pedestrian turn from the driveway to the entrance. Extending them would create a second competing driveway stripe.
- Removed the experimental right-side landscaping after visual review. With the current stylized model, the extra hedge and groundcover read as geometric props rather than believable planting. The open ground is cleaner until realistic landscape assets are available.

## Source changes

- Added `frontend/src/three/parts/DrivewayV3.jsx` as the non-destructive driveway revision.
- Added `frontend/src/three/HouseModelV5.jsx` to use the revised driveway while preserving the existing house animation and responsive tracks.
- Added `frontend/src/three/HouseSceneV6.jsx` to load the revised model while preserving the final multisample edge-smoothing pass.
- Updated `frontend/src/App.js` to render `HouseSceneV6`.

## Verification

- Production build: passed (`npm run build`).
- JavaScript quality check: no new findings; the two pre-existing complexity findings remain in `ServicesScene.jsx` and legacy `HouseModel.jsx`.
- Desktop visual review at 1440 × 1000: passed.
- Confirmed the pavilion glass remains unobstructed.
- Confirmed two entrance planters remain.
- Confirmed four entrance slabs connect the driveway to the door.
- Confirmed no experimental right-side landscaping remains.
- Vercel deployment: `dpl_DavRBqZZDZy1xAwghVdmwN4xXZec` (`Ready`).
- Public review alias: HTTP 200 at https://opc-house-hero-preview.vercel.app/

## Future improvement

Do not add more landscaping using the existing rounded boxes or simple spheres. Any future planting should use a realistic, lightweight landscape asset set—such as optimized ornamental grasses, palms, or photoreal low-poly shrubs—and must be tested against the site animation and mobile performance budget.
