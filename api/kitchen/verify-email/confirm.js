const { applyCors, requirePost, readJson, sendJson, sendError } = require("../_lib/http");
const store = require("../_lib/store");

module.exports = async function handler(req, res) {
  if (!applyCors(req, res) || !requirePost(req, res)) return;

  try {
    const body = await readJson(req);
    const result = await store.confirmOtp(body.jobId, body.code);
    if (!result.ok) {
      return sendError(res, 400, "Verification code is invalid or expired.", result.code);
    }
    return sendJson(res, 200, { verified: true });
  } catch (error) {
    return sendError(res, 500, error.message || "Could not confirm verification code.", error.code || "EMAIL_VERIFY_CONFIRM_FAILED");
  }
};
