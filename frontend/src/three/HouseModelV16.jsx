import HouseModelV15 from "./HouseModelV15";
import EnvelopeV7 from "./parts/EnvelopeV7";

export default function HouseModelV16() {
  return <HouseModelV15 EnvelopeComponent={EnvelopeV7} />;
}
