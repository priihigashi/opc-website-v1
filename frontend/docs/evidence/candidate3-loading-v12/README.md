# Candidate 3 loading-state evidence

Verified locally on 2026-09-04 against `DeferredHouseStageV12` using
`python3 e2e/loading-state-v12.spec.py` and Chromium with software WebGL enabled.

Result: PASS.

- Home: 390×844, 820×1180, and 1440×900.
- Pending: loader only; no lightweight/fallback house element or asset request.
- Delayed: intercepted `HouseSceneV34` for seven seconds; state remained delayed, not failed.
- Ready: loader removed after the live canvas and owned frames appeared.
- Failure: simulated `webglcontextlost`; contained image loaded with nonzero natural width.
- Static preference: reduced motion produced the contained lightweight view with no loader,
  canvas, or recovery control.
- Services: intercepted `ServicesSceneV5`; pending, delayed, ready, failed-chunk, and
  reduced-motion states passed, with no inappropriate Home recovery control.
- Browser page errors: none during the successful loading paths.

The retained screenshots are representative receipts; the test itself covers every viewport.
