import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the routed contact version makes no unverified response-time promise", async () => {
  const index = await read("../index.js");
  const appName = /import App from "@\/([A-Za-z0-9_]+)"/.exec(index)?.[1];
  assert.ok(appName, "could not resolve routed app entry");
  const [app, contact] = await Promise.all([read(`../${appName}.js`), read("../components/ContactV9.jsx")]);

  assert.match(app, /ContactV9/);
  assert.match(contact, /enquiry was sent to Oak Park Construction/);
  assert.doesNotMatch(contact, /business day/i);
});

test("Web3Forms never bypasses the first-party validation and spam endpoint", async () => {
  const [contact, privacy] = await Promise.all([
    read("../components/contactDeliveryV1.js"),
    read("../pages/PrivacyV5.jsx"),
  ]);
  assert.match(contact, /fetchImpl\(ENDPOINT/);
  assert.match(contact, /body\.code === "validated"[\s\S]*postViaWeb3Forms/);
  assert.doesNotMatch(contact, /if \(WEB3FORMS_KEY\) \{[\s\S]*return await postViaWeb3Forms\(payload\);[\s\S]*fetchImpl\(ENDPOINT/);
  assert.match(privacy, /Web3Forms/);
  assert.doesNotMatch(contact, /business day/i);
});
