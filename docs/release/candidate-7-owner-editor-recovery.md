# Candidate 7 — owner editor recovery

The September 4 request renews adding/editing albums and photos without a chat, preserving the exact gallery template, and later extending editing. The owner explicitly made these refinements non-blocking for launch.

Provenance: `/Users/priscilahigashi/Documents/Codex/2026-09-02/i-wanna/work/opc-portfolio-owner-editor-v1`, branch `feature/portfolio-owner-editor-v1`, commit `34cb71c9544ba5e9539774ddb5ee97242458f43c`. Earlier Council-approved scaffold: `78cbc698f983907c155797e2021dbe685dcd330a`. Recovered tracked Studio files only, not old website code, dependencies, credentials or old migration authority.

This package brings the isolated Studio forward, migrates the current launch dataset, preserves metadata and ordering, and validates a lossless normalized round trip. GalleryV7 exports its exact content renderer for eventual protected preview while retaining GalleryV5 navigation reset and current lookup. No public editor route, button or CMS connection was introduced. Studio is outside the frontend deployment root.

Eight contracts cover current migration, custom album normalization, invalid identities/categories/covers, bad metadata and paths, unapproved/unprepared uploads, reversible archive, shared renderer isolation and safe import. Offline validation was regenerated against the consolidated Candidate 7 dataset and exactly matches 12 projects, 74 photos and 888 derivatives. These tests do not establish an authenticated owner workflow or deployed editor.

Recovery surfaced repeated Victoria Park photo IDs, which could collide in React rendering. The lead corrected them. Historical cover object IDs sometimes differ from gallery IDs; normalization selects the matching gallery photograph by verified path without changing the chosen image.

Read-only Safari verification reached the Sanity login page; this browser session requires sign-in. No account was created and no credentials were entered. Existing account/project availability outside this session is not assumed.

Remaining: owner project/login, authenticated durable drafts and preview, verified private image preparation, operational publisher/rollback and end-to-end owner/security testing. The historical TaskQ claim that an account is the only blocker overstates completion. Editor work remains non-blocking for website publication.

Services Council assessment: a Services-only centered wrapper with x=0, stable level scale/height and yaw-only reveals matches today's explicit instruction. Keep house and loading/error/static fallback in one measured dedicated region. Verify phone/tablet/desktop, 320px width, long descriptions, no title/control obstruction, selection and detail-route handoff. Homepage choreography is outside that instruction. No preference contradiction found in the latest request or Candidate 7 scope manifest.
