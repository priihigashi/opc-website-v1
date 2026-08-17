import { Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
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

export default function HouseScene() {
  return (
    <div className="fixed inset-0 z-0" data-testid="house-scene" aria-hidden>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 42%, rgba(203,204,16,0.08), rgba(9,9,11,0) 70%)",
        }}
      />
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 38, position: [9.5, 5.6, 11.5] }}
        gl={{ antialias: true }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 1.2, 0);
          window.__cam = camera;
        }}
      >
        <color attach="background" args={["#09090B"]} />
        <fog attach="fog" args={["#09090B", 18, 38]} />
        <hemisphereLight args={["#cdd6e0", "#141416", 0.5]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          castShadow
          position={[10, 14, 9]}
          intensity={2.2}
          color="#FFF2DF"
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-13}
          shadow-camera-right={13}
          shadow-camera-top={13}
          shadow-camera-bottom={-13}
          shadow-camera-far={45}
          shadow-bias={-0.0004}
          shadow-normalBias={0.03}
        />
        <directionalLight position={[-8, 6, -7]} intensity={0.5} color="#8FB8E8" />
        <Suspense fallback={null}>
          <HouseModel />
        </Suspense>
        <EnvBoundary>
          <Suspense fallback={null}>
            <Environment files="/hdr/city_1k.hdr" />
          </Suspense>
        </EnvBoundary>
        <ContactShadows position={[0, 0.02, 0]} opacity={0.5} scale={28} blur={2.4} far={9} />
        <EffectComposer multisampling={0}>
          <N8AO halfRes intensity={2.4} aoRadius={1.4} distanceFalloff={2.4} quality="performance" />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
