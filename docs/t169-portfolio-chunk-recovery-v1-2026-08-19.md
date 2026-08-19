# T-169 Portfolio Chunk Recovery V1

Date: 2026-08-19

## Cause

The local development browser retained an older main bundle while the development server rebuilt and briefly stopped responding. The browser then requested `static/js/src_pages_PortfolioV7_jsx.chunk.js` from that stale session and received no usable chunk, producing `Loading chunk src_pages_PortfolioV7_jsx failed`.

`PortfolioV7.jsx` was not deleted or renamed. Its lazy import in `App.js` was correct, the project data in `portfolioProjectsV3.js` remained intact, the 22 project-folder images remained present, and the development server compiled successfully after a clean restart. The exact PortfolioV7 development chunk then returned HTTP 200.

## Repair

- Restarted only the disposable local development server; no source, project data, image, gallery, sequence, filter, or prior portfolio version was removed.
- Preserved `PortfolioV7`, `ProjectGalleryV3`, and all previous portfolio/project-gallery versions unchanged.
- Added additive `PortfolioRouteBoundaryV1` around the two lazy portfolio routes. A future temporary chunk failure now displays a branded recovery screen with `Reload page` and `Return to portfolio` actions instead of replacing the entire website with the raw development error screen.
- Added an exact compatibility redirect from `/portfolio/1270-harbor-court` to the existing canonical Harbor Court project route, `/portfolio/harbor-court-residence`; no project data was duplicated or renamed.
- Did not touch the protected fallback website or the real domain.

## Verification

- Production build and targeted lint passed.
- Direct `/portfolio`, header navigation, all six canonical project routes, and the `1270-harbor-court` compatibility route loaded without broken images or horizontal overflow.
- Harbor Court showed 11 photos across three labeled sequences; the other five projects retained their original project-specific photo counts and labels.
- Project refresh, browser back/forward, the Kitchens + Bathrooms filter, carousel arrows, `02 / 05` counter update, disabled-end behavior, and single-card 800 px carousel viewport passed.
- Desktop 1366 × 768, tablet 820 × 1180, and phone 390 × 844 checks passed; the phone filter rail remains intentionally horizontally scrollable without page overflow.
- Forced the local server offline after the homepage bundle loaded, then navigated to Portfolio. The branded recovery screen appeared with both required actions and no raw red runtime screen. Restarting the server and selecting `Reload page` restored all six cards.
