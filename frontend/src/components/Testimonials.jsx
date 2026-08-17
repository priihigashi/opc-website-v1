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
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">Built on Accountability</p>
        <h2 className="mt-5 max-w-3xl font-head text-4xl font-bold tracking-tight text-[#FAFAFA] sm:text-5xl">
          Luxury is clarity at every step.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {principles.map(({ title, text, Icon }, i) => (
            <motion.article
              key={i}
              data-testid={`testimonial-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
              className="flex flex-col justify-between border border-white/10 bg-[#121214] p-8 transition-colors duration-300 hover:border-[#CBCC10]/40"
            >
              <Icon className="h-6 w-6 text-[#CBCC10]" strokeWidth={1.4} />
              <div className="mt-10 border-t border-white/10 pt-6">
                <h3 className="font-head text-xl font-bold text-[#FAFAFA]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#D4D4D8]">{text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
