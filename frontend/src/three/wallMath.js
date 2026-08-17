// Pure wall math shared by the R3F parts and the GLB factory.
// Grid subdivision: bulletproof for any opening layout (stacked, staggered, adjacent).
// Every wall cell whose center falls inside an opening is omitted; the rest become segments.
export function wallSegments(len, h, openings = []) {
  const xEdges = new Set([-len / 2, len / 2]);
  const yEdges = new Set([0, h]);
  for (const o of openings) {
    xEdges.add(Math.max(-len / 2, o.x - o.w / 2));
    xEdges.add(Math.min(len / 2, o.x + o.w / 2));
    yEdges.add(Math.max(0, o.y0));
    yEdges.add(Math.min(h, o.y1));
  }
  const xs = [...xEdges].sort((a, b) => a - b);
  const ys = [...yEdges].sort((a, b) => a - b);
  const segs = [];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      const cx = (xs[i] + xs[i + 1]) / 2;
      const cy = (ys[j] + ys[j + 1]) / 2;
      const open = openings.some((o) => cx > o.x - o.w / 2 && cx < o.x + o.w / 2 && cy > o.y0 && cy < o.y1);
      if (!open) segs.push({ cx, cy, w: xs[i + 1] - xs[i], h: ys[j + 1] - ys[j] });
    }
  }
  return segs.filter((s) => s.w > 0.001 && s.h > 0.001);
}
