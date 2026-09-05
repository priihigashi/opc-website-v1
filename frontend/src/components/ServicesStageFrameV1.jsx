import { useLayoutEffect, useState } from "react";

// The empty Services layout space owns the model bounds. Loading and static
// fallbacks use this same containing block, so controls never cover the house.
export default function ServicesStageFrameV1({ children }) {
  const [frame, setFrame] = useState(null);
  useLayoutEffect(() => {
    const target = document.querySelector('[data-testid="services-house-space-v1"]');
    if (!target) return undefined;
    const measure = () => {
      const r = target.getBoundingClientRect();
      setFrame({ left: r.left + 8, top: r.top + 8, width: Math.max(1, r.width - 16), height: Math.max(1, r.height - 16) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure); };
  }, []);
  return <div data-testid="services-house-frame-v1" className="pointer-events-none fixed z-0 overflow-hidden" style={{ ...(frame || { inset: "22% 8% 32%" }), transform: "translateZ(0)" }}>{children}</div>;
}
