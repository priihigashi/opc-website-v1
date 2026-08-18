# T-169 House Envelope Butt-Joint Rebuild

Date: 2026-08-18

## Problem

The procedural house showed visible vertical bands, black seams, stepped corners, and jagged ambient-shadow artifacts at the tower, pavilion, and addition. The defects were most visible when the house rotated and stopped at an angle.

## Root cause

- Several perpendicular wall boxes overlapped at their corners.
- Thin cosmetic closure-strip meshes were layered over some gaps, creating additional shadow and ambient-occlusion seams.
- The addition door was recessed behind the exterior wall face, leaving a dark reveal that read as a missing wall.
- Basic shadow rendering and half-resolution ambient occlusion exaggerated the geometry artifacts.

## Repair

- Added `EnvelopeV2`, using true butt joints: one face owns each outer corner and perpendicular walls end at that face's inner plane.
- Removed the cosmetic corner-closure strips from the active model.
- Added `AdditionV3`, rebuilding all four addition corners with the same butt-joint rule and moving the door assembly flush with the wall.
- Added `HouseModelV9` to use the repaired envelope and addition without changing the established scroll choreography.
- Added `HouseSceneV10`, with soft shadows, refined bias, and full-resolution ambient occlusion.

## Verification

- Production build passes.
- Eighteen responsive states pass across desktop, iPad, and phone viewports.
- Checked hero/front, shell, cutaway, addition, outdoor/rear, and groundwork/front scroll states.
- No horizontal overflow, browser error overlay, or console errors were found.

## Rollback

The last code checkpoint before this rebuild is commit `b0f9888`.
