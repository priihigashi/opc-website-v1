import { Wall, WindowUnit } from "./units";

const WALL_THICKNESS = 0.25;
const FRONT_LENGTH = 3.525;
const FRONT_OFFSET = 0.0625;
const BACK_LENGTH = 3.525;
const BACK_OFFSET = 0.0625;
const SIDE_DEPTH = 3.55;
const WINDOW_OPENINGS = [
  { x: -0.6825, w: 0.92, y0: 0.62, y1: 2.72 },
  { x: 0.5575, w: 0.92, y0: 0.62, y1: 2.72 },
];
const SIDE_DOOR = { x: -0.72, w: 1.12, y0: 0, y1: 2.68 };

// Addition v5 preserves the v4 door and butt-joint envelope. A real stucco
// return now bridges the recessed addition facade to the pavilion's final
// glass-door frame. This closes the depth gap that exposed a brown floor sliver
// at the base instead of disguising it with trim.
export default function AdditionV5({ mats, reg }) {
  return (
    <group name="addition-v5" ref={reg("additionGroup")} position={[6, 0, -0.68]} visible={false}>
      <group position={[1.7, 0.5, 2.6]}>
        <group position={[FRONT_OFFSET, 0, 0]}>
          <Wall len={FRONT_LENGTH} h={3.1} material={mats.addStucco} openings={WINDOW_OPENINGS} />
        </group>
        {[-0.62, 0.62].map((x) => (
          <WindowUnit key={x} w={0.92} h={2.1} position={[x, 0.62, 0]} glass={mats.addGlass} frame={mats.addFrame} />
        ))}
      </group>

      <mesh position={[0, 2.05, 2.89]} material={mats.addStucco}>
        <boxGeometry args={[0.24, 3.1, 0.58]} />
      </mesh>

      <group position={[1.7, 0.5, -1.2]}>
        <group position={[BACK_OFFSET, 0, 0]}>
          <Wall len={BACK_LENGTH} h={3.1} material={mats.addStucco} openings={[{ x: -0.0625, w: 1.2, y0: 0.9, y1: 2.4 }]} />
        </group>
        <WindowUnit w={1.2} h={1.5} position={[0, 0.9, 0]} glass={mats.addGlass} frame={mats.addFrame} />
      </group>

      <group position={[3.4, 0.5, 0.7]} rotation={[0, Math.PI / 2, 0]}>
        <Wall len={SIDE_DEPTH} h={3.1} t={WALL_THICKNESS} material={mats.addStucco} openings={[SIDE_DOOR]} />
        <mesh position={[SIDE_DOOR.x, SIDE_DOOR.y1 / 2, 0.09]} material={mats.addWood}>
          <boxGeometry args={[SIDE_DOOR.w + 0.04, SIDE_DOOR.y1, 0.1]} />
        </mesh>
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
