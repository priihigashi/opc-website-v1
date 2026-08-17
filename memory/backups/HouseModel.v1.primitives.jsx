import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "../lib/scrollStore";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const sstep = (v) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const seg = (p, a, b) => sstep((p - a) / (b - a));
const pulse = (p, a, b, c, d) => Math.max(0, seg(p, a, b) - seg(p, c, d));
const track = (p, keys) => {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (p <= keys[i][0]) {
      const [p0, v0] = keys[i - 1];
      const [p1, v1] = keys[i];
      return v0 + (v1 - v0) * sstep((p - p0) / (p1 - p0));
    }
  }
  return keys[keys.length - 1][1];
};

const ROT = [[0, -0.9], [0.07, -0.25], [0.1, -0.25], [0.19, 0.85], [0.26, 0.85], [0.33, 0.02], [0.4, 0.02], [0.5, -1.15], [0.56, -1.15], [0.66, -3.05], [0.72, -3.05], [0.845, -5.9], [0.9, -5.9], [1, -6.2]];
const POSX = [[0, 0], [0.1, 0], [0.17, -2.3], [0.27, -2.3], [0.33, 2.3], [0.43, 2.3], [0.5, -2.3], [0.58, -2.3], [0.65, 2.3], [0.74, 2.3], [0.83, -2.0], [0.93, -2.0], [1, 0]];
const POSY = [[0, 0], [0.15, 0], [0.25, -0.3], [0.92, -0.3], [1, 0]];
const SCL = [[0, 1], [0.1, 1], [0.2, 0.92], [0.9, 0.92], [1, 1.05]];

