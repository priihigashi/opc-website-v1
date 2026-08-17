import * as THREE from "three";

function rng(seed = 1337) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function canvasTexture(size, draw, repeat = [1, 1], seed = 1337) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  draw(ctx, size, rng(seed));
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export function stuccoTexture() {
  return canvasTexture(512, (ctx, s, random) => {
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, "#f5f1e9");
    g.addColorStop(0.5, "#ebe6dd");
    g.addColorStop(1, "#f2eee6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);

    // Fine mineral variation.
    for (let i = 0; i < 24000; i++) {
      const x = random() * s;
      const y = random() * s;
      const warm = 216 + Math.floor(random() * 35);
      const alpha = 0.025 + random() * 0.12;
      const radius = 0.25 + random() * 1.25;
      ctx.fillStyle = `rgba(${warm + 4},${warm + 1},${warm - 5},${alpha})`;
      ctx.fillRect(x, y, radius, radius);
    }

    // Sparse pores / trowel marks prevent the material reading as sprayed noise.
    for (let i = 0; i < 950; i++) {
      const x = random() * s;
      const y = random() * s;
      const len = 2 + random() * 8;
      ctx.strokeStyle = `rgba(128,118,104,${0.025 + random() * 0.045})`;
      ctx.lineWidth = 0.35 + random() * 0.7;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + (random() - 0.5) * 1.5);
      ctx.stroke();
    }
  }, [2.5, 2.5], 41);
}

export function woodSlatTexture(horizontal = false) {
  return canvasTexture(512, (ctx, s, random) => {
    ctx.fillStyle = "#755036";
    ctx.fillRect(0, 0, s, s);

    const slats = 14;
    for (let i = 0; i < slats; i++) {
      const p = (i / slats) * s;
      const w = s / slats;
      const base = 92 + Math.floor(random() * 38);
      const grad = horizontal
        ? ctx.createLinearGradient(0, p, s, p)
        : ctx.createLinearGradient(p, 0, p, s);
      grad.addColorStop(0, `rgb(${base + 58},${base + 18},${base - 14})`);
      grad.addColorStop(0.48, `rgb(${base + 42},${base + 5},${base - 24})`);
      grad.addColorStop(1, `rgb(${base + 54},${base + 14},${base - 17})`);
      ctx.fillStyle = grad;
      if (horizontal) ctx.fillRect(0, p, s, w - 2.2);
      else ctx.fillRect(p, 0, w - 2.2, s);

      // Long grain lines.
      for (let g = 0; g < 9; g++) {
        const offset = random() * Math.max(1, w - 4);
        ctx.strokeStyle = `rgba(57,31,18,${0.05 + random() * 0.13})`;
        ctx.lineWidth = 0.45 + random() * 0.8;
        ctx.beginPath();
        if (horizontal) {
          const yy = p + offset;
          ctx.moveTo(0, yy);
          for (let x = 0; x <= s; x += 24) ctx.lineTo(x, yy + Math.sin((x + i * 19) * 0.035) * (0.8 + random()));
        } else {
          const xx = p + offset;
          ctx.moveTo(xx, 0);
          for (let y = 0; y <= s; y += 24) ctx.lineTo(xx + Math.sin((y + i * 19) * 0.035) * (0.8 + random()), y);
        }
        ctx.stroke();
      }

      // Occasional subdued knots.
      if (random() > 0.55) {
        const kx = horizontal ? random() * s : p + w * (0.25 + random() * 0.5);
        const ky = horizontal ? p + w * (0.25 + random() * 0.5) : random() * s;
        ctx.strokeStyle = "rgba(50,27,15,0.2)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(kx, ky, horizontal ? 6 : 3, horizontal ? 3 : 6, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(25,15,10,0.78)";
      if (horizontal) ctx.fillRect(0, p + w - 2.2, s, 2.2);
      else ctx.fillRect(p + w - 2.2, 0, 2.2, s);
    }
  }, [1, 1], horizontal ? 74 : 73);
}

export function oakFloorTexture() {
  return canvasTexture(512, (ctx, s, random) => {
    ctx.fillStyle = "#907254";
    ctx.fillRect(0, 0, s, s);
    const rows = 9;
    for (let r = 0; r < rows; r++) {
      const y = (r / rows) * s;
      const h = s / rows;
      let x = -random() * 150;
      while (x < s) {
        const w = 95 + random() * 170;
        const tone = 118 + random() * 38;
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, `rgb(${tone + 38},${tone + 7},${tone - 28})`);
        grad.addColorStop(1, `rgb(${tone + 26},${tone - 2},${tone - 38})`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w - 1.5, h - 1.5);
        for (let g = 0; g < 4; g++) {
          ctx.strokeStyle = `rgba(64,42,25,${0.045 + random() * 0.065})`;
          ctx.beginPath();
          ctx.moveTo(x, y + (g + 1) * h / 5);
          ctx.bezierCurveTo(x + w * 0.3, y + (g + 1) * h / 5 + 2, x + w * 0.7, y + (g + 1) * h / 5 - 2, x + w, y + (g + 1) * h / 5);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(55,37,22,0.34)";
        ctx.fillRect(x + w - 1.5, y, 1.5, h);
        x += w;
      }
      ctx.fillStyle = "rgba(55,37,22,0.38)";
      ctx.fillRect(0, y + h - 1.5, s, 1.5);
    }
  }, [2, 2], 91);
}

export function tileTexture() {
  return canvasTexture(512, (ctx, s, random) => {
    ctx.fillStyle = "#21343c";
    ctx.fillRect(0, 0, s, s);
    const n = 5;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const tone = 72 + random() * 18;
        const x = (i * s) / n + 2;
        const y = (j * s) / n + 2;
        const d = s / n - 4;
        const grad = ctx.createLinearGradient(x, y, x + d, y + d);
        grad.addColorStop(0, `rgb(${tone - 20},${tone + 11},${tone + 18})`);
        grad.addColorStop(1, `rgb(${tone - 25},${tone + 4},${tone + 11})`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, d, d);
      }
    }
  }, [2, 2], 112);
}

