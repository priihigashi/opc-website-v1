import { Component } from "react";

/**
 * Catches a failure inside the 3D house so it can never take the page down.
 *
 * Suspense only covers the LOADING state. If WebGL is unavailable, the GPU
 * driver refuses a context, or the scene throws while rendering, the error
 * propagates past Suspense and would blank the homepage — the house is a
 * fixed, full-viewport layer behind all the content.
 *
 * On failure this renders nothing at all. That is deliberate: the static house
 * image already sits behind this layer at full opacity and simply stays
 * visible, so the visitor sees the intended hero rather than an error card.
 * Every piece of page content is real HTML and is unaffected.
 */
export default class HouseStageBoundaryV1 extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Surfaced for diagnostics only; the visitor is never shown an error.
    console.warn(`[house-stage] 3D scene unavailable, static hero retained: ${error?.message}`);
    // Lets the stage swap in the static hero immediately (the photo is no
    // longer pre-mounted behind this layer on the normal path).
    this.props.onFailure?.();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
