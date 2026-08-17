# PRD — Oak Park Construction: "One House" Scroll-Storytelling Landing Page

## Original problem statement
The same 3D house is the main character of almost the entire upper website and never leaves the screen. Hero starts with the house as a blueprint and transforms it into the finished house with subtle rotation. While scrolling, the finished house stays pinned but shrinks, shifts left/right/center, lowers, and rotates to make room for copy and reveal the right side. Shell Construction: surfaces peel/recede into the structural skeleton. Kitchen + Bathroom Remodels: believable cutaway/slice reveals interior rooms beside service copy. Additions: a new volume physically grows onto the same house. Then the house turns to the backyard where a pergola / barbecue / outdoor-living area builds in; later the driveway/hardscape appears for Concrete + Pavers. Reverse scrolling reverses transformations coherently. Non-negotiable: always the same house; the camera only rotates/shifts; architecture changes only when the service logically changes it.

## User choices (2026-08-17)
- Real-time 3D house built in code (React Three Fiber + drei + three)
- Brand: Oak Park Construction
- Sections: hero + 5 service chapters + about/manifesto + gallery + testimonials + contact form + footer + editorial marquee
- Contact form stores enquiries AND emails the owner (Emergent-managed Resend)

## Architecture
- Frontend: React 19, Tailwind, framer-motion (masked line reveals, scroll reveals), Lenis smooth scroll, @react-three/fiber v9 + drei v10 (three 0.185)
  - `src/three/HouseModel.jsx` — one composite house model; a single scroll-progress value (scrollStore.p) + intro tween drive every state via smoothstep pulses/tracks; damped transforms make reverse scrolling coherent
  - `src/lib/scrollStore.js` — mutable scroll progress shared between Lenis and the render loop
  - Fixed z-0 canvas; scrolling z-10 HTML overlay (pointer-events choreographed)
  - States: blueprint wireframe -> finished (on load + early scroll) -> skeleton peel (01) -> interior cutaway with warm light (02) -> addition growth (03) -> backyard pergola/BBQ build (04) -> driveway + pavers (05) -> full 360° settle
- Backend: FastAPI (`/api` prefix), MongoDB (motor)
  - POST /api/enquiries — validated enquiry saved to `enquiries` collection + transactional email to OWNER_EMAIL via Emergent managed email proxy (guardrail gate on every send, rate limit 6/10min/IP)
  - GET /api/enquiries — admin list, X-Admin-Key header
