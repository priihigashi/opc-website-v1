# T-169 Homepage Gallery V4 — Approved Media Lock

Date: 2026-08-19

## Decision

The three homepage `Proof, Not Promises` photographs remain the approved selections below. The outdoor image is the AI-edited wide V2 file approved by Priscila. It must not be replaced by `outdoor-kitchen-dusk.jpg`, `outdoor-kitchen-twilight.jpg`, or another older derivative without a new explicit approval.

| Slot | Approved file | Dimensions | SHA-256 |
|---|---|---:|---|
| Kitchen | `frontend/public/images/opc/kitchen-wide.jpg` | 1800 × 1350 | `cca388bbc4d9dadcc7d9eb39027048e821784d58a9294839cf7af2e0875cb3a8` |
| Bathroom | `frontend/public/images/opc/bathroom-wide.jpg` | 1800 × 1350 | `c78214e048aff580579fd02d6bc0f00ad4fce154e4971d9d72e67a6a74635e55` |
| Outdoor kitchen / pergola | `frontend/public/images/opc/outdoor-kitchen-twilight-wide-v2.jpg` | 1672 × 941 | `271e27fc6a4fdaeaed0a576854aa3cffbf02c3d630b119fdc50c5d3ab18ca044` |

## Repair

The public asset URLs and a fresh browser load were healthy when audited. The reported black cards were consistent with a temporary failed image request, not deleted source files. `GalleryV4` preserves `GalleryV3`, retries each exact approved asset once if its first request fails, and replaces the browser's broken-image icon with a neutral temporary-unavailable message if the retry also fails. No fallback photograph is substituted.

The `Work` navigation label remains unchanged pending the later menu/portfolio structure decision.
