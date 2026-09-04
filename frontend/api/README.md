# Lead form API

`POST /api/enquiries` — the Oak Park Construction contact form endpoint.

## What it does

Validates the submission, screens it for spam, emails it to the business, and
**stores nothing**. There is no database and no retention window, which is what
the published `/privacy` page promises.

## The configuration gate

The approved launch path uses the public `REACT_APP_WEB3FORMS_KEY` in the browser,
but only after this endpoint validates the fields, honeypot and rate limit. SMTP
remains a supported alternative through `OPC_LEAD_TO`, `OPC_SMTP_USER` and
`OPC_SMTP_PASS`. If neither delivery path is available, the browser opens the
visitor's mail app pre-filled so a lead is never silently swallowed.

## Responses

| Status | `code` | Meaning | What the UI does |
|---|---|---|---|
| 200 | `sent` | Delivered | Success message |
| 200 | `received` | Rejected as spam | Success message — a bot must not learn it was caught |
| 200 | `validated` | Cleared for browser-side Web3Forms delivery | Submits to Web3Forms |
| 400 | `invalid` | Field errors in `errors` | Inline field errors |
| 400 | `malformed_json` | Unparseable body | Falls back to the mail app |
| 405 | `method_not_allowed` | Not a POST | — |
| 429 | `rate_limited` | More than 5 in 10 minutes from one IP | Notice, no mail-app hijack |
| 502 | `send_failed` | SMTP refused or timed out | Falls back to the mail app |
| 503 | `config_pending` | Env not set, or nodemailer unavailable | Falls back to the mail app |

## Spam handling

Opaque rejection requires high-confidence evidence: a filled honeypot, three or
more links, or a known spam phrase. Weak signals remain diagnostic but cannot
silently discard a lead: submitted under three seconds (1), unexpected script
(2), no timing token (2), a stale token (1), and one link (1).

A visitor with JavaScript disabled can still reach delivery because the missing
timing token is never enough to trigger opaque rejection.

## Known limits

- **Rate limiting is per serverless instance**, held in memory. It throttles a
  single abusive client but is not a global limiter; a distributed flood would
  need an external store, which would mean a paid dependency.
- **SMTP credentials are a shared secret.** Rotate the App Password rather than
  the account password if it ever leaks.

## Tests

```
yarn test:api
```

Covers validation, spam scoring, attribution whitelisting, HTML escaping, mail
header-injection, and every response branch including the fallbacks. The suite
also asserts the client and server service lists have not drifted apart.
