import EnvelopeV5 from "./EnvelopeV5";

// A 0.05-unit width extension lets both short pavilion returns finish just
// behind the adjacent glass frame instead of ending on the exact same plane.
const PAVILION_JUNCTION = {
  width: 0.3,
  depth: 0.3,
  height: 3.48,
  centerY: 1.66,
  frontZ: -0.225,
  rearZ: 0.225,
};

export default function EnvelopeV7(props) {
  return <EnvelopeV5 {...props} pavilionJunction={PAVILION_JUNCTION} />;
}
