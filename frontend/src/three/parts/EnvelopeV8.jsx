import EnvelopeV7 from "./EnvelopeV7";

const ADDITION_JUNCTIONS = [
  { name: "front", z: 2.21, depth: 0.7 },
  { name: "rear", z: -2.19, depth: 0.72 },
];

// These two stucco returns terminate the pavilion before the animated addition
// begins. They are part of the permanent house envelope, so they remain full
// height while the addition grows or retracts and conceal the interior floor at
// both glass-wall corners in every animation state.
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
