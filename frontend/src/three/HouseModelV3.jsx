import { useEffect, useState } from "react";
import HouseModel from "./HouseModel";
import DrivewayV2 from "./parts/DrivewayV2";

const ROTATION = [
  [0, -0.08],
  [0.1, -0.08],
  [0.19, 0.85],
  [0.26, 0.85],
  [0.33, 0.02],
  [0.39, 0.02],
  [0.435, -0.82],
  [0.615, -0.82],
  [0.66, -3.05],
  [0.72, -3.05],
  [0.845, -5.9],
  [0.9, -5.9],
  [1, -6.2],
];

const positionTrack = (additionX) => [
  [0, 2.35],
  [0.1, 2.35],
  [0.17, -2.3],
  [0.27, -2.3],
  [0.33, 2.3],
  [0.39, 2.3],
  [0.425, additionX],
  [0.615, additionX],
  [0.65, 2.3],
  [0.74, 2.3],
  [0.83, -2],
  [0.93, -2],
  [1, 0],
];

const SCALE = [[0, 0.78], [0.1, 0.78], [0.2, 0.92], [0.9, 0.92], [1, 1.05]];
const VIEW = {
  phone: { f: 0.04, s: 0.5, y: 1.1 },
  tablet: { f: 0.32, s: 0.68, y: 0.45 },
  desktop: { f: 1, s: 1, y: -0.08 },
};

export default function HouseModelV3() {
  const [tablet, setTablet] = useState(() => (
    typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1100
  ));

  useEffect(() => {
    const update = () => setTablet(window.innerWidth >= 768 && window.innerWidth < 1100);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <HouseModel
      DrivewayComponent={DrivewayV2}
      rotationTrack={ROTATION}
      positionXTrack={positionTrack(tablet ? -4.35 : -2.8)}
      scaleTrack={SCALE}
      viewConfig={VIEW}
    />
  );
}
