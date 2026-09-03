# OPC Website — Launch Candidate Evidence — 2026-08-27

**Status: READY FOR PRISCILA LAUNCH REVIEW. Not launched. No DNS change, no
production cutover, no SiteGround change was made.**

## Execution checkpoint — 2026-08-27 (supersedes stale unknowns below)

Council review and live Preview verification closed the highest-risk unknowns.
The Vercel project `opc-house-elements-review` already has Root Directory set to
`frontend`; no setting change was required. Git commit
`14dd5e723db604e72d8163b1dcc78e5139719de2` deployed as Preview
`dpl_AJ2AJ6aHE1pJVkmFyzkMBdpBPBfX` at
`https://opc-house-elements-review-57ra2ubnq-priihigashis-projects.vercel.app`.
Vercel reports that deployment READY, tied to the exact commit, with
`/api/enquiries` present.

The live endpoint answers `503 {"ok":false,"code":"config_pending"}`, not
404. Routing is therefore working; SMTP remains deliberately unconfigured and
still needs a real mailbox test before launch.

The first Preview exposed a different flaw: `trailingSlash: false` canonicalizes
every slash URL to its bare twin with 308 before Vercel evaluates configured
redirects. The 289 explicit slash duplicates in the 578-rule map were therefore
unreachable. Council recommended preserving the canonical URL policy and
removing the dead duplicates. The map now contains **289 effective rules**.
All **289 / 289** returned their configured status and `Location` on the exact
Preview. Contract tests model the extra platform hop for slash input:
`/legacy/` → 308 `/legacy` → configured 307/308 destination.

Current verified gates: API **54 / 54**, contracts **78 / 78**, production build
PASS. The branch was pushed and `origin/release/opc-launch-2026-08-27` matched
the verified code commit. Statements below claiming that Root Directory,
deployment, build, push credentials, or live redirect behavior were unverified
are retained only as the pre-execution record and are superseded by this
checkpoint.

This record exists because the project kept losing to the same failure mode: a
completion claim written in a chat, believed later, and never re-checked
against the routed code. Everything below was re-verified from the working tree
at the commits named. Where something could not be verified from here, it says
so instead of inheriting an older PASS.

---

## 1. Frozen target

| | |
|---|---|
| Repository | `priihigashi/opc-website-v1` |
| Base commit | `6b1e0bb652a7248a422872f4c76c2b4edc3a2da9` — `origin/release/banner-scroll-responsive-2026-08-26` |
| Candidate branch | `release/opc-launch-2026-08-27` |
| Verified code HEAD | `14dd5e723db604e72d8163b1dcc78e5139719de2` |
| Routed entry | `src/index.js` → `AppV4.js` (single entry; `App.js`/`AppV2.js` deleted 2026-08-24) |
| Routed surface | `/`, `/services`, `/services/:slug`, `/portfolio`, `/portfolio/:projectId`, `/service-areas`, `/privacy`, `/preview/centered-house` |
| Platform config | `frontend/vercel.json` — **Vercel Root Directory must be `frontend`** |
| Public site today | `oakpark-construction.com` — WordPress on SiteGround, untouched |

### Divergences found against the written record

1. **The tracker's authority commit is two commits stale.** The README tab of
   the Build Tracker names `council/launch-fixes-2026-08-25 @ 75f2ffa` as the
   release code. That branch is local and unpushed. `origin` already carries
   `75f2ffa` plus `4fc3491` (truthful contact release) and `6b1e0bb`
   (responsive story banners). This candidate is built on the newer superset.

2. **`main` is not the site.** `origin/main` (`f56dd23`) is the legacy static
   HTML site and shares **no history** with the React candidate — the merge base
   is empty. Anyone reading `main` is reading a different product.

3. **`T-208-E` cannot ship as written — see §3.**

4. **The "96/96 tests pass" claim did not reproduce on first run.** Five API
   tests failed with `503` where `502` was expected. Cause: `nodemailer` was
   absent, so `await import("nodemailer")` threw and the handler answered
   `config_pending` before reaching the delivery branch. Installing the single
   dependency restored 54/54. An environment artifact, not a regression — but it
   is exactly why a bare pass count is not evidence.

---

## 2. Test evidence at `14dd5e7`

| Suite | Result |
|---|---|
| `node --test api/_tests/*.test.mjs` | **54 / 54 pass** |
| `node --test src/__contract__/*.test.mjs` | **78 / 78 pass** |
| Total | **132 / 132** |

