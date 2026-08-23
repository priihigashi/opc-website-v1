import { useState } from "react";
import { motion } from "framer-motion";

const works = [
  {
    src: "/images/opc/kitchen-wide.jpg",
    tag: "Kitchen Remodel",
    title: "Crafted for daily living",
    alt: "Finished light-wood kitchen and dining space built by Oak Park Construction",
    span: "md:col-span-7",
    ratio: "aspect-[16/10]",
    exposure: 0.86,
  },
  {
    src: "/images/opc/bathroom-wide.jpg",
    tag: "Bathroom Remodel",
    title: "Quiet materials, precise finish",
    alt: "Finished bathroom with glass shower and stone surfaces by Oak Park Construction",
    span: "md:col-span-5",
    ratio: "aspect-[4/5] md:aspect-auto md:h-full",
    exposure: 0.84,
  },
  {
    // Approved 2026-08-19. Do not replace with the dusk or original twilight files.
    src: "/images/opc/outdoor-kitchen-twilight-wide-v2.jpg",
    tag: "Outdoor Living",
    title: "Built for the evening",
    alt: "Finished illuminated outdoor kitchen and pergola by Oak Park Construction",
    span: "md:col-span-12",
    ratio: "aspect-[4/3] md:aspect-[21/9]",
    exposure: 0.94,
  },
];

function GalleryImage({ work }) {
  const [retry, setRetry] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = retry ? `${work.src}?retry=1` : work.src;

  const handleError = () => {
    if (!retry) {
      setRetry(true);
      return;
    }
    setFailed(true);
  };

  if (failed) {
    return (
      <div
        role="img"
        aria-label={work.alt}
        className="flex h-full w-full items-center justify-center bg-[#111113] px-8 text-center"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          Photography temporarily unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={work.alt}
      loading="lazy"
      decoding="async"
      width="1800"
      height="1350"
      onError={handleError}
      style={{ filter: `brightness(${work.exposure}) contrast(1.03) saturate(0.96)` }}
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
    />
  );
}

export default function GalleryV4() {
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
            <p
              className="luxury-kicker font-mono text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: "#747500" }}
            >
              Selected Work
            </p>
            <h2 className="mt-6 leading-[0.94] tracking-tight text-[#09090B]">
              <span className="font-head block text-5xl uppercase sm:text-6xl">Proof,</span>
              <span className="font-editorial block text-5xl sm:text-6xl">not promises</span>
            </h2>
          </div>
          <p className="max-w-sm border-l border-black/20 pl-5 text-sm leading-[1.75] text-[#09090B]/70">
            A restrained selection from Oak Park Construction's finished-work archive.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-7">
          {works.map((work, index) => (
            <motion.figure
              key={work.src}
              data-testid={`work-card-${index}`}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-[10px] bg-[#09090B] shadow-[0_30px_80px_rgba(9,9,11,0.14)] ${work.span}`}
            >
              <div className={`overflow-hidden ${work.ratio}`}>
                <GalleryImage work={work} />
              </div>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.50) 34%, rgba(9,9,11,0.10) 70%, rgba(9,9,11,0) 100%)",
                }}
              />
              <span className="absolute right-5 top-5 font-editorial text-3xl text-white/70">0{index + 1}</span>
              <figcaption className="absolute bottom-0 left-0 max-w-[92%] p-6 md:p-8">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-[#D7D80F]">{work.tag}</p>
                <p className="font-editorial mt-2 text-2xl text-[#F4F2EC] md:text-3xl">{work.title}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
