import { SERVICE_CONTENT_V2, SERVICE_PROCESS } from "./serviceContentV2";

const CONTENT_REFINEMENTS = {
  "new-construction": {
    body: "We coordinate new residential construction from early project planning through structural work, building systems, interiors and exterior completion, based on the property and approved project documents.",
    bullets: ["Early project and scope coordination", "Foundation, shell and roof construction", "Interior construction and finishes", "Exterior and hardscape coordination"],
  },
  additions: {
    bullets: ["Bedroom, office and family-room additions", "Existing-condition and structural tie-in review", "Roofline and finish integration", "Construction sequencing with the existing home"],
  },
  "shell-construction": {
    body: "Residential shell work brings together foundations, reinforced slabs, masonry walls, columns, beams and roof systems according to the project's approved documents and construction sequence.",
    bullets: ["Foundations and reinforced slabs", "Masonry walls, columns and beams", "Roof structures and dry-in", "Trade sequencing and site coordination"],
  },
};

const PROOF_LINKS = {
  "full-renovation": "/portfolio?category=FULL%20HOME%20REMODELS#portfolio-projects",
  kitchen: "/portfolio?category=KITCHENS%20%2B%20BATHROOMS#portfolio-projects",
  bathroom: "/portfolio?category=KITCHENS%20%2B%20BATHROOMS#portfolio-projects",
  "new-construction": "/portfolio?category=SHELL%20%2B%20NEW%20BUILD#portfolio-projects",
  additions: "/portfolio?category=ADDITIONS#portfolio-projects",
  "shell-construction": "/portfolio?category=SHELL%20%2B%20NEW%20BUILD#portfolio-projects",
  "outdoor-living": "/portfolio?category=OUTDOOR%20LIVING#portfolio-projects",
  "concrete-pavers": "/portfolio?category=CONCRETE#portfolio-projects",
};

export const SERVICE_CONTENT_V3 = Object.fromEntries(
  Object.entries(SERVICE_CONTENT_V2).map(([slug, service]) => [
    slug,
    {
      ...service,
      ...CONTENT_REFINEMENTS[slug],
      proofHref: PROOF_LINKS[slug],
    },
  ])
);

export const SERVICE_AREA_LINE = "Residential projects across Broward, Palm Beach and Miami-Dade, subject to project fit and availability.";
export { SERVICE_PROCESS };
