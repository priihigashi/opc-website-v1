// Captures one local preview page through an isolated Chrome DevTools target.
// Usage: node scripts/capture-blog-preview.cjs URL OUTPUT.png WIDTH HEIGHT
const fs = require("node:fs");
const http = require("node:http");
const WebSocket = require("ws");
const posts = require("../src/blog/posts.json");

const [url, output, widthText, heightText] = process.argv.slice(2);
const width = Number(widthText);
const height = Number(heightText);
const offsetY = Number(process.argv[6] || 0);
const allowedPaths = new Set(["/blog", ...posts.map((post) => `/${post.slug}`)]);
const parsedUrl = url ? new URL(url) : null;
if (parsedUrl?.origin !== "http://127.0.0.1:3025" || !allowedPaths.has(parsedUrl.pathname) || !output || !width || !height) {
  throw new Error("Expected a local blog URL, PNG path, width, and height");
}

const readTargets = () => new Promise((resolve, reject) => {
  http.get("http://127.0.0.1:9235/json/list", (response) => {
    let data = "";
    response.on("data", (chunk) => { data += chunk; });
    response.on("end", () => resolve(JSON.parse(data)));
  }).on("error", reject);
});

async function capture() {
  const target = (await readTargets()).find((item) => item.type === "page");
  if (!target) throw new Error("No isolated Chrome page target");
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.once("open", resolve); socket.once("error", reject); });
  let nextId = 0;
  const pending = new Map();
  socket.on("message", (raw) => {
    const message = JSON.parse(raw);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  try {
    await call("Page.enable");
    await call("Runtime.enable");
    await call("Emulation.setDeviceMetricsOverride", {
      width, height, deviceScaleFactor: 1, mobile: width < 600,
    });
    await call("Page.navigate", { url });
    let ready = false;
    for (let attempt = 0; attempt < 50 && !ready; attempt += 1) {
      const state = await call("Runtime.evaluate", {
        expression: "Boolean(document.querySelector('main h1')) && document.fonts.status === 'loaded' && document.querySelector('meta[name=robots]')?.content === 'index,follow' && Boolean(document.querySelector('link[rel=canonical]')) && [...document.querySelectorAll('main img')].every(i => i.complete && i.naturalWidth > 0)",
        returnByValue: true,
      });
      ready = Boolean(state.result?.value);
      if (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!ready) throw new Error("Preview did not finish rendering");
    const metrics = await call("Runtime.evaluate", {
      expression: "({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.title,images:[...document.querySelectorAll('main img')].length,robots:document.querySelector('meta[name=robots]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href})",
      returnByValue: true,
    });
    const expectedTitle = posts.find((post) => parsedUrl.pathname === `/${post.slug}`)?.title;
    const heading = await call("Runtime.evaluate", {
      expression: "document.querySelector('main h1')?.textContent.trim()",
      returnByValue: true,
    });
    if (expectedTitle && heading.result.value !== expectedTitle) {
      throw new Error(`Article heading mismatch: ${heading.result.value}`);
    }
    if (!metrics.result.value.canonical.endsWith(parsedUrl.pathname)) {
      throw new Error(`Canonical path mismatch: ${metrics.result.value.canonical}`);
    }
    if (metrics.result.value.width !== width || metrics.result.value.scrollWidth > width) {
      throw new Error(`Bad viewport: ${JSON.stringify(metrics.result.value)}`);
    }
    const shot = await call("Page.captureScreenshot", {
      format: "png", fromSurface: true, captureBeyondViewport: offsetY > 0,
      ...(offsetY > 0 ? { clip: { x: 0, y: offsetY, width, height, scale: 1 } } : {}),
    });
    fs.writeFileSync(output, Buffer.from(shot.data, "base64"));
    process.stdout.write(JSON.stringify({ output, ...metrics.result.value }) + "\n");
  } finally {
    socket.close();
  }
}

capture().catch((error) => { console.error(error); process.exitCode = 1; });
