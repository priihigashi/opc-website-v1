import EnvelopeV8 from "./EnvelopeV8";

// V9 keeps the approved V8 envelope geometry intact. It only removes the thin
// upper east return from the shadow map, preventing the transparent intro fade
// from producing a brief stippled self-shadow at the tower/pavilion junction.
export default function EnvelopeV9(props) {
  return <EnvelopeV8 {...props} upperEastWallShadows={false} />;
}
