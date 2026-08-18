import HouseModel from "./HouseModel";
import DrivewayV2 from "./parts/DrivewayV2";

const ROTATION = [[0, -0.08], [0.1, -0.08], [0.19, 0.85], [0.26, 0.85], [0.33, 0.02], [0.4, 0.02], [0.5, -1.38], [0.56, -1.38], [0.66, -3.05], [0.72, -3.05], [0.845, -5.9], [0.9, -5.9], [1, -6.2]];
const POSITION_X = [[0, 2.35], [0.1, 2.35], [0.17, -2.3], [0.27, -2.3], [0.33, 2.3], [0.43, 2.3], [0.5, -2.3], [0.58, -2.3], [0.65, 2.3], [0.74, 2.3], [0.83, -2.0], [0.93, -2.0], [1, 0]];
const SCALE = [[0, 0.78], [0.1, 0.78], [0.2, 0.92], [0.9, 0.92], [1, 1.05]];
const VIEW = {
  phone: { f: 0.04, s: 0.5, y: 1.1 },
  tablet: { f: 0.32, s: 0.68, y: 0.45 },
  desktop: { f: 1, s: 1, y: -0.08 },
};

export default function HouseModelV2() {
  return (
    <HouseModel
      DrivewayComponent={DrivewayV2}
      rotationTrack={ROTATION}
      positionXTrack={POSITION_X}
      scaleTrack={SCALE}
      viewConfig={VIEW}
    />
  );
}
