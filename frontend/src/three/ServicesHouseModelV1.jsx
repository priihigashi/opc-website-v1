import HouseModel from "./HouseModel";
import AdditionV6 from "./parts/AdditionV6";
import BackyardV3 from "./parts/BackyardV3";
import DrivewayV5 from "./parts/DrivewayV5";
import EnvelopeV9 from "./parts/EnvelopeV9";
import InteriorV4 from "./parts/InteriorV4";
import LandscapeV2 from "./parts/LandscapeV2";
import { servicesPreviewStoreV3 } from "@/pages/servicesPreviewStoreV3";

const MATERIAL_CONFIG = { stuccoFront: "#F0EBE3", stuccoSide: "#F0EBE3" };

const ROTATION = [
  [0, -0.08], [0.1, -0.08], [0.19, 0.85], [0.26, 0.85], [0.33, 0.02],
  [0.39, 0.02], [0.435, -0.82], [0.615, -0.82], [0.66, -3.05],
  [0.72, -3.05], [0.845, -5.9], [0.9, -5.9], [1, -6.2],
];

const CENTER = [[0, 0], [1, 0]];
const SCALE = [[0, 1], [1, 1]];
const VIEW = {
  phone: { f: 0, s: 1, y: 0 },
  tablet: { f: 0, s: 1, y: 0 },
  desktop: { f: 0, s: 1, y: 0 },
};

// Services turns around a stable center; it does not inherit homepage panning.
export default function ServicesHouseModelV1({ onFrame = null }) {
  return (
    <group scale={0.56}><HouseModel
      onFrame={onFrame}
      AdditionComponent={AdditionV6}
      BackyardComponent={BackyardV3}
      DrivewayComponent={DrivewayV5}
      EnvelopeComponent={EnvelopeV9}
      InteriorComponent={InteriorV4}
      LandscapeComponent={LandscapeV2}
      materialConfig={MATERIAL_CONFIG}
      rotationTrack={ROTATION}
      positionXTrack={CENTER}
      positionYTrack={CENTER}
      scaleTrack={SCALE}
      viewConfig={VIEW}
      previewStore={servicesPreviewStoreV3}
      scopedRoomHighlights
    /></group>
  );
}
