import { SERVICES_V3 } from "./servicesDataV3";

export const SERVICES_V4 = SERVICES_V3.map((service) => ({
  ...service,
  revealMs: Math.round(service.duration * 1000),
  holdMs: service.kind === "build" ? 1350 : 1200,
  handoffMs: 250,
}));

export const SERVICES_V4_BY_SLUG = Object.fromEntries(
  SERVICES_V4.map((service) => [service.slug, service])
);

export { SERVICES_V3_RESTING_PROGRESS as SERVICES_V4_RESTING_PROGRESS } from "./servicesDataV3";
