import { Suspense, Component, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import * as THREE from "three";
import HouseModel from "./HouseModel";

class EnvBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const PH = "https://dl.polyhaven.org/file/ph-assets/Textures/png/1k";

function prepTexture(texture, { repeat = [1, 1], srgb = false, rotation = 0, anisotropy = 8 } = {}) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.center.set(0.5, 0.5);
  texture.rotation = rotation;
  texture.anisotropy = anisotropy;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function RealismTuner() {
  const { scene, gl, size } = useThree();
  const mobile = size.width < 768;
  const tablet = size.width >= 768 && size.width < 1100;

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = mobile ? 0.62 : tablet ? 0.72 : 0.79;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl, mobile, tablet]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const maxAniso = Math.min(12, gl.capabilities.getMaxAnisotropy?.() || 8);

    // CC0 photo-scanned PBR maps from Poly Haven, kept at 1K for mobile/web performance.
    const stucco = {
      diff: prepTexture(loader.load(`${PH}/beige_wall_001/beige_wall_001_diff_1k.png`), { repeat: [3.2, 3.2], srgb: true, anisotropy: maxAniso }),
      normal: prepTexture(loader.load(`${PH}/beige_wall_001/beige_wall_001_nor_gl_1k.png`), { repeat: [3.2, 3.2], anisotropy: maxAniso }),
      arm: prepTexture(loader.load(`${PH}/beige_wall_001/beige_wall_001_arm_1k.png`), { repeat: [3.2, 3.2], anisotropy: maxAniso }),
    };

    const woodV = {
      diff: prepTexture(loader.load(`${PH}/synthetic_wood/synthetic_wood_diff_1k.png`), { repeat: [1.25, 2.5], srgb: true, anisotropy: maxAniso }),
      normal: prepTexture(loader.load(`${PH}/synthetic_wood/synthetic_wood_nor_gl_1k.png`), { repeat: [1.25, 2.5], anisotropy: maxAniso }),
      arm: prepTexture(loader.load(`${PH}/synthetic_wood/synthetic_wood_arm_1k.png`), { repeat: [1.25, 2.5], anisotropy: maxAniso }),
    };

    const woodH = {
      diff: prepTexture(loader.load(`${PH}/synthetic_wood/synthetic_wood_diff_1k.png`), { repeat: [2.4, 1.15], srgb: true, rotation: Math.PI / 2, anisotropy: maxAniso }),
      normal: prepTexture(loader.load(`${PH}/synthetic_wood/synthetic_wood_nor_gl_1k.png`), { repeat: [2.4, 1.15], rotation: Math.PI / 2, anisotropy: maxAniso }),
      arm: prepTexture(loader.load(`${PH}/synthetic_wood/synthetic_wood_arm_1k.png`), { repeat: [2.4, 1.15], rotation: Math.PI / 2, anisotropy: maxAniso }),
    };

    const floor = {
      diff: prepTexture(loader.load(`${PH}/wood_floor/wood_floor_diff_1k.png`), { repeat: [2.6, 2.6], srgb: true, anisotropy: maxAniso }),
      normal: prepTexture(loader.load(`${PH}/wood_floor/wood_floor_nor_gl_1k.png`), { repeat: [2.6, 2.6], anisotropy: maxAniso }),
      arm: prepTexture(loader.load(`${PH}/wood_floor/wood_floor_arm_1k.png`), { repeat: [2.6, 2.6], anisotropy: maxAniso }),
    };

    const concrete = {
      diff: prepTexture(loader.load(`${PH}/concrete_floor_worn_001/concrete_floor_worn_001_diff_1k.png`), { repeat: [3.6, 3.6], srgb: true, anisotropy: maxAniso }),
      normal: prepTexture(loader.load(`${PH}/concrete_floor_worn_001/concrete_floor_worn_001_nor_gl_1k.png`), { repeat: [3.6, 3.6], anisotropy: maxAniso }),
      arm: prepTexture(loader.load(`${PH}/concrete_floor_worn_001/concrete_floor_worn_001_arm_1k.png`), { repeat: [3.6, 3.6], anisotropy: maxAniso }),
    };

    const applyPbr = (material, set, { keepDiffuse = false, roughness = 0.9, normalScale = 0.45 } = {}) => {
      if (!keepDiffuse) {
        material.map = set.diff;
        material.color?.set?.("#FFFFFF");
      }
      material.normalMap = set.normal;
      material.normalScale = new THREE.Vector2(normalScale, normalScale);
      material.roughnessMap = set.arm;
      material.roughness = roughness;
      material.metalness = 0;
      material.envMapIntensity = 0.9;
    };

    scene.traverse((object) => {
      if (!object.isMesh) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];

      materials.forEach((material) => {
        if (!material || material.userData?.opcRealismTuned === "v2") return;
        const hex = material.color?.getHexString?.()?.toLowerCase();

        if (["f0ebe3", "ddd6cb", "f2efe9"].includes(hex)) {
          applyPbr(material, stucco, { roughness: 0.96, normalScale: 0.62 });
          material.color.set(hex === "ddd6cb" ? "#EEE8DE" : "#F7F3EC");
          material.envMapIntensity = 0.62;
        }

        if (["9a6035", "7b4726", "6e4f30", "b07d4e", "7a5a38"].includes(hex)) {
          applyPbr(material, woodV, { roughness: 0.73, normalScale: 0.72 });
          material.envMapIntensity = 1.05;
        }

        if (hex === "a97848") {
          applyPbr(material, woodH, { roughness: 0.76, normalScale: 0.68 });
          material.envMapIntensity = 0.95;
        }

        if (hex === "a37c52") {
          applyPbr(material, floor, { roughness: 0.68, normalScale: 0.55 });
          material.envMapIntensity = 1.0;
        }

        if (["262421", "55555e", "62626b", "8e8e96", "3a3a3f"].includes(hex)) {
          applyPbr(material, concrete, { roughness: 0.98, normalScale: 0.64 });
          material.envMapIntensity = 0.42;
        }

        if (["7a7a80", "54545c"].includes(hex)) {
          applyPbr(material, concrete, { keepDiffuse: true, roughness: 1, normalScale: 0.58 });
          material.envMapIntensity = 0.38;
        }

        if (material.isMeshPhysicalMaterial && ["b9d4e0", "b9d4e2", "d4e2e6"].includes(hex)) {
          material.metalness = 0;
          material.roughness = hex === "d4e2e6" ? 0.42 : 0.07;
          material.ior = 1.48;
          material.thickness = 0.12;
          material.transmission = hex === "d4e2e6" ? 0.06 : 0.22;
          material.clearcoat = 0.32;
          material.clearcoatRoughness = 0.12;
          material.envMapIntensity = 2.7;
        }

        if (material.isMeshPhysicalMaterial && hex === "2e93a8") {
          material.metalness = 0;
          material.roughness = 0.055;
          material.ior = 1.333;
          material.transmission = 0.12;
          material.clearcoat = 0.35;
          material.envMapIntensity = 2.8;
        }

        if (["1d1d20", "26262b", "2a2a2e"].includes(hex)) {
          material.metalness = 0.82;
          material.roughness = 0.24;
          material.envMapIntensity = 1.9;
        }

        if (["ffd9a0", "ffe3b0"].includes(hex)) {
          material.emissiveIntensity = mobile ? 0.32 : 0.68;
        }

        material.userData.opcRealismTuned = "v2";
        material.needsUpdate = true;
      });
    });
  }, [scene, gl, mobile]);

  return null;
}

