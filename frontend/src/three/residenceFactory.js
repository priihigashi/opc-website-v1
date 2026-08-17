import * as THREE from "three";
import { wallSegments } from "./wallMath";

// Builds the OPC residence as a pure THREE.Group with named, modular groups:
// site, shell, exterior-finishes (finFrontA/B, finBackA/B, finWestA, finEastA/B),
// roof (roofA/roofB), windows (inside facades), interior (kitchen, bathroom,
// bedroom), addition, pergola (posts/roof/bbq/patio), driveway-pavers.
// Runs both in the browser and in Node (for GLB export).

function createMaterials() {
  const std = (name, color, opts = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, transparent: true, roughness: 0.85, metalness: 0.05, ...opts });
    m.name = name;
    return m;
  };
  const glass = (name, base) => {
    const m = new THREE.MeshPhysicalMaterial({
      color: "#B9D4E2", transparent: true, opacity: base, roughness: 0.05, metalness: 0.9, depthWrite: false,
    });
    m.name = name;
    m.userData.base = base;
    m.userData.noCast = true;
    return m;
  };
  return {
    shell: Object.assign(
      new THREE.MeshStandardMaterial({
        color: "#5A8FD0", transparent: true, opacity: 0.95, wireframe: true,
        emissive: new THREE.Color("#5A8FD0"), emissiveIntensity: 0.35, roughness: 0.55,
      }),
      { name: "shellMat" }
    ),
    stuccoFront: std("stuccoFront", "#F2EFE9", { roughness: 0.95 }),
    stuccoSide: std("stuccoSide", "#EAE6DE", { roughness: 0.95 }),
    woodScreen: std("woodScreen", "#A8784A", { roughness: 0.65 }),
    fascia: std("fascia", "#26262B", { metalness: 0.7, roughness: 0.32 }),
    membrane: std("membrane", "#5C5C60", { roughness: 0.95 }),
    soffit: std("soffit", "#A07044", { roughness: 0.65 }),
    frameFront: std("frameFront", "#1D1D20", { metalness: 0.75, roughness: 0.3 }),
    frameSide: std("frameSide", "#1D1D20", { metalness: 0.75, roughness: 0.3 }),
    glassFront: glass("glassFront", 0.4),
    glassSide: glass("glassSide", 0.4),
    doorWood: std("doorWood", "#8A5A30", { roughness: 0.5 }),
    sconce: std("sconce", "#FFD9A0", { emissive: new THREE.Color("#FFB85C"), emissiveIntensity: 1.6 }),
    floorOak: std("floorOak", "#96754E", { roughness: 0.45 }),
    ceilWhite: std("ceilWhite", "#F4F2EC", { roughness: 0.95 }),
    can: std("can", "#FFE3B0", { emissive: new THREE.Color("#FFC97A"), emissiveIntensity: 2.4 }),
    tallDark: std("tallDark", "#33302B", { roughness: 0.5 }),
    cabWood: std("cabWood", "#6E4F30", { roughness: 0.55 }),
    counterStone: std("counterStone", "#D8D3C8", { roughness: 0.22 }),
    pendant: std("pendant", "#1D1D20", { metalness: 0.65, roughness: 0.35 }),
    stoolSeat: std("stoolSeat", "#4A4238", { roughness: 0.6 }),
    fabric: std("fabric", "#B8B2A6", { roughness: 0.95 }),
    tileBath: std("tileBath", "#40626E", { roughness: 0.22 }),
    tubWhite: std("tubWhite", "#F4F2EC", { roughness: 0.18 }),
    vanityWood: std("vanityWood", "#7A5A38", { roughness: 0.55 }),
    mirror: std("mirror", "#C8D4DA", { metalness: 1, roughness: 0.06 }),
    addStucco: std("addStucco", "#F2EFE9", { roughness: 0.95 }),
    addWood: std("addWood", "#A8784A", { roughness: 0.65 }),
    addFascia: std("addFascia", "#26262B", { metalness: 0.7, roughness: 0.32 }),
    addMembrane: std("addMembrane", "#5C5C60", { roughness: 0.95 }),
    addSoffit: std("addSoffit", "#A07044", { roughness: 0.65 }),
    addFrame: std("addFrame", "#1D1D20", { metalness: 0.75, roughness: 0.3 }),
    addGlass: glass("addGlass", 0.55),
    pergolaWood: std("pergolaWood", "#6E4F30", { roughness: 0.6 }),
    patioPaver: std("patioPaver", "#7A7A80", { roughness: 0.9 }),
    patioEdge: std("patioEdge", "#54545C", { roughness: 0.9 }),
    bbqSteel: std("bbqSteel", "#2A2A2E", { metalness: 0.7, roughness: 0.35 }),
    bbqTop: std("bbqTop", "#3F3F45", { roughness: 0.4 }),
    driveBase: std("driveBase", "#232327", { roughness: 1 }),
    paverA: std("paverA", "#55555E", { roughness: 0.95 }),
    paverB: std("paverB", "#62626B", { roughness: 0.95 }),
    stepStone: std("stepStone", "#8E8E96", { roughness: 0.9 }),
    planter: std("planter", "#3A3A3F", { roughness: 0.95 }),
    soil: std("soil", "#1A1512", { roughness: 1 }),
    hedge: std("hedge", "#33482C", { roughness: 1 }),
    plinth: (() => { const m = new THREE.MeshStandardMaterial({ color: "#2E2E33", roughness: 0.95 }); m.name = "plinth"; return m; })(),
  };
}

