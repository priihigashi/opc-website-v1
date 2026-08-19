# T169 — Fallback facade and Groundwork return fix

Date: 2026-08-18

## Feedback addressed

- The tower's front face looked warmer than its left side, creating a conspicuous vertical color change at the corner.
- A small opening appeared at the bottom of the front wall while the house returned for Chapter 05, Groundwork.

## Diagnosis

- The front and side faces used different base stucco colors (`#F0EBE3` and `#DDD6CB`). Lighting made that deliberate difference read as a construction/material error.
- The entry opening was 1.3 units wide and shifted 0.0625 units, while the wood entry panel was only 1.2 units wide and centered at the original coordinate. That exposed the interior beside the door, especially during the return animation.

## Versioned implementation

- Preserved `EnvelopeV2`, `HouseModelV9`, and `HouseSceneV10` as the working rollback path.
- Added `EnvelopeV3` with an entry opening that exactly matches the 1.2 × 2.7 wood door and does not inherit the window-grid offset.
- Added optional facade color configuration to the shared house base; defaults remain unchanged for older versions.
- Added `HouseModelV10`, which gives the front and side tower faces the same stucco base color.
- Added `HouseSceneV11` and made it the active landing-page scene.

## Verification

- Production build: passed.
- Browser load: passed with meaningful page content and no error overlay.
- Browser console: zero errors.
- Desktop visual inspection: hero and Chapter 05 return inspected; the entry opening is fully closed and the driveway stage renders.
- Mobile inspection: 390 × 844 Chapter 05 layout loaded without an error overlay; temporary viewport override was reset afterward.
- Existing complexity gate: two pre-existing violations remain in `ServicesScene.jsx` and `HouseModel.jsx`; this change added no new violation.

## Rollback

- Git checkpoint before this fix: tag `opc-review-before-photoreal-2026-08-18` at `cc0df44`.
- Previous active components remain present and can be restored by pointing `App.js` back to `HouseSceneV10`.
