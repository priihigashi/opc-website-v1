import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const img = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

export const SERVICE_CONTENT = {
  "full-renovation": {
    title: "Full Renovation",
    tag: "Whole-home transformation",
    body: "The same house, reborn. We take an existing residence down to what matters and rebuild every system, surface and sightline — structure, layout, finishes, indoor-outdoor flow — as one continuous design, not a patchwork of projects.",
    bullets: ["Structural assessment & redesign", "Full MEP replacement", "Interior + exterior finish packages", "Single crew, single timeline"],
    image: img("1600607687939-ce8a6c25118c"),
  },
  kitchen: {
    title: "Kitchen Remodels",
    tag: "The room you live in most",
    body: "Opened through a clean architectural cutaway, your kitchen is reimagined around how you actually cook and gather — custom cabinetry, stone worktops, considered lighting, and services routed invisibly through the existing structure.",
    bullets: ["Custom cabinetry & stone counters", "Layout & structural wall changes", "Lighting, plumbing & electrical", "Appliance integration"],
    image: img("1556912173-3bb406ef7e77"),
  },
  bathroom: {
    title: "Bathroom Remodels",
    tag: "Quiet retreats, rebuilt",
    body: "Behind a clean section cut, the bathroom becomes a spa-grade room — large-format tile, curbless showers, freestanding tubs, warm layered lighting — waterproofed and ventilated to outlast the Florida humidity.",
    bullets: ["Curbless showers & soaking tubs", "Large-format tile & stone", "Heated floors & warm lighting", "Waterproofing & ventilation"],
    image: img("1620626011761-996317b8d101"),
  },
  "new-construction": {
    title: "New Construction",
    tag: "From empty lot to keys",
    body: "From the first stake in the ground: we plan, engineer and build complete contemporary South Florida residences — slab, shell, finishes and landscape — with one accountable team from permit to punch list.",
    bullets: ["Feasibility, permits & engineering", "CBS shell & roof systems", "Full interior fit-out", "Landscape & hardscape package"],
    image: img("1600585154340-be6161a56a0c"),
  },
  additions: {
    title: "Additions",
    tag: "Grow without moving",
    body: "A new volume joins the same house — traced first at full scale on the ground, then built to match the original roofline and character. Bedrooms, offices, family rooms and casitas that feel inevitable, never attached.",
    bullets: ["Bedroom, office & casita wings", "Seamless structural tie-ins", "Matched rooflines & finishes", "Permits & inspections handled"],
    image: img("1600566753086-00f18fb6b3ea"),
  },
  "shell-construction": {
    title: "Shell Construction",
    tag: "The bones come first",
    body: "Finished surfaces recede and the structure tells the truth. We engineer and raise complete structural shells — reinforced slabs, CBS walls, columns, beams and roof systems — square, plumb and dried-in, ready for every trade that follows.",
    bullets: ["Foundations & reinforced slabs", "CBS walls, columns & beams", "Roof structures & dry-in", "Engineered load paths"],
    image: img("1541888946425-d81bb19240f5"),
  },
  "outdoor-living": {
    title: "Outdoor Living",
    tag: "The backyard, built in",
    body: "The house turns and the backyard comes alive — paver patios, cedar pergolas rising post by post, and a built-in grill station. The room you will use most from November to May, engineered for sun, salt and storm season.",
    bullets: ["Pergolas & shade structures", "Outdoor kitchens & grill stations", "Pools, patios & fire features", "Lighting & audio integration"],
    image: img("1604014237800-1c9102c219da"),
  },
  "concrete-pavers": {
    title: "Concrete + Pavers",
    tag: "Groundwork that lasts",
    body: "Reframed from the street: driveways poured true, pavers laid in rhythm over engineered base, walkways and planters that guide you to the door. The first thing you touch every day, built to outlast trends and summers.",
    bullets: ["Driveways, walkways & patios", "Interlocking pavers & stamped finishes", "Drainage, grading & base prep", "Planters, edging & site walls"],
    image: img("1590725175785-5f3a4a3b0b8f"),
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = SERVICE_CONTENT[slug];
  if (!s) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-[#FAFAFA]">
        <p className="font-mono text-sm uppercase tracking-widest">Unknown service — <Link to="/services" className="text-[#CBCC10]">back to the house</Link></p>
      </div>
    );
  }
  return (
    <div data-testid={`service-${slug}`} className="relative z-10 min-h-screen bg-[#09090B] pt-16 text-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <Link
          to="/services"
          data-testid="service-back"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#A1A1AA] transition-colors hover:text-[#CBCC10]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the house
        </Link>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-12 items-center gap-y-12 px-6 pb-24 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-12 md:col-span-5"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">{s.tag}</p>
          <h1 className="mt-4 font-head text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">{s.title}</h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#A1A1AA]">{s.body}</p>
          <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
            {s.bullets.map((b, i) => (
              <li key={i} data-testid={`service-bullet-${i}`} className="flex items-center gap-3 text-sm">
                <span className="h-px w-6 bg-[#CBCC10]" />
                {b}
              </li>
            ))}
          </ul>
          <a
            href="/#contact"
            data-testid="service-cta"
            className="mt-10 inline-flex items-center gap-3 bg-[#CBCC10] px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#09090B] transition-colors hover:bg-[#b5b80e]"
          >
            Start this project <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
        <motion.figure
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 overflow-hidden border border-white/10 md:col-span-6 md:col-start-7"
        >
          <img src={s.image} alt={s.title} className="aspect-[4/3] w-full object-cover" loading="eager" />
        </motion.figure>
      </div>
    </div>
  );
}
