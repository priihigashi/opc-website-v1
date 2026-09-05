import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const launchModule = await import(new URL("../data/portfolioProjectsLaunchV1.js", import.meta.url));
const { PORTFOLIO_PROJECTS } = launchModule;

// Priscila added the Boutique Buildout on 2026-08-28: the black-marble commercial
// fit-out. Her words: "those are the main commercial place… that one is way better
// than the one we are highlighting right now."
// Was a hardcoded 4-project allowlist from the confidence review. Her ruling 2026-09-03:
// "I never asked for three projects only." The published set is now whatever the dataset
// declares — so this contract guards the thing that actually matters (no HELD project may
// appear, every category a filter offers must be real) rather than freezing a count.
const expectedIds = PORTFOLIO_PROJECTS.map(({ id }) => id);
// Only two projects remain held for privacy/completeness review.
const HELD_IDS = ["miami-new-build", "weston-new-build"];
const HELD_WORDS = ["clark", "kinney", "harbor court", "harbor-court"];
const heldIds = HELD_IDS;

test("launch Portfolio contains exactly the Council-cleared review batch", () => {
  const ids = PORTFOLIO_PROJECTS.map(({ id }) => id);
  const leaked = ids.filter((id) => HELD_IDS.includes(id));
  assert.deepEqual(leaked, [], `a HELD project is published: ${leaked}`);
  assert.equal(ids.length, 12, `expected the 12-project launch set, found ${ids.length}`);
  assert.equal(PORTFOLIO_PROJECTS.flatMap((project) => project.rows.flatMap((row) => row.images)).length, 82);
  const blob = JSON.stringify(PORTFOLIO_PROJECTS).toLowerCase();
  const words = HELD_WORDS.filter((w) => blob.includes(w));
  assert.deepEqual(words, [], `a client surname or street address is public: ${words}`);
});

test("Portfolio restores the category filter menu and gives every filtered result a way back to all projects", async () => {
  const page = await read("../pages/PortfolioV10.jsx");
  assert.match(page, /const SHOW_CATEGORY_MENU = true/);
  assert.match(page, /SHOW_CATEGORY_MENU && <nav/);
  assert.match(page, /filter !== "ALL"[\s\S]*View all projects/);
  assert.match(page, /projectPhotoCount\(project\)/);
  assert.doesNotMatch(page, /\{project\.phase\} · \{project\.imageCount\}/);
});

test("launch Portfolio exposes no private source fields or Drive-style IDs", async () => {
  const source = await read("../data/portfolioProjectsLaunchV1.js");
  assert.doesNotMatch(source, /"source"\s*:/, "launch data leaks original filenames");
  assert.doesNotMatch(source, /1[A-Za-z0-9_-]{24,}/, "launch data leaks source-style identifiers");
});

test("every cover is finished or explicitly disclosed as an existing progress-only project; derivatives exist", () => {
  const publicRoot = fileURLToPath(new URL("../../public", import.meta.url));
  for (const project of PORTFOLIO_PROJECTS) {
    const allowedProgress = ["dockside-full-home-remodel", "shell-concrete-construction", "opa-locka-airport", "pompano-patio-slab"];
    if (allowedProgress.includes(project.id)) {
      assert.equal(project.cover.phase, "DURING");
      assert.equal(project.progressOnly, true);
      assert.ok(project.rows.every(row => row.images.every(image => image.phase !== "AFTER")));
    } else assert.equal(project.cover.phase, "AFTER", `${project.id} needs a verified finished cover`);
    for (const image of project.rows.flatMap(({ images }) => images)) {
      for (const width of image.widths) {
        for (const format of (image.formats || ["avif", "webp", "jpg"])) {
          assert.ok(existsSync(`${publicRoot}${image.src}-${width}w.${format}`), `missing ${project.id}: ${image.src}-${width}w.${format}`);
        }
      }
    }
  }
});

test("Salon publishes only canonically confirmed finished frames", () => {
  const salon = PORTFOLIO_PROJECTS.find(({ id }) => id === "salon-buildout");
  assert.ok(salon);
  assert.equal(salon.imageCount, 5);
  assert.deepEqual(salon.rows[0].phases, ["AFTER"]);
  for (const image of salon.rows.flatMap(({ images }) => images)) {
    assert.equal(image.phase, "AFTER");
    assert.doesNotMatch(image.src, /__BEFORE__|__DURING__/);
  }
});

test("active Portfolio consumers use the launch dataset", async () => {
  for (const path of ["../pages/PortfolioV10.jsx", "../pages/ProjectGalleryV4.jsx", "../lib/seoSchemasV1.js"]) {
    assert.match(await read(path), /portfolioProjectsLaunchV1/);
  }
  assert.match(await read("../pages/ProjectGalleryV5.jsx"), /ProjectGalleryV4/);
  assert.match(await read("../AppV20.js"), /pages\/ProjectGalleryV7/);
});

