import { useEffect, useState } from "react";
import HouseModel from "./HouseModel";
import AdditionV6 from "./parts/AdditionV6";
import BackyardV3 from "./parts/BackyardV3";
import DrivewayV5 from "./parts/DrivewayV5";
import EnvelopeV9 from "./parts/EnvelopeV9";
import InteriorV2 from "./parts/InteriorV2";
import LandscapeV2 from "./parts/LandscapeV2";

const MATERIAL_CONFIG = { stuccoFront: "#F0EBE3", stuccoSide: "#F0EBE3" };

// T-258/T-261: inter-chapter handoffs (rotation/position/scale movement) start only
// after each chapter's panel-out + solo hold: 0.260 / 0.415 / 0.575 / 0.745 / 0.910.
const ROTATION = [
  [0, -0.08], [0.004, -0.08], [0.13, 0.85], [0.26, 0.85], [0.33, 0.02],
  [0.415, 0.02], [0.45, -0.82], [0.615, -0.82], [0.66, -3.05],
  [0.745, -3.05], [0.845, -5.9], [0.912, -5.9], [1, -6.2],
];

const positionTrack = (additionX) => [
  [0, 2.35], [0.004, 2.35], [0.11, -2.3], [0.27, -2.3], [0.33, 2.3],
  [0.415, 2.3], [0.44, additionX], [0.615, additionX], [0.65, 2.3],
  [0.745, 2.3], [0.83, -2], [0.93, -2], [1, 0],
];

const verticalTrack = (heroY) => [
  [0, heroY], [0.004, heroY], [0.10, 0], [0.25, -0.3], [0.92, -0.3], [1, 0],
];

const SCALE = [[0, 0.78], [0.004, 0.78], [0.14, 0.92], [0.912, 0.92], [1, 1.05]];
const VIEW = {
  phone: { f: 0.04, s: 0.5, y: 1.1 },
  tablet: { f: 0.32, s: 0.68, y: 0.45 },
  desktop: { f: 1, s: 1, y: -0.08 },
};

const viewportStage = () => {
  if (typeof window === "undefined") return { tablet: false, heroY: -0.18 };
  const { innerWidth: width, innerHeight: height } = window;
  if (width < 768) return { tablet: false, heroY: 0.05 };
  if (width < 1100) return { tablet: true, heroY: height >= 1100 ? -0.32 : -0.14 };
  if (height >= 1350) return { tablet: false, heroY: -0.72 };
  if (height >= 1100) return { tablet: false, heroY: -0.52 };
  if (height >= 900) return { tablet: false, heroY: -0.34 };
  return { tablet: false, heroY: -0.16 };
};

export default function HouseModelV25({ onFrame = null }) {
  const [stage, setStage] = useState(viewportStage);

  useEffect(() => {
    const update = () => setStage(viewportStage());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <HouseModel
      onFrame={onFrame}
      AdditionComponent={AdditionV6}
      BackyardComponent={BackyardV3}
      DrivewayComponent={DrivewayV5}
      EnvelopeComponent={EnvelopeV9}
      InteriorComponent={InteriorV2}
      LandscapeComponent={LandscapeV2}
      materialConfig={MATERIAL_CONFIG}
      rotationTrack={ROTATION}
      positionXTrack={positionTrack(stage.tablet ? -4.35 : -2.8)}
      positionYTrack={verticalTrack(stage.heroY)}
      scaleTrack={SCALE}
      viewConfig={VIEW}
    />
  );
}
