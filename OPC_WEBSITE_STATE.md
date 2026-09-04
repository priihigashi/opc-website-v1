# OPC Website — Current Official Release Candidate

Last updated: 2026-09-04 17:00 EDT (America/New_York)

## Canonical release line

- Current numbered release: **Candidate 2 — Unified Launch Review**.
- Canonical branch: `release/opc-launch-today-2026-09-04`.
- Frozen website code commit: `045100b15e8baf2ce8a9b47bc861ced9863d850d`.
- Exact immutable preview: `https://opc-house-elements-review-czvsjg97m-priihigashis-projects.vercel.app`.
- Vercel deployment: `dpl_GfFUUMPRDbof7sR33Jb1iKNVwKAv` (`READY`, preview target).
- Vercel project root: `frontend/`.

This branch descends from both required lines of work: content/story commit `9dc66409` and repair/portfolio commit `a6e5e154`, joined in merge commit `3bec6b8b`. The excluded owner-editor branch is not an ancestor.

## Version rule

- Priscila reviews only the one candidate named above. Older preview URLs are historical evidence, not competing choices.
- The next code change creates Candidate 3, then Candidate 4, and so on. A new candidate must descend from the preceding candidate.
- If an approved item is intentionally removed, the candidate record must name it explicitly before review.
- Never label a preview **Final** until all approved changes are in the same frozen commit and Priscila has approved appearance, the contact-delivery decision, and the exact words **go live**.

## Candidate 1 contents

- Homepage Groundwork uses the privacy-cropped Rio Vista curved paver entry with the finished home behind it.
- Homepage Bones uses the stronger active concrete-block wall and roof tie-in construction image; Addition is correctly labeled `DURING`.
- Mobile hero spacing and scroll-cue collision behavior were repaired; the long mobile dead-scroll tail was reduced.
- Portfolio shows the 10 approved projects, preserves per-photo phase metadata, computes badge counts from displayed galleries, and keeps one reversible category menu hidden.
- Portfolio mobile video explicitly selects the mobile H.264 file, requests muted inline playback, and exposes a visible Play video recovery control if autoplay stalls.
- Contact submission is truthfully gated. Without a configured Web3Forms key, the site uses the mail-app fallback and does not claim delivery.
- Candidate 2 adds one hosted-test repair on top of Candidate 1: invalid fields and the honeypot are checked before the missing-delivery-configuration fallback.
- Legacy article recovery, security headers, held-asset pruning, and source-map blocking are inherited from the repair line.

## Verification status

- Automated: 63/63 API tests, 134/134 site contract tests, production build, and whitespace checks pass.
- Merge ancestry: both required branch tips are ancestors; the owner-editor branch is excluded.
- Hosted runtime: phone/tablet/desktop hero layouts pass; all five chapter images load; Groundwork identifiers are unreadable at rendered card size; Portfolio shows 10 approved projects and the filtered Commercial route shows 2 plus View All; the phone video selects the mobile MP4 and advances muted/inline; a legacy article GET and HEAD return 200; invalid contact data returns 400; honeypot returns opaque 200; held Clark media and source maps return 404.
- Fresh browser smoke: Portfolio is clean on desktop with no console messages or horizontal overflow. Mobile homepage/contact has no errors or overflow; the current Three.js dependency emits known deprecation warnings only. No production behavior is affected, but replace the deprecated timer/shadow-map APIs in a future post-launch maintenance candidate.

## Unresolved launch gates

- Priscila must approve the Candidate 2 appearance.
- Vercel currently has no `REACT_APP_WEB3FORMS_KEY`; choose and prove either Web3Forms delivery with working Reply-To or the mail-app fallback.
- Production domain, DNS, and production alias remain untouched until Priscila says the exact words **go live**.

## Rollback

- Current production deployment: `dpl_DtGd3fFS6wPxNyoZLYKYTMvmqtqY`.
- Previous unified release branch: `release/opc-unified-ready-2026-09-03`.
- Pre-today unified source line: `release/opc-unified-2026-09-03` at `9dc66409`.
