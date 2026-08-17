import { useMemo } from "react";

// Splits a wall into box segments around real openings.
// Openings sharing overlapping x-ranges are merged into one column with stacked voids.
export function wallSegments(len, h, openings = []) {
  const cols = [];
  for (const o of [...openings].sort((a, b) => a.x - b.x)) {
    const x0 = o.x - o.w / 2;
    const x1 = o.x + o.w / 2;
    const col = cols.find((c) => !(x1 <= c.x0 || x0 >= c.x1));
    if (col) {
      col.x0 = Math.min(col.x0, x0);
      col.x1 = Math.max(col.x1, x1);
      col.list.push(o);
    } else {
      cols.push({ x0, x1, list: [o] });
    }
  }
  cols.sort((a, b) => a.x0 - b.x0);
  const segs = [];
  let cur = -len / 2;
  for (const c of cols) {
    if (c.x0 > cur) segs.push({ cx: (cur + c.x0) / 2, cy: h / 2, w: c.x0 - cur, h });
    const list = [...c.list].sort((a, b) => a.y0 - b.y0);
    let yCur = 0;
    for (const o of list) {
      const oy0 = Math.max(o.y0, yCur);
      const oy1 = Math.min(o.y1, h);
      if (oy0 > yCur) segs.push({ cx: (c.x0 + c.x1) / 2, cy: (yCur + oy0) / 2, w: c.x1 - c.x0, h: oy0 - yCur });
      yCur = Math.max(yCur, oy1);
    }
    if (yCur < h) segs.push({ cx: (c.x0 + c.x1) / 2, cy: (yCur + h) / 2, w: c.x1 - c.x0, h: h - yCur });
    cur = c.x1;
  }
  if (cur < len / 2) segs.push({ cx: (cur + len / 2) / 2, cy: h / 2, w: len / 2 - cur, h });
  return segs.filter((s) => s.w > 0.001 && s.h > 0.001);
}

export function Wall({ len, h, t = 0.25, openings = [], material, name }) {
  const segs = useMemo(() => wallSegments(len, h, openings), [len, h, JSON.stringify(openings)]);
  return (
    <group name={name}>
      {segs.map((s, i) => (
        <mesh key={i} position={[s.cx, s.cy, 0]} material={material}>
          <boxGeometry args={[s.w, s.h, t]} />
        </mesh>
      ))}
    </group>
  );
}

// Window/slider unit: bottom-center origin, frame + glass + optional mullions.
export function WindowUnit({ w, h, t = 0.3, glass, frame, mullions = 0, f = 0.07, position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, h - f / 2, 0]} material={frame}>
        <boxGeometry args={[w, f, t]} />
      </mesh>
      <mesh position={[0, f / 2, 0]} material={frame}>
        <boxGeometry args={[w, f, t * 1.2]} />
      </mesh>
      <mesh position={[-w / 2 + f / 2, h / 2, 0]} material={frame}>
        <boxGeometry args={[f, h - 2 * f, t]} />
      </mesh>
      <mesh position={[w / 2 - f / 2, h / 2, 0]} material={frame}>
        <boxGeometry args={[f, h - 2 * f, t]} />
      </mesh>
      {Array.from({ length: mullions }).map((_, i) => (
        <mesh key={i} position={[-w / 2 + ((i + 1) * w) / (mullions + 1), h / 2, 0]} material={frame}>
          <boxGeometry args={[0.05, h - 2 * f, t * 0.7]} />
        </mesh>
      ))}
      <mesh position={[0, h / 2, 0]} material={glass}>
        <boxGeometry args={[w - 2 * f, h - 2 * f, 0.03]} />
      </mesh>
    </group>
  );
}