test("SEO and sitemap contain launch routes and exclude held routes", async () => {
  const routes = JSON.parse(await read("../data/seoRoutesV1.json"));
  const sitemap = await read("../../public/sitemap.xml");
  const projectRoutes = Object.entries(routes).filter(([, route]) => route.type === "project");
  assert.deepEqual(projectRoutes.map(([path]) => path).sort(), expectedIds.map((id) => `/portfolio/${id}`).sort());
  for (const id of expectedIds) assert.match(sitemap, new RegExp(`/portfolio/${id}<`));
  for (const id of heldIds) {
    assert.equal(routes[`/portfolio/${id}`], undefined, `${id} remains in SEO routes`);
    assert.doesNotMatch(sitemap, new RegExp(`/portfolio/${id}<`), `${id} remains in sitemap`);
  }
});

test("public-safe project copy contains no client-like pergola name", async () => {
  const [launch, routes, sitemap] = await Promise.all([
    read("../data/portfolioProjectsLaunchV1.js"),
    read("../data/seoRoutesV1.json"),
    read("../../public/sitemap.xml"),
  ]);
  for (const artifact of [launch, routes, sitemap]) assert.doesNotMatch(artifact, /Clark/i);
});

test("Home and Services proof links never target held projects or unrelated ALL results", async () => {
  const [story, services] = await Promise.all([
    read("../components/StoryV14.jsx"),
    read("../pages/serviceContentV3.js"),
  ]);
  for (const artifact of [story, services]) {
    for (const id of heldIds) assert.doesNotMatch(artifact, new RegExp(`/portfolio/${id}`));
  }
  assert.match(story, /category=ADDITIONS/);
  for (const category of ["FULL%20HOME%20REMODELS", "SHELL%20%2B%20NEW%20BUILD", "CONCRETE"]) {
    assert.match(services, new RegExp(`category=${category.replaceAll("+", "\\+")}`));
  }
});

test("production build prunes every held Portfolio derivative", async () => {
  const [packageJson, pruner] = await Promise.all([
    read("../../package.json"),
    read("../../scripts/prune-held-portfolio-assets.mjs"),
  ]);
  assert.match(packageJson, /node scripts\/prune-held-portfolio-assets\.mjs/);
  assert.match(pruner, /Portfolio build containment failed/);
  assert.match(pruner, /PORTFOLIO_PROJECTS/);
});

test("Vercel permanently redirects renamed and held project URLs before the catch-all rewrite", async () => {
  const config = JSON.parse(await read("../../vercel.json"));
  const redirects = new Map(config.redirects.map((entry) => [entry.source, entry]));
  assert.equal(redirects.get("/portfolio/clark-pergola")?.destination, "/portfolio/pergola-outdoor-kitchen");
  for (const id of heldIds) {
    const redirect = redirects.get(`/portfolio/${id}`);
    assert.ok(redirect, `missing held-project redirect for ${id}`);
    assert.equal(redirect.permanent, true);
    assert.match(redirect.destination, /^\/portfolio\?category=/);
  }
  const catchAll = config.rewrites.findIndex((entry) => entry.source === "/portfolio/:path*");
  assert.ok(catchAll >= 0, "Portfolio SPA catch-all is missing");
});

function jpegDimensions(buffer) {
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  for (let offset = 2; offset + 8 < buffer.length;) {
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset++];
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = buffer.readUInt16BE(offset);
    if (sofMarkers.has(marker)) return { w: buffer.readUInt16BE(offset + 5), h: buffer.readUInt16BE(offset + 3) };
    offset += length;
  }
  throw new Error("JPEG dimensions unavailable");
}

test("approved wide Pergola metadata matches its largest public derivative", async () => {
  const project = PORTFOLIO_PROJECTS.find(({ id }) => id === "pergola-outdoor-kitchen");
  const gallery = project.rows.flatMap((row) => row.images).find((image) => image.id === "opc-photo-056");
  assert.deepEqual(project.cover, gallery, "cover metadata must match the verified gallery record");
  const largest = Math.max(...gallery.widths);
  const publicRoot = fileURLToPath(new URL("../../public", import.meta.url));
  const dimensions = jpegDimensions(await readFile(`${publicRoot}${gallery.src}-${largest}w.jpg`));
  assert.deepEqual(dimensions, { w: gallery.w, h: gallery.h });
  assert.deepEqual(dimensions, { w: 1600, h: 900 });
});
