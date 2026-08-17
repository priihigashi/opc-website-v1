import { RoundedBox } from "@react-three/drei";

// Interior: oak floors, ceilings with recessed cans, kitchen pavilion,
// bathroom suite, furniture — revealed by the Ch.02 cutaway.
export default function Interior({ mats, reg }) {
  return (
    <group name="interior" ref={reg("interiorGroup")}>
      {/* floors */}
      <mesh position={[2.5, 0.53, 0]} material={mats.floorOak}>
        <boxGeometry args={[6.9, 0.06, 4.9]} />
      </mesh>
      <mesh position={[-3.5, 0.53, 0]} material={mats.floorOak}>
        <boxGeometry args={[4.9, 0.06, 5.9]} />
      </mesh>
      {/* ceilings */}
      <mesh position={[2.5, 3.78, 0]} material={mats.ceilWhite}>
        <boxGeometry args={[6.9, 0.05, 4.9]} />
      </mesh>
      <mesh position={[-3.5, 3.33, 0]} material={mats.ceilWhite}>
        <boxGeometry args={[4.9, 0.05, 5.9]} />
      </mesh>
      {/* recessed cans */}
      {[0.5, 2.5, 4.5].map((x) =>
        [-1.2, 1.2].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 3.755, z]} material={mats.can}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          </mesh>
        ))
      )}

      {/* ---- kitchen ---- */}
      <group name="kitchen">
        <mesh position={[-0.65, 2.0, 0]} material={mats.tallDark}>
          <boxGeometry args={[0.6, 3.0, 4.6]} />
        </mesh>
        <mesh position={[1.7, 0.925, 0.3]} material={mats.cabWood}>
          <boxGeometry args={[2.8, 0.85, 1.0]} />
        </mesh>
        <mesh position={[1.7, 1.39, 0.3]} material={mats.counterStone}>
          <boxGeometry args={[2.95, 0.08, 1.15]} />
        </mesh>
        {[0.9, 1.7, 2.5].map((x, i) => (
          <group key={`pendant-${i}`}>
            <mesh position={[x, 3.35, 0.3]} material={mats.pendant}>
              <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
            </mesh>
            <mesh position={[x, 2.92, 0.3]} material={mats.pendant}>
              <cylinderGeometry args={[0.05, 0.14, 0.2, 16]} />
            </mesh>
            <mesh position={[x, 2.83, 0.3]} material={mats.can}>
              <sphereGeometry args={[0.045, 12, 12]} />
            </mesh>
          </group>
        ))}
        {[0.9, 1.7, 2.5].map((x, i) => (
          <group key={`stool-${i}`}>
            <mesh position={[x, 0.85, 1.35]} material={mats.pendant}>
              <cylinderGeometry args={[0.03, 0.03, 0.62, 8]} />
            </mesh>
            <mesh position={[x, 1.18, 1.35]} material={mats.stoolSeat}>
              <cylinderGeometry args={[0.19, 0.19, 0.06, 16]} />
            </mesh>
          </group>
        ))}
        {/* lounge */}
        <mesh position={[4.7, 0.75, -1.3]} material={mats.fabric}>
          <boxGeometry args={[2.0, 0.45, 0.95]} />
        </mesh>
        <mesh position={[4.7, 1.15, -1.68]} material={mats.fabric}>
          <boxGeometry args={[2.0, 0.55, 0.25]} />
        </mesh>
        <mesh position={[3.4, 0.68, -1.3]} material={mats.cabWood}>
          <boxGeometry args={[1.0, 0.3, 0.5]} />
        </mesh>
      </group>

      {/* ---- bathroom (volume A, ground floor front) ---- */}
      <group name="bathroom">
        {/* tile accent partition */}
        <mesh position={[-4.3, 2.15, 1.0]} material={mats.tileBath}>
          <boxGeometry args={[3.4, 3.3, 0.12]} />
        </mesh>
        {/* side partition with door opening */}
        <mesh position={[-2.6, 2.15, 1.35]} material={mats.ceilWhite}>
          <boxGeometry args={[0.12, 3.3, 0.7]} />
        </mesh>
        <mesh position={[-2.6, 2.15, 2.7]} material={mats.ceilWhite}>
          <boxGeometry args={[0.12, 3.3, 0.4]} />
        </mesh>
        <mesh position={[-2.6, 3.25, 2.1]} material={mats.ceilWhite}>
          <boxGeometry args={[0.12, 1.1, 0.8]} />
        </mesh>
        {/* freestanding tub */}
        <RoundedBox args={[1.7, 0.6, 0.82]} radius={0.16} smoothness={6} position={[-4.6, 0.86, 2.3]} material={mats.tubWhite} />
        {/* vanity + vessel + mirror */}
        <mesh position={[-5.5, 0.95, 1.6]} material={mats.vanityWood}>
          <boxGeometry args={[0.55, 0.8, 1.3]} />
        </mesh>
        <mesh position={[-5.5, 1.42, 1.6]} material={mats.tubWhite}>
          <cylinderGeometry args={[0.19, 0.16, 0.14, 20]} />
        </mesh>
        <mesh position={[-5.86, 2.0, 1.6]} rotation={[0, Math.PI / 2, 0]} material={mats.mirror}>
          <boxGeometry args={[0.95, 0.75, 0.03]} />
        </mesh>
      </group>

      {/* ---- upstairs bedroom (volume A, level 2 — visible in the cutaway) ---- */}
      <group name="bedroom">
        <mesh position={[-3.5, 3.6, 0]} material={mats.floorOak}>
          <boxGeometry args={[4.9, 0.1, 5.9]} />
        </mesh>
        <mesh position={[-4.0, 3.67, 1.7]} material={mats.fabric}>
          <boxGeometry args={[2.6, 0.03, 1.9]} />
        </mesh>
        <mesh position={[-4.4, 3.82, 1.7]} material={mats.cabWood}>
          <boxGeometry args={[1.9, 0.32, 2.2]} />
        </mesh>
        <mesh position={[-4.4, 4.12, 1.7]} material={mats.fabric}>
          <boxGeometry args={[1.8, 0.28, 2.05]} />
        </mesh>
        <mesh position={[-4.4, 4.1, 0.55]} material={mats.cabWood}>
          <boxGeometry args={[1.9, 0.95, 0.12]} />
        </mesh>
        {[-4.85, -3.95].map((x, i) => (
          <mesh key={`pillow-${i}`} position={[x, 4.33, 0.95]} material={mats.tubWhite}>
            <boxGeometry args={[0.7, 0.16, 0.45]} />
          </mesh>
        ))}
        <mesh position={[-5.55, 3.9, 0.8]} material={mats.cabWood}>
          <boxGeometry args={[0.5, 0.5, 0.45]} />
        </mesh>
        <mesh position={[-5.55, 4.22, 0.8]} material={mats.pendant}>
          <cylinderGeometry args={[0.03, 0.05, 0.14, 10]} />
        </mesh>
        <mesh position={[-5.55, 4.34, 0.8]} material={mats.can}>
          <sphereGeometry args={[0.05, 10, 10]} />
        </mesh>
      </group>

      <pointLight ref={reg("interiorLight")} position={[2.2, 2.9, 0.4]} color="#FFB85C" intensity={0} distance={11} />
      <pointLight ref={reg("bathLight")} position={[-4.3, 2.6, 2.0]} color="#FFC98A" intensity={0} distance={7} />
    </group>
  );
}
