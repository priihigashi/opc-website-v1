import { useMemo } from "react";

const shrubShapes = [
  [[-0.3, 0.04, -0.08, 0.58], [0.25, 0.05, 0.02, 0.66], [0, 0.2, 0.06, 0.76], [-0.1, 0.34, -0.04, 0.52], [0.3, 0.25, -0.08, 0.42]],
  [[-0.26, 0.02, 0.05, 0.55], [0.3, 0.08, -0.04, 0.6], [0.02, 0.22, 0, 0.7], [-0.28, 0.25, -0.08, 0.4], [0.18, 0.39, 0.07, 0.38]],
  [[-0.36, 0.05, -0.03, 0.5], [0.18, 0.03, 0.08, 0.65], [-0.02, 0.23, -0.04, 0.72], [0.35, 0.24, 0.02, 0.36], [-0.12, 0.4, 0.08, 0.4]],
];

function OrganicShrub({ position, scale = 1, rotation = 0, variant = 0, mats }) {
  const offsets = shrubShapes[variant % shrubShapes.length];
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      {offsets.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={[s * 1.15, s * 0.72, s]} material={i % 3 === variant % 3 ? mats.foliageLight : mats.foliage}>
          <icosahedronGeometry args={[0.52, 2]} />
        </mesh>
      ))}
    </group>
  );
}

function OrganicBed({ position, scale = [1, 1], mats }) {
  return (
    <group position={position}>
      <mesh scale={[scale[0], 1, scale[1]]} material={mats.mulch}>
        <cylinderGeometry args={[0.72, 0.76, 0.12, 36]} />
      </mesh>
      <mesh position={[scale[0] * 0.52, 0, 0.02]} scale={[scale[0] * 0.72, 1, scale[1] * 0.88]} material={mats.mulch}>
        <cylinderGeometry args={[0.72, 0.76, 0.12, 36]} />
      </mesh>
      <mesh position={[-scale[0] * 0.5, 0, -0.02]} scale={[scale[0] * 0.68, 1, scale[1] * 0.82]} material={mats.mulch}>
        <cylinderGeometry args={[0.72, 0.76, 0.12, 36]} />
      </mesh>
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

export default function LandscapeV2({ mats, reg }) {
  const frontShrubs = [
    { position: [-0.38, 0.12, 4.5], scale: 0.58, rotation: -0.25, variant: 0 },
    { position: [-0.02, 0.11, 4.42], scale: 0.68, rotation: 0.2, variant: 1 },
    { position: [0.34, 0.12, 4.5], scale: 0.62, rotation: -0.1, variant: 2 },
    { position: [0.7, 0.11, 4.4], scale: 0.66, rotation: 0.3, variant: 0 },
    { position: [1.03, 0.12, 4.48], scale: 0.52, rotation: -0.35, variant: 1 },
  ];

  return (
    <group name="site-landscape-v2" ref={reg("landscapeGroup")}>
      {/* One low, organic entry bed, well clear of the entry path and driveway. */}
      <OrganicBed position={[0.28, 0.06, 4.48]} scale={[0.78, 0.58]} mats={mats} />
      {frontShrubs.map((shrub, i) => <OrganicShrub key={i} {...shrub} mats={mats} />)}

      {/* Tighter rear island leaves visible air between house, pool coping and planting. */}
      <OrganicBed position={[-7.62, 0.06, -3.42]} scale={[0.7, 0.58]} mats={mats} />
      <Palm position={[-7.62, 0.12, -3.42]} scale={0.66} mats={mats} />
      <OrganicShrub position={[-6.92, 0.12, -3.08]} scale={0.52} rotation={0.35} variant={2} mats={mats} />
      <OrganicShrub position={[-8.14, 0.12, -3.83]} scale={0.46} rotation={-0.4} variant={1} mats={mats} />
    </group>
  );
}
