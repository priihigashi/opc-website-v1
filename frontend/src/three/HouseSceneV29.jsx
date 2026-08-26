import HouseSceneV19 from "./HouseSceneV19";
import HouseModelV27 from "./HouseModelV27";

export default function HouseSceneV29({ onFrame = null }) {
  return <HouseSceneV19 ModelComponent={HouseModelV27} onFrame={onFrame} />;
}
