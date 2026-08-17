import { Suspense, Component, useEffect, useRef } from "react";
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

function RealismTuner() {
  const { scene, gl } = useThree();
  const tuned = useRef(false);

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.9;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);

  useFrame(() => {
    if (tuned.current) return;

    scene.traverse((object) => {
      if (!object.isMesh) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];

      materials.forEach((material) => {
        if (!material || material.userData?.opcRealismTuned) return;

        const hex = material.color?.getHexString?.()?.toLowerCase();

        // Exterior stucco / masonry: keep the existing texture, but let it react
        // to light with micro-surface depth instead of reading like flat paint.
        if (["f0ebe3", "ddd6cb", "f2efe9"].includes(hex)) {
          if (material.map) {
            material.bumpMap = material.map;
            material.bumpScale = 0.018;
          }
          material.roughness = Math.min(material.roughness ?? 1, 0.78);
          material.metalness = 0;
          material.envMapIntensity = 0.7;
        }

        // Architectural wood: deepen grain, reduce the plastic sheen and let the
        // HDR environment catch only the smoother portions.
        if (["9a6035", "7b4726", "a97848", "6e4f30", "b07d4e", "7a5a38", "a37c52"].includes(hex)) {
          if (material.map) {
            material.bumpMap = material.map;
            material.bumpScale = 0.028;
          }
          material.roughness = Math.min(material.roughness ?? 1, 0.56);
          material.metalness = 0;
          material.envMapIntensity = 0.95;
        }

        // Concrete and pavers: subtle relief keeps joints and aggregate visible
        // under grazing light without changing any geometry or animation groups.
        if (["262421", "7a7a80", "54545c", "55555e", "62626b", "8e8e96", "3a3a3f"].includes(hex)) {
          if (material.map) {
            material.bumpMap = material.map;
            material.bumpScale = 0.022;
          }
          material.roughness = Math.max(material.roughness ?? 0.8, 0.76);
          material.envMapIntensity = 0.45;
        }

        // Window / shower glass stays tied to the existing opacity choreography,
        // but gets a more believable dielectric response.
        if (material.isMeshPhysicalMaterial && ["b9d4e0", "b9d4e2", "d4e2e6"].includes(hex)) {
          material.metalness = 0;
          material.roughness = Math.max(0.06, Math.min(material.roughness ?? 0.08, 0.16));
          material.ior = 1.45;
          material.thickness = 0.08;
          material.clearcoat = 0.12;
          material.clearcoatRoughness = 0.16;
          material.envMapIntensity = 2.35;
        }

        // Pool water: stronger environment response while preserving animated opacity.
        if (material.isMeshPhysicalMaterial && hex === "2e93a8") {
          material.metalness = 0;
          material.roughness = 0.07;
          material.ior = 1.333;
          material.envMapIntensity = 2.6;
        }

        // Dark aluminum / steel should read as coated metal, not flat black.
        if (["1d1d20", "26262b", "2a2a2e"].includes(hex)) {
          material.metalness = Math.max(material.metalness ?? 0, 0.72);
          material.roughness = 0.28;
          material.envMapIntensity = 1.5;
        }

        material.userData.opcRealismTuned = true;
        material.needsUpdate = true;
      });
    });

    tuned.current = true;
  });

  return null;
}

export default function HouseScene() {
  return (
    <div className="fixed inset-0 z-0" data-testid="house-scene" aria-hidden>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 58% 52% at 63% 44%, rgba(184,139,87,0.115), rgba(203,204,16,0.025) 48%, rgba(9,9,11,0) 74%)",
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
          gl.toneMappingExposure = 0.9;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          window.__cam = camera;
        }}
      >
        <color attach="background" args={["#09090B"]} />
        <fog attach="fog" args={["#09090B", 19, 39]} />

        <hemisphereLight args={["#EDE6DD", "#151515", 0.48]} />
        <ambientLight intensity={0.2} />

        <directionalLight
          castShadow
          position={[11, 15, 8]}
          intensity={2.15}
          color="#FFF0DA"
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-13}
          shadow-camera-right={13}
          shadow-camera-top={13}
          shadow-camera-bottom={-13}
          shadow-camera-near={1}
          shadow-camera-far={46}
          shadow-bias={-0.00022}
          shadow-normalBias={0.026}
          shadow-radius={4}
        />

        <directionalLight position={[-8, 7, -8]} intensity={0.42} color="#AFC4D3" />
        <spotLight
          position={[2, 7, 8]}
          intensity={19}
          angle={0.44}
          penumbra={0.96}
          color="#D8A66F"
          distance={26}
          decay={2}
        />

        <Suspense fallback={null}>
          <HouseModel />
        </Suspense>

        <RealismTuner />

        <EnvBoundary>
          <Suspense fallback={null}>
            <Environment files="/hdr/city_1k.hdr" environmentIntensity={0.88} />
          </Suspense>
        </EnvBoundary>

        <ContactShadows position={[0, 0.02, 0]} opacity={0.3} scale={28} blur={4.2} far={10} />

        <EffectComposer multisampling={0}>
          <N8AO halfRes intensity={1.18} aoRadius={1.45} distanceFalloff={2.8} quality="performance" />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
