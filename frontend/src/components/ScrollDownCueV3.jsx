import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const CUE_VISIBLE_VIEWPORTS = 2.35;

export default function ScrollDownCueV3() {
  const [visible, setVisible] = useState(true);
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const update = () => setVisible(window.scrollY < window.innerHeight * CUE_VISIBLE_VIEWPORTS);
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
      data-version="3"
      data-visible={visible ? "true" : "false"}
      className={`opc-story-scroll-cue-v3 pointer-events-none fixed inset-x-0 z-30 flex flex-col items-center justify-center gap-0.5 text-[#EEEDE9] transition-opacity duration-500 ${visible ? "opacity-70" : "opacity-0"}`}
    >
      <span className="font-mono text-[8px] uppercase leading-none tracking-[0.24em]">Scroll</span>
      <ChevronDown
        className={`h-3.5 w-3.5 md:h-4 md:w-4 ${visible && !reduced ? "animate-[opc-scroll-cue-v3_2.2s_ease-in-out_infinite]" : ""}`}
      />
      <style>{`
        .opc-story-scroll-cue-v3 {
          bottom: max(0.75rem, env(safe-area-inset-bottom));
        }
        @media (max-width: 767px) and (orientation: portrait) {
          .opc-story-scroll-cue-v3 {
            top: 76svh;
            bottom: auto;
          }
        }
        @keyframes opc-scroll-cue-v3 {
          0%, 100% { transform: translateY(0); opacity: .4; }
          50% { transform: translateY(3px); opacity: .78; }
        }
      `}</style>
    </div>
  );
}
