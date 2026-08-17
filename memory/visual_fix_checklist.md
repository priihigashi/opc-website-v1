# OPC Residence Visual Fix Checklist — 2026-08-17

Source: latest user messages + attached roof/facade/cutaway screenshots. Verified by `/app/test_reports/iteration_1.json` and `/app/test_reports/iteration_2.json`.

## Entry roof / canopy / panel / door
- [x] Removed roof/wall coplanar contact that caused flicker or “bleaching” during scroll.
- [x] Entry canopy attaches cleanly without passing through the front wall.
- [x] Pivot door is taller without changing the overall entry composition.
- [x] Wood panel sits cleanly between canopy and roof with no visible unintended gap.
- [x] Panel/canopy/roof dimensions remain visually consistent.
- [x] Wood panel is thinner in depth and fully tucked under the slightly longer Roof A edge.

## Windows
- [x] First-floor front windows are tall portrait rectangles and remain below the roof line.
- [x] First-floor side windows are tall portrait rectangles and remain below the roof line.
- [x] Second-floor front windows are wider landscape units.
- [x] Added a second aligned front upper window; the elevation no longer shows two lower windows and only one upper window.
- [x] Front upper bathroom windows are frosted and backed with curtain panels.
- [x] Added a matching second upper window on the left/west elevation; no lone corner window.
- [x] Rear elevation uses two centered, wider upper windows instead of one off-center/corner window.
- [x] No window frame or glass crosses a roof plane or wall edge.

## Second-floor layout
- [x] Bathroom restored to the front half of the second floor.
- [x] Bedroom has the larger rear portion of the second floor.
- [x] Bed moved farther from exterior windows; bedroom/bathroom division is not exposed through clear front glass.
- [x] Bathroom floor runs wall-to-wall beneath vanity, toilet, and shower with no rug-like island or gaps.
- [x] Shower enclosure reads as a framed glass enclosure.

## Cutaway layers
- [x] Pavilion ceiling rises with Roof B during the cutaway.
- [x] Volume-A ground and upper ceilings rise with Roof A as separated layers, with gaps below the roof.
- [x] Front walls drop farther and fade nearly out so the living room and upstairs rooms are unobstructed.

## Shared-model parity and verification
- [x] Landing-page model and Services GLB factory use the same geometry.
- [x] `public/models/residence.glb` re-exported after factory changes.
- [x] Screenshots/browser checks covered hero/front elevation, entry close-up, cutaway interior, side elevations, rear elevation, roofline, scroll reversals, and Services page.
- [x] Testing agent iteration 1 passed the architectural/window/interior checklist.
- [x] Testing agent iteration 2 passed the panel tuck, ceiling lift, deeper front-wall drop/fade, GLB parity, and forward/reverse scroll sweep.
