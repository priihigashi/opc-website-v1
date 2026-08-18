import { useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, MoveLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getPortfolioProject } from "@/data/portfolioProjectsV3";

function GalleryRow({ row, rowIndex, featured = false }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    const update = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      el.querySelectorAll("[data-slide]").forEach((slide) => {
        const distance = Math.min(1, Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center) / (el.clientWidth * 0.58));
        slide.style.transform = `scale(${1 - distance * 0.1})`;
        slide.style.opacity = String(1 - distance * 0.3);
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const nudge = (direction) => scrollerRef.current?.scrollBy({
    left: direction * scrollerRef.current.clientWidth * 0.72,
    behavior: "smooth",
  });

  return (
    <section
      id={`project-sequence-${rowIndex + 1}`}
      className={featured ? "flex min-h-0 flex-1 flex-col border-t border-white/10 py-3 sm:py-4 md:py-5" : "scroll-mt-16 border-t border-white/10 py-14 md:py-20"}
    >
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-6 md:px-10">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#CBCC10] sm:text-[10px]">
            Sequence {String(rowIndex + 1).padStart(2, "0")}
          </p>
          <h2 className={`${featured ? "mt-1.5 text-2xl sm:text-3xl md:text-4xl" : "mt-3 text-3xl sm:text-5xl"} font-head uppercase`}>
            {row.label}
          </h2>
        </div>
        <p className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-white/50 sm:block">
          Drag or use arrows
        </p>
      </div>

      <div className={`group/row relative ${featured ? "mt-3 flex min-h-0 flex-1 items-center sm:mt-4" : "mt-8"}`}>
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label={`Previous photos in ${row.label}`}
          className={`${featured ? "h-10 w-10" : "h-12 w-12"} absolute left-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/75 backdrop-blur transition-colors hover:border-[#CBCC10] md:left-8`}
        >
          <ChevronLeft className={featured ? "h-5 w-5" : "h-6 w-6"} />
        </button>

        <div
          ref={scrollerRef}
          className={`no-scrollbar flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-[10vw] ${featured ? "items-center pb-1" : "pb-3"}`}
        >
          {row.images.map(([src, alt], imageIndex) => (
            <figure
              key={src}
              data-slide
              className={`${featured ? "w-[82vw] md:w-[64vw] xl:w-[56vw]" : "w-[82vw] md:w-[62vw] xl:w-[52vw]"} flex-none snap-center overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04] transition-[transform,opacity] duration-150`}
            >
              <img
                src={src}
                alt={alt}
                width="1800"
                height="1350"
                loading={rowIndex === 0 && imageIndex === 0 ? "eager" : "lazy"}
                decoding="async"
                className={featured ? "h-[clamp(220px,40svh,410px)] w-full object-cover" : "aspect-[4/3] w-full object-cover"}
              />
              <figcaption className={`${featured ? "px-4 py-2.5 text-xs sm:px-5 sm:py-3 sm:text-sm" : "px-5 py-4 text-sm"} text-white/65`}>
                {alt}
              </figcaption>
            </figure>
          ))}
        </div>

        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label={`Next photos in ${row.label}`}
          className={`${featured ? "h-10 w-10" : "h-12 w-12"} absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/75 backdrop-blur transition-colors hover:border-[#CBCC10] md:right-8`}
        >
          <ChevronRight className={featured ? "h-5 w-5" : "h-6 w-6"} />
        </button>
      </div>
    </section>
  );
}

export default function ProjectGalleryV2() {
  const { projectId } = useParams();
  const project = getPortfolioProject(projectId);
  if (!project) return <Navigate to="/portfolio" replace />;

  const [firstRow, ...additionalRows] = project.rows;
  const showMore = additionalRows.length > 0;
  const scrollToNextRow = () => document.getElementById("project-sequence-2")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-[#09090B] pt-16 text-white">
      <div className="relative flex min-h-[calc(100svh-4rem)] flex-col pb-11">
        <header className="mx-auto grid w-full max-w-7xl gap-3 px-6 pb-4 pt-5 sm:pt-7 md:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] md:items-end md:gap-10 md:px-10 md:pb-5 md:pt-8">
          <div>
            <Link to="/portfolio" className="inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-[#CBCC10] sm:text-[10px]">
              <MoveLeft className="h-4 w-4" />All Projects
            </Link>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[#CBCC10] sm:mt-4 sm:text-[10px]">{project.cat}</p>
            <h1 className="mt-1.5 max-w-4xl font-head text-[clamp(2.35rem,6vw,5.5rem)] uppercase leading-[0.9]">{project.title}</h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-white/65 md:pb-1 md:text-base">{project.intro}</p>
        </header>

        {firstRow && <GalleryRow row={firstRow} rowIndex={0} featured />}

        {showMore && (
          <button
            type="button"
            onClick={scrollToNextRow}
            aria-label={`Scroll down to ${additionalRows[0].label}`}
            className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-0.5 font-mono text-[8px] uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-[#CBCC10]"
          >
            More sequences
            <ChevronDown className="h-4 w-4 animate-bounce text-[#CBCC10]" />
          </button>
        )}
      </div>

      {additionalRows.map((row, index) => (
        <GalleryRow key={row.label} row={row} rowIndex={index + 1} />
      ))}

      <div className="border-t border-white/10 px-6 py-20 text-center">
        <Link to="/portfolio" className="inline-flex rounded-full border border-[#CBCC10] px-7 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#CBCC10] transition-colors hover:bg-[#CBCC10] hover:text-black">
          Return to All Projects
        </Link>
      </div>
    </div>
  );
}
