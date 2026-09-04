// Integration tests for the handler itself: the branches the live preview
// cannot reach while the configuration gate is closed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { operationalErrorTag } from "../enquiries.mjs";

// Point SMTP at a closed local port so the "delivery attempted and failed"
// branch is exercised without sending mail or needing a real credential.
const CONFIGURED = {
  OPC_LEAD_TO: "leads@example.test",
  OPC_SMTP_USER: "sender@example.test",
  OPC_SMTP_PASS: "not-a-real-password",
  OPC_SMTP_HOST: "127.0.0.1",
  OPC_SMTP_PORT: "1",
};

function mockRes() {
  const res = { statusCode: 0, headers: {}, body: null };
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  res.end = (payload) => { res.body = payload ? JSON.parse(payload) : null; };
  return res;
}

function mockReq(method, body, ip = "203.0.113.7") {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return {
    method,
    headers: { "x-forwarded-for": ip },
    socket: { remoteAddress: ip },
    async *[Symbol.asyncIterator]() { if (raw) yield raw; },
  };
}

async function call(method, body, { env = CONFIGURED, ip } = {}) {
  const saved = { ...process.env };
  Object.assign(process.env, env);
  for (const k of ["OPC_LEAD_TO", "OPC_SMTP_USER", "OPC_SMTP_PASS"]) if (!(k in env)) delete process.env[k];
  // Cache-bust so each case gets a fresh in-memory rate-limit bucket.
  const { default: handler } = await import(`../enquiries.mjs?t=${Math.random()}`);
  const res = mockRes();
  await handler(mockReq(method, body, ip), res);
  process.env = saved;
  return res;
}

const valid = () => ({
  name: "Dana Whitfield",
  email: "dana@example.com",
  phone: "954-555-0142",
  service: "Kitchen + Bath Remodel",
  message: "We are planning a full kitchen remodel in Pompano Beach and want an estimate.",
  company: "",
  startedAt: Date.now() - 30_000,
});

test("operational error logs cannot echo provider prose or contact details", () => {
  const tag = operationalErrorTag({
    code: "EENVELOPE",
    responseCode: 550,
    message: "Mailbox dana@example.com rejected for Dana Whitfield at 954-555-0142",
  });
  assert.equal(tag, "code=EENVELOPE response=550");
  assert.ok(!tag.includes("dana@example.com"));
  assert.ok(!tag.includes("Dana Whitfield"));
  assert.ok(!tag.includes("954-555-0142"));
});

test("GET is rejected and advertises POST", async () => {
  const res = await call("GET", null);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, "POST");
});

test("with no configuration it answers config_pending so the UI can fall back", async () => {
  const res = await call("POST", valid(), { env: {} });
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, "config_pending");
});

test("a partial configuration is still config_pending, not a half-working send", async () => {
  const res = await call("POST", valid(), { env: { OPC_LEAD_TO: "leads@example.test" } });
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, "config_pending");
});

test("a valid Web3Forms enquiry is screened then cleared for browser delivery", async () => {
  const res = await call("POST", { ...valid(), deliveryProvider: "web3forms" }, { env: {} });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.code, "validated");
});

test("Web3Forms configuration preserves field validation and honeypot handling", async () => {
  const invalid = await call("POST", { ...valid(), email: "nope", deliveryProvider: "web3forms" }, { env: {} });
  assert.equal(invalid.statusCode, 400);
  assert.equal(invalid.body.code, "invalid");
  const spam = await call("POST", { ...valid(), company: "Acme SEO", deliveryProvider: "web3forms" }, { env: {} });
  assert.equal(spam.statusCode, 200);
  assert.equal(spam.body.code, "received");
});

test("malformed JSON is a 400, not a crash", async () => {
  const res = await call("POST", "{oops");
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.code, "malformed_json");
});

test("field errors come back as 400 with per-field messages", async () => {
  const res = await call("POST", { ...valid(), email: "nope", name: "" });
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.code, "invalid");
  assert.ok(res.body.errors.email);
  assert.ok(res.body.errors.name);
});

test("a honeypot submission gets a 200 so a bot learns nothing", async () => {
  const res = await call("POST", { ...valid(), company: "Acme SEO" });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.code, "received");
});

test("a fast otherwise-valid human enquiry reaches delivery instead of opaque rejection", async () => {
  const res = await call("POST", { ...valid(), startedAt: Date.now() - 200 });
  // SMTP is intentionally down. Reaching send_failed proves the handler tried
  // delivery; the broken implementation returns 200/received before SMTP.
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.code, "send_failed");
});

test("a no-JS multilingual enquiry with one link still reaches delivery", async () => {
  const { startedAt, ...noTiming } = valid();
  const res = await call("POST", {
    ...noTiming,
    message: "厨房 remodel inspiration: https://example.com/our-layout",
  });
  // Missing timing + one link + non-Latin text are all weak signals. Even in
  // combination they must never enter the opaque rejection branch.
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.code, "send_failed");
});

test("a known spam pitch keeps the opaque 200 response", async () => {
  const res = await call("POST", {
    ...valid(),
    message: "We provide SEO services and link building for construction companies.",
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.code, "received");
});

test("a valid enquiry reaches delivery and reports failure honestly when SMTP is down", async () => {
  const res = await call("POST", valid());
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.code, "send_failed");
  assert.ok(res.body.message);
});

test("the sixth submission from one IP inside the window is rate limited", async () => {
  const saved = { ...process.env };
  Object.assign(process.env, CONFIGURED);
  const { default: handler } = await import(`../enquiries.mjs?t=${Math.random()}`);
  const ip = "198.51.100.42";
  const codes = [];
  for (let i = 0; i < 6; i += 1) {
    const res = mockRes();
    // Honeypot keeps each call cheap and off the network while still consuming a slot.
    await handler(mockReq("POST", { ...valid(), company: "bot" }, ip), res);
    codes.push(res.statusCode);
  }
  process.env = saved;
  assert.deepEqual(codes.slice(0, 5), [200, 200, 200, 200, 200]);
  assert.equal(codes[5], 429, "the 6th request in the window should be throttled");
});

test("responses are never cached", async () => {
  const res = await call("POST", valid(), { env: {} });
  assert.equal(res.headers["cache-control"], "no-store");
});

test("OPC_LEAD_TO accepts a comma-separated recipient list", async () => {
  // Answers an open operational question: a second recipient can be added later
  // by editing configuration alone, with no code change. Delivery still has to be
  // proven for each address separately before relying on it.
  const res = await call("POST", valid(), {
    env: { ...CONFIGURED, OPC_LEAD_TO: "first@example.test, second@example.test" },
  });
  // SMTP is pointed at a closed port, so reaching send_failed proves the address
  // list was accepted and delivery was attempted rather than rejected as invalid.
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.code, "send_failed");
});

test("OPC_LEAD_BCC is optional and never required for delivery", async () => {
  const withBcc = await call("POST", valid(), { env: { ...CONFIGURED, OPC_LEAD_BCC: "archive@example.test" } });
  assert.equal(withBcc.statusCode, 502, "bcc must not change the delivery path");
});
