import { RoundedBox } from "@react-three/drei";

export default function BackyardV2({ mats, reg }) {
  return (
    <group name="outdoor-living-v2" ref={reg("pergolaGroup")} visible={false}>
      <RoundedBox ref={reg("patio")} args={[7, 0.14, 3.4]} radius={0.06} smoothness={3} position={[2.5, 0.56, -4.4]} material={mats.patioPaver} />
      <group ref={reg("pergolaPosts")} position={[2.5, 0.62, -4.4]}>
        {[[-2.2, -1.3], [2.2, -1.3], [-2.2, 1.3], [2.2, 1.3]].map(([x, z], i) => (
          <RoundedBox key={i} args={[0.2, 2.5, 0.2]} radius={0.025} smoothness={2} position={[x, 1.25, z]} material={mats.pergolaWood} />
        ))}
      </group>
      <group ref={reg("pergolaRoof")} position={[2.5, 0.62, -4.4]}>
        {[-1.3, 1.3].map((z) => <RoundedBox key={z} args={[5, 0.22, 0.2]} radius={0.025} smoothness={2} position={[0, 2.56, z]} material={mats.pergolaWood} />)}
        {[-2.2, -1.65, -1.1, -0.55, 0, 0.55, 1.1, 1.65, 2.2].map((x) => (
          <RoundedBox key={x} args={[0.13, 0.17, 3.2]} radius={0.018} smoothness={2} position={[x, 2.74, 0]} material={mats.pergolaWood} />
        ))}
        {[-1.45, 0, 1.45].map((x) => <pointLight key={x} position={[x, 2.48, 0]} intensity={2.2} distance={3.4} color="#FFD8A3" />)}
      </group>
      <group ref={reg("bbqGroup")} position={[6.15, 0.62, -4.4]} rotation={[0, Math.PI / 2, 0]}>
        <RoundedBox args={[2.0, 0.85, 0.65]} radius={0.06} smoothness={3} position={[0, 0.44, 0]} material={mats.bbqSteel} />
        <RoundedBox args={[2.1, 0.07, 0.72]} radius={0.025} smoothness={2} position={[0, 0.9, 0]} material={mats.counterStone} />
        <RoundedBox args={[0.72, 0.42, 0.56]} radius={0.04} smoothness={2} position={[-0.4, 1.14, 0]} material={mats.bbqSteel} />
        {[-0.62, 0.03, 0.68].map((x) => <mesh key={x} position={[x, 0.43, 0.335]} material={mats.brass}><boxGeometry args={[0.018, 0.48, 0.012]} /></mesh>)}
      </group>
      <group name="pool" position={[-4.6, 0, -5.75]}>
        <RoundedBox args={[5.1, 0.08, 2.45]} radius={0.08} smoothness={3} position={[0, 0.04, 0]} material={mats.poolDeck} />
        <mesh position={[0, 0.06, 0]} material={mats.poolPlaster}><boxGeometry args={[4.5, 0.06, 1.8]} /></mesh>
        {[-0.86, 0.86].map((z) => <mesh key={z} position={[0, 0.26, z]} material={mats.poolPlaster}><boxGeometry args={[4.5, 0.4, 0.08]} /></mesh>)}
        {[-2.21, 2.21].map((x) => <mesh key={x} position={[x, 0.26, 0]} material={mats.poolPlaster}><boxGeometry args={[0.08, 0.4, 1.64]} /></mesh>)}
        {[-1.02, 1.02].map((z) => <RoundedBox key={z} args={[4.94, 0.07, 0.22]} radius={0.025} smoothness={2} position={[0, 0.48, z]} material={mats.poolCoping} />)}
        {[-2.36, 2.36].map((x) => <RoundedBox key={x} args={[0.22, 0.07, 2.26]} radius={0.025} smoothness={2} position={[x, 0.48, 0]} material={mats.poolCoping} />)}
        <mesh ref={reg("poolWater")} position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.poolWater}><planeGeometry args={[4.34, 1.64, 20, 10]} /></mesh>
        <pointLight position={[0, 0.35, 0]} intensity={2.4} distance={4} color="#5BD8ED" />
      </group>
    </group>
  );
}
