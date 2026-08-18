import { Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import HouseModelV4 from "./HouseModelV4";

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

export default function HouseSceneV4() {
  return (
    <div className="fixed inset-0 z-0" data-testid="house-scene" aria-hidden>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 46% at 72% 47%, rgba(186,135,72,0.14), rgba(203,204,16,0.045) 42%, rgba(9,9,11,0) 72%)" }} />
      <Canvas shadows="basic" dpr={[1, 1.75]} camera={{ fov: 38, position: [2.1, 4.75, 14.8] }} gl={{ antialias: true }} onCreated={({ camera }) => { camera.lookAt(0, 1.15, 0); window.__cam = camera; }}>
        <color attach="background" args={["#09090B"]} />
        <fog attach="fog" args={["#09090B", 18, 38]} />
        <hemisphereLight args={["#F1E7D8", "#171512", 0.66]} />
        <ambientLight intensity={0.34} />
        <directionalLight castShadow position={[10, 14, 9]} intensity={2.65} color="#FFE8CB" shadow-mapSize={[2048, 2048]} shadow-camera-left={-13} shadow-camera-right={13} shadow-camera-top={13} shadow-camera-bottom={-13} shadow-camera-far={45} shadow-bias={-0.0004} shadow-normalBias={0.03} />
        <directionalLight position={[-8, 6, -7]} intensity={0.38} color="#9CB4C7" />
        <spotLight position={[2, 7, 8]} intensity={32} angle={0.42} penumbra={0.9} color="#D9A15F" distance={28} />
        <Suspense fallback={null}><HouseModelV4 /></Suspense>
        <EnvBoundary><Suspense fallback={null}><Environment files="/hdr/city_1k.hdr" /></Suspense></EnvBoundary>
        <ContactShadows position={[0, 0.02, 0]} opacity={0.38} scale={28} blur={3.4} far={9} />
        <EffectComposer multisampling={0}><N8AO halfRes intensity={1.45} aoRadius={1.2} distanceFalloff={2.6} quality="performance" /></EffectComposer>
      </Canvas>
    </div>
  );
}
