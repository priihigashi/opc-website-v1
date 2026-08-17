# T-169 — Luxury art-direction pass (2026-08-17)

## Rollback point

The exact pre-pass website is preserved by Git commit `f0fc6c7`. No duplicate website folder or second deployment project was created. Reverting this pass only requires reverting the later luxury-pass commit; the original Emergent preview remains separate and untouched.

## Why the previous review still felt inexpensive

- The hero read as a dark technology demo: flat sans-serif typography, a dim gray house, a rectangular text box and a utility-style lime button.
- The 3D floor disk and heavy ambient occlusion made the model feel game-like rather than architectural.
- Chapter cards were readable but generic; the journey lacked a quiet navigation/progress device.
- The project grid had strong real photography but weak editorial hierarchy.
- Trust cards and the contact form looked like standard component-library sections.

## Changes implemented

- Replaced the temporary Fontshare system with the locked OPC type system: Anton, Cormorant Garamond italic, Roboto Mono and Inter.
- Rebuilt hero hierarchy with an Anton/Cormorant editorial lockup, architectural rule, restrained coordinate detail, warmer halo and a rounded project CTA.
- Refined the glass system with warmer translucency, hairline borders, a lime edge and deeper but softer shadows.
- Added a chapter progress rail for extra-wide screens; it hides outside the animated story and on smaller screens.
- Improved house presentation with warmer key lighting, a controlled spotlight, less aggressive ambient occlusion, subtler contact shadow, darker ground and richer stucco/wood materials.
- Reworked chapter title hierarchy to combine architectural display type with a single serif accent.
- Elevated the project gallery with cream editorial space, asymmetric image scale, quiet indices, serif captions and fewer visible card borders.
- Converted the trust section from boxed cards to a three-column editorial ledger.
- Converted the contact area to a cream/taupe split consultation layout with hairline form fields and a dark rounded submit action.
- Made the fixed navigation fully dark so the white logo and links stay legible over both dark and cream sections.

## Verification

- Production build compiles successfully.
- Main JavaScript: 516.53 KB gzip (about +1.1 KB from the prior pass).
- CSS: 12.74 KB gzip (about +0.9 KB from the prior pass).
- Desktop hero, chapter, project gallery and consultation section visually inspected.
- Mobile 390 × 844 hero and first chapter visually inspected; no horizontal overflow.
- Browser console: zero errors during the final local visual pass.
- Existing quality gate still reports only the two previously documented inherited animation-loop complexity violations; this pass added no new violation.

## Deliberately not added

- No additional animation/component library: the refined result uses the existing React, Framer Motion, Lenis and Three.js stack.
- No full website clone, parallel Vercel project, preloader, cursor effect, shader background or auto-playing extra media.
- No fabricated project names, prices, testimonials, addresses or performance claims.
- No production-domain, DNS, analytics or form-provider change.

## Next high-value ideas after visual review

1. Static/reduced-motion hero poster and deferred 3D loading for slower phones.
2. WebP/AVIF derivatives for project photography.
3. Verified project-name/location/scope captions once Oak Park confirms them.
4. Real server-side form delivery with spam protection and tested inbox receipt.
5. Analytics for phone taps, project CTA, form completion and service-page visits.
6. Animation fixtures before simplifying the two complex frame loops.
