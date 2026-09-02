import { Component, Suspense, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import HouseModelV30 from "./HouseModelV30";

class EnvBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

// V33 preserves V32 and reports a browser WebGL context loss to the fallback stage.
export default function HouseSceneV33({ onFrame = null, onContextLost = null }) {
  const canvasRef = useRef(null);
  const handleContextLost = useCallback((event) => {
    event.preventDefault();
    onContextLost?.();
  }, [onContextLost]);

  useEffect(() => () => {
    canvasRef.current?.removeEventListener("webglcontextlost", handleContextLost, false);
    canvasRef.current = null;
  }, [handleContextLost]);

  const connectCanvas = useCallback(({ camera, gl }) => {
    if (canvasRef.current !== gl.domElement) {
      canvasRef.current?.removeEventListener("webglcontextlost", handleContextLost, false);
      canvasRef.current = gl.domElement;
      canvasRef.current.addEventListener("webglcontextlost", handleContextLost, false);
    }
    camera.lookAt(0, 1.15, 0);
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.localClippingEnabled = true;
    window.__cam = camera;
  }, [handleContextLost]);

  return (
    <div className="fixed inset-0 z-0" data-testid="house-scene" aria-hidden>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 46% at 72% 47%, rgba(186,135,72,0.14), rgba(203,204,16,0.045) 42%, rgba(9,9,11,0) 72%)" }} />
      <Canvas shadows="soft" dpr={[1, 1.7]} camera={{ fov: 38, position: [2.1, 4.75, 14.8] }} gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.94 }} onCreated={connectCanvas}>
        <color attach="background" args={["#09090B"]} />
        <fog attach="fog" args={["#09090B", 18, 38]} />
        <hemisphereLight args={["#EEE7DE", "#111417", 0.72]} />
        <ambientLight intensity={0.28} />
        <directionalLight castShadow position={[10, 14, 9]} intensity={2.25} color="#FFE9D0" shadow-mapSize={[2048, 2048]} shadow-camera-left={-13} shadow-camera-right={13} shadow-camera-top={13} shadow-camera-bottom={-13} shadow-camera-far={45} shadow-bias={-0.00008} shadow-normalBias={0.026} />
        <directionalLight position={[-8, 7, -7]} intensity={0.52} color="#A8C2D7" />
        <spotLight position={[2, 7, 8]} intensity={22} angle={0.46} penumbra={0.92} color="#D3A16C" distance={28} />
        <Suspense fallback={null}><HouseModelV30 onFrame={onFrame} /></Suspense>
        <EnvBoundary><Suspense fallback={null}><Environment files="/hdr/city_1k.hdr" /></Suspense></EnvBoundary>
        <ContactShadows position={[0, 0.02, 0]} opacity={0.3} scale={28} blur={4.6} far={9} />
      </Canvas>
    </div>
  );
}
