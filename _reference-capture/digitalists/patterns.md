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
> 3. **Rectangles are STAGGERED, kept in the CENTER→RIGHT band.** Multiple (≥3) independent rectangular project images scroll over the fixed layer, offset horizontally (≥2 of center/right) — NOT centered full-screen stages. **The far-LEFT is reserved for the fixed "Before & After" headline + count — cards must NOT rest/dwell over it** (passing-over during transit is fine, since cards scroll OVER the text by design). The first card should read on the RIGHT.
> 4. **The LAST card RESTS — it does NOT fly off.** (Refined 2026-06-26 per Priscila.) Earlier cards enter from below and exit upward; the LAST card enters and **settles fully visible (resting, with breathing room, beside the text) and HOLDS** while the count finishes. The strip releases ONLY after the last card is fully revealed — the resting card then hands off to the next section. No early release; no snap. (Original "last must exit before release" was wrong — she wants the last one to land and stay.)
> 5. **The COUNT animates AUTOMATICALLY.** The "X+" project number runs a timed count-up (≈1.5s) the FIRST time the strip is revealed — it is NOT scrubbed by scroll position. (Scroll-linked counting was rejected: "they were supposed to be automatic… you don't need to scroll for them to go up.")
> 6. **Use `position:sticky` for the pin layer — the title/count/bg must SCROLL IN with the content (no blank).** (Refined 2026-06-26.) Priscila: *"I shouldn't have to scroll completely and center the strip to then see the title… you see just white, that doesn't look good."* A `position:fixed` overlay that only fades in once the strip fully covers the viewport leaves a blank screen on approach — rejected. Make the pinned content a `position:sticky; top:0; height:100vh` child of the tall strip so it rises into view as you enter, pins while the cards fly over, then releases and scrolls away with the page (which also carries the resting last card off naturally). The number starts its auto count-up once the strip is centered/pinned. ⚠️ GOTCHA: `html/body{overflow-x:hidden}` makes the root a scroll container and **breaks sticky** — use `overflow-x:clip` instead (clips horizontal overflow without creating a scroll container). Sticky also inherently can't cover the hero (it lives inside the strip box, below the hero) — so it fixes the lab-banner-hide bug for free.
> 7. **Validate by MOTION STATE, not vibes.** Prove it with Playwright: assert the fixed layer's Y is constant across the scroll range, assert ≥3 rectangles with ≥2 distinct center/right X-offsets, assert at the release point the **last card is fully visible while the others have exited**, and emit a scroll-state montage PNG. Blank-page / console-error checks alone are insufficient.
>
> Anti-pattern that fails acceptance: centered full-screen project "card stages" that each fill the viewport and swap (reads as a slideshow); cards resting over the left text; a scroll-scrubbed counter; a fixed layer that covers the hero.

## Pattern 3 — REFERENZEN list: full-width numbered list + hover-rectangle reveal + GRID/LIST toggle (Prototype B)
- Edge-to-edge numbered list: `CS####` + project title + client + service tags, full viewport width, dense, hairline row separators. On hover a rectangular preview image appears (clean edges, eased in). A **LIST ⇄ GRID toggle** switches the same data between the row list and an image grid. Animated arrow per row. Smooth case-page transition on click.
- **OPC rebuild:** we already have the base on `index.html` — the `.svc` numbered list (01–09 + `.reveal` hover image) and `.ba` before/after. Refine: cleaner image edges (rounded + hairline border + subtle shadow), edge-to-edge full-bleed list, tighter alignment, a **GRID/LIST toggle** that reflows the same OPC projects, per-row animated arrow. Keep OPC palette + Anton/Mono/Inter type. Real Mike project photos + addresses.
- Tech: CSS grid for GRID mode, flex rows for LIST mode, a toggle button switching a class on the container; hover reveal via `opacity`/`transform` on an absolutely-positioned preview image (desktop) or inline thumb (mobile).

## What captured vs needs manual rebuild
- ✅ Structure/layout (list, hero composition, section order) — readable from HTML.
- 🟡 Motion params — NOT readable (minified bundle + WebGL). Rebuilt from Awwwards description + our own lighter implementation. Honest: ours is a *feel-alike*, not a shader port.
- ⛔ Their assets/copy/yellow brand — intentionally NOT used. OPC brand only.
