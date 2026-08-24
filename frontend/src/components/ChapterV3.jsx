import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { scrollStore } from "@/lib/scrollStore";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const lineUp = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (p, a, b) => clamp01((p - a) / Math.max(1e-6, b - a));

/**
 * T-258/T-261 chapter panel choreography.
 *
 * Each panel is gated to an exact normalized story-progress window so the order
 * TRANSFORM -> SETTLE -> PANEL -> PANEL OUT -> SOLO HOLD -> NEXT TRANSFORM can
 * never be broken by layout drift:
 *   opacity = seg(p, enter, enter+0.010) * (1 - seg(p, exitStart, exitEnd))
 * The section itself provides a sticky full-viewport stage, so whenever the
 * window is open the panel is guaranteed to sit beside the completed house
 * rather than wherever raw document flow happens to have scrolled it.
 *
 * Sizing (T-261): desktop >=1024 clamp(340px,28vw,430px), tablet 768-1023 max
 * 360px/40vw, phone no overlay-lane — the panel is a bottom block of width
 * calc(100% - 32px) capped at 430px. Reduced-motion visitors get the panel
 * without scroll-window gating (always readable).
 */
export function ChapterV3({
  id,
  num,
  side = "left",
  overline,
  title,
  body,
  bullets,
  portfolioHref,
  portfolioLabel,
  compact = false,
  panelLayout,
  window: panelWindow = null,
}) {
  const panelRef = useRef(null);
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (reduced || !panelWindow) return undefined;
    let raf = 0;
    const dir = side === "right" ? 1 : -1;
    const tick = () => {
      const el = panelRef.current;
      if (el) {
        const p = clamp01(scrollStore.p);
        const { enter, exitStart, exitEnd } = panelWindow;
        const visible = seg(p, enter, enter + 0.01) * (1 - seg(p, exitStart, exitEnd));
        el.style.opacity = String(visible);
        el.style.transform = `translateX(${(1 - visible) * 24 * dir}px)`;
        el.style.pointerEvents = visible > 0.6 ? "auto" : "none";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, panelWindow, side]);

  const lane = panelLayout || (side === "right"
    ? "md:col-span-6 md:col-start-7 md:justify-self-end lg:col-span-5 lg:col-start-8"
    : "md:col-span-6 md:col-start-1 md:justify-self-start lg:col-span-5 lg:col-start-1");

  return (
    <section
      id={id}
      data-testid={id}
      className="pointer-events-none relative min-h-[170vh]"
    >
      <div className="sticky top-0 flex h-screen items-end pb-8 md:items-center md:pb-0">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-12 px-4 md:px-10">
          <motion.div
            ref={panelRef}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-25%" }}
            data-testid={`${id}-panel`}
            style={{ opacity: reduced || !panelWindow ? 1 : 0 }}
            className={`story-copy-panel pointer-events-auto col-span-12 mx-auto w-[calc(100%-16px)] max-w-[430px] md:mx-0 md:w-[clamp(300px,40vw,360px)] md:max-w-none lg:w-[clamp(340px,28vw,430px)] ${lane} ${
              compact ? "p-6 sm:p-8 md:p-7 lg:p-8" : "p-6 sm:p-8 md:p-9"
            }`}
          >
            <div className="overflow-hidden">
              <motion.div variants={lineUp} className="flex items-center gap-4">
                <span
                  data-testid={`${id}-number`}
                  className={`font-editorial font-medium text-[#EEEDE9]/20 ${compact ? "text-6xl md:text-6xl" : "text-6xl md:text-7xl"}`}
                >
                  {num}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">
                  {overline}
                </span>
              </motion.div>
            </div>
            <h2 className={`${compact ? "mt-3" : "mt-5"} leading-[0.98] tracking-tight text-[#EEEDE9]`}>
              {title.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-1">
                  <motion.span
                    variants={lineUp}
                    className={`${i === title.length - 1 && title.length > 1 ? "font-editorial" : "font-head uppercase"} block ${
                      compact ? "text-3xl sm:text-4xl lg:text-[2.65rem]" : "text-3xl sm:text-5xl"
                    }`}
                    data-testid={`${id}-title-${i}`}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>
            <motion.p
              variants={fade}
              data-testid={`${id}-body`}
              className={`max-w-md text-sm leading-relaxed text-[#E4E4E7] ${
                compact ? "mt-4 md:text-[0.95rem]" : "mt-4 md:mt-6 md:text-base"
              }`}
            >
              {body}
            </motion.p>
            <motion.div variants={fade} className="mt-4">
              <Link
                to={portfolioHref}
                data-testid={`${id}-portfolio-link`}
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#CBCC10] underline decoration-[#CBCC10]/55 underline-offset-8 transition-colors hover:text-[#E5E655] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CBCC10]"
              >
                <span>{portfolioLabel}</span>
                <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
            <motion.ul
              variants={fade}
              className={`space-y-2 border-t border-white/10 pt-4 ${
                compact ? "mt-4 md:space-y-2 md:pt-4" : "mt-4 md:mt-6 md:space-y-3 md:pt-5"
              }`}
            >
              {bullets.map((bullet, i) => (
                <li key={i} data-testid={`${id}-bullet-${i}`} className="flex items-center gap-3 text-sm leading-snug text-[#FAFAFA]">
                  <span className="h-px w-6 shrink-0 bg-[#CBCC10]" />
                  {bullet}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
