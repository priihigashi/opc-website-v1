# OPC Website Restart Handoff — 2026-08-19

## Durable GitHub checkpoints

- Current website work: branch `codex/furniture-landscape-v1-2026-08-19`
- Canonical project-state backup: branch `codex/project-state-backup-2026-08-19`
- Protected public review remains `https://opc-house-elements-review.vercel.app/`
- Protected fallback remains `https://opc-house-hero-preview.vercel.app/`
- The real OPC domain, SiteGround/WordPress, DNS, and Google Workspace records were not changed.

## Completed on the current website branch

- Versioned furniture and landscaping variant.
- Softer hero veil with a restrained warm glow.
- Upper-right second-floor startup shadow-flash repair using versioned `EnvelopeV9`, `HouseModelV22`, and `HouseSceneV24`.
- Alternating contact emphasis using versioned `ContactV4`: phone and county line semibold; email and language line regular.
- Repository-level `AGENTS.md` restart rule requiring commit, push, remote verification, and a handoff before a requested restart or new chat.

## Verification already completed

- Production build passes after the latest visual changes.
- Targeted lint passes for the changed contact files.
- Desktop and phone contact layouts have no horizontal overflow.
- The first two seconds of the house intro were captured frame-by-frame after the wall-flash repair.
- Every intentional file in the current website worktree is committed.

## Resume procedure

1. Read `AGENTS.md`, the OPC website skill, and the canonical `OPC_WEBSITE_STATE.md` before editing.
2. Resume from branch `codex/furniture-landscape-v1-2026-08-19`.
3. Pull/fetch from GitHub and verify the branch commit before starting the local development server.
4. Treat `http://localhost:3000/` as temporary preview only; it may stop after a restart, but the code remains on GitHub.
5. Do not merge, deploy over protected reviews, change the real domain, or alter DNS without Priscila's explicit approval.

## Still pending

- Final approval and possible deployment of the local visual refinements.
- Remaining house/animation visual review.
- Portfolio photo curation and provenance work being prepared separately.
- Blog restoration and maintainable CMS/dashboard decision.
- Real form backend, analytics/conversion tracking, SEO/city pages, performance, accessibility, security, and launch/rollback execution.
