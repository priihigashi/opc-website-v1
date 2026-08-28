// GA4 staging — INERT BY DEFAULT.
//
// Nothing loads, no cookie is set and no request leaves the browser unless
// REACT_APP_GA4_ID is present at build time. That keeps the privacy page's
// "does not currently use advertising trackers or marketing cookies" true until
// the moment someone deliberately supplies an ID.
//
// Consent: GA4 Consent Mode v2 is initialised DENIED for ad storage and ad
// personalisation and GRANTED only for analytics_storage. That is the
// conservative default; a cookie banner can later call grantConsent().

const GA4_ID = process.env.REACT_APP_GA4_ID || "";
const GTM_ID = process.env.REACT_APP_GTM_ID || "";

// Either route activates analytics. GTM takes precedence when both are set,
// because a container is normally configured to load GA4 itself and loading
// both directly would double-count every event.
export const analyticsEnabled = Boolean(GA4_ID || GTM_ID);
export const analyticsRoute = GTM_ID ? "gtm" : (GA4_ID ? "ga4" : "none");

// GA4 reads arguments off the dataLayer positionally, so each call is pushed
// as an array rather than an object.
const push = (...args) => {
  if (window.dataLayer) window.dataLayer.push(args);
};

let started = false;

/** Load GA4 once. A no-op when no measurement ID is configured. */
export function initAnalytics() {
  if (!analyticsEnabled || started || typeof window === "undefined") return false;
  started = true;

  window.dataLayer = window.dataLayer || [];
  push("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  push("js", new Date());

  const script = document.createElement("script");
  script.async = true;
  if (GTM_ID) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  } else {
    // send_page_view is disabled so SPA route changes are the single source of
    // pageviews; otherwise the first route double-counts.
    push("config", GA4_ID, { send_page_view: false, anonymize_ip: true });
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  }
  document.head.appendChild(script);
  return true;
}

export function trackPageView(path, title) {
  if (!analyticsEnabled) return;
  push("event", "page_view", { page_path: path, page_title: title || document.title });
}

/** Conversion events. Names are fixed here so reporting cannot drift. */
export const CONVERSIONS = {
  LEAD_SUBMITTED: "generate_lead",
  LEAD_FALLBACK: "lead_mail_app_fallback",
  PHONE_CLICK: "phone_click",
  CTA_CLICK: "cta_click",
};

export function trackConversion(name, params = {}) {
  if (!analyticsEnabled) return;
  push("event", name, params);
}

// PRIVACY BOUNDARY: the helpers below are the only way a click event is
// reported, and they accept a fixed `placement` label plus the current path.
// Nothing typed into the form can reach analytics through them. Do not widen
// the signature to take arbitrary params — that is how message bodies and email
// addresses end up in a GA4 property.
const here = () =>
  typeof window === "undefined" ? "" : window.location.pathname;

/** A phone tap. `placement` is where the number was tapped, e.g. "footer". */
export function trackPhoneClick(placement) {
  trackConversion(CONVERSIONS.PHONE_CLICK, {
    placement,
    source_page: here(),
  });
}

/** A primary call-to-action click, e.g. the nav "Start a project" pill. */
export function trackCtaClick(placement) {
  trackConversion(CONVERSIONS.CTA_CLICK, {
    placement,
    source_page: here(),
  });
}

/** Called by a cookie banner if one is added later. */
export function grantAdConsent() {
  if (!analyticsEnabled) return;
  push("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
}
