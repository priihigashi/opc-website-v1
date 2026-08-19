export const SERVICES_V3 = [
  { slug: "full-renovation", label: "Full Renovation", kind: "renovation", duration: 3.6, target: 0.39 },
  { slug: "kitchen", label: "Kitchen", kind: "kitchen", duration: 3.2, target: 0.39 },
  { slug: "bathroom", label: "Bathroom", kind: "bathroom", duration: 3.2, target: 0.39 },
  { slug: "new-construction", label: "New Construction", kind: "build", duration: 3.6, target: 0.2 },
  { slug: "additions", label: "Additions", kind: "addition", duration: 3.3, target: 0.54 },
  { slug: "shell-construction", label: "Shell Construction", kind: "shell", duration: 3.3, target: 0.2 },
  { slug: "outdoor-living", label: "Outdoor Living", kind: "outdoor", duration: 3.4, target: 0.71 },
  { slug: "concrete-pavers", label: "Concrete + Pavers", kind: "concrete", duration: 3.2, target: 0.89 },
];

export const SERVICES_V3_BY_SLUG = Object.fromEntries(
  SERVICES_V3.map((service) => [service.slug, service])
);

export const SERVICES_V3_RESTING_PROGRESS = 0.09;
