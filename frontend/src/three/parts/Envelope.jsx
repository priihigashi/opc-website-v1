import { Wall, WindowUnit } from "./units";

// Exterior finishes: stucco facades with real openings, wood screens,
// entry assembly, roof groups (name="roof") and glazing (name="windows").
export default function Envelope({ mats, reg }) {
  return (
    <group name="exterior-finishes">
      {/* ---- Volume A front facade (z = 3) ---- */}
      <group name="facade-front-a" ref={reg("finFrontA")} position={[-3.5, 0.5, 3]}>
        <Wall
          len={5}
          h={5.6}
          material={mats.stuccoFront}
          openings={[
            { x: 1.85, w: 1.3, y0: 0, y1: 2.5 },
            { x: -0.7, w: 1.0, y0: 0.5, y1: 2.9 },
            { x: -0.7, w: 1.0, y0: 3.9, y1: 5.1 },
            { x: 0.5, w: 1.1, y0: 3.9, y1: 5.1 },
          ]}
        />
        <group name="windows">
          <WindowUnit w={1.0} h={2.4} position={[-0.7, 0.5, 0]} glass={mats.glassFront} frame={mats.frameFront} mullions={1} />
          <WindowUnit w={1.0} h={1.2} position={[-0.7, 3.9, 0]} glass={mats.glassFront} frame={mats.frameFront} />
          <WindowUnit w={1.1} h={1.2} position={[0.5, 3.9, 0]} glass={mats.glassFront} frame={mats.frameFront} mullions={1} />
        </group>
        {/* wood-slat screen accent — starts right on top of the entry canopy */}
        <mesh position={[1.85, 4.15, 0.19]} material={mats.woodScreenFront}>
          <boxGeometry args={[1.35, 2.6, 0.1]} />
        </mesh>
        {/* recessed entry: pivot door, canopy, sconce */}
        <mesh position={[1.85, 1.21, -0.02]} material={mats.doorWood}>
          <boxGeometry args={[1.2, 2.42, 0.1]} />
        </mesh>
        <mesh position={[2.32, 1.25, 0.06]} material={mats.frameFront}>
          <boxGeometry args={[0.045, 0.85, 0.045]} />
        </mesh>
        <mesh position={[1.85, 2.78, 0.62]} material={mats.frameFront}>
          <boxGeometry args={[2.4, 0.12, 1.3]} />
        </mesh>
        <mesh position={[1.05, 2.2, 0.17]} material={mats.sconce}>
          <boxGeometry args={[0.09, 0.36, 0.09]} />
        </mesh>
        {/* return wall closing the reveal between volume A front (z=3) and pavilion glass (z=2.5) */}
        <mesh position={[2.5, 1.65, -0.25]} material={mats.stuccoFront}>
          <boxGeometry args={[0.25, 3.3, 0.5]} />
        </mesh>
      </group>

      {/* ---- Volume A back facade (z = -3) ---- */}
      <group name="facade-back-a" ref={reg("finBackA")} position={[-3.5, 0.5, -3]}>
        <Wall
          len={5}
          h={5.6}
          material={mats.stuccoSide}
          openings={[
            { x: -0.5, w: 1.8, y0: 0, y1: 2.4 },
            { x: 1.7, w: 1.4, y0: 3.9, y1: 5.1 },
          ]}
        />
        <WindowUnit w={1.8} h={2.4} position={[-0.5, 0, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        <WindowUnit w={1.4} h={1.2} position={[1.7, 3.9, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        {/* return wall closing the rear reveal at the pavilion junction */}
        <mesh position={[2.5, 1.65, 0.25]} material={mats.stuccoSide}>
          <boxGeometry args={[0.25, 3.3, 0.5]} />
        </mesh>
      </group>

      {/* ---- Volume A west facade (x = -6) ---- */}
      <group name="facade-west-a" ref={reg("finWestA")} position={[-6, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Wall len={6} h={5.6} material={mats.stuccoSide} openings={[{ x: 0.8, w: 1.2, y0: 3.9, y1: 5.1 }]} />
        <WindowUnit w={1.2} h={1.2} position={[0.8, 3.9, 0]} glass={mats.glassSide} frame={mats.frameSide} />
      </group>

      {/* ---- Volume A east upper wall (above pavilion roof) ---- */}
      <group name="facade-east-a" ref={reg("finEastA")}>
        <mesh position={[-1.125, 4.8, 0]} material={mats.stuccoSide}>
          <boxGeometry args={[0.25, 2.4, 6]} />
        </mesh>
      </group>

      {/* ---- Roof A: parapet coping + membrane (name="roof") ---- */}
      <group name="roof-a" ref={reg("finRoofA")}>
        <mesh position={[-3.5, 6.14, 3.0]} material={mats.fascia}>
          <boxGeometry args={[5.35, 0.08, 0.3]} />
        </mesh>
        <mesh position={[-3.5, 6.14, -3.0]} material={mats.fascia}>
          <boxGeometry args={[5.35, 0.08, 0.3]} />
        </mesh>
        <mesh position={[-6.1, 6.14, 0]} material={mats.fascia}>
          <boxGeometry args={[0.3, 0.08, 6.35]} />
        </mesh>
        <mesh position={[-0.9, 6.14, 0]} material={mats.fascia}>
          <boxGeometry args={[0.3, 0.08, 6.35]} />
        </mesh>
        <mesh position={[-3.5, 5.9, 0]} material={mats.membrane}>
          <boxGeometry args={[4.7, 0.06, 5.7]} />
        </mesh>
      </group>

      {/* ---- Roof B: floating plane, bronze fascia, wood soffit ---- */}
      <group name="roof-b" ref={reg("finRoofB")}>
        <mesh position={[2.85, 3.97, 0]} material={[mats.fascia, mats.fascia, mats.membrane, mats.soffit, mats.fascia, mats.fascia]}>
          <boxGeometry args={[8.6, 0.16, 6.6]} />
        </mesh>
      </group>

      {/* ---- Pavilion front glazing (z = 2.5) ---- */}
      <group name="facade-front-b" ref={reg("finFrontB")} position={[0, 0.5, 2.5]}>
        <group name="windows">
          {[-0.14, 1.58, 3.3, 5.02].map((x, i) => (
            <WindowUnit key={i} w={1.72} h={3.3} position={[x, 0, 0]} glass={mats.glassFront} frame={mats.frameFront} mullions={1} />
          ))}
        </group>
        <mesh position={[2.5, 3.37, 0]} material={mats.frameFront}>
          <boxGeometry args={[7.1, 0.09, 0.14]} />
        </mesh>
      </group>

      {/* ---- Pavilion back glazing (z = -2.5) ---- */}
      <group name="facade-back-b" ref={reg("finBackB")} position={[0, 0.5, -2.5]}>
        <group name="windows">
          {[-0.14, 1.58, 3.3, 5.02].map((x, i) => (
            <WindowUnit key={i} w={1.72} h={3.3} position={[x, 0, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
          ))}
        </group>
        <mesh position={[2.5, 3.37, 0]} material={mats.frameSide}>
          <boxGeometry args={[7.1, 0.09, 0.14]} />
        </mesh>
      </group>

      {/* ---- Pavilion east stucco wall with slot window (x = 6) ---- */}
      <group name="facade-east-b" ref={reg("finEastB")} position={[6, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Wall len={5} h={3.4} material={mats.stuccoSide} openings={[{ x: 0.6, w: 0.7, y0: 0.4, y1: 3.0 }]} />
        <WindowUnit w={0.7} h={2.6} position={[0.6, 0.4, 0]} glass={mats.glassSide} frame={mats.frameSide} />
      </group>
    </group>
  );
}
