import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");
const sourcePath = join(repoRoot, "frontend", "src", "data", "portfolioProjectsLaunchV1.js");
const outputPath = join(here, "..", "migrations", "current-portfolio.ndjson");
const source = await readFile(sourcePath, "utf8");

const executable = `${source.replaceAll("export const ", "const ")}\nresult = { PORTFOLIO_FILTERS, PORTFOLIO_PROJECTS };`;
const context = { result: null };
vm.runInNewContext(executable, context, { filename: sourcePath, timeout: 1000 });

const slugify = (value) => value.toLowerCase().replaceAll("+", "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const categoryId = (name) => `portfolioCategory.${slugify(name)}`;
const key = (value) => createHash("sha1").update(value).digest("hex").slice(0, 12);
const filters = context.result.PORTFOLIO_FILTERS.filter((name) => name !== "ALL");

const docs = filters.map((name, index) => ({
  _id: categoryId(name),
  _type: "portfolioCategory",
  title: name,
  slug: { _type: "slug", current: slugify(name) },
  order: index + 1,
  archived: false,
}));

for (const [projectIndex, project] of context.result.PORTFOLIO_PROJECTS.entries()) {
  const sequences = project.rows.map((sequence, sequenceIndex) => ({
    _type: "gallerySequence",
    _key: key(`${project.id}:sequence:${sequenceIndex}`),
    label: sequence.label,
    phases: [...new Set(sequence.images.map((image) => image.phase))],
    images: sequence.images.map((image, imageIndex) => ({
      _type: "image",
      _key: key(`${project.id}:${sequenceIndex}:${image.id || imageIndex}`),
      legacyPath: image.src,
      sourceMetadata: { _type: "object", id: image.id, w: image.w, h: image.h, widths: image.widths, seq: image.seq, orientation: image.orientation, originalRole: image.role },
      alt: image.alt,
      phase: image.phase,
      role: image.src === project.cover.src ? "cover" : "gallery",
      approvedForPublicUse: true,
      archived: false,
    })),
  }));

  docs.push({
    _id: `portfolioProject.${project.id}`,
    _type: "portfolioProject",
    title: project.title,
    slug: { _type: "slug", current: project.id },
    categories: project.tags.map((name) => ({ _type: "reference", _ref: categoryId(name), _key: key(`${project.id}:${name}`) })),
    primaryCategory: project.cat,
    statusLabel: project.phase,
    detail: project.detail,
    intro: project.intro,
    featured: Boolean(project.featured),
    progressOnly: Boolean(project.progressOnly),
    imageCount: sequences.reduce((total, sequence) => total + sequence.images.length, 0),
    order: projectIndex + 1,
    archived: false,
    sequences,
  });
}

docs.push({
  _id: "portfolioSettings",
  _type: "portfolioSettings",
  eyebrow: "Portfolio · South Florida",
  headline: "Our Projects",
  headlineAccent: "See the Work",
  intro: "Open a project to see finished photos and construction progress in order. Full-home projects stay together, so you can follow the complete transformation.",
  ctaLabel: "Start a Project",
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${docs.map((doc) => JSON.stringify(doc)).join("\n")}\n`, "utf8");
console.log(`Wrote ${docs.length} documents to ${outputPath}`);
