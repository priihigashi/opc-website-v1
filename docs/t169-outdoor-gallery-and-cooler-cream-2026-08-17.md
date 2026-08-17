# T-169 — Outdoor gallery image and cooler cream

Date: 2026-08-17

## Feedback

The “Outdoor Living / Built for the evening” gallery card appeared as an empty black panel. The surrounding cream also read too yellow and needed a very small cooler shift without becoming gray or blue.

## Root cause

The referenced file `outdoor-kitchen-dusk.jpg` existed but contained an entirely black image. This was a bad asset, not a display or monitor problem.

## Implementation

- Replaced the black asset reference with a verified finished OPC project photo from the existing archive.
- Source: `assets/img/mike/exterior-patio-builds/clark-pergola-IMG_4626.jpeg` in the canonical OPC site archive.
- Review-copy asset: `frontend/public/images/opc/outdoor-kitchen-twilight.jpg`.
- The photo is naturally captured at blue-hour twilight with the completed outdoor kitchen and pergola illuminated; no AI-generated architecture or replacement scene was used.
- Compressed copy: 1600×1200 JPEG, approximately 452 KB.
- Changed the gallery section background from warm cream `#F0EBE3` to neutral cool ivory `#EEEDE9` after comparing warmer cream, neutral ivory, and cooler stone-cream directions.
- Preserved the dark bottom caption gradient and added a restrained mobile-only left gradient for text contrast.
- Changed the outdoor card from 21:9 on every screen to 4:3 on phones and 21:9 from tablet upward so the project does not collapse into a thin strip.

## Verification

- Production build passed: JavaScript 516.57 KB gzip; CSS 12.81 KB gzip.
- Live image loaded at natural size 1600×1200 on phone 390×844, iPad 820×1180, and desktop 1440×1000.
- No horizontal overflow.
- No browser console or page errors.
- Desktop and iPad crop preserve the long illuminated counter and pergola structure.
- Phone crop preserves the complete architectural read and keeps “Built for the evening” legible.
- Existing unrelated quality debt remains unchanged: two inherited complexity failures in `HouseModel.jsx` and `ServicesScene.jsx`.

## Traceability

- Initial asset/palette commit: `7b69dfd`
- Mobile crop/contrast commit: `bfb9e95`
- Final Vercel deployment: `dpl_4kFFDEfGuPUSgrscay8LTygbjziT`
- Stable review: https://opc-house-hero-preview.vercel.app/
- Original Emergent and the real OPC domain were not changed.
- Evidence:
  - `outputs/opc-outdoor-twilight-phone.png`
  - `outputs/opc-outdoor-twilight-ipad.png`
  - `outputs/opc-outdoor-twilight-desktop.png`
