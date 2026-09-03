import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ScrollDownCueV5() {
  const [visible, setVisible] = useState(true);
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const update = () => {
      const story = document.querySelector('[data-testid="story"]');
      setVisible(Boolean(story && story.getBoundingClientRect().bottom > 0));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-testid="story-scroll-cue"
      data-version="5"
      data-visible={visible ? "true" : "false"}
      className={`opc-story-scroll-cue-v5 pointer-events-none fixed inset-x-0 z-30 flex flex-col items-center justify-center gap-0.5 text-[#EEEDE9] transition-opacity duration-500 ${visible ? "opacity-70" : "opacity-0"}`}
    >
      <span className="font-mono text-[8px] uppercase leading-none tracking-[0.24em]">Scroll</span>
      <ChevronDown
        className={`h-3 w-3 md:h-3.5 md:w-3.5 ${visible && !reduced ? "animate-[opc-scroll-cue-v5_3.4s_ease-in-out_infinite]" : ""}`}
      />
      <style>{`
        .opc-story-scroll-cue-v5 {
          bottom: max(1.25rem, env(safe-area-inset-bottom));
        }
        @media (max-width: 1279px) {
          .opc-story-scroll-cue-v5 {
            bottom: max(3.5rem, calc(env(safe-area-inset-bottom) + 3rem));
          }
        }
        @keyframes opc-scroll-cue-v5 {
          0%, 100% { opacity: .28; }
          50% { opacity: .82; }
        }
      `}</style>
    </div>
  );
}
