import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const launchModule = await import(new URL("../data/portfolioProjectsLaunchV1.js", import.meta.url));
const { PORTFOLIO_PROJECTS } = launchModule;

const expectedIds = ["salon-buildout", "pergola-outdoor-kitchen", "matte-black-bathroom"];
const heldIds = [
  "victoria-park-residence",
  "harbor-court-residence",
  "dockside-full-home-remodel",
  "shell-construction",
  "miami-new-build",
  "opa-locka-airport",
  "pompano-kitchen-remodel",
  "pompano-patio-slab",
  "concrete-work",
  "weston-new-build",
];

test("launch Portfolio contains exactly the Council-cleared review batch", () => {
  assert.deepEqual(PORTFOLIO_PROJECTS.map(({ id }) => id).sort(), expectedIds.sort());
});

test("launch Portfolio exposes no private source fields or Drive-style IDs", async () => {
  const source = await read("../data/portfolioProjectsLaunchV1.js");
  assert.doesNotMatch(source, /"source"\s*:/, "launch data leaks original filenames");
  assert.doesNotMatch(source, /1[A-Za-z0-9_-]{24,}/, "launch data leaks source-style identifiers");
});

test("every launch cover is finished and every declared derivative exists", () => {
  const publicRoot = fileURLToPath(new URL("../../public", import.meta.url));
  for (const project of PORTFOLIO_PROJECTS) {
    assert.equal(project.cover.phase, "AFTER", `${project.id} does not have a finished cover`);
    for (const image of project.rows.flatMap(({ images }) => images)) {
      for (const width of image.widths) {
        for (const format of ["avif", "webp", "jpg"]) {
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
  for (const path of ["../pages/PortfolioV8.jsx", "../pages/ProjectGalleryV4.jsx", "../lib/seoSchemasV1.js"]) {
    assert.match(await read(path), /portfolioProjectsLaunchV1/);
  }
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
