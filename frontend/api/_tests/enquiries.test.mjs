import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry, scoreSpam, extractAttribution, SERVICES, LIMITS } from "../_lib/validate.mjs";
import { renderSubject, renderText, renderHtml, headerSafe } from "../_lib/render.mjs";

const good = () => ({
  name: "Dana Whitfield",
  email: "dana@example.com",
  phone: "954-555-0142",
  service: "Kitchen + Bath Remodel",
  message: "We are planning a full kitchen remodel in Pompano Beach and want an estimate.",
  startedAt: Date.now() - 30_000,
});

/* ---------- validation ---------- */

test("accepts a well-formed enquiry", () => {
  const r = validateEnquiry(good());
  assert.equal(r.ok, true);
  assert.equal(r.value.name, "Dana Whitfield");
  assert.equal(r.value.service, "Kitchen + Bath Remodel");
});

test("trims surrounding whitespace", () => {
  const r = validateEnquiry({ ...good(), name: "   Dana Whitfield   " });
  assert.equal(r.value.name, "Dana Whitfield");
});

test("phone is optional and normalises to null", () => {
  const r = validateEnquiry({ ...good(), phone: "" });
  assert.equal(r.ok, true);
  assert.equal(r.value.phone, null);
});

test("rejects a missing name", () => {
  const r = validateEnquiry({ ...good(), name: "" });
  assert.equal(r.ok, false);
  assert.ok(r.errors.name);
});

test("rejects a malformed email", () => {
  for (const bad of ["dana", "dana@", "@example.com", "dana@example", "a b@example.com"]) {
    const r = validateEnquiry({ ...good(), email: bad });
    assert.equal(r.ok, false, `expected ${bad} to be rejected`);
    assert.ok(r.errors.email);
  }
});

test("accepts plus-addressing and subdomains", () => {
  for (const ok of ["dana+kitchen@example.com", "dana@mail.example.co.uk"]) {
    assert.equal(validateEnquiry({ ...good(), email: ok }).ok, true, `expected ${ok} to pass`);
  }
});

test("rejects a message that is too short or too long", () => {
  assert.equal(validateEnquiry({ ...good(), message: "hi" }).ok, false);
  assert.equal(validateEnquiry({ ...good(), message: "x".repeat(LIMITS.message.max + 1) }).ok, false);
});

test("an unknown service falls back rather than failing the submission", () => {
  const r = validateEnquiry({ ...good(), service: "<script>alert(1)</script>" });
  assert.equal(r.ok, true);
  assert.equal(r.value.service, "Something else");
  assert.ok(SERVICES.includes(r.value.service));
});

test("reports every field error at once", () => {
  const r = validateEnquiry({ name: "", email: "nope", message: "" });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.errors).sort(), ["email", "message", "name"]);
});

test("handles a null or empty body without throwing", () => {
  assert.equal(validateEnquiry(null).ok, false);
  assert.equal(validateEnquiry(undefined).ok, false);
  assert.equal(validateEnquiry({}).ok, false);
});

/* ---------- spam scoring ---------- */

test("a genuine enquiry is not flagged", () => {
  const s = scoreSpam(good());
  assert.equal(s.spam, false, `unexpected reasons: ${s.reasons.join(",")}`);
});

test("a filled honeypot is always spam", () => {
  const s = scoreSpam({ ...good(), company: "Acme SEO" });
  assert.equal(s.spam, true);
  assert.ok(s.reasons.includes("honeypot"));
});

test("an instant submission is spam", () => {
  const s = scoreSpam({ ...good(), startedAt: Date.now() - 200 });
  assert.equal(s.spam, true);
  assert.ok(s.reasons.includes("too_fast"));
});

test("a missing timing token alone is not enough to reject", () => {
  const { startedAt, ...noToken } = good();
  const s = scoreSpam(noToken);
  assert.ok(s.reasons.includes("no_timing_token"));
  assert.equal(s.spam, false, "a no-JS visitor must still get through");
});

test("link-stuffed messages are spam", () => {
  const s = scoreSpam({
    ...good(),
    message: "Visit https://a.com and https://b.com and www.c.com for cheap backlinks now.",
  });
  assert.equal(s.spam, true);
  assert.ok(s.reasons.includes("many_links"));
});

test("one link in an otherwise real message is tolerated", () => {
  const s = scoreSpam({
    ...good(),
    message: "Here is the inspiration board we saved: https://pinterest.com/board/kitchen-ideas",
  });
  assert.equal(s.spam, false);
  assert.ok(s.reasons.includes("has_link"));
});

test("known spam pitches are caught", () => {
  const s = scoreSpam({ ...good(), message: "I offer SEO services to rank #1 on Google for your firm." });
  assert.equal(s.spam, true);
  assert.ok(s.reasons.some((r) => r.startsWith("phrase:")));
});

/* ---------- attribution ---------- */

test("keeps only whitelisted campaign parameters", () => {
  const a = extractAttribution({
    attribution: { utm_source: "google", utm_medium: "cpc", evil: "drop table", gclid: "abc123" },
    sourcePage: "https://oakpark-construction.com/services/kitchen",
    referrer: "https://www.google.com/",
  });
  assert.deepEqual(Object.keys(a.params).sort(), ["gclid", "utm_medium", "utm_source"]);
  assert.equal(a.sourcePage, "https://oakpark-construction.com/services/kitchen");
});

test("attribution is absent rather than undefined-y when not supplied", () => {
  const a = extractAttribution({});
  assert.deepEqual(a.params, {});
  assert.equal(a.sourcePage, null);
  assert.equal(a.referrer, null);
});

/* ---------- rendering / injection ---------- */

test("html output escapes attacker-controlled content", () => {
  const html = renderHtml(
    { ...validateEnquiry(good()).value, name: '<img src=x onerror="alert(1)">' },
    { params: {}, sourcePage: null, referrer: null },
  );
  assert.ok(!html.includes("<img src=x"), "raw tag leaked into the email body");
  assert.ok(html.includes("&lt;img"), "expected the tag to be escaped");
});

test("subject and reply-to cannot carry injected headers", () => {
  const subject = renderSubject({ ...good(), name: "Dana\r\nBcc: attacker@evil.com" });
  assert.ok(!/[\r\n]/.test(subject));
  assert.ok(!/[\r\n]/.test(headerSafe("a\r\nBcc: x@y.z")));
});

test("plain-text alternative carries every field", () => {
  const value = validateEnquiry(good()).value;
  const text = renderText(value, { params: { utm_source: "google" }, sourcePage: "/contact", referrer: null });
  for (const expected of [value.name, value.email, value.phone, value.service, value.message, "utm_source=google"]) {
    assert.ok(text.includes(expected), `text output is missing ${expected}`);
  }
});

test("a missing phone renders as a dash, not the word null", () => {
  const value = validateEnquiry({ ...good(), phone: "" }).value;
  assert.ok(renderText(value, {}).includes("Phone:   —"));
  assert.ok(!renderHtml(value, {}).includes("null"));
});
