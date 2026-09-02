import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("normal phones alone opt into the bounded Bones finish treatment", () => {
  const model = read("../three/HouseModelV31.jsx");
  assert.match(model, /DEFAULT_SHELL_FINISH = \{ facadeFade: 0\.55, facadeSeparation: 1\.2 \}/);
  assert.match(model, /PHONE_SHELL_FINISH = \{ facadeFade: 0\.6, facadeSeparation: 1\.35 \}/);
  assert.match(model, /stage\.phone && !stage\.shortPhone \? PHONE_SHELL_FINISH : DEFAULT_SHELL_FINISH/);
  assert.match(model, /shellFinishConfig=\{shellFinishConfig\}/);
});

test("the shared engine keeps exact defaults and changes only facade fade and separation", () => {
  const engine = read("../three/HouseModel.jsx");
  assert.match(engine, /DEFAULT_SHELL_FINISH_CONFIG = \{ facadeFade: 0\.55, facadeSeparation: 1\.2 \}/);
  assert.match(engine, /1 - shell \* facadeFade/);
  assert.match(engine, /shell \* facadeSeparation/);
  assert.match(engine, /const roofMul = solid \* \(1 - shell \* 0\.42\)/);
  assert.match(engine, /1 - shell \* 0\.82/);
});

test("AppV13 remains the one-import visual rollback", () => {
  assert.match(read("../AppV13.js"), /DeferredHouseStageV8/);
  assert.match(read("../components/DeferredHouseStageV8.jsx"), /HouseSceneV31/);
  assert.match(read("../three/HouseSceneV31.jsx"), /HouseModelV29/);
});
