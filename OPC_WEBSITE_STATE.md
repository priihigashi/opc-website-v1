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
- Any code change creates Candidate 2, Candidate 3, and so on. A new candidate must descend from the preceding candidate.
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
- Hosted runtime verification is in progress for mobile/tablet/desktop layout, portfolio video, galleries, legacy routes, privacy identifiers, headers, and excluded artifacts.

## Unresolved launch gates

- Priscila must approve the Candidate 1 appearance.
- Vercel currently has no `REACT_APP_WEB3FORMS_KEY`; choose and prove either Web3Forms delivery with working Reply-To or the mail-app fallback.
- Production domain, DNS, and production alias remain untouched until Priscila says the exact words **go live**.

## Rollback

- Current production deployment: `dpl_DtGd3fFS6wPxNyoZLYKYTMvmqtqY`.
- Previous unified release branch: `release/opc-unified-ready-2026-09-03`.
- Pre-today unified source line: `release/opc-unified-2026-09-03` at `9dc66409`.
