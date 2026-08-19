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

## Verification

- Targeted ESLint: passed.
- Production build: passed.
- Desktop 1440×900, iPad 820×1180 and phone 390×844: one visible card, 1.78 image ratio throughout, selected-project label on every sequence, zero horizontal overflow and no error overlay.
- Next-arrow interaction: passed; counter advanced from `01 / 05` to `02 / 05`.
- Public deployment: no browser console errors.

## Deployment

- Code checkpoint: `30e95ba`.
- Vercel deployment: `dpl_4ibK2kcrBoC5dcjCngHKxi6ghz22` (`READY`).
- Public review: `https://opc-house-hero-preview.vercel.app/portfolio/1270-harbor-court`.
