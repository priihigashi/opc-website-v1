import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../../", import.meta.url));
const read = (path) => readFileSync(`${root}/${path}`, "utf8");
const clone = (value) => JSON.parse(JSON.stringify(value));
const adapter = await import(`data:text/javascript;base64,${Buffer.from(read("frontend/src/data/portfolioContentAdapterV2.js")).toString("base64")}`);
const { normalizePortfolioSnapshotV2: snapshot, normalizePortfolioProjectV2: project, normalizeStudioDocumentsV2: documents } = adapter;
const context = { result: null };
vm.runInNewContext(`${read("frontend/src/data/portfolioProjectsLaunchV1.js").replaceAll("export const ", "const ")}\nresult = { filters: PORTFOLIO_FILTERS, projects: PORTFOLIO_PROJECTS };`, context);
const current = clone(context.result);
const migration = read("studio/migrations/current-portfolio.ndjson").trim().split("\n").map(JSON.parse);
const custom = () => {
  const base = clone(current.projects[0]);
  const image = clone(base.cover);
  return { ...base, id: "owner-draft-example", title: "Owner draft example", cover: image, rows: [{ label: "Finished", images: [image] }], imageCount: 999 };
};

test("current approved portfolio survives migration and exact gallery normalization", () => {
  assert.ok(current.projects.length >= 10, "never silently shrink the accepted portfolio");
  assert.deepEqual(documents(migration), snapshot(current));
});
test("a new album uses current template shape and recalculates phases and count without mutating inputs", () => {
  const input = custom(); const original = clone(input); const output = project(input);
  assert.equal(output.imageCount, 1); assert.deepEqual(output.rows[0].phases, [input.cover.phase]);
  assert.deepEqual(input, original); assert.equal(output.id, "owner-draft-example");
});
test("duplicate slugs, duplicate photo IDs, unknown categories and foreign cover are rejected", () => {
  const draft = custom();
  assert.throws(() => snapshot({ filters: current.filters, projects: [draft, draft] }), /duplicate project URLs/);
  const repeated = clone(draft); repeated.rows[0].images.push(clone(draft.cover));
  assert.throws(() => project(repeated), /duplicate photo IDs/);
  const foreignCover = clone(draft); foreignCover.cover.src = "/images/opc/other-project";
  assert.throws(() => project(foreignCover), /cover must/);
  const unknown = clone(draft); unknown.tags = ["UNKNOWN"]; unknown.cat = "UNKNOWN";
  assert.throws(() => snapshot({ filters: current.filters, projects: [unknown] }), /unknown project category/);
});
test("malformed image dimensions, phase, derivative source and alt text fail closed", () => {
  for (const [field, value] of [["w", 0], ["phase", "COMPLETE"], ["src", "javascript:alert(1)"], ["src", "/images/opc/../private"], ["widths", []], ["alt", ""]]) {
    const draft = custom(); draft.rows[0].images[0][field] = value;
    assert.throws(() => project(draft), /Portfolio draft:/);
  }
});
test("CMS uploads and unapproved photos cannot masquerade as prepared preview images", () => {
  const docs = clone(migration); const draft = docs.find((doc) => doc._type === "portfolioProject");
  draft.sequences[0].images[0].approvedForPublicUse = false;
  assert.throws(() => documents(docs), /public-use review/);
  draft.sequences[0].images[0].approvedForPublicUse = true;
  draft.sequences[0].images[0].asset = { _type: "reference", _ref: "asset-not-prepared" };
  assert.throws(() => documents(docs), /authenticated asset preparation/);
});
test("archiving a project is reversible; archiving the sole cover requires replacement", () => {
  const docs = clone(migration); const first = docs.find((doc) => doc._type === "portfolioProject");
  first.archived = true; assert.equal(documents(docs).projects.length, current.projects.length - 1);
  first.archived = false; assert.deepEqual(documents(docs), snapshot(current));
  first.sequences.flatMap((row) => row.images).find((image) => image.role === "cover").archived = true;
  assert.throws(() => documents(docs), /exactly one active cover/);
});
test("gallery preview shares the real renderer without opening a public editor route", () => {
  const gallery = read("frontend/src/pages/ProjectGalleryV7.jsx");
  assert.match(gallery, /export function ProjectGalleryContent\(\{ project \}\)/);
  assert.match(gallery, /<ProjectGalleryV5><RoutedGalleryContent \/><\/ProjectGalleryV5>/);
  assert.match(gallery, /getPortfolioProject\(projectId\)/);
  assert.doesNotMatch(read("frontend/src/AppV20.js"), /path=["'][^"']*(studio|editor|admin)/i);
});
test("isolated owner workspace stays test-first and cannot overwrite imported documents", () => {
  assert.match(read("studio/sanity.config.ts"), /SANITY_STUDIO_DATASET \|\| "portfolio-test"/);
  assert.match(read("studio/scripts/import-current-portfolio.mjs"), /createIfNotExists/);
  assert.doesNotMatch(read("studio/scripts/import-current-portfolio.mjs"), /createOrReplace/);
  assert.match(read("studio/scripts/import-current-portfolio.mjs"), /dataset === "production" && !allowProduction/);
  assert.doesNotMatch(read("studio/scripts/export-current-portfolio.mjs"), /portfolioProjectsV3/);
});
