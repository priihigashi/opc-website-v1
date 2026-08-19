# T-169 — Service-card portfolio links (V11/V7)

Date: 2026-08-19

## Decision

Added a discreet lime portfolio link with a small white arrow to every animated service card. The links keep the user in the same tab and take them directly to real, matching Oak Park Construction work.

## Destination map

- Shell Construction → filtered `SHELL + NEW BUILD` portfolio view
- Kitchen + Bathroom Remodels → filtered `KITCHENS + BATHROOMS` portfolio view
- Additions → Harbor Court Residence, the real multi-scope project containing the documented addition sequence
- Outdoor Living → filtered `OUTDOOR LIVING` portfolio view
- Concrete + Pavers → filtered `CONCRETE` portfolio view

No new or unsupported category was invented. The addition remains part of its full-home project so unrelated projects do not appear beside it.

## Preserved rollback layers

- `StoryV10.jsx`, `ChapterV2.jsx`, and `PortfolioV6.jsx` remain unchanged.
- The active candidate now uses `StoryV11.jsx`, `ChapterV3.jsx`, and `PortfolioV7.jsx`.

## Verification

- Production build: passed.
- New-file lint: passed.
- Full-project lint: unchanged pre-existing complexity findings in `ServicesScene.jsx` and `HouseModel.jsx`.
- Desktop 1440 × 1000: card and link fit without overlap or horizontal overflow.
- iPad 1024 × 1366: filtered project card and sticky category bar fit cleanly.
- Phone 390 × 844: service card and both remodel cards fit without horizontal overflow.
- All five links resolve to real content.
- All filtered portfolio images load; no browser console errors observed.
