import { useEffect, useRef, useState } from "react";
import { ChapterCardV3 } from "./ChapterV6";
import { bannerTravelY, safeFocusCenter } from "@/lib/homeStoryBannerTimelineV1.mjs";
import { scrollStore } from "@/lib/scrollStore";

const activeIndexFor = (progress, chapters) => chapters.findIndex(({ timing }) => progress >= timing.start && progress <= timing.end);

export default function StoryBannerRailV4({ chapters }) {
  const panelRef = useRef(null);
  const renderedIndexRef = useRef(-1);
  const readableRef = useRef(false);
  const panelHeightRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [readable, setReadable] = useState(false);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => { renderedIndexRef.current = activeIndex; }, [activeIndex]);

  useEffect(() => {
    if (reduced) return undefined;
    const measure = () => { panelHeightRef.current = panelRef.current?.offsetHeight || 0; };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    if (panelRef.current) observer?.observe(panelRef.current);
    window.addEventListener("resize", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, [activeIndex, reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    let raf = 0;
    const tick = () => {
      const progress = Math.min(1, Math.max(0, scrollStore.p));
      const nextIndex = activeIndexFor(progress, chapters);
      if (nextIndex !== renderedIndexRef.current) {
        renderedIndexRef.current = nextIndex;
        readableRef.current = false;
        setReadable(false);
        setActiveIndex(nextIndex);
      }
      const panel = panelRef.current;
      const chapter = chapters[nextIndex];
      if (panel && chapter && nextIndex === renderedIndexRef.current) {
        const mobile = window.innerWidth < 768;
        const panelHeight = panelHeightRef.current || panel.offsetHeight;
        const compactDock = window.innerWidth < 1280;
        const focusCenter = compactDock
          ? (() => {
              const safeTop = 88;
              const safeBottom = 96;
              const desired = window.innerHeight * (mobile ? 0.64 : 0.52);
              const minimum = safeTop + panelHeight / 2;
              const maximum = window.innerHeight - safeBottom - panelHeight / 2;
              return maximum >= minimum ? Math.min(maximum, Math.max(minimum, desired)) : window.innerHeight / 2;
            })()
          : safeFocusCenter(window.innerHeight, panelHeight, mobile);
        const y = bannerTravelY(progress, chapter.timing, window.innerHeight, panelHeight, focusCenter);
        const isReadable = y >= 86 && y + panelHeight <= window.innerHeight - (compactDock ? 92 : 8);
        panel.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        panel.style.pointerEvents = isReadable ? "auto" : "none";
        panel.dataset.travelY = y.toFixed(2);
        panel.dataset.storyProgress = progress.toFixed(4);
        const card = panel.querySelector(`[data-testid="${chapter.id}-panel"]`);
        if (card) { card.dataset.travelY = y.toFixed(2); card.dataset.storyProgress = progress.toFixed(4); }
        if (isReadable !== readableRef.current) { readableRef.current = isReadable; setReadable(isReadable); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [chapters, reduced]);

  if (reduced || activeIndex < 0) return null;
  const chapter = chapters[activeIndex];
  const lane = chapter.side === "right"
    ? "min-[768px]:col-span-5 min-[768px]:col-start-8 min-[768px]:justify-self-end xl:col-start-7 xl:mr-5"
    : "min-[768px]:col-span-5 min-[768px]:col-start-1 min-[768px]:justify-self-start";

  return (
    <div data-testid="story-banner-rail" className="pointer-events-none fixed bottom-24 top-0 left-1/2 z-20 grid w-full max-w-7xl -translate-x-1/2 grid-cols-12 items-start overflow-hidden px-[max(1rem,env(safe-area-inset-left))] min-[768px]:px-6 min-[1100px]:px-10 xl:bottom-0 xl:overflow-visible">
      <div ref={panelRef} className={`col-span-12 mx-auto w-[calc(100%_-_2rem)] max-w-[430px] will-change-transform min-[768px]:mx-0 min-[768px]:w-[min(36vw,360px)] min-[1100px]:w-[clamp(340px,28vw,430px)] ${lane}`} style={{ transform: "translate3d(0, calc(100svh + 8px), 0)" }}>
        <ChapterCardV3 {...chapter} panelRef={null} interactive={readable} />
      </div>
    </div>
  );
}

