import { motion } from "framer-motion";
import HeroV8 from "./HeroV8";
import { ChapterV3 } from "./ChapterV3";
import ChapterRail from "./ChapterRail";

const chapters = [
  { id: "ch-01", num: "01", side: "right", overline: "Shell Construction", title: ["The bones", "come first."], body: "Watch the finished surfaces recede and the structure tell the truth. We engineer and raise complete structural shells — foundations, framing, sheathing and dry-in — built square, plumb and ready for everything that follows.", bullets: ["Foundations & reinforced slabs", "Structural framing & load paths", "Sheathing, roofing & weather dry-in"], portfolioHref: "/portfolio?category=SHELL%20%2B%20NEW%20BUILD#portfolio-projects", portfolioLabel: "View Shell Projects" },
  { id: "ch-02", num: "02", side: "left", overline: "Kitchen + Bathroom Remodels", title: ["Rooms,", "reimagined."], body: "The same house opens through a clean cutaway. Inside, we reimagine the rooms you live in most — kitchens tuned for how you cook, bathrooms rebuilt as quiet retreats — without ever losing the home around them.", bullets: ["Custom cabinetry & stone counters", "Curbless showers & soaking tubs", "Plumbing, electrical & ventilation"], portfolioHref: "/portfolio?category=KITCHENS%20%2B%20BATHROOMS#portfolio-projects", portfolioLabel: "View Remodel Projects" },
  { id: "ch-03", num: "03", side: "right", overline: "Additions", title: ["Grow without", "moving."], body: "A new volume joins the same house — a bedroom, an office, a family room — matched to the original roofline and character so the addition feels inevitable, never attached.", bullets: ["Bedroom, office & family room wings", "Seamless structural tie-ins", "Permits, engineering & inspections handled"], portfolioHref: "/portfolio/harbor-court-residence", portfolioLabel: "View Addition Project", compact: true, panelLayout: "md:col-span-5 md:col-start-8 md:max-w-[26.5rem] md:justify-self-end lg:col-span-4 lg:col-start-9" },
  { id: "ch-04", num: "04", side: "left", overline: "Outdoor Living", title: ["The backyard,", "built in."], body: "The house turns, and the backyard comes alive. Pergolas rise post by post, a barbecue counter sets in place, and the patio becomes the room you'll use most from April to November.", bullets: ["Pergolas, shade structures & decks", "Built-in barbecue & outdoor kitchens", "Lighting, seating & fire features"], portfolioHref: "/portfolio?category=OUTDOOR%20LIVING#portfolio-projects", portfolioLabel: "View Outdoor Living Projects" },
  { id: "ch-05", num: "05", side: "right", overline: "Concrete + Pavers", title: ["Groundwork", "that lasts."], body: "Finally the house faces forward again and the ground resolves — a driveway poured true, pavers laid in rhythm. The first thing you touch every day, engineered to outlast trends and winters.", bullets: ["Driveways, walkways & patios", "Interlocking pavers & stamped finishes", "Drainage, grading & base preparation"], portfolioHref: "/portfolio?category=CONCRETE#portfolio-projects", portfolioLabel: "View Concrete Projects" },
];

export default function StoryV11({ storyRef }) {
  return (
    <div ref={storyRef} data-testid="story" className="relative">
      <ChapterRail />
      <HeroV8 />
      {chapters.map((chapter) => <ChapterV3 key={chapter.id} {...chapter} />)}
      <section data-testid="story-outro" className="pointer-events-none relative flex min-h-[120vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30%" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="story-copy-panel pointer-events-auto mx-6 px-8 py-12 text-center sm:px-14"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">The complete scope</p>
          <p className="mt-4 text-[#EEEDE9]">
            <span className="font-head block text-4xl uppercase tracking-tight sm:text-5xl">Structure to finish.</span>
            <span className="font-editorial mt-1 block text-4xl sm:text-5xl">Under one team.</span>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
