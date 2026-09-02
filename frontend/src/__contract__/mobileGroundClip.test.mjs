import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("the active app routes home through the versioned mobile ground clip", () => {
  const entry = read("../index.js");
  const app = read("../AppV12.js");
  const stage = read("../components/DeferredHouseStageV7.jsx");
  const model = read("../three/HouseModelV28.jsx");
  assert.match(entry, /AppV12/);
  assert.match(app, /DeferredHouseStageV7/);
  assert.match(stage, /HouseSceneV30/);
  assert.match(model, /EnvelopeV10/);
});

test("the mask is phone-only and clips only the two descending facade groups", () => {
  const envelope = read("../three/parts/EnvelopeV10.jsx");
  assert.match(envelope, /window\.innerWidth < 768/);
  assert.match(envelope, /facade-front-a-v4/);
  assert.match(envelope, /facade-front-b-v2/);
  assert.match(envelope, /clone\.clippingPlanes = phoneRef\.current \? \[groundPlane\] : null/);
  assert.doesNotMatch(envelope, /drivewayGroup|interiorGroup|landscapeGroup/);
});
