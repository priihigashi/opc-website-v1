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

function KitchenLoungeFurniture({ mats }) {
  const legs = [[-0.48, -0.18], [0.48, -0.18], [-0.48, 0.18], [0.48, 0.18]];

  return (
    <>
      <mesh position={[4.7, 0.75, -1.3]} material={mats.fabric}>
        <boxGeometry args={[2.0, 0.45, 0.95]} />
      </mesh>
      <mesh position={[4.7, 1.15, -1.68]} material={mats.fabric}>
        <boxGeometry args={[2.0, 0.55, 0.25]} />
      </mesh>
      <RoundedBox args={[1.3, 0.12, 0.62]} radius={0.06} smoothness={5} position={[4.7, 0.82, -0.15]} material={mats.cabWood} />
      {legs.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[4.7 + x, 0.66, -0.15 + z]} material={mats.pendant}>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
        </mesh>
      ))}
    </>
  );
}

function TvRoomFurnitureWithDining({ mats }) {
  const coffeeLegs = [[-0.24, -0.5], [-0.24, 0.5], [0.24, -0.5], [0.24, 0.5]];

  return (
    <>
      <RoundedBox args={[2.45, 0.035, 2.65]} radius={0.06} smoothness={3} position={[-3.72, 0.59, 1.48]} material={mats.fabric} />
      <mesh position={[-2.3, 0.78, 1.5]} material={mats.fabric}>
        <boxGeometry args={[0.95, 0.45, 2.2]} />
      </mesh>
      <mesh position={[-1.85, 1.16, 1.5]} material={mats.fabric}>
        <boxGeometry args={[0.25, 0.55, 2.2]} />
      </mesh>
      <RoundedBox args={[0.74, 0.12, 1.35]} radius={0.05} smoothness={4} position={[-3.72, 0.79, 1.5]} material={mats.cabWood} />
      {coffeeLegs.map(([x, z]) => (
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

      {/* The compact dining set belongs beside the TV-room lounge, not on top of
          the kitchen-lounge coffee table. This rear position preserves both
          seating groups and keeps the island side visually open. */}
      <group name="tv-room-dining">
        <mesh position={[-3.65, 1.03, -1.45]} material={mats.cabWood}>
          <cylinderGeometry args={[0.5, 0.5, 0.08, 36]} />
        </mesh>
        <mesh position={[-3.65, 0.79, -1.45]} material={mats.pendant}>
          <cylinderGeometry args={[0.08, 0.15, 0.44, 16]} />
        </mesh>
        <mesh position={[-3.65, 0.58, -1.45]} material={mats.pendant}>
          <cylinderGeometry args={[0.34, 0.34, 0.04, 24]} />
        </mesh>
        <SlimChair position={[-3.65, 0, -2.18]} mats={mats} />
        <SlimChair position={[-4.38, 0, -1.75]} rotation={-Math.PI / 2} mats={mats} />
        <SlimChair position={[-2.92, 0, -1.75]} rotation={Math.PI / 2} mats={mats} />
      </group>
    </>
  );
}

export default function InteriorV4(props) {
  return (
    <Interior
      {...props}
      LoungeFurnitureComponent={KitchenLoungeFurniture}
      LivingFurnitureComponent={TvRoomFurnitureWithDining}
    />
  );
}
