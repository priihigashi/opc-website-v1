export const SERVICES_V2 = [
  { slug: "full-renovation", label: "Full Renovation", duration: 1.2, target: 0.09 },
  { slug: "kitchen", label: "Kitchen", duration: 1.35, target: 0.39 },
  { slug: "bathroom", label: "Bathroom", duration: 1.35, target: 0.39 },
  { slug: "new-construction", label: "New Construction", duration: 1.4, target: 0.2 },
  { slug: "additions", label: "Additions", duration: 1.45, target: 0.54 },
  { slug: "shell-construction", label: "Shell Construction", duration: 1.35, target: 0.22 },
  { slug: "outdoor-living", label: "Outdoor Living", duration: 1.45, target: 0.71 },
  { slug: "concrete-pavers", label: "Concrete + Pavers", duration: 1.4, target: 0.89 },
];

export const SERVICES_V2_BY_SLUG = Object.fromEntries(
  SERVICES_V2.map((service) => [service.slug, service])
);

export const SERVICES_V2_RESTING_PROGRESS = 0.09;