- Design system: /app/design_guidelines.json — cinematic dark (#09090B), amber #F5A623, blueprint blue accents; Cabinet Grotesk / Satoshi / JetBrains Mono

## User personas
- Homeowner planning a remodel/addition — wants proof of craft and a single accountable crew
- Referral/returning client — wants quick contact

## Implemented (2026-08-17)
- Scroll-driven 3D house with all 6 transformation states, Lenis momentum scroll, framer-motion masked reveals
- Nav, hero with on-load blueprint->finished moment, 5 numbered chapters, outro, marquee, manifesto/about with stats, gallery (3 projects), testimonials, contact form, massive footer
- Enquiry API + owner email notification (verified emailed: true) + admin list endpoint (401 without key)
- prefers-reduced-motion fallback, noise overlay, spotlight radial behind model

## v2 (2026-08-17) — production residence + OPC lime brand
- REPLACED the primitive box proxy with a detailed contemporary South Florida residence: two-storey stucco block + glass pavilion massing, real window/door openings (wall segments around voids), recessed pivot entry with canopy + sconce, wood-slat screens, parapet + floating roof planes with bronze fascia/wood soffit/membrane, sliding glass walls, full interior (kitchen: tall units, island, pendants, stools, lounge; bathroom: tile accent, freestanding tub, vanity, mirror, partitions), oak floors, recessed cans, warm interior lights
- Named groups for scroll choreography: shell, exterior-finishes, roof-a/roof-b, windows, kitchen, bathroom, addition, pergola, driveway-pavers (src/three/parts/*)
- Rendering: PBR canvas textures (stucco/wood/oak/tile/pavers/concrete), PCF shadow-mapped key light, N8AO ambient occlusion, ContactShadows, local HDR environment (/public/hdr/city_1k.hdr) for glass reflections
- Same driver: identical scroll tracks/pulses as v1; blueprint phase = shell wireframe, Ch.01 shell = lime structural frame with finishes peel, cutaway/addition/pergola/driveway states preserved
- Brand accent changed from amber #F5A623 to OPC lime #CBCC10 (hover #B5B60D) across UI, email template, and 3D shell state
- v1 primitive proxy backed up: /app/memory/backups/opc-v1-primitives-20260817.tgz + HouseModel.v1.primitives.jsx
- Decision: no monolithic GLB import — the continuity choreography (peel/cutaway/grow/build) requires separately addressable groups, which a single GLB cannot provide

## Verified
- curl: POST /api/enquiries (emailed: true, stored), GET /api/enquiries with/without admin key
- Screenshots: hero, shell skeleton, kitchen cutaway, addition growth, backyard pergola, driveway pavers, gallery, contact; form submit -> success toast -> enquiry stored

## Backlog
- P0: Replace OWNER_EMAIL (delivered@resend.dev test placeholder) with the owner's real inbox
- P1: Real project photography (current gallery + portfolio = curated Unsplash placeholders), real phone/address/license copy
- DONE: Mobile/iPad staging (house scales 0.56/0.82, shifts damped, raised above compact glass chapter cards); hero now rests almost-front (0.18 rad); Ch.02 upstairs furnished (bedroom) + walls drop deeper; Ch.03 addition starts at p=0.43 with casita window, angle -1.38; gallery heading in OPC lime
- DONE (2026-08-17, v3): /services cinematic selector — modular GLB residence (scripts/export-residence.mjs → public/models/residence.glb, factory src/three/residenceFactory.js, named groups preserved), 8 annotation labels, hover zone glow, 1.3–1.8s click-previews (cutaway/peel/addition trace+build/pergola build/driveway pour/full-reno dip/new-construction rebuild) then SPA navigate to /services/:slug; scene persists across route via ServicesStageGate (App.js) so return restores the house; fixed GLTFLoader node/material name collision (shell → shellMat) and R3F unmount race
- DONE (v3): /portfolio photography-first page — 7 project chapters, per-project grow-to-center horizontal swiper, 8 filters, lime accents
- DONE (v3 polish): facade window/cutout alignment fix (ribbon window vs wood screen overlap) in both the R3F parts and the GLB factory (re-exported residence.glb v4); contact email = contact@oakpark-construction.com; Selected Work section is a white contrast block with black text (user-directed: container bg change, not text)
- DONE (v4): ROOT CAUSE of window misalignment — units.jsx WindowUnit never applied its `position` prop, so all landing-page frames piled at facade origin (services GLB was unaffected — factory used position.set correctly). Fixed + verified via close-up facade screenshots on the landing page. Also: wood screen lowered to sit on entry canopy, pavilion roof shifted right, return walls closing the A/pavilion junction gap (front + back), GLB re-exported (v5)
- DONE (v4): Portfolio rows support multiple galleries per project (Before/After/Progress labels) + prev/next arrow buttons per row (hover on desktop, always visible on touch)
- NOTE: git auto-commits happen per task (branch main); no git remote in container — GitHub push is via platform "Save to GitHub" (per support)
- DONE (v6): POOL REBUILD — was a raised tray with a solid deck slab hiding the water; now in-ground at grade starting at the plinth edge, shifted left and clear of the slider door, water visibly fills (0.12→0.42) while the pergola builds. ENTRY BAY re-squared: door opening moved off the corner (local x 1.5), canopy resized to the bay (1.9 wide, no longer crossing the corner), screen centered on door. ROOF A: east upper wall raised 0.1 to close the light-leak slit under the coping, membrane widened to overlap parapets, second-floor ceiling added. GLB re-exported (v12) upstairs full bathroom (vanity, walk-in shower, toilet, wet-zone tile); partition walls capped at ceiling lines (no more leaking through floors) and fade out during the cutaway (tileBath/partWhite driven by cut); roof A membrane leveled flush with coping; wood screen measured exactly (canopy top 3.36m → 6.02m below coping, door width 1.2m); pavilion roof trimmed to die into the block wall (no more front-wall overlap); GLB re-exported (v11)
- P2: Admin page for viewing enquiries in-app; chapter progress indicator; SEO/meta + OG image; mid-preview frame capture unreliable under sandbox software-GL (verified working via state probes + before/after shots)
- DONE (2026-08-17, v7 visual correction): entry stack measured and stabilized (taller pivot door, attached canopy, thinner wood panel tucked under a slightly longer Roof A); roof/wall coplanar flicker removed; first-floor front/side windows restored to tall portrait units; second floor now uses paired landscape windows on front/west/rear, with frosted + curtained bathroom glazing; upstairs bathroom restored to the front with wall-to-wall floor coverage and framed shower; larger rear bedroom with bed pulled away from glass; cutaway ceilings now lift as separate layers with the roofs and front walls drop/fade farther out of view. Landing model and Services GLB re-exported/parity-checked (`residence.glb?v=14`). Testing agent iterations 1 and 2 passed, including forward/reverse scroll sweeps.
