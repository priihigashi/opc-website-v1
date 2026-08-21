// Pure validation + spam scoring for the Oak Park Construction lead form.
// No I/O, no side effects — so it is unit-testable without a server or network.

export const SERVICES = [
  "Shell Construction",
  "Kitchen + Bath Remodel",
  "Addition",
  "Outdoor Living",
  "Concrete + Pavers",
  "Something else",
];

export const LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 254 },
  phone: { max: 40 },
  message: { min: 10, max: 4000 },
  // A human cannot read the form, type a name, an email and ten words this fast.
  minFillMs: 3000,
  // Guards against a clock-skewed or replayed token rather than a slow, careful visitor.
  maxFillMs: 1000 * 60 * 60 * 6,
};

// Deliberately permissive: it rejects the obviously-malformed and lets Google
// be the real authority. An over-strict pattern silently drops real customers.
const EMAIL_RE = /^[^\s@,;:<>()[\]\\]+@[^\s@.,;:<>()[\]\\]+(\.[^\s@.,;:<>()[\]\\]+)+$/;

const URL_RE = /\bhttps?:\/\/|\bwww\.[a-z0-9-]+\.[a-z]{2,}/gi;

// Phrases that never appear in a South Florida remodel enquiry but are the
// backbone of contact-form spam.
const SPAM_PHRASES = [
  "seo services", "guest post", "backlink", "link building", "crypto",
  "bitcoin", "forex", "casino", "loan offer", "viagra", "cialis",
  "increase your traffic", "rank #1", "web design services",
  "outsourcing", "dear sir/madam", "business proposal",
];

const str = (v) => (typeof v === "string" ? v.trim() : "");

/**
 * Validate a submitted lead.
 * @returns {{ok: true, value: object} | {ok: false, errors: Record<string,string>}}
 */
export function validateEnquiry(body) {
  const errors = {};
  const name = str(body?.name);
  const email = str(body?.email);
  const phone = str(body?.phone);
  const message = str(body?.message);
  let service = str(body?.service);

  if (name.length < LIMITS.name.min) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name.max) errors.name = "That name is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email))
    errors.email = "That email address does not look right.";

  if (phone && phone.length > LIMITS.phone.max) errors.phone = "That phone number is too long.";

  if (message.length < LIMITS.message.min)
    errors.message = "Please tell us a little more about the project.";
  else if (message.length > LIMITS.message.max)
    errors.message = "That message is too long — please shorten it.";

  // An unrecognised service is a tampered or stale form, not a user error.
  if (!SERVICES.includes(service)) service = "Something else";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { name, email, phone: phone || null, service, message } };
}

/**
 * Score a submission for spam. Higher is worse; >= 3 is rejected.
 * Returns the reasons so a false positive can be diagnosed from logs
 * without storing the submission itself.
 */
export function scoreSpam(body, { now = Date.now() } = {}) {
  const reasons = [];
  let score = 0;

  // Honeypot: a real browser never fills a field it cannot see.
  if (str(body?.company)) {
    score += 5;
    reasons.push("honeypot");
  }

  const startedAt = Number(body?.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = now - startedAt;
    if (elapsed < LIMITS.minFillMs) {
      score += 3;
      reasons.push("too_fast");
    } else if (elapsed > LIMITS.maxFillMs) {
      score += 1;
      reasons.push("stale_token");
    }
  } else {
    // No timing token at all means the form JS never ran.
    score += 2;
    reasons.push("no_timing_token");
  }

  const message = str(body?.message);
  const links = (message.match(URL_RE) || []).length;
  if (links >= 3) {
    score += 3;
    reasons.push("many_links");
  } else if (links > 0) {
    score += 1;
    reasons.push("has_link");
  }

  const haystack = `${str(body?.name)} ${message}`.toLowerCase();
  const hit = SPAM_PHRASES.find((p) => haystack.includes(p));
  if (hit) {
    score += 3;
    reasons.push(`phrase:${hit}`);
  }

  // Cyrillic/CJK in a Broward County remodel enquiry is a strong signal.
  if (/[Ѐ-ӿ一-鿿]/.test(message)) {
    score += 2;
    reasons.push("unexpected_script");
  }

  return { score, spam: score >= 3, reasons };
}

/** Whitelist the marketing attribution we keep, and cap its size. */
export function extractAttribution(body) {
  const keep = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
  const out = {};
  for (const k of keep) {
    const v = str(body?.attribution?.[k]);
    if (v) out[k] = v.slice(0, 200);
  }
  const page = str(body?.sourcePage);
  const referrer = str(body?.referrer);
  return {
    params: out,
    sourcePage: page ? page.slice(0, 500) : null,
    referrer: referrer ? referrer.slice(0, 500) : null,
  };
}
