// Exports the OPC residence factory to a modular GLB with named node groups.
// Run from /app/frontend: node scripts/export-residence.mjs
import { mkdirSync, writeFileSync, copyFileSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tmpDir = path.join(__dirname, ".tmp");
mkdirSync(tmpDir, { recursive: true });
copyFileSync(path.join(__dirname, "../src/three/residenceFactory.js"), path.join(tmpDir, "residenceFactory.mjs"));
copyFileSync(path.join(__dirname, "../src/three/wallMath.js"), path.join(tmpDir, "wallMath.mjs"));

// GLTFExporter browser shims
global.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = b;
      this.onloadend && this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = "data:application/octet-stream;base64," + Buffer.from(b).toString("base64");
      this.onloadend && this.onloadend();
    });
  }
};

const factoryCode = `import * as THREE from "three";\nimport { wallSegments } from "./wallMath.mjs";\n` +
  (await import("fs")).readFileSync(path.join(tmpDir, "residenceFactory.mjs"), "utf8")
    .replace(/import \* as THREE from "three";\n/, "")
    .replace(/import \{ wallSegments \} from "\.\/wallMath";/, "");
writeFileSync(path.join(tmpDir, "residenceFactory.mjs"), factoryCode);

const { buildResidence } = await import("./.tmp/residenceFactory.mjs");
const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");

const { root } = buildResidence();
root.updateMatrixWorld(true);

const exporter = new GLTFExporter();
exporter.parse(
  root,
  (result) => {
    const outDir = path.join(__dirname, "../public/models");
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, "residence.glb"), Buffer.from(result));
    console.log("WROTE public/models/residence.glb", Buffer.from(result).length, "bytes");
    rmSync(tmpDir, { recursive: true, force: true });
  },
  (err) => {
    console.error("EXPORT FAILED", err);
    process.exit(1);
  },
  { binary: true }
);
