# T-169 — Truthful positioning ledger

Date: 2026-08-18

## Feedback addressed

The homepage's `09 / 01 / FL` counter strip made Oak Park Construction read as small and treated a state abbreviation as an achievement. The active homepage also repeated two unsupported or weak claims elsewhere: `Nine services` and `Since 1998`.

## Released direction

- Replaced the numeric counter strip with three high-confidence positioning statements:
  - `Full-service` — From structure to final detail
  - `Owner-led` — Direct oversight throughout
  - `South Florida` — Broward · Palm Beach · Miami-Dade
- Replaced the story outro with `Structure to finish. / Under one team.`
- Removed `Since 1998` from the moving brand band because the founding date is not verified.
- Replaced the moving band copy with factual brand language: Oak Park Construction, Full-service residential builder, Structure to finish, South Florida.
- Corrected the tablet navigation breakpoint so the logo, navigation, and project button no longer overlap around iPad widths.

## Reference rationale

The OPC tracker references favor editorial builder positioning, owner-led trust, and local-service clarity over arbitrary project counters. The chosen solution preserves the premium three-column rhythm while avoiding guessed dates, counts, and inflated claims.

## Files and rollback

- Active new versions: `AboutV3.jsx`, `StoryV6.jsx`, `MarqueeV2.jsx`
- App switch: `frontend/src/App.js`
- Tablet navigation correction: `frontend/src/components/NavV3.jsx`
- Previous versions remain in the repository: `AboutV2.jsx`, `StoryV5.jsx`, `Marquee.jsx`

## Verification

- Production build compiled successfully.
- Desktop: 1440 × 900 visual check passed.
- Tablet: 820 × 1180 visual check passed; navigation overlap removed.
- Mobile: 390 × 844 visual check passed.
- No horizontal overflow detected at checked tablet/mobile widths.
- No browser error overlay or console errors detected.
- Active rendered page contains none of: `Since 1998`, `Nine services`, `Construction services`.
- Vercel deployment: `dpl_A5qt96zEnTcPSFRJ7mx62cUpq4Rq` (`READY`).
- Stable review alias: https://opc-house-hero-preview.vercel.app/
