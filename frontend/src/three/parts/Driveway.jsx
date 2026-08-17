import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";

// Ch.05 hardscape: paver driveway, entry walkway, planters.
// Group origin sits at the house front edge so scale.z pours it toward the street.
export default function Driveway({ mats, reg }) {
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
    <group name="driveway-pavers" ref={reg("drivewayGroup")} position={[0, 0, 3.3]} visible={false}>
      {/* gravel setting bed */}
      <mesh position={[-4.0, 0.04, 4.55]} material={mats.driveBase}>
        <boxGeometry args={[4.1, 0.08, 9.5]} />
      </mesh>
      {/* pavers */}
      {pavers.map((pv, i) => (
        <mesh key={i} position={[pv.x, 0.11, pv.z]} material={pv.alt ? mats.paverA : mats.paverB}>
          <boxGeometry args={[0.72, 0.09, 0.64]} />
        </mesh>
      ))}
      {/* entry walkway stepping slabs */}
      {[0.5, 1.3, 2.1, 2.9].map((z, i) => (
        <mesh key={`step-${i}`} position={[-1.65, 0.06, z]} material={mats.stepStone}>
          <boxGeometry args={[1.15, 0.1, 0.6]} />
        </mesh>
      ))}
      {/* concrete planters flanking the walk, with trimmed hedges */}
      {[-0.5, -2.8].map((x, i) => (
        <group key={`planter-${i}`}>
          <mesh position={[x, 0.26, 1.6]} material={mats.planter}>
            <boxGeometry args={[1.6, 0.52, 0.55]} />
          </mesh>
          <mesh position={[x, 0.53, 1.6]} material={mats.soil}>
            <boxGeometry args={[1.5, 0.05, 0.45]} />
          </mesh>
          <RoundedBox args={[1.45, 0.5, 0.4]} radius={0.12} smoothness={4} position={[x, 0.78, 1.6]} material={mats.hedge} />
        </group>
      ))}
      {/* low hedge row screening the pavilion frontage */}
      {[1.2, 3.0, 4.8].map((x, i) => (
        <RoundedBox key={`hedge-${i}`} args={[1.5, 0.55, 0.5]} radius={0.14} smoothness={4} position={[x, 0.28, 0.35]} material={mats.hedge} />
      ))}
    </group>
  );
}
