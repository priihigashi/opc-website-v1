// Ch.04 backyard V2: extend only the outdoor-kitchen side of the patio so the grill is fully supported.
export default function BackyardV2({ mats, reg }) {
  return (
    <group name="pergola" ref={reg("pergolaGroup")} visible={false}>
      <mesh ref={reg("patio")} position={[2.9, 0.56, -4.4]} material={[mats.patioEdge, mats.patioEdge, mats.patioPaver, mats.patioEdge, mats.patioEdge, mats.patioEdge]}>
        <boxGeometry args={[7.8, 0.12, 3.4]} />
      </mesh>
      <group ref={reg("pergolaPosts")} position={[2.5, 0.62, -4.4]}>
        {[[-2.2, -1.3], [2.2, -1.3], [-2.2, 1.3], [2.2, 1.3]].map(([x, z], i) => (
          <mesh key={i} position={[x, 1.25, z]} material={mats.pergolaWood}>
            <boxGeometry args={[0.18, 2.5, 0.18]} />
          </mesh>
        ))}
      </group>
      <group ref={reg("pergolaRoof")} position={[2.5, 0.62, -4.4]}>
        <mesh position={[0, 2.56, -1.3]} material={mats.pergolaWood}>
          <boxGeometry args={[5.0, 0.2, 0.18]} />
        </mesh>
        <mesh position={[0, 2.56, 1.3]} material={mats.pergolaWood}>
          <boxGeometry args={[5.0, 0.2, 0.18]} />
        </mesh>
        {[-2.2, -1.65, -1.1, -0.55, 0, 0.55, 1.1, 1.65, 2.2].map((x, i) => (
          <mesh key={i} position={[x, 2.74, 0]} material={mats.pergolaWood}>
            <boxGeometry args={[0.12, 0.16, 3.2]} />
          </mesh>
        ))}
      </group>
      <group ref={reg("bbqGroup")} position={[6.15, 0.62, -4.4]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.44, 0]} material={mats.bbqSteel}>
          <boxGeometry args={[2.0, 0.85, 0.65]} />
        </mesh>
        <mesh position={[0, 0.9, 0]} material={mats.bbqTop}>
          <boxGeometry args={[2.1, 0.07, 0.72]} />
        </mesh>
        <mesh position={[-0.4, 1.14, 0]} material={mats.bbqSteel}>
          <boxGeometry args={[0.72, 0.42, 0.56]} />
        </mesh>
      </group>
      <group name="pool" position={[-4.6, 0, -5.75]}>
        <mesh position={[0, 0.04, 0]} material={mats.poolDeck}>
          <boxGeometry args={[5.1, 0.08, 2.45]} />
        </mesh>
        <mesh position={[0, 0.06, 0]} material={mats.poolPlaster}>
          <boxGeometry args={[4.5, 0.06, 1.8]} />
        </mesh>
        <mesh position={[0, 0.26, 0.86]} material={mats.poolPlaster}>
          <boxGeometry args={[4.5, 0.4, 0.08]} />
        </mesh>
        <mesh position={[0, 0.26, -0.86]} material={mats.poolPlaster}>
          <boxGeometry args={[4.5, 0.4, 0.08]} />
        </mesh>
        <mesh position={[2.21, 0.26, 0]} material={mats.poolPlaster}>
          <boxGeometry args={[0.08, 0.4, 1.64]} />
        </mesh>
        <mesh position={[-2.21, 0.26, 0]} material={mats.poolPlaster}>
          <boxGeometry args={[0.08, 0.4, 1.64]} />
        </mesh>
        <mesh position={[0, 0.48, 1.02]} material={mats.poolCoping}>
          <boxGeometry args={[4.94, 0.07, 0.22]} />
        </mesh>
        <mesh position={[0, 0.48, -1.02]} material={mats.poolCoping}>
          <boxGeometry args={[4.94, 0.07, 0.22]} />
        </mesh>
        <mesh position={[2.36, 0.48, 0]} material={mats.poolCoping}>
          <boxGeometry args={[0.22, 0.07, 2.26]} />
        </mesh>
        <mesh position={[-2.36, 0.48, 0]} material={mats.poolCoping}>
          <boxGeometry args={[0.22, 0.07, 2.26]} />
        </mesh>
        <mesh ref={reg("poolWater")} position={[0, 0.12, 0]} material={mats.poolWater}>
          <boxGeometry args={[4.34, 0.05, 1.64]} />
        </mesh>
      </group>
    </group>
  );
}
