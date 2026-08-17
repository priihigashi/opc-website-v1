// Structural shell: CBS block walls, roof slabs, columns, mid floor.
// Doubles as the blueprint-phase wireframe and the amber frame for Ch.01.
export default function Shell({ mats, reg }) {
  return (
    <group name="shell" ref={reg("shellGroup")}>
      {/* volume A block walls (two-storey) */}
      <mesh position={[-3.5, 3.3, 2.9]} material={mats.shell}>
        <boxGeometry args={[5, 5.6, 0.2]} />
      </mesh>
      <mesh position={[-3.5, 3.3, -2.9]} material={mats.shell}>
        <boxGeometry args={[5, 5.6, 0.2]} />
      </mesh>
      <mesh position={[-5.9, 3.3, 0]} material={mats.shell}>
        <boxGeometry args={[0.2, 5.6, 5.6]} />
      </mesh>
      <mesh position={[-1.1, 4.8, 0]} material={mats.shell}>
        <boxGeometry args={[0.2, 2.4, 5.6]} />
      </mesh>
      <mesh position={[-1.1, 2.175, 0]} material={mats.shell}>
        <boxGeometry args={[0.2, 3.35, 5.6]} />
      </mesh>
      {/* A mid floor + roof slab */}
      <mesh position={[-3.5, 3.5, 0]} material={mats.shell}>
        <boxGeometry args={[5, 0.3, 6]} />
      </mesh>
      <mesh position={[-3.5, 5.725, 0]} material={mats.shell}>
        <boxGeometry args={[5, 0.25, 6]} />
      </mesh>
      {/* pavilion columns */}
      {[[-0.8, -2.3], [-0.8, 2.3], [5.8, -2.3], [5.8, 2.3], [2.5, -2.3], [2.5, 2.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 2.2, z]} material={mats.shell}>
          <boxGeometry args={[0.22, 3.4, 0.22]} />
        </mesh>
      ))}
      {/* pavilion roof slab */}
      <mesh position={[2.5, 3.9, 0]} material={mats.shell}>
        <boxGeometry args={[7.4, 0.18, 5.4]} />
      </mesh>
    </group>
  );
}
