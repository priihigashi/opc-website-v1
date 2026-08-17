import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } } };
const lineUp = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.9, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section id="top" data-testid="hero" className="pointer-events-none relative flex h-screen flex-col justify-between">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-7xl px-6 pt-32 md:px-10 md:pt-36"
      >
        <div className="overflow-hidden">
          <motion.p
            variants={lineUp}
            data-testid="hero-overline"
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]"
          >
            Oak Park Construction — General Contractors, Est. 1998
          </motion.p>
        </div>
        <h1 className="mt-6 font-head font-bold leading-[0.95] tracking-tighter text-[#FAFAFA]">
          {["One house.", "Every craft."].map((line, i) => (
            <span key={i} className="block overflow-hidden pb-1">
              <motion.span variants={lineUp} className="block text-5xl sm:text-7xl lg:text-8xl" data-testid={`hero-title-line-${i}`}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
      </motion.div>

      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-14 md:flex-row md:items-end md:justify-between md:px-10"
      >
        <p data-testid="hero-sub" className="max-w-md text-base leading-relaxed text-[#A1A1AA] md:text-lg">
          From the first blueprint line to the last paver, watch one home take shape —
          shell, kitchen, addition, backyard, driveway. Scroll, and the same house
          becomes everything we build.
        </p>
        <div className="pointer-events-auto flex items-center gap-4">
          <a
            href="#ch-01"
            data-testid="hero-cta-scroll"
            className="bg-[#CBCC10] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#09090B] transition-colors duration-300 hover:bg-[#B5B60D]"
          >
            Watch it build
          </a>
          <span className="hidden font-mono text-xs uppercase tracking-[0.25em] text-[#A1A1AA] md:block">
            Scroll ↓
          </span>
        </div>
      </motion.div>
    </section>
  );
}
