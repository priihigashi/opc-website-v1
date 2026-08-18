# T169 — Entry door flush-joint correction V4

Date: 2026-08-18

## Feedback addressed

After the entry opening dimensions were corrected, Priscila confirmed that a narrow light-colored line still appeared between the brown door and the wall at angled views.

## Diagnosis

The opening and door width matched, but the door face remained recessed approximately 0.095 model units behind the front stucco plane. At an oblique camera angle, the pale inside edge of the wall opening remained visible and read as a gap.

## Versioned implementation

- Preserved `EnvelopeV3`, `HouseModelV10` and `HouseSceneV11` unchanged.
- Added `EnvelopeV4`, `HouseModelV11` and `HouseSceneV12`.
- Moved the wood door forward so its face sits 0.015 model units proud of the stucco plane.
- Increased door width from 1.20 to 1.24 units, creating a controlled 0.02-unit overlap on each side of the 1.20-unit opening.
- No trim strip, filler object or new material was added.

## Verification

- Production build: passed.
- Local Chapter 05 Groundwork view rendered with zero browser console errors.
- The door now visually closes against the wall at the forward/angled return view.

## Rollback

Point the active scene import in `App.js` back to `HouseSceneV11`.
