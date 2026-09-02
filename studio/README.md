# Oak Park Website Editor

This is the versioned Phase 1 owner Studio. It is intentionally separate from the public React app and is not linked from the website navigation.

## What is included

- Categories, projects, ordered photo sequences, portfolio page text, and read-only release snapshots.
- Single and batch image drop through a native Sanity image array.
- Required alt text, project phase, public-use confirmation, and exactly one cover per project.
- Archive/restore fields for projects, categories, and individual photos instead of destructive deletion.
- A migration exporter for the current approved `portfolioProjectsV3.js` data.

## What is deliberately not active

- The public website does not read Sanity yet.
- No CMS account or dataset is created by this repository.
- No deployment hook or production publishing credential exists in browser code.
- Existing portfolio components, data, images, routes, and SEO output remain the fallback.

## Owner project setup gate

1. Create or select the Oak Park Sanity project on the Free plan.
2. Limit Studio membership to named owners and enable MFA on the login provider.
3. Set `SANITY_STUDIO_PROJECT_ID` and optionally `SANITY_STUDIO_DATASET` locally or in the protected Studio deployment.
4. Run `npm install` and `npm run export:current`.
5. Dry-run the exact files and target with `npm run import:current`. Then use `npm run import:current -- --apply` with a short-lived write token against an empty non-production test dataset. The importer refuses any collision and never replaces existing owner content. Production imports are blocked unless `--allow-production` is deliberately added.
6. Run `npm run dev` and verify the full owner flow before enabling any public content adapter.

The first production integration must use published-only reads. Draft preview and deployment hooks stay server-side.
