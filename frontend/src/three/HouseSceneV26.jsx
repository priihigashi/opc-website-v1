import HouseSceneV19 from "./HouseSceneV19";
import HouseModelV24 from "./HouseModelV24";

export default function HouseSceneV26({ onFrame = null }) {
  return <HouseSceneV19 ModelComponent={HouseModelV24} onFrame={onFrame} />;
}
