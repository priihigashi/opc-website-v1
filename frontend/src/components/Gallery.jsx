import { motion } from "framer-motion";

const works = [
  {
    src: "https://images.unsplash.com/photo-1706855203772-c249b75fe016?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwaG91c2UlMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzg2OTMxNjU5fDA&ixlib=rb-4.1.0&q=85",
    tag: "Shell + Addition",
    title: "Maple Street Residence",
    span: "md:col-span-7",
    ratio: "aspect-[16/10]",
  },
  {
    src: "https://images.unsplash.com/photo-1628745277862-bc0b2d68c50c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBraXRjaGVuJTIwcmVtb2RlbCUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODY5MzE2NTl8MA&ixlib=rb-4.1.0&q=85",
    tag: "Kitchen Remodel",
    title: "The Galley, Reopened",
    span: "md:col-span-5",
    ratio: "aspect-[4/5] md:aspect-auto md:h-full",
  },
  {
    src: "https://images.unsplash.com/photo-1527359443443-84a48aec73d2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvdXRkb29yJTIwcGF0aW8lMjBwZXJnb2xhfGVufDB8fHx8MTc4NjkzMTY2N3ww&ixlib=rb-4.1.0&q=85",
    tag: "Outdoor Living",
    title: "Cedar Pergola Court",
    span: "md:col-span-12",
    ratio: "aspect-[21/9]",
  },
];

export default function Gallery() {
  return (
    <section id="work" data-testid="work" className="relative border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">Selected Work</p>
            <h2 className="mt-5 font-head text-4xl font-bold tracking-tight text-[#FAFAFA] sm:text-5xl">
              Proof, not promises.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#A1A1AA]">
            Every project below started as the same blueprint you just scrolled through.
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
              className={`group relative overflow-hidden border border-white/10 ${w.span}`}
            >
              <div className={`overflow-hidden ${w.ratio}`}>
                <img
                  src={w.src}
                  alt={w.title}
                  loading="lazy"
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
