import EnvelopeV7 from "./EnvelopeV7";

const ADDITION_JUNCTIONS = [
  { name: "front", z: 2.21, depth: 0.7 },
  { name: "rear", z: -2.19, depth: 0.72 },
];

// Permanent full-height returns conceal the interior floor at both pavilion
// corners in every addition animation state.
export default function EnvelopeV8({ mats, ...props }) {
  return (
    <>
      <EnvelopeV7 mats={mats} {...props} />
      <group name="permanent-addition-junctions-v8">
        {ADDITION_JUNCTIONS.map(({ name, z, depth }) => (
          <mesh key={name} name={`pavilion-${name}-return-v8`} position={[6, 2.01, z]} material={mats.stuccoSide}>
            <boxGeometry args={[0.32, 3.42, depth]} />
          </mesh>
        ))}
      </group>
    </>
  );
}
