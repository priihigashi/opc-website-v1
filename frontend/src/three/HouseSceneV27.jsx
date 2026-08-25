import HouseSceneV19 from "./HouseSceneV19";
import HouseModelV25 from "./HouseModelV25";

export default function HouseSceneV27({ onFrame = null }) {
  return <HouseSceneV19 ModelComponent={HouseModelV25} onFrame={onFrame} />;
}
