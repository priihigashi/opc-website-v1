import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

const MODEL_URL = "/models/opc-experiment/2123.glb";

function VillaModel() {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh) return;
      if (/^mesh_(211|212|213|214|215|335|336)_/.test(object.name)) {
        object.visible = false;
        return;
      }
      object.castShadow = true;
      object.receiveShadow = true;
    });
  }, [scene]);

  return (
    <group position={[-2.2, -0.48, 2.4]} rotation={[0, -0.18, 0]}>
      <primitive object={scene} scale={0.0001} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export default function ModelExperiment() {
  return (
    <main className="relative h-screen overflow-hidden bg-[#09090B] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-6 pt-24 md:p-10 md:pt-28">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-[#D7DF00]">
            ISOLATED MODEL TEST
          </p>
          <h1 className="mt-3 max-w-xl font-display text-4xl uppercase md:text-6xl">
            Luxury villa donor model
          </h1>
          <p className="mt-3 max-w-lg text-sm text-white/60">
            Drag to rotate. Scroll to zoom. This test does not alter the protected OPC house.
          </p>
        </div>
      </div>

      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ fov: 32, position: [4.4, 3.2, 5.4], near: 0.05, far: 500 }}
          gl={{ antialias: true, toneMappingExposure: 0.54 }}
          onCreated={({ camera }) => camera.lookAt(0, 0.8, 0)}
        >
        <color attach="background" args={["#09090B"]} />
        <fog attach="fog" args={["#09090B", 35, 95]} />
        <ambientLight intensity={0.24} />
        <hemisphereLight args={["#fff1dc", "#222831", 0.72]} />
        <directionalLight
          castShadow
          position={[18, 24, 12]}
          intensity={1.45}
          color="#ffe6c5"
          shadow-mapSize={[2048, 2048]}
        />
        <Suspense fallback={null}>
          <VillaModel />
          <Environment files="/hdr/city_1k.hdr" />
        </Suspense>
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.07}
          minPolarAngle={Math.PI * 0.14}
          maxPolarAngle={Math.PI * 0.48}
          target={[0, 0.8, 0]}
        />
        </Canvas>
      </div>
    </main>
  );
}
