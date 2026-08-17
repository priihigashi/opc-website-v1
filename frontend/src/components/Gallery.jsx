import { motion } from "framer-motion";

const works = [
  {
    src: "/images/opc/kitchen-wide.jpg",
    tag: "Kitchen Remodel",
    title: "Crafted for daily living",
    alt: "Finished light-wood kitchen and dining space built by Oak Park Construction",
    span: "md:col-span-7",
    ratio: "aspect-[16/10]",
  },
  {
    src: "/images/opc/bathroom-wide.jpg",
    tag: "Bathroom Remodel",
    title: "Quiet materials, precise finish",
    alt: "Finished bathroom with glass shower and stone surfaces by Oak Park Construction",
    span: "md:col-span-5",
    ratio: "aspect-[4/5] md:aspect-auto md:h-full",
  },
  {
    src: "/images/opc/outdoor-kitchen-twilight.jpg",
    tag: "Outdoor Living",
    title: "Built for the evening",
    alt: "Finished illuminated outdoor kitchen and pergola by Oak Park Construction",
    span: "md:col-span-12",
    ratio: "aspect-[4/3] md:aspect-[21/9]",
  },
];

export default function Gallery() {
  return (
    <section id="work" data-testid="work" className="relative overflow-hidden border-b border-black/10 bg-[#EEEDE9]">
      <div className="pointer-events-none absolute -right-24 top-0 font-editorial text-[22rem] leading-none text-black/[0.025]" aria-hidden>O</div>
      <div className="relative mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="luxury-kicker font-mono text-[10px] uppercase tracking-[0.28em] text-[#09090B] before:bg-[#09090B]">Selected Work</p>
            <h2 className="mt-6 leading-[0.94] tracking-tight text-[#09090B]">
              <span className="font-head block text-5xl uppercase sm:text-6xl">Proof,</span>
              <span className="font-editorial block text-5xl sm:text-6xl">not promises.</span>
            </h2>
          </div>
          <p className="max-w-sm border-l border-black/20 pl-5 text-sm leading-[1.75] text-[#09090B]/70">
            A restrained selection from Oak Park Construction's finished-work archive.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-7">
          {works.map((w, i) => (
            <motion.figure
              key={i}
              data-testid={`work-card-${i}`}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-[10px] bg-[#09090B] shadow-[0_30px_80px_rgba(9,9,11,0.14)] ${w.span}`}
            >
              <div className={`overflow-hidden ${w.ratio}`}>
                <img
                  src={w.src}
                  alt={w.alt}
                  loading="lazy"
                  decoding="async"
                  width="1800"
                  height="1350"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/88 via-[#09090B]/5 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
              {i === 2 && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#09090B]/85 via-[#09090B]/20 to-transparent md:hidden" />
              )}
              <span className="absolute right-5 top-5 font-editorial text-3xl text-white/65">0{i + 1}</span>
              <figcaption className="absolute bottom-0 left-0 p-6 md:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#CBCC10]">{w.tag}</p>
                <p className="font-editorial mt-2 text-2xl text-[#EEEDE9] md:text-3xl">{w.title}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
