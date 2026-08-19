# OPC Website — Launch Readiness and Publishing Plan

Date prepared: 2026-08-19
Target launch window: 2026-08-20, 2:00–3:30 PM ET

## Versions preserved

- Launch candidate: https://opc-house-elements-review.vercel.app/
- Protected previous house version: https://opc-house-hero-preview.vercel.app/
- Current WordPress production site: https://oakpark-construction.com/
- Candidate branch: `codex/photoreal-audit-ready-2026-08-19`

The protected previous version and the existing WordPress site are not overwritten by preparing or deploying the candidate.

## Hosting decision

Use Vercel for the new static React website. Keep SiteGround as the DNS provider during launch and retain the WordPress account/site for 7–14 days as a rollback. Supabase is not required for this launch: the site does not need a database, user accounts, authentication, or an admin dashboard. A future server-side enquiry form can use a small Vercel Function and an email provider without adding Supabase.

Current DNS observed on 2026-08-19:

- Nameservers: `ns1.siteground.net`, `ns2.siteground.net`
- Apex and `www`: current SiteGround website address
- Email: Google Workspace MX records
- TXT: Google Workspace SPF and Google site verification

Do not change the nameservers, MX records, SPF, DKIM, DMARC, or Google verification records during the website cutover.

## Launch-ready work completed

- Production build passes with source maps disabled.
- Home, portfolio, project galleries, services, About, navigation, footer, and contact section checked on desktop and phone.
- Portfolio contains six organized project cards; selected-project galleries keep each project together and standardize carousel sizing.
- Direct routes and refreshes are supported for services and portfolio paths.
- Search metadata, canonical URL, Open Graph metadata, `robots.txt`, and `sitemap.xml` are present.
- Known indexed WordPress routes have permanent redirects in the Vercel configuration.
- Baseline security headers are present: MIME sniffing prevention, strict referrer policy, camera/microphone/location disabled, and same-origin framing.
- Visitor-facing exact project street numbers were replaced with project names.
- Public contact information uses the business phone, business inbox, service area, license number, and languages only.

## Honest launch caveats

- The contact form currently opens the visitor's email app with their project details filled in. The visitor must review and send the email; the site does not silently submit or store form data.
- Analytics and Search Console verification are post-launch follow-ups unless already configured on the production domain.
- Large WebGL and video assets make the experience richer but should continue to be monitored for mobile performance.
- Two pre-existing code-complexity warnings remain in the 3D scene/model files. The production build and changed-file checks pass; these warnings did not create a launch regression.

## Tomorrow's publication checklist

1. Open the launch candidate on phone and desktop and approve the visible content.
2. In the Vercel project, add both `oakpark-construction.com` and `www.oakpark-construction.com` if not already present.
3. Copy the exact DNS values displayed by Vercel.
4. In SiteGround DNS Zone Editor, change only the apex (`@`) website record and the `www` website record to those exact Vercel values.
5. Leave nameservers and every email-related MX/TXT record unchanged.
6. Wait for Vercel to show both domains as configured and the SSL certificate as valid.
7. Verify the production domain:
   - home and scrolling house animation
   - mobile and iPad navigation
   - every services route
   - portfolio landing and every project route
   - direct refresh on a project route
   - About, Google-review link, phone, email, and enquiry fallback
   - `robots.txt` and `sitemap.xml`
   - `www` redirects consistently to the chosen canonical domain
8. Submit `https://oakpark-construction.com/sitemap.xml` in Google Search Console.
9. Keep SiteGround/WordPress intact for 7–14 days. If a launch-blocking problem appears, restore the previous apex and `www` website records; do not alter email records.
10. After the rollback window, decide whether SiteGround is still needed for anything besides DNS before cancelling or downgrading it.

## Post-launch improvements (not launch blockers)

1. Replace the mail-app contact fallback with a real server-side enquiry delivery flow, spam protection, and a tested confirmation state.
2. Add privacy-conscious analytics and Search Console reporting.
3. Add route-specific page titles/descriptions and structured local-business/service data.
4. Rename residual asset folder/file paths that contain internal project-number shorthand, even though those numbers are no longer displayed to visitors.
5. Continue portfolio curation and photo optimization without changing the launch architecture.

## Primary references

- Vercel custom domains: https://vercel.com/docs/domains/set-up-custom-domain
- SiteGround DNS guidance: https://www.siteground.com/tutorials/getting-started/point-domain-siteground-servers
