import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const services = ["Shell Construction", "Kitchen + Bath Remodel", "Addition", "Outdoor Living", "Concrete + Pavers", "Something else"];

const inputCls =
  "w-full border border-white/10 bg-[#121214] px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/60 outline-none transition-colors duration-300 focus:border-[#CBCC10]";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: services[0], message: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: form.phone || null }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to send");
      toast.success("Enquiry sent — we'll be in touch within one business day.");
      setForm({ name: "", email: "", phone: "", service: services[0], message: "" });
    } catch (err) {
      toast.error(err.message || "Could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" data-testid="contact" className="relative border-b border-white/10">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-y-14 px-6 py-28 md:px-10 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-12 md:col-span-5"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">Start Your Project</p>
          <h2 className="mt-5 font-head text-4xl font-bold leading-[1.05] tracking-tight text-[#FAFAFA] sm:text-5xl">
            Your house is the next one on the screen.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#A1A1AA]">
            Tell us what you're dreaming up — a shell, a kitchen, more room, a better
            backyard. One call, one crew, one plan.
          </p>
          <div className="mt-10 space-y-3 font-mono text-sm text-[#A1A1AA]">
            <p data-testid="contact-phone">(555) 013-4477</p>
            <p data-testid="contact-email">build@oakparkconstruction.com</p>
            <p data-testid="contact-address">214 Oak Park Ave — Licensed &amp; Insured</p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          data-testid="contact-form"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="col-span-12 grid grid-cols-2 gap-4 md:col-span-6 md:col-start-7"
        >
          <input data-testid="contact-name" required minLength={2} placeholder="Full name" value={form.name} onChange={set("name")} className={`${inputCls} col-span-2 sm:col-span-1`} />
          <input data-testid="contact-email-input" required type="email" placeholder="Email" value={form.email} onChange={set("email")} className={`${inputCls} col-span-2 sm:col-span-1`} />
          <input data-testid="contact-phone-input" placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} className={`${inputCls} col-span-2 sm:col-span-1`} />
          <select data-testid="contact-service" value={form.service} onChange={set("service")} className={`${inputCls} col-span-2 sm:col-span-1`}>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <textarea data-testid="contact-message" required minLength={10} rows={5} placeholder="Tell us about your project — what, where, and when you'd like to start." value={form.message} onChange={set("message")} className={`${inputCls} col-span-2 resize-none`} />
          <button
            type="submit"
            data-testid="contact-submit"
            disabled={sending}
            className="col-span-2 flex items-center justify-center gap-3 bg-[#CBCC10] px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#09090B] transition-colors duration-300 hover:bg-[#B5B60D] disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {sending ? "Sending…" : "Send enquiry"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
