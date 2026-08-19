# OPC Website repair checkpoint — 2026-08-19

## Implemented

- Replaced the Services selector with an additive V2 that mounts the current homepage house model, supports all eight service destinations, shows selection progress, and preserves the existing Services implementation as a fallback.
- Added a visible Home link to desktop and mobile navigation while retaining the clickable logo and current-page accessibility state.
- Increased the contrast of the contact-section metadata on the light background through an additive Contact V3 wrapper.
- Preserved the current Services headline because replacement copy has not yet been approved.

## Verification

- Production build passes.
- Targeted lint passes for all changed and added files.
- Services was checked at desktop, tablet, and mobile sizes with no horizontal overflow or runtime error overlay.
- All eight service routes render successfully.
- The service-selection animation visibly begins before navigation.
- Mobile navigation exposes Home, marks Services as the current page, and returns to the homepage correctly.

## Safety boundary

No DNS, SiteGround, WordPress, Google Workspace email, or real-domain settings were changed.
