const config = require("./config");

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (config.allowedOrigins.includes(origin)) return true;
  if (config.allowLocalOrigin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }
  return false;
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || config.allowedOrigins[0]);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return false;
  }

  if (!isAllowedOrigin(origin)) {
    sendError(res, 403, "Origin is not allowed.", "CORS_ORIGIN_BLOCKED");
    return false;
  }

  return true;
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function sendError(res, status, error, code, extra = {}) {
  sendJson(res, status, { error, code, ...extra });
}

function requirePost(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "Use POST for this endpoint.", "METHOD_NOT_ALLOWED");
    return false;
  }
  return true;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 512 * 1024) {
        reject(new Error("JSON body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

module.exports = {
  applyCors,
  sendJson,
  sendError,
  requirePost,
  readJson,
  clientIp
};
