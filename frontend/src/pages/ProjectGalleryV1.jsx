import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, MoveLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getPortfolioProject } from "@/data/portfolioProjectsV3";

function GalleryRow({ project, row, rowIndex }) {
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
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const nudge = (direction) => scrollerRef.current?.scrollBy({ left: direction * scrollerRef.current.clientWidth * 0.72, behavior: "smooth" });
  return <section className="border-t border-white/10 py-14 md:py-20">
    <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 md:px-10"><div><p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CBCC10]">Sequence {String(rowIndex + 1).padStart(2, "0")}</p><h2 className="mt-3 font-head text-3xl uppercase sm:text-5xl">{row.label}</h2></div><p className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-white/50 sm:block">Drag or use arrows</p></div>
    <div className="group/row relative mt-8">
      <button type="button" onClick={() => nudge(-1)} aria-label={`Previous photos in ${row.label}`} className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 backdrop-blur hover:border-[#CBCC10] md:left-8"><ChevronLeft /></button>
      <div ref={scrollerRef} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[10vw] pb-3">{row.images.map(([src, alt], imageIndex) => <figure key={src} data-slide className="w-[82vw] flex-none snap-center overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04] transition-[transform,opacity] duration-150 md:w-[62vw] xl:w-[52vw]"><img src={src} alt={alt} width="1800" height="1350" loading={rowIndex === 0 && imageIndex === 0 ? "eager" : "lazy"} decoding="async" className="aspect-[4/3] w-full object-cover" /><figcaption className="px-5 py-4 text-sm text-white/65">{alt}</figcaption></figure>)}</div>
      <button type="button" onClick={() => nudge(1)} aria-label={`Next photos in ${row.label}`} className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 backdrop-blur hover:border-[#CBCC10] md:right-8"><ChevronRight /></button>
    </div>
  </section>;
}

export default function ProjectGalleryV1() {
  const { projectId } = useParams();
  const project = getPortfolioProject(projectId);
  if (!project) return <Navigate to="/portfolio" replace />;
  return <div className="min-h-screen bg-[#09090B] pt-16 text-white">
    <header className="mx-auto max-w-7xl px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20"><Link to="/portfolio" className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 hover:text-[#CBCC10]"><MoveLeft className="h-4 w-4" />All Projects</Link><p className="mt-12 font-mono text-[10px] uppercase tracking-[0.3em] text-[#CBCC10]">{project.cat}</p><h1 className="mt-4 max-w-5xl font-head text-5xl uppercase leading-[0.92] sm:text-7xl md:text-8xl">{project.title}</h1><p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">{project.intro}</p></header>
    {project.rows.map((row, rowIndex) => <GalleryRow key={row.label} project={project} row={row} rowIndex={rowIndex} />)}
    <div className="border-t border-white/10 px-6 py-20 text-center"><Link to="/portfolio" className="inline-flex rounded-full border border-[#CBCC10] px-7 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#CBCC10] hover:bg-[#CBCC10] hover:text-black">Return to All Projects</Link></div>
  </div>;
}
