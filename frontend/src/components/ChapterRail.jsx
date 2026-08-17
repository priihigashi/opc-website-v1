import { useEffect, useState } from "react";

const items = [
  ["01", "Shell"],
  ["02", "Interiors"],
  ["03", "Addition"],
  ["04", "Outdoor"],
  ["05", "Groundwork"],
];

export default function ChapterRail() {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const sections = items.map(([num]) => document.querySelector(`#ch-${num}`)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        setActive(visible ? sections.indexOf(visible.target) : -1);
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: [0, 0.1, 0.25] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className={`pointer-events-none fixed right-7 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-500 2xl:block ${active >= 0 ? "opacity-100" : "opacity-0"}`} aria-label="Build chapters">
      <div className="border-r border-[#F0EBE3]/15 pr-4">
        {items.map(([num, label], index) => (
          <div key={num} className={`flex h-12 items-center justify-end gap-3 transition-opacity duration-500 ${active === index ? "opacity-100" : "opacity-35"}`}>
            <span className={`font-mono text-[9px] uppercase tracking-[0.18em] transition-transform duration-500 ${active === index ? "translate-x-0 text-[#F0EBE3]" : "translate-x-2 text-[#F0EBE3]/70"}`}>
              {label}
            </span>
            <span className={`font-mono text-[9px] ${active === index ? "text-[#CBCC10]" : "text-[#F0EBE3]/60"}`}>{num}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
