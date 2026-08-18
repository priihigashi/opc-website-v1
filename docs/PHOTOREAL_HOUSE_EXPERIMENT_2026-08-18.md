# OPC photoreal house experiment — 2026-08-18

## Safety and rollback

- Protected source checkpoint: `opc-review-before-photoreal-2026-08-18`
- Isolated experiment branch: `codex/photoreal-house-experiment-2026-08-18`
- The protected Vercel review version, original Emergent project, and live OPC domain were not changed during research.

## Research conclusion

The supplied Executive Summary was directionally useful, but its model shortlist could not be adopted as written. Live-page verification found:

| Candidate | Live finding | Decision |
| --- | --- | --- |
| CGTrader — Luxury Modern Villa Pool | Free, light enough, but a traditional gabled estate rather than the compact OPC modern house | Reject as hero replacement |
| CGTrader — Modern Villa Landscape / Backyard | Free modular pool, pergola, paths, and landscape; potentially useful as a reference or later entourage source | Keep as reference |
| CGTrader — Wooden Modern Villa 01 | Free and manageable, but visibly boxy and not luxurious | Reject |
| BlenderKit — Modern Luxury Villa | Currently Full Plan and about 1.1 GiB, not the free lightweight option described in the PDF | Reject |
| BlenderKit — Modern House | Free and polished, but about 408.5 MiB and architecturally unrelated | Reject for web performance and identity |
| BlenderKit — Modern House 2 | Free and 34.2 MiB, but exterior-only and more blocky than the existing OPC silhouette | Reject |
| Sketchfab — Modern luxury villa with pool | Free CC BY, 44.5K triangles, but download requires login and the model is still a generic U-shaped villa | Reject as primary hero |

## Chosen implementation

Use a hybrid rebuild: preserve the OPC house silhouette and the existing modular scroll choreography, while replacing the CAD-like presentation layer with more architectural detailing. This protects the strongest parts of the current concept:

- the recognizable compact house shape;
- service-by-service wall, roof, addition, outdoor-living, pool, and driveway animation;
- direct control of every moving object;
- a sub-megabyte core model instead of a 34–408 MiB scene download.

Experiment changes:

- softened visible wall, window, roof, addition, pergola, pool, and hardscape edges;
- corrected roof layering with separate fascia, membrane, and soffit surfaces;
- improved stucco relief, glass/metal response, exposure, and light balance;
- added organic multi-clump shrubs and a restrained tropical site layer;
- replaced the rectangular hedge blocks at the entry with organic planted forms;
- upgraded the outdoor kitchen, pergola lighting, pool lighting, and coping;
- added ACES tone mapping, soft shadows, and SMAA edge smoothing;
- kept all existing scroll progress ranges and animation refs intact.

## External assets

No third-party model was added to the repository in this experiment. This is intentional: none of the verified free candidates met the combined requirements for architecture, luxury, modularity, licensing access, and web performance. Therefore there are no new attribution or redistribution obligations in the branch.

## Remaining visual review

- compare hero at 1440×900, 1920×1080, 1366×768, iPad portrait/landscape, and modern phone widths;
- inspect front/back/addition corners at each pause point;
- inspect cutaway roof separation and restoration;
- verify the addition growth remains visible beside the content card;
- verify site elements do not cover the entry path;
- check GPU frame rate and final transfer size before any public review deployment.

## Public review handoff

- Public audit URL: `https://opc-house-elements-review.vercel.app/`
- Separate Vercel project: `opc-house-elements-review`
- Deployment: `dpl_4DiP2t1mTUchySrSwAXWJVjRPJa1`
- The earlier unique preview URL was not suitable for handoff because it redirected unauthenticated visitors to Vercel login.
- The public alias was verified in a clean in-app browser: the page title, full service copy, and one WebGL canvas loaded successfully.
- The protected comparison remains `https://opc-house-hero-preview.vercel.app/`; its alias was not changed.
- Completion email sent successfully to `priscila@oakpark-construction.com` through GitHub Actions workflow run `32184179161`.
