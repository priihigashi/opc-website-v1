import http from "node:http";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const handler = require("../api/legacy.js");
const manifest = require("../src/data/legacyBlogPaths.json");
const server = http.createServer(handler);
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const bad = [];
let ok = 0, i = 0;
for (const p of manifest.paths) {
  i++;
  try {
    const res = await fetch(base + p, { redirect: "manual" });
    const body = await res.text();
    if (res.status === 200 && body.length > 20000 && !body.includes('id="root"')) ok++;
    else bad.push({ p, status: res.status, bytes: body.length });
  } catch (e) { bad.push({ p, status: "ERR", bytes: 0, e: String(e).slice(0, 60) }); }
  if (i % 50 === 0) console.log(`  ...${i}/${manifest.paths.length}`);
}
server.close();
console.log(`\n200-with-real-body: ${ok}/${manifest.paths.length}`);
if (bad.length) { console.log("FAILURES:"); bad.slice(0, 15).forEach((b) => console.log("  ", b.status, b.bytes, b.p)); }
process.exit(bad.length ? 1 : 0);
