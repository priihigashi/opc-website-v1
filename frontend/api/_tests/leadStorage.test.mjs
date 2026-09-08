import { test } from "node:test";
import assert from "node:assert/strict";
import { storeLead } from "../enquiries.mjs";

const enquiry = {
  name: "Dana Whitfield",
  email: "dana@example.com",
  phone: null,
  service: "Kitchen + Bath Remodel",
  message: "Please contact me about an estimate.",
};

test("lead storage sends validated fields and the source page to the private receiver", async () => {
  let request;
  const result = await storeLead(
    enquiry,
    { sourcePage: "/portfolio" },
    { OPC_LEADS_WEBHOOK_URL: "https://example.test/receiver", OPC_LEADS_WEBHOOK_SECRET: "secret" },
    async (url, options) => {
      request = { url, options };
      return { ok: true, json: async () => ({ ok: true }) };
    },
  );
  assert.deepEqual(result, { ok: true, code: "stored" });
  assert.equal(request.url, "https://example.test/receiver");
  assert.deepEqual(JSON.parse(request.options.body), {
    secret: "secret",
    name: enquiry.name,
    email: enquiry.email,
    phone: "",
    service: enquiry.service,
    message: enquiry.message,
    page: "/portfolio",
  });
});

test("lead storage fails closed when the receiver is not configured", async () => {
  assert.deepEqual(await storeLead(enquiry, {}, {}, async () => assert.fail("fetch should not run")), {
    ok: false,
    code: "not_configured",
  });
});
