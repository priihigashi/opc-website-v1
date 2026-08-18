import { useMemo } from "react";
import * as THREE from "three";

const roundedRectangle = (width, depth, radius) => {
  const x = -width / 2;
  const y = -depth / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + depth - radius);
  shape.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
  shape.lineTo(x + radius, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
};

export default function SiteGroundV1() {
  const outer = useMemo(() => roundedRectangle(17.9, 10.35, 0.72), []);
  const inner = useMemo(() => roundedRectangle(17.15, 9.62, 0.52), []);

  return (
    <group position={[0.35, -0.015, 0.05]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[outer, 8]} />
        <meshStandardMaterial color="#151714" roughness={1} metalness={0} />
      </mesh>
      <mesh receiveShadow position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[inner, 8]} />
        <meshStandardMaterial color="#252622" roughness={0.96} metalness={0.01} />
      </mesh>
      <mesh receiveShadow position={[0, 0.026, -4.42]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16.1, 0.28]} />
        <meshStandardMaterial color="#30332D" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}
