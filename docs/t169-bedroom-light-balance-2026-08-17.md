# T-169 — Bedroom light balance feedback

Date: 2026-08-17

## Feedback

At the approximately 36% cutaway state, the upstairs bedroom was overexposed. The bed, nightstand, wall panels, and floor lost definition.

## Safe implementation

Only the isolated Vercel review copy was changed. The original Emergent preview and the Oak Park Construction production domain were not changed.

- Main interior point-light intensity: `30` → `20`
- Main interior point-light range: `11` → `9`
- Upstairs/bath point-light intensity: `12` → `5.5`
- Upstairs/bath point-light range: `7` → `5.5`
- Upstairs/bath point-light color: `#FFC98A` → `#E9A96A`

## Verification

- Production build passed: JavaScript `516.54 kB` gzip; CSS `12.74 kB` gzip.
- Exact cutaway progress `p≈0.36` checked at iPad `820×1180` and desktop `1440×1000`.
- Canvas rendered at both sizes.
- No horizontal overflow.
- No browser console or page errors.
- Bedroom furniture and architectural details remain visible while preserving the warm interior mood.
- Two inherited complexity failures remain unchanged in `HouseModel.jsx` and `ServicesScene.jsx`.

## Traceability

- Git commit: `6ff6fdc` (`Balance cutaway bedroom lighting`)
- Vercel deployment: `dpl_A3YnjN25XuY5EbZQYCWaLjoNvJms`
- Stable adjusted review: https://opc-house-hero-preview.vercel.app/
- Original comparison reference: https://house-hero.preview.emergentagent.com/
- Screenshots:
  - `outputs/opc-bedroom-light-after-ipad.png`
  - `outputs/opc-bedroom-light-after-desktop.png`

## Rollback

The immediately previous responsive checkpoint is commit `ca5c759`. Reverting commit `6ff6fdc` restores the prior lighting values without creating another website copy.