export function paverTexture() {
  return canvasTexture(512, (ctx, s, random) => {
    ctx.fillStyle = "#4a494b";
    ctx.fillRect(0, 0, s, s);
    const cols = 8;
    const rows = 8;
    const cw = s / cols;
    const ch = s / rows;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = i * cw + 2.2;
        const y = j * ch + 2.2;
        const tone = 88 + random() * 34;
        const grad = ctx.createRadialGradient(x + cw * 0.38, y + ch * 0.32, 2, x + cw * 0.5, y + ch * 0.5, cw * 0.8);
        grad.addColorStop(0, `rgb(${tone + 10},${tone + 9},${tone + 8})`);
        grad.addColorStop(1, `rgb(${tone - 5},${tone - 5},${tone - 3})`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, cw - 4.4, ch - 4.4);

        for (let k = 0; k < 18; k++) {
          const v = 70 + random() * 55;
          ctx.fillStyle = `rgba(${v},${v},${v},${0.025 + random() * 0.08})`;
          ctx.fillRect(x + random() * (cw - 5), y + random() * (ch - 5), 0.7 + random() * 1.4, 0.7 + random() * 1.4);
        }
      }
    }
  }, [4, 4], 145);
}

export function concreteTexture() {
  return canvasTexture(512, (ctx, s, random) => {
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, "#9b9790");
    g.addColorStop(0.55, "#77746f");
    g.addColorStop(1, "#8b8882");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);

    for (let i = 0; i < 17000; i++) {
      const v = 80 + random() * 85;
      const a = 0.025 + random() * 0.105;
      const size = 0.4 + random() * 1.8;
      ctx.fillStyle = `rgba(${v},${v},${v - 2},${a})`;
      ctx.fillRect(random() * s, random() * s, size, size);
    }

    for (let i = 0; i < 80; i++) {
      const y = random() * s;
      ctx.strokeStyle = `rgba(68,65,61,${0.018 + random() * 0.025})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(random() * s * 0.2, y);
      ctx.lineTo(s * (0.55 + random() * 0.45), y + (random() - 0.5) * 5);
      ctx.stroke();
    }
  }, [2, 2], 177);
}
