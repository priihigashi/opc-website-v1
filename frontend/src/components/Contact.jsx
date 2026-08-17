import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : null;
const services = ["Shell Construction", "Kitchen + Bath Remodel", "Addition", "Outdoor Living", "Concrete + Pavers", "Something else"];

const inputCls =
  "w-full border-0 border-b border-black/20 bg-transparent px-0 py-4 text-sm text-[#09090B] placeholder-black/45 outline-none transition-colors duration-300 focus:border-[#09090B]";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: services[0], message: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!API) {
      const subject = encodeURIComponent(`Website project enquiry — ${form.service}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "—"}\nService: ${form.service}\n\n${form.message}`);
      window.location.href = `mailto:priscila@oakpark-construction.com?subject=${subject}&body=${body}`;
      return;
    }
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
          <p className="luxury-kicker font-mono text-[10px] uppercase tracking-[0.28em] text-[#09090B] before:bg-[#09090B]">Start Your Project</p>
          <h2 className="mt-6 leading-[0.98] tracking-tight text-[#09090B]">
            <span className="font-head block text-4xl uppercase sm:text-5xl">Your house is</span>
            <span className="font-editorial block text-4xl sm:text-5xl">the next one on screen.</span>
          </h2>
          <p className="mt-7 max-w-md text-base leading-[1.75] text-[#09090B]/65">
            Tell us what you're dreaming up — a shell, a kitchen, more room, a better
            backyard. One call, one crew, one plan.
          </p>
          <div className="mt-10 space-y-3 font-mono text-sm text-[#09090B]/60">
            <p data-testid="contact-phone"><a className="text-[#09090B] transition-colors hover:text-[#7B7C00]" href="tel:+19542586769">(954) 258-6769</a></p>
            <p data-testid="contact-email"><a className="text-[#09090B] transition-colors hover:text-[#7B7C00]" href="mailto:priscila@oakpark-construction.com">priscila@oakpark-construction.com</a></p>
            <p data-testid="contact-address">Broward · Palm Beach · Miami-Dade</p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          data-testid="contact-form"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="light-glass-panel col-span-12 grid grid-cols-2 gap-x-6 gap-y-3 p-6 md:col-span-6 md:col-start-7 md:p-10"
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
            className="luxury-pill col-span-2 mt-5 flex items-center justify-center gap-3 bg-[#09090B] px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#EEEDE9] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#202014] disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {sending ? "Sending…" : "Send enquiry"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
