import HouseSceneV16 from "./HouseSceneV16";
import HouseModelV17 from "./HouseModelV17";

export default function HouseSceneV18({ ModelComponent = HouseModelV17 }) {
  return <HouseSceneV16 ModelComponent={ModelComponent} />;
}
