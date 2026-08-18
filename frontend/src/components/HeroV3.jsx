import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.22 } } };
const lineUp = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.85, ease: "easeOut" } },
};

export default function HeroV3() {
  return (
    <section id="top" data-testid="hero" className="pointer-events-none relative flex h-screen flex-col justify-between overflow-hidden">
      <div className="hero-halo absolute inset-0" aria-hidden />
      <div className="architectural-rule absolute left-6 right-6 top-24 h-px md:left-10 md:right-10" aria-hidden />
      <p className="absolute right-6 top-[6.9rem] hidden font-mono text-[10px] uppercase tracking-[0.28em] text-[#EEEDE9]/45 md:block md:right-10">
        Residential construction · South Florida
      </p>

      <motion.div variants={container} initial="hidden" animate="show" className="relative mx-auto w-full max-w-7xl px-6 pt-32 md:px-10 md:pt-[8.35rem]">
        <div className="max-w-3xl overflow-hidden">
          <motion.p variants={lineUp} data-testid="hero-overline" className="luxury-kicker font-mono text-[10px] uppercase tracking-[0.28em] md:text-xs">
            Oak Park Construction · Full-service residential builder
          </motion.p>
        </div>
        <h1 className="mt-3 max-w-[44rem] leading-[0.82] text-[#EEEDE9] sm:mt-4">
          <span className="block overflow-hidden pb-2">
            <motion.span variants={lineUp} className="font-head block text-[3.7rem] uppercase tracking-[-0.025em] [text-shadow:0_4px_38px_rgba(0,0,0,0.96)] sm:text-[5.8rem] lg:text-[7rem]" data-testid="hero-title-line-0">
              Structure
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span variants={lineUp} className="font-head block text-[3.7rem] uppercase tracking-[-0.025em] [text-shadow:0_4px_38px_rgba(0,0,0,0.96)] sm:text-[5.8rem] lg:text-[7rem]" data-testid="hero-title-line-1">
              to finish.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-3 pt-1">
            <motion.span variants={lineUp} className="font-editorial block pl-[0.03em] text-[3.15rem] font-medium tracking-[-0.045em] text-[#EEEDE9] [text-shadow:0_4px_38px_rgba(0,0,0,0.96)] sm:text-[5rem] lg:text-[5.7rem]" data-testid="hero-title-line-2">
              Built by one team.
            </motion.span>
          </span>
        </h1>
      </motion.div>

      <motion.div variants={fade} initial="hidden" animate="show" className="relative mx-auto flex w-full max-w-7xl items-end justify-between gap-8 px-6 pb-7 md:px-10 md:pb-12">
        <p data-testid="hero-sub" className="max-w-xl text-sm leading-[1.75] text-[#EEEDE9]/90 [text-shadow:0_2px_18px_rgba(0,0,0,1)] md:text-[0.98rem]">
          Scroll through the house to see structural shells, remodels, additions,
          outdoor living, concrete and pavers come into view.
        </p>
        <a href="#ch-01" data-testid="hero-cta-scroll" className="pointer-events-auto hidden shrink-0 items-center gap-3 border-b border-[#CBCC10]/70 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#EEEDE9] transition-colors hover:text-[#CBCC10] md:inline-flex md:text-xs">
          Scroll to see what we build <span className="text-[#CBCC10]" aria-hidden>↓</span>
        </a>
      </motion.div>
    </section>
  );
}
