import { PORTFOLIO_FILTERS, PORTFOLIO_PROJECTS } from "./portfolioProjectsV3";

// Phase 1 safety boundary: the routed site still imports portfolioProjectsV3 directly.
// This adapter makes the fallback explicit before any CMS read path is introduced.
export const COMPILED_PORTFOLIO_FALLBACK_V1 = Object.freeze({
  source: "compiled-fallback",
  filters: PORTFOLIO_FILTERS,
  projects: PORTFOLIO_PROJECTS,
});

export function validatePortfolioSnapshotV1(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.filters) || !Array.isArray(snapshot.projects)) return false;
  if (!snapshot.filters.includes("ALL")) return false;
  const slugs = new Set();
  for (const project of snapshot.projects) {
    if (!project?.id || slugs.has(project.id)) return false;
    slugs.add(project.id);
    if (!project.title || !Array.isArray(project.tags) || project.tags.length === 0) return false;
    const images = (project.rows || []).flatMap((row) => row.images || []);
    if (images.length === 0 || images.some((image) => !image.alt || !["BEFORE", "DURING", "AFTER"].includes(image.phase))) return false;
    if (!project.cover?.src || !images.some((image) => image.src === project.cover.src)) return false;
  }
  return true;
}
