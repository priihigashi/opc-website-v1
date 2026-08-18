import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } } };
const lineUp = {
  hidden: { y: "112%" },
  show: { y: "0%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, delay: 0.78, ease: "easeOut" } },
};

export default function HeroV4() {
  return (
    <section id="top" data-testid="hero" className="pointer-events-none relative flex min-h-[100svh] flex-col justify-between overflow-hidden">
      <div className="hero-halo absolute inset-0" aria-hidden />
      <div className="architectural-rule absolute left-5 right-5 top-[4.5rem] h-px md:left-10 md:right-10" aria-hidden />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-7xl px-5 pt-[7.65rem] sm:px-7 md:px-10 md:pt-[8.75rem]"
      >
        <div className="max-w-[42rem] overflow-hidden">
          <motion.p
            variants={lineUp}
            data-testid="hero-overline"
            className="luxury-kicker font-mono text-[9px] uppercase tracking-[0.22em] sm:text-[10px] md:text-[11px] md:tracking-[0.25em]"
          >
            <span className="sm:hidden">Oak Park Construction · South Florida</span>
            <span className="hidden sm:inline">Oak Park Construction · Full-service residential builder</span>
          </motion.p>
        </div>

        <h1 className="mt-4 max-w-[36rem] text-[#EEEDE9] md:mt-5 lg:max-w-[40rem]">
          <span className="block overflow-hidden pb-[0.08em] pt-[0.1em]">
            <motion.span
              variants={lineUp}
              className="font-head block text-[clamp(4.1rem,7vw,7rem)] uppercase leading-[0.88] tracking-[-0.025em]"
              data-testid="hero-title-line-0"
            >
              One team.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em] pt-[0.02em]">
            <motion.span
              variants={lineUp}
              className="font-editorial block pl-[0.02em] text-[clamp(3.45rem,5.4vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em]"
              data-testid="hero-title-line-1"
            >
              Every detail.
            </motion.span>
          </span>
        </h1>
      </motion.div>

      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-7xl items-end justify-between gap-8 px-5 pb-7 sm:px-7 md:px-10 md:pb-11"
      >
        <p data-testid="hero-sub" className="max-w-[29rem] text-sm leading-[1.7] text-[#EEEDE9]/88 [text-shadow:0_2px_18px_rgba(0,0,0,1)] md:text-[0.98rem]">
          Scroll through one house as each Oak Park service comes into view.
        </p>
        <a
          href="#ch-01"
          data-testid="hero-cta-scroll"
          className="pointer-events-auto hidden shrink-0 items-center gap-3 border-b border-[#CBCC10]/70 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#EEEDE9] transition-colors hover:text-[#CBCC10] md:inline-flex md:text-xs"
        >
          See what we build <span className="text-[#CBCC10]" aria-hidden>↓</span>
        </a>
      </motion.div>
    </section>
  );
}
