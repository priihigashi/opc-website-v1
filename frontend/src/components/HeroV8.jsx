import { motion, useReducedMotion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } } };
const lineUp = {
  hidden: { y: "112%" },
  show: { y: "0%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, delay: 0.78, ease: "easeOut" } },
};

export default function HeroV8({
  haloClassName = "hero-halo",
  bridgeBackground = "linear-gradient(180deg, rgba(9,9,11,0) 0%, rgba(9,9,11,0.34) 28%, rgba(9,9,11,0.92) 55%, rgba(9,9,11,0.58) 77%, rgba(9,9,11,0) 100%)",
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="top" data-testid="hero" className="pointer-events-none relative flex min-h-[100svh] flex-col justify-between overflow-x-clip">
      <div
        className={`${haloClassName} absolute inset-x-0 top-0 -bottom-[28svh]`}
        style={{
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 62%, rgba(0,0,0,0.78) 75%, transparent 100%)",
          maskImage: "linear-gradient(180deg, #000 0%, #000 62%, rgba(0,0,0,0.78) 75%, transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 -bottom-[26svh] z-[1] h-[58svh]"
        style={{
          background: bridgeBackground,
        }}
        aria-hidden
      />
      <div className="architectural-rule absolute left-5 right-5 top-[4.5rem] h-px md:left-10 md:right-10" aria-hidden />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-[2] mx-auto w-full max-w-7xl px-5 pt-[7.65rem] sm:px-7 md:px-10 md:pt-[8.75rem]"
      >
        <div className="max-w-[42rem] overflow-hidden">
          <motion.p
            variants={lineUp}
            data-testid="hero-overline"
            className="luxury-kicker font-mono text-[9px] uppercase tracking-[0.22em] sm:text-[10px] md:text-[11px] md:tracking-[0.25em]"
          >
            Full-service residential builder
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
        className="relative z-[2] mx-auto flex w-full max-w-7xl items-end justify-between gap-8 px-5 pb-10 sm:px-7 md:px-10 md:pb-16"
      >
        <div className="flex items-end gap-3">
          <p
            data-testid="hero-sub"
            className="font-mono text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-[#EEEDE9]/90 [text-shadow:0_2px_18px_rgba(0,0,0,1)] sm:text-[11px] md:text-xs md:tracking-[0.18em]"
          >
            <span className="block whitespace-nowrap">
              <span className="text-[#CBCC10]">Scroll down</span> through one house
            </span>
            <span className="block">as each Oak Park service comes into view.</span>
          </p>
          <motion.span
            data-testid="hero-scroll-arrow"
            className="mb-[0.18rem] block text-sm font-light leading-none text-white"
            animate={reduceMotion ? undefined : { y: [0, 5, 0], opacity: [0.72, 1, 0.72] }}
            transition={reduceMotion ? undefined : { duration: 1.55, ease: "easeInOut", repeat: Infinity }}
            aria-hidden
          >
            ↓
          </motion.span>
        </div>
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
