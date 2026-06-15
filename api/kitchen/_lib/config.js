const path = require("path");

const env = process.env;

const defaultOrigins = [
  "https://priihigashi.github.io",
  "https://oakpark-construction.com",
  "https://www.oakpark-construction.com"
];

function listEnv(name, fallback) {
  return (env[name] || fallback.join(","))
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

module.exports = {
  allowedOrigins: listEnv("KITCHEN_ALLOWED_ORIGINS", defaultOrigins),
  allowLocalOrigin: env.KITCHEN_ALLOW_LOCAL_ORIGIN === "true" || (env.NODE_ENV !== "production" && env.KITCHEN_ALLOW_LOCAL_ORIGIN !== "false"),
  maxUploadBytes: Number(env.KITCHEN_MAX_UPLOAD_BYTES || 8 * 1024 * 1024),
  jobTtlMs: Number(env.KITCHEN_JOB_TTL_MS || 24 * 60 * 60 * 1000),
  otpTtlMs: Number(env.KITCHEN_OTP_TTL_MS || 15 * 60 * 1000),
  previewWidth: Number(env.KITCHEN_PREVIEW_WIDTH || 900),
  highResWidth: Number(env.KITCHEN_HIGH_RES_WIDTH || 1800),
  dailyIpPreviewLimit: Number(env.KITCHEN_DAILY_IP_PREVIEW_LIMIT || 3),
  dailyVerifiedLimit: Number(env.KITCHEN_DAILY_VERIFIED_LIMIT || 1),
  mockAi: env.KITCHEN_ALLOW_MOCK_AI === "true",
  returnOtpInDev: env.KITCHEN_DEV_RETURN_OTP === "true",
  dataDir: env.KITCHEN_DATA_DIR || path.join(process.cwd(), ".kitchen-vision-store"),
  forceTmpStore: env.KITCHEN_FORCE_TMP_STORE === "true",
  geminiKey: env.GEMINI_API_KEY || "",
  infshKey: env.PRI_OP_INFSH_API_KEY || "",
  replicateKey: env.PRI_OP_REPLICATE_API_KEY || "",
  gmailUser: env.PRI_OP_GMAIL_USER || "priscila@oakpark-construction.com",
  gmailPass: env.PRI_OP_GMAIL_APP_PASSWORD || "",
  leadToEmail: env.KITCHEN_LEAD_TO_EMAIL || "priscila@oakpark-construction.com",
  siteBaseUrl: env.KITCHEN_SITE_BASE_URL || "https://priihigashi.github.io/opc-website-v1",
  abstractPhoneKey: env.PRI_OP_ABSTRACT_PHONE_API_KEY || "",
  numverifyKey: env.PRI_OP_NUMVERIFY_API_KEY || "",
  requirePhoneLookup: env.KITCHEN_REQUIRE_PHONE_LOOKUP === "true",
  enableTwilioVerify: env.KITCHEN_ENABLE_TWILIO_VERIFY === "true",
  twilioSid: env.PRI_OP_TWILIO_ACCOUNT_SID || "",
  twilioToken: env.PRI_OP_TWILIO_AUTH_TOKEN || "",
  twilioVerifySid: env.PRI_OP_TWILIO_VERIFY_SERVICE_SID || ""
};
