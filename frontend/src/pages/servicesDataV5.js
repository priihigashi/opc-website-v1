import { SERVICES_V4 } from "./servicesDataV4";

// Priscila asked for the service handoff to feel only a little faster. Keep the
// completed-view holds intact and shorten the reveal itself by 12%; this trims
// roughly 0.4 seconds without turning the house choreography into a jump cut.
export const SERVICES_V5 = SERVICES_V4.map((service) => ({
  ...service,
  revealMs: Math.round(service.revealMs * 0.88),
  handoffMs: 200,
}));

export { SERVICES_V4_RESTING_PROGRESS as SERVICES_V5_RESTING_PROGRESS } from "./servicesDataV4";
