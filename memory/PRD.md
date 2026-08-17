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

## Verified
- curl: POST /api/enquiries (emailed: true, stored), GET /api/enquiries with/without admin key
- Screenshots: hero, shell skeleton, kitchen cutaway, addition growth, backyard pergola, driveway pavers, gallery, contact; form submit -> success toast -> enquiry stored

## Backlog
- P0: Replace OWNER_EMAIL (delivered@resend.dev test placeholder) with the owner's real inbox
- P1: Real project photography (current gallery = curated Unsplash), real phone/address/license copy
- P1: Mobile-specific house staging (smaller shifts) — currently desktop-tuned
- P2: Admin page for viewing enquiries in-app; chapter progress indicator; SEO/meta + OG image
