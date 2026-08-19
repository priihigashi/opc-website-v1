# T169 — Addition door without black perimeter frame V4

Date: 2026-08-18

## Feedback addressed

Priscila confirmed that the addition's wood door should match the clean main-entry treatment and must not have a heavy black perimeter frame.

## Versioned implementation

- Preserved `AdditionV3`, `HouseModelV11` and `HouseSceneV12` unchanged.
- Added `AdditionV4`, `HouseModelV12` and `HouseSceneV13`.
- Removed the black top and side frame meshes from the addition door.
- Retained the wood slab and small dark handle.
- Increased the slab width by 0.04 units and set its face 0.015 units proud of the stucco so it closes the opening cleanly without a visible reveal.
- All addition walls, windows, roof and animation timing remain unchanged.

## Rollback

Point `App.js` back to `HouseSceneV12`.
