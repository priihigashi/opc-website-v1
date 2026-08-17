import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "../lib/scrollStore";
import { stuccoTexture, woodSlatTexture, oakFloorTexture, tileTexture, paverTexture, concreteTexture } from "./textures";
import Shell from "./parts/Shell";
import Envelope from "./parts/Envelope";
import Interior from "./parts/Interior";
import Addition from "./parts/Addition";
import Backyard from "./parts/Backyard";
import Driveway from "./parts/Driveway";

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

const ROT = [[0, -0.28], [0.07, 0.08], [0.1, 0.08], [0.19, 0.85], [0.26, 0.85], [0.33, 0.02], [0.4, 0.02], [0.5, -1.38], [0.56, -1.38], [0.66, -3.05], [0.72, -3.05], [0.845, -5.9], [0.9, -5.9], [1, -6.2]];
const POSX = [[0, 1.3], [0.1, 1.3], [0.17, -2.3], [0.27, -2.3], [0.33, 2.3], [0.43, 2.3], [0.5, -2.3], [0.58, -2.3], [0.65, 2.3], [0.74, 2.3], [0.83, -2.0], [0.93, -2.0], [1, 0]];
const POSY = [[0, 0], [0.15, 0], [0.25, -0.3], [0.92, -0.3], [1, 0]];
const SCL = [[0, 0.85], [0.1, 0.85], [0.2, 0.92], [0.9, 0.92], [1, 1.05]];

const BLUEPRINT = new THREE.Color("#5A8FD0");
const LIME = new THREE.Color("#CBCC10");

