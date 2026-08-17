import { useMemo } from "react";
import { wallSegments } from "../wallMath";

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
