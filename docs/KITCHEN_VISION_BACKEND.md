# OPC Kitchen AI Vision Backend

Serverless backend for the `kitchen-vision.html` lead-magnet widget.

## Host choice

Use Vercel Functions. The public site can stay on GitHub Pages, while the API deploys independently and keeps keys server-side. `vercel.json` rewrites the browser-facing contract paths (`/kitchen/...`) to `/api/kitchen/...`.

## API contract

Base URL is the Vercel deployment URL once deployed.

- `POST /kitchen/preview`
  - multipart fields: `photo`, `answers`, `source_page`, `referrer`, `utm`
  - returns `{ jobId, previewUrl, previewDataUrl, engine }`
  - note: `previewDataUrl` is included so the static frontend can show the preview without exposing a file bucket.
- `POST /kitchen/verify-email/start`
  - JSON `{ jobId, email }`
  - returns `{ sent:true }`
- `POST /kitchen/verify-email/confirm`
  - JSON `{ jobId, code }`
  - returns `{ verified:true }`
- `POST /kitchen/submit`
  - JSON `{ jobId, name, phone, email }`
  - returns `{ ok:true }`

Every error returns `{ error, code }`.

## Required production env vars

- `GEMINI_API_KEY`
- `PRI_OP_INFSH_API_KEY`
- `PRI_OP_GMAIL_APP_PASSWORD`

Recommended:

- `PRI_OP_ABSTRACT_PHONE_API_KEY` or `PRI_OP_NUMVERIFY_API_KEY`
- `KITCHEN_REQUIRE_PHONE_LOOKUP=true`
- `KITCHEN_LEAD_TO_EMAIL=priscila@oakpark-construction.com`
- `KITCHEN_ALLOWED_ORIGINS=https://priihigashi.github.io,https://oakpark-construction.com,https://www.oakpark-construction.com`

Optional/future:

- `PRI_OP_REPLICATE_API_KEY` for Seedream full-restyle mode
- `KITCHEN_ENABLE_TWILIO_VERIFY=false`
- `PRI_OP_TWILIO_ACCOUNT_SID`
- `PRI_OP_TWILIO_AUTH_TOKEN`
- `PRI_OP_TWILIO_VERIFY_SERVICE_SID`

Local smoke-test env:

```bash
export KITCHEN_ALLOW_MOCK_AI=true
export KITCHEN_DEV_RETURN_OTP=true
export KITCHEN_ALLOW_LOCAL_ORIGIN=true
npx vercel dev --listen 3100
bash scripts/test-kitchen-api.sh
```

## Security notes

- API keys are read only from server env vars.
- CORS is locked to GitHub Pages and future custom domains; localhost is allowed only for local development unless disabled.
- Uploads are limited to JPG/PNG/WebP and 8 MB by default.
- Upload moderation runs before image generation when `GEMINI_API_KEY` is configured.
- Email verification is required before `/kitchen/submit`.
- Phone validation supports Abstract or Numverify and can be made mandatory with `KITCHEN_REQUIRE_PHONE_LOOKUP=true`.
- Twilio Verify is intentionally feature-flagged off for Phase 1.

## Production gap to resolve before heavy traffic

The current store uses local filesystem storage (`.kitchen-vision-store` locally, `/tmp` on Vercel). That is good for local testing and short-lived single-instance function runs, but not durable enough for a real lead magnet under traffic. Before public launch, wire one persistent store:

- Vercel Blob, or
- Google Drive folder using the existing OPC OAuth route, or
- another private object store.

Until that is added, the endpoint should be treated as MVP/backend prototype, not a durable production queue.

## Current deployment status

Local verification passed on `http://localhost:3100`.

Vercel project detected:

- account: `priihigashi`
- project: `priihigashis-projects/opc-website`

Vercel env vars are currently empty. Do not point the live `kitchen-vision.html` page at a production URL until the required env vars are added and a persistent storage route is selected.

## AIOX/security audit

Architect audit:

- Pass: separate serverless backend keeps API keys out of the browser.
- Pass: API contract paths are stable through Vercel rewrites.
- Flag: durable job storage is not solved by serverless filesystem; choose Vercel Blob or Google Drive before public launch.
- Decision: high-res is generated only on verified submit. This resolves the plan contradiction between "store hi-res at preview" and "hi-res generated/sent only here."

DevOps audit:

- Pass: `npm audit --audit-level=moderate` returns zero vulnerabilities for repo dependencies.
- Pass: `.vercel`, `node_modules`, `.env`, logs, and `.kitchen-vision-store` are ignored.
- Flag: Vercel has no env vars yet. Required: `GEMINI_API_KEY`, `PRI_OP_INFSH_API_KEY`, `PRI_OP_GMAIL_APP_PASSWORD`.
- Flag: phone lookup enforcement needs `PRI_OP_ABSTRACT_PHONE_API_KEY` or `PRI_OP_NUMVERIFY_API_KEY`, then `KITCHEN_REQUIRE_PHONE_LOOKUP=true`.

Dev/security audit:

- Pass: CORS blocks unknown origins with `{error, code}`.
- Pass: uploads are type/size checked before generation.
- Pass: email OTP must be confirmed before submit.
- Pass: no Twilio path is active in Phase 1; hook is feature-flagged off.
- Pass: smoke test covers preview, preview image retrieval, email start, email confirm, and submit.
- Flag: rate limiting is in-memory best effort until persistent storage/KV is added.
