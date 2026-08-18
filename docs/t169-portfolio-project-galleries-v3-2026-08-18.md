# T-169 — Portfolio Project Galleries V3

## Request reconciled

- Preserve the earlier horizontal slide/gallery interaction.
- Make every portfolio arrow/card open a real project page.
- Keep multi-scope work together as one project with multiple photo rows.
- Group small kitchen/bath collections until complete before/progress/after sets are verified.
- Remove uneven grid gaps.
- Test the portfolio heading in the same Anton + Cormorant editorial system as the home hero.

## What changed

- Preserved `Portfolio.jsx` and `PortfolioV2.jsx` unchanged as reversible history.
- Added `PortfolioV3.jsx` as the active project index.
- Added `ProjectGalleryV1.jsx` for individual project pages with drag/swipe, scroll snapping, and working previous/next buttons.
- Added shared structured data in `portfolioProjectsV3.js`.
- Reorganized 1270 Harbor Court as a multi-scope project with three rows: addition, interior remodel, and raised planter.
- Added grouped Kitchen and Bathroom collection pages.
- Added Clark Pergola build and finished rows.
- Added truthful construction-documentation pages for shell and concrete work.
- Copied the selected first-party photographs into `public/images/opc/projects/<project>/` so the deployed site does not depend on external links.
- Changed the grid to full-width / paired / full-width / paired, eliminating orphan cards.
- Tested `REAL WORK.` in Anton with `Clearly Organized.` in italic Cormorant.

## Verification

- Production build: pass.
- Desktop index renders six clickable cards with no console errors.
- 1270 Harbor Court card navigates to `/portfolio/1270-harbor-court`.
- Three Harbor Court gallery rows render.
- Gallery next button moved the first row from scroll position `0` to `1197` in browser verification.
- Mobile 390×844: no horizontal page overflow on index or gallery; all six gallery arrow buttons remain available.

## Preserved / not changed

- Original Emergent preview untouched.
- `oakpark-construction.com`, DNS, and production domain untouched.
- Earlier portfolio implementations remain in the repository for direct rollback.

## Remaining curation work

- Verify and add the correct full-home project video after confirming it contains only the intended Harbor Court project.
- Continue Drive-level project matching for more complete before/progress/after sets.
- Replace grouped kitchen/bath collections with address/project-specific pages as provenance is confirmed.
