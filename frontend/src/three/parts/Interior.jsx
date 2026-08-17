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
        <mesh position={[3.9, 0.68, -0.35]} material={mats.cabWood}>
          <boxGeometry args={[1.0, 0.3, 0.5]} />
        </mesh>
      </group>

      {/* ---- bathroom (volume A, ground floor front) ---- */}
      <group name="bathroom">
        {/* tile accent partition — capped at the ceiling line, never through the floor above */}
        <mesh position={[-4.3, 1.9, 1.0]} material={mats.tileBath}>
          <boxGeometry args={[3.4, 2.8, 0.12]} />
        </mesh>
        {/* side partition with door opening */}
        <mesh position={[-2.6, 1.9, 1.35]} material={mats.partWhite}>
          <boxGeometry args={[0.12, 2.8, 0.7]} />
        </mesh>
        <mesh position={[-2.6, 1.9, 2.7]} material={mats.partWhite}>
          <boxGeometry args={[0.12, 2.8, 0.4]} />
        </mesh>
        <mesh position={[-2.6, 3.0, 2.1]} material={mats.partWhite}>
          <boxGeometry args={[0.12, 0.6, 0.8]} />
        </mesh>
        {/* powder room: toilet against the tile wall */}
        <group position={[-4.6, 0.5, 1.45]}>
          <mesh position={[0, 0.62, -0.28]} material={mats.tubWhite}>
            <boxGeometry args={[0.42, 0.4, 0.16]} />
          </mesh>
          <mesh position={[0, 0.22, 0.05]} material={mats.tubWhite}>
            <cylinderGeometry args={[0.17, 0.14, 0.44, 18]} />
          </mesh>
          <mesh position={[0, 0.46, 0.05]} material={mats.tubWhite}>
            <cylinderGeometry args={[0.22, 0.22, 0.07, 18]} />
          </mesh>
        </group>
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
        <mesh position={[-4.0, 3.67, -1.6]} material={mats.fabric}>
          <boxGeometry args={[2.6, 0.03, 1.9]} />
        </mesh>
        <mesh position={[-4.4, 3.82, -1.6]} material={mats.cabWood}>
          <boxGeometry args={[1.9, 0.32, 2.2]} />
        </mesh>
        <mesh position={[-4.4, 4.12, -1.6]} material={mats.fabric}>
          <boxGeometry args={[1.8, 0.28, 2.05]} />
        </mesh>
        <mesh position={[-4.4, 4.1, -2.82]} material={mats.cabWood}>
          <boxGeometry args={[1.9, 0.95, 0.12]} />
        </mesh>
        {[-4.85, -3.95].map((x, i) => (
          <mesh key={`pillow-${i}`} position={[x, 4.33, -2.35]} material={mats.tubWhite}>
            <boxGeometry args={[0.7, 0.16, 0.45]} />
          </mesh>
        ))}
        <mesh position={[-5.55, 3.9, -2.5]} material={mats.cabWood}>
          <boxGeometry args={[0.5, 0.5, 0.45]} />
        </mesh>
        <mesh position={[-5.55, 4.22, -2.5]} material={mats.pendant}>
          <cylinderGeometry args={[0.03, 0.05, 0.14, 10]} />
        </mesh>
        <mesh position={[-5.55, 4.34, -2.5]} material={mats.can}>
          <sphereGeometry args={[0.05, 10, 10]} />
        </mesh>
      </group>

      {/* ---- upstairs bathroom (volume A, level 2 front; ceiling at 5.6) ---- */}
      <group name="bathroom-upstairs">
        <mesh position={[-3.6, 3.67, 1.8]} material={mats.counterStone}>
          <boxGeometry args={[2.4, 0.03, 2.2]} />
        </mesh>
        <mesh position={[-4.6, 4.6, 0.6]} material={mats.partWhite}>
          <boxGeometry args={[2.8, 1.9, 0.1]} />
        </mesh>
        <mesh position={[-4.4, 4.6, 2.84]} material={mats.tileBath}>
          <boxGeometry args={[2.6, 1.9, 0.05]} />
        </mesh>
        <mesh position={[-5.5, 4.05, 2.0]} material={mats.vanityWood}>
          <boxGeometry args={[0.5, 0.8, 1.2]} />
        </mesh>
        <mesh position={[-5.5, 4.51, 2.0]} material={mats.tubWhite}>
          <cylinderGeometry args={[0.17, 0.15, 0.12, 18]} />
        </mesh>
        <mesh position={[-5.86, 4.9, 2.0]} rotation={[0, Math.PI / 2, 0]} material={mats.mirror}>
          <boxGeometry args={[0.85, 0.65, 0.03]} />
        </mesh>
        {/* toilet */}
        <mesh position={[-3.9, 4.27, 2.6]} material={mats.tubWhite}>
          <boxGeometry args={[0.42, 0.4, 0.16]} />
        </mesh>
        <mesh position={[-3.9, 3.87, 2.3]} material={mats.tubWhite}>
          <cylinderGeometry args={[0.17, 0.14, 0.44, 18]} />
        </mesh>
        <mesh position={[-3.9, 4.11, 2.3]} material={mats.tubWhite}>
          <cylinderGeometry args={[0.22, 0.22, 0.07, 18]} />
        </mesh>
        {/* walk-in shower, NE corner */}
        <mesh position={[-1.85, 3.69, 1.9]} material={mats.tubWhite}>
          <boxGeometry args={[1.1, 0.07, 1.3]} />
        </mesh>
        <mesh position={[-1.85, 4.62, 1.25]} material={mats.showerGlass}>
          <boxGeometry args={[1.1, 1.85, 0.04]} />
        </mesh>
        <mesh position={[-2.42, 4.62, 1.9]} material={mats.showerGlass}>
          <boxGeometry args={[0.04, 1.85, 1.3]} />
        </mesh>
        <mesh position={[-1.45, 5.28, 1.9]} rotation={[0, 0, Math.PI / 2]} material={mats.pendant}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        </mesh>
        <mesh position={[-1.62, 5.2, 1.9]} material={mats.pendant}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
        </mesh>
      </group>

      <pointLight ref={reg("interiorLight")} position={[2.2, 2.9, 0.4]} color="#FFB85C" intensity={0} distance={11} />
      <pointLight ref={reg("bathLight")} position={[-4.3, 2.6, 2.0]} color="#FFC98A" intensity={0} distance={7} />
    </group>
  );
}
