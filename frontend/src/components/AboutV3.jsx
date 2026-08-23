import { motion } from "framer-motion";

const positions = [
  {
    eyebrow: "Scope",
    title: "Full-service",
    detail: "From structure to final detail",
  },
  {
    eyebrow: "Accountability",
    title: "Owner-led",
    detail: "Direct oversight throughout",
  },
  {
    eyebrow: "Service area",
    title: "South Florida",
    detail: "Broward · Palm Beach · Miami-Dade",
  },
];

export default function AboutV3() {
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
          <p className="luxury-kicker font-mono text-[10px] uppercase tracking-[0.28em]">The OPC approach</p>
          <h2 className="mt-6 leading-[0.98] tracking-tight text-[#EEEDE9]">
            <span className="font-head block text-4xl uppercase sm:text-5xl">One team sees the whole home</span>
            <span className="font-editorial mt-2 block text-4xl sm:text-5xl">Every detail works together</span>
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
            Instead of coordinating separate contractors for each phase, you work with
            one accountable team. We plan the structure, interiors and outdoor spaces
            together so every decision supports the finished home.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="col-span-12 mt-2 grid border-t border-white/15 md:mt-8 md:grid-cols-3"
          aria-label="Oak Park Construction positioning"
        >
          {positions.map((position, index) => (
            <article
              key={position.title}
              className={`group relative py-8 md:min-h-52 md:px-8 md:py-10 ${
                index ? "border-t border-white/15 md:border-l md:border-t-0" : ""
              }`}
            >
              <span
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[#CBCC10] transition-transform duration-500 group-hover:scale-x-100 md:inset-x-8"
                aria-hidden
              />
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#CBCC10]">
                {position.eyebrow}
              </p>
              <h3 className="mt-6 font-head text-[clamp(2rem,3.5vw,3.75rem)] uppercase leading-[0.88] tracking-[-0.025em] text-[#EEEDE9]">
                {position.title}
              </h3>
              <p className="mt-6 max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[#A1A1AA]">
                {position.detail}
              </p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
