# Services verification — Candidate 7

PASS for the changed Services framing and preserved behavior, with the screenshot limits below.

- 32 ordinary user-click journeys: all eight services at 320×568, 390×844, 820×1180 and 1440×900. Every journey observed the selected scope/reveal and reached the correct service detail page. No JavaScript errors or horizontal overflow in these normal journeys.
- Canvas bounds exactly matched the measured Services frame for every sampled overview state.
- At all four widths, reduced-motion fallback, real `WEBGL_lose_context` fallback, pending loading, delayed loading and recovered interactive canvas occupied the same frame. Static service selection reached its detail page directly.
- Visually inspected representative phone, tablet and desktop layouts and the completed-view contact sheets: the smaller level house and complete ground disc fit within the reserved region. Services-only yaw and reveal behavior remained intact.

## Screenshot limits

A software-rendered screenshot sometimes completed after the timed route handoff. There are 28 valid completed-view screenshots across the matrix, including six supplemental captures made with an explicitly documented test-only slower animation clock. Those captures supplement geometry evidence; the ordinary clicks/reveals/handoffs were tested separately without instrumentation.

Do not describe all 32 original final PNGs as valid. Exclude the originals listed in `verification-summary.json`. Six have valid supplemental replacements. Four were deliberately not recaptured because the remaining behavioral, quantitative and representative visual evidence is sufficient: 320 additions, 390 concrete-pavers, 1440 additions and 1440 concrete-pavers. Their ordinary journeys and frame measurements passed.

The initial Chromium screenshot errors during later-width state passes were resolved by fresh-browser retries; authoritative state evidence is each `{width}-states.json`. Earlier aggregate records retain the superseded test-run capture failures for transparency.

No production deployment, source edits or build was performed by these browser checks. Both browser scripts have exited and closed their browser instances. No further browser work is pending for this review scope.
