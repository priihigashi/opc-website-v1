import AdditionV5 from "./AdditionV5";

// The pavilion junction no longer belongs to the animated addition. Keeping it
// here would scale the corner down with the addition and expose the oak floor.
export default function AdditionV6(props) {
  return <AdditionV5 {...props} includePavilionReturn={false} />;
}
