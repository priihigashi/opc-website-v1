import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ChapterCardV1({
  id,
  num,
  overline,
  title,
  body,
  bullets,
  portfolioHref,
  portfolioLabel,
  panelRef = null,
  interactive = true,
}) {
  return (
    <div
      ref={panelRef}
      data-testid={`${id}-panel`}
      aria-hidden={interactive ? undefined : "true"}
      className="story-copy-panel pointer-events-auto w-full p-4 sm:p-5 min-[1100px]:p-7"
    >
      <div className="flex items-center gap-3">
        <span data-testid={`${id}-number`} className="font-editorial text-5xl font-medium leading-none text-[#EEEDE9]/20 min-[1100px]:text-6xl">
          {num}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#CBCC10] min-[1100px]:text-xs">
          {overline}
        </span>
      </div>
      <h2 className="mt-2 leading-[0.98] tracking-tight text-[#EEEDE9] min-[1100px]:mt-4">
        {title.map((line, index) => (
          <span key={line} data-testid={`${id}-title-${index}`} className={`${index === title.length - 1 && title.length > 1 ? "font-editorial" : "font-head uppercase"} block text-[1.75rem] sm:text-[2rem] min-[1100px]:text-[2.65rem]`}>
            {line}
          </span>
        ))}
      </h2>
      <p data-testid={`${id}-body`} className="mt-3 max-w-md text-[12.5px] leading-[1.48] text-[#E4E4E7] sm:text-[13px] min-[1100px]:mt-4 min-[1100px]:text-[0.95rem]">
        {body}
      </p>
      <div className="mt-3 min-[1100px]:mt-4">
        <Link
          to={portfolioHref}
          tabIndex={interactive ? 0 : -1}
          data-testid={`${id}-portfolio-link`}
          className="group inline-flex min-h-9 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#CBCC10] underline decoration-[#CBCC10]/55 underline-offset-4 transition-colors hover:text-[#E5E655] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CBCC10] min-[1100px]:min-h-11 min-[1100px]:text-[10px]"
        >
          <span>{portfolioLabel}</span>
          <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-white" />
        </Link>
      </div>
      <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-3 min-[1100px]:mt-4 min-[1100px]:space-y-2 min-[1100px]:pt-4">
        {bullets.map((bullet, index) => (
          <li key={bullet} data-testid={`${id}-bullet-${index}`} className="flex items-center gap-2.5 text-[12px] leading-snug text-[#FAFAFA] min-[1100px]:text-sm">
            <span className="h-px w-5 shrink-0 bg-[#CBCC10] min-[1100px]:w-6" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Normal motion uses the single StoryBannerRailV1. Reduced motion keeps every
 * chapter in document flow so all content remains readable without animation. */
export function ChapterV4({ side, timing, ...cardProps }) {
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const lane = side === "right"
    ? "min-[768px]:col-span-5 min-[768px]:col-start-8 min-[768px]:justify-self-end"
    : "min-[768px]:col-span-5 min-[768px]:col-start-1 min-[768px]:justify-self-start";

  if (!reduced) {
    return <section id={cardProps.id} data-testid={cardProps.id} data-focus={timing.focus} className="pointer-events-none relative min-h-[170svh]" />;
  }

  return (
    <section id={cardProps.id} data-testid={cardProps.id} className="pointer-events-none relative flex min-h-[100svh] items-end px-4 pb-5 pt-24 min-[768px]:items-center min-[768px]:px-6 min-[1100px]:px-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12">
        <div className={`col-span-12 mx-auto w-full max-w-[430px] min-[768px]:mx-0 min-[768px]:w-[min(36vw,360px)] min-[1100px]:w-[clamp(340px,28vw,430px)] ${lane}`}>
          <ChapterCardV1 {...cardProps} interactive />
        </div>
      </div>
    </section>
  );
}
