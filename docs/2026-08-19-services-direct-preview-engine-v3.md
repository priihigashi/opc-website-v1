# OPC Services direct preview engine V3 — 2026-08-19

## Problem

The Services V2 selector animated `scrollStore.p` from the homepage resting position to each destination. Later services therefore crossed earlier homepage chapters on the way to their target. Additions, for example, briefly displayed the lime shell and room cutaway before the addition appeared. Kitchen and Bathroom also shared the same undifferentiated transition, and every preview navigated before visitors had enough time to understand it.

## Resolution

- Preserved Services V2, ServicesSceneV2, HouseModelV19, and HouseSceneV21.
- Added Services V3 with 3.2–3.6 second service-specific reveal/hold/open timing.
- Added a direct preview state that switches the camera target without replaying intermediate homepage chapters.
- Added an optional preview controller to the shared HouseModel. Its default homepage behavior is unchanged when no preview controller is supplied.
- Added HouseModelV20 and HouseSceneV22 for the Services selector only.

## Service behavior

- Full Renovation: complete cutaway plus restrained whole-house lime and warm-light emphasis.
- Kitchen: cutaway with kitchen-only material emphasis.
- Bathroom: cutaway with bathroom-only material emphasis.
- New Construction: finishes recede, the structure appears, then the finished house rebuilds.
- Additions: only the addition grows; no shell or cutaway pre-roll.
- Shell Construction: direct structural-shell reveal.
- Outdoor Living: direct patio, pergola, grill, pool, and water sequence.
- Concrete + Pavers: direct driveway and hardscape sequence.

## Verification

- Targeted ESLint passes for all new and changed selector files.
- Optimized production build passes.
- Midpoint and hold frames were visually inspected for all eight services.
- Additions was inspected at early, midpoint, and hold frames with no shell or cutaway flash.
- All eight buttons route to the correct service URL.
- 1366×768, 820×1180, and 390×844 selector layouts have eight controls, one canvas, and no horizontal overflow.
- The two existing complexity findings remain isolated to the inherited HouseModel function and its animation callback.

## Safety boundary

This changes only the isolated review candidate. It does not alter DNS, SiteGround, WordPress, Google Workspace, or the protected previous Vercel fallback.
