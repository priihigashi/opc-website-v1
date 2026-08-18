# T-169 — Hero scroll cue V8

Date: 2026-08-18

## Feedback

Priscila asked for the lower-left hero instruction to break into two intentional lines, make `Scroll down` lime, and add a small minimal white animated down arrow.

## Versioned implementation

- Preserved `HeroV7` and `StoryV9` unchanged.
- Added `HeroV8` and `StoryV10`.
- Updated the active `App.js` composition to use `StoryV10`.
- Line 1: `SCROLL DOWN THROUGH ONE HOUSE`
- Line 2: `AS EACH OAK PARK SERVICE COMES INTO VIEW.`
- `SCROLL DOWN` uses OPC lime `#CBCC10`.
- Added a small white downward arrow beside the instruction with a restrained 1.55-second vertical/opacity pulse.
- The arrow animation is disabled automatically when the visitor prefers reduced motion.

## Verification

- Production build compiled successfully.
- Targeted ESLint passed.
- Local visual checks passed at 1440×900, 820×1180 and 390×844.
- At all three sizes, the requested line break remained exact, the lime and white colors computed correctly, the arrow stayed inside the viewport, no development error overlay appeared, and there was no horizontal document overflow.

## Scope protection

The 3D house, scroll choreography, chapter copy, portfolio, original Emergent preview, real OPC domain and rollback tag were not changed.
