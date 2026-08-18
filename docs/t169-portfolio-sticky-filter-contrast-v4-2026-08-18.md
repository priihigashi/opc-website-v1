# T-169 — Portfolio Sticky Filter Contrast V4

Priscila flagged that the persistent portfolio category menu became difficult to read whenever bright project photography scrolled behind its translucent glass.

## Change

- Preserved `PortfolioV3.jsx` unchanged.
- Shipped the minimal contrast revision as `PortfolioV4.jsx`.
- Kept the same sticky position, height, horizontal scrolling, pill geometry, blur and lime selected state.
- Replaced the image-dependent translucent wash with a 92–96% obsidian neutral gradient.
- Increased inactive labels to 75% white and pill borders to 25% white.
- Added a restrained lower shadow so the menu edge remains legible over light photography.

## Verification

- Production build passed.
- Sticky position remains `top: 64px`.
- Desktop visual check passed over the bright 1270 Harbor Court kitchen image.
- No browser console errors.
