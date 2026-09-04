import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Check, AlertCircle } from "lucide-react";
import {
  FALLBACK_MAILBOX,
  SERVICES,
  buildMailto,
  interpretResponse,
  networkFallback,
  readAttribution,
} from "./contactSubmit";
import { CONVERSIONS, trackConversion, trackPhoneClick } from "@/lib/analytics";

const ENDPOINT = "/api/enquiries";

const inputCls =
  "w-full border-0 border-b border-black/20 bg-transparent px-0 py-4 text-sm text-[#09090B] placeholder-black/45 outline-none transition-colors duration-300 focus:border-[#09090B]";
const errorCls = "border-b-[#A33628] focus:border-[#A33628]";
const EMPTY = { name: "", email: "", phone: "", service: "", message: "" };

const DEFAULT_STYLES = {
  kickerClassName: "text-[#09090B] before:bg-[#09090B]",
  metaClassName: "text-[#09090B]/60",
  phoneClassName: "",
  addressClassName: "",
};

function FieldError({ id, message }) {
  if (!message) return null;
  return <p id={id} className="mt-1.5 font-mono text-[11px] text-[#A33628]">{message}</p>;
}

function FormStatus({ status, notice, successMessage }) {
  if (status === "sent") {
    return (
      <p className="flex items-start gap-2 text-sm leading-relaxed text-[#2F5E37]">
        <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {successMessage}
      </p>
    );
  }
  if (!notice) return null;
  return (
    <p className="flex items-start gap-2 text-sm leading-relaxed text-[#8F3A2C]">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      {notice}
    </p>
  );
}

// Web3Forms uses a public access key, but the browser never skips our own endpoint.
// /api/enquiries first applies the existing validation, honeypot and rate limit; only
// a `validated` response permits this component to hand the same payload to Web3Forms.
const WEB3FORMS_KEY = process.env.REACT_APP_WEB3FORMS_KEY || "";

async function postViaWeb3Forms(payload) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `New enquiry — ${payload.service || "Oak Park Construction"}`,
      from_name: "Oak Park Construction website",
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "",
      service: payload.service || "",
      message: payload.message || "",
      page: typeof window !== "undefined" ? window.location.pathname : "",
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.ok && body.success) return { status: "sent" };
  throw new Error(body.message || `web3forms ${res.status}`);
}

async function postEnquiry(payload) {
  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        deliveryProvider: WEB3FORMS_KEY ? "web3forms" : "smtp",
      }),
    });
  } catch {
    return networkFallback();
  }
  const body = await response.json().catch(() => ({}));
  if (response.ok && body.code === "validated") {
    if (!WEB3FORMS_KEY) return networkFallback();
    try {
      return await postViaWeb3Forms(payload);
    } catch {
      return { kind: "fallback", message: "We could not send that just now, so we've opened your email app instead." };
    }
  }
  return interpretResponse(response.status, body);
}

