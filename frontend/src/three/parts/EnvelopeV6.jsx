import EnvelopeV5 from "./EnvelopeV5";

// V6 preserves the corrected entry and butt-joint envelope. Both narrow
// kitchen/pavilion returns now overlap the adjacent glass-frame plane and drop
// below the oak floor edge, preventing the small brown floor corners from
// showing at either the front or rear junction.
const PAVILION_JUNCTION = {
  depth: 0.3,
  height: 3.48,
  centerY: 1.66,
  frontZ: -0.225,
  rearZ: 0.225,
};

export default function EnvelopeV6(props) {
  return <EnvelopeV5 {...props} pavilionJunction={PAVILION_JUNCTION} />;
}
