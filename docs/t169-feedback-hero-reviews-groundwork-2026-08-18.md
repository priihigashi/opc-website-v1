# T-169 — Hero, reviews, clarity and groundwork feedback pass

Date: 2026-08-18

Scope: the isolated Vercel review copy only. The original Emergent preview, `oakpark-construction.com`, DNS and production hosting were not changed.

## Feedback implemented

- Rebuilt the hero composition as versioned `HeroV3` / `StoryV3` components.
- Broke the headline into `Structure` / `to finish.` with `Built by one team.` below it.
- Tightened the overline-to-title spacing and reduced the headline footprint.
- Re-staged the 3D house from a near-frontal, lower camera; moved and scaled it so the building reads beside the copy instead of underneath it.
- Preserved scroll rotation and all five construction states.
- Replaced chapter 02 `Open it up.` with `Rooms, reimagined.`
- Corrected the chapter 05 entry landscape: widened the walking slabs, moved both flanking planters clear of the path, removed the floating hedge row and used three intentional planted masses.
- Replaced the repeated license/accountability/counties trust cards with a versioned Google-review section.
- Verified the exact Google Business listing in Google Maps on 2026-08-18: Oak Park Construction, 1621 NE 34th Ct, Pompano Beach, phone (954) 258-6769, 5.0 rating, 9 reviews.
- Used three short, attributed excerpts from the verified listing and a `Read all reviews on Google` link. The site does not prompt visitors to write a review.
- Made the contact-section `Start Your Project` kicker visible as brand lime on a compact dark architectural panel.

## Versioning / rollback

Preserved previous components: `HeroV2`, `StoryV2`, `Testimonials`, `Contact`, `HouseScene`, `HouseModel` and `Driveway`.

New versioned components: `HeroV3`, `StoryV3`, `TestimonialsV2`, `ContactV2`, `HouseSceneV2`, `HouseModelV2` and `DrivewayV2`.

`App.js` is the only routing switch between the preserved and current component versions.

## Verification

- Production bundle compiled successfully; final artifacts were refreshed in `frontend/build`.
- JavaScript quality gate has only the same two inherited complexity findings: `ServicesScene.jsx` (32) and `HouseModel.jsx` frame loop (21). No new lint finding was added.
- Test runner: no tests present; `--passWithNoTests` exits successfully.
- Rendered checks: desktop 1440×1000, iPad 820×1180 and phone 390×844.
- Canvas present at all sizes; hero and scroll-state house rendered; zero horizontal overflow.
- Chapter 02 copy verified in the rendered DOM.
- Groundwork state visually verified with the walking path clear between the planters.
- Google-review section verified at iPad and phone layouts; cards stack cleanly on mobile.
- Contact form retains the 10px glass radius; lime kicker computed as `rgb(203, 204, 16)` on a dark background.
- Browser console: zero errors in the final phone pass.

## Open items not represented as complete

- The current house is better staged and more architectural, but it is still the existing procedural model. A true photoreal 3D replacement remains a separate asset/model build.
- Contact delivery is still mailto fallback until the real backend is connected.
- GA4/Google Ads conversion tracking, static/reduced-motion 3D fallback, image derivative work, verified project facts and additional SEO/local pages remain open.
- Google rating/count should be rechecked before production promotion because public reviews can change.