function box(parent, mat, w, h, d, x, y, z, ry = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (ry) m.rotation.y = ry;
  parent.add(m);
  return m;
}

function cyl(parent, mat, rTop, rBot, h, x, y, z, segN = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segN), mat);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

function wall(parent, mat, len, h, t, openings = []) {
  for (const s of wallSegments(len, h, openings)) box(parent, mat, s.w, s.h, t, s.cx, s.cy, 0);
}

function windowUnit(parent, glass, frame, w, h, x, y, z, mullions = 0, t = 0.3) {
  const g = new THREE.Group();
  g.name = "window";
  g.position.set(x, y, z);
  const f = 0.07;
  box(g, frame, w, f, t, 0, h - f / 2, 0);
  box(g, frame, w, f, t * 1.2, 0, f / 2, 0);
  box(g, frame, f, h - 2 * f, t, -w / 2 + f / 2, h / 2, 0);
  box(g, frame, f, h - 2 * f, t, w / 2 - f / 2, h / 2, 0);
  for (let i = 0; i < mullions; i++) {
    box(g, frame, 0.05, h - 2 * f, t * 0.7, -w / 2 + ((i + 1) * w) / (mullions + 1), h / 2, 0);
  }
  box(g, glass, w - 2 * f, h - 2 * f, 0.03, 0, h / 2, 0);
  parent.add(g);
  return g;
}

