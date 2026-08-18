import { Wall, WindowUnit } from "./units";

const WALL_THICKNESS = 0.25;
const FRONT_BACK_LENGTH = 3.525;
const FRONT_BACK_OFFSET = 0.0625;
const SIDE_DEPTH = 3.55;
const WINDOW_OPENINGS = [
  { x: -0.6825, w: 0.92, y0: 0.62, y1: 2.72 },
  { x: 0.5575, w: 0.92, y0: 0.62, y1: 2.72 },
];
const SIDE_DOOR = { x: -0.72, w: 1.12, y0: 0, y1: 2.68 };
const DOOR_FRAME_SIDES = [-1, 1];

// Addition v3: front/back walls own the outer corners; the side wall stops at
// their inner faces. The door face is flush with the stucco instead of sitting
// in a deep black reveal.
export default function AdditionV3({ mats, reg }) {
  return (
    <group name="addition-v3" ref={reg("additionGroup")} position={[6, 0, -0.68]} visible={false}>
      <group position={[1.7, 0.5, 2.6]}>
        <group position={[FRONT_BACK_OFFSET, 0, 0]}>
          <Wall len={FRONT_BACK_LENGTH} h={3.1} material={mats.addStucco} openings={WINDOW_OPENINGS} />
        </group>
        {[-0.62, 0.62].map((x) => (
          <WindowUnit key={x} w={0.92} h={2.1} position={[x, 0.62, 0]} glass={mats.addGlass} frame={mats.addFrame} />
        ))}
      </group>

      <group position={[1.7, 0.5, -1.2]}>
        <group position={[FRONT_BACK_OFFSET, 0, 0]}>
          <Wall len={FRONT_BACK_LENGTH} h={3.1} material={mats.addStucco} openings={[{ x: -0.0625, w: 1.2, y0: 0.9, y1: 2.4 }]} />
        </group>
        <WindowUnit w={1.2} h={1.5} position={[0, 0.9, 0]} glass={mats.addGlass} frame={mats.addFrame} />
      </group>

      <group position={[3.4, 0.5, 0.7]} rotation={[0, Math.PI / 2, 0]}>
        <Wall len={SIDE_DEPTH} h={3.1} t={WALL_THICKNESS} material={mats.addStucco} openings={[SIDE_DOOR]} />
        <mesh position={[SIDE_DOOR.x, SIDE_DOOR.y1 / 2, 0.085]} material={mats.addWood}>
          <boxGeometry args={[SIDE_DOOR.w, SIDE_DOOR.y1, 0.08]} />
        </mesh>
        <mesh position={[SIDE_DOOR.x, SIDE_DOOR.y1 + 0.045, 0.135]} material={mats.addFrame}>
          <boxGeometry args={[SIDE_DOOR.w + 0.12, 0.09, 0.06]} />
        </mesh>
        {DOOR_FRAME_SIDES.map((side) => (
          <mesh key={side} position={[SIDE_DOOR.x + side * (SIDE_DOOR.w / 2 + 0.045), SIDE_DOOR.y1 / 2, 0.135]} material={mats.addFrame}>
            <boxGeometry args={[0.09, SIDE_DOOR.y1, 0.06]} />
          </mesh>
        ))}
        <mesh position={[SIDE_DOOR.x - 0.35, 1.25, 0.18]} material={mats.addFrame}>
          <boxGeometry args={[0.055, 0.22, 0.06]} />
        </mesh>
      </group>

      <mesh position={[1.7, 3.72, 0.7]} material={[mats.addFascia, mats.addFascia, mats.addMembrane, mats.addSoffit, mats.addFascia, mats.addFascia]}>
        <boxGeometry args={[3.9, 0.14, 4.3]} />
      </mesh>
    </group>
  );
}
