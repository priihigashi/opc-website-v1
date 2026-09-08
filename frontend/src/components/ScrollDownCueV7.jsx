import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export function StoryCueRangeV1({ children }) {
  const rangeRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const range = rangeRef.current;
    if (!range || typeof IntersectionObserver === "undefined") return undefined;
    let observer;
    const observe = () => {
      observer?.disconnect();
      const topInset = 72;
      const bottomInset = Math.max(0, window.innerHeight - topInset - 2);
      observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
        rootMargin: `-${topInset}px 0px -${bottomInset}px 0px`,
        threshold: 0,
      });
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
      <ScrollDownCueV7 visible={visible} />
      {children}
    </div>
  );
}

export default function ScrollDownCueV7({ visible }) {
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const cueRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const progress = typeof window !== "undefined" ? window.__scrollStore?.p || 0 : 0;
      const offset = Math.max(-8, Math.min(18, 18 - progress * 75));
      cueRef.current?.style.setProperty("--opc-house-cue-offset", `${offset}vh`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const frame = window.requestAnimationFrame(update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={cueRef}
      aria-hidden="true"
      data-testid="story-scroll-cue"
      data-version="7"
      data-visible={visible ? "true" : "false"}
      className={`opc-story-scroll-cue-v7 pointer-events-none fixed inset-x-0 z-[15] flex flex-col items-center justify-center gap-0.5 text-[#EEEDE9] transition-opacity duration-300 ${visible ? "opacity-70" : "opacity-0"}`}
    >
      <span className="font-mono text-[8px] uppercase leading-none tracking-[0.24em]">Scroll</span>
      <ChevronDown className={`h-3 w-3 md:h-3.5 md:w-3.5 ${visible && !reduced ? "animate-[opc-scroll-cue-v7_3.4s_ease-in-out_infinite]" : ""}`} />
      <style>{`
        .opc-story-scroll-cue-v7 {
          top: calc(50% + var(--opc-house-cue-offset, 18vh));
          bottom: auto;
        }
        @keyframes opc-scroll-cue-v7 {
          0%, 100% { opacity: .28; }
          50% { opacity: .82; }
        }
      `}</style>
    </div>
  );
}