export default function ContactV5(props) {
  const {
    kickerClassName,
    metaClassName,
    phoneClassName,
    addressClassName,
    successMessage = "Thank you — your enquiry was sent to Oak Park Construction.",
  } = { ...DEFAULT_STYLES, ...props };
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error | fallback
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const startedAt = useRef(Date.now());
  const attribution = useRef({ attribution: {}, sourcePage: null, referrer: null });

  useEffect(() => {
    attribution.current = readAttribution();
    startedAt.current = Date.now();
  }, []);

  const set = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const applyOutcome = (outcome) => {
    const handlers = {
      sent: () => {
        trackConversion(CONVERSIONS.LEAD_SUBMITTED, { service: form.service, source_page: window.location.pathname });
        setStatus("sent");
        setForm(EMPTY);
        startedAt.current = Date.now();
      },
      fieldErrors: () => {
        setErrors(outcome.errors);
        setStatus("error");
        setNotice("Please check the highlighted fields.");
      },
      notice: () => {
        setStatus("error");
        setNotice(outcome.message);
      },
      // Never lose a lead: hand the visitor their mail app, pre-filled.
      fallback: () => {
        trackConversion(CONVERSIONS.LEAD_FALLBACK, { service: form.service, source_page: window.location.pathname });
        setStatus("fallback");
        setNotice(outcome.message);
        window.location.href = buildMailto(form);
      },
    };
    handlers[outcome.kind]();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrors({});
    setNotice("");
    // A service must be chosen deliberately — defaulting to the first option
    // was mislabeling most enquiries as Shell Construction.
    if (!form.service) {
      setStatus("idle");
      setErrors({ service: "Please select a service." });
      return;
    }
    applyOutcome(
      await postEnquiry({
        ...form,
        company: "", // honeypot — a real visitor never changes this
        startedAt: startedAt.current,
        ...attribution.current,
      }),
    );
  };

  const sending = status === "sending";
  const fieldCls = (key, extra = "") => `${inputCls} ${errors[key] ? errorCls : ""} ${extra}`;
  const describedBy = (key) => (errors[key] ? `err-${key}` : undefined);

  return (
    <section id="contact" data-testid="contact" className="relative overflow-hidden border-b border-black/10 bg-[#EEEDE9] text-[#09090B]">
      <div className="absolute inset-y-0 right-0 hidden w-[43%] bg-[#D8D8D2] md:block" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl grid-cols-12 gap-y-14 px-6 py-28 md:px-10 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-12 md:col-span-5"
        >
          <p className={`luxury-kicker font-mono text-[10px] font-semibold uppercase tracking-[0.28em] ${kickerClassName}`}>Start Your Project</p>
          <h2 className="mt-6 leading-[0.98] tracking-tight text-[#09090B]">
            <span className="font-head block text-4xl uppercase sm:text-5xl">Your house is</span>
            <span className="font-editorial block text-4xl sm:text-5xl">the next one on screen.</span>
          </h2>
          <p className="mt-7 max-w-md text-base leading-[1.75] text-[#09090B]/65">
            Tell us what you're dreaming up — a shell, a kitchen, more room, a better
            backyard. One call, one crew, one plan.
          </p>
          <div className={`mt-10 space-y-3 font-mono text-sm ${metaClassName}`}>
            <p data-testid="contact-phone" className={phoneClassName}><a onClick={() => trackPhoneClick("contact-section")} className="text-[#09090B] transition-colors hover:text-[#7B7C00]" href="tel:+19542586769">(954) 258-6769</a></p>
            <p data-testid="contact-email"><a className="text-[#09090B] transition-colors hover:text-[#7B7C00]" href={`mailto:${FALLBACK_MAILBOX}`}>{FALLBACK_MAILBOX}</a></p>
            <p data-testid="contact-address" className={addressClassName}>Broward · Palm Beach · Miami-Dade</p>
            <p>English · Português · Español</p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          data-testid="contact-form"
          noValidate
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="light-glass-panel col-span-12 grid grid-cols-2 gap-x-6 gap-y-3 p-6 md:col-span-6 md:col-start-7 md:p-10"
        >
          {/* Honeypot. Positioned off-screen rather than display:none, which bots detect. */}
          <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-company">Company (leave this blank)</label>
            <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="sr-only" htmlFor="contact-name">Full name</label>
            <input id="contact-name" name="name" data-testid="contact-name" autoComplete="name" placeholder="Full name"
              aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")}
              value={form.name} onChange={set("name")} className={fieldCls("name")} />
            <FieldError id="err-name" message={errors.name} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="sr-only" htmlFor="contact-email-input">Email</label>
            <input id="contact-email-input" name="email" data-testid="contact-email-input" type="email" autoComplete="email" placeholder="Email"
              aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")}
              value={form.email} onChange={set("email")} className={fieldCls("email")} />
            <FieldError id="err-email" message={errors.email} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="sr-only" htmlFor="contact-phone-input">Phone (optional)</label>
            <input id="contact-phone-input" name="phone" data-testid="contact-phone-input" type="tel" autoComplete="tel" placeholder="Phone (optional)"
              aria-invalid={Boolean(errors.phone)} value={form.phone} onChange={set("phone")} className={fieldCls("phone")} />
            <FieldError id="err-phone" message={errors.phone} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="sr-only" htmlFor="contact-service">Service</label>
            <div className="relative">
              {/* appearance-none keeps the select on the same underline baseline as the
                  Phone field (native chrome rendered it as a floating box). */}
              <select id="contact-service" name="service" data-testid="contact-service" value={form.service} onChange={set("service")}
                aria-invalid={Boolean(errors.service)} aria-describedby={describedBy("service")}
                className={`${fieldCls("service")} appearance-none rounded-none pr-6 ${form.service ? "" : "text-black/45"}`}>
                <option value="" disabled>Select a service</option>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span aria-hidden className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-xs text-black/50">▾</span>
            </div>
            <FieldError id="err-service" message={errors.service} />
          </div>

          <div className="col-span-2">
            <label className="sr-only" htmlFor="contact-message">Tell us about your project</label>
            <textarea id="contact-message" name="message" data-testid="contact-message" rows={5}
              placeholder="Tell us about your project — what, where, and when you'd like to start."
              aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("message")}
              value={form.message} onChange={set("message")} className={fieldCls("message", "resize-none")} />
            <FieldError id="err-message" message={errors.message} />
          </div>

          <button type="submit" data-testid="contact-submit" disabled={sending}
            className="luxury-pill col-span-2 mt-5 flex items-center justify-center gap-3 bg-[#09090B] px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#EEEDE9] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#202014] disabled:opacity-60">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {sending ? "Sending…" : "Send enquiry"}
          </button>

          <div role="status" aria-live="polite" data-testid="contact-status" className="col-span-2 min-h-[1.25rem]">
            <FormStatus status={status} notice={notice} successMessage={successMessage} />
          </div>
        </motion.form>
      </div>
    </section>
  );
}
