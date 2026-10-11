# Blog v2 local review preview

The v2 pilot hands a JSON bundle to the site preview script. This creates one **local, review-only HTML file** that resembles the published article layout. It is not a route on the deployed website.

```sh
node scripts/generate-blog-review-preview.mjs /path/to/run /path/to/run/article-preview.html
```

Use an output directory outside `frontend/build`. The script rejects that deployable directory. The output includes a visible draft banner and `noindex,nofollow,noarchive` metadata. A `file://` URL can open it for local desktop and mobile viewport review; local images under `frontend/public` resolve to their local file URLs. Keep the bundle and preview in the private audit workspace, since noindex is not access control.

Accepted bundle fields:

```json
{
  "runId": "pilot-2026-10-10-001",
  "article": {
    "slug": "sample-topic",
    "title": "Article title",
    "category": "Planning, Permits & Contractor Guidance",
    "author": "Oak Park Construction",
    "image": "/images/opc/example.webp",
    "imageAlt": "Descriptive alt text",
    "content": "Opening paragraph.\n\n## Section heading\n\nBody with [source](https://example.org)."
  },
  "review": { "decision": "HOLD" }
}
```

For an audit directory, the script reads `draft.json`, `review.json`, and `receipt.json`; `draft.body` supplies article text. It also accepts a single bundle JSON file. Only a title and body/content are required for rendering. The content renderer handles paragraphs, level 2 and 3 headings, unordered and numbered lists, simple Markdown tables, emphasis, and HTTPS or site-local Markdown links. The React article and static SEO renderer share the table/list parser so the final reader artifacts remain legible across preview and production. The preview does not determine editorial approval.

Approved production articles can insert an explanatory figure with a standalone `<!-- FIGURE:roof-tie-in -->` block in `content` and a matching object in `figures`. Both the React renderer and static HTML generator use the same validator. Every figure requires a local `/images/opc/...` source, meaningful alt text, caption, provenance, rights, and `approved: true`; every declared figure must appear exactly once in the body. These fields document a reviewed asset; setting `approved: true` is part of the later human-approved publication change, not an automation output.

**Publication handoff:** A human must approve an exact reviewed article version. A separate, reviewed site change can then add that article to `src/blog/posts.json` and any approved assets to `public`. The existing React routes and static SEO generator use only `posts.json`; the preview script never writes there, to the sitemap, or to the site build. Current published articles stay intact.

**Release gate added for v2:** `scripts/verify-blog-release.mjs` runs before the site build and again before static SEO generation. The six existing posts are frozen by their hashes in `src/blog/release-baseline.json`. Any new or edited post needs an entry in `src/blog/release-approvals.json` with the exact `postSha256`, the actual local hero image `imageSha256`, `batchStatus: "private-trial-ready"`, the batch receipt SHA-256, reviewer, approval time, and HTTPS evidence link. Changes to article data or image bytes invalidate that entry. Deleting a baseline post also fails. Run `node scripts/verify-blog-release.mjs` before submitting a release PR.

This local gate verifies consistency; a JSON field cannot authenticate a person or prove that the cited batch audit is genuine. A human editor must inspect the exact article and asset, the immutable batch audit, the approval evidence, and the release PR before merge. Keep the batch audit in the shared editorial workspace and link it in the Tracker. The three-pilot series is `private-trial-ready` for private drafting only. Its five original minor editorial findings were corrected in newly linked article receipts; a new independent series review remained `private-trial-ready` and raised seven further minor polish notes. None of these drafts has exact-version human publication approval or a release entry. A newer screen-enclosure article was held by its individual review and is not part of the ready series. Merging or deploying remains a separate authorized site operation.