export default function HouseModel() {
  const r = useRef({}).current;
  const reg = (name) => (el) => {
    r[name] = el;
  };

  // responsive staging: phones center the house, tablets soften the shifts
  const view = useRef({ f: 1, s: 1, y: 0 });
  useEffect(() => {
    const upd = () => {
      const w = window.innerWidth;
      view.current =
        w < 768 ? { f: 0.1, s: 0.56, y: 1.15 } : w < 1100 ? { f: 0.5, s: 0.82, y: 0.5 } : { f: 1, s: 1, y: 0 };
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  const mats = useMemo(() => {
    const std = (color, opts = {}) =>
      new THREE.MeshStandardMaterial({ color, transparent: true, roughness: 0.85, metalness: 0.05, ...opts });
    const tex = {
      stucco: stuccoTexture(),
      slatV: woodSlatTexture(false),
      slatH: woodSlatTexture(true),
      oak: oakFloorTexture(),
      tile: tileTexture(),
      paver: paverTexture(),
      concrete: concreteTexture(),
    };
    const glass = (base) => {
      const m = new THREE.MeshPhysicalMaterial({
        color: "#B9D4E0",
        transparent: true,
        opacity: 0,
        roughness: 0.05,
        metalness: 0.2,
        envMapIntensity: 1.6,
        depthWrite: false,
      });
      m.userData.noCast = true;
      m.userData.base = base;
      return m;
    };
    return {
      shell: new THREE.MeshStandardMaterial({
        color: "#5A8FD0",
        transparent: true,
        opacity: 0.95,
        wireframe: true,
        emissive: new THREE.Color("#5A8FD0"),
        emissiveIntensity: 0.35,
        roughness: 0.5,
      }),
      plinth: new THREE.MeshStandardMaterial({ color: "#3A3A3F", map: tex.concrete, roughness: 0.9 }),
      ground: new THREE.MeshStandardMaterial({ color: "#0E0E11", roughness: 1 }),
      stuccoFront: std("#F2EFE9", { map: tex.stucco, roughness: 0.95 }),
      stuccoSide: std("#EDE9E2", { map: tex.stucco, roughness: 0.95 }),
      woodScreenFront: std("#B07D4E", { map: tex.slatV, roughness: 0.7 }),
      fascia: std("#26262B", { metalness: 0.65, roughness: 0.35 }),
      membrane: std("#5C5C60", { roughness: 0.95 }),
      soffit: std("#A97848", { map: tex.slatH, roughness: 0.7 }),
      frameFront: std("#1D1D20", { metalness: 0.7, roughness: 0.35 }),
      frameSide: std("#1D1D20", { metalness: 0.7, roughness: 0.35 }),
      glassFront: glass(0.45),
      glassSide: glass(0.45),
      doorWood: std("#8A5A30", { map: tex.slatV, roughness: 0.55 }),
      sconce: std("#FFD9A0", { emissive: new THREE.Color("#FFB85C"), emissiveIntensity: 1.6 }),
      floorOak: std("#9C7A52", { map: tex.oak, roughness: 0.5 }),
      ceilWhite: std("#F4F2EC", { roughness: 0.95 }),
      can: std("#FFE3B0", { emissive: new THREE.Color("#FFC97A"), emissiveIntensity: 2.2 }),
      tallDark: std("#33302B", { roughness: 0.5 }),
      cabWood: std("#6E4F30", { map: tex.slatV, roughness: 0.6 }),
      counterStone: std("#D8D3C8", { roughness: 0.25 }),
      pendant: std("#1D1D20", { metalness: 0.6, roughness: 0.4 }),
      stoolSeat: std("#4A4238", { roughness: 0.6 }),
      fabric: std("#B8B2A6", { roughness: 0.95 }),
      tileBath: std("#40626E", { map: tex.tile, roughness: 0.25 }),
      partWhite: std("#F4F2EC", { roughness: 0.95 }),
      showerGlass: (() => {
        const m = new THREE.MeshPhysicalMaterial({ color: "#B9D4E2", transparent: true, opacity: 0, roughness: 0.08, metalness: 0.4, depthWrite: false });
        m.userData.noCast = true;
        return m;
      })(),
      tubWhite: std("#F4F2EC", { roughness: 0.2 }),
      vanityWood: std("#7A5A38", { map: tex.slatV, roughness: 0.6 }),
      mirror: std("#C8D4DA", { metalness: 1, roughness: 0.08 }),
      addStucco: std("#F2EFE9", { map: tex.stucco, roughness: 0.95 }),
      addWood: std("#B07D4E", { map: tex.slatV, roughness: 0.7 }),
      addFascia: std("#26262B", { metalness: 0.65, roughness: 0.35 }),
      addMembrane: std("#5C5C60", { roughness: 0.95 }),
      addSoffit: std("#A97848", { map: tex.slatH, roughness: 0.7 }),
      addFrame: std("#1D1D20", { metalness: 0.7, roughness: 0.35 }),
      addGlass: glass(0.55),
      pergolaWood: std("#6E4F30", { roughness: 0.65 }),
      poolDeck: std("#54545C", { roughness: 0.9 }),
      poolCoping: std("#CFC9BE", { roughness: 0.55 }),
      poolPlaster: std("#3E8E93", { roughness: 0.35 }),
      poolWater: (() => {
        const m = new THREE.MeshPhysicalMaterial({ color: "#2E93A8", transparent: true, opacity: 0, roughness: 0.05, metalness: 0.1, envMapIntensity: 1.8, depthWrite: false });
        m.userData.noCast = true;
        return m;
      })(),
      patioPaver: std("#7A7A80", { map: tex.paver, roughness: 0.9 }),
      patioEdge: std("#54545C", { roughness: 0.9 }),
      bbqSteel: std("#2A2A2E", { metalness: 0.7, roughness: 0.35 }),
      bbqTop: std("#3F3F45", { roughness: 0.4 }),
      driveBase: std("#232327", { roughness: 1 }),
      paverA: std("#55555E", { roughness: 0.95 }),
      paverB: std("#62626B", { roughness: 0.95 }),
      stepStone: std("#8E8E96", { map: tex.concrete, roughness: 0.9 }),
      planter: std("#3A3A3F", { map: tex.concrete, roughness: 0.9 }),
      soil: std("#1A1512", { roughness: 1 }),
      hedge: std("#33482C", { roughness: 1 }),
    };
  }, []);

  useEffect(() => {
    if (!r.root) return;
    r.root.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const m = o.material;
        if (m && !Array.isArray(m) && m.userData.noCast) o.castShadow = false;
      }
    });
  }, []);

  useFrame((state, dt) => {
    const p = clamp01(scrollStore.p);
    const solid = Math.max(scrollStore.intro, seg(p, 0.005, 0.075));
    const shell = pulse(p, 0.125, 0.185, 0.25, 0.295);
    const cut = pulse(p, 0.3, 0.36, 0.415, 0.465);
    const add = pulse(p, 0.43, 0.5, 0.575, 0.615);
    const out = pulse(p, 0.64, 0.69, 0.74, 0.78);
    const conc = pulse(p, 0.805, 0.855, 0.905, 0.945);

    const g = r.root;
    if (!g) return;
    window.__dbg = { p, rotY: g.rotation.y, shellOp: mats.shell.opacity, addVis: !!r.additionGroup && r.additionGroup.visible, addScale: r.additionGroup ? r.additionGroup.scale.x : -1 };
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, track(p, ROT), 5, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, track(p, POSX) * view.current.f, 5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, track(p, POSY) + view.current.y * seg(p, 0.06, 0.14), 5, dt);
    const s = THREE.MathUtils.damp(g.scale.x || 1, track(p, SCL) * view.current.s, 5, dt);
    g.scale.setScalar(s);

    // shell: blueprint wireframe -> lime structural frame
    const shellOp = Math.max((1 - solid) * 0.95, shell);
    mats.shell.opacity = shellOp;
    mats.shell.wireframe = solid < 0.6 && shell < 0.5;
    mats.shell.color.lerpColors(BLUEPRINT, LIME, shell);
    mats.shell.emissive.copy(mats.shell.color).multiplyScalar(0.3);
    if (r.shellGroup) r.shellGroup.visible = shellOp > 0.004;

    // exterior finishes
    const frontMul = solid * (1 - shell * 0.85) * (1 - cut * 0.94);
    const sideMul = solid * (1 - shell * 0.85) * (1 - cut * 0.4);
    const roofMul = solid * (1 - shell * 0.8) * (1 - cut * 0.85);
    mats.stuccoFront.opacity = frontMul;
    mats.woodScreenFront.opacity = frontMul;
    mats.doorWood.opacity = frontMul;
    mats.sconce.opacity = frontMul;
    mats.frameFront.opacity = frontMul;
    mats.glassFront.opacity = frontMul * mats.glassFront.userData.base;
    mats.stuccoSide.opacity = sideMul;
    mats.frameSide.opacity = sideMul;
    mats.glassSide.opacity = sideMul * mats.glassSide.userData.base;
    mats.fascia.opacity = roofMul;
    mats.membrane.opacity = roofMul;
    mats.soffit.opacity = roofMul;

    const setPos = (k, x, y, z) => {
      if (r[k]) r[k].position.set(x, y, z);
    };
    setPos("finFrontA", -3.5, 0.5 - cut * 4.7, 3 + shell * 1.2);
    setPos("finFrontB", 0, 0.5 - cut * 4.5, 2.5 + shell * 1.2);
    setPos("finBackA", -3.5, 0.5, -3 - shell * 1.2);
    setPos("finBackB", 0, 0.5, -2.5 - shell * 1.2);
    setPos("finWestA", -6 - shell * 1.2, 0.5, 0);
    setPos("finEastA", shell * 1.2, 0, 0);
    setPos("finEastB", 6 + shell * 1.2, 0.5, 0);
    setPos("finRoofA", 0, shell * 1.6 + cut * 3.4, 0);
    setPos("finRoofB", 0, shell * 1.3 + cut * 2.8, 0);

    // interior
    const inMul = Math.max(cut, seg(solid, 0.7, 1));
    [mats.floorOak, mats.ceilWhite, mats.can, mats.tallDark, mats.cabWood, mats.counterStone, mats.pendant,
     mats.stoolSeat, mats.fabric, mats.tubWhite, mats.vanityWood, mats.mirror].forEach((m) => {
      m.opacity = inMul;
    });
    // bathroom partitions fade away during the cutaway
    mats.tileBath.opacity = inMul * (1 - cut * 0.88);
    mats.partWhite.opacity = inMul * (1 - cut * 0.88);
    mats.showerGlass.opacity = inMul * 0.32;
    if (r.interiorGroup) r.interiorGroup.visible = inMul > 0.004;
    if (r.interiorLight) r.interiorLight.intensity = cut * 30;
    if (r.bathLight) r.bathLight.intensity = cut * 12;

    // addition
    const addOn = add > 0.004;
    if (r.additionGroup) {
      r.additionGroup.visible = addOn;
      r.additionGroup.scale.set(
        Math.max(0.001, seg(add, 0, 0.8)),
        Math.max(0.001, seg(add, 0, 0.55)),
        Math.max(0.001, seg(add, 0.15, 1))
      );
    }
    mats.addStucco.opacity = add;
    mats.addWood.opacity = add;
    mats.addFascia.opacity = add;
    mats.addMembrane.opacity = add;
    mats.addSoffit.opacity = add;
    mats.addFrame.opacity = add;
    mats.addGlass.opacity = add * mats.addGlass.userData.base;

    // backyard
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
    mats.pergolaWood.opacity = out;
    mats.patioPaver.opacity = out;
    mats.patioEdge.opacity = out;
    mats.bbqSteel.opacity = out;
    mats.bbqTop.opacity = out;
    // lap pool: deck and basin first, then the water fills
    mats.poolDeck.opacity = seg(out, 0, 0.4);
    mats.poolCoping.opacity = seg(out, 0.1, 0.5);
    mats.poolPlaster.opacity = seg(out, 0.1, 0.5);
    mats.poolWater.opacity = seg(out, 0.35, 0.95) * 0.8;
    if (r.poolWater) r.poolWater.position.y = 0.26 + seg(out, 0.35, 0.95) * 0.3;

    // driveway
    const concOn = conc > 0.004;
    if (r.drivewayGroup) {
      r.drivewayGroup.visible = concOn;
      const cs = Math.max(0.001, seg(conc, 0, 0.7));
      r.drivewayGroup.scale.set(1, 1, cs);
      r.drivewayGroup.position.y = (1 - seg(conc, 0, 0.7)) * -0.05;
    }
    mats.driveBase.opacity = conc;
    mats.paverA.opacity = conc;
    mats.paverB.opacity = conc;
    mats.stepStone.opacity = conc;
    mats.planter.opacity = conc;
    mats.soil.opacity = conc;
    mats.hedge.opacity = conc;
  });

  return (
    <group ref={reg("root")}>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.ground} receiveShadow>
        <circleGeometry args={[9.5, 64]} />
      </mesh>
      <gridHelper args={[64, 64, "#26262B", "#141417"]} position={[0, -0.01, 0]} />
      <group scale={0.62}>
        <mesh position={[0.75, 0.25, 0]} material={mats.plinth}>
          <boxGeometry args={[14.5, 0.5, 8.5]} />
        </mesh>
        <Shell mats={mats} reg={reg} />
        <Envelope mats={mats} reg={reg} />
        <Interior mats={mats} reg={reg} />
        <Addition mats={mats} reg={reg} />
        <Backyard mats={mats} reg={reg} />
        <Driveway mats={mats} reg={reg} />
      </group>
    </group>
  );
}
