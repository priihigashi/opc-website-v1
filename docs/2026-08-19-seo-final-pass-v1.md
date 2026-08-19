# OPC SEO final pass V1 — 2026-08-19

## Safety and scope

- Branch: `codex/seo-final-pass-2026-08-19`
- Protected review and fallback deployments were not overwritten.
- The real domain, SiteGround DNS, WordPress installation and Google Workspace records were not changed.
- This pass is implemented locally and prepared for an isolated review deployment only.

## Implemented

### Route metadata and canonicals

- Added unique titles, descriptions, canonical URLs, Open Graph data, Twitter card data, image URLs and image-alt metadata for 19 routes.
- Added a post-build generator so direct requests receive route-specific metadata in the original HTML instead of depending only on client-side JavaScript.
- The privacy route is `noindex,follow` and excluded from the sitemap.
- Unknown client routes receive `noindex,follow` metadata.

### Structured data

- Homepage: truthful `GeneralContractor` / `HomeAndConstructionBusiness` and `WebSite` JSON-LD.
- Service index: `CollectionPage` and `BreadcrumbList`.
- Service detail routes: `Service` and `BreadcrumbList`, with Broward, Palm Beach and Miami-Dade as `areaServed`.
- Portfolio index: `CollectionPage`, `ItemList` and `BreadcrumbList`.
- Project routes: `CreativeWork`, `ImageObject` and `BreadcrumbList` using the existing project data and captions.
- Service-area route: `CollectionPage` and `BreadcrumbList`.
- Added `buildArticleSchemaV1` for the recovered blog to use once real article routes, authors and dates exist. No Article schema is emitted on nonexistent blog pages.
- No fabricated address, opening hours, price range, aggregate rating, publication dates or license data were added.

### Local relevance

- Added one substantial `/service-areas` page covering Broward, Palm Beach and Miami-Dade.
- Added internal links from the footer to the service-area page.
- Did not create thin city doorway pages. Individual city pages should be added only when the business can support each page with real service coverage, distinct local content and preferably relevant project evidence.

### Claim and credential cleanup

- Removed the unverified `Florida GC · CBC1263425 · Insured` line from the active footer.
- Removed “licensed” from homepage metadata because the exact license record was not confirmed from the official DBPR result during this pass.
- Preserved the existing Google-review presentation and source link, but did not add review or aggregate-rating schema.
- Replaced absolute engineering, permit-handling, seasonal-usage and “outlast” wording with a versioned, supportable homepage story and service-detail copy.
- Service pages now explain scope, county coverage, a three-step starting process and the next action.

### Images, sitemap and redirects

- Added descriptive social image alt metadata to every indexed route.
- Project structured data uses the existing image captions as `ImageObject` captions.
- Verified 33 referenced active image/video assets exist.
- Verified the only empty active image alt is the navigation logo, which is intentionally decorative because its home link already has an accessible label.
- Sitemap contains exactly the 18 canonical indexable routes; no missing or extra URLs.
- Vercel compiled 69 valid permanent redirect/clean-URL rules. Spot checks confirmed HTTP 308 output for `/gallery`, `/expertise/renovations`, the old Harbor Court URL and the preserved 2025 blog URL.

## Validation

- Targeted ESLint: pass for all new and changed SEO React/JavaScript files.
- CRA production build: pass.
- Vercel production-output build: pass; no deployment performed.
- Generated HTML: all 19 route documents have the expected title, canonical and robots directive.
- Browser checks: homepage, service, project, service-area and privacy routes render meaningful content with no error overlay.
- Browser structured-data checks:
  - home: contractor/local-business + WebSite
  - service: Service + BreadcrumbList
  - project: CreativeWork + BreadcrumbList
  - service area: CollectionPage + BreadcrumbList
  - privacy: no schema and `noindex,follow`
- Browser console: no errors. Existing Three.js deprecation warnings remain unrelated to SEO.

## External completion steps

### Search Console

Not connected in this pass because no Search Console ownership token or authorized Google session was provided, and changing DNS is outside the protected local scope.

The code accepts `REACT_APP_GOOGLE_SITE_VERIFICATION` (or `GOOGLE_SITE_VERIFICATION` during the post-build step) and emits the meta verification tag only when a real token is supplied. For full-domain coverage, Google requires a Domain property and DNS verification. After ownership is verified and the candidate is published on the real domain:

1. Add or open the `oakpark-construction.com` Domain property.
2. Add Google's DNS TXT verification record without removing SiteGround or Google Workspace records.
3. Submit `https://oakpark-construction.com/sitemap.xml`.
4. Inspect the homepage, one service route, one project route and `/service-areas`.
5. Request indexing only after the real-domain release is confirmed.

### Blog Article schema

The schema builder is ready, but Article markup must wait for the blog recovery because Google expects visible, matching headline, author, publication date, modification date and images. Do not create placeholder articles or invented dates to satisfy schema.

### Final redirect verification

The compiled Vercel rules pass locally. Recheck the actual HTTP status and final destination for every legacy URL after the isolated candidate is deployed, then again after the real-domain cutover.
