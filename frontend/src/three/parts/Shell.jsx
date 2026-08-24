// T-230 — Structural shell that reads as the BONES of the same house.
//
// The tower is no longer five full-height wall slabs (which the lime state
// flattened into a glowing block). Wall areas are real CBS piers built with
// the SAME opening coordinates the finished envelope uses (EnvelopeV4), so
// every window/door stays a void and the massing stays recognizable.
//
// Material split (South Florida CBS language, no fake wood studs):
//   mats.shellConcrete — block piers, floor/mid slab, roof slabs (grey)
//   mats.shell         — active structural members: corner columns, perimeter
//                        tie beams, headers/lintels, pavilion columns + ring
//                        beam (lime highlight)
// Both materials share the blueprint-wireframe intro behavior in HouseModel.

// Opening lists in facade coordinates (net world positions of EnvelopeV4's
// voids — its +0.0625 opening shift cancels against its -0.0625 group offset).
const FRONT_OPENINGS = [
  { x: 1.54, w: 1.2, y0: 0, y1: 2.7 },          // entry door
  { x: -1.45, w: 1.0, y0: 0.5, y1: 2.9 },
  { x: -0.25, w: 1.0, y0: 0.5, y1: 2.9 },
  { x: -1.5, w: 1.25, y0: 3.95, y1: 4.85 },
  { x: -0.2, w: 1.25, y0: 3.95, y1: 4.85 },
];
const BACK_OPENINGS = [
  { x: -0.5, w: 1.8, y0: 0, y1: 2.4 },
  { x: -1.1, w: 1.25, y0: 3.95, y1: 4.85 },
  { x: 1.1, w: 1.25, y0: 3.95, y1: 4.85 },
];
const WEST_OPENINGS = [
  { x: -1.6, w: 1.0, y0: 0.5, y1: 2.9 },
  { x: 1.2, w: 1.0, y0: 0.5, y1: 2.9 },
  { x: -1.55, w: 1.25, y0: 3.95, y1: 4.85 },
  { x: 1.25, w: 1.25, y0: 3.95, y1: 4.85 },
];

const Header = ({ opening, material }) => (
  <mesh position={[opening.x, opening.y1 + 0.12, 0]} material={material}>
    <boxGeometry args={[opening.w + 0.36, 0.24, 0.3]} />
  </mesh>
);

const TOWER_CORNERS = [
  [-5.79, 2.79], [-5.79, -2.79], [-1.21, 2.79], [-1.21, -2.79],
];

export default function Shell({ mats, reg }) {
  return (
    <group name="shell" ref={reg("shellGroup")}>
      {/* ------------------------------------------------ tower CBS piers -- */}
      <group position={[-3.5, 0.5, 2.84]}>
                {FRONT_OPENINGS.map((o, i) => <Header key={i} opening={o} material={mats.shell} />)}
      </group>
      <group position={[-3.5, 0.5, -2.84]}>
                {BACK_OPENINGS.map((o, i) => <Header key={i} opening={o} material={mats.shell} />)}
      </group>
      <group position={[-5.84, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                {WEST_OPENINGS.map((o, i) => <Header key={i} opening={o} material={mats.shell} />)}
      </group>

      {/* ------------------------------------------ tower corner columns -- */}
      {TOWER_CORNERS.map(([x, z], i) => (
        <mesh key={`col-${i}`} position={[x, 3.3, z]} material={mats.shell}>
          <boxGeometry args={[0.3, 5.6, 0.3]} />
        </mesh>
      ))}

      {/* ------------------------- perimeter tie beams (mid + top of wall) -- */}
      {[3.5, 5.85].map((y) => (
        <group key={`tie-${y}`}>
          <mesh position={[-3.5, y, 2.86]} material={mats.shell}>
            <boxGeometry args={[5.0, 0.26, 0.28]} />
          </mesh>
          <mesh position={[-3.5, y, -2.86]} material={mats.shell}>
            <boxGeometry args={[5.0, 0.26, 0.28]} />
          </mesh>
          <mesh position={[-5.86, y, 0]} material={mats.shell}>
            <boxGeometry args={[0.28, 0.26, 6.12]} />
          </mesh>
          <mesh position={[-1.14, y, 0]} material={mats.shell}>
            <boxGeometry args={[0.28, 0.26, 6.12]} />
          </mesh>
        </group>
      ))}

      {/* --------------------------------------- floor / roof slab edges -- */}
      <mesh position={[-3.5, 3.5, 0]} material={mats.shellConcrete}>
        <boxGeometry args={[5, 0.3, 6]} />
      </mesh>
      <mesh position={[-3.5, 5.725, 0]} material={mats.shellConcrete}>
        <boxGeometry args={[5, 0.25, 6]} />
      </mesh>

      {/* ------------------------------------------------ pavilion bones -- */}
      {[[-0.8, -2.3], [-0.8, 2.3], [5.8, -2.3], [5.8, 2.3], [2.5, -2.3], [2.5, 2.3]].map(([x, z], i) => (
        <mesh key={`pcol-${i}`} position={[x, 2.2, z]} material={mats.shell}>
          <boxGeometry args={[0.22, 3.4, 0.22]} />
        </mesh>
      ))}
      {/* ring beam connecting the pavilion column tops */}
      <mesh position={[2.5, 3.78, 2.3]} material={mats.shell}>
        <boxGeometry args={[6.82, 0.2, 0.24]} />
      </mesh>
      <mesh position={[2.5, 3.78, -2.3]} material={mats.shell}>
        <boxGeometry args={[6.82, 0.2, 0.24]} />
      </mesh>
      <mesh position={[-0.8, 3.78, 0]} material={mats.shell}>
        <boxGeometry args={[0.24, 0.2, 4.36]} />
      </mesh>
      <mesh position={[5.8, 3.78, 0]} material={mats.shell}>
        <boxGeometry args={[0.24, 0.2, 4.36]} />
      </mesh>
      {/* pavilion roof slab */}
      <mesh position={[2.6, 3.9, 0]} material={mats.shellConcrete}>
        <boxGeometry args={[7.4, 0.18, 5.4]} />
      </mesh>
    </group>
  );
}
