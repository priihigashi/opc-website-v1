# T-169 — Permanent Addition Junctions V8

Date: 2026-08-19

## Feedback

The front and rear pavilion corners still exposed a small strip of the oak interior floor while the addition retracted. The defect disappeared only when the addition reached full size.

## Root cause

The front stucco return that concealed the junction lived inside the animated addition group. Because that entire group scales from almost zero to full size, the return scaled away with it. The rear junction did not have an equivalent permanent return.

## Fix

- Preserved the previous components and created versioned `AdditionV6`, `EnvelopeV8`, `HouseModelV18`, and `HouseSceneV20`.
- Removed the junction return from the animated addition in V6.
- Added full-height front and rear stucco returns to the permanent house envelope in V8.
- Extended both returns below the oak floor edge and into the adjacent black glazing frame so no brown floor sliver can appear at oblique angles.
- Kept the addition, doors, windows, roof, lighting, camera, scroll timing, and animation speed unchanged.

## Verification

- Production build passed.
- Targeted ESLint passed.
- Desktop visual checks passed with the addition absent, partially growing, fully built, and retracting.
- Both permanent junctions remain full height while the addition changes size.
- No horizontal overflow was introduced.

## Versions

- Launch candidate: `https://opc-house-elements-review.vercel.app/`
- Protected previous review: `https://opc-house-hero-preview.vercel.app/`
