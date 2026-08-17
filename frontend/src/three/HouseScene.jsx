import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import HouseModel from "./HouseModel";

function CameraRig() {
  return null;
}

export default function HouseScene() {
  return (
    <div className="fixed inset-0 z-0" data-testid="house-scene" aria-hidden>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 42%, rgba(245,166,35,0.10), rgba(9,9,11,0) 70%)",
        }}
      />
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 38, position: [9.5, 5.6, 11.5] }}
        gl={{ antialias: true }}
        onCreated={({ camera }) => camera.lookAt(0, 1.2, 0)}
      >
        <color attach="background" args={["#09090B"]} />
        <fog attach="fog" args={["#09090B", 17, 36]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 9, 6]} intensity={1.6} color="#FFF4E0" />
        <directionalLight position={[-7, 5, -6]} intensity={0.5} color="#7FB2E8" />
        <Suspense fallback={null}>
          <HouseModel />
        </Suspense>
        <ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={26} blur={2.6} far={8} />
        <CameraRig />
      </Canvas>
    </div>
  );
}
