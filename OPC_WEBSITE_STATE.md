# OPC Website — Current Official Release Candidate

Last updated: 2026-09-04 18:06 EDT (America/New_York)

## Canonical release line

- Current numbered release: **Candidate 4 — Project Galleries Open at Top**.
- Canonical branch: `release/opc-launch-today-2026-09-04`.
- Frozen website code commit: `f4a5f700c56e4ba5736e85ee45a907b29eddc070`.
- Exact immutable preview: `https://opc-house-elements-review-foja4tbka-priihigashis-projects.vercel.app`.
- Vercel deployment: `dpl_7n8WG2awxKY1jFG8MhCBfwDW2FZ2` (`READY`, preview target).
- Vercel project root: `frontend/`.

This branch descends from both required lines of work: content/story commit `9dc66409` and repair/portfolio commit `a6e5e154`, joined in merge commit `3bec6b8b`. The excluded owner-editor branch is not an ancestor.

## Version rule

- Priscila reviews only the one candidate named above. Older preview URLs are historical evidence, not competing choices.
- The next accepted code change creates Candidate 5, then Candidate 6, and so on. A new candidate must descend from the preceding candidate.
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
- Candidate 3 loading: pending and delayed startup show only an 18px lime-segment loader; five seconds changes the label to `STILL LOADING` and never creates a failure. The old fallback asset is not mounted or requested during loading. Two owned WebGL frames reveal the interactive house. Reduced motion/save-data/2G use a distinct lightweight state; explicit render failure uses a small contained house plus the Home refresh action.
- Candidate 3 browser evidence: Home passed pending, delayed, ready, failure, and static-preference checks at 390×844, 820×1180, and 1440×900; Services passed the same state model at 390×844. Council re-audit: `APPROVE`. Hosted HTML serves the same locally verified production bundle `main.9295c0fa.js`, containing the Candidate 3 loading markers.
- Candidate 4 navigation: project-detail pages reset to the top before paint without applying a global route reset. From a deeply scrolled Portfolio listing, desktop and 390×844 phone journeys both open the selected gallery at `scrollY=0`, show the back link, preserve a useful listing position on browser Back, and direct project URLs also start at the top. API 63/63, contracts 136/136, production build, targeted lint, local browser journeys and hosted click verification passed. Council implementation audit: `VERIFIED`. Hosted bundle `main.c441a228.js` matches the local build.

## Unresolved launch gates

- Priscila must approve the Candidate 4 appearance.
- Vercel currently has no `REACT_APP_WEB3FORMS_KEY`; choose and prove either Web3Forms delivery with working Reply-To or the mail-app fallback.
- Production domain, DNS, and production alias remain untouched until Priscila says the exact words **go live**.

## Rollback

- Exact Candidate 3 website code: `50b7bbd6338dccf86562ef2844f7c5f07a299f2b`.
- Exact Candidate 3 preview: `https://opc-house-elements-review-chfvxisjr-priihigashis-projects.vercel.app` (`dpl_6jBBZGuCYy4pr7ZisRyVqosdyMpj`).
- Exact Candidate 2 website code: `045100b15e8baf2ce8a9b47bc861ced9863d850d`.
- Exact Candidate 2 preview: `https://opc-house-elements-review-czvsjg97m-priihigashis-projects.vercel.app` (`dpl_GfFUUMPRDbof7sR33Jb1iKNVwKAv`).
- Current production deployment: `dpl_DtGd3fFS6wPxNyoZLYKYTMvmqtqY`.
- Previous unified release branch: `release/opc-unified-ready-2026-09-03`.
- Pre-today unified source line: `release/opc-unified-2026-09-03` at `9dc66409`.