29 of those contract tests are new in this candidate (redirect map 9,
analytics 7, SEO 9, security headers 4).

`eslint-plugin-jsx-a11y` **strict** ruleset across the 20 routed components and
pages: **0 violations**. The ruleset was proved live against a deliberately
broken probe file first, which reported 5 errors — so the zero is a real zero,
not a plugin that failed to load.

---

## 3. Blog URL continuity — T-208-F applied, T-208-E superseded for launch

**The instruction was to implement T-208-E. T-208-E was not implementable.**

T-208-E is the correct *classification* of the 232 legacy posts and 23
archives, and it correctly reclassified the painting-costs post. But 260 of its
510 rules redirect to `/blog/<slug>`, and **the candidate has no `/blog`
route** — `AppV4.js` does not define one and `vercel.json` does not rewrite one.
Applying it as written would answer 130 indexed URLs with a 307 into a hard 404,
which is strictly worse than the clean 404 those URLs return today.

T-208-F is the launch-safe rebuild recorded in the tracker on 2026-08-21:
identical classification, identical 510 entries, every destination retargeted to
a route that exists. That is what is applied here.

| | T-208-E | T-208-F (applied) |
|---|---|---|
| 130 Keep & fix posts | 307 → `/blog/<slug>` (404s) | 307 → nearest real service page |
| 102 drop/duplicate posts | permanent | permanent |
| 9 category + 14 tag archives | → `/blog` | → `/services` |
| Entries | 510 | 510 |

Merged and canonicalized into the existing map: **289 effective redirects**.
The initial 578-entry version included 289 explicit slash duplicates that
Vercel could never reach while `trailingSlash: false` was active; those dead
entries were removed after live Preview verification.

**The painting-costs correction is applied.** `bf1ead7` had shipped
`/budget-friendly-interior-painting-costs-in-2025-for-your-florida-home-remodel`
as a *permanent* redirect. That post is Keep & fix at 1,951 words, so a
permanent redirect gives the address away for good. Both slash variants are now
307 to the same destination, and the address stays reclaimable. This was the
only collision with the existing map; the other 33 legacy rules are untouched.

### Validated before applying, asserted forever after

`src/__contract__/legacyRedirectMap.test.mjs` asserts:

- 289 ≤ 1024 platform ceiling
- 0 duplicate sources
- 0 destinations without a route
- 0 chains, 0 self-loops
- every configured source is canonical (no trailing slash), while every slash
  input is modeled as Vercel's 308 canonicalization hop to the configured source
- painting-costs is 307, not permanent
- exactly 130 holding redirects
- 9 category + 14 tag archive rules, all reachable
- the pre-existing `/gallery`, `/hub`, `/contact-us`, `/jobgallery/*`,
  `/expertise/*`, `/project-gallery/*` and `/portfolio/1270-harbor-court` rules
  still resolve to the same places

### Live proof

The exact Preview returned the configured status and `Location` for all **289 / 289**
canonical sources. The preceding Preview exhaustively demonstrated the platform
308 canonicalization for all 289 slash inputs; representative slash inputs were
rechecked after the dead rules were removed. Production remains untouched.

Vercel semantics assumed and documented in the test header: `permanent: true`
⇒ **308**, `permanent: false` ⇒ **307**. The tracker's 2026-08-21 live probe of
the 33 existing rules returned 308, which corroborates the mapping.

---

## 4. Portfolio media — T-203 / T-204 verified, nothing changed

Re-verified from the working tree, not from the completion note:

- 13 projects, 92 image placements
- **1,104 / 1,104** expected derivative files present (92 × 4 widths × 3 formats)
- 0 missing, 0 broken references, 0 file under 2 KB
- 0 empty `alt` strings
- 0 stock, AI or placeholder imagery in any routed data file
- filenames preserve provenance (`project__category__PHASE__role__seqNN__source`)
- Opa Locka Airport is CONCRETE / "Concrete Repair" — the 2026-08-24 correction
  survived, and the generator carries the same override

36 files on disk (3 source images × 4 widths × 3 formats, ~4 MB) are not
referenced by any placement. They are harmless, they are approved exports, and
deleting them is not required for launch, so they were left alone.

**No card, filter, route, carousel proportion or layout was touched.** The
approved pergola asset is intact.

---

## 5. Contact form and analytics

### T-213 — code complete, delivery unproven

