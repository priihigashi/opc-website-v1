# T-169 — Chapter 05 main-entry door correction

Date: 2026-08-18

## Feedback

In Chapter 05, the returning main door still exposed a pale vertical reveal on its left edge and its dark pull handle was no longer visible. The main entry must close cleanly and use the same compact visible handle treatment as the addition door.

## Versioned implementation

- Preserved the active `EnvelopeV4`, `HouseModelV12`, and `HouseSceneV13` appearance through default values.
- Added optional entry-door geometry inputs to `EnvelopeV4`; its defaults reproduce the prior version.
- Added `EnvelopeV5`, extending the door only toward the left while keeping its right edge fixed.
- Moved the handle in front of the advanced door face and matched the addition door's compact vertical-pull dimensions.
- Added `HouseModelV13` and `HouseSceneV14`; `App.js` now selects the new chain.

## Geometry

- Door width: `1.24 → 1.30`.
- Door center: `1.60 → 1.57`, keeping the right edge at `2.22` and increasing the left overlap.
- Handle: `0.06 × 0.36 × 0.04`, centered at `y=1.25`, with `z=0.18` so it remains visible in Chapter 05.

## Rollback

Switch `App.js` back to `HouseSceneV13`. The prior versioned chain remains intact.
