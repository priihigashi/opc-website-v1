import { motion } from "framer-motion";

const stats = [
  { value: "09", label: "Construction services" },
  { value: "01", label: "Accountable team" },
  { value: "FL", label: "South Florida homes" },
];

export default function AboutV2() {
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
            <span className="font-head block text-4xl uppercase sm:text-5xl">One team sees the whole home.</span>
            <span className="font-editorial mt-2 block text-4xl sm:text-5xl">Every detail works together.</span>
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
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-editorial text-3xl text-[#CBCC10] md:text-5xl">{stat.value}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
