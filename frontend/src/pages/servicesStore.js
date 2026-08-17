// Shared mutable state between the services page (labels/click logic)
// and the always-mounted ServicesScene canvas.
export const servicesCtx = {
  t: 0,
  tTarget: 0,
  active: null,
  svc: null,
  hover: null,
  lightRef: { current: null },
  traceRef: { current: null },
};
