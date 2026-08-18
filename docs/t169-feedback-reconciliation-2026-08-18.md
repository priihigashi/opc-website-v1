# T-169 feedback reconciliation — 2026-08-18

This audit compares the active Vercel preview and active source against Priscila's feedback messages and the two project handoff/checklist attachments. It records only what can be demonstrated in the current source or live preview.

## Completed and evidenced

- The original Emergent project and the real OPC domain remain untouched. Work is isolated on branch `emergent-house-hero-source-2026-08-17` and the Vercel review URL.
- The source is in GitHub/Vercel rather than being dependent on Emergent for continued editing.
- The homepage includes the same-house scroll narrative, service chapters, responsive hero composition, and a dedicated Services route.
- Prior visual feedback implemented in the active source includes: reduced bedroom overexposure, cooler cream surfaces, glass-style cards with softened corners, clearer hero copy, responsive hero placement, improved addition reveal space, roof antialiasing, removal of the extra geometric landscaping, restored groundwork path, Google review content, a visible lime project CTA, and removal of weak/unverified homepage counters.
- The `Selected Work` label now uses a readable darker lime (`#747500`) with the bright OPC lime retained for its line. This fixes the cream-on-cream contrast failure shown in Priscila's screenshot.

## Partially completed

- The service story and house transformations exist, but the house is still the procedural model. It is smoother and better staged, not the fully photorealistic same-house asset specified in the original handoff.
- The outdoor/pergola card uses the widened twilight asset `outdoor-kitchen-twilight-wide-v2.jpg`, but the asset's AI-expansion provenance and a final glare-quality approval are not fully documented.
- The Portfolio route contains real OPC imagery, categories, and some project-phase labels. It does not yet demonstrate verified before/middle/after sequences for each service.
- Basic metadata and page routes exist, but the full local SEO plan, city landing pages, and conversion-tracking implementation are not complete.

## Not completed or regressed

- The required exact blueprint/current-home to photoreal finished-home transformation is not complete.
- A production-ready modular GLB/GLTF house and the requested licensed/free asset test are not complete.
- The active `PortfolioV2` is a filterable two-column card grid. It is **not** the approved B2 project-by-project stacked horizontal swiper. Earlier commits contained row/swiper experiments, but the active component regressed to the generic grid.
- The complete Google Drive photo curation, website-use folder organization, and verified before/progress/after ordering are not complete.
- The contact form does not yet have a verified live form backend/inbox delivery path.
- GA4/GTM/Google Ads conversion tracking is not complete.
- The deeper city/service SEO page set is not complete.
- Final production-domain cutover is intentionally not complete and must remain blocked until approval.
- The requested completion email and calendar review event are not evidenced as sent/created.

## Next proof checkpoints

1. Replace the active Portfolio grid with the approved B2 project rows/swipers using only verified photo groups.
2. Finish Drive curation and document source/provenance for every published image.
3. Decide and build the photoreal same-house asset pipeline; do not describe the procedural model as photoreal.
4. Connect and test the real enquiry backend and analytics conversions.
5. Complete responsive visual regression checks after each major replacement.

## URLs and source

- Review URL: <https://opc-house-hero-preview.vercel.app/>
- Original Emergent preview (reference only): <https://house-hero.preview.emergentagent.com/>
- Active branch: `emergent-house-hero-source-2026-08-17`
- Active gallery component: `frontend/src/components/GalleryV2.jsx`
- Active portfolio component: `frontend/src/pages/PortfolioV2.jsx`
