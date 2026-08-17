# T-169 — Realistic luxury pass (2026-08-17)

## Scope and safety

- Source preserved from Emergent on `emergent-house-hero-source-2026-08-17`.
- The original Emergent preview was not edited or replaced.
- Review copy deployed to `https://opc-house-hero-preview.vercel.app`.
- No Oak Park production domain or DNS was changed.

## Implemented

- Replaced stock Unsplash photography with first-party Oak Park Construction finished-work and clearly labeled progress photography.
- Added the real Oak Park Construction logo to navigation and footer.
- Replaced placeholder phone, email, address, dates, metrics, testimonials, and project claims with verified business information or neutral trust statements.
- Added stronger dark glass/scrim treatment behind hero, chapter, story, and Services text so the animated house no longer competes with readability.
- Preserved the original 3D house and scroll choreography while reducing visual noise and a deprecated shadow option.
- Added an email fallback to the contact form when no backend URL is configured.
- Removed Emergent's injected script, PostHog session recording, an unused font request, and placeholder metadata.
- Added SPA routing rules for direct Vercel URLs and a reproducible JavaScript quality command.
- Fixed two React hook warnings. The production build now compiles without build warnings.

## Verification completed

- Desktop hero and chapters 01–05 inspected visually.
- Services selector and Kitchen service transition inspected visually.
- Portfolio inspected; no stock image URLs remain on the page.
- Mobile viewport 390 × 844 inspected with no horizontal overflow.
- Public Vercel homepage loaded successfully with correct title, logo, photography, animation, and no error overlay.
- Production build completed successfully: main JavaScript about 515 KB gzip; CSS about 12 KB gzip.

## Known limitations

- The 3D experience still carries a moderately heavy initial JavaScript bundle plus a model and HDR environment. It is suitable for review, but a later performance pass should preserve a static/mobile fallback before production promotion.
- Two inherited animation frame functions exceed the current complexity ceiling. They were documented rather than blindly refactored because animation fixtures are not yet available.
- One benign Three.js clock deprecation remains at runtime in an upstream dependency.
- The contact form uses an email-app fallback on this isolated preview. A production form endpoint and confirmed delivery inbox should be connected before the real domain is promoted.

## Brainstorm / next improvement candidates

1. Add a lightweight poster image and an explicit reduced-motion/static mode for slower phones and accessibility settings.
2. Compress or transcode the model/environment and lazy-load non-hero photography to improve first visit speed.
3. Add a restrained 01–05 progress rail inspired by the resource spreadsheet, without adding another motion library.
4. Replace phase-labeled construction images with additional polished completed-project images when more verified photography is available.
5. Add verified project names, locations, and short scopes only after Oak Park confirms the facts.
6. Add a real production form service with spam protection and tested inbox delivery.
7. Add complete Open Graph artwork, favicon/app icons, sitemap, canonical URL, and structured business data when the final domain is approved.
8. Create animation regression fixtures before simplifying the two high-complexity frame loops.

## Asset organization

First-party files used by the review build are stored under `frontend/public/images/opc/`. Their original source locations and use/exclusion decisions are recorded in the Builder Tracker Image Provenance tab. `commercial-interior.jpg` is retained as an organized first-party candidate but is not referenced by the current build.
