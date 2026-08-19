import AdditionV5 from "./AdditionV5";

// The pavilion junction belongs to the permanent envelope, not the animated
// addition, so it must not scale away when the addition retracts.
export default function AdditionV6(props) {
  return <AdditionV5 {...props} includePavilionReturn={false} />;
}
