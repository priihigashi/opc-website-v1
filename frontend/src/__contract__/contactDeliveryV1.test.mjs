import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { postEnquiry } from "../components/contactDeliveryV1.js";

const payload = { name: "Test", email: "test@example.com", service: "Addition", message: "Test enquiry", company: "", startedAt: 123 };
const response = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
function scenario(responses, accessKey = "public-test-key") {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    assert.ok(next, "unexpected duplicate request");
    return next;
  };
  return { calls, send: (fields = payload) => postEnquiry(fields, { accessKey, page: "/", fetchImpl }) };
}
test("validated then vendor success produces the exact sent outcome consumed by the UI", async () => {
  const run = scenario([response(200, { code: "validated" }), response(200, { success: true })]);
  assert.deepEqual(await run.send(), { kind: "sent" });
  assert.deepEqual(run.calls.map(c => c.url), ["/api/enquiries", "https://api.web3forms.com/submit"]);
  assert.equal(run.calls[0].body.deliveryProvider, "web3forms");
  assert.equal(run.calls[1].body.email, payload.email);
});
test("vendor failure, malformed JSON, false success, and network rejection fall back without retry", async () => {
  for (const vendor of [response(500, { success: true }), response(200, null), response(200, { success: "true" }), response(200, {}), { ok: true, json: async () => { throw new Error("bad json"); } }, new Error("network")]) {
    const run = scenario([response(200, { code: "validated" }), vendor]);
    assert.equal((await run.send()).kind, "fallback");
    assert.equal(run.calls.length, 2);
  }
});
test("validation failures and malformed local responses never dispatch to vendor", async () => {
  for (const local of [response(400, { errors: { email: "Invalid email" } }), response(429, {}), response(503, {}), response(200, null), response(500, { code: "validated" }), new Error("offline")]) {
    const run = scenario([local]);
    assert.notEqual((await run.send()).kind, "sent");
    assert.equal(run.calls.length, 1);
  }
  const noKey = scenario([response(200, { code: "validated" })], "");
  assert.equal((await noKey.send()).kind, "fallback");
  assert.equal(noKey.calls.length, 1);
});
test("honeypot value reaches local validation and its silent rejection never dispatches a vendor request", async () => {
  const run = scenario([response(200, { ok: true })]);
  assert.deepEqual(await run.send({ ...payload, company: "bot-filled-company" }), { kind: "sent" });
  assert.equal(run.calls[0].body.company, "bot-filled-company");
  assert.equal(run.calls.length, 1);
  const component = readFileSync(new URL("../components/ContactV8.jsx", import.meta.url), "utf8");
  assert.match(component, /company: new FormData\(event.currentTarget\)\.get\("company"\)/);
  assert.match(component, /name="company"/);
  assert.match(component, /if \(submitting.current\) return/);
  assert.match(component, /finally \{\s*submitting.current = false/);
});
