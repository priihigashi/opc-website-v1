import { RoundedBox } from "@react-three/drei";
import Interior from "./Interior";

function SlimChair({ position, rotation = 0, mats }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[0.46, 0.09, 0.43]} radius={0.05} smoothness={4} position={[0, 0.86, 0]} material={mats.fabric} />
      <RoundedBox args={[0.46, 0.5, 0.08]} radius={0.035} smoothness={4} position={[0, 1.12, 0.18]} material={mats.fabric} />
      {[-0.17, 0.17].flatMap((x) => [-0.15, 0.15].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.7, z]} material={mats.pendant}>
          <cylinderGeometry args={[0.018, 0.025, 0.28, 8]} />
        </mesh>
      )))}
    </group>
  );
}

function RefinedLoungeFurniture({ mats }) {
  const tableLegs = [[-0.48, -0.18], [0.48, -0.18], [-0.48, 0.18], [0.48, 0.18]];

  return (
    <>
      <mesh position={[4.7, 0.75, -1.3]} material={mats.fabric}>
        <boxGeometry args={[2.0, 0.45, 0.95]} />
      </mesh>
      <mesh position={[4.7, 1.15, -1.68]} material={mats.fabric}>
        <boxGeometry args={[2.0, 0.55, 0.25]} />
      </mesh>

      {/* A centered, lower walnut coffee table with clear space from the sofa. */}
      <RoundedBox args={[1.3, 0.12, 0.62]} radius={0.06} smoothness={5} position={[4.7, 0.82, -0.15]} material={mats.cabWood} />
      {tableLegs.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[4.7 + x, 0.66, -0.15 + z]} material={mats.pendant}>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
        </mesh>
      ))}

      {/* Compact dining set kept clear of the island, glass doors and lounge path. */}
      <group name="compact-dining-test">
        <mesh position={[4.55, 1.03, 1.05]} material={mats.cabWood}>
          <cylinderGeometry args={[0.5, 0.5, 0.08, 36]} />
        </mesh>
        <mesh position={[4.55, 0.79, 1.05]} material={mats.pendant}>
          <cylinderGeometry args={[0.08, 0.15, 0.44, 16]} />
        </mesh>
        <mesh position={[4.55, 0.58, 1.05]} material={mats.pendant}>
          <cylinderGeometry args={[0.34, 0.34, 0.04, 24]} />
        </mesh>
        <SlimChair position={[4.55, 0, 1.78]} rotation={Math.PI} mats={mats} />
        <SlimChair position={[3.82, 0, 0.75]} rotation={-Math.PI / 2} mats={mats} />
        <SlimChair position={[5.28, 0, 0.75]} rotation={Math.PI / 2} mats={mats} />
      </group>
    </>
  );
}

export default function InteriorV2(props) {
  return <Interior {...props} LoungeFurnitureComponent={RefinedLoungeFurniture} />;
}
