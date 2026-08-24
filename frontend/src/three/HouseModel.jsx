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
import LandscapeV1 from "./parts/LandscapeV1";

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
const SHELL_CONCRETE = new THREE.Color("#98938A");

export default function HouseModel({
  DrivewayComponent = Driveway,
  BackyardComponent = Backyard,
  AdditionComponent = Addition,
  EnvelopeComponent = Envelope,
  InteriorComponent = Interior,
  LandscapeComponent = LandscapeV1,
  envelopeProps,
  rotationTrack = ROT,
  positionXTrack = POSX,
  positionYTrack = POSY,
  scaleTrack = SCL,
  viewConfig,
  materialConfig = {},
  previewStore = null,
  scopedRoomHighlights = false,
}) {
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
        w < 768
          ? (viewConfig?.phone || { f: 0.04, s: 0.5, y: 1.1 })
          : w < 1100
            ? (viewConfig?.tablet || { f: 0.32, s: 0.68, y: 0.45 })
            : (viewConfig?.desktop || { f: 1, s: 1, y: 0 });
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, [viewConfig]);

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
    const frosted = () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: "#D4E2E6",
        transparent: true,
        opacity: 0,
        roughness: 0.78,
        metalness: 0.05,
        envMapIntensity: 0.7,
        depthWrite: false,
      });
      m.userData.noCast = true;
      m.userData.base = 0.62;
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
        depthWrite: false,
      }),
      // T-230: CBS wall piers / slabs of the structural shell. Lerps blueprint ->
      // concrete grey so the lime (mats.shell) is reserved for active structural
      // members (columns, tie beams, headers) and never a full facade slab.
      shellConcrete: new THREE.MeshStandardMaterial({
        color: "#5A8FD0",
        transparent: true,
        opacity: 0.95,
        wireframe: true,
        emissive: new THREE.Color("#5A8FD0"),
        emissiveIntensity: 0.2,
        roughness: 0.85,
        depthWrite: false,
      }),
      plinth: new THREE.MeshStandardMaterial({ color: "#262421", map: tex.concrete, roughness: 0.82 }),
      ground: new THREE.MeshStandardMaterial({ color: "#020202", roughness: 1 }),
      stuccoFront: std(materialConfig.stuccoFront || "#F0EBE3", {
        map: tex.stucco,
        roughness: 0.84,
      }),
      stuccoSide: std(materialConfig.stuccoSide || "#F0EBE3", {
        map: tex.stucco,
        roughness: 0.86,
      }),
      woodScreenFront: std("#9A6035", { map: tex.slatV, roughness: 0.62 }),
      fascia: std("#26262B", { metalness: 0.65, roughness: 0.35 }),
      membrane: std("#5C5C60", { roughness: 0.95 }),
      soffit: std("#A97848", { map: tex.slatH, roughness: 0.7 }),
      frameFront: std("#17171A", { metalness: 0.76, roughness: 0.28 }),
      frameSide: std("#17171A", { metalness: 0.76, roughness: 0.28 }),
      glassFront: glass(0.45),
      glassSide: glass(0.45),
      glassFrost: frosted(),
      curtain: std("#E9E6DE", { roughness: 1 }),
      doorWood: std("#7B4726", { map: tex.slatV, roughness: 0.5 }),
      sconce: std("#FFD9A0", { emissive: new THREE.Color("#FFB85C"), emissiveIntensity: 1.6 }),
      floorOak: std("#A37C52", { map: tex.oak, roughness: 0.42 }),
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
      // T-263: modern architectural concrete pergola members (open canopy).
      pergolaConcrete: std("#A8A49C", { map: tex.concrete, roughness: 0.88 }),
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
      foliage: std("#263E27", { roughness: 0.92 }),
      foliageLight: std("#3E6038", { roughness: 0.9 }),
      palmTrunk: std("#6A5137", { roughness: 0.95 }),
      mulch: std("#302219", { bumpMap: tex.concrete, bumpScale: 0.05, roughness: 1 }),
      brass: std("#A8844A", { metalness: 0.76, roughness: 0.3 }),
    };
  }, [materialConfig.stuccoFront, materialConfig.stuccoSide]);

  useEffect(() => {
    if (!r.root) return;
    r.root.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = !o.userData.noCast;
        o.receiveShadow = !o.userData.noReceive;
        const m = o.material;
        if (m && !Array.isArray(m) && m.userData.noCast) o.castShadow = false;
      }
    });
  }, [r]);

  useEffect(() => {
    if (!scopedRoomHighlights || !r.interiorGroup) return undefined;

    const originals = [];
    const scoped = { kitchen: [], bathroom: [] };
    const roomMaterials = { kitchen: new Map(), bathroom: new Map() };

    const roomFor = (mesh) => {
      let node = mesh.parent;
      while (node && node !== r.interiorGroup) {
        if (node.name === "bathroom-upstairs") return "bathroom";
        if (node.name === "kitchen") {
          // The legacy interior nests lounge furniture inside the kitchen group.
          // Its meshes sit to the right of the actual kitchen work zone.
          return mesh.position.x < 3.2 ? "kitchen" : null;
        }
        node = node.parent;
      }
      return null;
    };

    r.interiorGroup.traverse((mesh) => {
      if (!mesh.isMesh || Array.isArray(mesh.material)) return;
      const room = roomFor(mesh);
      if (!room) return;

      const source = mesh.material;
      let local = roomMaterials[room].get(source);
      if (!local) {
        local = source.clone();
        local.userData = { ...source.userData, serviceRoomHighlight: room };
        roomMaterials[room].set(source, local);
        scoped[room].push({ local, source });
      }
      originals.push({ mesh, source });
      mesh.material = local;
    });

    r.scopedHighlightMaterials = scoped;
    return () => {
      originals.forEach(({ mesh, source }) => { mesh.material = source; });
      Object.values(scoped).flat().forEach(({ local }) => local.dispose());
      r.scopedHighlightMaterials = null;
    };
  }, [r, scopedRoomHighlights]);

  useFrame((state, dt) => {
    const p = clamp01(scrollStore.p);
    const preview = previewStore?.active ? previewStore : null;
    const previewT = preview ? sstep(preview.t) : 0;
    const reveal = preview ? seg(previewT, 0.02, 0.58) : 0;
    const buildShell = preview?.kind === "build"
      ? seg(previewT, 0.1, 0.38) * (1 - seg(previewT, 0.58, 0.82))
      : 0;
    const buildFinish = preview?.kind === "build"
      ? Math.max(0.04, 1 - seg(previewT, 0.04, 0.3), seg(previewT, 0.56, 0.82))
      : 1;
    const solid = preview ? 1 : Math.max(scrollStore.intro, seg(p, 0.005, 0.075));
    // T-258/T-261 choreography: each state's retract may begin only AFTER the
    // chapter's panel has exited and the completed state has held alone
    // (solo-hold ends: ch01 0.260, ch02 0.415, ch03 0.575, ch04 0.745, ch05 0.910).
    const shell = preview
      ? preview.kind === "shell" ? reveal : buildShell
      : pulse(p, 0.125, 0.185, 0.262, 0.3);
    const cut = preview
      ? ["renovation", "kitchen", "bathroom"].includes(preview.kind) ? reveal : 0
      : pulse(p, 0.3, 0.36, 0.415, 0.465);
    const add = preview ? preview.kind === "addition" ? reveal : 0 : pulse(p, 0.43, 0.5, 0.575, 0.615);
    const out = preview ? preview.kind === "outdoor" ? reveal : 0 : pulse(p, 0.64, 0.69, 0.747, 0.787);
    const conc = preview ? preview.kind === "concrete" ? reveal : 0 : pulse(p, 0.805, 0.855, 0.912, 0.948);

    const g = r.root;
    if (!g) return;
    window.__dbg = {
      p,
      previewKind: preview?.kind || null,
      previewT,
      reveal,
      shell,
      cut,
      add,
      out,
      conc,
      rotY: g.rotation.y,
      shellOp: mats.shell.opacity,
      addVis: !!r.additionGroup && r.additionGroup.visible,
      addScale: r.additionGroup ? r.additionGroup.scale.x : -1,
    };
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, track(p, rotationTrack), 5, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, track(p, positionXTrack) * view.current.f, 5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, track(p, positionYTrack) + view.current.y * seg(p, 0.06, 0.14), 5, dt);
    const s = THREE.MathUtils.damp(g.scale.x || 1, track(p, scaleTrack) * view.current.s, 5, dt);
    g.scale.setScalar(s);

    // shell: blueprint wireframe -> lime members + concrete bones (T-230)
    const shellOp = Math.max((1 - solid) * 0.95, shell);
    mats.shell.opacity = shellOp;
    mats.shell.wireframe = solid < 0.6 && shell < 0.5;
    mats.shell.color.lerpColors(BLUEPRINT, LIME, shell);
    mats.shell.emissive.copy(mats.shell.color).multiplyScalar(0.3);
    mats.shellConcrete.opacity = shellOp;
    mats.shellConcrete.wireframe = solid < 0.6 && shell < 0.5;
    mats.shellConcrete.color.lerpColors(BLUEPRINT, SHELL_CONCRETE, shell);
    mats.shellConcrete.emissive.copy(mats.shellConcrete.color).multiplyScalar(0.12);
    if (r.shellGroup) r.shellGroup.visible = shellOp > 0.004;

    // exterior finishes
    const frontMul = solid * (1 - shell * 0.985) * (1 - cut * 0.985) * buildFinish;
    const sideMul = solid * (1 - shell * 0.985) * (1 - cut * 0.4) * buildFinish;
    const roofMul = solid * (1 - shell * 0.8) * (1 - cut * 0.85) * buildFinish;
    mats.stuccoFront.opacity = frontMul;
    mats.woodScreenFront.opacity = frontMul;
    mats.doorWood.opacity = frontMul;
    mats.sconce.opacity = frontMul;
    mats.frameFront.opacity = frontMul;
    mats.glassFront.opacity = frontMul * mats.glassFront.userData.base;
    mats.glassFrost.opacity = frontMul * mats.glassFrost.userData.base;
    mats.curtain.opacity = frontMul * 0.92;
    mats.stuccoSide.opacity = sideMul;
    mats.frameSide.opacity = sideMul;
    mats.glassSide.opacity = sideMul * mats.glassSide.userData.base;
    mats.fascia.opacity = roofMul;
    mats.membrane.opacity = roofMul;
    mats.soffit.opacity = roofMul;

    const setPos = (k, x, y, z) => {
      if (r[k]) r[k].position.set(x, y, z);
    };
    setPos("finFrontA", -3.5, 0.5 - cut * 5.35, 3 + shell * 1.2);
    setPos("finFrontB", 0, 0.5 - cut * 5.0, 2.5 + shell * 1.2);
    setPos("finBackA", -3.5, 0.5, -3 - shell * 1.2);
    setPos("finBackB", 0, 0.5, -2.5 - shell * 1.2);
    setPos("finWestA", -6 - shell * 1.2, 0.5, 0);
    setPos("finEastA", shell * 1.2, 0, 0);
    setPos("finEastB", 6 + shell * 1.2, 0.5, 0);
    setPos("finRoofA", 0, shell * 1.6 + cut * 3.4, 0);
    setPos("finRoofB", 0, shell * 1.3 + cut * 2.8, 0);
    // ceilings rise as separated layers during the cutaway, staying just below their roof planes
    if (r.ceilPavilion) r.ceilPavilion.position.y = 3.78 + cut * 2.62;
    if (r.ceilA) r.ceilA.position.y = 3.33 + cut * 5.62;
    if (r.ceilUpper) r.ceilUpper.position.y = 5.52 + cut * 3.66;

    // interior
    const inMul = Math.max(cut, seg(solid, 0.7, 1));
    [mats.floorOak, mats.ceilWhite, mats.can, mats.tallDark, mats.cabWood, mats.counterStone, mats.pendant,
     mats.stoolSeat, mats.fabric, mats.tubWhite, mats.vanityWood, mats.mirror].forEach((m) => {
      m.opacity = inMul;
    });
    // bathroom partitions fade away during the cutaway
    mats.tileBath.opacity = inMul * (1 - cut * 0.88);
    mats.partWhite.opacity = inMul * (1 - cut * 0.88);
    mats.showerGlass.opacity = inMul * 0.5;
    if (r.scopedHighlightMaterials) {
      Object.values(r.scopedHighlightMaterials).flat().forEach(({ local, source }) => {
        local.opacity = source.opacity;
        local.transparent = source.transparent;
      });
    }
    if (r.interiorGroup) r.interiorGroup.visible = inMul > 0.004;
    if (r.interiorLight) r.interiorLight.intensity = cut * 20;
    if (r.bathLight) r.bathLight.intensity = cut * 5.5;

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
    mats.pergolaConcrete.opacity = out;
    mats.patioPaver.opacity = out;
    mats.patioEdge.opacity = out;
    mats.bbqSteel.opacity = out;
    mats.bbqTop.opacity = out;
    // lap pool: basin + coping first, water fills while the pergola rises
    mats.poolDeck.opacity = seg(out, 0, 0.3);
    mats.poolCoping.opacity = seg(out, 0.05, 0.35);
    mats.poolPlaster.opacity = seg(out, 0, 0.3);
    mats.poolWater.opacity = seg(out, 0.25, 0.85) * 0.85;
    if (r.poolWater) r.poolWater.position.y = 0.12 + seg(out, 0.25, 0.85) * 0.3;

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

    // Services selector: emphasize only the chosen room. Full renovation gets
    // a restrained whole-house lime pulse after the complete cutaway opens.
    const highlightRamp = preview ? seg(previewT, 0.42, 0.68) : 0;
    const highlightPulse = highlightRamp * (0.7 + Math.sin(state.clock.elapsedTime * 5.5) * 0.16);
    const scopedKitchen = r.scopedHighlightMaterials?.kitchen?.map(({ local }) => local) || [];
    const scopedBathroom = r.scopedHighlightMaterials?.bathroom?.map(({ local }) => local) || [];
    const highlightGroups = scopedRoomHighlights
      ? {
          renovation: [mats.stuccoFront, mats.stuccoSide, mats.floorOak, mats.cabWood, mats.tileBath, mats.vanityWood, ...scopedKitchen, ...scopedBathroom],
          kitchen: scopedKitchen,
          bathroom: scopedBathroom,
        }
      : {
          renovation: [mats.stuccoFront, mats.stuccoSide, mats.floorOak, mats.cabWood, mats.tileBath, mats.vanityWood],
          kitchen: [mats.cabWood, mats.counterStone, mats.tallDark],
          bathroom: [mats.tileBath, mats.tubWhite, mats.vanityWood],
        };
    Object.entries(highlightGroups).forEach(([kind, materials]) => {
      const intensity = preview?.kind === kind ? highlightPulse * (kind === "renovation" ? 0.34 : 0.72) : 0;
      materials.forEach((material) => {
        material.emissive.copy(LIME);
        material.emissiveIntensity = intensity;
      });
    });
    if (preview && r.interiorLight) {
      const wholeHouseLift = preview.kind === "renovation" ? highlightRamp * 7 : 0;
      r.interiorLight.intensity = cut * 20 + wholeHouseLift;
    }
    mats.foliage.opacity = solid * 0.92;
    mats.foliageLight.opacity = solid * 0.92;
    mats.palmTrunk.opacity = solid;
    mats.mulch.opacity = solid;
  });

  return (
    <group ref={reg("root")}>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.ground} receiveShadow>
        <circleGeometry args={[9.5, 64]} />
      </mesh>
      <gridHelper args={[64, 64, "#302D29", "#171513"]} position={[0, -0.01, 0]} material-transparent material-opacity={0.22} />
      <group scale={0.62}>
        <mesh position={[1.85, 0.25, 0]} material={mats.plinth}>
          <boxGeometry args={[16.7, 0.5, 8.5]} />
        </mesh>
        <Shell mats={mats} reg={reg} />
        <EnvelopeComponent mats={mats} reg={reg} {...envelopeProps} />
        <InteriorComponent mats={mats} reg={reg} />
        <AdditionComponent mats={mats} reg={reg} />
        <BackyardComponent mats={mats} reg={reg} />
        <DrivewayComponent mats={mats} reg={reg} />
        <LandscapeComponent mats={mats} reg={reg} />
      </group>
    </group>
  );
}