export default function HouseModel() {
  const r = useRef({}).current;

  const mats = useMemo(() => {
    const std = (color, opts = {}) =>
      new THREE.MeshStandardMaterial({ color, transparent: true, roughness: 0.85, metalness: 0.05, ...opts });
    const wire = (color = "#4A90E2") =>
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true });
    return {
      wallSide: std("#E8E3D8"),
      wallFront: std("#EDE7DC"),
      wallW: wire(),
      roof: std("#232327", { roughness: 0.7 }),
      roofW: wire(),
      trim: std("#17171A"),
      glass: std("#8FC3E8", { roughness: 0.15, metalness: 0.6 }),
      glassSide: std("#8FC3E8", { roughness: 0.15, metalness: 0.6 }),
      door: std("#F5A623", { roughness: 0.5 }),
      slab: std("#3A3A3F"),
      slabW: wire(),
      skeleton: std("#F5A623", { emissive: new THREE.Color("#F5A623"), emissiveIntensity: 0.4, roughness: 0.4 }),
      wood: std("#8A6844"),
      counter: std("#D9D4CC", { roughness: 0.35 }),
      cabinet: std("#40382E"),
      tile: std("#5E8A9C", { roughness: 0.3 }),
      tub: std("#EDEDEA"),
      addWall: std("#E8E3D8"),
      addRoof: std("#232327", { roughness: 0.7 }),
      pergola: std("#7A5A38"),
      steel: std("#2A2A2E", { metalness: 0.6, roughness: 0.4 }),
      concrete: std("#3F3F45"),
      paverA: std("#4A4A52"),
      paverB: std("#55555E"),
      ground: std("#0E0E11", { roughness: 1 }),
    };
  }, []);

  const roofGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.95, 0);
    s.lineTo(2.95, 0);
    s.lineTo(0, 1.45);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 6.7, bevelEnabled: false });
    g.rotateY(Math.PI / 2);
    g.translate(-3.35, 0, 0);
    return g;
  }, []);

  const pavers = useMemo(() => {
    const out = [];
    for (let cx = 0; cx < 4; cx++) {
      for (let rz = 0; rz < 7; rz++) {
        out.push({ x: -1.2 + cx * 0.8, z: 0.5 + rz * 0.6, alt: (cx + rz) % 2 === 0 });
      }
    }
    return out;
  }, []);

  useFrame((state, dt) => {
    const p = clamp01(scrollStore.p);
    const solid = Math.max(scrollStore.intro, seg(p, 0.005, 0.075));
    const shell = pulse(p, 0.125, 0.185, 0.25, 0.295);
    const cut = pulse(p, 0.3, 0.36, 0.415, 0.465);
    const add = pulse(p, 0.475, 0.525, 0.575, 0.615);
    const out = pulse(p, 0.64, 0.69, 0.74, 0.78);
    const conc = pulse(p, 0.805, 0.855, 0.905, 0.945);

    const g = r.root;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, track(p, ROT), 5, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, track(p, POSX), 5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, track(p, POSY), 5, dt);
    const s = THREE.MathUtils.damp(g.scale.x || 1, track(p, SCL), 5, dt);
    g.scale.setScalar(s);

    const sideMul = solid * (1 - shell * 0.85) * (1 - cut * 0.45);
    const frontMul = solid * (1 - shell * 0.85) * (1 - cut * 0.92);
    const roofMul = solid * (1 - shell * 0.8) * (1 - cut * 0.85);

    mats.wallSide.opacity = sideMul;
    mats.glassSide.opacity = 0.55 * sideMul;
    mats.wallFront.opacity = frontMul;
    mats.trim.opacity = frontMul;
    mats.glass.opacity = 0.55 * frontMul;
    mats.door.opacity = frontMul;
    mats.roof.opacity = roofMul;
    mats.wallW.opacity = (1 - solid) * 0.9;
    mats.roofW.opacity = (1 - solid) * 0.9;
    mats.slabW.opacity = (1 - solid) * 0.9;
    mats.slab.opacity = solid * (1 - shell * 0.4);
    mats.skeleton.opacity = shell;

    [r.gFrontL, r.gFrontC, r.gFrontR].forEach((fg) => {
      if (fg) {
        fg.position.y = 1.725 - cut * 3.05;
        fg.position.z = 2.5 + shell * 0.9;
      }
    });
    if (r.gBack) r.gBack.position.z = -2.5 - shell * 0.9;
    if (r.gLeft) r.gLeft.position.x = -3 - shell * 0.9;
    if (r.gRight) r.gRight.position.x = 3 + shell * 0.9;
    if (r.roofGroup) r.roofGroup.position.y = 3.15 + shell * 1.1 + cut * 2.35;
    if (r.skeletonGroup) r.skeletonGroup.visible = shell > 0.004;

    const interiorOn = cut > 0.004;
    if (r.interiorGroup) r.interiorGroup.visible = interiorOn;
    mats.wood.opacity = cut;
    mats.counter.opacity = cut;
    mats.cabinet.opacity = cut;
    mats.tile.opacity = cut;
    mats.tub.opacity = cut;
    if (r.interiorLight) r.interiorLight.intensity = cut * 14;

    const addOn = add > 0.004;
    if (r.additionGroup) {
      r.additionGroup.visible = addOn;
      r.additionGroup.scale.set(
        Math.max(0.001, seg(add, 0, 0.8)),
        Math.max(0.001, seg(add, 0, 0.55)),
        Math.max(0.001, seg(add, 0.15, 1))
      );
    }
    mats.addWall.opacity = add;
    mats.addRoof.opacity = add;

    const outOn = out > 0.004;
    if (r.pergolaGroup) {
      r.pergolaGroup.visible = outOn;
      if (r.pergolaPosts) r.pergolaPosts.scale.y = Math.max(0.001, seg(out, 0, 0.55));
      if (r.pergolaRoof) {
        const rs = Math.max(0.001, seg(out, 0.35, 1));
        r.pergolaRoof.scale.set(rs, 1, rs);
      }
      if (r.bbqGroup) r.bbqGroup.scale.y = Math.max(0.001, seg(out, 0.2, 0.8));
      if (r.patio) {
        const ps = Math.max(0.001, seg(out, 0, 0.45));
        r.patio.scale.set(ps, 1, ps);
      }
    }
    mats.pergola.opacity = out;
    mats.steel.opacity = Math.max(out, conc * 0.0);

    const concOn = conc > 0.004;
    if (r.drivewayGroup) {
      r.drivewayGroup.visible = concOn;
      const cs = Math.max(0.001, seg(conc, 0, 0.7));
      r.drivewayGroup.scale.set(1, 1, cs);
      r.drivewayGroup.position.y = (1 - seg(conc, 0, 0.7)) * -0.05;
    }
    mats.concrete.opacity = Math.max(conc, out);
    mats.paverA.opacity = conc;
    mats.paverB.opacity = conc;
  });

  return (
    <group ref={(el) => (r.root = el)} position={[0, 0, 0]}>
      {/* ground */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.ground}>
        <circleGeometry args={[7.2, 48]} />
      </mesh>
      <gridHelper args={[56, 56, "#26262B", "#141417"]} position={[0, -0.01, 0]} />

      {/* slab */}
      <mesh position={[0, 0.15, 0]} material={mats.slab}>
        <boxGeometry args={[7.6, 0.3, 6.4]} />
      </mesh>
      <mesh position={[0, 0.15, 0]} material={mats.slabW}>
        <boxGeometry args={[7.6, 0.3, 6.4]} />
      </mesh>

      {/* front left wall + window */}
      <group ref={(el) => (r.gFrontL = el)} position={[-1.9, 1.725, 2.5]}>
        <mesh material={mats.wallFront}><boxGeometry args={[2.2, 2.85, 0.15]} /></mesh>
        <mesh material={mats.wallW}><boxGeometry args={[2.2, 2.85, 0.15]} /></mesh>
        <mesh position={[0, 0.2, 0.04]} material={mats.trim}><boxGeometry args={[1.14, 1.24, 0.18]} /></mesh>
        <mesh position={[0, 0.2, 0.06]} material={mats.glass}><boxGeometry args={[1.0, 1.1, 0.18]} /></mesh>
      </group>
      {/* front center wall + door */}
      <group ref={(el) => (r.gFrontC = el)} position={[0, 1.725, 2.5]}>
        <mesh material={mats.wallFront}><boxGeometry args={[1.6, 2.85, 0.15]} /></mesh>
        <mesh material={mats.wallW}><boxGeometry args={[1.6, 2.85, 0.15]} /></mesh>
        <mesh position={[0, -0.36, 0.05]} material={mats.door}><boxGeometry args={[0.95, 2.1, 0.2]} /></mesh>
      </group>
      {/* front right wall + window */}
      <group ref={(el) => (r.gFrontR = el)} position={[1.9, 1.725, 2.5]}>
        <mesh material={mats.wallFront}><boxGeometry args={[2.2, 2.85, 0.15]} /></mesh>
        <mesh material={mats.wallW}><boxGeometry args={[2.2, 2.85, 0.15]} /></mesh>
        <mesh position={[0, 0.2, 0.04]} material={mats.trim}><boxGeometry args={[1.14, 1.24, 0.18]} /></mesh>
        <mesh position={[0, 0.2, 0.06]} material={mats.glass}><boxGeometry args={[1.0, 1.1, 0.18]} /></mesh>
      </group>
      {/* back wall */}
      <group ref={(el) => (r.gBack = el)} position={[0, 1.725, -2.5]}>
        <mesh material={mats.wallSide}><boxGeometry args={[6, 2.85, 0.15]} /></mesh>
        <mesh material={mats.wallW}><boxGeometry args={[6, 2.85, 0.15]} /></mesh>
        <mesh position={[0, 0.2, -0.06]} material={mats.glassSide}><boxGeometry args={[1.6, 1.1, 0.18]} /></mesh>
      </group>
      {/* left wall */}
      <group ref={(el) => (r.gLeft = el)} position={[-3, 1.725, 0]}>
        <mesh material={mats.wallSide}><boxGeometry args={[0.15, 2.85, 5]} /></mesh>
        <mesh material={mats.wallW}><boxGeometry args={[0.15, 2.85, 5]} /></mesh>
        <mesh position={[-0.06, 0.2, 0]} material={mats.glassSide}><boxGeometry args={[0.18, 1.1, 1.3]} /></mesh>
      </group>
      {/* right wall */}
      <group ref={(el) => (r.gRight = el)} position={[3, 1.725, 0]}>
        <mesh material={mats.wallSide}><boxGeometry args={[0.15, 2.85, 5]} /></mesh>
        <mesh material={mats.wallW}><boxGeometry args={[0.15, 2.85, 5]} /></mesh>
        <mesh position={[0.06, 0.2, 0]} material={mats.glassSide}><boxGeometry args={[0.18, 1.1, 1.3]} /></mesh>
      </group>

      {/* roof */}
      <group ref={(el) => (r.roofGroup = el)} position={[0, 3.15, 0]}>
        <mesh geometry={roofGeo} material={mats.roof} />
        <mesh geometry={roofGeo} material={mats.roofW} />
      </group>

      {/* structural skeleton (shell construction) */}
      <group ref={(el) => (r.skeletonGroup = el)} visible={false}>
        {[[-2.85, -2.4], [2.85, -2.4], [-2.85, 2.4], [2.85, 2.4], [-0.95, 2.4], [0.95, 2.4], [-0.95, -2.4], [0.95, -2.4]].map(([x, z], i) => (
          <mesh key={`post-${i}`} position={[x, 1.725, z]} material={mats.skeleton}>
            <boxGeometry args={[0.13, 2.85, 0.13]} />
          </mesh>
        ))}
        <mesh position={[0, 3.22, 2.4]} material={mats.skeleton}><boxGeometry args={[5.9, 0.14, 0.14]} /></mesh>
        <mesh position={[0, 3.22, -2.4]} material={mats.skeleton}><boxGeometry args={[5.9, 0.14, 0.14]} /></mesh>
        <mesh position={[-2.85, 3.22, 0]} material={mats.skeleton}><boxGeometry args={[0.14, 0.14, 5]} /></mesh>
        <mesh position={[2.85, 3.22, 0]} material={mats.skeleton}><boxGeometry args={[0.14, 0.14, 5]} /></mesh>
        <mesh position={[0, 4.5, 0]} material={mats.skeleton}><boxGeometry args={[6.3, 0.14, 0.14]} /></mesh>
        {[-2.4, -1.2, 0, 1.2, 2.4].map((x, i) => (
          <group key={`rafter-${i}`}>
            <mesh position={[x, 3.86, 1.22]} rotation={[0.496, 0, 0]} material={mats.skeleton}>
              <boxGeometry args={[0.11, 0.11, 2.78]} />
            </mesh>
            <mesh position={[x, 3.86, -1.22]} rotation={[-0.496, 0, 0]} material={mats.skeleton}>
              <boxGeometry args={[0.11, 0.11, 2.78]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* interior: kitchen + bathroom (cutaway) */}
      <group ref={(el) => (r.interiorGroup = el)} visible={false}>
        <mesh position={[0, 0.36, 0]} material={mats.wood}><boxGeometry args={[5.7, 0.07, 4.7]} /></mesh>
        <mesh position={[-2.55, 0.78, 0.3]} material={mats.counter}><boxGeometry args={[0.62, 0.9, 3.4]} /></mesh>
        <mesh position={[-2.72, 2.15, 0.3]} material={mats.cabinet}><boxGeometry args={[0.42, 0.85, 2.6]} /></mesh>
        <mesh position={[-0.85, 0.78, 0.4]} material={mats.counter}><boxGeometry args={[1.9, 0.9, 0.95]} /></mesh>
        <mesh position={[-0.85, 0.5, 0.4]} material={mats.cabinet}><boxGeometry args={[1.7, 0.45, 0.8]} /></mesh>
        <mesh position={[1.6, 1.55, -2.28]} material={mats.tile}><boxGeometry args={[2.6, 2.35, 0.08]} /></mesh>
        <mesh position={[1.7, 0.62, -1.55]} material={mats.tub}><boxGeometry args={[1.5, 0.56, 0.78]} /></mesh>
        <mesh position={[2.45, 0.75, -0.4]} material={mats.cabinet}><boxGeometry args={[0.85, 0.85, 0.55]} /></mesh>
        <mesh position={[2.45, 1.2, -0.4]} material={mats.counter}><boxGeometry args={[0.9, 0.06, 0.6]} /></mesh>
        <pointLight ref={(el) => (r.interiorLight = el)} position={[0, 2.3, 0.4]} color="#FFB85C" intensity={0} distance={9} />
      </group>

      {/* addition volume (grows off the right wall) */}
      <group ref={(el) => (r.additionGroup = el)} position={[3.0, 0, -0.3]} visible={false}>
        <mesh position={[1.3, 1.55, 0]} material={mats.addWall}><boxGeometry args={[2.6, 2.5, 3.4]} /></mesh>
        <mesh position={[1.35, 2.86, 0]} material={mats.addRoof}><boxGeometry args={[2.95, 0.16, 3.7]} /></mesh>
        <mesh position={[2.62, 1.5, 0]} material={mats.glassSide}><boxGeometry args={[0.1, 1.4, 2.3]} /></mesh>
      </group>

      {/* backyard: patio, pergola, bbq */}
      <group ref={(el) => (r.pergolaGroup = el)} visible={false}>
        <mesh ref={(el) => (r.patio = el)} position={[0.4, 0.05, -4.4]} material={mats.concrete}>
          <boxGeometry args={[4.8, 0.1, 3.4]} />
        </mesh>
        <group ref={(el) => (r.pergolaPosts = el)} position={[0.4, 0, -4.4]}>
          {[[-1.6, -1.2], [1.6, -1.2], [-1.6, 1.2], [1.6, 1.2]].map(([x, z], i) => (
            <mesh key={`ppost-${i}`} position={[x, 1.3, z]} material={mats.pergola}>
              <boxGeometry args={[0.15, 2.4, 0.15]} />
            </mesh>
          ))}
        </group>
        <group ref={(el) => (r.pergolaRoof = el)} position={[0.4, 0, -4.4]}>
          <mesh position={[0, 2.52, -1.2]} material={mats.pergola}><boxGeometry args={[3.9, 0.16, 0.16]} /></mesh>
          <mesh position={[0, 2.52, 1.2]} material={mats.pergola}><boxGeometry args={[3.9, 0.16, 0.16]} /></mesh>
          {[-1.55, -0.93, -0.31, 0.31, 0.93, 1.55].map((x, i) => (
            <mesh key={`slat-${i}`} position={[x, 2.68, 0]} material={mats.pergola}>
              <boxGeometry args={[0.13, 0.1, 3.0]} />
            </mesh>
          ))}
        </group>
        <group ref={(el) => (r.bbqGroup = el)} position={[-2.3, 0, -4.5]}>
          <mesh position={[0, 0.46, 0]} material={mats.steel}><boxGeometry args={[1.7, 0.86, 0.65]} /></mesh>
          <mesh position={[0, 0.93, 0]} material={mats.concrete}><boxGeometry args={[1.8, 0.08, 0.72]} /></mesh>
          <mesh position={[-0.35, 1.22, 0]} material={mats.steel}><boxGeometry args={[0.75, 0.5, 0.6]} /></mesh>
        </group>
      </group>

      {/* driveway + pavers */}
      <group ref={(el) => (r.drivewayGroup = el)} position={[0, 0, 3.2]} visible={false}>
        <mesh position={[0, 0.04, 2.2]} material={mats.concrete}>
          <boxGeometry args={[3.4, 0.08, 4.4]} />
        </mesh>
        {pavers.map((pv, i) => (
          <mesh key={`paver-${i}`} position={[pv.x, 0.11, pv.z]} material={pv.alt ? mats.paverA : mats.paverB}>
            <boxGeometry args={[0.68, 0.09, 0.5]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
