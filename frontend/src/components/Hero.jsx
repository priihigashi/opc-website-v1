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
    <section id="top" data-testid="hero" className="pointer-events-none relative flex h-screen flex-col justify-between overflow-hidden">
      <div className="hero-halo absolute inset-0" aria-hidden />
      <div className="architectural-rule absolute left-6 right-6 top-24 h-px md:left-10 md:right-10" aria-hidden />
      <p className="absolute right-6 top-[6.9rem] hidden font-mono text-[10px] uppercase tracking-[0.28em] text-[#EEEDE9]/45 md:block md:right-10">
        Residential construction · 26.1° N
      </p>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-7xl px-6 pt-32 md:px-10 md:pt-36"
      >
        <div className="max-w-3xl overflow-hidden">
          <motion.p
            variants={lineUp}
            data-testid="hero-overline"
            className="luxury-kicker font-mono text-[10px] uppercase tracking-[0.28em] md:text-xs"
          >
            Oak Park Construction · South Florida
          </motion.p>
        </div>
        <h1 className="mt-6 max-w-4xl leading-[0.86] text-[#EEEDE9]">
          <span className="block overflow-hidden pb-2">
            <motion.span variants={lineUp} className="font-head block text-6xl uppercase tracking-[-0.025em] [text-shadow:0_4px_38px_rgba(0,0,0,0.96)] sm:text-8xl lg:text-[7.2rem]" data-testid="hero-title-line-0">
              One house.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-3">
            <motion.span variants={lineUp} className="font-editorial block pl-[0.03em] text-6xl font-medium tracking-[-0.045em] text-[#EEEDE9] [text-shadow:0_4px_38px_rgba(0,0,0,0.96)] sm:text-8xl lg:text-[7.5rem]" data-testid="hero-title-line-1">
              Every craft.
            </motion.span>
          </span>
        </h1>
      </motion.div>

      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 pb-7 md:flex-row md:items-end md:justify-between md:px-10 md:pb-12"
      >
        <div className="hero-copy-panel max-w-[34rem]">
          <p data-testid="hero-sub" className="max-w-lg text-sm leading-[1.75] text-[#EEEDE9]/90 md:text-[0.98rem]">
            One accountable team, from structure to final detail. Scroll through the
            same South Florida home as each discipline comes into view.
          </p>
        </div>
        <div className="pointer-events-auto flex items-center gap-4">
          <a
            href="#ch-01"
            data-testid="hero-cta-scroll"
            className="luxury-pill inline-flex items-center gap-3 bg-[#CBCC10] px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#09090B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#DADB19] md:text-xs"
          >
            Explore the house <span aria-hidden>↘</span>
          </a>
          <span className="hidden font-mono text-xs uppercase tracking-[0.25em] text-[#A1A1AA] md:block">
            Scroll ↓
          </span>
        </div>
      </motion.div>
    </section>
  );
}
