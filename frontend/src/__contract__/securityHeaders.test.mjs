// Security headers contract — T-222.
//
// WHY THIS EXISTS: headers are one JSON key away from silently disappearing,
// and nothing on the page looks different when they do. The 2026-08-26 audit
// found four headers present and no Content Security Policy at all.
//
// The CSP here is REPORT-ONLY on purpose. It cannot be proven safe without a
// deployed preview, and an enforcing policy that blocks the runtime JSON-LD or
// a three.js blob worker would white-screen the site with no obvious cause.
// Report-Only cannot break a page; it collects violations so the enforcing
// switch can be flipped from evidence instead of hope.
//
// DELIBERATELY ABSENT: Strict-Transport-Security. HSTS is not safely
// reversible — once a browser has pinned the host to HTTPS, a rollback to
// SiteGround with a certificate problem becomes unreachable for that visitor
// for the full max-age. It belongs after the DNS cutover is proven, not
// before it. See T-223.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const vercel = JSON.parse(readFileSync(join(here, "..", "..", "vercel.json"), "utf8"));

const block = vercel.headers.find((h) => h.source === "/(.*)");
const headers = Object.fromEntries(block.headers.map((h) => [h.key, h.value]));

test("the baseline hardening headers cover every route", () => {
  assert.ok(block, "no catch-all header block");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.equal(headers["X-Frame-Options"], "SAMEORIGIN");
  assert.match(headers["Permissions-Policy"], /camera=\(\)/);
  assert.match(headers["Permissions-Policy"], /microphone=\(\)/);
  assert.match(headers["Permissions-Policy"], /geolocation=\(\)/);
});

test("a Content Security Policy exists and stays report-only until proven", () => {
  const csp = headers["Content-Security-Policy-Report-Only"];
  assert.ok(csp, "no CSP at all");
  assert.equal(
    headers["Content-Security-Policy"],
    undefined,
    "CSP was switched to enforcing — confirm on a preview that JSON-LD, fonts, GA and the three.js blob worker all still load before this assertion is changed",
  );
  for (const directive of [
    "default-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ]) {
    assert.ok(csp.includes(directive), `CSP is missing ${directive}`);
  }
  // The things the app genuinely needs; removing any of these would make the
  // eventual enforcing policy break the page.
  assert.ok(csp.includes("https://fonts.gstatic.com"), "web fonts would be blocked");
  assert.ok(csp.includes("blob:"), "three.js textures and workers would be blocked");
  assert.ok(
    csp.includes("https://www.googletagmanager.com"),
    "analytics would be blocked once it is switched on",
  );
});

test("HSTS is not shipped before the cutover is reversible", () => {
  assert.equal(
    headers["Strict-Transport-Security"],
    undefined,
    "HSTS pins visitors to HTTPS for its max-age and would obstruct the documented SiteGround rollback; add it after the cutover is proven",
  );
});

test("no server-side secret is exposed to the browser bundle", () => {
  // Anything named REACT_APP_* is inlined into the JavaScript at build time.
  // The SMTP credentials must therefore never carry that prefix.
  const api = readFileSync(join(here, "..", "..", "api", "enquiries.mjs"), "utf8");
  const serverEnv = [...api.matchAll(/env\.([A-Z0-9_]+)/g)].map((m) => m[1]);
  assert.ok(serverEnv.includes("OPC_SMTP_PASS"), "the SMTP password variable moved");
  for (const name of serverEnv) {
    assert.ok(
      !name.startsWith("REACT_APP_"),
      `${name} is read by the server but is named so the client bundle would inline it`,
    );
  }
});
