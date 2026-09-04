import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ScrollDownCueV5() {
  const [visible, setVisible] = useState(true);
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const story = document.querySelector('[data-testid="story"]');
      const panel = document.querySelector('[data-testid="story-banner-rail"] > div');
      const panelRect = panel?.getBoundingClientRect();
      const reservedBottom = window.innerWidth < 1280 ? 56 : 20;
      const cueTop = window.innerHeight - reservedBottom - 24;
      // The cue belongs to an active chapter card. Keeping it out of the hero
      // prevents it colliding with “Scroll down through one house”, and checking
      // the live panel edge makes it fade before a moving card can overlap it.
      setVisible(Boolean(
        story && story.getBoundingClientRect().bottom > 0 &&
        panelRect && panelRect.top >= 0 && panelRect.bottom <= cueTop - 8
      ));
      raf = window.requestAnimationFrame(update);
    };
    update();
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      data-testid="story-scroll-cue"
      data-version="5"
      data-visible={visible ? "true" : "false"}
      className={`opc-story-scroll-cue-v5 pointer-events-none fixed inset-x-0 z-30 flex flex-col items-center justify-center gap-0.5 text-[#EEEDE9] transition-opacity duration-300 ${visible ? "opacity-70" : "opacity-0"}`}
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
