import EnvelopeV4 from "./EnvelopeV4";

// V5 keeps the proven butt-joint envelope and corrects only the main entry:
// the slab extends farther left to hide the oblique Chapter 05 reveal, while
// the handle is brought in front of the advanced slab and matches the compact
// vertical pull used on the addition door.
const ENTRY_DOOR = {
  center: 1.57,
  width: 1.3,
  handleX: 1.92,
  handleY: 1.25,
  handleZ: 0.18,
  handleSize: [0.06, 0.36, 0.04],
};

export default function EnvelopeV5(props) {
  return <EnvelopeV4 {...props} entryDoor={ENTRY_DOOR} />;
}
