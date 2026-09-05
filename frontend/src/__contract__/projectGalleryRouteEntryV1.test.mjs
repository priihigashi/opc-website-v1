import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (relativePath) => readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

test("the active app routes project details through the local top-entry wrapper", () => {
  const entry = read("../index.js");
  const app = read("../AppV18.js");
  const gallery = read("../pages/ProjectGalleryV5.jsx");

  assert.match(entry, /AppV18/);
  assert.match(app, /pages\/ProjectGalleryV6/);
  assert.match(gallery, /useLayoutEffect/);
  assert.match(gallery, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
  assert.match(gallery, /\[projectId\]/);
  assert.match(gallery, /<ProjectGalleryV4 \/>/);
  assert.doesNotMatch(app, /function ScrollToTop|<ScrollToTop/);
});

test("the prior gallery and application remain intact as rollback sources", () => {
  assert.match(read("../pages/ProjectGalleryV4.jsx"), /export default function ProjectGalleryV3/);
  assert.match(read("../AppV16.js"), /pages\/ProjectGalleryV4/);
});
