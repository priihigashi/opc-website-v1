# OPC Website — Current Official Release Candidate

Last verified: 2026-09-03 (America/New_York)

## Canonical source

- Use branch `release/opc-unified-ready-2026-09-03` for every next website change.
- It contains both prior lines of work: ChatGPT story/mobile updates (`aa056d3`) and Claude portfolio/blog safety work (`834108c`).
- The unified rollback point is `release/opc-unified-2026-09-03` at `6945faa`.
- Do not resume either older line as the current website; they are retained only for history and rollback.
- Vercel project root: `frontend/`.

## Launch-candidate repairs

- Restored all missing responsive files for the Shell, Addition, and Groundwork Recent Project images.
- Corrected the Shell/Bones image dimensions and orientation metadata.
- Added a contract test that fails if an advertised homepage image derivative is absent or empty.
- Legacy blog articles are served only when SiteGround returns a substantial real article. CAPTCHA, error, tiny, or app-shell responses now fail safely to `/services` and are never cached as content.
- No held project folders, client-name strings, or browser source maps are present in the production build.

## Deliberate constraints

- The Shell/Bones photo is the existing privacy-safe image. It is not a perfect exposed-framing image. Do not replace it with Kinney, Harbor Court, Rio Vista, Clark, or any other held-client material without explicit approval.
- Blog recovery is best-effort while the old SiteGround origin challenges automated requests. The blog is not a launch dependency; the temporary safe fallback is intentional.
- SMTP delivery still depends on production environment variables. The contact page's mail-app fallback remains available, but a real server-delivered message must be verified before anyone claims email delivery works.
- The public Oak Park domain, DNS, and production alias remain untouched until the owner explicitly approves cutover.

## Required release gate

Before public cutover, verify the exact deployed candidate on mobile and desktop: five Recent Project images, all chapter cards and navigation, portfolio visibility, representative blog routes, contact validation/fallback, held-asset 404s, and no source maps. Record the branch, exact commit, preview URL, and rollback target in the handoff.
