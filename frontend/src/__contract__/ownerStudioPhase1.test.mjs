import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const frontend = join(here, "..", "..");
const repo = join(frontend, "..");
const read = (path) => readFileSync(join(repo, path), "utf8");

test("owner Studio ships as an isolated versioned workspace", () => {
  for (const path of [
    "studio/sanity.config.ts",
    "studio/src/schemaTypes/documents/portfolioCategory.ts",
    "studio/src/schemaTypes/documents/portfolioProject.ts",
    "studio/src/schemaTypes/objects/galleryImage.ts",
    "studio/src/schemaTypes/objects/gallerySequence.ts",
    "studio/scripts/export-current-portfolio.mjs",
    "studio/scripts/import-current-portfolio.mjs",
  ]) assert.equal(existsSync(join(repo, path)), true, `${path} missing`);
});

test("public portfolio remains on the compiled approved data during Phase 1", () => {
  assert.match(read("frontend/src/pages/PortfolioV8.jsx"), /portfolioProjectsV3/);
  assert.match(read("frontend/src/pages/ProjectGalleryV4.jsx"), /portfolioProjectsV3/);
  assert.doesNotMatch(read("frontend/src/AppV6.js"), /studio|sanity|portfolioContentAdapterV1/i);
});

test("Studio removes destructive delete from owner-managed content", () => {
  const config = read("studio/sanity.config.ts");
  assert.match(config, /portfolioCategory/);
  assert.match(config, /portfolioProject/);
  assert.match(config, /releaseSnapshot/);
  assert.match(config, /action\.action !== "delete"/);
});

test("migration importer is dry-run first and blocks accidental production writes", () => {
  const importer = read("studio/scripts/import-current-portfolio.mjs");
  assert.match(importer, /--apply/);
  assert.match(importer, /--allow-production/);
  assert.match(importer, /SANITY_API_WRITE_TOKEN/);
  assert.match(importer, /dataset === "production"/);
  assert.match(importer, /target documents already exist/);
  assert.match(importer, /createIfNotExists/);
  assert.doesNotMatch(importer, /createOrReplace/);
});

test("image and project schemas enforce the publish-critical metadata", () => {
  const image = read("studio/src/schemaTypes/objects/galleryImage.ts");
  const sequence = read("studio/src/schemaTypes/objects/gallerySequence.ts");
  const project = read("studio/src/schemaTypes/documents/portfolioProject.ts");
  for (const required of ["alt", "phase", "approvedForPublicUse"]) assert.match(image, new RegExp(required));
  for (const format of ["image/jpeg", "image/png", "image/webp", "image/avif"]) assert.match(sequence, new RegExp(format));
  assert.match(image, /archived/);
  assert.match(sequence, /type: "image"/);
  assert.match(project, /exactly one project cover photo/i);
  assert.match(project, /categories/);
  assert.match(project, /archived/);
});

test("no CMS write credential or deploy hook is embedded in browser source", () => {
  const all = [
    read("frontend/src/data/portfolioContentAdapterV1.js"),
    read("studio/sanity.config.ts"),
    read("studio/README.md"),
  ].join("\n");
  assert.doesNotMatch(all, /SANITY_API_WRITE_TOKEN\s*=|VERCEL_DEPLOY_HOOK\s*=|Bearer\s+[A-Za-z0-9_-]{20,}/);
});
