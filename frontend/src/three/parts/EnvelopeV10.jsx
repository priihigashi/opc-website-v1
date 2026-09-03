import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import EnvelopeV9 from "./EnvelopeV9";

const MOVING_FRONT_GROUPS = ["facade-front-a-v4", "facade-front-b-v2"];

/**
 * Mobile-only ground-plane cleanup for the Chapter 02 cutaway.
 *
 * The approved animation lowers the two front facade groups to reveal the
 * kitchen and bathroom. A few edge/frame meshes use the shared side materials,
 * so they remain visible after passing below the model's ground plane. The
 * lower phone camera exposes those fragments as a vertical tail beneath the
 * circular site. This version gives only the descending facade meshes local
 * material clones and clips their pixels at the model ground plane on phones.
 * Desktop/tablet rendering and every piece of house geometry stay unchanged.
 */
export default function EnvelopeV10({ mats, ...props }) {
  const envelopeRef = useRef(null);
  const phoneRef = useRef(false);
  const clippedMaterialsRef = useRef([]);
  const groundWorld = useMemo(() => new THREE.Vector3(), []);
  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  useEffect(() => {
    const envelope = envelopeRef.current;
    const updatePhone = () => {
      phoneRef.current = window.innerWidth < 768;
      clippedMaterialsRef.current.forEach(({ clone }) => {
        clone.clippingPlanes = phoneRef.current ? [groundPlane] : null;
        clone.needsUpdate = true;
      });
    };

    const entries = [];
    MOVING_FRONT_GROUPS.forEach((name) => {
      const group = envelope?.getObjectByName(name);
      group?.traverse((mesh) => {
        if (!mesh.isMesh) return;
        const sources = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const clones = sources.map((source) => {
          const clone = source.clone();
          clone.clipShadows = true;
          entries.push({ source, clone });
          return clone;
        });
        mesh.userData.mobileGroundClipOriginalMaterial = mesh.material;
        mesh.material = Array.isArray(mesh.material) ? clones : clones[0];
      });
    });
    clippedMaterialsRef.current = entries;
    updatePhone();
    window.addEventListener("resize", updatePhone);

    return () => {
      window.removeEventListener("resize", updatePhone);
      MOVING_FRONT_GROUPS.forEach((name) => {
        const group = envelope?.getObjectByName(name);
        group?.traverse((mesh) => {
          if (!mesh.isMesh || !mesh.userData.mobileGroundClipOriginalMaterial) return;
          mesh.material = mesh.userData.mobileGroundClipOriginalMaterial;
          delete mesh.userData.mobileGroundClipOriginalMaterial;
        });
      });
      entries.forEach(({ clone }) => clone.dispose());
      clippedMaterialsRef.current = [];
    };
  }, [groundPlane]);

  useFrame(() => {
    const modelSpace = envelopeRef.current?.parent;
    if (!modelSpace) return;
    modelSpace.getWorldPosition(groundWorld);
    groundPlane.constant = -groundWorld.y + 0.002;
    clippedMaterialsRef.current.forEach(({ source, clone }) => {
      clone.opacity = source.opacity;
      clone.transparent = source.transparent;
      clone.depthWrite = source.depthWrite;
      if (clone.color && source.color) clone.color.copy(source.color);
      if (clone.emissive && source.emissive) clone.emissive.copy(source.emissive);
      if ("emissiveIntensity" in clone) clone.emissiveIntensity = source.emissiveIntensity;
    });
  });

  return (
    <group ref={envelopeRef} name="envelope-v10-mobile-ground-clip">
      <EnvelopeV9 mats={mats} {...props} />
    </group>
  );
}
