// Pure helpers for the lead form. Kept out of the component so the submit
// branches can be unit-tested and so the component stays under the repo's
// cyclomatic-complexity gate.

export const FALLBACK_MAILBOX = "contact@oakpark-construction.com";

export const SERVICES = [
  "Shell Construction",
  "Kitchen + Bath Remodel",
  "Addition",
  "Outdoor Living",
  "Concrete + Pavers",
  "Something else",
];

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

/** Marketing attribution, read once on mount so a later navigation cannot lose it. */
export function readAttribution(win = typeof window === "undefined" ? null : window) {
  if (!win) return { attribution: {}, sourcePage: null, referrer: null };
  const params = new URLSearchParams(win.location.search);
  const attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) attribution[key] = value;
  }
  return {
    attribution,
    sourcePage: win.location.href,
    referrer: win.document?.referrer || null,
  };
}

export function buildMailto(form) {
  const subject = encodeURIComponent(`Website project enquiry — ${form.service}`);
  const body = encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "—"}\nService: ${form.service}\n\n${form.message}`,
  );
  return `mailto:${FALLBACK_MAILBOX}?subject=${subject}&body=${body}`;
}

const FALLBACK_COPY = {
  network: "We could not reach our server, so we've opened your email app instead.",
  config: "Our contact form is still being connected, so we've opened your email app instead.",
  failed: "We could not send that just now, so we've opened your email app instead.",
};

/**
 * Decide what the UI should do about a server response.
 * Every branch that is not an outright success hands the visitor their mail app,
 * so a misconfiguration or outage can never silently swallow a lead.
 * @returns {{kind:"sent"} | {kind:"fieldErrors", errors:object} | {kind:"notice", message:string} | {kind:"fallback", message:string}}
 */
export function interpretResponse(status, payload = {}) {
  if (status === 200 && payload.ok) return { kind: "sent" };
  if (status === 400 && payload.errors) return { kind: "fieldErrors", errors: payload.errors };
  if (status === 429) {
    return {
      kind: "notice",
      message: payload.message || "You have sent several enquiries already. Please call us instead.",
    };
  }
  return { kind: "fallback", message: status === 503 ? FALLBACK_COPY.config : FALLBACK_COPY.failed };
}

export const networkFallback = () => ({ kind: "fallback", message: FALLBACK_COPY.network });
