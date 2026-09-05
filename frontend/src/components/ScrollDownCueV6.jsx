import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Owns the story-only visibility boundary for the persistent cue. IntersectionObserver
 * changes state only when the chapter range enters or leaves the viewport; the cue no
 * longer measures moving cards or schedules its own animation frame.
 */
export function StoryCueRangeV1({ children }) {
  const rangeRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const range = rangeRef.current;
    if (!range || typeof IntersectionObserver === "undefined") return undefined;

    let observer;
    const observe = () => {
      observer?.disconnect();
      // Observe a two-pixel line immediately below the fixed 72px navigation.
      // The chapter range reaches this line only after the hero guidance has left.
      const topInset = 72;
      const bottomInset = Math.max(0, window.innerHeight - topInset - 2);
      observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting),
        { rootMargin: `-${topInset}px 0px -${bottomInset}px 0px`, threshold: 0 },
      );
      observer.observe(range);
    };
    observe();
    window.addEventListener("resize", observe);
    return () => {
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, []);

  return (
    <div ref={rangeRef} data-testid="story-cue-range">
      <ScrollDownCueV6 visible={visible} />
      {children}
    </div>
  );
}

export default function ScrollDownCueV6({ visible }) {
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  return (
    <div
      aria-hidden="true"
      data-testid="story-scroll-cue"
      data-version="6"
      data-visible={visible ? "true" : "false"}
      className={`opc-story-scroll-cue-v6 pointer-events-none fixed inset-x-0 z-[15] flex flex-col items-center justify-center gap-0.5 text-[#EEEDE9] transition-opacity duration-300 ${visible ? "opacity-70" : "opacity-0"}`}
    >
      <span className="font-mono text-[8px] uppercase leading-none tracking-[0.24em]">Scroll</span>
      <ChevronDown
        className={`h-3 w-3 md:h-3.5 md:w-3.5 ${visible && !reduced ? "animate-[opc-scroll-cue-v6_3.4s_ease-in-out_infinite]" : ""}`}
      />
      <style>{`
        .opc-story-scroll-cue-v6 {
          bottom: max(1.25rem, env(safe-area-inset-bottom));
        }
        @media (max-width: 1279px) {
          .opc-story-scroll-cue-v6 {
            bottom: max(3.5rem, calc(env(safe-area-inset-bottom) + 3rem));
          }
        }
        @media (min-width: 1280px) {
          .story-cue-v6-layout [data-testid="story-banner-rail"] {
            bottom: 3.5rem;
            overflow: hidden;
          }
        }
        @keyframes opc-scroll-cue-v6 {
          0%, 100% { opacity: .28; }
          50% { opacity: .82; }
        }
      `}</style>
    </div>
  );
}
