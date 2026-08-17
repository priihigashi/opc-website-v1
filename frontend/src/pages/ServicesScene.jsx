import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import * as THREE from "three";
import { stuccoTexture, woodSlatTexture, oakFloorTexture, tileTexture, paverTexture } from "../three/textures";
import { servicesCtx as ctx } from "./servicesStore";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const sstep = (v) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const seg = (p, a, b) => sstep((p - a) / (b - a));

const LIME = new THREE.Color("#CBCC10");
const BLUE = new THREE.Color("#5A8FD0");

function ResidenceGLB({ model }) {
  const nodes = useRef({});
  const mats = useRef({});
  const root = useRef();
  const glow = useRef(0);

  useEffect(() => {
    if (!model) return;
    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
          mats.current[m.name] = m;
          if (m.userData.noCast || m.name?.includes("glass")) o.castShadow = false;
        });
      }
    });
    ["site", "shell", "finFrontA", "finFrontB", "finBackA", "finBackB", "finWestA", "finEastA", "finEastB",
      "roofA", "roofB", "interior", "ceilPavilion", "ceilA", "ceilUpper", "kitchen", "bathroom", "bathroom-upstairs", "bedroom", "addition", "patio",
      "pergolaPosts", "pergolaRoof", "bbq", "driveway-pavers", "pool", "poolWaterMesh"].forEach((n) => {
      const node = model.getObjectByName(n);
      if (node) nodes.current[n] = node;
    });
    const tex = {
      stucco: stuccoTexture(), slatV: woodSlatTexture(false), slatH: woodSlatTexture(true),
      oak: oakFloorTexture(), tile: tileTexture(), paver: paverTexture(),
    };
    const texFor = {
      stuccoFront: tex.stucco, stuccoSide: tex.stucco, addStucco: tex.stucco,
      woodScreen: tex.slatV, addWood: tex.slatV, doorWood: tex.slatV, cabWood: tex.slatV, vanityWood: tex.slatV,
      soffit: tex.slatH, addSoffit: tex.slatH, floorOak: tex.oak, tileBath: tex.tile, patioPaver: tex.paver,
    };
    Object.entries(texFor).forEach(([name, map]) => {
      const m = mats.current[name];
      if (m) {
        m.map = map;
        m.needsUpdate = true;
      }
    });
    ["glassFront", "glassSide", "addGlass"].forEach((n) => {
      if (mats.current[n]) mats.current[n].envMapIntensity = 1.6;
    });
    nodes.current["addition"].visible = false;
    nodes.current["pergolaPosts"].parent.visible = false;
    nodes.current["driveway-pavers"].visible = false;
    nodes.current["shell"].visible = false;
  }, [model]);

  useFrame((state, dt) => {
    const N = nodes.current;
    const M = mats.current;
    if (!N.finFrontA || !M.stuccoFront || !root.current) return;
    ctx.t = THREE.MathUtils.damp(ctx.t, ctx.tTarget, 10, dt);
    const t = sstep(ctx.t);
    const svc = ctx.svc;
    const kind = svc?.kind;
    const hov = ctx.hover;

    const cut = kind === "cut" ? t : 0;
    const peel = kind === "peel" ? t : 0;
    const dip = kind === "reno" ? Math.sin(t * Math.PI) : 0;
    const finBuild = kind === "build" ? (t < 0.15 ? 1 - t / 0.15 : seg(t, 0.55, 1)) : 1;
    const shellBuild = kind === "build" ? seg(t, 0.15, 0.55) * (1 - seg(t, 0.85, 1)) : 0;

    const add = Math.max(kind === "add" ? t : 0, hov === "additions" && !svc ? 0.14 : 0);
    const out = Math.max(kind === "out" ? t : 0, hov === "outdoor-living" && !svc ? 0.14 : 0);
    const conc = Math.max(kind === "conc" ? t : 0, hov === "concrete-pavers" && !svc ? 0.14 : 0);

    const idle = svc ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.03;
    const rotTarget = (svc ? svc.rot : 0.3) + idle;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, rotTarget, 3.2, dt);

    const frontMul = Math.max(0, (1 - peel * 0.85) * (1 - cut * 0.985) * (1 - dip * 0.88) * finBuild);
    const sideMul = Math.max(0, (1 - peel * 0.85) * (1 - cut * 0.4) * (1 - dip * 0.88) * finBuild);
    const roofMul = Math.max(0, (1 - peel * 0.8) * (1 - cut * 0.85) * (1 - dip * 0.88) * finBuild);
    const setOp = (name, v) => {
      const m = M[name];
      if (m) m.opacity = v;
    };
    setOp("stuccoFront", frontMul);
    setOp("woodScreen", frontMul);
    setOp("doorWood", frontMul);
    setOp("sconce", frontMul);
    setOp("frameFront", frontMul);
    setOp("glassFront", frontMul * 0.4);
    setOp("glassFrost", frontMul * 0.62);
    setOp("curtain", frontMul * 0.92);
    setOp("stuccoSide", sideMul);
    setOp("frameSide", sideMul);
    setOp("glassSide", sideMul * 0.4);
    setOp("fascia", roofMul);
    setOp("membrane", roofMul);
    setOp("soffit", roofMul);

    N.finFrontA.position.y = 0.5 - cut * 5.35;
    N.finFrontA.position.z = 3 + peel * 1.2;
    N.finFrontB.position.y = 0.5 - cut * 5.0;
    N.finFrontB.position.z = 2.5 + peel * 1.2;
    N.finBackA.position.z = -3 - peel * 1.2;
    N.finBackB.position.z = -2.5 - peel * 1.2;
    N.finWestA.position.x = -6 - peel * 1.2;
    N.finEastA.position.x = peel * 1.2;
    N.finEastB.position.x = 6 + peel * 1.2;
    N.roofA.position.y = peel * 1.5 + cut * 3.1;
    N.roofB.position.y = peel * 1.2 + cut * 2.6;
    if (N.ceilPavilion) N.ceilPavilion.position.y = 3.78 + cut * 2.62;
    if (N.ceilA) N.ceilA.position.y = 3.33 + cut * 5.62;
    if (N.ceilUpper) N.ceilUpper.position.y = 5.52 + cut * 3.66;

    const shellOp = Math.max(peel, dip * 0.9, shellBuild);
    N.shell.visible = shellOp > 0.004;
    if (M.shellMat) {
      M.shellMat.opacity = Math.max(0.001, shellOp);
      M.shellMat.wireframe = peel < 0.5;
      M.shellMat.color.lerpColors(BLUE, LIME, Math.max(peel, shellBuild));
      M.shellMat.emissive.copy(M.shellMat.color).multiplyScalar(0.35);
    }

    if (ctx.lightRef.current) ctx.lightRef.current.intensity = 2.5 + cut * 24 + dip * 6;

    N.addition.visible = add > 0.004;
    N.addition.scale.set(Math.max(0.001, seg(add, 0.15, 0.85)), Math.max(0.001, seg(add, 0.15, 0.6)), Math.max(0.001, seg(add, 0.3, 1)));
    setOp("addStucco", add);
    setOp("addWood", add);
    setOp("addFascia", add);
    setOp("addMembrane", add);
    setOp("addSoffit", add);
    setOp("addFrame", add);
    setOp("addGlass", add * 0.55);
    if (ctx.traceRef.current) {
      ctx.traceRef.current.visible = kind === "add" && t > 0.004;
      const ts = Math.max(0.001, seg(t, 0, 0.35));
      ctx.traceRef.current.scale.set(ts, 1, ts);
      ctx.traceRef.current.children.forEach((m) => (m.material.opacity = (1 - seg(t, 0.75, 1)) * 0.9));
    }

    const pergola = N.pergolaPosts.parent;
    pergola.visible = out > 0.004;
    N.pergolaPosts.scale.y = Math.max(0.001, seg(out, 0, 0.55));
    const rs = Math.max(0.001, seg(out, 0.35, 1));
    N.pergolaRoof.scale.set(rs, 1, rs);
    N.bbq.scale.y = Math.max(0.001, seg(out, 0.2, 0.8));
    const ps = Math.max(0.001, seg(out, 0, 0.45));
    N.patio.scale.set(ps, 1, ps);
    setOp("pergolaWood", out);
    setOp("patioPaver", out);
    setOp("patioEdge", out);
    setOp("bbqSteel", out);
    setOp("bbqTop", out);
    setOp("poolDeck", seg(out, 0, 0.3));
    setOp("poolCoping", seg(out, 0.05, 0.35));
    setOp("poolPlaster", seg(out, 0, 0.3));
    setOp("poolWater", seg(out, 0.25, 0.85) * 0.85);
    if (N.poolWaterMesh) N.poolWaterMesh.position.y = 0.12 + seg(out, 0.25, 0.85) * 0.3;

    // bathroom partitions fade during the cutaway
    setOp("tileBath", 1 - cut * 0.88);
    setOp("partWhite", 1 - cut * 0.88);
    setOp("showerGlass", 0.32);

    N["driveway-pavers"].visible = conc > 0.004;
    N["driveway-pavers"].scale.z = Math.max(0.001, seg(conc, 0, 0.7));
    setOp("driveBase", conc);
    setOp("paverA", conc);
    setOp("paverB", conc);
    setOp("stepStone", conc);
    setOp("planter", conc);
    setOp("soil", conc);
    setOp("hedge", conc);

    glow.current = THREE.MathUtils.damp(glow.current, hov && !svc ? 1 : 0, 6, dt);
    const g2 = glow.current * (0.22 + Math.sin(state.clock.elapsedTime * 5) * 0.08);
    const zoneMats = {
      kitchen: ["cabWood", "counterStone", "tallDark"],
      bathroom: ["tileBath", "tubWhite", "vanityWood"],
      "full-renovation": ["stuccoFront", "stuccoSide"],
    };
    Object.entries(zoneMats).forEach(([slug, names]) => {
      const on = hov === slug && !svc ? g2 : 0;
      names.forEach((n) => {
        const m = M[n];
        if (m) {
          m.emissive.copy(LIME);
          m.emissiveIntensity = on;
        }
      });
    });
  });

  if (!model) return null;
  return (
    <group ref={root} scale={0.62}>
      <primitive object={model} />
      <pointLight ref={ctx.lightRef} position={[2.2, 2.9, 0.4]} color="#FFB85C" intensity={2.5} distance={11} />
      <group ref={ctx.traceRef} visible={false} position={[7.7, 0.56, 0.5]}>
        {[0, 1, 2, 3].map((i) => {
          const horiz = i < 2;
          const m = new THREE.MeshBasicMaterial({ color: "#CBCC10", transparent: true, opacity: 0.9 });
          return (
            <mesh key={i} material={m} position={[horiz ? 0 : i === 2 ? -1.95 : 1.95, 0, horiz ? (i === 0 ? -1.95 : 1.95) : 0]}>
              <boxGeometry args={horiz ? [3.9, 0.03, 0.05] : [0.05, 0.03, 3.9]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default function ServicesScene() {
  const { pathname } = useLocation();
  const [mounted, setMounted] = React.useState(false);
  const [model, setModel] = React.useState(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let on = true;
    new GLTFLoader().load(
      "/models/residence.glb?v=14",
      (g) => on && setModel(g.scene),
      undefined,
      () => on && setModel(null)
    );
    return () => {
      on = false;
    };
  }, []);

  // returning to the selector restores the original house
  useEffect(() => {
    if (pathname === "/services") {
      ctx.active = null;
      ctx.svc = null;
      ctx.tTarget = 0;
    }
  }, [pathname]);

  return (
    <div className="fixed inset-0 z-0" data-testid="services-scene" aria-hidden>
      {mounted && (
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ fov: 36, position: [8.8, 4.8, 11] }}
          gl={{ antialias: true }}
          onCreated={({ camera }) => {
            camera.lookAt(0, 1.1, 0);
            window.__cam = camera;
          }}
        >
          <color attach="background" args={["#09090B"]} />
          <fog attach="fog" args={["#09090B", 18, 38]} />
          <ambientLight intensity={0.35} />
          <directionalLight
            castShadow
            position={[10, 14, 9]}
            intensity={2.2}
            color="#FFF2DF"
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-bias={-0.0004}
            shadow-normalBias={0.03}
          />
          <directionalLight position={[-8, 6, -7]} intensity={0.5} color="#8FB8E8" />
          <Environment files="/hdr/city_1k.hdr" />
          <ResidenceGLB model={model} />
          <ContactShadows position={[0, 0.02, 0]} opacity={0.45} scale={30} blur={2.4} far={9} />
          <EffectComposer multisampling={0}>
            <N8AO halfRes intensity={2.2} aoRadius={1.4} distanceFalloff={2.2} quality="performance" />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
}
