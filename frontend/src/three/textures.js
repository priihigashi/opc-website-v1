import * as THREE from "three";

function canvasTexture(size, draw, repeat = [1, 1]) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function stuccoTexture() {
  return canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = "#f2efe9";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 9000; i++) {
      const v = 228 + Math.random() * 26;
      ctx.fillStyle = `rgba(${v},${v - 2},${v - 7},0.28)`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 1.3, 1.3);
    }
  }, [3, 3]);
}

export function woodSlatTexture(horizontal = false) {
  return canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = "#6d4b2d";
    ctx.fillRect(0, 0, s, s);
    const slats = 12;
    for (let i = 0; i < slats; i++) {
      const p = (i / slats) * s;
      const w = s / slats;
      const tone = 115 + Math.random() * 45;
      ctx.fillStyle = `rgb(${tone + 42},${tone - 2},${tone - 44})`;
      if (horizontal) ctx.fillRect(0, p, s, w - 2);
      else ctx.fillRect(p, 0, w - 2, s);
      ctx.fillStyle = "rgba(22,13,6,0.85)";
      if (horizontal) ctx.fillRect(0, p + w - 2, s, 2);
      else ctx.fillRect(p + w - 2, 0, 2, s);
    }
  });
}

export function oakFloorTexture() {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = "#8f6f4a";
    ctx.fillRect(0, 0, s, s);
    const rows = 8;
    for (let r = 0; r < rows; r++) {
      const y = (r / rows) * s;
      const h = s / rows;
      let x = -Math.random() * 120;
      while (x < s) {
        const w = 90 + Math.random() * 150;
        const tone = 125 + Math.random() * 50;
        ctx.fillStyle = `rgb(${tone + 32},${tone - 6},${tone - 50})`;
        ctx.fillRect(x, y, w - 2, h - 2);
        ctx.fillStyle = "rgba(58,40,22,0.5)";
        ctx.fillRect(x + w - 2, y, 2, h);
        x += w;
      }
      ctx.fillStyle = "rgba(58,40,22,0.5)";
      ctx.fillRect(0, y + h - 2, s, 2);
    }
  }, [2, 2]);
}

export function tileTexture() {
  return canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = "#2e444d";
    ctx.fillRect(0, 0, s, s);
    const n = 4;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const tone = 82 + Math.random() * 20;
        ctx.fillStyle = `rgb(${tone - 18},${tone + 14},${tone + 22})`;
        ctx.fillRect((i * s) / n + 2, (j * s) / n + 2, s / n - 4, s / n - 4);
      }
    }
  }, [2, 2]);
}

export function paverTexture() {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = "#3a3a40";
    ctx.fillRect(0, 0, s, s);
    const n = 8;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const tone = 96 + Math.random() * 26;
        ctx.fillStyle = `rgb(${tone},${tone},${tone + 6})`;
        ctx.fillRect((i * s) / n + 2, (j * s) / n + 2, s / n - 4, s / n - 4);
      }
    }
  }, [4, 4]);
}

export function concreteTexture() {
  return canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = "#85817a";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 6000; i++) {
      const v = 110 + Math.random() * 40;
      ctx.fillStyle = `rgba(${v},${v},${v - 3},0.22)`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
    }
  }, [2, 2]);
}
