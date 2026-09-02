import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("the active app uses the versioned phone composition scale chain", () => {
  assert.match(read("../index.js"), /AppV13/);
  assert.match(read("../AppV13.js"), /DeferredHouseStageV8/);
  assert.match(read("../components/DeferredHouseStageV8.jsx"), /HouseSceneV31/);
  assert.match(read("../three/HouseSceneV31.jsx"), /HouseModelV29/);
});

test("only normal phones receive the conservative outer-scene increase", () => {
  const model = read("../three/HouseModelV29.jsx");
  assert.match(model, /phone: \{ f: 0\.04, s: 0\.52, y: 2\.8 \}/);
  assert.match(model, /SHORT_PHONE_VIEW = \{ \.\.\.VIEW, phone: \{ f: 0\.04, s: 0\.5, y: 4\.2 \} \}/);
  assert.match(model, /width < 360 \|\| height < 650/);
  assert.match(model, /tablet: \{ f: 0\.32, s: 0\.68, y: 0\.45 \}/);
  assert.match(model, /desktop: \{ f: 1, s: 1, y: -0\.08 \}/);
  assert.match(model, /scaleTrack=\{stage\.phone \? MOBILE_SCALE : SCALE\}/);
  assert.match(model, /viewConfig=\{stage\.shortPhone \? SHORT_PHONE_VIEW : VIEW\}/);
});

test("the prior composition remains an exact one-import rollback", () => {
  assert.match(read("../AppV12.js"), /DeferredHouseStageV7/);
  assert.match(read("../components/DeferredHouseStageV7.jsx"), /HouseSceneV30/);
  assert.match(read("../three/HouseSceneV30.jsx"), /HouseModelV28/);
  assert.match(read("../three/HouseModelV28.jsx"), /phone: \{ f: 0\.04, s: 0\.5, y: 2\.8 \}/);
});
