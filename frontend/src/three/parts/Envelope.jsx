import { Wall, WindowUnit } from "./units";

// Exterior finishes: stucco facades with real openings, wood screens,
// entry assembly, roof groups (name="roof") and glazing (name="windows").
export default function Envelope({
  mats,
  reg,
  pavilionRoofX = 3.15,
  pavilionRoofWidth = 8.0,
  pavilionReturnHeight = 3.3,
  pavilionReturnCenterY = 1.65,
  towerWestWallLength = 6,
  towerEastUpperDepth = 6,
  towerWestCornerClosure = 0,
}) {
  return (
    <group name="exterior-finishes">
      {/* ---- Volume A front facade (z = 3) ---- */}
      <group name="facade-front-a" ref={reg("finFrontA")} position={[-3.5, 0.5, 3]}>
        <Wall
          len={5}
          h={5.6}
          material={mats.stuccoFront}
          openings={[
            { x: 1.6, w: 1.3, y0: 0, y1: 2.78 },
            { x: -1.45, w: 1.0, y0: 0.5, y1: 2.9 },
            { x: -0.25, w: 1.0, y0: 0.5, y1: 2.9 },
            { x: -1.5, w: 1.25, y0: 3.95, y1: 4.85 },
            { x: -0.2, w: 1.25, y0: 3.95, y1: 4.85 },
          ]}
        />
        {towerWestCornerClosure > 0 && (
          <mesh
            position={[-2.5 - towerWestCornerClosure / 2, 2.8, 0]}
            material={mats.stuccoFront}
          >
            <boxGeometry args={[towerWestCornerClosure, 5.6, 0.25]} />
          </mesh>
        )}
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
        {/* wood-slat screen: sits on the canopy and finishes just under the roof coping */}
        <mesh position={[1.6, 4.25, 0.18]} material={mats.woodScreenFront}>
          <boxGeometry args={[1.2, 2.66, 0.08]} />
        </mesh>
        {/* recessed entry: taller pivot door, canopy attached to the face without passing through it */}
        <mesh position={[1.6, 1.35, -0.02]} material={mats.doorWood}>
          <boxGeometry args={[1.2, 2.7, 0.1]} />
        </mesh>
        <mesh position={[2.07, 1.35, 0.06]} material={mats.frameFront}>
          <boxGeometry args={[0.045, 0.9, 0.045]} />
        </mesh>
        <mesh position={[1.6, 2.88, 0.76]} material={mats.frameFront}>
          <boxGeometry args={[1.8, 0.12, 1.3]} />
        </mesh>
        <mesh position={[0.6, 2.2, 0.17]} material={mats.sconce}>
          <boxGeometry args={[0.09, 0.36, 0.09]} />
        </mesh>
        {/* return wall closing the reveal between volume A front (z=3) and pavilion glass (z=2.5) */}
        <mesh position={[2.5, pavilionReturnCenterY, -0.25]} material={mats.stuccoFront}>
          <boxGeometry args={[0.25, pavilionReturnHeight, 0.5]} />
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
            { x: -1.1, w: 1.25, y0: 3.95, y1: 4.85 },
            { x: 1.1, w: 1.25, y0: 3.95, y1: 4.85 },
          ]}
        />
        {towerWestCornerClosure > 0 && (
          <mesh
            position={[-2.5 - towerWestCornerClosure / 2, 2.8, 0]}
            material={mats.stuccoSide}
          >
            <boxGeometry args={[towerWestCornerClosure, 5.6, 0.25]} />
          </mesh>
        )}
        <WindowUnit w={1.8} h={2.4} position={[-0.5, 0, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        <WindowUnit w={1.25} h={0.9} position={[-1.1, 3.95, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        <WindowUnit w={1.25} h={0.9} position={[1.1, 3.95, 0]} glass={mats.glassSide} frame={mats.frameSide} mullions={1} />
        {/* return wall closing the rear reveal at the pavilion junction */}
        <mesh position={[2.5, pavilionReturnCenterY, 0.25]} material={mats.stuccoSide}>
          <boxGeometry args={[0.25, pavilionReturnHeight, 0.5]} />
        </mesh>
      </group>

      {/* ---- Volume A west facade (x = -6) ---- */}
      <group name="facade-west-a" ref={reg("finWestA")} position={[-6, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Wall
          len={towerWestWallLength}
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

      {/* ---- Volume A east upper wall (above pavilion roof) ---- */}
      <group name="facade-east-a" ref={reg("finEastA")}>
        <mesh position={[-1.125, 4.85, 0]} material={mats.stuccoSide}>
          <boxGeometry args={[0.25, 2.5, towerEastUpperDepth]} />
        </mesh>
      </group>

      {/* ---- Roof A: coping overlaps the parapet by 15mm — no coplanar flicker ---- */}
      <group name="roof-a" ref={reg("finRoofA")}>
        <mesh position={[-3.5, 6.155, 0]} material={[mats.fascia, mats.fascia, mats.membrane, mats.soffit, mats.fascia, mats.fascia]}>
          <boxGeometry args={[5.35, 0.14, 6.5]} />
        </mesh>
      </group>

      {/* ---- Roof B: floating plane, bronze fascia, wood soffit; closes cleanly against the tower return ---- */}
      <group name="roof-b" ref={reg("finRoofB")}>
        <mesh position={[pavilionRoofX, 3.97, 0]} material={[mats.fascia, mats.fascia, mats.membrane, mats.soffit, mats.fascia, mats.fascia]}>
          <boxGeometry args={[pavilionRoofWidth, 0.16, 6.6]} />
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
