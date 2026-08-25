import FooterV2 from "@/components/FooterV2";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, MoveLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getPortfolioProject } from "@/data/portfolioProjectsV3";
import PortfolioPicture from "@/components/PortfolioPicture";

function GalleryRow({ row, rowIndex, projectTitle, aboveFold = false }) {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    const update = () => {
      const slides = [...el.querySelectorAll("[data-slide]")];
      if (!slides.length) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const nudge = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const nextIndex = Math.max(0, Math.min(row.images.length - 1, activeIndex + direction));
    el.querySelectorAll("[data-slide]")[nextIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <section
      id={`project-sequence-${rowIndex + 1}`}
      className={aboveFold ? "flex min-h-0 flex-1 flex-col border-t border-white/10 py-3 sm:py-4" : "scroll-mt-16 border-t border-white/10 py-14 md:py-20"}
    >
      <div className="mx-auto flex w-full max-w-[880px] items-end justify-between gap-6 px-6 md:px-10">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#CBCC10] sm:text-[10px]">
            {projectTitle} · Sequence {String(rowIndex + 1).padStart(2, "0")}
          </p>
          <h2 className={`${aboveFold ? "mt-1.5 text-2xl sm:text-3xl md:text-4xl" : "mt-3 text-3xl sm:text-5xl"} font-head uppercase`}>
            {row.label}
          </h2>
        </div>
        <p className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-white/50 sm:block">
          {String(activeIndex + 1).padStart(2, "0")} / {String(row.images.length).padStart(2, "0")}
        </p>
      </div>

      <div className={`relative mx-auto flex w-full max-w-[880px] flex-1 px-6 md:px-10 ${aboveFold ? "mt-3 min-h-0 items-start sm:mt-4" : "mt-8 items-center"}`}>
        <button
          type="button"
          onClick={() => nudge(-1)}
          disabled={activeIndex === 0}
          aria-label={`Previous photo in ${row.label}`}
          className="absolute left-8 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/75 backdrop-blur transition-colors hover:border-[#CBCC10] disabled:pointer-events-none disabled:opacity-25 md:left-14"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={scrollerRef}
          className="no-scrollbar flex w-full snap-x snap-mandatory gap-5 overflow-x-auto"
        >
          {row.images.map((image, imageIndex) => (
            <figure
              key={image.id}
              data-slide
              className="min-w-full snap-center overflow-hidden rounded-[18px] border border-white/10 bg-[#131316]"
            >
              {/* The slide box stays a constant 4:3 so the carousel never jumps between
                  slides. Landscape masters are 4:3 natively and fill it with no crop at
                  all; portrait masters are contained rather than cropped, because a 3:4
                  photograph forced through object-cover loses about 70% of the frame —
                  which is exactly how construction work disappears from a gallery. */}
              <div
                className={`relative overflow-hidden ${
                  aboveFold
                    ? "flex h-[clamp(180px,30svh,330px)] w-full items-center justify-center bg-[#0D0D0F]"
                    : "flex aspect-[4/3] w-full items-center justify-center bg-[#0D0D0F]"
                }`}
              >
                {/* A portrait photograph in a wide box is letterboxed rather than cropped,
                    so the sides would otherwise read as dead black. A blurred, scaled copy
                    of the same photo fills them — nothing is cropped and nothing looks empty.
                    It uses the smallest derivative, so it costs almost nothing. */}
                {image.orientation === "portrait" && (
                  <div
                    aria-hidden
                    className="absolute inset-0 scale-110 bg-cover bg-center opacity-45 blur-2xl"
                    style={{ backgroundImage: `url("${image.src}-${image.widths[0]}w.jpg")` }}
                  />
                )}
                <PortfolioPicture
                  image={image}
                  eager={rowIndex === 0 && imageIndex === 0}
                  sizes="(max-width: 880px) 100vw, 880px"
                  pictureClassName={
                    image.orientation === "portrait"
                      ? "relative flex h-full w-full items-center justify-center"
                      : "relative block h-full w-full"
                  }
                  className={
                    image.orientation === "portrait"
                      ? "h-full w-auto max-w-full object-contain"
                      : "h-full w-full object-cover"
                  }
                />
              </div>
              <figcaption className="flex items-center justify-between gap-4 px-4 py-2.5 text-xs text-white/65 sm:px-5 sm:py-3 sm:text-sm">
                <span>
                  <span className="mr-2 rounded-full border border-[#CBCC10]/40 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-[#CBCC10]">
                    {image.phase === "AFTER" ? "Finished" : image.phase === "DURING" ? "During" : "Before"}
                  </span>
                  {image.alt}
                </span>
                <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.2em] text-white/40 sm:hidden">
                  {imageIndex + 1}/{row.images.length}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <button
          type="button"
          onClick={() => nudge(1)}
          disabled={activeIndex === row.images.length - 1}
          aria-label={`Next photo in ${row.label}`}
          className="absolute right-8 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/75 backdrop-blur transition-colors hover:border-[#CBCC10] disabled:pointer-events-none disabled:opacity-25 md:right-14"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

export default function ProjectGalleryV3() {
  const { projectId } = useParams();
  const project = getPortfolioProject(projectId);
  if (!project) return <Navigate to="/portfolio" replace />;

  const rows = (project.rows || []).filter((row) => row.images && row.images.length > 0);
  const [firstRow, ...additionalRows] = rows;
  const showMore = additionalRows.length > 0;
  const scrollToNextRow = () => document.getElementById("project-sequence-2")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-[#09090B] pt-16 text-white">
      {/* Only reserve a full viewport when there is a second sequence to scroll to.
          A single-sequence project was leaving ~220px of dead black below the photo. */}
      <div className={`relative flex flex-col pb-11 ${showMore ? "min-h-[calc(100svh-4rem)]" : ""}`}>
        <header className="mx-auto grid w-full max-w-6xl gap-3 px-6 pb-4 pt-5 sm:pt-7 md:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] md:items-end md:gap-10 md:px-10 md:pb-5 md:pt-8">
          <div>
            <Link to="/portfolio" className="inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-[#CBCC10] sm:text-[10px]">
              <MoveLeft className="h-4 w-4" />All Projects
            </Link>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[#CBCC10] sm:mt-4 sm:text-[10px]">Selected Project · {project.cat}</p>
            <h1 className="mt-1.5 max-w-4xl font-head text-[clamp(2.35rem,6vw,5.5rem)] uppercase leading-[0.9]">{project.title}</h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-white/65 md:pb-1 md:text-base">{project.intro}</p>
        </header>

        {/* Compact the lead row only when something follows it; otherwise present the
            single sequence at full size instead of clamping it and leaving space empty. */}
        {firstRow && <GalleryRow row={firstRow} rowIndex={0} projectTitle={project.title} />}

        {showMore && (
          <button
            type="button"
            onClick={scrollToNextRow}
            aria-label={`Scroll down to ${additionalRows[0].label}`}
            className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-0.5 font-mono text-[8px] uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-[#CBCC10]"
          >
            More From This Project
            <ChevronDown className="h-4 w-4 animate-bounce text-[#CBCC10]" />
          </button>
        )}
      </div>

      {additionalRows.map((row, index) => (
        <GalleryRow key={row.label} row={row} rowIndex={index + 1} projectTitle={project.title} />
      ))}

      <div className="border-t border-white/10 px-6 py-20 text-center">
        <Link to="/portfolio" className="inline-flex rounded-full border border-[#CBCC10] px-7 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#CBCC10] transition-colors hover:bg-[#CBCC10] hover:text-black">
          Return to All Projects
        </Link>
      </div>
      <FooterV2 />
    </div>
  );
}
