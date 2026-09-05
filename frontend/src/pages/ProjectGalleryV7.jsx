import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, MoveLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import FooterV3 from "@/components/FooterV3";
import PortfolioPicture from "@/components/PortfolioPicture";
import ProjectGalleryV5 from "@/pages/ProjectGalleryV5";
import { getPortfolioProject } from "@/data/portfolioProjectsLaunchV1";

function GalleryRow({ row, rowIndex }) {
  const scroller = useRef(null);
  const [active, setActive] = useState(0);
  const sequence = row.label.replaceAll("During Construction", "During");
  useEffect(() => {
    const el = scroller.current;
    const update = () => setActive(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, []);
  const move = (direction) => {
    const el = scroller.current;
    const next = Math.max(0, Math.min(row.images.length - 1, active + direction));
    el.scrollTo({ left: next * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <section id={`project-sequence-${rowIndex + 1}`} aria-label={row.label} className={`scroll-mt-24 ${rowIndex ? "mt-10 border-t border-white/10 pt-6" : ""}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="sm:whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.08em] text-white/65 sm:text-xs sm:tracking-[0.16em]">{sequence}</h2>
        <div className="flex items-center gap-3">
          <span aria-live="polite" aria-atomic="true" className="min-w-10 text-center font-mono text-[11px] text-white/75">{active + 1} / {row.images.length}</span>
          <button type="button" onClick={() => move(-1)} disabled={active === 0} aria-label={`Previous photo in ${sequence}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-[#CBCC10] hover:text-[#CBCC10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CBCC10] disabled:opacity-25"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" onClick={() => move(1)} disabled={active >= row.images.length - 1} aria-label={`Next photo in ${sequence}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-[#CBCC10] hover:text-[#CBCC10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CBCC10] disabled:opacity-25"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
      <div ref={scroller} className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto rounded-2xl border border-white/10 bg-[#101012]" tabIndex={0} aria-label="Project photographs">
        {row.images.map((image, index) => (
          <figure key={image.id} data-slide className="w-full min-w-full shrink-0 snap-center">
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-[#101012]">
              <PortfolioPicture image={image} eager={rowIndex === 0 && index === 0} sizes="(max-width: 960px) 100vw, 960px" pictureClassName="flex h-full w-full items-center justify-center" className="h-full w-full object-contain" />
            </div>
            <figcaption className="flex items-start gap-3 border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-white/70 sm:text-sm">
              <span className="shrink-0 rounded-full border border-[#CBCC10]/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[#CBCC10]">{image.phase === "AFTER" ? "Finished" : image.phase === "DURING" ? "During" : "Before"}</span>
              <span>{image.alt}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function ProjectGalleryContent({ project }) {
  if (!project) return <Navigate to="/portfolio" replace />;
  const rows = project.rows.filter((row) => row.images?.length);
  return (
    <div className="min-h-screen bg-[#09090B] pt-16 text-white">
      <main className="mx-auto w-full max-w-[1040px] px-5 pb-12 pt-5 sm:px-8 sm:pt-7 md:px-10">
        <header className="mb-5 border-b border-white/10 pb-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/portfolio" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#CBCC10]/70 px-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#CBCC10] transition-colors hover:bg-[#CBCC10] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CBCC10]"><MoveLeft className="h-4 w-4" />All Projects</Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">{project.cat}</p>
          </div>
          <h1 className="mt-4 font-head text-[clamp(2rem,5vw,3.75rem)] uppercase leading-[1]">{project.title}</h1>
        </header>
        {rows.map((row, index) => <div key={`${project.id}-${index}`}><GalleryRow row={row} rowIndex={index} />{index === 0 && rows.length > 1 && <a href="#project-sequence-2" className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white/60">More From This Project<ChevronDown className="h-4 w-4" /></a>}</div>)}
        <Link to="/portfolio" className="mt-10 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#CBCC10]"><MoveLeft className="h-4 w-4" />Return to All Projects</Link>
      </main>
      <FooterV3 />
    </div>
  );
}

// Candidate 4 owns route-entry positioning. V6 changes presentation only.
export default function ProjectGalleryV7() {
  return <ProjectGalleryV5><RoutedGalleryContent /></ProjectGalleryV5>;
}

function RoutedGalleryContent() {
  const { projectId } = useParams();
  return <ProjectGalleryContent project={getPortfolioProject(projectId)} />;
}
