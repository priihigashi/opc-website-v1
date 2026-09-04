// POST /api/enquiries — the Oak Park Construction lead form endpoint.
//
// PRIVACY: this endpoint never stores the message or contact details. It emits
// limited operational logs (event, connection digest, service, spam reasons,
// and scrubbed error codes), then discards the request after delivery. There is
// no customer database or account.
//
// CONFIGURATION GATE: delivery requires either the approved Web3Forms access
// key or SMTP credentials. Web3Forms delivery stays browser-side (as required
// by that provider), but only after this endpoint validates and screens the lead.

import { validateEnquiry, scoreSpam, extractAttribution } from "./_lib/validate.mjs";
import { renderSubject, renderText, renderHtml, headerSafe } from "./_lib/render.mjs";

const RATE = { limit: 5, windowMs: 10 * 60 * 1000 };

// Per-instance only. Serverless spreads traffic across instances, so this
// throttles a single abusive client without pretending to be a global limiter.
const buckets = new Map();

function rateLimited(key, now = Date.now()) {
  const hits = (buckets.get(key) || []).filter((t) => now - t < RATE.windowMs);
  if (hits.length >= RATE.limit) return true;
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear(); // crude bound; this is not a datastore
  return false;
}

/** Never log a raw IP — a short salted digest is enough to correlate abuse. */
async function ipTag(ip) {
  const data = new TextEncoder().encode(`opc:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 4))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readConfig(env) {
  const to = env.OPC_LEAD_TO;
  const user = env.OPC_SMTP_USER;
  const pass = env.OPC_SMTP_PASS;
  const missing = [];
  if (!to) missing.push("OPC_LEAD_TO");
  if (!user) missing.push("OPC_SMTP_USER");
  if (!pass) missing.push("OPC_SMTP_PASS");
  const smtpReady = missing.length === 0;
  return {
    ready: smtpReady,
    smtpReady,
    missing,
    to,
    user,
    pass,
    from: env.OPC_LEAD_FROM || user,
    bcc: env.OPC_LEAD_BCC || null,
    host: env.OPC_SMTP_HOST || "smtp.gmail.com",
    port: Number(env.OPC_SMTP_PORT || 465),
  };
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let raw = "";
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return null; // signals malformed JSON, distinct from an empty body
  }
}

const send = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
};

/** Keep provider error text out of logs; it can echo an email address. */
export function operationalErrorTag(err) {
  const rawCode = typeof err?.code === "string" ? err.code : "unknown";
  const code = rawCode.replace(/[^a-z0-9_-]/gi, "_").slice(0, 48) || "unknown";
  const responseCode = Number.isInteger(err?.responseCode) ? err.responseCode : null;
  return responseCode ? `code=${code} response=${responseCode}` : `code=${code}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, code: "method_not_allowed" });
  }

  const body = await readBody(req);
  if (body === null) return send(res, 400, { ok: false, code: "malformed_json" });
  const web3formsRequested = body?.deliveryProvider === "web3forms";

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  const tag = await ipTag(ip);

  // Privacy alignment: the in-memory limiter keys on the salted short digest,
  // never the raw IP, so implementation matches the privacy disclosure.
  if (rateLimited(tag)) {
    console.warn(`[enquiries] rate_limited ip=${tag}`);
    return send(res, 429, {
      ok: false,
      code: "rate_limited",
      message: "You have sent several enquiries already. Please email us directly.",
    });
  }

  const spam = scoreSpam(body);
  if (spam.spam) {
    // Answer 200 so a bot cannot tune itself against our rejection, and log the
    // reasons so a real person caught by mistake can be found without keeping
    // their message.
    console.warn(`[enquiries] rejected_spam ip=${tag} score=${spam.score} reasons=${spam.reasons.join("|")}`);
    return send(res, 200, { ok: true, code: "received" });
  }

  const parsed = validateEnquiry(body);
  if (!parsed.ok) return send(res, 400, { ok: false, code: "invalid", errors: parsed.errors });

  const enquiry = parsed.value;
  const attribution = extractAttribution(body);

  // Web3Forms documents client-side submission as its supported default. This
  // response proves our controls ran; the browser then submits to the provider.
  if (web3formsRequested) {
    console.info(`[enquiries] validated ip=${tag} service=${enquiry.service}`);
    return send(res, 200, { ok: true, code: "validated" });
  }

  // Validation and bot screening must remain truthful even while delivery is
  // unconfigured. Only a legitimate SMTP-bound lead reaches this gate.
  const config = readConfig(process.env);
  if (!config.ready) {
    console.warn(`[enquiries] config_pending missing=${config.missing.join(",")}`);
    return send(res, 503, { ok: false, code: "config_pending" });
  }

  let transport;
  try {
    const { default: nodemailer } = await import("nodemailer");
    transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    });
  } catch (err) {
    console.error(`[enquiries] transport_unavailable ${operationalErrorTag(err)}`);
    return send(res, 503, { ok: false, code: "config_pending" });
  }

  try {
    await transport.sendMail({
      from: `"Oak Park Construction Website" <${config.from}>`,
      to: config.to,
      ...(config.bcc ? { bcc: config.bcc } : {}),
      replyTo: `"${headerSafe(enquiry.name)}" <${headerSafe(enquiry.email)}>`,
      subject: renderSubject(enquiry),
      text: renderText(enquiry, attribution),
      html: renderHtml(enquiry, attribution),
    });
  } catch (err) {
    // No PII or provider prose in the log line — just enough to diagnose a
    // delivery outage without risking an echoed recipient address.
    console.error(`[enquiries] send_failed ip=${tag} service=${enquiry.service} ${operationalErrorTag(err)}`);
    return send(res, 502, {
      ok: false,
      code: "send_failed",
      message: "We could not send your enquiry just now.",
    });
  }

  console.info(`[enquiries] sent ip=${tag} service=${enquiry.service}`);
  return send(res, 200, { ok: true, code: "sent" });
}
