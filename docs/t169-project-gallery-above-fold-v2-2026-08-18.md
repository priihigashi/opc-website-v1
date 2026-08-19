# T169 — Project gallery above-fold layout V2

Date: 2026-08-18

## Feedback addressed

Priscila asked for the first carousel row on each portfolio project page to be fully visible above the fold, with a small centered down arrow below it when more project rows exist.

## Versioned implementation

- Preserved `ProjectGalleryV1.jsx` unchanged as the rollback version.
- Added `ProjectGalleryV2.jsx` and made it the active project-detail route.
- Rebuilt the opening project view as one viewport-height composition: compact project information, complete first sequence heading, first carousel frame, captions and both navigation arrows.
- Replaced the first row's fixed 4:3 sizing with a viewport-aware image height so short laptops, tablets and phones retain the entire row above the fold.
- Added a small centered `More sequences` down-arrow only when the project contains additional rows.
- The down-arrow scrolls to the second sequence with a 64 px sticky-navigation offset.
- All later carousel rows preserve the existing spacious V1 presentation.

## Verification

- Production build: passed.
- Existing complexity gate: the same two inherited findings remain in `ServicesScene.jsx` and `HouseModel.jsx`; no new finding was added.
- 1440 × 900 desktop: first row bottom 856 px; down-arrow bottom 892 px.
- 1366 × 768 laptop: first row bottom 726 px; down-arrow bottom 762 px.
- 820 × 1180 iPad: first row bottom 1136 px; down-arrow bottom 1172 px.
- 390 × 844 phone: first row bottom 800 px; down-arrow bottom 836 px.
- All checked sizes: zero horizontal overflow and no framework error overlay.
- Down-arrow interaction: passed; sequence 02 settled 64 px below the viewport top.

## Rollback

Change the lazy project-gallery import in `App.js` from `ProjectGalleryV2` back to `ProjectGalleryV1`.
