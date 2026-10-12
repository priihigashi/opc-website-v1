# Blog v2 automatic release on React/Vercel

The release runner is `frontend/scripts/promote-auto-blog-release.mjs`. It is intentionally separate from article staging. It accepts only a clean, pushed `codex/blog-v2-*` branch whose last commit changes exactly the article list, exact-version approval record, and evidence record for one slug. The site release verifier must pass. The runner then selects a READY preview from this project's GitHub connection with the same 40-character commit SHA, branch, owner, and repository. Dry-run is the default; `--execute` promotes that preview and checks that the article and blog listing are visible on the public domain.

The routine must not run until the editorial score policy is calibrated and enabled, both independent reviews approve the exact body, image and diagram decisions are recorded, and staging has passed. A high score cannot override a severe finding. The one-article-per-week limit is enforced at staging.

To release after a qualifying article has been staged, committed, and pushed:

```sh
node frontend/scripts/promote-auto-blog-release.mjs "$SITE_REPO" "$SLUG"
node frontend/scripts/promote-auto-blog-release.mjs "$SITE_REPO" "$SLUG" --execute
```

If public verification fails after promotion, inspect the Vercel production deployment and run `vercel rollback --scope priihigashis-projects` to restore the immediately previous production deployment. Verify the public article and blog listing again. On Vercel Hobby, rollback is limited to the immediately preceding deployment, so act before another production release. Preserve the failed commit, Vercel deployment ID, public check result, and rollback receipt in the Website Shared Drive and link the incident in the Website Build Tracker. Do not retry by weakening an editorial or release gate.
