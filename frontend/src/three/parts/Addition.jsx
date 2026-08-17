import { Wall, WindowUnit } from "./units";

// Ch.03 addition: casita/office wing that grows off the east wall.
export default function Addition({ mats, reg }) {
  return (
    <group name="addition" ref={reg("additionGroup")} position={[6, 0, -0.2]} visible={false}>
      {/* front wall with sliding-glass opening */}
      <group position={[0, 0.5, 2.6]}>
        <Wall len={3.4} h={3.1} material={mats.addStucco} openings={[{ x: 1.7, w: 2.2, y0: 0, y1: 2.5 }]} />
        <WindowUnit w={2.2} h={2.5} position={[1.7, 0, 0]} glass={mats.addGlass} frame={mats.addFrame} mullions={1} />
      </group>
      {/* back wall */}
      <mesh position={[1.7, 2.05, -1.2]} material={mats.addStucco}>
        <boxGeometry args={[3.4, 3.1, 0.25]} />
      </mesh>
      {/* east wall with window + wood screen */}
      <group position={[3.275, 0.5, 0.7]} rotation={[0, Math.PI / 2, 0]}>
        <Wall len={3.55} h={3.1} material={mats.addStucco} openings={[{ x: 0.7, w: 1.1, y0: 0.7, y1: 2.6 }]} />
        <WindowUnit w={1.1} h={1.9} position={[0.7, 0.7, 0]} glass={mats.addGlass} frame={mats.addFrame} />
      </group>
      <mesh position={[3.43, 1.9, 1.6]} material={mats.addWood}>
        <boxGeometry args={[0.08, 2.2, 1.3]} />
      </mesh>
      {/* roof plane */}
      <mesh position={[1.7, 3.72, 0.7]} material={[mats.addFascia, mats.addFascia, mats.addMembrane, mats.addSoffit, mats.addFascia, mats.addFascia]}>
        <boxGeometry args={[3.9, 0.14, 4.3]} />
      </mesh>
    </group>
  );
}
