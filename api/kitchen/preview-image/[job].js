const store = require("../_lib/store");
const { applyCors, sendError } = require("../_lib/http");

module.exports = async function handler(req, res) {
  if (!applyCors(req, res)) return;
  if (req.method !== "GET" && req.method !== "HEAD") {
    return sendError(res, 405, "Use GET for preview images.", "METHOD_NOT_ALLOWED");
  }

  const jobParam = String(req.query.job || "").replace(/\.jpg$/i, "");
  const job = await store.getJob(jobParam);
  if (!job) return sendError(res, 404, "Preview was not found or expired.", "PREVIEW_NOT_FOUND");

  try {
    const preview = await store.readFile(job.jobId, "preview.jpg");
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "private, max-age=900");
    if (req.method === "HEAD") return res.end();
    return res.end(preview);
  } catch {
    return sendError(res, 404, "Preview was not found or expired.", "PREVIEW_NOT_FOUND");
  }
};
