# T-169 — Roof-edge antialiasing correction

Date: 2026-08-18

## Feedback received

At angled views, the diagonal roof edges showed visible stair-stepping or a wavy/knife-like pixel pattern. The effect was most noticeable where the light roof met the dark background.

## Cause

The WebGL canvas requested antialiasing, but the final post-processing render pass used `multisampling={0}`. Because the post-processing output is the image that reaches the screen, it discarded the earlier edge smoothing.

## Correction

- Added versioned scene component `frontend/src/three/HouseSceneV5.jsx`.
- Preserved the current house model, lighting, camera, ambient occlusion, shadows, animation, and responsive positioning.
- Changed only the final post-processing render target from zero samples to four-sample multisampling.
- Updated `frontend/src/App.js` to render `HouseSceneV5`.
- Avoided a separate SMAA image-processing pass so the production JavaScript bundle does not increase.

## Verification

- Production build: passed.
- Visual check at the reported wide-screen hero angle: roof diagonals render materially smoother with the house animation and shadows intact.
- JavaScript quality check: no new warnings or errors. Two pre-existing complexity errors remain in `ServicesScene.jsx` and `HouseModel.jsx`.
- Performance check: production JavaScript remains approximately 517.84 kB gzip; this correction adds no bundle weight.

## Expected limitation

This is a real-time 3D model, so a very close screenshot can still reveal individual pixels on shallow diagonals. The correction removes the avoidable post-processing quality loss; a future higher-detail/photoreal house model is a separate upgrade.

## Release

- Public review URL: https://opc-house-hero-preview.vercel.app/
- Vercel deployment: `dpl_6g9XedQqwNYUtHg54xsw8qPYevgY`
- Deployment status: Ready
- Public response verification: HTTP 200
- Source commit: `a637f96`
