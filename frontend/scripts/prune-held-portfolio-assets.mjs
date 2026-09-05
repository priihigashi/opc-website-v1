import { readdir, rm } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { PORTFOLIO_PROJECTS } from "../src/data/portfolioProjectsLaunchV1.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const frontendDir = dirname(scriptDir);
const portfolioRoot = join(frontendDir, "build", "images", "opc", "portfolio");

const allowed = new Set(
  PORTFOLIO_PROJECTS.flatMap((project) =>
    project.rows.flatMap((row) =>
      row.images.flatMap((image) =>
        image.widths.flatMap((width) =>
          ["avif", "webp", "jpg"].map((format) => `${image.src.slice(1)}-${width}w.${format}`),
        ),
      ),
    ),
  ),
);

const listFiles = async (root) => {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  }));
  return nested.flat();
};

const removeEmptyDirectories = async (root) => {
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const path = join(root, entry.name);
    await removeEmptyDirectories(path);
    if ((await readdir(path)).length === 0) await rm(path, { recursive: true });
  }
};

const files = await listFiles(portfolioRoot);
for (const file of files) {
  const publicPath = `images/opc/portfolio/${relative(portfolioRoot, file).split(sep).join("/")}`;
  if (!allowed.has(publicPath)) await rm(file);
}
await removeEmptyDirectories(portfolioRoot);

const remaining = (await listFiles(portfolioRoot))
  .map((file) => `images/opc/portfolio/${relative(portfolioRoot, file).split(sep).join("/")}`)
  .sort();
const expected = [...allowed].sort();

if (JSON.stringify(remaining) !== JSON.stringify(expected)) {
  throw new Error(`Portfolio build containment failed: expected ${expected.length} assets, found ${remaining.length}`);
}

console.log(`Portfolio build contains ${remaining.length} approved derivatives across ${PORTFOLIO_PROJECTS.length} projects.`);

// The build also ships a SECOND held-asset tree that this script never touched:
// build/images/opc/projects/. On 2026-09-03 it still contained clark-pergola (a client
// surname), harbor-court-residence, concrete-work and shell-construction — all held.
// Anything here whose directory is not a cleared project is removed from the OUTPUT only;
// nothing under public/ or src/ is deleted.
const CLEARED = new Set(PORTFOLIO_PROJECTS.map((p) => p.id));
const projectsRoot = join(frontendDir, "build", "images", "opc", "projects");
try {
  const dirs = await readdir(projectsRoot, { withFileTypes: true });
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const keep = CLEARED.has(d.name) || /-collection$/.test(d.name);
    if (!keep) {
      await rm(join(projectsRoot, d.name), { recursive: true, force: true });
      console.log(`pruned held project assets: images/opc/projects/${d.name}`);
    }
  }
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}

// Candidate 5: preserve unpublished source cuts for rollback, never deploy them.
if (process.env.REACT_APP_PORTFOLIO_HERO === "full") {
  throw new Error("The unreviewed full portfolio montage cannot ship in the launch build.");
}
const videoRoot = join(frontendDir, "build", "video");
const clearedVideos = new Set(["portfolio-hero-intro-v5.mp4", "portfolio-hero-intro-v5-mobile.mp4", "portfolio-hero-poster-v2.jpg"]);
for (const name of await readdir(videoRoot)) {
  if (!clearedVideos.has(name)) await rm(join(videoRoot, name), { recursive: true, force: true });
}
if (JSON.stringify((await readdir(videoRoot)).sort()) !== JSON.stringify([...clearedVideos].sort())) {
  throw new Error("Reviewed portfolio video output is incomplete.");
}
const deployedFiles = await listFiles(join(frontendDir, "build"));
if (deployedFiles.some(file => /img-(0277|3721)(?:-|\.)/.test(file))) {
  throw new Error("Private house-number photographs remain in deployment output.");
}
console.log("Private house-number photos and unpublished video cuts are absent from deployment output.");
