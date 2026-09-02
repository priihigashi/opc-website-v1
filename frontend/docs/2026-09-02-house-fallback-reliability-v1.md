# House fallback reliability — 2026-09-02

## What visitors were seeing

On some cold iPhone/Safari visits, the static backup house remained until the page was refreshed. The old backup also showed as a visible rectangle, with the circular site cut off and the composition sitting too high.

## Why refresh appeared to fix it

The interactive house is lazy-loaded and must initialize WebGL, compile shaders, load its scene code and environment, and render two confirmed frames. The previous stage treated four seconds without those two frames as a permanent failure. It then unmounted the still-loading scene, so that page could never recover. A refresh often succeeded because the code, environment, and graphics setup were already warm.

## Correction

- Four seconds now records a slow start; it no longer stops the interactive scene.
- The lightweight static fallback is visible while the scene is loading and dissolves when two frames are confirmed.
- Actual render/WebGL errors and a WebGL context loss still switch safely to the fallback.
- The phone fallback uses a complete house-and-site composition, centered without a clipped circle and softly feathered into the page background.
- Only an actual graphics error shows the discreet **Try refreshing for the interactive house** control, and only while the visitor remains in the opening fold. Static mode chosen for reduced motion or data saving does not show misleading refresh advice.

## Rollback

The correction is isolated in `DeferredHouseStageV10.jsx`. Switching the two imports/usages in `AppV14.js` back to `DeferredHouseStageV9` restores the previous behavior without changing the house model, camera, scroll choreography, cards, or navigation.

## Verification

Check cold and warm loads at 320×568, 375×667, 390×844, and 430×932. A delayed start must remain recoverable after four seconds; a genuine scene error must retain the fallback and show the manual refresh control; reduced-motion/data-saving mode must show the fallback without that control.