export function buildResidence() {
  const mats = createMaterials();
  const root = new THREE.Group();
  root.name = "opc-residence";

  // ---- site plinth ----
  const site = new THREE.Group();
  site.name = "site";
  box(site, mats.plinth, 14.5, 0.5, 8.5, 0.75, 0.25, 0);
  root.add(site);

  // ---- structural shell ----
  const shell = new THREE.Group();
  shell.name = "shell";
  box(shell, mats.shell, 5, 5.6, 0.2, -3.5, 3.3, 2.9);
  box(shell, mats.shell, 5, 5.6, 0.2, -3.5, 3.3, -2.9);
  box(shell, mats.shell, 0.2, 5.6, 5.6, -5.9, 3.3, 0);
  box(shell, mats.shell, 0.2, 2.4, 5.6, -1.1, 4.8, 0);
  box(shell, mats.shell, 0.2, 3.35, 5.6, -1.1, 2.175, 0);
  box(shell, mats.shell, 5, 0.3, 6, -3.5, 3.5, 0);
  box(shell, mats.shell, 5, 0.25, 6, -3.5, 5.725, 0);
  [[-0.8, -2.3], [-0.8, 2.3], [5.8, -2.3], [5.8, 2.3], [2.5, -2.3], [2.5, 2.3]].forEach(([x, z]) =>
    box(shell, mats.shell, 0.22, 3.4, 0.22, x, 2.2, z)
  );
  box(shell, mats.shell, 7.4, 0.18, 5.4, 2.5, 3.9, 0);
  root.add(shell);

  // ---- exterior finishes ----
  const finishes = new THREE.Group();
  finishes.name = "exterior-finishes";
  root.add(finishes);

  const finFrontA = new THREE.Group();
  finFrontA.name = "finFrontA";
  finFrontA.position.set(-3.5, 0.5, 3);
  wall(finFrontA, mats.stuccoFront, 5, 5.6, 0.25, [
    { x: 1.85, w: 1.3, y0: 0, y1: 2.5 },
    { x: -0.7, w: 1.0, y0: 0.5, y1: 2.9 },
    { x: -0.7, w: 1.0, y0: 3.9, y1: 5.1 },
    { x: 0.9, w: 1.3, y0: 3.9, y1: 5.1 },
  ]);
  const winFrontA = new THREE.Group();
  winFrontA.name = "windows";
  windowUnit(winFrontA, mats.glassFront, mats.frameFront, 1.0, 2.4, -0.7, 0.5, 0, 1);
  windowUnit(winFrontA, mats.glassFront, mats.frameFront, 1.0, 1.2, -0.7, 3.9, 0);
  windowUnit(winFrontA, mats.glassFront, mats.frameFront, 1.3, 1.2, 0.9, 3.9, 0, 1);
  finFrontA.add(winFrontA);
  box(finFrontA, mats.woodScreen, 1.5, 2.6, 0.1, 1.85, 4.5, 0.19);
  box(finFrontA, mats.doorWood, 1.2, 2.42, 0.1, 1.85, 1.21, -0.02);
  box(finFrontA, mats.frameFront, 0.045, 0.85, 0.045, 2.32, 1.25, 0.06);
  box(finFrontA, mats.frameFront, 2.4, 0.12, 1.3, 1.85, 2.78, 0.62);
  box(finFrontA, mats.sconce, 0.09, 0.36, 0.09, 1.05, 2.2, 0.17);
  finishes.add(finFrontA);

  const finBackA = new THREE.Group();
  finBackA.name = "finBackA";
  finBackA.position.set(-3.5, 0.5, -3);
  wall(finBackA, mats.stuccoSide, 5, 5.6, 0.25, [
    { x: -0.5, w: 1.8, y0: 0, y1: 2.4 },
    { x: 1.7, w: 1.4, y0: 3.9, y1: 5.1 },
  ]);
  windowUnit(finBackA, mats.glassSide, mats.frameSide, 1.8, 2.4, -0.5, 0, 0, 1);
  windowUnit(finBackA, mats.glassSide, mats.frameSide, 1.4, 1.2, 1.7, 3.9, 0, 1);
  finishes.add(finBackA);

  const finWestA = new THREE.Group();
  finWestA.name = "finWestA";
  finWestA.position.set(-6, 0.5, 0);
  finWestA.rotation.y = Math.PI / 2;
  wall(finWestA, mats.stuccoSide, 6, 5.6, 0.25, [{ x: 0.8, w: 1.2, y0: 3.9, y1: 5.1 }]);
  windowUnit(finWestA, mats.glassSide, mats.frameSide, 1.2, 1.2, 0.8, 3.9, 0);
  finishes.add(finWestA);

  const finEastA = new THREE.Group();
  finEastA.name = "finEastA";
  box(finEastA, mats.stuccoSide, 0.25, 2.4, 6, -1.125, 4.8, 0);
  finishes.add(finEastA);

  const finFrontB = new THREE.Group();
  finFrontB.name = "finFrontB";
  finFrontB.position.set(0, 0.5, 2.5);
  const winFrontB = new THREE.Group();
  winFrontB.name = "windows";
  [-0.14, 1.58, 3.3, 5.02].forEach((x) => windowUnit(winFrontB, mats.glassFront, mats.frameFront, 1.72, 3.3, x, 0, 0, 1));
  finFrontB.add(winFrontB);
  box(finFrontB, mats.frameFront, 7.1, 0.09, 0.14, 2.5, 3.37, 0);
  finishes.add(finFrontB);

  const finBackB = new THREE.Group();
  finBackB.name = "finBackB";
  finBackB.position.set(0, 0.5, -2.5);
  const winBackB = new THREE.Group();
  winBackB.name = "windows";
  [-0.14, 1.58, 3.3, 5.02].forEach((x) => windowUnit(winBackB, mats.glassSide, mats.frameSide, 1.72, 3.3, x, 0, 0, 1));
  finBackB.add(winBackB);
  box(finBackB, mats.frameSide, 7.1, 0.09, 0.14, 2.5, 3.37, 0);
  finishes.add(finBackB);

  const finEastB = new THREE.Group();
  finEastB.name = "finEastB";
  finEastB.position.set(6, 0.5, 0);
  finEastB.rotation.y = Math.PI / 2;
  wall(finEastB, mats.stuccoSide, 5, 3.4, 0.25, [{ x: 0.6, w: 0.7, y0: 0.4, y1: 3.0 }]);
  windowUnit(finEastB, mats.glassSide, mats.frameSide, 0.7, 2.6, 0.6, 0.4, 0);
  finishes.add(finEastB);

  // ---- roof ----
  const roof = new THREE.Group();
  roof.name = "roof";
  const roofA = new THREE.Group();
  roofA.name = "roofA";
  box(roofA, mats.fascia, 5.35, 0.08, 0.3, -3.5, 6.14, 3.0);
  box(roofA, mats.fascia, 5.35, 0.08, 0.3, -3.5, 6.14, -3.0);
  box(roofA, mats.fascia, 0.3, 0.08, 6.35, -6.1, 6.14, 0);
  box(roofA, mats.fascia, 0.3, 0.08, 6.35, -0.9, 6.14, 0);
  box(roofA, mats.membrane, 4.7, 0.06, 5.7, -3.5, 5.9, 0);
  roof.add(roofA);
  const roofB = new THREE.Group();
  roofB.name = "roofB";
  const roofSlabB = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 0.16, 6.6),
    [mats.fascia, mats.fascia, mats.membrane, mats.soffit, mats.fascia, mats.fascia]
  );
  roofSlabB.position.set(2.5, 3.97, 0);
  roofB.add(roofSlabB);
  roof.add(roofB);
  root.add(roof);

  // ---- interior ----
  const interior = new THREE.Group();
  interior.name = "interior";
  box(interior, mats.floorOak, 6.9, 0.06, 4.9, 2.5, 0.53, 0);
  box(interior, mats.floorOak, 4.9, 0.06, 5.9, -3.5, 0.53, 0);
  box(interior, mats.ceilWhite, 6.9, 0.05, 4.9, 2.5, 3.78, 0);
  box(interior, mats.ceilWhite, 4.9, 0.05, 5.9, -3.5, 3.33, 0);
  [0.5, 2.5, 4.5].forEach((x) => [-1.2, 1.2].forEach((z) => cyl(interior, mats.can, 0.07, 0.07, 0.02, x, 3.755, z)));

  const kitchen = new THREE.Group();
  kitchen.name = "kitchen";
  box(kitchen, mats.tallDark, 0.6, 3.0, 4.6, -0.65, 2.0, 0);
  box(kitchen, mats.cabWood, 2.8, 0.85, 1.0, 1.7, 0.925, 0.3);
  box(kitchen, mats.counterStone, 2.95, 0.08, 1.15, 1.7, 1.39, 0.3);
  [0.9, 1.7, 2.5].forEach((x) => {
    cyl(kitchen, mats.pendant, 0.015, 0.015, 0.8, x, 3.35, 0.3, 8);
    cyl(kitchen, mats.pendant, 0.05, 0.14, 0.2, x, 2.92, 0.3, 16);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), mats.can);
    bulb.position.set(x, 2.83, 0.3);
    kitchen.add(bulb);
  });
  [0.9, 1.7, 2.5].forEach((x) => {
    cyl(kitchen, mats.pendant, 0.03, 0.03, 0.62, x, 0.85, 1.35, 8);
    cyl(kitchen, mats.stoolSeat, 0.19, 0.19, 0.06, x, 1.18, 1.35, 16);
  });
  box(kitchen, mats.fabric, 2.0, 0.45, 0.95, 4.7, 0.75, -1.3);
  box(kitchen, mats.fabric, 2.0, 0.55, 0.25, 4.7, 1.15, -1.68);
  box(kitchen, mats.cabWood, 1.0, 0.3, 0.5, 3.9, 0.68, -0.35);
  interior.add(kitchen);

  const bathroom = new THREE.Group();
  bathroom.name = "bathroom";
  box(bathroom, mats.tileBath, 3.4, 3.3, 0.12, -4.3, 2.15, 1.0);
  box(bathroom, mats.ceilWhite, 0.12, 3.3, 0.7, -2.6, 2.15, 1.35);
  box(bathroom, mats.ceilWhite, 0.12, 3.3, 0.4, -2.6, 2.15, 2.7);
  box(bathroom, mats.ceilWhite, 0.12, 1.1, 0.8, -2.6, 3.25, 2.1);
  box(bathroom, mats.tubWhite, 1.7, 0.6, 0.82, -4.6, 0.86, 2.3);
  box(bathroom, mats.vanityWood, 0.55, 0.8, 1.3, -5.5, 0.95, 1.6);
  cyl(bathroom, mats.tubWhite, 0.19, 0.16, 0.14, -5.5, 1.42, 1.6, 20);
  box(bathroom, mats.mirror, 0.95, 0.75, 0.03, -5.86, 2.0, 1.6, Math.PI / 2);
  interior.add(bathroom);

  const bedroom = new THREE.Group();
  bedroom.name = "bedroom";
  box(bedroom, mats.floorOak, 4.9, 0.1, 5.9, -3.5, 3.6, 0);
  box(bedroom, mats.fabric, 2.6, 0.03, 1.9, -4.0, 3.67, -1.6);
  box(bedroom, mats.cabWood, 1.9, 0.32, 2.2, -4.4, 3.82, -1.6);
  box(bedroom, mats.fabric, 1.8, 0.28, 2.05, -4.4, 4.12, -1.6);
  box(bedroom, mats.cabWood, 1.9, 0.95, 0.12, -4.4, 4.1, -2.82);
  [-4.85, -3.95].forEach((x) => box(bedroom, mats.tubWhite, 0.7, 0.16, 0.45, x, 4.33, -2.35));
  box(bedroom, mats.cabWood, 0.5, 0.5, 0.45, -5.55, 3.9, -2.5);
  cyl(bedroom, mats.pendant, 0.03, 0.05, 0.14, -5.55, 4.22, -2.5, 10);
  const lampGlow = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), mats.can);
  lampGlow.position.set(-5.55, 4.34, -2.5);
  bedroom.add(lampGlow);
  interior.add(bedroom);
  root.add(interior);

  // ---- addition ----
  const addition = new THREE.Group();
  addition.name = "addition";
  addition.position.set(6, 0, -0.2);
  const addFront = new THREE.Group();
  addFront.position.set(0, 0.5, 2.6);
  wall(addFront, mats.addStucco, 3.4, 3.1, 0.25, [{ x: 1.7, w: 2.2, y0: 0, y1: 2.5 }]);
  windowUnit(addFront, mats.addGlass, mats.addFrame, 2.2, 2.5, 1.7, 0, 0, 1);
  addition.add(addFront);
  const addBack = new THREE.Group();
  addBack.position.set(1.7, 0.5, -1.2);
  wall(addBack, mats.addStucco, 3.4, 3.1, 0.25, [{ x: 0, w: 1.2, y0: 0.9, y1: 2.4 }]);
  windowUnit(addBack, mats.addGlass, mats.addFrame, 1.2, 1.5, 0, 0.9, 0);
  addition.add(addBack);
  box(addition, mats.addStucco, 0.25, 3.1, 3.55, 3.275, 2.05, 0.7);
  box(addition, mats.addWood, 0.08, 2.2, 1.3, 3.43, 1.9, 1.6);
  const addRoof = new THREE.Mesh(
    new THREE.BoxGeometry(3.9, 0.14, 4.3),
    [mats.addFascia, mats.addFascia, mats.addMembrane, mats.addSoffit, mats.addFascia, mats.addFascia]
  );
  addRoof.position.set(1.7, 3.72, 0.7);
  addition.add(addRoof);
  root.add(addition);

  // ---- pergola / backyard ----
  const pergola = new THREE.Group();
  pergola.name = "pergola";
  const patio = new THREE.Group();
  patio.name = "patio";
  const patioSlab = new THREE.Mesh(
    new THREE.BoxGeometry(7, 0.12, 3.4),
    [mats.patioEdge, mats.patioEdge, mats.patioPaver, mats.patioEdge, mats.patioEdge, mats.patioEdge]
  );
  patioSlab.position.set(2.5, 0.56, -4.4);
  patio.add(patioSlab);
  pergola.add(patio);
  const posts = new THREE.Group();
  posts.name = "pergolaPosts";
  posts.position.set(2.5, 0.62, -4.4);
  [[-2.2, -1.3], [2.2, -1.3], [-2.2, 1.3], [2.2, 1.3]].forEach(([x, z]) => box(posts, mats.pergolaWood, 0.18, 2.5, 0.18, x, 1.25, z));
  pergola.add(posts);
  const pRoof = new THREE.Group();
  pRoof.name = "pergolaRoof";
  pRoof.position.set(2.5, 0.62, -4.4);
  box(pRoof, mats.pergolaWood, 5.0, 0.2, 0.18, 0, 2.56, -1.3);
  box(pRoof, mats.pergolaWood, 5.0, 0.2, 0.18, 0, 2.56, 1.3);
  [-2.2, -1.65, -1.1, -0.55, 0, 0.55, 1.1, 1.65, 2.2].forEach((x) => box(pRoof, mats.pergolaWood, 0.12, 0.16, 3.2, x, 2.74, 0));
  pergola.add(pRoof);
  const bbq = new THREE.Group();
  bbq.name = "bbq";
  bbq.position.set(6.15, 0.62, -4.4);
  bbq.rotation.y = Math.PI / 2;
  box(bbq, mats.bbqSteel, 2.0, 0.85, 0.65, 0, 0.44, 0);
  box(bbq, mats.bbqTop, 2.1, 0.07, 0.72, 0, 0.9, 0);
  box(bbq, mats.bbqSteel, 0.72, 0.42, 0.56, -0.4, 1.14, 0);
  pergola.add(bbq);
  root.add(pergola);

  // ---- driveway + pavers ----
  const driveway = new THREE.Group();
  driveway.name = "driveway-pavers";
  driveway.position.set(0, 0, 3.3);
  box(driveway, mats.driveBase, 4.1, 0.08, 9.5, -4.0, 0.04, 4.55);
  for (let cx = 0; cx < 5; cx++) {
    for (let rz = 0; rz < 13; rz++) {
      box(driveway, (cx + rz) % 2 === 0 ? mats.paverA : mats.paverB, 0.72, 0.09, 0.64, -5.65 + cx * 0.78, 0.11, 0.5 + rz * 0.7);
    }
  }
  [0.5, 1.3, 2.1, 2.9].forEach((z) => box(driveway, mats.stepStone, 1.15, 0.1, 0.6, -1.65, 0.06, z));
  [-0.5, -2.8].forEach((x) => {
    box(driveway, mats.planter, 1.6, 0.52, 0.55, x, 0.26, 1.6);
    box(driveway, mats.soil, 1.5, 0.05, 0.45, x, 0.53, 1.6);
    box(driveway, mats.hedge, 1.4, 0.5, 0.35, x, 0.8, 1.6);
  });
  root.add(driveway);

  return { root, mats };
}
