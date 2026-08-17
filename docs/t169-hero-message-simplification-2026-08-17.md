# T-169 — Hero message simplification

Date: 2026-08-17

## Feedback received

- “One house. Every craft.” took too long to understand.
- “03 South Florida counties” was not a meaningful proof point.
- The hero felt busy because a large paragraph panel, a lime button, and a second scroll label competed in front of the house.
- The scroll-led service concept needed to be obvious without explanation.

## Changes shipped

- Preserved the previous `Hero`, `Story`, and `About` components and created versioned `HeroV2`, `StoryV2`, and `AboutV2` replacements.
- Replaced the abstract headline with “Structure to finish. Built by one team.”
- Replaced the hero description with a direct instruction and category list: structural shells, remodels, additions, outdoor living, concrete, and pavers.
- Removed the large lime “Explore the house” pill and the duplicate “Scroll ↓” label.
- Replaced both controls with one quiet, keyboard-accessible “Scroll to explore ↓” link on tablet/desktop. Mobile receives the instruction in the body copy and hides the secondary cue.
- Removed the remaining bordered/glass paragraph box so the 3D house remains the dominant visual.
- Replaced “03 South Florida counties” with “09 Construction services”; retained “01 Accountable team” and replaced the license-style stat with “FL South Florida homes.”
- Rewrote the supporting section in plain language and replaced “Same house. Every trade.” with “Nine services. One accountable team.”

## Verification

- Production build: passed.
- Final bundle: 516.43 kB JavaScript gzip; 12.97 kB CSS gzip.
- ESLint: no new findings. The two inherited complexity findings remain in `ServicesScene.jsx` and `HouseModel.jsx`.
- React review: no new hook, rerender, bundle, key, or accessibility issues.
- Visual checks passed at 1726×650, 1440×1000, 820×1180, and 390×844.
- No horizontal overflow at any checked viewport.
- Public review verification: 3D canvas present, updated text rendered, zero captured browser errors.

## Release

- Code commit: `e88a839`
- Vercel deployment: `dpl_JE8rkobQzfyFV2b2rkQFYQPGWapp`
- Stable review URL: https://opc-house-hero-preview.vercel.app/
- Original Emergent preview and the real OPC domain were not changed.

