const formidablePkg = require("formidable");
const fs = require("fs/promises");
const config = require("./_lib/config");
const { applyCors, requirePost, sendJson, sendError, clientIp } = require("./_lib/http");
const { consume } = require("./_lib/rate-limit");
const { sanitizeAnswers } = require("./_lib/validation");
const { moderateUpload, generateConcept } = require("./_lib/image");
const { makePreview } = require("./_lib/watermark");
const store = require("./_lib/store");

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

async function parseMultipart(req) {
  const createForm = formidablePkg.formidable || formidablePkg.default || formidablePkg.IncomingForm;
  const form = createForm({
    maxFileSize: config.maxUploadBytes,
    multiples: false,
    keepExtensions: true
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields, files });
    });
  });
}

async function handler(req, res) {
  if (!applyCors(req, res) || !requirePost(req, res)) return;

  try {
    const ip = clientIp(req);
    if (!consume("preview-ip", ip, config.dailyIpPreviewLimit)) {
      return sendError(res, 429, "Preview limit reached for today.", "RATE_LIMIT_PREVIEW_IP");
    }

    const { fields, files } = await parseMultipart(req);
    const uploaded = first(files.photo);
    if (!uploaded?.filepath) return sendError(res, 400, "Upload a room photo.", "PHOTO_REQUIRED");

    const buffer = await fs.readFile(uploaded.filepath);
    const mimeType = uploaded.mimetype || "application/octet-stream";
    const answersRaw = first(fields.answers);
    const answers = sanitizeAnswers(answersRaw ? JSON.parse(answersRaw) : {});

    const moderation = await moderateUpload(buffer, mimeType, answers);
    if (!moderation.ok) return sendError(res, 400, moderation.error || "Upload rejected.", moderation.code || "UPLOAD_REJECTED");

    const concept = await generateConcept(buffer, mimeType, answers, "preview");
    const preview = await makePreview(concept.raw);
    const job = await store.createJob({
      answers,
      mimeType,
      sourcePage: String(first(fields.source_page) || "").slice(0, 300),
      referrer: String(first(fields.referrer) || "").slice(0, 500),
      utm: String(first(fields.utm) || "").slice(0, 1000),
      ip,
      engine: concept.engine,
      moderation
    }, {
      original: buffer,
      preview
    });

    return sendJson(res, 200, {
      jobId: job.jobId,
      previewUrl: `/kitchen/preview-image/${job.jobId}.jpg`,
      previewDataUrl: `data:image/jpeg;base64,${preview.toString("base64")}`,
      engine: concept.engine
    });
  } catch (error) {
    const code = error.code || "PREVIEW_FAILED";
    const status = code === "UPLOAD_TYPE_INVALID" || code === "UPLOAD_TOO_SMALL" ? 400 : 500;
    return sendError(res, status, error.message || "Preview failed.", code);
  }
}

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false
  }
};
