import { useMemo } from "react";

const clumpOffsets = [
  [-0.34, 0.02, -0.08, 0.62], [0.3, 0.06, 0.02, 0.7], [0, 0.2, 0.05, 0.8],
  [-0.12, 0.36, -0.04, 0.6], [0.18, 0.34, 0.08, 0.55], [-0.38, 0.26, 0.12, 0.42],
  [0.4, 0.24, -0.1, 0.45], [0.04, 0.48, 0, 0.38],
];

function OrganicShrub({ position, scale = 1, mats }) {
  return (
    <group position={position} scale={scale}>
      {clumpOffsets.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={[s * 1.12, s * 0.78, s]} material={i % 3 === 0 ? mats.foliageLight : mats.foliage}>
          <icosahedronGeometry args={[0.52, 2]} />
        </mesh>
      ))}
    </group>
  );
}

function Palm({ position, scale = 1, mats }) {
  const fronds = useMemo(() => Array.from({ length: 9 }, (_, i) => ({
    r: (i / 9) * Math.PI * 2,
    drop: i % 2 ? -0.18 : -0.05,
  })), []);
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.55, 0]} rotation={[0.05, 0, -0.04]} material={mats.palmTrunk}>
        <cylinderGeometry args={[0.12, 0.2, 3.2, 12]} />
      </mesh>
      <group position={[0, 3.18, 0]}>
        {fronds.map(({ r, drop }, i) => (
          <mesh key={i} rotation={[0, r, drop]} scale={[1.45, 0.13, 0.34]} position={[Math.sin(r) * 0.55, -0.05, Math.cos(r) * 0.55]} material={i % 2 ? mats.foliage : mats.foliageLight}>
            <sphereGeometry args={[0.62, 12, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function LandscapeV1({ mats, reg }) {
  return (
    <group name="site-landscape-v1" ref={reg("landscapeGroup")}>
      <mesh position={[4.9, 0.32, 4.55]} material={mats.mulch}>
        <boxGeometry args={[2.8, 0.12, 1.05]} />
      </mesh>
      <OrganicShrub position={[4.15, 0.48, 4.55]} scale={0.78} mats={mats} />
      <OrganicShrub position={[5.0, 0.46, 4.55]} scale={0.68} mats={mats} />
      <OrganicShrub position={[5.75, 0.45, 4.55]} scale={0.72} mats={mats} />
      <mesh position={[-7.25, 0.34, -3.7]} material={mats.mulch}>
        <cylinderGeometry args={[1.15, 1.15, 0.13, 32]} />
      </mesh>
      <Palm position={[-7.25, 0.4, -3.7]} scale={0.72} mats={mats} />
      <OrganicShrub position={[-6.45, 0.48, -3.35]} scale={0.76} mats={mats} />
      <OrganicShrub position={[7.1, 0.5, -3.2]} scale={0.9} mats={mats} />
    </group>
  );
}
