import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname;
const publicDir = join(root, "public");
const sourceRoots = [join(publicDir, "images", "opc"), join(publicDir, "video")];
const outputDir = join(publicDir, "media", "optimized");
const manifestPath = join(root, "src", "data", "mediaManifestV1.json");
const rasterExtensions = new Set([".jpg", ".jpeg", ".png"]);

const walk = (directory) => readdirSync(directory).flatMap((name) => {
  const absolute = join(directory, name);
  return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
});

const dimension = (file, key) => {
  const result = spawnSync("sips", ["-g", key, file], { encoding: "utf8" });
  const match = result.stdout.match(new RegExp(`${key}:\\s*(\\d+)`));
  if (!match) throw new Error(`Could not read ${key} for ${file}`);
  return Number(match[1]);
};

const encode = (source, output, width, format) => {
  mkdirSync(dirname(output), { recursive: true });
  const codec = format === "webp"
    ? ["-c:v", "libwebp", "-quality", "82", "-compression_level", "5"]
    : ["-c:v", "libaom-av1", "-crf", "31", "-cpu-used", "6", "-still-picture", "1", "-pix_fmt", "yuv420p"];
  const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", source, "-vf", `scale=${width}:-2:flags=lanczos`, "-frames:v", "1", ...codec, output], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || `Failed to encode ${output}`);
};

const sources = sourceRoots.flatMap(walk).filter((file) => {
  const name = file.toLowerCase();
  return rasterExtensions.has(extname(name)) && !name.includes("logo-white");
});

const manifest = {};
for (const source of sources) {
  const publicPath = `/${relative(publicDir, source).split("\\").join("/")}`;
  const sourceWidth = dimension(source, "pixelWidth");
  const sourceHeight = dimension(source, "pixelHeight");
  const widths = [...new Set([640, 1024, Math.min(1600, sourceWidth)].filter((width) => width <= sourceWidth))].sort((a, b) => a - b);
  const relativeBase = relative(publicDir, source).replace(/\.[^.]+$/, "");
  const variants = { width: sourceWidth, height: sourceHeight, avif: [], webp: [] };

  for (const width of widths) {
    for (const format of ["avif", "webp"]) {
      const output = join(outputDir, `${relativeBase}-${width}.${format}`);
      encode(source, output, width, format);
      variants[format].push({ src: `/${relative(publicDir, output).split("\\").join("/")}`, width });
    }
  }
  manifest[publicPath] = variants;
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated responsive derivatives for ${Object.keys(manifest).length} images.`);
