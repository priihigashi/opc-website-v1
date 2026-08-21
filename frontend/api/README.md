# Lead form API

`POST /api/enquiries` — the Oak Park Construction contact form endpoint.

## What it does

Validates the submission, screens it for spam, emails it to the business, and
**stores nothing**. There is no database and no retention window, which is what
the published `/privacy` page promises.

## The configuration gate

Delivery needs `OPC_LEAD_TO`, `OPC_SMTP_USER` and `OPC_SMTP_PASS` in the Vercel
environment (see `../.env.example`). Until all three exist the endpoint answers
`503 {"code":"config_pending"}` and the browser opens the visitor's mail app
pre-filled — the behaviour the site has today. **The site is therefore never
worse than before, and flips to real delivery the moment the variables are set.
No redeploy of code is required, only a redeploy to pick up the env.**

## Responses

| Status | `code` | Meaning | What the UI does |
|---|---|---|---|
| 200 | `sent` | Delivered | Success message |
| 200 | `received` | Rejected as spam | Success message — a bot must not learn it was caught |
| 400 | `invalid` | Field errors in `errors` | Inline field errors |
| 400 | `malformed_json` | Unparseable body | Falls back to the mail app |
| 405 | `method_not_allowed` | Not a POST | — |
| 429 | `rate_limited` | More than 5 in 10 minutes from one IP | Notice, no mail-app hijack |
| 502 | `send_failed` | SMTP refused or timed out | Falls back to the mail app |
| 503 | `config_pending` | Env not set, or nodemailer unavailable | Falls back to the mail app |

## Spam handling

Rejection needs a score of 3+, from: honeypot field (5), submitted under three
seconds (3), three or more links (3), a known spam phrase (3), unexpected script
(2), no timing token (2), one link (1).

A visitor with JavaScript disabled scores 2 for the missing timing token — below
the threshold on purpose, so they are never blocked on that alone.

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
