# digitalists.at — extracted patterns (research only)

Source: https://digitalists.at/ + https://digitalists.at/referenzen/ · Awwwards: https://www.awwwards.com/sites/digitalists-1
Captured 2026-06-24 (curl static HTML; motion lives in minified `wp-content/themes/digitalists/dist/js/main.dist.js`).
Stack: WordPress + **Three.js / WebGL shaders** + scroll-driven animation. Palette: bright yellow `#F1E500` on pure black.

⚠️ Brand override: we DO NOT copy their look. We rebuild the *structure + motion* in OPC palette (obsidian/cream/lime/walnut) with OUR real content. We do NOT ship their WebGL shader (heavy + proprietary) — we recreate the *feel* with lighter CSS/JS.

## Pattern 1 — HERO: foreground subject moves on scroll, background holds (Prototype A)
- Hero is a layered scene: a fixed/slow background + a foreground subject that translates/rotates faster as you scroll → depth parallax (their version is a real-time shader).
- **OPC rebuild:** hero = a HOUSE EXTERIOR (placeholder OK until T-154 hero locked). On scroll, the flat hero photo cross-fades / "folds" (Inception idea) into our existing rotating **3D house** (`prototypes/new-construction-house3d.html`, Ricardo CSS-3D fork). Background gradient/scrim stays; the house layer parallax-shifts + the morph reveals the 3D object. Keep it RESTRAINED/luxurious, not flashy.
- Tech (light): CSS `transform: translateY()` driven by scroll progress (requestAnimationFrame + scroll ratio), opacity crossfade flat→3D, `prefers-reduced-motion` safe. No WebGL required.

## Pattern 2 — PINNED projects strip: bg static, before/after overlays scroll over it, then bg releases (Prototype A)
- As you enter the projects section the background PINS (position: sticky / scroll-pin) and stays static while project cards / before-after panels scroll up over it. When the overlays finish, the pin releases and the page resumes normal scroll into the rest of the info.
- **OPC rebuild:** sticky background (dark photo or lime-glow field) + a vertical run of our `.ba` before/after split panels (left=before / right=after — already in `index.html`). Project COUNT shown as **"X+"** (never a small bare number) + an **animated arrow** indicator (our signature). On overlay-end, unpin → continue to services/areas/CTA.
- Tech: a tall section with `position: sticky; top: 0` background child + normal-flow overlay children; IntersectionObserver to trigger reveals; CSS keyframe bob on the arrow.

### 🔒 PINNED-STRIP ACCEPTANCE RULES (BINDING — not optional interpretation)
> Added 2026-06-25 after Priscila flagged the current `home-immersive-v2.html` got this WRONG (it used three centered full-screen card stages — that is NOT the reference mechanic). These 5 rules are pass/fail acceptance criteria, enforced by `tools/validate.js`:
>
> 1. **Tall pinned strip.** The project section is a TALL scroll section (recommend ≥ 300vh of scroll runway) — long enough that several rectangles travel through before release.
> 2. **Background/content layer stays FIXED.** A sticky/pinned background (or content) layer holds still (its on-screen Y position must not move) while the rectangles scroll. It does not scroll with the page until release.
> 3. **Rectangles are STAGGERED left / center / right.** Multiple (≥3) independent rectangular project images scroll over the fixed layer. They are offset horizontally — left, center, right — NOT centered full-screen stages stacked on top of each other.
> 4. **Release only after the LAST rectangle clears.** The whole strip un-pins and normal scrolling resumes ONLY after the last rectangle's bounding box has fully exited the viewport. No early release; no snap.
> 5. **Validate by MOTION STATE, not vibes.** Prove it with Playwright: assert the sticky layer's Y is fixed across the scroll range, assert ≥3 rectangles with distinct left/center/right X-offsets, assert the section does not advance until the last rectangle exits, and emit a scroll-state montage PNG. Blank-page / console-error checks alone are insufficient.
>
> Anti-pattern that fails acceptance: centered full-screen project "card stages" that each fill the viewport and swap. That reads as a slideshow, not the reference's flowing staggered overlay.

## Pattern 3 — REFERENZEN list: full-width numbered list + hover-rectangle reveal + GRID/LIST toggle (Prototype B)
- Edge-to-edge numbered list: `CS####` + project title + client + service tags, full viewport width, dense, hairline row separators. On hover a rectangular preview image appears (clean edges, eased in). A **LIST ⇄ GRID toggle** switches the same data between the row list and an image grid. Animated arrow per row. Smooth case-page transition on click.
- **OPC rebuild:** we already have the base on `index.html` — the `.svc` numbered list (01–09 + `.reveal` hover image) and `.ba` before/after. Refine: cleaner image edges (rounded + hairline border + subtle shadow), edge-to-edge full-bleed list, tighter alignment, a **GRID/LIST toggle** that reflows the same OPC projects, per-row animated arrow. Keep OPC palette + Anton/Mono/Inter type. Real Mike project photos + addresses.
- Tech: CSS grid for GRID mode, flex rows for LIST mode, a toggle button switching a class on the container; hover reveal via `opacity`/`transform` on an absolutely-positioned preview image (desktop) or inline thumb (mobile).

## What captured vs needs manual rebuild
- ✅ Structure/layout (list, hero composition, section order) — readable from HTML.
- 🟡 Motion params — NOT readable (minified bundle + WebGL). Rebuilt from Awwwards description + our own lighter implementation. Honest: ours is a *feel-alike*, not a shader port.
- ⛔ Their assets/copy/yellow brand — intentionally NOT used. OPC brand only.
