import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const https = require("node:https");
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

test("accepts a healthy article HEAD without requiring a response body", () => {
  assert.equal(legacy.isUsableArticleHead(200, "text/html; charset=UTF-8", {}), true);
  assert.equal(legacy.isUsableArticleHead(202, "text/html", {}), false);
  assert.equal(legacy.isUsableArticleHead(200, "text/html", { location: "/.well-known/sgcaptcha/test" }), false);
});

test("a known article HEAD preserves 200 and sends no body", async () => {
  const originalRequest = https.request;
  const upstream = new EventEmitter();
  upstream.statusCode = 200;
  upstream.headers = { "content-type": "text/html; charset=UTF-8", "content-length": "271234" };
  upstream.resume = () => {};
  https.request = (_options, onResponse) => {
    const request = new EventEmitter();
    request.end = () => queueMicrotask(() => onResponse(upstream));
    request.destroy = () => {};
    return request;
  };

  const response = await new Promise((resolve, reject) => {
    const headers = new Map();
    const res = {
      statusCode: 0,
      setHeader: (key, value) => headers.set(key.toLowerCase(), value),
      removeHeader: (key) => headers.delete(key.toLowerCase()),
      end: (body) => resolve({ statusCode: res.statusCode, headers, body }),
    };
    try {
      legacy(
        { method: "HEAD", url: "/10-tips-for-a-perfect-bathroom-remodel", headers: {} },
        res
      );
    } catch (error) {
      reject(error);
    }
  }).finally(() => {
    https.request = originalRequest;
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers.get("x-opc-legacy"), "wordpress-origin");
  assert.equal(response.headers.get("content-length"), "271234");
  assert.equal(response.body, undefined);
});