`api/enquiries.mjs` is a real backend, not a mailto wrapper: field validation,
honeypot, spam scoring, per-instance rate limiting, honest status codes, and
`Cache-Control: no-store`. Privacy handling is unusually careful — the rate
limiter keys on a salted 4-byte SHA-256 digest of the IP, never the raw address,
and no log line carries a name, email, phone or message body. No SMTP value is
named `REACT_APP_*`, so none can be inlined into the browser bundle. 54 API
tests cover it.

**It has never delivered a message.** `OPC_LEAD_TO`, `OPC_SMTP_USER` and
`OPC_SMTP_PASS` are unset on Vercel, so the endpoint answers `503
config_pending` and the browser falls back to the visitor's mail app. That
fallback is deliberate and means no lead is silently swallowed — but a code pass
is not delivery proof. **This needs Priscila (§8).** No mailbox or credential
was invented here.

### T-214 — the missing half, now wired

`CONVERSIONS.PHONE_CLICK` was declared on 2026-08-21 and **never called from
anywhere**. There was no primary-CTA event at all. So "phone taps are tracked"
was true in the constant table and false in the product.

Now instrumented: both phone numbers (footer, contact section) and all three
primary CTAs (desktop nav, mobile nav, service detail), plus the new
`cta_click` event. The two emitters take a fixed placement label and read the
path themselves rather than accepting a caller-supplied object, so no form field
can reach GA4 through them. Runtime allowlists reject any unknown placement, and
a mocked dataLayer test asserts the exact emitted payloads. Everything stays inert without
`REACT_APP_GA4_ID`, and Consent Mode still opens **denied** for `ad_storage`,
`ad_user_data` and `ad_personalization`.

The privacy page now names the two interaction events, so the disclosure still
matches what the code sends.

---

## 6. SEO, performance, accessibility, security

**SEO (T-215–217).** 26 routes, 25 sitemap URLs — the only omission is
`/privacy`, which is `noindex,follow`. Zero sitemap entries are redirect
sources; zero routes are shadowed by a redirect. All titles and descriptions
unique; five project descriptions trimmed from 166–173 to 144–151 characters by
dropping a brand mention the title already carries. Every `og:image` resolves to
a real file. Unknown paths under `/services/*` and `/portfolio/*` receive
`noindex,follow`, so the SPA catch-all cannot produce indexable soft-404s — and
old blog URLs no longer reach the SPA at all, because they now redirect.

Structured data asserts only what the pages can prove: GeneralContractor,
WebSite, Service, CollectionPage, CreativeWork/ImageObject, BreadcrumbList. **No**
`aggregateRating`, `reviewCount`, `ratingValue`, `priceRange`, `openingHours` or
`FAQPage`. `buildArticleSchemaV1` exists for the future blog but is deliberately
not wired to any route — emitting it today would mean inventing an author and a
publication date for pages that display neither. All of this is now asserted.

**Performance (T-219–220).** Measured statically. The portfolio hero paints a
poster image with `fetchPriority="high"`; the video is `preload="metadata"`,
hidden below `sm`, and hidden under `prefers-reduced-motion`. Portfolio images
use responsive AVIF/WebP/JPEG at 480/768/1200/1800 with `decoding="async"`.
`houseRenderPolicy.js` refuses interactive 3D on reduced-motion, Save-Data,
`slow-2g` and `2g`, and models readiness in three states so a slow-but-healthy
device waits rather than skipping to the static image. Heaviest served assets:
`portfolio-hero-intro-v5.mp4` 5.58 MB (the reviewed cut), `city_1k.hdr` 1.47 MB,
`residence.glb` 0.90 MB. `portfolio-hero-intro-v2.mp4` (7.47 MB) ships but is
served only when `REACT_APP_PORTFOLIO_HERO=full`; `portfolio-hero-intro.mp4`
(1.37 MB) is referenced only by unrouted `PortfolioV5`. ~8.8 MB of unused video
is deployed — worth pruning later, costs a visitor nothing today.

**The production build passes.** Bundle sizes and Lighthouse/Core Web Vitals are
still not measured and remain launch-review work.

**Accessibility (T-221).** 0 violations under the strict `jsx-a11y` ruleset
across the routed surface, with the ruleset proved live first. Keyboard, focus
visibility, screen-reader behaviour, contrast ratios and the carousel and menu
interaction models still require a real browser and were **not** verified here.

