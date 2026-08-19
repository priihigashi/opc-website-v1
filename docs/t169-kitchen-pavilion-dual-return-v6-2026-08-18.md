# T169 — Kitchen pavilion dual-return correction (V6)

Date: 2026-08-18

## Feedback addressed

The narrow stucco wall beside the kitchen glazing ended slightly above the oak floor at both the front and rear of the house. That exposed a small brown floor corner and made the wall/glass junction look unfinished.

## Root cause

The two pavilion junction returns ended at `y = 0.50`, while the oak floor extends down to approximately `y = 0.45`. They also met the black glass frame at an exact plane, which could expose a thin seam at some camera angles.

## Change

- Added an optional, shared `pavilionJunction` configuration to `EnvelopeV4` so the front and rear corrections cannot drift apart.
- Added `EnvelopeV6`, which lowers both returns below the visible floor edge and gives them a small, controlled overlap with the glass frame.
- Added `HouseModelV15` and `HouseSceneV16`, preserving all previous house versions as reversible checkpoints.
- Switched the workbench app to `HouseSceneV16`.
- Kept the kitchen glazing, roof, primary door, addition, materials, lighting, and animation tracks unchanged.

## Geometry used

- Return depth: `0.30`
- Return height: `3.48`
- Return center Y: `1.66`
- Front Z: `-0.225`
- Rear Z: `0.225`

## Verification

- Production build: passed.
- Targeted lint on all changed files: passed.
- Visual capture at the finished front angle: no exposed brown corner.
- Visual capture at the rear kitchen angle: continuous, symmetrical wall/glass junction.
