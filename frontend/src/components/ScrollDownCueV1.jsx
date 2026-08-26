import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ScrollDownCueV1() {
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
      data-visible={visible ? "true" : "false"}
      className={`pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 flex justify-center transition-opacity duration-500 ${visible ? "opacity-60" : "opacity-0"}`}
    >
      <ChevronDown
        className={`h-4 w-4 text-[#EEEDE9] ${visible && !reduced ? "animate-[opc-scroll-cue_1.8s_ease-in-out_infinite]" : ""}`}
      />
      <style>{`@keyframes opc-scroll-cue { 0%,100% { transform: translateY(0); opacity:.42 } 50% { transform: translateY(4px); opacity:.82 } }`}</style>
    </div>
  );
}
