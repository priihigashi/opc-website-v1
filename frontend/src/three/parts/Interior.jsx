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
      <mesh ref={reg("ceilPavilion")} position={[2.5, 3.78, 0]} material={mats.ceilWhite}>
        <boxGeometry args={[6.9, 0.05, 4.9]} />
      </mesh>
      <mesh ref={reg("ceilA")} position={[-3.5, 3.33, 0]} material={mats.ceilWhite}>
        <boxGeometry args={[4.9, 0.05, 5.9]} />
      </mesh>
      {/* second-floor ceiling — seals the roof junction light leak */}
      <mesh ref={reg("ceilUpper")} position={[-3.5, 5.52, 0]} material={mats.ceilWhite}>
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

      {/* ---- living room (volume A, ground floor front) ---- */}
      <group name="living">
        <mesh position={[-3.8, 0.575, 1.2]} material={mats.fabric}>
          <boxGeometry args={[3.2, 0.03, 2.2]} />
        </mesh>
        <mesh position={[-2.3, 0.78, 1.5]} material={mats.fabric}>
          <boxGeometry args={[0.95, 0.45, 2.2]} />
        </mesh>
        <mesh position={[-1.85, 1.16, 1.5]} material={mats.fabric}>
          <boxGeometry args={[0.25, 0.55, 2.2]} />
        </mesh>
        <mesh position={[-3.4, 0.72, 1.5]} material={mats.cabWood}>
          <boxGeometry args={[0.55, 0.3, 1.1]} />
        </mesh>
        <mesh position={[-5.55, 0.82, 1.5]} material={mats.cabWood}>
          <boxGeometry args={[0.45, 0.5, 2.0]} />
        </mesh>
        <mesh position={[-5.8, 1.75, 1.5]} material={mats.tallDark}>
          <boxGeometry args={[0.06, 0.95, 1.7]} />
        </mesh>
        <mesh position={[-5.35, 1.31, -0.3]} material={mats.pendant}>
          <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        </mesh>
        <mesh position={[-5.35, 2.1, -0.3]} material={mats.pendant}>
          <cylinderGeometry args={[0.16, 0.22, 0.26, 16]} />
        </mesh>
        <mesh position={[-5.35, 1.95, -0.3]} material={mats.can}>
          <sphereGeometry args={[0.06, 10, 10]} />
        </mesh>
      </group>

      {/* ---- upstairs bedroom (larger rear half; bed pulled away from exterior glass) ---- */}
      <group name="bedroom">
        <mesh position={[-3.5, 3.6, 0]} material={mats.floorOak}>
          <boxGeometry args={[4.9, 0.1, 5.9]} />
        </mesh>
        <mesh position={[-3.9, 3.67, -1.25]} material={mats.fabric}>
          <boxGeometry args={[3.0, 0.03, 2.4]} />
        </mesh>
        <mesh position={[-4.15, 3.82, -1.45]} material={mats.cabWood}>
          <boxGeometry args={[2.1, 0.32, 1.75]} />
        </mesh>
        <mesh position={[-4.15, 4.12, -1.45]} material={mats.fabric}>
          <boxGeometry args={[1.95, 0.28, 1.6]} />
        </mesh>
        <mesh position={[-5.25, 4.1, -1.45]} material={mats.cabWood}>
          <boxGeometry args={[0.12, 0.95, 1.85]} />
        </mesh>
        {[-1.85, -1.05].map((z, i) => (
          <mesh key={`pillow-${i}`} position={[-4.88, 4.33, z]} material={mats.tubWhite}>
            <boxGeometry args={[0.45, 0.16, 0.62]} />
          </mesh>
        ))}
        <mesh position={[-5.55, 3.9, -0.15]} material={mats.cabWood}>
          <boxGeometry args={[0.5, 0.5, 0.45]} />
        </mesh>
        <mesh position={[-5.55, 4.22, -0.15]} material={mats.pendant}>
          <cylinderGeometry args={[0.03, 0.05, 0.14, 10]} />
        </mesh>
        <mesh position={[-5.55, 4.34, -0.15]} material={mats.can}>
          <sphereGeometry args={[0.05, 10, 10]} />
        </mesh>
      </group>

      {/* ---- upstairs bathroom (front half; full tile floor under every fixture) ---- */}
      <group name="bathroom-upstairs">
        <mesh position={[-3.5, 3.67, 1.82]} material={mats.counterStone}>
          <boxGeometry args={[4.7, 0.03, 2.18]} />
        </mesh>
        {/* split partition leaves a real door opening on the east side */}
        <mesh position={[-4.35, 4.6, 0.78]} material={mats.partWhite}>
          <boxGeometry args={[3.1, 1.9, 0.1]} />
        </mesh>
        <mesh position={[-1.63, 4.6, 0.78]} material={mats.partWhite}>
          <boxGeometry args={[1.05, 1.9, 0.1]} />
        </mesh>
        <mesh position={[-3.5, 4.6, 2.84]} material={mats.tileBath}>
          <boxGeometry args={[4.7, 1.9, 0.05]} />
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
        <mesh position={[-4.1, 4.27, 2.58]} material={mats.tubWhite}>
          <boxGeometry args={[0.42, 0.4, 0.16]} />
        </mesh>
        <mesh position={[-4.1, 3.87, 2.28]} material={mats.tubWhite}>
          <cylinderGeometry args={[0.17, 0.14, 0.44, 18]} />
        </mesh>
        <mesh position={[-4.1, 4.11, 2.28]} material={mats.tubWhite}>
          <cylinderGeometry args={[0.22, 0.22, 0.07, 18]} />
        </mesh>
        {/* framed walk-in shower, east side — base, glass, top rails and corner post */}
        <mesh position={[-1.85, 3.69, 1.88]} material={mats.tubWhite}>
          <boxGeometry args={[1.15, 0.07, 1.35]} />
        </mesh>
        <mesh position={[-1.85, 4.62, 1.18]} material={mats.showerGlass}>
          <boxGeometry args={[1.15, 1.85, 0.04]} />
        </mesh>
        <mesh position={[-2.45, 4.62, 1.88]} material={mats.showerGlass}>
          <boxGeometry args={[0.04, 1.85, 1.45]} />
        </mesh>
        <mesh position={[-1.85, 5.53, 1.18]} material={mats.pendant}>
          <boxGeometry args={[1.22, 0.06, 0.07]} />
        </mesh>
        <mesh position={[-2.45, 5.53, 1.88]} material={mats.pendant}>
          <boxGeometry args={[0.07, 0.06, 1.52]} />
        </mesh>
        <mesh position={[-2.45, 4.62, 1.18]} material={mats.pendant}>
          <boxGeometry args={[0.07, 1.9, 0.07]} />
        </mesh>
        <mesh position={[-1.42, 5.28, 1.88]} rotation={[0, 0, Math.PI / 2]} material={mats.pendant}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        </mesh>
        <mesh position={[-1.6, 5.2, 1.88]} material={mats.pendant}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
        </mesh>
      </group>

      <pointLight ref={reg("interiorLight")} position={[2.2, 2.9, 0.4]} color="#FFB85C" intensity={0} distance={11} />
      <pointLight ref={reg("bathLight")} position={[-3.8, 4.8, 1.8]} color="#FFC98A" intensity={0} distance={7} />
    </group>
  );
}
