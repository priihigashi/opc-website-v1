# Oak Park Portfolio Editor — recovered authoring workspace

Recovered from `feature/portfolio-owner-editor-v1`, commit `34cb71c9544ba5e9539774ddb5ee97242458f43c`, September 4, 2026. This reuses the Council-reviewed Sanity scaffold and its empty-template and ordering corrections. It is separate from the public website, is not deployed, and has no public navigation link. The owner expressly made this improvement non-blocking for the main website launch.

## Implemented preparation

- A blank **New portfolio project** template. Existing projects, routes and photos are never copied into a new album.
- Categories, projects, portfolio page text, single/batch image fields, ordered sequences and project/category order.
- Exactly one active cover, factual alt text, Before/During/Finished labels and public-use confirmation.
- Photo/project/category archive and restore instead of destructive removal.
- Migration from current `frontend/src/data/portfolioProjectsLaunchV1.js`, retaining titles, ordering, categories, phases, progress-only status and verified image metadata. Counts and row phases are recalculated.
- A pure `portfolioContentAdapterV2.js` that prepares the exact public gallery data shape. `ProjectGalleryV7.jsx` exports the shared `ProjectGalleryContent` renderer for a future private preview. This component is not itself an authenticated preview or editor page.
- Offline round-trip validation against current content and all referenced derivatives. It rejects stale migrations, malformed metadata, duplicate album URLs/photo IDs, missing covers, unapproved photos and unprepared CMS uploads.

## Use now without an account or network

From the repository root:

```sh
node studio/scripts/export-current-portfolio.mjs
node studio/scripts/validate-migration.mjs
node --test frontend/src/__contract__/ownerStudioRecoveryV2.test.mjs
```

Regenerate and validate after accepted portfolio changes. The generated file is a migration snapshot, never the authority for public content. These commands write only the local snapshot and perform no CMS import.

## Remaining before online owner editing works

1. Select/create the actual owner Sanity project and authenticate its named owner. Configure membership and owner login security. Check existing authenticated access before requesting setup again. This package creates no account or token.
2. Configure `SANITY_STUDIO_PROJECT_ID`. The default dataset is deliberately `portfolio-test`, not production. Install Studio dependencies and open it locally for an authenticated owner workflow test.
3. Review the empty test dataset, validate the regenerated migration, then run the import dry run. Applied import requires an intentionally supplied short-lived local/server write token. The importer refuses existing document collisions and blocks production unless deliberately enabled. No applied import was performed during recovery.
4. Implement authenticated draft preview and image preparation: uploads, metadata removal, actual derivative creation, factual cover/phase validation and privacy review. Verify that unpublished images cannot be fetched logged out; do not assume Studio login protects every storage/CDN image URL.
5. Connect durable draft content to the shared gallery renderer. The current adapter accepts prepared local OPC derivative paths only and deliberately rejects raw CMS asset references. It does not fetch assets, authenticate users, save drafts or publish.
6. Implement the website publisher and recoverable release snapshots, keeping credentials and deployment hooks server-side. The `releaseSnapshot` schema is only a schema, not operational rollback. Publishing a Sanity document currently does **not** update this website.
7. Test creating an album, uploading/replacing/ordering, archiving/restoring, saved-state recovery, exact phone/desktop preview, logged-out access and rollback before enabling the workflow.

The compiled approved website remains authoritative and unchanged by Studio edits. Public integration, production deployment and domain changes are not authorized by this recovery package. A hidden button or recognizing a computer by browser/IP/local storage is not authentication. An eventual editor button needs a verified owner session or a genuinely local-only tool.
