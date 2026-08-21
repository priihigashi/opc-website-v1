import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildMailto, interpretResponse, networkFallback, readAttribution, SERVICES, FALLBACK_MAILBOX,
} from "../../src/components/contactSubmit.js";

const form = {
  name: "Dana Whitfield", email: "dana@example.com", phone: "954-555-0142",
  service: "Kitchen + Bath Remodel", message: "Full kitchen remodel in Pompano Beach.",
};

test("a 200 with ok:true is a success", () => {
  assert.deepEqual(interpretResponse(200, { ok: true }), { kind: "sent" });
});

test("a 200 without ok is NOT treated as sent", () => {
  assert.equal(interpretResponse(200, {}).kind, "fallback");
});

test("a 400 surfaces field errors rather than the mail app", () => {
  const out = interpretResponse(400, { errors: { email: "bad" } });
  assert.equal(out.kind, "fieldErrors");
  assert.deepEqual(out.errors, { email: "bad" });
});

test("a 429 shows a notice and does NOT hijack the page to mailto", () => {
  const out = interpretResponse(429, { message: "Slow down." });
  assert.equal(out.kind, "notice");
  assert.equal(out.message, "Slow down.");
});

test("a 429 without a server message still has copy", () => {
  assert.ok(interpretResponse(429, {}).message.length > 0);
});

test("config_pending (503) falls back to the mail app — a lead is never dropped", () => {
  const out = interpretResponse(503, { code: "config_pending" });
  assert.equal(out.kind, "fallback");
  assert.match(out.message, /email app/i);
});

test("a 502 send failure also falls back", () => {
  assert.equal(interpretResponse(502, { code: "send_failed" }).kind, "fallback");
});

test("an unexpected status falls back rather than stranding the visitor", () => {
  for (const status of [401, 404, 418, 500, 504]) {
    assert.equal(interpretResponse(status, {}).kind, "fallback", `status ${status} stranded the visitor`);
  }
});

test("a network failure falls back", () => {
  const out = networkFallback();
  assert.equal(out.kind, "fallback");
  assert.match(out.message, /could not reach/i);
});

test("the mailto keeps every field and stays addressed to the business", () => {
  const url = buildMailto(form);
  assert.ok(url.startsWith(`mailto:${FALLBACK_MAILBOX}?`));
  const decoded = decodeURIComponent(url);
  for (const v of [form.name, form.email, form.phone, form.service, form.message]) {
    assert.ok(decoded.includes(v), `mailto is missing ${v}`);
  }
});

test("a missing phone renders as a dash in the mailto", () => {
  assert.ok(decodeURIComponent(buildMailto({ ...form, phone: "" })).includes("Phone: —"));
});

test("attribution reads utm params and drops everything else", () => {
  const win = {
    location: { search: "?utm_source=google&utm_medium=cpc&evil=x", href: "https://oakpark-construction.com/?utm_source=google" },
    document: { referrer: "https://www.google.com/" },
  };
  const a = readAttribution(win);
  assert.deepEqual(a.attribution, { utm_source: "google", utm_medium: "cpc" });
  assert.equal(a.referrer, "https://www.google.com/");
  assert.equal(a.sourcePage, win.location.href);
});

test("attribution is safe with no query string and no referrer", () => {
  const a = readAttribution({ location: { search: "", href: "https://x.test/" }, document: {} });
  assert.deepEqual(a.attribution, {});
  assert.equal(a.referrer, null);
});

test("attribution is safe with no window at all (SSR/prerender)", () => {
  const a = readAttribution(null);
  assert.deepEqual(a.attribution, {});
  assert.equal(a.sourcePage, null);
});

test("the form's service list matches the server's allowlist", async () => {
  const server = await import("../_lib/validate.mjs");
  assert.deepEqual(SERVICES, server.SERVICES, "client and server service lists have drifted apart");
});
