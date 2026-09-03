import { useEffect, useRef, useState } from "react";
import { scrollStore } from "@/lib/scrollStore";

const labels = [
  ["01", "Shell"],
  ["02", "Interiors"],
  ["03", "Addition"],
  ["04", "Outdoor"],
  ["05", "Groundwork"],
];

function activeIndexFor(progress, chapters) {
  const next = chapters.findIndex((chapter, index) => {
    const following = chapters[index + 1];
    return !following || progress < (chapter.timing.focus + following.timing.focus) / 2;
  });
  return Math.max(0, next);
}

export default function ChapterRailV2({ chapters }) {
  const navRef = useRef(null);
  const activeRef = useRef(0);
  const visibleRef = useRef(true);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const progress = Math.min(1, Math.max(0, scrollStore.p));
      const nextActive = activeIndexFor(progress, chapters);
      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }
      const story = navRef.current?.closest('[data-testid="story"]');
      const storyVisible = story ? story.getBoundingClientRect().bottom > 0 : true;
      if (storyVisible !== visibleRef.current) {
        visibleRef.current = storyVisible;
        setVisible(storyVisible);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [chapters]);

  const followAnchor = (event, index) => {
    event.preventDefault();
    const story = navRef.current?.closest('[data-testid="story"]');
    if (!story) return;
    const chapter = chapters[index];
    const targetY = story.offsetTop + chapter.timing.focus * Math.max(1, story.offsetHeight - window.innerHeight);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.history.replaceState(null, "", `#${chapter.id}`);
    if (scrollStore.lenis && !reduced) scrollStore.lenis.scrollTo(targetY, { duration: 1.2 });
    else window.scrollTo({ top: targetY, behavior: reduced ? "auto" : "smooth" });
  };

  const anchor = ([num, label], index, compact = false) => (
    <a
      key={num}
      href={`#ch-${num}`}
      onClick={(event) => followAnchor(event, index)}
      tabIndex={visible ? 0 : -1}
      aria-current={active === index ? "step" : undefined}
      data-testid={`chapter-anchor-${compact ? "compact" : "desktop"}-${num}`}
      className={`${compact ? "min-h-10 flex-col justify-center gap-0.5 px-1" : "min-h-11 justify-end gap-2.5"} group flex items-center font-mono uppercase outline-none transition-opacity duration-300 focus-visible:ring-1 focus-visible:ring-[#CBCC10] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] ${active === index ? "opacity-100" : "opacity-55 hover:opacity-85"}`}
    >
      <span className={`${compact ? "text-[7px] tracking-[0.12em]" : "text-[9px] tracking-[0.18em]"} ${active === index ? "text-[#EEEDE9]" : "text-[#EEEDE9]/80"}`}>{label}</span>
      <span className={`${compact ? "text-[8px]" : "text-[9px]"} ${active === index ? "text-[#CBCC10]" : "text-[#EEEDE9]/70"}`}>{num}</span>
    </a>
  );

  return (
    <nav ref={navRef} aria-label="Build chapters" aria-hidden={visible ? undefined : "true"} className={`transition-opacity duration-300 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <div data-testid="chapter-rail-desktop" className="fixed right-4 top-1/2 z-30 hidden w-[118px] -translate-y-1/2 xl:block">
        <div className="border-r border-[#EEEDE9]/20 pr-4">
          {labels.map((item, index) => anchor(item, index))}
        </div>
      </div>
      <div data-testid="chapter-dock-compact" className="fixed inset-x-3 bottom-[max(0.25rem,env(safe-area-inset-bottom))] z-30 grid h-10 grid-cols-5 overflow-hidden rounded-full border border-white/15 bg-[#09090B]/88 px-1 shadow-[0_12px_40px_rgba(0,0,0,0.42)] backdrop-blur-md xl:hidden">
        {labels.map((item, index) => anchor(item, index, true))}
      </div>
    </nav>
  );
}
