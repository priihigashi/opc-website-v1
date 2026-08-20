# OPC Website Restart Handoff — 2026-08-19

## Recovery reconciliation — 2026-08-20

- Active deploy-source worktree: `/Users/priscilahigashi/Documents/Codex/2026-08-17/is-t/work/opc-photoreal-audit-ready`.
- Restart-safe branch: `codex/recovery-source-truth-2026-08-20`.
- Exact pushed checkpoint: `7abfe00189c55ab2af2048c5c71b142f5eab67ce`.
- GitHub readback verified the branch and commit at that exact SHA.
- The required historical checkpoints `3eba563`, `967d5ac`, `63c87bc`, `ae0b2b3`, and `bf1ead7` are ancestors of the recovery checkpoint and remain recoverable.
- The approved AI-edited pergola asset remains `frontend/public/images/opc/outdoor-kitchen-twilight-wide-v2.jpg`; local SHA-256 matches the locked value `271e27fc6a4fdaeaed0a576854aa3cffbf02c3d630b119fdc50c5d3ab18ca044`.
- The candidate alias still serves Vercel deployment `dpl_9UXzS16Hvk3QWNDh34bCgr9GPT8g` from commit `ae0b2b367e871705f0063ddc2a630a525f2b7a2b`; it is behind the recovery checkpoint.
- Candidate deployment is blocked because the local Vercel CLI returned `Not authorized`; no alias, fallback, real-domain, DNS, SiteGround, WordPress, email, billing, or production-traffic change was made.
- Protected fallback remains deployment `dpl_3i6oogMAxc9kL5jirZnR6oJYtyXw` from `bde6efb0a1c4754559a66125c5662cf817d5adf2` at `https://opc-house-hero-preview.vercel.app/`.
- The active worktree is clean after preserving the seven pre-existing local source files in two scoped commits. Disposable ignored outputs remain local only: `.env.local`, `.vercel/`, `build/`, and `node_modules/`.

## SEO final-pass continuation

- Active branch: `codex/seo-final-pass-2026-08-19`
- SEO implementation and verification details: `docs/2026-08-19-seo-final-pass-v1.md`
- The SEO pass is complete in code except for two honest external dependencies: Search Console ownership/DNS verification and Article markup on blog routes that do not yet exist.
- No SEO deployment has been performed as of this handoff entry.

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
