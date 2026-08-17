import { motion } from "framer-motion";

const stats = [
  { value: "26", label: "Years on the tools" },
  { value: "480+", label: "Homes transformed" },
  { value: "1", label: "House at a time" },
];

export default function About() {
  return (
    <section id="about" data-testid="about" className="relative border-b border-white/10">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-y-14 px-6 py-28 md:px-10 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-12 md:col-span-6"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">The Manifesto</p>
          <h2 className="mt-5 font-head text-4xl font-bold leading-[1.05] tracking-tight text-[#FAFAFA] sm:text-5xl">
            A home is not a project. It is a continuous act of care.
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="col-span-12 md:col-span-5 md:col-start-8"
        >
          <p className="text-base leading-relaxed text-[#A1A1AA] md:text-lg">
            Most contractors see a house as five separate jobs. We see one organism.
            The crew that pours your foundation understands why your kitchen island
            sits where it does. The team framing your addition already knows how the
            pergola will catch the evening light. One house, one plan, one accountable
            crew — from the first stake in the ground to the last paver.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {stats.map((s, i) => (
              <div key={i} data-testid={`about-stat-${i}`}>
                <p className="font-head text-4xl font-bold text-[#CBCC10] md:text-5xl">{s.value}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
