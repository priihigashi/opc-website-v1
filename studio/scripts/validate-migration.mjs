// Offline validation: no account, network, token or writes.
process.on("uncaughtException", (error) => { console.error(error.message); process.exitCode = 1; });
import { readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import vm from "node:vm";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const adapterSource = await readFile(join(root, "frontend/src/data/portfolioContentAdapterV2.js"), "utf8");
const { normalizeStudioDocumentsV2, normalizePortfolioSnapshotV2 } = await import(`data:text/javascript;base64,${Buffer.from(adapterSource).toString("base64")}`);
const docs = (await readFile(join(root, "studio/migrations/current-portfolio.ndjson"), "utf8")).trim().split("\n").map(JSON.parse);
const prepared = normalizeStudioDocumentsV2(docs);
const source = await readFile(join(root, "frontend/src/data/portfolioProjectsLaunchV1.js"), "utf8");
const context = { result: null };
vm.runInNewContext(`${source.replaceAll("export const ", "const ")}\nresult = { filters: PORTFOLIO_FILTERS, projects: PORTFOLIO_PROJECTS };`, context, { timeout: 1000 });
const current = normalizePortfolioSnapshotV2(JSON.parse(JSON.stringify(context.result)));
if (!isDeepStrictEqual(prepared, current)) throw new Error("Migration differs from current approved content; regenerate and review it.");
let files = 0;
for (const project of prepared.projects) for (const image of project.rows.flatMap((row) => row.images)) {
  for (const width of image.widths) for (const format of ["jpg", "webp", "avif"]) {
    await access(join(root, "frontend/public", `${image.src}-${width}w.${format}`));
    files += 1;
  }
}
console.log(`Offline dry run passed: ${prepared.projects.length} projects, ${prepared.projects.reduce((n, p) => n + p.imageCount, 0)} photos, ${files} derivatives; exact current-content round trip. No CMS writes.`);
