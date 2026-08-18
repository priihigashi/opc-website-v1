import { Wall, WindowUnit } from "./units";

const WINDOW_OPENINGS = [
  { x: -0.62, w: 0.92, y0: 0.62, y1: 2.72 },
  { x: 0.62, w: 0.92, y0: 0.62, y1: 2.72 },
];
const SIDE_DOOR = { x: -0.72, w: 1.12, y0: 0, y1: 2.68 };
const DOOR_FRAME_SIDES = [-1, 1];

// Ch.03 addition v2: a recessed office/guest wing with a solid, legible envelope.
export default function AdditionV2({ mats, reg }) {
  return (
    <group name="addition" ref={reg("additionGroup")} position={[6, 0, -0.68]} visible={false}>
      {/* The front wall is centered on the addition and uses two fixed windows, not another slider. */}
      <group position={[1.7, 0.5, 2.6]}>
        <Wall len={3.4} h={3.1} material={mats.addStucco} openings={WINDOW_OPENINGS} />
        {WINDOW_OPENINGS.map((opening) => (
          <WindowUnit
            key={opening.x}
            w={opening.w}
            h={opening.y1 - opening.y0}
            position={[opening.x, opening.y0, 0]}
            glass={mats.addGlass}
            frame={mats.addFrame}
          />
        ))}
      </group>

      {/* Back wall with one high window. */}
      <group position={[1.7, 0.5, -1.2]}>
        <Wall len={3.4} h={3.1} material={mats.addStucco} openings={[{ x: 0, w: 1.2, y0: 0.9, y1: 2.4 }]} />
        <WindowUnit w={1.2} h={1.5} position={[0, 0.9, 0]} glass={mats.addGlass} frame={mats.addFrame} />
      </group>

      {/* East return wall with a framed, floor-reaching wood entry door. */}
      <group position={[3.4, 0.5, 0.7]} rotation={[0, Math.PI / 2, 0]}>
        <Wall len={3.8} h={3.1} material={mats.addStucco} openings={[SIDE_DOOR]} />
        <mesh position={[SIDE_DOOR.x, SIDE_DOOR.y1 / 2, 0]} material={mats.addWood}>
          <boxGeometry args={[SIDE_DOOR.w, SIDE_DOOR.y1, 0.08]} />
        </mesh>
        <mesh position={[SIDE_DOOR.x, SIDE_DOOR.y1 + 0.045, 0.055]} material={mats.addFrame}>
          <boxGeometry args={[SIDE_DOOR.w + 0.12, 0.09, 0.11]} />
        </mesh>
        {DOOR_FRAME_SIDES.map((side) => (
          <mesh key={side} position={[SIDE_DOOR.x + side * (SIDE_DOOR.w / 2 + 0.045), SIDE_DOOR.y1 / 2, 0.055]} material={mats.addFrame}>
            <boxGeometry args={[0.09, SIDE_DOOR.y1, 0.11]} />
          </mesh>
        ))}
        <mesh position={[SIDE_DOOR.x - 0.35, 1.25, 0.09]} material={mats.addFrame}>
          <boxGeometry args={[0.055, 0.22, 0.08]} />
        </mesh>
      </group>

      {/* Roof plane follows the recessed volume. */}
      <mesh position={[1.7, 3.72, 0.7]} material={[mats.addFascia, mats.addFascia, mats.addMembrane, mats.addSoffit, mats.addFascia, mats.addFascia]}>
        <boxGeometry args={[3.9, 0.14, 4.3]} />
      </mesh>
    </group>
  );
}
