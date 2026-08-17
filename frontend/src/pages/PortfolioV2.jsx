import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const FILTERS = ["ALL", "KITCHENS", "BATHROOMS", "OUTDOOR LIVING", "SHELL + NEW BUILD", "CONCRETE"];

const PROJECTS = [
  {
    id: "light-wood-kitchen",
    cat: "KITCHENS",
    title: "Light Wood Kitchen",
    phase: "Finished",
    image: "/images/opc/kitchen-wide.jpg",
    alt: "Finished light wood kitchen with a fluted black island and sculptural pendant lighting",
    detail: "Custom cabinetry · fluted island · vaulted ceiling",
    featured: true,
  },
  {
    id: "walnut-slab-kitchen",
    cat: "KITCHENS",
    title: "Walnut Slab Kitchen",
    phase: "Finished",
    image: "/images/opc/kitchen-walnut.jpg",
    alt: "Finished walnut slab kitchen with waterfall stone island",
    detail: "Slab cabinetry · waterfall stone · integrated storage",
  },
  {
    id: "terrazzo-shower-suite",
    cat: "BATHROOMS",
    title: "Terrazzo Shower Suite",
    phase: "Finished",
    image: "/images/opc/bathroom-wide.jpg",
    alt: "Finished bathroom with frameless glass, terrazzo surfaces and matte black fixtures",
    detail: "Frameless glass · terrazzo · concealed lighting",
    featured: true,
  },
  {
    id: "harbor-court-bench",
    cat: "OUTDOOR LIVING",
    title: "1270 Harbor Court",
    phase: "Finished",
    image: "/images/opc/1270-harbor-ct-outdoor-after-enhanced-v1.jpg",
    alt: "Finished hardwood garden bench integrated with a white planter and tropical landscaping",
    detail: "Hardwood bench · raised planter · tropical screening",
  },
  {
    id: "outdoor-kitchen-twilight",
    cat: "OUTDOOR LIVING",
    title: "Outdoor Kitchen at Twilight",
    phase: "Finished",
    image: "/images/opc/outdoor-kitchen-twilight-wide-v2.jpg",
    alt: "Finished illuminated outdoor kitchen and bar at twilight",
    detail: "Illuminated stone · wood soffit · integrated bar",
    featured: true,
  },
  {
    id: "residential-addition",
    cat: "SHELL + NEW BUILD",
    title: "Residential Addition",
    phase: "Construction progress",
    image: "/images/opc/addition-progress.jpg",
    alt: "Oak Park Construction residential addition in progress",
    detail: "Structure · enclosure · field coordination",
  },
  {
    id: "sitework-shell",
    cat: "SHELL + NEW BUILD",
    title: "Sitework & Shell",
    phase: "Construction progress",
    image: "/images/opc/sitework-progress.jpg",
    alt: "Oak Park Construction shell and sitework in progress",
    detail: "Site preparation · shell · inspections",
  },
  {
    id: "concrete-slab",
    cat: "CONCRETE",
    title: "Residential Concrete Slab",
    phase: "Construction progress",
    image: "/images/opc/concrete-progress.jpg",
    alt: "Fresh residential concrete slab being finished by Oak Park Construction",
    detail: "Formwork · placement · finish control",
    featured: true,
  },
];

function ProjectCard({ project, index }) {
  const finished = project.phase === "Finished";

  return (
    <motion.article
      data-testid={`portfolio-project-${project.id}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.65, delay: Math.min(index * 0.05, 0.2), ease: "easeOut" }}
      className={`group overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] backdrop-blur-xl ${
        project.featured ? "md:col-span-2" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${project.featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <img
          src={project.image}
          alt={project.alt}
          width="1800"
          height="1350"
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
          <span className={`h-1.5 w-1.5 rounded-full ${finished ? "bg-[#CBCC10]" : "bg-white/60"}`} />
          {project.phase}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#CBCC10]">{project.cat}</p>
            <h2 className="mt-2 font-head text-2xl font-semibold tracking-tight text-white sm:text-3xl">{project.title}</h2>
          </div>
          <ArrowUpRight className="h-5 w-5 flex-none text-white/65 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </div>
      </div>
      <p className="px-5 py-4 text-sm text-[#B8B8BC] sm:px-7">{project.detail}</p>
    </motion.article>
  );
}

export default function PortfolioV2() {
  const [filter, setFilter] = useState("ALL");
  const shown = PROJECTS.filter((project) => filter === "ALL" || project.cat === filter);

  return (
    <div data-testid="portfolio-page" className="min-h-screen bg-[#09090B] pt-16 text-[#FAFAFA]">
      <header className="mx-auto max-w-7xl px-6 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
        <div className="grid items-end gap-8 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#CBCC10]">Selected work · South Florida</p>
            <h1 className="mt-5 max-w-4xl font-head text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-8xl">
              Real work.<br />Clearly organized.
            </h1>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-[#C7C7CB] backdrop-blur-xl">
            Finished photography is separated from construction documentation. No stock images, no mixed projects, and no progress photo presented as a final result.
          </div>
        </div>
      </header>

      <nav data-testid="portfolio-filters" aria-label="Portfolio categories" className="sticky top-16 z-30 border-y border-white/10 bg-[#09090B]/82 backdrop-blur-xl">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4 md:px-10">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={`flex-none rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                filter === item
                  ? "border-[#CBCC10] bg-[#CBCC10] text-[#09090B]"
                  : "border-white/15 bg-white/[0.03] text-[#AFAFB4] hover:border-white/35 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-6 py-10 md:grid-cols-2 md:px-10 md:py-14">
        {shown.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
      </main>

      <footer className="mx-auto max-w-7xl px-6 pb-24 pt-10 text-center md:px-10 md:pb-32">
        <div className="rounded-[22px] border border-white/10 bg-white/[0.045] px-6 py-14 backdrop-blur-xl md:px-12 md:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CBCC10]">Built with one accountable team</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-head text-4xl font-semibold tracking-tight sm:text-5xl">Your project can be the next documented transformation.</h2>
          <a href="/#contact" data-testid="portfolio-cta" className="mt-8 inline-flex rounded-full bg-[#CBCC10] px-7 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#09090B] transition-colors hover:bg-[#dde016]">
            Start a project
          </a>
        </div>
      </footer>
    </div>
  );
}
