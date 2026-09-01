import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = (path) => readFileSync(`${root}/${path}`, "utf8");

const routedFooterConsumers = [
  "AppV4.js",
  "pages/PortfolioV8.jsx",
  "pages/PrivacyV3.jsx",
  "pages/ProjectGalleryV4.jsx",
  "pages/ServiceAreasV1.jsx",
  "pages/ServiceDetailV3.jsx",
];

test("every routed footer consumer uses the versioned license footer", () => {
  for (const file of routedFooterConsumers) {
    const code = src(file);
    assert.match(code, /import FooterV3 from "@\/components\/FooterV3"/);
    assert.match(code, /<FooterV3 \/>/);
  }
});

test("the active footer displays the verified Florida contractor license", () => {
  const footer = src("components/FooterV3.jsx");
  assert.match(footer, /Florida Certified Building Contractor/);
  assert.match(footer, /CBC1263425/);
  assert.doesNotMatch(footer, /Insured/);
  assert.doesNotMatch(footer, /General contractors/);
});

test("the full-screen services route also displays the license", () => {
  assert.match(src("pages/ServicesV8.jsx"), /Oak Park Construction · CBC1263425/);
});

test("the homepage search title uses the verified license class", () => {
  const routes = JSON.parse(src("data/seoRoutesV1.json"));
  assert.match(routes["/"].title, /Building Contractor/);
  assert.doesNotMatch(routes["/"].title, /General Contractor/);
});
