# T-169 — Responsive hero composition pass

Date: 2026-08-18  
Review URL: https://opc-house-hero-preview.vercel.app/  
Scope: isolated Vercel review copy only; original Emergent preview and real OPC domain untouched.

## Feedback captured

- The hero house drifted vertically at different monitor sizes and left unused space on tall displays.
- “Structure to finish. Built by one team.” was visually crowded and less elegant than the earlier two-line composition.
- The display letters appeared cropped at the top because of tight masked line boxes.
- The overline, display headline and serif line did not form one clean alignment.
- The Oak Park Construction navigation logo was too small beside the oversized headline.

## Implemented direction

- Preserved all previous working components and added versioned `HeroV4`, `NavV3`, `StoryV5`, `HouseModelV4` and `HouseSceneV4`.
- Rebuilt the hero lockup as `ONE TEAM.` / `Every detail.` to keep the clear one-house-style rhythm without the unclear “Every craft” phrase.
- Removed the duplicate upper-right construction label and removed the former headline text shadow/panel effect.
- Reduced the display scale, aligned both headline lines and the overline to the same content grid, and added safe glyph padding so Anton is not cropped.
- Shortened the support sentence to: “Scroll through one house as each Oak Park service comes into view.”
- Added viewport-height-aware hero staging. The house settles progressively lower on tall desktop displays, returns to the existing chapter track before chapter 01, and retains the previously approved Additions rotation/position behavior.
- Cropped the transparent whitespace from the existing white OPC logo into `logo-white-tight-v1.png` and used that new version in the larger navigation treatment. The original asset remains untouched.

## Verification

- Production build: passed.
- JavaScript quality check: no new findings; the same two inherited complexity findings remain in `ServicesScene.jsx` and base `HouseModel.jsx`.
- Visual checks: 1658×1460 tall desktop, 1890×1260 desktop, 2048×1182 wide desktop, 820×1180 iPad and 390×844 phone.
- Final checks: canvas present, hero present, no error overlay, no horizontal overflow, title line boxes not cropped, and zero browser console errors.

## Release

- Feature commit: `8c2b527` (`feat: rebalance responsive hero composition`).
- Vercel deployment: `dpl_EThkrwCQW69eVbg6pFcKtvJVamQy` — Ready.
- Stable review alias: https://opc-house-hero-preview.vercel.app/ — verified HTTP 200.
