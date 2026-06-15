const config = require("../_lib/config");
const { applyCors, requirePost, readJson, sendJson, sendError } = require("../_lib/http");
const { validateEmail } = require("../_lib/validation");
const { sendMail } = require("../_lib/email");
const store = require("../_lib/store");

function code() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = async function handler(req, res) {
  if (!applyCors(req, res) || !requirePost(req, res)) return;

  try {
    const body = await readJson(req);
    const job = await store.getJob(body.jobId);
    if (!job) return sendError(res, 404, "Kitchen Vision job was not found or expired.", "JOB_NOT_FOUND");

    const emailCheck = await validateEmail(body.email);
    if (!emailCheck.ok) return sendError(res, 400, emailCheck.error, emailCheck.code);

    const otp = code();
    await store.setOtp(job.jobId, otp, emailCheck.email);
    await sendMail({
      to: emailCheck.email,
      subject: "Your Oak Park Construction kitchen concept code",
      text: `Your Oak Park Construction Kitchen AI Vision code is ${otp}. It expires in 15 minutes.`,
      html: `<p>Your Oak Park Construction Kitchen AI Vision code is <strong>${otp}</strong>.</p><p>It expires in 15 minutes.</p>`
    });

    return sendJson(res, 200, {
      sent: true,
      ...(config.returnOtpInDev ? { devCode: otp } : {})
    });
  } catch (error) {
    return sendError(res, 500, error.message || "Could not send verification email.", error.code || "EMAIL_VERIFY_START_FAILED");
  }
};
