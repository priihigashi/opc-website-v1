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

export function Chapter({ id, num, side = "left", overline, title, body, bullets }) {
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
          className={`story-copy-panel pointer-events-auto col-span-12 p-5 sm:p-7 md:col-span-5 md:p-8 ${
            side === "right" ? "md:col-start-8" : "md:col-start-1"
          }`}
        >
          <div className="overflow-hidden">
            <motion.div variants={lineUp} className="flex items-baseline gap-4">
              <span
                data-testid={`${id}-number`}
                className="font-mono text-6xl font-bold text-transparent md:text-7xl"
                style={{ WebkitTextStroke: "1px rgba(203,204,16,0.7)" }}
              >
                {num}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">
                {overline}
              </span>
            </motion.div>
          </div>
          <h2 className="mt-5 font-head font-bold leading-[1.02] tracking-tight text-[#FAFAFA]">
            {title.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span variants={lineUp} className="block text-3xl sm:text-5xl" data-testid={`${id}-title-${i}`}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.p variants={fade} data-testid={`${id}-body`} className="mt-4 max-w-md text-sm leading-relaxed text-[#E4E4E7] md:mt-6 md:text-base">
            {body}
          </motion.p>
          <motion.ul variants={fade} className="mt-5 space-y-2 border-t border-white/10 pt-4 md:mt-8 md:space-y-3 md:pt-6">
            {bullets.map((b, i) => (
              <li key={i} data-testid={`${id}-bullet-${i}`} className="flex items-center gap-3 text-sm leading-snug text-[#FAFAFA]">
                <span className="h-px w-6 bg-[#CBCC10]" />
                {b}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
