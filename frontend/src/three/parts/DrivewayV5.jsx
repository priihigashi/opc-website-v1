import { useMemo } from "react";

const ENTRY_SLABS = [0.5, 1.3, 2.1, 2.9];

// Ch.05 hardscape keeps the approved drive and full-width entry walk while
// removing the former repeated rectangular planter boxes.
export default function DrivewayV5({ mats, reg }) {
  const pavers = useMemo(() => {
    const out = [];
    for (let cx = 0; cx < 5; cx++) {
      for (let rz = 0; rz < 13; rz++) {
        out.push({ x: -5.65 + cx * 0.78, z: 0.5 + rz * 0.7, alt: (cx + rz) % 2 === 0 });
      }
    }
    return out;
  }, []);

  return (
    <group name="driveway-pavers-v5" ref={reg("drivewayGroup")} position={[0, 0, 3.3]} visible={false}>
      <mesh position={[-4.0, 0.04, 4.55]} material={mats.driveBase}>
        <boxGeometry args={[4.1, 0.08, 9.5]} />
      </mesh>
      {pavers.map((pv, i) => (
        <mesh key={i} position={[pv.x, 0.11, pv.z]} material={pv.alt ? mats.paverA : mats.paverB}>
          <boxGeometry args={[0.72, 0.09, 0.64]} />
        </mesh>
      ))}
      {ENTRY_SLABS.map((z, i) => (
        <mesh key={`step-${i}`} position={[-1.65, 0.06, z]} material={mats.stepStone}>
          <boxGeometry args={[1.35, 0.1, 0.6]} />
        </mesh>
      ))}
    </group>
  );
}
