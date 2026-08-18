# T-169 — Two-Story Tower Four-Corner Envelope Correction

Date: 2026-08-18  
Review URL: https://opc-house-hero-preview.vercel.app/  
Code checkpoint: `100f7fa`  
Vercel deployment: `dpl_XAUpNL2GoLuTxBfRdhmxBszcUSh4`

## Feedback received

Priscila identified a visible stepped seam at the left edge of the two-story tower and asked for the complete rectangular volume—not only the pictured corner—to be checked at all four corners.

## Root cause

The tower uses separate 0.25-unit-thick front, rear, west and east wall pieces. Those pieces met at their nominal centerline dimensions:

- front and rear width: 5.00 units
- west facade depth: 6.00 units
- east upper wall depth: 6.00 units
- wall thickness: 0.25 units

Meeting at centerlines did not make the exterior faces flush. The west face remained 0.125 units proud of the front/rear edges, while the side-wall ends stopped 0.125 units short of the front/rear exterior planes. The result was the level change visible in the screenshot.

## Correction

The working HouseModelV7 / HouseSceneV8 pair was preserved. The active site now uses versioned HouseModelV8 / HouseSceneV9 with opt-in envelope dimensions:

- west facade depth: 6.00 → 6.25 units
- east upper wall depth: 6.00 → 6.25 units
- west front closure: 0.125 units
- west rear closure: 0.125 units

This aligns all four tower corner planes to the outside wall faces. No decorative trim was added, and no unrelated house dimensions were changed.

## Files changed

- `frontend/src/three/parts/Envelope.jsx`
- `frontend/src/three/HouseModelV8.jsx`
- `frontend/src/three/HouseSceneV9.jsx`
- `frontend/src/App.js`

## Preserved unchanged

- original Emergent preview
- oakpark-construction.com and DNS
- HouseModelV7 / HouseSceneV8 rollback pair
- pavilion roof-to-return correction
- hero copy and composition
- camera and scroll rotation tracks
- addition architecture and growth timing
- lighting and landscaping

## Verification

- production build: passed
- bundle: 518.70 KB JavaScript gzip / 14.12 KB CSS gzip
- code-quality result: no new findings; only the two inherited complexity findings in `ServicesScene.jsx` and `HouseModel.jsx`
- desktop: 2048×1182 hero plus intermediate and opposite rotation views
- iPad: 820×1180
- phone: 390×844
- canvas present at all tested sizes
- zero horizontal overflow
- zero browser errors in final responsive and live checks
- published Vercel alias verified after deployment

## Tracking

- Builder Tracker T-169 status changed to `In Progress — four tower corners squared and closed live`
- full deployment checkpoint appended to T-169 history
- four-corner exterior-plane rule added to `🎨 Design Decisions`
- `OPC_WEBSITE_STATE.md` current checkpoint, locked decision and activity log updated

## Remaining project work

This correction improves the current procedural house only. It does not complete the separate photoreal-house replacement, approved B2 portfolio rebuild, Drive photo sequencing, production form backend, analytics/conversion tracking, or deeper city/local SEO work.
