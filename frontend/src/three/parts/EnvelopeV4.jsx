import { Wall, WindowUnit } from "./units";

const WALL_THICKNESS = 0.25;
const TOWER_FRONT_LENGTH = 5.125;
const TOWER_FRONT_OFFSET = -0.0625;
const TOWER_SIDE_DEPTH = 5.75;
const OPENING_OFFSET = 0.0625;
const PAVILION_SIDE_DEPTH = 4.7;
const JUNCTION_DEPTH = 0.225;

const shiftOpenings = (openings) =>
  openings.map((opening) => ({ ...opening, x: opening.x + OPENING_OFFSET }));

const resolvePavilionJunction = (junction) => ({
  width: junction.width ?? WALL_THICKNESS,
  depth: junction.depth ?? JUNCTION_DEPTH,
  height: junction.height ?? 3.4,
  centerY: junction.centerY ?? 1.7,
  frontZ: junction.frontZ ?? -0.2375,
  rearZ: junction.rearZ ?? 0.2375,
});

// Envelope v4 uses true butt joints. Front/back faces own the outer corners;
// perpendicular walls stop at their inner faces, so no boxes overlap and no
// cosmetic closure strips are needed. The entry opening is deliberately kept
// separate from the shifted window grid. The door sits just proud of the wall
// face and overlaps the opening by 0.02 units per side, preventing the pale
// wall reveal from reading as a gap at oblique camera angles.
export default function EnvelopeV4({
  mats,
  reg,
  entryDoor = {},
  pavilionJunction = {},
  upperEastWallShadows = true,
}) {
  const doorCenter = entryDoor.center ?? 1.6;
  const doorWidth = entryDoor.width ?? 1.24;
  const handleX = entryDoor.handleX ?? 2.07;
  const handleY = entryDoor.handleY ?? 1.35;
  const handleZ = entryDoor.handleZ ?? 0.06;
  const handleSize = entryDoor.handleSize ?? [0.045, 0.9, 0.045];
  const {
    width: junctionWidth,
    depth: junctionDepth,
    height: junctionHeight,
    centerY: junctionCenterY,
    frontZ: junctionFrontZ,
    rearZ: junctionRearZ,
  } = resolvePavilionJunction(pavilionJunction);
  const frontOpenings = [
    { x: 1.6, w: 1.2, y0: 0, y1: 2.7 },
    ...shiftOpenings([
    { x: -1.45, w: 1.0, y0: 0.5, y1: 2.9 },
    { x: -0.25, w: 1.0, y0: 0.5, y1: 2.9 },
    { x: -1.5, w: 1.25, y0: 3.95, y1: 4.85 },
    { x: -0.2, w: 1.25, y0: 3.95, y1: 4.85 },
    ]),
  ];
  const backOpenings = shiftOpenings([
    { x: -0.5, w: 1.8, y0: 0, y1: 2.4 },
    { x: -1.1, w: 1.25, y0: 3.95, y1: 4.85 },
    { x: 1.1, w: 1.25, y0: 3.95, y1: 4.85 },
  ]);

  return (
    <group name="exterior-finishes-v4">
      <group name="facade-front-a-v4" ref={reg("finFrontA")} position={[-3.5, 0.5, 3]}>
        <group position={[TOWER_FRONT_OFFSET, 0, 0]}>
          <Wall len={TOWER_FRONT_LENGTH} h={5.6} material={mats.stuccoFront} openings={frontOpenings} />
        </group>
        <group name="windows">
          <WindowUnit w={1.0} h={2.4} position={[-1.45, 0.5, 0]} glass={mats.glassFront} frame={mats.frameFront} mullions={1} />
          <WindowUnit w={1.0} h={2.4} position={[-0.25, 0.5, 0]} glass={mats.glassFront} frame={mats.frameFront} mullions={1} />
          <WindowUnit w={1.25} h={0.9} position={[-1.5, 3.95, 0]} glass={mats.glassFrost} frame={mats.frameFront} mullions={1} />
          <WindowUnit w={1.25} h={0.9} position={[-0.2, 3.95, 0]} glass={mats.glassFrost} frame={mats.frameFront} mullions={1} />
          {[-1.5, -0.2].map((x) => (
            <mesh key={`curtain-${x}`} position={[x, 4.4, -0.045]} material={mats.curtain}>
              <boxGeometry args={[1.08, 0.74, 0.02]} />
            </mesh>
          ))}
        </group>
        <mesh position={[1.6, 4.25, 0.18]} material={mats.woodScreenFront}>
          <boxGeometry args={[1.2, 2.66, 0.08]} />
        </mesh>
        <mesh position={[doorCenter, 1.35, 0.09]} material={mats.doorWood}>
          <boxGeometry args={[doorWidth, 2.7, 0.1]} />
        </mesh>
        <mesh position={[handleX, handleY, handleZ]} material={mats.frameFront}>
          <boxGeometry args={handleSize} />
        </mesh>
        <mesh position={[1.6, 2.88, 0.76]} material={mats.frameFront}>
          <boxGeometry args={[1.8, 0.12, 1.3]} />
        </mesh>
        <mesh position={[0.6, 2.2, 0.17]} material={mats.sconce}>
          <boxGeometry args={[0.09, 0.36, 0.09]} />
        </mesh>
        <mesh position={[2.375, junctionCenterY, junctionFrontZ]} material={mats.stuccoSide}>
          <boxGeometry args={[junctionWidth, junctionHeight, junctionDepth]} />
        </mesh>
      </group>

      <group name="facade-back-a-v2" ref={reg("finBackA")} position={[-3.5, 0.5, -3]}>
        <group position={[TOWER_FRONT_OFFSET, 0, 0]}>
          <Wall len={TOWER_FRONT_LENGTH} h={5.6} material={mats.stuccoSide} openings={backOpenings} />
        </group>
        <WindowUnit w={1.8} h={2.4} position={[-0.5, 0, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        <WindowUnit w={1.25} h={0.9} position={[-1.1, 3.95, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        <WindowUnit w={1.25} h={0.9} position={[1.1, 3.95, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        <mesh position={[2.375, junctionCenterY, junctionRearZ]} material={mats.stuccoSide}>
          <boxGeometry args={[junctionWidth, junctionHeight, junctionDepth]} />
        </mesh>
      </group>

      <group name="facade-west-a-v2" ref={reg("finWestA")} position={[-6, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Wall
          len={TOWER_SIDE_DEPTH}
          h={5.6}
          material={mats.stuccoSide}
          openings={[
            { x: -1.6, w: 1.0, y0: 0.5, y1: 2.9 },
            { x: 1.2, w: 1.0, y0: 0.5, y1: 2.9 },
            { x: -1.55, w: 1.25, y0: 3.95, y1: 4.85 },
            { x: 1.25, w: 1.25, y0: 3.95, y1: 4.85 },
          ]}
        />
        <WindowUnit w={1.0} h={2.4} position={[-1.6, 0.5, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        <WindowUnit w={1.0} h={2.4} position={[1.2, 0.5, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        <WindowUnit w={1.25} h={0.9} position={[-1.55, 3.95, 0]} glass={mats.glassFrost} frame={mats.frameSide} mullions={1} />
        <WindowUnit w={1.25} h={0.9} position={[1.25, 3.95, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        <mesh position={[-1.55, 4.4, -0.045]} material={mats.curtain}>
          <boxGeometry args={[1.08, 0.74, 0.02]} />
        </mesh>
      </group>

      <group name="facade-east-a-v2" ref={reg("finEastA")}>
        <mesh
          position={[-1.125, 4.85, 0]}
          material={mats.stuccoSide}
          userData={{ noCast: !upperEastWallShadows, noReceive: !upperEastWallShadows }}
        >
          <boxGeometry args={[WALL_THICKNESS, 2.5, TOWER_SIDE_DEPTH]} />
        </mesh>
      </group>

      <group name="roof-a-v2" ref={reg("finRoofA")}>
        <mesh position={[-3.5, 6.155, 0]} material={[mats.fascia, mats.fascia, mats.membrane, mats.soffit, mats.fascia, mats.fascia]}>
          <boxGeometry args={[5.35, 0.14, 6.5]} />
        </mesh>
      </group>

      <group name="roof-b-v2" ref={reg("finRoofB")}>
        <mesh position={[3.07, 3.97, 0]} material={[mats.fascia, mats.fascia, mats.membrane, mats.soffit, mats.fascia, mats.fascia]}>
          <boxGeometry args={[8.14, 0.16, 6.6]} />
        </mesh>
      </group>

      <group name="facade-front-b-v2" ref={reg("finFrontB")} position={[0, 0.5, 2.5]}>
        <group name="windows">
          {[-0.14, 1.58, 3.3, 5.02].map((x, i) => (
            <WindowUnit key={i} w={1.72} h={3.3} position={[x, 0, 0]} glass={mats.glassFront} frame={mats.frameFront} mullions={1} />
          ))}
        </group>
        <mesh position={[2.5, 3.37, 0]} material={mats.frameFront}>
          <boxGeometry args={[7.1, 0.09, 0.14]} />
        </mesh>
      </group>

      <group name="facade-back-b-v2" ref={reg("finBackB")} position={[0, 0.5, -2.5]}>
        <group name="windows">
          {[-0.14, 1.58, 3.3, 5.02].map((x, i) => (
            <WindowUnit key={i} w={1.72} h={3.3} position={[x, 0, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
          ))}
        </group>
        <mesh position={[2.5, 3.37, 0]} material={mats.frameSide}>
          <boxGeometry args={[7.1, 0.09, 0.14]} />
        </mesh>
      </group>

      <group name="facade-east-b-v2" ref={reg("finEastB")} position={[6, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Wall len={PAVILION_SIDE_DEPTH} h={3.4} material={mats.stuccoSide} openings={[{ x: 0.6, w: 0.7, y0: 0.4, y1: 3.0 }]} />
        <WindowUnit w={0.7} h={2.6} position={[0.6, 0.4, 0]} glass={mats.glassSide} frame={mats.frameSide} />
      </group>
    </group>
  );
}
