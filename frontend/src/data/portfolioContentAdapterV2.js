// Pure content preparation only: no CMS connection, credentials, storage or publishing.
const PHASES = new Set(["BEFORE", "DURING", "AFTER"]);
const fail = (message) => { throw new Error(`Portfolio draft: ${message}`); };
const requiredText = (value, name, limit = 360) => {
  if (typeof value !== "string" || !value.trim() || value.length > limit) fail(`invalid ${name}`);
  return value.trim();
};

function validateImageGeometry(image) {
  if (!Number.isInteger(image.w) || image.w <= 0 || !Number.isInteger(image.h) || image.h <= 0) fail("photo dimensions required");
  if (!Array.isArray(image.widths) || !image.widths.length || image.widths.some((width, index) => !Number.isInteger(width) || width <= 0 || (index > 0 && width <= image.widths[index - 1]))) fail("ordered derivative widths required");
}

function normalizeImage(image) {
  if (!image || typeof image !== "object") fail("missing photo");
  const id = requiredText(image.id, "photo ID", 160);
  // Current gallery consumes prepared derivative stems. Raw uploads must first be
  // prepared by a trusted image pipeline; never guess derivative URLs from a CMS ID.
  if (typeof image.src !== "string" || !/^\/images\/opc\/[a-zA-Z0-9_/-]+$/.test(image.src) || image.src.includes("..")) fail("photo needs a prepared OPC derivative path");
  validateImageGeometry(image);
  if (!PHASES.has(image.phase)) fail("photo phase must be Before, During or Finished");
  return { ...image, id, alt: requiredText(image.alt, "photo description", 180), widths: [...image.widths], orientation: image.w >= image.h ? "landscape" : "portrait" };
}

function normalizeRows(project) {
  if (!Array.isArray(project.rows) || !project.rows.length) fail("project needs a photo sequence");
  const rows = project.rows.map((row) => {
    if (!Array.isArray(row.images) || !row.images.length) fail("empty photo sequence");
    const images = row.images.map(normalizeImage);
    if (new Set(images.map((image) => image.id)).size !== images.length) fail("duplicate photo IDs within one sequence");
    return { ...row, label: requiredText(row.label, "sequence title", 120), images, phases: [...new Set(images.map((image) => image.phase))] };
  });
  const images = rows.flatMap((row) => row.images);
  const identities = new Map();
  for (const image of images) {
    if (identities.has(image.id) && identities.get(image.id) !== image.src) fail("one photo ID refers to different images");
    identities.set(image.id, image.src);
  }
  const matches = images.filter((image) => image.src === project.cover?.src);
  if (matches.length !== 1) fail("cover must be one photo in this project");
  const cover = matches[0];
  return { rows, images, cover };
}

export function normalizePortfolioProjectV2(project) {
  if (!project || typeof project !== "object") fail("missing project");
  const id = requiredText(project.id, "project URL", 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail("invalid project URL");
  if (!Array.isArray(project.tags) || !project.tags.length || new Set(project.tags).size !== project.tags.length) fail("project categories required and must be unique");
  const tags = project.tags.map((tag) => requiredText(tag, "category", 60));
  const { rows, images, cover } = normalizeRows(project);
  const cat = requiredText(project.cat, "primary category", 60);
  if (!tags.includes(cat)) fail("primary category must belong to project categories");
  return { ...project, id, title: requiredText(project.title, "project name", 100), tags, cat,
    phase: requiredText(project.phase, "project status", 60), detail: requiredText(project.detail, "card description", 120),
    intro: requiredText(project.intro, "project introduction"), rows, cover, imageCount: images.length,
    featured: Boolean(project.featured), progressOnly: Boolean(project.progressOnly) };
}

export function normalizePortfolioSnapshotV2(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.filters) || snapshot.filters[0] !== "ALL" || new Set(snapshot.filters).size !== snapshot.filters.length) fail("unique categories beginning with ALL required");
  const filters = snapshot.filters.map((value) => requiredText(value, "category", 60));
  if (!Array.isArray(snapshot.projects)) fail("projects must be an array");
  const projects = snapshot.projects.map(normalizePortfolioProjectV2);
  if (new Set(projects.map((project) => project.id)).size !== projects.length) fail("duplicate project URLs");
  if (projects.some((project) => project.tags.some((tag) => !filters.includes(tag)))) fail("unknown project category");
  return { source: "prepared-draft", filters, projects };
}

// Converts migration/test documents to the exact renderer shape. New CMS uploads
// intentionally stop here until authenticated asset preparation is implemented.
export function normalizeStudioDocumentsV2(documents) {
  if (!Array.isArray(documents)) fail("documents must be an array");
  const active = documents.filter((doc) => !doc.archived);
  const categories = active.filter((doc) => doc._type === "portfolioCategory").sort((a, b) => a.order - b.order);
  const categoryNames = new Map(categories.map((doc) => [doc._id, doc.title]));
  const projects = active.filter((doc) => doc._type === "portfolioProject").sort((a, b) => a.order - b.order).map((doc) => {
    const covers = [];
    const rows = (doc.sequences || []).map((sequence) => ({
      label: sequence.label,
      images: (sequence.images || []).filter((photo) => !photo.archived).map((photo) => {
        if (photo.approvedForPublicUse !== true) fail("photo awaits public-use review");
        if (photo.asset || !photo.legacyPath) fail("uploaded photo needs authenticated asset preparation");
        const meta = photo.sourceMetadata || {};
        const image = { id: meta.id, src: photo.legacyPath, w: meta.w, h: meta.h, widths: meta.widths,
          ...(meta.formats ? { formats: meta.formats } : {}), seq: meta.seq, orientation: meta.orientation, role: meta.originalRole,
          alt: photo.alt, phase: photo.phase };
        if (photo.role === "cover") covers.push(image);
        return image;
      }),
    })).filter((row) => row.images.length);
    if (covers.length !== 1) fail("choose exactly one active cover");
    return { id: doc.slug?.current, title: doc.title,
      tags: (doc.categories || []).map((ref) => categoryNames.get(ref._ref)), cat: doc.primaryCategory,
      phase: doc.statusLabel, detail: doc.detail, intro: doc.intro, featured: doc.featured,
      progressOnly: doc.progressOnly, cover: covers[0], rows };
  });
  return normalizePortfolioSnapshotV2({ filters: ["ALL", ...categories.map((doc) => doc.title)], projects });
}