**Security (T-222).** No tracked `.env` files, no secret-shaped values in
tracked source, SMTP credentials server-side only. Baseline headers present. A
**Report-Only** CSP was added — report-only on purpose, because an enforcing
policy cannot be proven safe without a deployed preview and would white-screen
the site if it blocked the runtime JSON-LD or a three.js blob worker. The test
fails if anyone flips it to enforcing without re-verifying.

**`Strict-Transport-Security` was deliberately not added**, and its absence is
asserted. HSTS pins a browser to HTTPS for the full `max-age`; shipping it
before the cutover is proven would obstruct the documented rollback. It belongs
after.

Dependency posture is carried from the 2026-08-26 audit (0 critical, 26 high, 2
moderate, largely in the CRA build chain) and was **not** independently
re-verified — `npm audit` needs a lockfile this repo does not use.

---

## 7. Rollback record (T-223) — partly documented, partly unverifiable here

| Item | Value | Source |
|---|---|---|
| Current production | WordPress on SiteGround | tracker, 2026-08-26 audit |
| DNS rollback | revert the A record to **`34.174.8.45`** | Build Tracker, Design Decisions |
| Nameservers | remain SiteGround — do not change | tracker |
| Mail | Google Workspace MX preserved; changing website A/CNAME only | tracker |
| Hosting | **SiteGround stays paid and untouched.** Not cancelled. | standing instruction |
| Restore procedure | leave SiteGround serving; if cut over, revert A to `34.174.8.45` | tracker |

**Not verified from here and not inherited:** live A / NS / MX / TXT records and
the SiteGround backup's existence and date. Authenticated SiteGround access needs
Priscila. The Vercel Root Directory and Preview environment are verified in the
execution checkpoint above.

### Open items that need a deployment

1. ~~Live HTTP status and `Location` for the redirect map.~~ **Closed:** 289 / 289
   canonical rules plus platform slash canonicalization were verified on Preview.
2. Production build, bundle sizes, Core Web Vitals on a throttled phone.
3. Browser accessibility pass — keyboard traversal, focus visibility, screen
   reader, contrast.
4. CSP Report-Only violation review, then the enforcing switch.
5. ~~Confirmation that Vercel Root Directory is `frontend`.~~ **Closed:** the
   project setting is `frontend`, the exact Preview reads `vercel.json`, and the
   API route responds 503 `config_pending` rather than 404.

---

## 8. Needs Priscila

1. **Set the SMTP variables on the Vercel project** — `OPC_LEAD_TO`,
   `OPC_SMTP_USER`, `OPC_SMTP_PASS` (optionally `OPC_LEAD_FROM`,
   `OPC_LEAD_BCC`, `OPC_SMTP_HOST`, `OPC_SMTP_PORT`). Then send a real test
   enquiry and have Mike confirm it arrived at
   `contact@oakpark-construction.com`. Until a human confirms receipt, T-213 is
   not green. No mailbox or credential was invented here.
2. ~~Confirm or set Vercel Root Directory = `frontend`.~~ Closed; already set.
3. ~~Push and deploy the isolated review branch.~~ Closed; exact Preview above.
4. **Search Console** verification and sitemap submission — needs her account.
5. **Authenticated SiteGround access** to capture the backup date and confirm
   the restore path.
6. **DNS cutover** — explicitly out of scope. Not touched.

---

## 9. How to pick this up

The commits are on `release/opc-launch-2026-08-27`, built on `6b1e0bb`:

```
14dd5e7  T-208-F: remove unreachable trailing-slash rules
27cac23  T-222: report-only CSP + header contract
4c087a9  T-215/216/217: sitemap / route table / redirect map bound together
63e38ea  T-214: fire the phone-tap and CTA conversions
0d6487e  T-208-F: apply the launch-safe legacy blog redirect map
6b1e0bb  (base) fix(home): synchronize responsive story banners
```

12 files, +3,113 / −25. A git bundle and a flat patch series are in
`ClaudeWorkspace/_opc_launch_2026-08-27/` in case the branch ref is not
reachable.

Re-run the evidence with:

```
cd frontend
node --test api/_tests/*.test.mjs        # 54/54
node --test src/__contract__/*.test.mjs  # 78/78
```

`nodemailer` must be installed or five API tests will report 503 instead of 502.

---

## 10. Verdict

**READY FOR FINAL REVIEW.** The Preview proves the redirect map, build, Root
Directory, and API routing. A real enquiry received by Mike after SMTP variables
are set is still required before launch. Browser accessibility, performance and
CSP follow-ups remain as listed above.

The site is not live. No DNS record was changed. SiteGround is untouched and
still paid.
