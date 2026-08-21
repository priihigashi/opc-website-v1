import HouseSceneV19 from "./HouseSceneV19";
import HouseModelV25 from "./HouseModelV25";

// V27 keeps the approved V24 scene, camera and lighting exactly as they are and only
// swaps in HouseModelV25, whose EnvelopeV10 pulls the tower's upper east wall a hair off
// the two planes it shared with the front/back walls and the roof underside.
//
// Why: during the intro fade the second-floor exterior wall showed a stippled black patch
// that read as a hole punched through the stucco (Build Tracker T-234). The stucco is
// transparent while it fades in, and coincident faces interfere while transparent. Hiding
// the wall entirely proved the patch belongs to this wall; the clearances remove the
// coincidence without changing any visible wall shape.
//
// Shadow settings are deliberately untouched: raising the shadow bias shrank the symptom
// but was not the cause, so it was reverted.
export default function HouseSceneV27() {
  return <HouseSceneV19 ModelComponent={HouseModelV25} />;
}