function MobileInteriorLightGuard() {
  const { scene, size } = useThree();
  const mobile = size.width < 768;

  useFrame(() => {
    if (!mobile) return;
    scene.traverse((object) => {
      if (!object.isPointLight) return;
      // Bedroom/bath fixture lives upstairs; clamp it harder than the kitchen/living light.
      const maxIntensity = object.position.y > 4 ? 0.65 : 2.2;
      if (object.intensity > maxIntensity) object.intensity = maxIntensity;
    });
  });

  return null;
}

function LightRig() {
  const { size } = useThree();
  const mobile = size.width < 768;
  const tablet = size.width >= 768 && size.width < 1100;

  return (
    <>
      <hemisphereLight args={["#E9EEF2", "#171514", mobile ? 0.28 : 0.34]} />
      <ambientLight intensity={mobile ? 0.08 : 0.12} />

      <directionalLight
        castShadow
        position={[10, 15, 7]}
        intensity={mobile ? 1.72 : tablet ? 2.0 : 2.28}
        color="#FFF4E6"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-camera-near={1}
        shadow-camera-far={46}
        shadow-bias={-0.00018}
        shadow-normalBias={0.022}
        shadow-radius={5}
      />

      <directionalLight position={[-8, 8, -9]} intensity={mobile ? 0.2 : 0.29} color="#A8C0D4" />

      <spotLight
        position={[2, 7, 8]}
        intensity={mobile ? 1.8 : tablet ? 3.4 : 5.4}
        angle={0.48}
        penumbra={1}
        color="#D8A66F"
        distance={24}
        decay={2}
      />
    </>
  );
}

export default function HouseScene() {
  return (
    <div className="fixed inset-0 z-0" data-testid="house-scene" aria-hidden>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 54% at 63% 44%, rgba(143,112,80,0.075), rgba(83,94,105,0.025) 48%, rgba(9,9,11,0) 76%)",
        }}
      />
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ fov: 38, position: [9.5, 5.6, 11.5] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 1.2, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.72;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          window.__cam = camera;
        }}
      >
        <color attach="background" args={["#09090B"]} />
        <fog attach="fog" args={["#09090B", 20, 41]} />

        <LightRig />

        <Suspense fallback={null}>
          <HouseModel />
        </Suspense>
        <MobileInteriorLightGuard />
        <RealismTuner />

        <EnvBoundary>
          <Suspense fallback={null}>
            <Environment files="/hdr/city_1k.hdr" environmentIntensity={1.12} />
          </Suspense>
        </EnvBoundary>

        <ContactShadows position={[0, 0.02, 0]} opacity={0.42} scale={28} blur={3.1} far={11} />

        <EffectComposer multisampling={0}>
          <N8AO halfRes intensity={1.42} aoRadius={1.72} distanceFalloff={2.9} quality="performance" />
        </EffectComposer>
      </Canvas>
    </div>
  );
}