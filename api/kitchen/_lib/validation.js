const dns = require("dns/promises");
const config = require("./config");

const disposableDomains = new Set([
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "throwawaymail.com",
  "sharklasers.com",
  "getnada.com"
]);

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function validateEmail(email) {
  const normalized = normalizeEmail(email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) {
    return { ok: false, code: "EMAIL_INVALID", error: "Use a valid email address." };
  }
  const domain = normalized.split("@")[1];
  if (disposableDomains.has(domain)) {
    return { ok: false, code: "EMAIL_DISPOSABLE", error: "Use a regular email address, not a disposable inbox." };
  }
  try {
    const mx = await dns.resolveMx(domain);
    if (!mx.length) throw new Error("No MX records");
  } catch {
    return { ok: false, code: "EMAIL_MX_FAILED", error: "That email domain cannot receive mail." };
  }
  return { ok: true, email: normalized };
}

function normalizePhone(phone) {
  const raw = String(phone || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (raw.startsWith("+") && digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  return "";
}

async function validatePhone(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return { ok: false, code: "PHONE_INVALID", error: "Use a valid phone number." };
  }

  if (config.abstractPhoneKey) {
    const url = new URL("https://phonevalidation.abstractapi.com/v1/");
    url.searchParams.set("api_key", config.abstractPhoneKey);
    url.searchParams.set("phone", normalized);
    const response = await fetch(url);
    if (!response.ok) return { ok: false, code: "PHONE_LOOKUP_FAILED", error: "Phone lookup failed." };
    const data = await response.json();
    if (!data.valid) return { ok: false, code: "PHONE_INVALID", error: "Use a valid phone number." };
    return { ok: true, phone: normalized, lookup: { provider: "abstract", lineType: data.type, carrier: data.carrier, country: data.country } };
  }

  if (config.numverifyKey) {
    const url = new URL("http://apilayer.net/api/validate");
    url.searchParams.set("access_key", config.numverifyKey);
    url.searchParams.set("number", normalized);
    url.searchParams.set("country_code", "US");
    url.searchParams.set("format", "1");
    const response = await fetch(url);
    if (!response.ok) return { ok: false, code: "PHONE_LOOKUP_FAILED", error: "Phone lookup failed." };
    const data = await response.json();
    if (!data.valid) return { ok: false, code: "PHONE_INVALID", error: "Use a valid phone number." };
    return { ok: true, phone: normalized, lookup: { provider: "numverify", lineType: data.line_type, carrier: data.carrier, country: data.country_name } };
  }

  if (config.requirePhoneLookup) {
    return { ok: false, code: "PHONE_LOOKUP_NOT_CONFIGURED", error: "Phone lookup is not configured yet." };
  }

  return { ok: true, phone: normalized, lookup: { provider: "structural_only" } };
}

// Canonical room types accepted from room-vision.html. Anything else falls back
// to "kitchen" so a malformed/missing room never crashes generation.
const ROOM_TYPES = ["kitchen", "bathroom", "exterior", "backyard"];

function sanitizeAnswers(answers) {
  const value = typeof answers === "object" && answers ? answers : {};
  const str = (v, def, max) => String(v == null || v === "" ? def : v).slice(0, max);
  const list = (item) => Array.isArray(item) ? item.map((x) => String(x).slice(0, 80)).slice(0, 12) : [];

  const room = ROOM_TYPES.includes(value.room) ? value.room : "kitchen";

  // Fields shared by every room.
  const clean = {
    room,
    style: str(value.style, "modern warm", 80),
    materials: list(value.materials),
    color: str(value.color, "warm neutral", 80),
    timeline: str(value.timeline, "not specified", 80),
    budget: str(value.budget, "not specified", 80)
  };

  // Room-specific answer keys (previously stripped — the cause of every room
  // being treated as a kitchen). Preserve only the keys that room actually sends.
  if (room === "kitchen" || room === "bathroom") {
    clean.layout = str(value.layout, "keep", 60);
    clean.dislikes = list(value.dislikes);
  } else if (room === "exterior") {
    clean.focus = list(value.focus);
  } else if (room === "backyard") {
    clean.features = list(value.features);
  }

  return clean;
}

module.exports = {
  validateEmail,
  validatePhone,
  sanitizeAnswers,
  ROOM_TYPES
};
