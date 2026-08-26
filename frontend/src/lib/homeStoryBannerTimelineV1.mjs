export const HOME_STORY_BANNER_TIMELINE_V1 = Object.freeze([
  { id: "ch-01", side: "right", start: 0.145, focus: 0.2200, end: 0.255 },
  { id: "ch-02", side: "left",  start: 0.300, focus: 0.3875, end: 0.407 },
  { id: "ch-03", side: "right", start: 0.455, focus: 0.5375, end: 0.565 },
  { id: "ch-04", side: "left",  start: 0.630, focus: 0.7175, end: 0.737 },
  { id: "ch-05", side: "right", start: 0.800, focus: 0.8825, end: 0.902 },
]);

export const clamp01 = (value) => Math.min(1, Math.max(0, value));

const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Returns the panel's top edge in viewport pixels. The function has no memory:
 * the same story progress always returns the same coordinate in either direction.
 */
export function bannerTravelY(progress, timing, viewportHeight, panelHeight, focusCenterY) {
  const below = viewportHeight + 8;
  const focused = focusCenterY - panelHeight / 2;
  const above = -panelHeight - 8;

  if (progress <= timing.start) return below;
  if (progress >= timing.end) return above;
  if (progress <= timing.focus) {
    return lerp(below, focused, clamp01((progress - timing.start) / (timing.focus - timing.start)));
  }
  return lerp(focused, above, clamp01((progress - timing.focus) / (timing.end - timing.focus)));
}

export function safeFocusCenter(viewportHeight, panelHeight, mobile = false) {
  const safeTop = 88;
  const safeBottom = mobile ? 12 : 20;
  const desired = viewportHeight * (mobile ? 0.64 : 0.52);
  const minimum = safeTop + panelHeight / 2;
  const maximum = viewportHeight - safeBottom - panelHeight / 2;
  return maximum >= minimum ? Math.min(maximum, Math.max(minimum, desired)) : viewportHeight / 2;
}
