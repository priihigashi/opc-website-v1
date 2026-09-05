import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const studioRoot = join(here, "..");
const repoRoot = join(studioRoot, "..");
const migrationPath = join(studioRoot, "migrations", "current-portfolio.ndjson");
const apply = process.argv.includes("--apply");
const allowProduction = process.argv.includes("--allow-production");
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "portfolio-test";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_STUDIO_PROJECT_ID is required.");
if (apply && !token) throw new Error("SANITY_API_WRITE_TOKEN is required with --apply.");
if (apply && dataset === "production" && !allowProduction) {
  throw new Error("Production import is blocked. Verify the test dataset first; then pass --allow-production deliberately.");
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-09-01", useCdn: false });
const docs = (await readFile(migrationPath, "utf8")).trim().split("\n").map(JSON.parse);
const imagePaths = [...new Set(docs
  .filter((doc) => doc._type === "portfolioProject")
  .flatMap((doc) => doc.sequences)
  .flatMap((sequence) => sequence.images)
  .map((image) => image.legacyPath))];

async function existingImageFile(legacyPath) {
  const base = join(repoRoot, "frontend", "public", legacyPath);
  const stem = basename(base);
  const files = await readdir(dirname(base));
  const candidates = files
    .map((name) => {
      const match = name.match(new RegExp(`^${stem}-(\\d+)w\\.(jpg|webp|avif)$`));
      return match ? { name, width: Number(match[1]), format: match[2] } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (b.width - a.width) || ({ jpg: 0, webp: 1, avif: 2 }[a.format] - { jpg: 0, webp: 1, avif: 2 }[b.format]));
  if (candidates[0]) return join(dirname(base), candidates[0].name);
  throw new Error(`No approved source derivative found for ${legacyPath}`);
}

const files = new Map();
for (const legacyPath of imagePaths) files.set(legacyPath, await existingImageFile(legacyPath));

console.log(`Validated ${docs.length} documents and ${files.size} unique approved images for dataset ${dataset}.`);
if (!apply) {
  console.log("Dry run only. Re-run with --apply and a write token after reviewing the test dataset target.");
  process.exit(0);
}

const documentIds = docs.map((doc) => doc._id);
const collisions = await client.fetch(`*[_id in $documentIds][]._id`, { documentIds });
if (collisions.length) {
  throw new Error(`Import stopped: ${collisions.length} target documents already exist (${collisions.slice(0, 5).join(", ")}). This migration never replaces owner content.`);
}

const assets = new Map();
let uploaded = 0;
for (const [legacyPath, filePath] of files) {
  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename: filePath.split("/").pop(),
    label: "Approved OPC website migration",
  });
  assets.set(legacyPath, { _type: "reference", _ref: asset._id });
  uploaded += 1;
  console.log(`Uploaded ${uploaded}/${files.size}: ${legacyPath}`);
}

const migrated = docs.map((doc) => {
  if (doc._type !== "portfolioProject") return doc;
  return {
    ...doc,
    sequences: doc.sequences.map((sequence) => ({
      ...sequence,
      images: sequence.images.map(({ legacyPath, ...image }) => ({
        ...image,
        asset: assets.get(legacyPath),
      })),
    })),
  };
});

let transaction = client.transaction();
for (const doc of migrated) transaction = transaction.createIfNotExists(doc);
await transaction.commit({ tag: "opc.portfolio.initial-migration" });
console.log(`Imported ${migrated.length} documents. Existing approved files remain unchanged in the website repository.`);
