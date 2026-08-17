import { motion } from "framer-motion";
import { BadgeCheck, Compass, UsersRound } from "lucide-react";

const principles = [
  {
    title: "Licensed Florida GC",
    text: "CBC1263425 — the credential shown on Oak Park Construction's existing website record.",
    Icon: BadgeCheck,
  },
  {
    title: "Owner-led accountability",
    text: "A direct, hands-on construction relationship from the first conversation through the final walkthrough.",
    Icon: UsersRound,
  },
  {
    title: "Built for South Florida",
    text: "Serving Broward, Palm Beach and Miami-Dade with work planned for the local climate and construction conditions.",
    Icon: Compass,
  },
];

export default function Testimonials() {
  return (
    <section data-testid="testimonials" className="relative border-b border-white/10 bg-[#0C0C0E]">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10">
        <p className="luxury-kicker font-mono text-[10px] uppercase tracking-[0.28em]">Built on Accountability</p>
        <h2 className="mt-6 max-w-3xl leading-[0.96] tracking-tight text-[#EEEDE9]">
          <span className="font-head block text-4xl uppercase sm:text-5xl">Luxury is clarity</span>
          <span className="font-editorial block text-4xl sm:text-5xl">at every step.</span>
        </h2>
        <div className="mt-16 grid grid-cols-1 border-y border-white/10 md:grid-cols-3">
          {principles.map(({ title, text, Icon }, i) => (
            <motion.article
              key={i}
              data-testid={`testimonial-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
              className="relative flex flex-col justify-between border-b border-white/10 px-0 py-10 transition-colors duration-300 last:border-b-0 md:border-b-0 md:border-r md:px-9 md:last:border-r-0"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-[#CBCC10]" strokeWidth={1.2} />
                <span className="font-editorial text-2xl text-white/25">0{i + 1}</span>
              </div>
              <div className="mt-10 border-t border-white/10 pt-6">
                <h3 className="font-head text-xl uppercase tracking-wide text-[#EEEDE9]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#D4D4D8]">{text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
