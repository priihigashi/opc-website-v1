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
    src: "/images/opc/outdoor-kitchen-dusk.jpg",
    tag: "Outdoor Living",
    title: "Built for the evening",
    alt: "Finished illuminated outdoor kitchen and pergola by Oak Park Construction",
    span: "md:col-span-12",
    ratio: "aspect-[21/9]",
  },
];

export default function Gallery() {
  return (
    <section id="work" data-testid="work" className="relative border-b border-black/10 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#09090B]">Selected Work</p>
            <h2 className="mt-5 font-head text-4xl font-bold tracking-tight text-[#09090B] sm:text-5xl">
              Proof, not promises.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#09090B]/75">
            Real finished work from the Oak Park Construction project archive.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          {works.map((w, i) => (
            <motion.figure
              key={i}
              data-testid={`work-card-${i}`}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden border border-black/25 ${w.span}`}
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/85 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#CBCC10]">{w.tag}</p>
                <p className="mt-1 font-head text-xl font-bold text-[#FAFAFA]">{w.title}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
