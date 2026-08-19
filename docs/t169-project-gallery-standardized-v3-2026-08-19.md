# T-169 — Project Gallery Standardized V3

Date: 2026-08-19

## Feedback addressed

- Opening a project felt visually mixed with unrelated work because neighboring slides remained visible at the carousel edge.
- Sequence 01 used a special featured proportion while later sequences used a different card shape.

## Versioned implementation

- Preserved `ProjectGalleryV2.jsx` unchanged.
- Added `ProjectGalleryV3.jsx` and activated it through `App.js`.
- Every sequence now uses the same 16:9 card, caption treatment, carousel width and controls.
- The above-fold sequence has no special height cap, so its rendered image ratio matches every later sequence exactly.
- The shared sequence width is capped so the complete first card, caption and lower cue remain visible in a normal desktop viewport.
- The first carousel aligns directly beneath its sequence heading instead of floating vertically in the remaining tablet/phone space.
- The selected project owns the full gallery viewport; neighboring slides no longer peek into the frame.
- Every sequence label repeats the selected project title, and the lower cue now says `More From This Project`.
- Added a clear photo counter and disabled arrows at each end of a sequence.

## Scope

- Portfolio landing page and `PortfolioV6` are unchanged.
- Project data and original photographs are unchanged.
- Original Emergent site and the real OPC domain remain untouched.
