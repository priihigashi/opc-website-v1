import { RoundedBox } from "@react-three/drei";
import Interior from "./Interior";

function CorrectedLivingFurniture({ mats }) {
  const legs = [[-0.24, -0.5], [-0.24, 0.5], [0.24, -0.5], [0.24, 0.5]];

  return (
    <>
      {/* One restrained rug anchors the living group and stays below the table. */}
      <RoundedBox args={[2.45, 0.035, 2.65]} radius={0.06} smoothness={3} position={[-3.72, 0.59, 1.48]} material={mats.rug} />

      <mesh position={[-2.3, 0.78, 1.5]} material={mats.fabric}>
        <boxGeometry args={[0.95, 0.45, 2.2]} />
      </mesh>
      <mesh position={[-1.85, 1.16, 1.5]} material={mats.fabric}>
        <boxGeometry args={[0.25, 0.55, 2.2]} />
      </mesh>

      {/* Centered walnut coffee table with a clear gap from the sofa. */}
      <RoundedBox args={[0.74, 0.12, 1.35]} radius={0.05} smoothness={4} position={[-3.72, 0.79, 1.5]} material={mats.cabWood} />
      {legs.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[-3.72 + x, 0.68, 1.5 + z]} material={mats.pendant}>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 8]} />
        </mesh>
      ))}

      <mesh position={[-5.55, 0.82, 1.5]} material={mats.cabWood}>
        <boxGeometry args={[0.45, 0.5, 2.0]} />
      </mesh>
      <mesh position={[-5.8, 1.75, 1.5]} material={mats.tallDark}>
        <boxGeometry args={[0.06, 0.95, 1.7]} />
      </mesh>
      <mesh position={[-5.35, 1.31, -0.3]} material={mats.pendant}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
      </mesh>
      <mesh position={[-5.35, 2.1, -0.3]} material={mats.pendant}>
        <cylinderGeometry args={[0.16, 0.22, 0.26, 16]} />
      </mesh>
      <mesh position={[-5.35, 1.95, -0.3]} material={mats.can}>
        <sphereGeometry args={[0.06, 10, 10]} />
      </mesh>
    </>
  );
}

// V3 deliberately removes the misplaced kitchen dining set from V2. The
// approved kitchen/lounge geometry stays unchanged; only the real living room
// receives the corrected coffee table and rug.
export default function InteriorV3(props) {
  return <Interior {...props} LivingFurnitureComponent={CorrectedLivingFurniture} />;
}
