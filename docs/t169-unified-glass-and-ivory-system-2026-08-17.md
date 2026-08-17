# T-169 — Unified glass and cooler ivory system

Date: 2026-08-17

## Feedback

The contact form, story containers, and service selector boxes looked related but did not use the same glass treatment. The form was opaque, the services were comparatively heavy, square corners felt too severe, and the newly cooled cream needed to be applied consistently to interface text rather than one section at a time.

## Implementation

Created one coordinated panel family derived from the existing OPC liquid-glass prototype:

- **Dark story glass:** 10px radius, 20px blur, restrained saturation, translucent dark gradient, ivory border.
- **Service glass:** 8px radius, 16px blur, lighter 62%→42% dark gradient, reduced visual weight.
- **Light form glass:** 10px radius, 24px blur, translucent cool-ivory gradient, white edge highlight, soft neutral shadow.
- **Image/service-detail containers:** 10px radius so card-like rectangles share the same architectural softness.
- **Light section surfaces:** contact and gallery both use cooler ivory `#EEEDE9`; the contact backing plane is cooled from `#DCD4C7` to `#D8D8D2`.
- **Interface cream consistency:** every prior `#F0EBE3` use in React interface text, navigation rules, captions, headings, chapter rail, and buttons was changed to `#EEEDE9`.
- **Protected architectural material:** the 3D stucco material remains `#F0EBE3`; this is a physical model color, not interface text, and changing it would alter the house unexpectedly.
- **Reduced-motion fallback:** blur is disabled for the new glass classes when the visitor requests reduced motion, matching the existing panel behavior.

## Verification

- Production build passed: JavaScript 516.55 KB gzip; CSS 12.91 KB gzip.
- Existing quality gate unchanged: only the two inherited complexity errors in `HouseModel.jsx` and `ServicesScene.jsx`.
- Live visual checks completed at phone 390×844, iPad 820×1180, and desktop 1440×1000.
- Contact form computed values: 10px radius, 24px blur, cool-ivory translucent gradient, `rgb(238,237,233)` button text.
- Story panel computed values: 10px radius, 20px blur, dark translucent gradient.
- Service selector computed values: 8px radius, 16px blur, lighter dark translucent gradient.
- Zero horizontal overflow at all three sizes.
- Zero browser console or page errors.

## Traceability

- Git commit: `2807a6f`
- Vercel deployment: `dpl_7E5JNo7axwSnuhL3xs7NddP53Snr`
- Stable review: https://opc-house-hero-preview.vercel.app/
- Original Emergent and the real OPC domain were not changed.
- Screenshots:
  - `outputs/opc-glass-contact-{phone,ipad,desktop}.png`
  - `outputs/opc-glass-story-{phone,ipad,desktop}.png`
  - `outputs/opc-glass-services-{phone,ipad,desktop}.png`
