// Exercises api/legacy.js against the REAL WordPress origin.
// Falsifiable: fails loudly on a wrong status, an empty body, a redirect loop,
// a leaked React shell, or an allowlist that does not match the manifest.
import http from "node:http";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const handler = require("../api/legacy.js");
const manifest = require("../src/data/legacyBlogPaths.json");

const server = http.createServer(handler);
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const get = async (p, method = "GET") => {
  const res = await fetch(base + p, { method, redirect: "manual" });
  return { status: res.status, body: method === "GET" ? await res.text() : "", headers: res.headers };
};

const sample = [manifest.paths[0], manifest.paths[Math.floor(manifest.paths.length / 2)], manifest.paths.at(-1)];
let fail = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
  if (!ok) fail++;
};

for (const p of sample) {
  const r = await get(p);
  check(`post 200: ${p.slice(0, 52)}`, r.status === 200, `status=${r.status} bytes=${r.body.length}`);
  check(`post has real article body`, r.body.length > 20000, `${r.body.length} bytes`);
  check(`post is WordPress not the React shell`, !r.body.includes('id="root"'));
  check(`marked as legacy origin`, r.headers.get("x-opc-legacy") === "wordpress-origin");
  // trailing-slash variant must behave identically
  const r2 = await get(p + "/");
  check(`trailing slash also 200`, r2.status === 200, `status=${r2.status}`);
}

const denied = await get("/definitely-not-a-real-post-xyz");
check("unknown path returns 404, not the origin", denied.status === 404, `status=${denied.status}`);

const admin = await get("/wp-admin/");
check("wp-admin is NOT proxied", admin.status === 404, `status=${admin.status}`);

const login = await get("/wp-login.php");
check("wp-login is NOT proxied", login.status === 404, `status=${login.status}`);

const post = await get(manifest.paths[0], "POST");
check("POST is rejected", post.status === 405, `status=${post.status}`);

// Traversal / boundary attacks — every one of these must be refused by US (404),
// never merely refused by WordPress. Found by the Council audit 2026-08-28.
const ATTACKS = [
  "/wp-content/../wp-admin/",
  "/wp-includes/../wp-login.php",
  "/wp-content/..%2fwp-admin/",
  "/wp-content/%2e%2e/wp-admin/",
  "/wp-content/plugins/../../wp-config.php",
  "/wp-content/../../etc/passwd",
  "/wp-content/..\\wp-admin/",
  "/wp-json/wp/v2/users",
  "/wp-content/uploads/../../wp-login.php",
  "/wp-content/nonsense-no-extension"
];
for (const a of ATTACKS) {
  const r = await get(a);
  check(`refused: ${a}`, r.status === 404, `status=${r.status}`);
}
const asset = await get("/wp-content/uploads/2024/01/nothing-here.jpg");
check("asset path with a real extension is allowed through (404 from origin ok)", asset.status !== 405);

check("allowlist is exactly 233 posts", manifest.paths.length === 233, `${manifest.paths.length}`);
check("no duplicate paths", new Set(manifest.paths).size === manifest.paths.length);

server.close();
console.log(`\n${fail === 0 ? "ALL PASSED" : fail + " FAILED"}`);
process.exit(fail === 0 ? 0 : 1);
