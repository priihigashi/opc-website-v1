import EnvelopeV9 from "./EnvelopeV9";

// V10 keeps the approved V9 envelope exactly as it is and only pulls the tower's
// upper east wall a hair off two planes it currently shares with its neighbours:
//
//   - its Z end faces sat at +/-2.875, the same plane as the front and back walls'
//     inner faces (a butt joint)
//   - its top sat at 6.10, inside the roof underside at 6.085
//
// While the stucco is opaque those coincident planes are invisible. During the intro
// fade every stucco material is transparent, and the coincident faces interfere,
// which is what produced the stippled black patch on the second-floor exterior wall
// in the first ~2 seconds after load (Build Tracker T-234).
//
// Both clearances are far smaller than a wall thickness and both sit at joints that
// are covered by the neighbouring wall or by the roof overhang, so neither can open a
// visible seam or leave the wall short of its neighbour.
const END_CLEARANCE = 0.01; // 0.005 off each Z end, hidden behind the front/back walls
const TOP_CLEARANCE = 0.03; // top drops 6.10 -> 6.07, hidden under the roof overhang

export default function EnvelopeV10(props) {
  return (
    <EnvelopeV9
      {...props}
      upperEastWallEndClearance={END_CLEARANCE}
      upperEastWallTopClearance={TOP_CLEARANCE}
    />
  );
}
