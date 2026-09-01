import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ScrollDownCueV2() {
  const [visible, setVisible] = useState(true);
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const update = () => setVisible(window.scrollY < window.innerHeight * 2);
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
      data-version="2"
      data-visible={visible ? "true" : "false"}
      className={`opc-story-scroll-cue-v2 pointer-events-none fixed inset-x-0 z-30 flex justify-center transition-opacity duration-500 ${visible ? "opacity-60" : "opacity-0"}`}
    >
      <ChevronDown
        className={`h-3.5 w-3.5 text-[#EEEDE9] md:h-4 md:w-4 ${visible && !reduced ? "animate-[opc-scroll-cue-v2_2.2s_ease-in-out_infinite]" : ""}`}
      />
      <style>{`
        .opc-story-scroll-cue-v2 {
          bottom: max(0.75rem, env(safe-area-inset-bottom));
        }
        @media (max-width: 767px) and (orientation: portrait) {
          .opc-story-scroll-cue-v2 {
            top: 76svh;
            bottom: auto;
          }
        }
        @keyframes opc-scroll-cue-v2 {
          0%, 100% { transform: translateY(0); opacity: .4; }
          50% { transform: translateY(3px); opacity: .78; }
        }
      `}</style>
    </div>
  );
}
