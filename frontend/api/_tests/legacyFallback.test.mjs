import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const legacy = require("../legacy.js");

test("accepts a substantial real WordPress article", () => {
  const html = `<html><body><article>${"Oak Park construction article. ".repeat(500)}</article></body></html>`;
  assert.equal(legacy.isUsableArticle(200, "text/html; charset=UTF-8", html), true);
});

test("rejects SiteGround challenge pages even when they are HTML", () => {
  const challenge = '<html><meta http-equiv="refresh" content="0;url=/.well-known/sgcaptcha/test"><body>sg-captcha</body></html>';
  assert.equal(legacy.isUsableArticle(202, "text/html", challenge), false);
  assert.equal(legacy.isUsableArticle(200, "text/html", challenge.repeat(200)), false);
});

test("rejects upstream errors, tiny pages, non-HTML, and the React shell", () => {
  assert.equal(legacy.isUsableArticle(404, "text/html", "x".repeat(20000)), false);
  assert.equal(legacy.isUsableArticle(200, "text/html", "tiny"), false);
  assert.equal(legacy.isUsableArticle(200, "application/json", "x".repeat(20000)), false);
  assert.equal(legacy.isUsableArticle(200, "text/html", `<div id="root">${"x".repeat(20000)}</div>`), false);
});
