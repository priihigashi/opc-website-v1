# T-169 — Addition-to-pavilion stucco return v5

Date: 2026-08-18

## Feedback

Priscila flagged a short white wall at the junction between the pavilion glass frame and the recessed addition. A small brown piece remained visible at the base.

## Root cause

The brown piece was the pavilion's oak interior floor showing through a real depth gap. The addition facade is recessed behind the pavilion glass line, but no perpendicular stucco return bridged those two planes. Extending the front facade sideways did not close that depth gap.

## Correction

- Preserved `AdditionV4`, `HouseModelV13` and `HouseSceneV14` unchanged.
- Added `AdditionV5` with a real 0.24 × 3.10 × 0.58 stucco return bridging the recessed addition facade to the final pavilion glass frame.
- Added `HouseModelV14` and `HouseSceneV15`; the active landing composition now uses the versioned scene.
- Kept the addition roof, windows, outside wall edge, wood side door, handle, animation and camera tracks unchanged.

## Verification

- Production build passed.
- Targeted ESLint passed with no findings.
- Local WebGL captures passed at progress 0.44, 0.52, 0.60, 0.66 and 0.84.
- The exact reported close angle at progress 0.52 now shows a continuous white stucco return meeting the black frame, with no brown floor sliver.
