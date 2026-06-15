const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const config = require("./config");

function rootDir() {
  if (process.env.VERCEL && !config.forceTmpStore) {
    return path.join("/tmp", "kitchen-vision-store");
  }
  return config.dataDir;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(16).toString("hex")}`;
}

function jobDir(jobId) {
  return path.join(rootDir(), "jobs", jobId);
}

async function writeJson(file, value) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, JSON.stringify(value, null, 2));
}

async function readJsonFile(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function createJob(record, files) {
  const jobId = id("kv");
  const dir = jobDir(jobId);
  await ensureDir(dir);
  const now = Date.now();
  const job = {
    jobId,
    createdAt: now,
    expiresAt: now + config.jobTtlMs,
    emailVerified: false,
    submitted: false,
    ...record
  };
  await writeJson(path.join(dir, "job.json"), job);
  if (files?.original) await fs.writeFile(path.join(dir, "original"), files.original);
  if (files?.preview) await fs.writeFile(path.join(dir, "preview.jpg"), files.preview);
  if (files?.highRes) await fs.writeFile(path.join(dir, "highres.jpg"), files.highRes);
  return job;
}

async function getJob(jobId) {
  if (!/^kv_[a-f0-9]{32}$/.test(jobId || "")) return null;
  try {
    const job = await readJsonFile(path.join(jobDir(jobId), "job.json"));
    if (job.expiresAt && job.expiresAt < Date.now()) return null;
    return job;
  } catch {
    return null;
  }
}

async function updateJob(jobId, patch) {
  const current = await getJob(jobId);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt: Date.now() };
  await writeJson(path.join(jobDir(jobId), "job.json"), next);
  return next;
}

async function readFile(jobId, name) {
  return fs.readFile(path.join(jobDir(jobId), name));
}

async function writeFile(jobId, name, buffer) {
  await fs.writeFile(path.join(jobDir(jobId), name), buffer);
}

async function setOtp(jobId, code, email) {
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  return updateJob(jobId, {
    email,
    emailOtpHash: codeHash,
    emailOtpExpiresAt: Date.now() + config.otpTtlMs,
    emailVerified: false
  });
}

async function confirmOtp(jobId, code) {
  const job = await getJob(jobId);
  if (!job || !job.emailOtpHash || !job.emailOtpExpiresAt) return { ok: false, code: "OTP_NOT_STARTED" };
  if (job.emailOtpExpiresAt < Date.now()) return { ok: false, code: "OTP_EXPIRED" };
  const codeHash = crypto.createHash("sha256").update(String(code || "")).digest("hex");
  if (codeHash !== job.emailOtpHash) return { ok: false, code: "OTP_INVALID" };
  const next = await updateJob(jobId, { emailVerified: true, emailVerifiedAt: Date.now() });
  return { ok: true, job: next };
}

module.exports = {
  createJob,
  getJob,
  updateJob,
  readFile,
  writeFile,
  setOtp,
  confirmOtp,
  id
};
