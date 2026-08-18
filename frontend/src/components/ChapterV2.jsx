import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const lineUp = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function ChapterV2({
  id,
  num,
  side = "left",
  overline,
  title,
  body,
  bullets,
  compact = false,
  panelLayout,
}) {
  const layout = panelLayout || (side === "right"
    ? "md:col-span-5 md:col-start-8"
    : "md:col-span-5 md:col-start-1");

  return (
    <section
      id={id}
      data-testid={id}
      className="pointer-events-none relative flex min-h-[170vh] items-end pb-8 md:items-center md:pb-0"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 px-5 md:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-25%" }}
          data-testid={`${id}-panel`}
          className={`story-copy-panel pointer-events-auto col-span-12 ${layout} ${
            compact ? "p-6 sm:p-8 md:-translate-y-[5vh] md:p-7 lg:p-8" : "p-6 sm:p-8 md:p-9"
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
          <motion.ul
            variants={fade}
            className={`space-y-2 border-t border-white/10 pt-4 ${
              compact ? "mt-5 md:space-y-2 md:pt-4" : "mt-5 md:mt-8 md:space-y-3 md:pt-6"
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
    </section>
  );
}
