import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";

const ENTRY_PLANTERS = [
  { x: -0.15, z: 1.55, width: 1.35 },
  { x: -3.25, z: 1.55, width: 1.35 },
];

const ENTRY_SLABS = [0.5, 1.3, 2.1, 2.9];
// Ch.05 hardscape: a four-slab entry walk and two framing planters.
// The pavilion frontage and open ground stay unobstructed.
export default function DrivewayV3({ mats, reg }) {
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
    <group name="driveway-pavers-v3" ref={reg("drivewayGroup")} position={[0, 0, 3.3]} visible={false}>
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
      {ENTRY_PLANTERS.map(({ x, z, width }, i) => (
        <group key={`planter-${i}`}>
          <mesh position={[x, 0.26, z]} material={mats.planter}>
            <boxGeometry args={[width, 0.52, 0.55]} />
          </mesh>
          <mesh position={[x, 0.53, z]} material={mats.soil}>
            <boxGeometry args={[width - 0.1, 0.05, 0.45]} />
          </mesh>
          <RoundedBox
            args={[width - 0.15, 0.5, 0.4]}
            radius={0.12}
            smoothness={4}
            position={[x, 0.78, z]}
            material={mats.hedge}
          />
        </group>
      ))}
    </group>
  );
}
