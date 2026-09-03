import { motion } from "framer-motion";
import HeroV10 from "./HeroV10";
import { ChapterV7 } from "./ChapterV7";
import ChapterRailV2 from "./ChapterRailV2";
import ScrollDownCueV5 from "./ScrollDownCueV5";
import StoryBannerRailV4 from "./StoryBannerRailV4";
import { HOME_STORY_BANNER_TIMELINE_V2 } from "@/lib/homeStoryBannerTimelineV2.mjs";

const chapterContent = [
  {
    id: "ch-01", num: "01", side: "right", overline: "Shell Construction",
    title: ["The bones", "come first"],
    body: "Watch the finished surfaces recede and the structure tell the story. We coordinate and construct residential shells through foundations, structural walls, roof systems and dry-in, ready for the trades and finishes that follow.",
    bullets: ["Foundations & reinforced slabs", "Structural walls, columns & beams", "Roof systems & weather dry-in"],
    portfolioHref: "/portfolio?category=SHELL%20%2B%20NEW%20BUILD#portfolio-projects", portfolioLabel: "View Shell Projects",
    recentProject: {
      src: "/images/opc/portfolio/shell-concrete/kinney-shell-build/kinney-shell-build__shell-concrete__AFTER__card__seq08__img-5901",
      w: 1350, h: 1800, widths: [360, 576, 900, 1350],
      alt: "Completed shell construction at the Kinney project.", phase: "AFTER", orientation: "portrait",
    },
  },
  {
    id: "ch-02", num: "02", side: "left", overline: "Kitchen + Bathroom Remodels",
    title: ["Rooms,", "reimagined"],
    body: "The same house opens through a clean cutaway. Inside, we reimagine the rooms you live in most — kitchens planned around how you cook and bathrooms rebuilt as quiet retreats — without losing the home around them.",
    bullets: ["Custom cabinetry & stone counters", "Showers, tubs, tile & fixtures", "Plumbing, electrical & ventilation coordination"],
    portfolioHref: "/portfolio?category=KITCHENS%20%2B%20BATHROOMS#portfolio-projects", portfolioLabel: "View Remodel Projects",
    recentProject: {
      src: "/images/opc/kitchen-wide.jpg", w: 1800, h: 1350,
      alt: "Finished light-wood kitchen and dining remodel by Oak Park Construction.",
    },
  },
  {
    id: "ch-03", num: "03", side: "right", overline: "Additions",
    title: ["Grow without", "moving"],
    body: "A new volume joins the same house — a bedroom, an office or a family room — planned to connect with the existing structure, roofline, circulation and finishes.",
    bullets: ["Bedroom, office & family room wings", "Structural tie-in coordination", "Permit, engineering & inspection coordination"],
    portfolioHref: "/portfolio/harbor-court-residence", portfolioLabel: "View Addition Project",
    recentProject: {
      src: "/images/opc/portfolio/addition/harbor-court/harbor-court__addition__AFTER__card__seq04__img-3370",
      w: 1800, h: 1350, widths: [480, 768, 1200, 1800],
      alt: "Completed residential addition at the Harbor Court project.", phase: "AFTER", orientation: "landscape",
    },
  },
  {
    id: "ch-04", num: "04", side: "left", overline: "Outdoor Living",
    title: ["The backyard,", "built in"],
    body: "The house turns, and the backyard becomes a connected outdoor room. Pergolas, cooking areas, patios and lighting are planned around circulation, shade and how the space will be used.",
    bullets: ["Pergolas, shade structures & decks", "Built-in barbecue & outdoor kitchens", "Lighting, seating & fire features"],
    portfolioHref: "/portfolio?category=OUTDOOR%20LIVING#portfolio-projects", portfolioLabel: "View Outdoor Living Projects",
    recentProject: {
      src: "/images/opc/outdoor-kitchen-twilight-wide-v2.jpg", w: 1672, h: 941,
      alt: "Finished outdoor kitchen and covered entertaining area by Oak Park Construction.",
    },
  },
  {
    id: "ch-05", num: "05", side: "right", overline: "Concrete + Pavers",
    title: ["Groundwork", "that lasts"],
    body: "Finally the house faces forward again and the ground resolves — concrete, pavers and walkways planned around drainage, grading, access and the relationship between the street and the home.",
    bullets: ["Driveways, walkways & patios", "Interlocking pavers & concrete finishes", "Drainage, grading & base preparation"],
    portfolioHref: "/portfolio?category=CONCRETE#portfolio-projects", portfolioLabel: "View Concrete Projects",
    recentProject: {
      src: "/images/opc/portfolio/shell-concrete/rio-vista-concrete/rio-vista-concrete__shell-concrete__AFTER__card__seq01__img-3721",
      w: 1800, h: 1350, widths: [480, 768, 1200, 1800],
      alt: "Finished curved paver driveway at the Rio Vista project.", phase: "AFTER", orientation: "landscape",
    },
  },
];

const chapters = chapterContent.map((chapter) => ({
  ...chapter,
  timing: HOME_STORY_BANNER_TIMELINE_V2.find((timing) => timing.id === chapter.id),
}));

// V21 preserves V20 and reserves a persistent cue lane below every house-story banner.
export default function StoryV21({ storyRef }) {
  return (
    <div ref={storyRef} data-testid="story" className="relative">
      <ChapterRailV2 chapters={chapters} />
      <ScrollDownCueV5 />
      <StoryBannerRailV4 chapters={chapters} />
      <HeroV10 />
      {chapters.map((chapter) => <ChapterV7 key={chapter.id} {...chapter} />)}
      <section data-testid="story-outro" className="pointer-events-none relative flex min-h-[120vh] items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30%" }} transition={{ duration: 0.9, ease: "easeOut" }} className="story-copy-panel pointer-events-auto mx-6 px-8 py-12 text-center sm:px-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">The complete scope</p>
          <p className="mt-4 text-[#EEEDE9]">
            <span className="font-head block text-4xl uppercase tracking-tight sm:text-5xl">Structure to finish</span>
            <span className="font-editorial mt-1 block text-4xl sm:text-5xl">Under one team</span>
          </p>
        </motion.div>
      </section>
    </div>
  );
}




