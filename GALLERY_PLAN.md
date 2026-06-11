# OPC Gallery System — PLAN (planning only, nothing built yet)

Created 2026-06-10. Source of inspiration (not a limit): https://oakpark-construction.com/gallery/

## The word you forgot
You're describing a **templated / data-driven page** — *one* HTML template that every project shares, fed by a data file. (In Webflow it's a "CMS Collection Page.") On this static GitHub-Pages site the equivalent is: **one `project.html` template + a `projects.json` data file.** Add a project = add a JSON entry + its photos. **We do NOT hand-build 20 pages.** ✅ this is exactly what you mean.

## The architecture (3 layers)
1. **Gallery landing** (`/gallery.html` or `/projects.html`) — a grid of project cards (1 cover photo + title + category each), filter chips by category. Each card links to that project's page.
2. **Project page TEMPLATE** (`project.html?p=<id>`, or pre-generated `/projects/<id>.html`) — ONE template reused for every project. Shows: title · location · category · the photo set · before/after (if any) · CTA. Matches the home-b dark design.
3. **Data file** (`projects.json`) — one entry per project: `{id, title, location, category, cover, images[], beforeAfter[]}`. This is the "main map / sequence."

## The existing "View Work" swiper — KEEP, repurpose
The property-gallery swiper (big-center, drag, grow-to-center) is NOT deleted. It becomes the **photo viewer inside each project page** — each project feeds its own images into that swiper. So "one gallery component, many projects."

## Inventory (what exists on the old site)
6 category galleries, each a `/jobgallery/<slug>/` page; some bundle 2 projects:
| Category | Job page | Notes |
|---|---|---|
| New Build & Additions | /jobgallery/new-build-2/ | **2 projects in one** — a New Build + an Addition (you said ~12 imgs) |
| Full Home Remodel | /jobgallery/full-home-remodel/ | before/after (Pompano Beach) |
| Shell & Concrete | /jobgallery/shell-construction-2/ | |
| Kitchen & Bath Builds | /jobgallery/<slug>/ | url TBD |
| Exterior Feature Builds | /jobgallery/exterior-feature-builds-2/ | |
| Commercial Buildout | /jobgallery/<slug>/ | url TBD |

⚠️ **Image-grab limitation:** the per-job images load in a JS lightbox, so I can't auto-scrape the full set reliably. To get every image per project I need ONE of:
- (a) you export/zip the photos per project, or point me to the Drive folder, OR
- (b) I start from the **real photos already in the repo** (`assets/img/mike/<category>/` — address-based: 122 Dockside Cir, 2112 Rio Vista, Clark Pergola, Opa-Locka Airport, Plantation Salon, etc.).

## THE KEY DECISION (need your call)
How to organize "projects":
- **Option A — by CATEGORY** (like your old site): New Build & Additions, Full Remodel, Kitchen & Bath…
- **Option B — by PROJECT / ADDRESS** (portfolio style): each address = one project page with all its photos (122 Dockside Cir, 2112 Rio Vista…). Your repo photos are already address-based.
- **My recommendation: Option B** (project/address pages) + **filter by category** on the gallery landing. Best of both — clean portfolio + browsable by type. Mixed projects (new build + addition) can each be their own card or share one, your call per project.

## What I need from you (3 answers)
1. **Category vs Project/Address** organization? (my rec: Project/Address + category filter)
2. **Images:** start from the repo photos we already have, or will you give me the full sets (export/Drive)?
3. Confirm the **one-template-+-data** approach (yes = I build 1 template + 1 json, not many pages).

## What I'll do once you confirm (NOT yet)
1. Write `projects.json` (the map) — one entry per project with its image list.
2. Build ONE `gallery.html` (dark, home-b style) + ONE `project.html` template + wire the existing swiper as the per-project viewer.
3. Scales forever: new project = JSON entry + photos, no new code.

---

## gallery-3d — GLOW/PARTICLES UPGRADE (planned 2026-06-11, for next chat)
Polish the 3D pile into a "magical floating stack of glass cards." **Keep** the steep PKQONZ skew(60,-15) rotateX(40) + the current title font. **Save versions, don't overwrite.**
1. Lift the pile up so bottom cards aren't cropped at the viewport edge.
2. Reduce vertical text stretch → skewed titles easier to read.
3. Fix top-right collision: "01" number vs "Coming soon" badge overlap → separate.
4. Tiny floating particles around the pile (magical float).
5. Soft glow at the bottom of the pile; stronger on hover/select.
6. Glassmorphism + glow aesthetic. Refs (Inspiration tab): Dribbble "Glow Card Design" https://dribbble.com/shots/26140947-Glow-Card-Design + glass-card images.
Showcase (gallery-showcase.html) is Priscila's current favorite; this competes.

---

## 📌 CURRENT GALLERY STATE — 2026-06-11 (single source of truth, nothing lost)

### ENTRY galleries (pick a category) — all live in lab + Build Tracker
- `gallery-3d-v13.html` — 3D glass pile (FINAL of that style); `gallery-3d-v2.html` also saved
- `gallery-showcase.html` — stacked card deck + numbered item list (Priscila favorite)
- `gallery-bg-v3.html` — BG-swap expertise+gallery selector (KEPT; base/v1/v2 deleted)
- *(possible 4th: Cube — would be rebuilt in-brand if wanted)*

### VIEWERS (after you enter — the category's photos) — choosing
- A `projects/new-construction-additions.html` — grow-to-center SWIPER (all photos, one swiper)
- B `projects/nc-stacked.html` — stacked horizontal strips per project — FIXED: no scrollbar, end arrows, aligned header — Priscila *may keep*
- B2 `projects/nc-stacked-swiper.html` — NEW: stacked structure + a grow-to-center SWIPER per project (122 Dockside + Home Addition)
- D `projects/nc-grid.html` — justified grid (all photos one page) — Priscila *saving*
- E `projects/nc-fullbleed.html` — cinematic stacked photos (kept as example only)
- E2 `projects/nc-projectcards.html` — NEW: fullbleed ADAPTED — one big card per PROJECT, side arrows cycle that project's photos in place (counter + dots)
- ❌ `nc-collage.html` — DELETED (disliked)
- ❌ `nc-horizontal.html` — DELETED (sideways scrollbar feel — "definitely not good")

### PENDING (Priscila's calls)
1. Pick the ENTRY gallery (3D v13 / Showcase / BG v3)
2. Pick the VIEWER (swiper / stacked / stacked-swiper / grid / fullbleed / horizontal)
3. Then: wire chosen entry→viewer, delete the rest, swap in real per-category photos, fix Commercial finished photo

### WHERE EVERYTHING LIVES (so it's never lost)
- **GitHub repo** `priihigashi/opc-website-v1` — every version committed with descriptive messages (full history)
- **Lab banner** (top of every page) — all live versions clickable
- **Build Tracker** sheet `1q0_v9q…` 🧪 Prototypes + 🔖 Inspiration tabs — kept galleries + all inspo links
- **This doc** (`GALLERY_PLAN.md`) + `OPC_WEBSITE_STATE.md` — decisions
