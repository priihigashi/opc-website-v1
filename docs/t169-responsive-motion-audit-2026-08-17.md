# T-169 Responsive + Motion Audit — 2026-08-17

## Scope

Verified the isolated review deployment at `https://opc-house-hero-preview.vercel.app/` without touching the original Emergent preview or `oakpark-construction.com`.

Exact portrait viewport matrix:

- iPhone SE — 375 × 667
- iPhone 14 — 390 × 844
- iPad Mini — 768 × 1024
- iPad Air — 820 × 1180
- iPad Pro — 1024 × 1366
- Desktop control — 1440 × 1000

Each device was checked at the hero and at five story progress states: `0.18`, `0.36`, `0.52`, `0.69`, and `0.87`.

## Finding and fix

The first sweep confirmed that the canvas loaded and the house rotated on every device, but the deeper cutaway and outdoor chapters allowed the model to drift beyond the right edge on iPads.

`frontend/src/three/HouseModel.jsx` was adjusted so responsive staging keeps the model visible:

- Phone scale: `0.56` → `0.50`
- Phone horizontal travel factor: `0.10` → `0.04`
- Tablet scale: `0.82` → `0.68`
- Tablet horizontal travel factor: `0.50` → `0.32`
- Phone/tablet vertical offsets were softened slightly

The correction is intentionally limited to responsive staging; the desktop choreography and chapter timing were not changed.

## Final verification

- Canvas present at every tested viewport.
- House rotation changed across all five states on every device, approximately `0.82 → 0.02 → -1.37 → -3.05 → -5.88` radians.
- House remains in frame through the cutaway and outdoor-living states on phone and iPad.
- `documentElement.scrollWidth === clientWidth` at every tested size; no horizontal overflow.
- Zero browser console errors and zero page errors in the final device sweep.
- Production build passes.
- Bundle remains 516.53 KB JavaScript gzip and 12.74 KB CSS gzip.
- Quality gate remains unchanged: only the two inherited frame-loop complexity violations are present.

## Delivery record

- Commit: `ca5c759`
- Branch: `emergent-house-hero-source-2026-08-17`
- Vercel deployment: `dpl_96t2ju8zmTULLy34AaZLkPf9UE26`
- Stable review URL: `https://opc-house-hero-preview.vercel.app/`
- Rollback remains available through prior commit `9b431f5` (luxury pass) and checkpoint `f0fc6c7`.

## Screenshot evidence

Saved in the Codex output folder with these patterns:

- `opc-responsive-<device>-hero.png`
- `opc-responsive-<device>-p036.png`
- `opc-responsive-<device>-p069.png`

The Builder Tracker T-169 note and Focus Today row were updated with this audit and fix.
