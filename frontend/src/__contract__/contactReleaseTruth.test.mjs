import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the routed contact version makes no unverified response-time promise", async () => {
  const index = await read("../index.js");
  const appName = /import App from "@\/([A-Za-z0-9_]+)"/.exec(index)?.[1];
  assert.ok(appName, "could not resolve routed app entry");
  const [app, contact] = await Promise.all([read(`../${appName}.js`), read("../components/ContactV7.jsx")]);

  assert.match(app, /ContactV7/);
  assert.match(contact, /enquiry was sent to Oak Park Construction/);
  assert.doesNotMatch(contact, /business day/i);
});
