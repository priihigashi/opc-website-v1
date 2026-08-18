# T169 — Portfolio original-site video hero V5

Date: 2026-08-18

## Request

Use the montage from Oak Park Construction's original website above the fold on the portfolio page.

## Source audit

- The Drive name search did not expose the binary video directly through the connector.
- The OPC project archive already preserved the approved web master at `assets/video/hero-intro.mp4` with its poster.
- The preserved master is a 12-second, 1280 × 720 H.264 loop at approximately 1.4 MB. It is the web-ready cut derived from the original-site montage and avoids using the soft 480 × 266 OG reference file.

## Versioned implementation

- Preserved `PortfolioV4.jsx` unchanged.
- Added `PortfolioV5.jsx` and activated it in `App.js`.
- Copied the approved loop and poster into `frontend/public/video/` with portfolio-specific filenames.
- Rebuilt the opening portfolio header as a one-viewport cinematic video hero while retaining the approved heading, description and sticky filter menu.
- Added a small `View Projects` down cue.
- Mobile and reduced-motion visitors receive the static poster instead of autoplay video.
- The prior portfolio grid, project links, filters and project-gallery routes remain unchanged below the hero.

## Rollback

Point the lazy portfolio import in `App.js` back to `PortfolioV4`.
