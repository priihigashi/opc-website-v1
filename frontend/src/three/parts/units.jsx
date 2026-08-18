import { wallSegments } from "../wallMath";
import { RoundedBox } from "@react-three/drei";

export function Wall({ len, h, t = 0.25, openings = [], material, name }) {
  const segs = wallSegments(len, h, openings);
  return (
    <group name={name}>
      {segs.map((s, i) => (
        <RoundedBox
          key={i}
          args={[s.w, s.h, t]}
          radius={Math.min(0.018, s.w * 0.04, s.h * 0.04)}
          smoothness={2}
          position={[s.cx, s.cy, 0]}
          material={material}
          bevelSegments={2}
        />
      ))}
    </group>
  );
}

// Window/slider unit: bottom-center origin, frame + glass + optional mullions.
export function WindowUnit({ w, h, t = 0.3, glass, frame, mullions = 0, f = 0.07, position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[w, f, t]} radius={0.012} smoothness={2} position={[0, h - f / 2, 0]} material={frame} />
      <RoundedBox args={[w, f, t * 1.2]} radius={0.012} smoothness={2} position={[0, f / 2, 0]} material={frame} />
      <RoundedBox args={[f, h - 2 * f, t]} radius={0.012} smoothness={2} position={[-w / 2 + f / 2, h / 2, 0]} material={frame} />
      <RoundedBox args={[f, h - 2 * f, t]} radius={0.012} smoothness={2} position={[w / 2 - f / 2, h / 2, 0]} material={frame} />
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
