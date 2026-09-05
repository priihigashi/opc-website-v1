// Conversion + analytics-privacy contract — T-214.
//
// WHY THIS EXISTS: CONVERSIONS.PHONE_CLICK was declared on 2026-08-21 and then
// never called from anywhere, so "phone taps are tracked" was true in the
// constant table and false in the product. These tests bind the event names to
// real call sites, and they fence the payloads so a future edit cannot start
// shipping a customer's message or email address to GA4.
//
// Source-scanning, like featureContract.test.mjs — no renderer, no network.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const src = (...parts) => readFileSync(join(here, "..", ...parts), "utf8");

const analytics = src("lib", "analytics.js");

// Every file AppV4.js can actually reach. A tel: link in an unrouted V2 file is
// not a launch defect; one in these files is.
const ROUTED = {
  "components/NavV4.jsx": src("components", "NavV4.jsx"),
  "components/FooterV2.jsx": src("components", "FooterV2.jsx"),
  "components/ContactV5.jsx": src("components", "ContactV5.jsx"),
  "components/ContactV7.jsx": src("components", "ContactV7.jsx"),
  "pages/ServiceDetailV3.jsx": src("pages", "ServiceDetailV3.jsx"),
  "pages/ServicesV8.jsx": src("pages", "ServicesV8.jsx"),
  "pages/PortfolioV9.jsx": src("pages", "PortfolioV9.jsx"),
  "pages/ProjectGalleryV5.jsx": src("pages", "ProjectGalleryV5.jsx"),
  "pages/ProjectGalleryV4.jsx": src("pages", "ProjectGalleryV4.jsx"),
  "pages/ServiceAreasV1.jsx": src("pages", "ServiceAreasV1.jsx"),
  "pages/PrivacyV3.jsx": src("pages", "PrivacyV3.jsx"),
};

test("analytics stays inert until a measurement ID is supplied", () => {
  assert.match(
    analytics,
    /process\.env\.REACT_APP_GA4_ID/,
    "GA4 must be gated on a build-time environment variable",
  );
  assert.match(
    analytics,
    /if \(!analyticsEnabled\) return/,
    "every emitter must short-circuit when analytics is disabled",
  );
  // The privacy page promises no advertising trackers; Consent Mode must open
  // in the denied state rather than relying on a banner that does not exist.
  for (const signal of ["ad_storage", "ad_user_data", "ad_personalization"]) {
    const denied = new RegExp(`${signal}: "denied"`);
    assert.match(analytics, denied, `${signal} must default to denied`);
  }
});

test("every conversion name is declared once, in analytics.js", () => {
  for (const name of ["generate_lead", "phone_click", "cta_click"]) {
    assert.ok(
      analytics.includes(`"${name}"`),
      `${name} must be declared in the CONVERSIONS table`,
    );
  }
  // Nothing else may invent an event name inline.
  for (const [file, code] of Object.entries(ROUTED)) {
    const inline = code.match(/trackConversion\(\s*"/g);
    assert.equal(inline, null, `${file} passes a raw event-name string`);
  }
});

test("a form success reports a conversion", () => {
  const contact = ROUTED["components/ContactV5.jsx"];
  assert.match(contact, /CONVERSIONS\.LEAD_SUBMITTED/);
  assert.match(contact, /CONVERSIONS\.LEAD_FALLBACK/);
});

test("every phone number a visitor can tap reports a phone_click", () => {
  const unwired = [];
  for (const [file, code] of Object.entries(ROUTED)) {
    if (!code.includes("tel:")) continue;
    const taps = (code.match(/href="tel:/g) || []).length;
    const tracked = (code.match(/trackPhoneClick\(/g) || []).length;
    if (tracked < taps) unwired.push(`${file} (${taps} tel: links, ${tracked} tracked)`);
  }
  assert.deepEqual(
    unwired,
    [],
    `phone links with no conversion event:\n  ${unwired.join("\n  ")}`,
  );
});

test("the primary calls to action report a cta_click", () => {
  const nav = ROUTED["components/NavV4.jsx"];
  const detail = ROUTED["pages/ServiceDetailV3.jsx"];
  // Desktop pill and mobile-menu pill are separate elements; both must fire.
  assert.equal(
    (nav.match(/trackCtaClick\(/g) || []).length,
    2,
    "both the desktop and mobile nav CTAs must be instrumented",
  );
  assert.match(detail, /trackCtaClick\("service-detail"\)/);
});

test("no form field can reach analytics", () => {
  // The click helpers take a fixed placement label and read the path
  // themselves; they never accept caller-supplied objects.
  assert.match(analytics, /export function trackPhoneClick\(placement\)/);
  assert.match(analytics, /export function trackCtaClick\(placement\)/);

  // And no call site anywhere may hand a sensitive field to an analytics call.
  const forbidden = /(track(Conversion|PhoneClick|CtaClick))\([^)]*\b(email|phone|message|name|form\.email|form\.phone|form\.message|form\.name)\b/;
  for (const [file, code] of Object.entries(ROUTED)) {
    assert.ok(
      !forbidden.test(code),
      `${file} passes a personal field into an analytics event`,
    );
  }
});

test("runtime payloads are exact and unknown placements fail closed", async () => {
  const previousId = process.env.REACT_APP_GA4_ID;
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  process.env.REACT_APP_GA4_ID = "G-TEST";
  globalThis.window = { dataLayer: [], location: { pathname: "/services" } };
  globalThis.document = { title: "Test" };

  try {
    const live = await import(`../lib/analytics.js?payload-test=${Date.now()}`);
    live.trackPhoneClick("footer");
    live.trackCtaClick("nav-desktop");
    live.trackPhoneClick("customer@example.com");
    live.trackCtaClick("a form message must never be analytics metadata");

    assert.deepEqual(globalThis.window.dataLayer, [
      ["event", "phone_click", { placement: "footer", source_page: "/services" }],
      ["event", "cta_click", { placement: "nav-desktop", source_page: "/services" }],
    ]);
  } finally {
    if (previousId === undefined) delete process.env.REACT_APP_GA4_ID;
    else process.env.REACT_APP_GA4_ID = previousId;
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
