# T-169 — Addition reveal lane and motion hold

Date: 2026-08-18  
Scope: isolated React/Vercel review copy only  
Branch: `emergent-house-hero-source-2026-08-17`

## Feedback received

At the Additions chapter, the house could settle into a more useful side angle and the copy panel covered the animated growth on some monitor sizes. The strongest part of the sequence—the new volume extending from the house—needed a protected visual lane.

## Root cause

- The house was still rotating from its front state toward an almost end-on state while the addition was already growing.
- The model also crossed from the right side of the viewport to the left during the same growth interval.
- The default chapter card occupied five grid columns with full chapter typography and spacing, so it became too wide and tall for this moment, especially on short desktop and tablet viewports.

## Versioned implementation

The earlier working components remain preserved. The active app now uses:

- `HouseModelV3.jsx` — completes the left turn and horizontal move before the addition starts; holds a three-quarter side angle through the complete grow/hold/fade interval; includes a stronger tablet-only left offset.
- `HouseSceneV3.jsx` — preserved scene and lighting with the V3 model wired in.
- `ChapterV2.jsx` — adds an optional compact, responsive chapter presentation without changing the earlier Chapter component.
- `StoryV4.jsx` — applies the compact far-right layout only to chapter 03; other chapters retain their established treatment.
- `App.js` — switches the isolated review source to the versioned V3 scene and V4 story.

## Motion decision

- Turn begins before the reveal: progress `0.39 → 0.435`.
- Hold angle: `-0.82 radians` from progress `0.435 → 0.615`.
- Addition animation remains `0.43 → 0.615`, so the camera is effectively settled for the visible build.
- Desktop addition lane: house staged at `x=-2.8`.
- Tablet addition lane: stronger responsive track staged at `x=-4.35` before the existing tablet factor is applied.

## Responsive panel decision

- Desktop: four-column, max 26.5rem card aligned to the far-right grid edge.
- Tablet: five-column constrained card, with compact title/body/list spacing and a slight upward offset.
- Phone: full-width card remains in the normal lower stacked flow; the house stays visible above it.

## Verification

- Production build: passed (`517.73 kB` JavaScript gzip; `13.69 kB` CSS gzip).
- JavaScript quality check: no new findings; the same two inherited complexity findings remain in `ServicesScene.jsx` and `HouseModel.jsx`.
- Browser QA at the exact middle of the Additions sequence:
  - 1726×650 short desktop — pass
  - 1440×900 desktop — pass
  - 820×1180 iPad — pass
  - 390×844 phone — pass
- Motion-state checks at progress `0.455`, `0.49`, and `0.555` confirmed that the model holds the same three-quarter angle while the addition changes from early growth to complete.
- All checked sizes: canvas present, no horizontal overflow, no framework error overlay, and zero browser console errors.

## Safety / release status

- Original Emergent preview: untouched.
- `oakpark-construction.com`, DNS, and production: untouched.
- Git commit: `90543db` pushed to the isolated branch.
- Vercel deployment: `dpl_HFhbDfrCAcVBq2wuZvJ4tKwYMeoD` — READY.
- Stable review alias: `https://opc-house-hero-preview.vercel.app/` — updated and verified HTTP 200.
