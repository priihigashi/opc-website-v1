import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const img = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=1400&auto=format&fit=crop`;

const FILTERS = ["ALL", "FULL RENOVATION", "KITCHEN + BATH", "NEW CONSTRUCTION", "ADDITIONS", "OUTDOOR", "SHELL + CONCRETE", "COMMERCIAL"];

// Each project owns one or more gallery rows (e.g. Before / After / Progress).
const PROJECTS = [
  {
    num: "01", cat: "FULL RENOVATION", title: "Maple Street Residence",
    rows: [
      { label: "Before", imgs: ["1504307651254-35680f356dfd", "1503387762-592deb58ef4e", "1429497419816-9ca5cfb4571a"] },
      { label: "After", imgs: ["1600585154340-be6161a56a0c", "1600607687939-ce8a6c25118c", "1600210492486-724fe5c67fb0", "1616486338812-3dadae4b4ace", "1600566753086-00f18fb6b3ea"] },
    ],
  },
  {
    num: "02", cat: "KITCHEN + BATH", title: "The Galley, Reopened",
    rows: [
      { label: "Before", imgs: ["1484154218962-a197022b5858", "1522708323590-d24dbb6b0267"] },
      { label: "After", imgs: ["1556912173-3bb406ef7e77", "1583608205776-bfd35f0d9f83", "1620626011761-996317b8d101", "1584622650111-993a426fbf0a", "1556909114-f6e7ad7d3136"] },
    ],
  },
  {
    num: "03", cat: "NEW CONSTRUCTION", title: "Coral Ridge New Build",
    rows: [
      { label: "Progress", imgs: ["1541888946425-d81bb19240f5", "1503387762-592deb58ef4e", "1581094794329-c8112a89af12"] },
      { label: "Completed", imgs: ["1512917774080-9991f1c4c750", "1613490493576-7fde63acd811", "1600047509807-ba8f99d2cdde", "1605146769289-440113cc3d00", "1600573472592-401b489a3cdc"] },
    ],
  },
  {
    num: "04", cat: "ADDITIONS", title: "Sunrise Casita Wing",
    rows: [
      { label: null, imgs: ["1600596542815-ffad4c1539a9", "1600585152220-90363fe7e115", "1615873968403-89e068629265", "1600607687920-4e2a09cf159d"] },
    ],
  },
  {
    num: "05", cat: "OUTDOOR", title: "Cedar Pergola Court",
    rows: [
      { label: null, imgs: ["1604014237800-1c9102c219da", "1595428774223-ef52624120d2", "1572331165267-854da2b10ccc", "1416331108676-a22ccb276e35"] },
    ],
  },
  {
    num: "06", cat: "SHELL + CONCRETE", title: "Bayview Shell & Hardscape",
    rows: [
      { label: "Shell", imgs: ["1541888946425-d81bb19240f5", "1503387762-592deb58ef4e"] },
      { label: "Hardscape", imgs: ["1590725175785-5f3a4a3b0b8f", "1581094794329-c8112a89af12"] },
    ],
  },
  {
    num: "07", cat: "COMMERCIAL", title: "Flagler Office Lobby",
    rows: [
      { label: null, imgs: ["1497366216548-37526070297c", "1497366811353-6870744d04b2", "1497366754035-f200968a6e72"] },
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
              src={img(id)}
              alt={`${p.title}${row.label ? ` — ${row.label}` : ""} — photo ${j + 1}`}
              loading="lazy"
              className="h-[48vh] flex-none snap-center border border-white/10 object-cover transition-[transform,opacity] duration-150 ease-out md:h-[58vh]"
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
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#A1A1AA]">
          Every project its own chapter — before, progress, after. Scroll down; drift sideways through the photographs.
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
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#A1A1AA]">Your project could be chapter {String(PROJECTS.length + 1).padStart(2, "0")}</p>
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
