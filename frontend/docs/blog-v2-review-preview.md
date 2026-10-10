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

For an audit directory, the script reads `draft.json`, `review.json`, and `receipt.json`; `draft.body` supplies article text. It also accepts a single bundle JSON file. Only a title and body/content are required for rendering. The content renderer handles paragraphs, level 2 and 3 headings, unordered lists, emphasis, and HTTPS or site-local Markdown links, matching the existing published blog conventions. The preview does not determine editorial approval.

Approved production articles can insert an explanatory figure with a standalone `<!-- FIGURE:roof-tie-in -->` block in `content` and a matching object in `figures`. Both the React renderer and static HTML generator use the same validator. Every figure requires a local `/images/opc/...` source, meaningful alt text, caption, provenance, rights, and `approved: true`; every declared figure must appear exactly once in the body. These fields document a reviewed asset; setting `approved: true` is part of the later human-approved publication change, not an automation output.

**Publication handoff:** A human must approve an exact reviewed article version. A separate, reviewed site change can then add that article to `src/blog/posts.json` and any approved assets to `public`. The existing React routes and static SEO generator use only `posts.json`; the preview script never writes there, to the sitemap, or to the site build. Current published articles stay intact.
