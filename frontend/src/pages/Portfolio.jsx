import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FILTERS = ["ALL", "KITCHEN + BATH", "OUTDOOR LIVING"];

// Each project owns one or more gallery rows (e.g. Before / After / Progress).
const PROJECTS = [
  {
    num: "01", cat: "KITCHEN + BATH", title: "Kitchen & Bath Craftsmanship",
    rows: [
      { label: "Finished kitchens", imgs: ["/images/opc/kitchen-wide.jpg", "/images/opc/kitchen-walnut.jpg"] },
      { label: "Finished bathrooms", imgs: ["/images/opc/bathroom-wide.jpg", "/images/opc/bathroom-alt.jpg"] },
    ],
  },
  {
    num: "02", cat: "OUTDOOR LIVING", title: "Outdoor Kitchen & Pergola",
    rows: [
      { label: "Finished work", imgs: ["/images/opc/outdoor-kitchen-dusk.jpg"] },
    ],
  },
];

function GalleryRow({ p, row, rowIdx }) {
  const rowRef = useRef(null);

  const update = () => {
    const el = rowRef.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    el.querySelectorAll("[data-slide]").forEach((img) => {
      const c = img.offsetLeft + img.offsetWidth / 2;
      const d = Math.min(1, Math.abs(c - mid) / (el.clientWidth * 0.55));
      img.style.transform = `scale(${1 - d * 0.16})`;
      img.style.opacity = String(1 - d * 0.35);
    });
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const nudge = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className={row.label ? "mt-10" : "mt-12"}>
      {row.label && (
        <p data-testid={`project-${p.num}-row-${rowIdx}-label`} className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-[#CBCC10]">
          — {row.label} —
        </p>
      )}
      <div className="group/row relative">
        <button
          data-testid={`project-${p.num}-row-${rowIdx}-prev`}
          onClick={() => nudge(-1)}
          aria-label="Scroll gallery left"
          className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-[#09090B]/70 text-[#FAFAFA] backdrop-blur-md transition-colors duration-300 hover:border-[#CBCC10] hover:text-[#CBCC10] md:opacity-0 md:group-hover/row:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={rowRef}
          onScroll={update}
          data-testid={`project-${p.num}-row-${rowIdx}-swiper`}
          className="no-scrollbar flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[10vw] pb-4"
        >
          {row.imgs.map((id, j) => (
            <img
              key={j}
              data-slide
              data-testid={`project-${p.num}-row-${rowIdx}-img-${j}`}
              src={id}
              alt={`Oak Park Construction ${p.cat.toLowerCase()} work${row.label ? ` — ${row.label.toLowerCase()}` : ""} — view ${j + 1}`}
              loading="lazy"
              decoding="async"
              width="1800"
              height="1350"
              className="h-[48vh] w-[78vw] flex-none snap-center border border-white/10 object-cover transition-[transform,opacity] duration-150 ease-out md:h-[58vh] md:w-[58vw] xl:w-[48vw]"
            />
          ))}
        </div>
        <button
          data-testid={`project-${p.num}-row-${rowIdx}-next`}
          onClick={() => nudge(1)}
          aria-label="Scroll gallery right"
          className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-[#09090B]/70 text-[#FAFAFA] backdrop-blur-md transition-colors duration-300 hover:border-[#CBCC10] hover:text-[#CBCC10] md:opacity-0 md:group-hover/row:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function Project({ p }) {
  return (
    <section data-testid={`project-${p.num}`} className="border-t border-white/10 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-6 text-center"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#CBCC10]">
          Project {p.num} — {p.cat}
        </p>
        <h2 className="mx-auto mt-4 max-w-4xl font-head text-4xl font-bold tracking-tight text-[#FAFAFA] sm:text-5xl md:text-6xl">
          {p.title}
        </h2>
      </motion.div>
      {p.rows.map((row, i) => (
        <GalleryRow key={i} p={p} row={row} rowIdx={i} />
      ))}
    </section>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState("ALL");
  const shown = PROJECTS.filter((p) => filter === "ALL" || p.cat === filter);

  return (
    <div data-testid="portfolio-page" className="min-h-screen bg-[#09090B] pt-16 text-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-16 text-center md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#CBCC10]">Portfolio</p>
        <h1 className="mt-4 font-head text-5xl font-bold tracking-tight sm:text-6xl">Built, not promised.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#D4D4D8]">
          A first curated set of verified Oak Park Construction photographs. Scroll down; drift sideways through the work.
        </p>
      </div>

      <div data-testid="portfolio-filters" className="sticky top-16 z-30 border-y border-white/10 bg-[#09090B]/80 backdrop-blur-xl">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4 md:justify-center md:px-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              data-testid={`filter-${f.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              onClick={() => setFilter(f)}
              className={`flex-none border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                filter === f
                  ? "border-[#CBCC10] bg-[#CBCC10] text-[#09090B]"
                  : "border-white/15 text-[#A1A1AA] hover:border-white/40 hover:text-[#FAFAFA]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 && (
        <p className="py-32 text-center font-mono text-xs uppercase tracking-[0.3em] text-[#A1A1AA]">No projects in this category yet.</p>
      )}
      {shown.map((p) => (
        <Project key={p.num} p={p} />
      ))}

      <div className="border-t border-white/10 px-6 py-24 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#A1A1AA]">Your project could be the next chapter</p>
        <a
          href="/#contact"
          data-testid="portfolio-cta"
          className="mt-6 inline-block bg-[#CBCC10] px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#09090B] transition-colors hover:bg-[#b5b80e]"
        >
          Start a project
        </a>
      </div>
    </div>
  );
}
