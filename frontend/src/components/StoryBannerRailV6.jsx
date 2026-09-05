import { useEffect, useRef, useState } from "react";
import { ChapterCardV5 } from "./ChapterV9";
import { bannerTravelY, safeFocusCenter } from "@/lib/homeStoryBannerTimelineV1.mjs";
import { scrollStore } from "@/lib/scrollStore";

const activeIndexFor = (progress, chapters) => chapters.findIndex(({ timing }) => progress >= timing.start && progress <= timing.end);

function renderPanelFrame(panel, chapter, progress, measuredHeight) {
  if (!panel || !chapter) return null;
  const mobile = window.innerWidth < 768;
  const compactDock = window.innerWidth < 1280;
  const panelHeight = measuredHeight || panel.offsetHeight;
  const safeTop = 88;
  const safeBottom = compactDock ? 96 : 56;
  const desired = window.innerHeight * (mobile ? 0.64 : 0.52);
  const minimum = safeTop + panelHeight / 2;
  const maximum = window.innerHeight - safeBottom - panelHeight / 2;
  const focusCenter = maximum >= minimum
    ? Math.min(maximum, Math.max(minimum, desired))
    : safeFocusCenter(window.innerHeight, panelHeight, mobile);
  const y = bannerTravelY(progress, chapter.timing, window.innerHeight, panelHeight, focusCenter);
  // offsetHeight is integer-rounded while the transformed panel has fractional bounds.
  // One pixel prevents a fully fitted card losing its links to subpixel rounding.
  const readable = y >= 86 && y + panelHeight <= window.innerHeight - safeBottom + 1;
  panel.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  panel.style.pointerEvents = readable ? "auto" : "none";
  panel.dataset.travelY = y.toFixed(2);
  panel.dataset.storyProgress = progress.toFixed(4);
  const card = panel.querySelector(`[data-testid="${chapter.id}-panel"]`);
  if (card) {
    card.dataset.travelY = y.toFixed(2);
    card.dataset.storyProgress = progress.toFixed(4);
  }
  return readable;
}

// V6 preserves V5 travel and accounts for the persistent cue lane at every width.
export default function StoryBannerRailV6({ chapters }) {
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
      if (nextIndex === renderedIndexRef.current) {
        const isReadable = renderPanelFrame(panel, chapter, progress, panelHeightRef.current);
        if (isReadable !== null && isReadable !== readableRef.current) {
          readableRef.current = isReadable;
          setReadable(isReadable);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [chapters, reduced]);

  if (reduced || activeIndex < 0) return null;
  const chapter = chapters[activeIndex];
  const lane = chapter.side === "right"
    ? "min-[768px]:col-span-5 min-[768px]:col-start-8 min-[768px]:justify-self-end xl:col-start-7 xl:mr-2 min-[1366px]:-mr-4 min-[1440px]:-mr-16"
    : "min-[768px]:col-span-5 min-[768px]:col-start-1 min-[768px]:justify-self-start";

  return (
    <div data-testid="story-banner-rail" className="pointer-events-none fixed bottom-24 top-0 left-1/2 z-20 grid w-full max-w-7xl -translate-x-1/2 grid-cols-12 items-start overflow-hidden px-[max(1rem,env(safe-area-inset-left))] min-[768px]:px-6 min-[1100px]:px-10 xl:bottom-0 xl:overflow-visible">
      <div ref={panelRef} className={`col-span-12 mx-auto w-[calc(100%_-_2rem)] max-w-[430px] will-change-transform min-[768px]:mx-0 min-[768px]:w-[min(36vw,360px)] min-[1100px]:w-[clamp(340px,28vw,430px)] xl:w-[clamp(340px,27vw,410px)] ${lane}`} style={{ transform: "translate3d(0, calc(100svh + 8px), 0)" }}>
        <ChapterCardV5 {...chapter} panelRef={null} interactive={readable} />
      </div>
    </div>
  );
}
