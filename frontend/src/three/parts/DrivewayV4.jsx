import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";

const SHRUB_CLUMPS = [
  [-0.3, 0.02, 0, 0.58], [0.28, 0.04, 0.03, 0.62], [0, 0.2, 0, 0.74],
  [-0.13, 0.34, 0.04, 0.48], [0.18, 0.33, -0.04, 0.44],
];

function EntryPlanter({ x, z, mats }) {
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[1.4, 0.48, 0.62]} radius={0.055} smoothness={3} position={[0, 0.28, 0]} material={mats.planter} />
      <mesh position={[0, 0.535, 0]} material={mats.soil}><boxGeometry args={[1.28, 0.045, 0.5]} /></mesh>
      <group position={[0, 0.63, 0]}>
        {SHRUB_CLUMPS.map(([cx, cy, cz, s], i) => (
          <mesh key={i} position={[cx, cy, cz]} scale={[s * 1.1, s * 0.72, s]} material={i % 2 ? mats.foliageLight : mats.foliage}>
            <icosahedronGeometry args={[0.48, 2]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function DrivewayV4({ mats, reg }) {
  const pavers = useMemo(() => {
    const out = [];
    for (let cx = 0; cx < 5; cx++) for (let rz = 0; rz < 13; rz++) out.push({ x: -5.65 + cx * 0.78, z: 0.5 + rz * 0.7, alt: (cx + rz) % 2 === 0 });
    return out;
  }, []);

  return (
    <group name="driveway-pavers-v4" ref={reg("drivewayGroup")} position={[0, 0, 3.3]} visible={false}>
      <RoundedBox args={[4.1, 0.08, 9.5]} radius={0.06} smoothness={3} position={[-4, 0.04, 4.55]} material={mats.driveBase} />
      {pavers.map((pv, i) => (
        <RoundedBox key={i} args={[0.72, 0.09, 0.64]} radius={0.018} smoothness={2} position={[pv.x, 0.11, pv.z]} material={pv.alt ? mats.paverA : mats.paverB} />
      ))}
      {[0.45, 1.2, 1.95, 2.7, 3.45].map((z) => (
        <RoundedBox key={z} args={[1.55, 0.1, 0.58]} radius={0.035} smoothness={2} position={[-1.65, 0.06, z]} material={mats.stepStone} />
      ))}
      <EntryPlanter x={-0.35} z={1.45} mats={mats} />
      <EntryPlanter x={-3.05} z={1.45} mats={mats} />
    </group>
  );
}
