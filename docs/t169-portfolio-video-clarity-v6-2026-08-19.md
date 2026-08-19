# T-169 — Portfolio video clarity V6

Date: 2026-08-19

## Feedback addressed

- The portfolio hero overlay was too dark to read the underlying work.
- The 12-second video loop ended before the full-home sequence could be understood.
- `Real Work. / Clearly Organized.` described the filing system rather than clearly introducing the portfolio.

## Versioning

- Preserved `PortfolioV5.jsx`, `portfolio-hero-intro.mp4`, and `portfolio-hero-intro-poster.jpg` unchanged.
- Added `PortfolioV6.jsx`, `portfolio-hero-intro-v2.mp4`, and `portfolio-hero-poster-v2.jpg`.
- `App.js` now selects `PortfolioV6`; reverting the one import restores V5.

## Video source and optimization

- First-party source: `https://oakpark-construction.com/wp-content/uploads/2025/05/mgc-compress-1.mp4`.
- Source inspected as H.264, 1280 × 720, 24 fps, 63.83 seconds, approximately 17 MB.
- V6 retains the full 63.83-second montage rather than the earlier 12-second excerpt.
- Re-encoded H.264, 1280 × 720, 24 fps, no audio, fast-start, approximately 7.5 MB.
- Desktop and tablet autoplay the muted inline montage; phones and reduced-motion visitors retain a static poster for performance and accessibility.

## Visual and copy changes

- Reduced the left-to-right veil from `0.91 / 0.56 / 0.22` to `0.58 / 0.20 / 0.06`.
- Reduced the top darkness and retained only a restrained bottom gradient for text readability.
- Replaced the ambiguous headline with `Our Projects. / See the Work.`
- Rewrote the supporting copy to explain that each project contains finished photos and construction progress in order, with full-home scopes kept together.

## Verification

- Targeted ESLint: passed.
- Optimized production build: passed.
- Rendered checks: 1440 × 900 desktop, 820 × 1180 iPad, and 390 × 844 phone.
- No horizontal overflow, browser console errors, or framework error overlay.
- Video is displayed on desktop/iPad and intentionally replaced by the poster on phone.

