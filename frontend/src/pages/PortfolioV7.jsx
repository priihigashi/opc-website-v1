import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PORTFOLIO_FILTERS, PORTFOLIO_PROJECTS } from "@/data/portfolioProjectsV3";
import { PORTFOLIO_HERO_VIDEO, PORTFOLIO_HERO_POSTER } from "./portfolioHeroMedia";
import PortfolioPicture from "@/components/PortfolioPicture";

function ProjectCard({ project, index }) {
  return (
    <motion.article initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "200px 0px 200px 0px", amount: 0.01 }} transition={{ duration: 0.65, delay: Math.min(index * 0.05, 0.2) }} className={project.featured ? "md:col-span-2" : ""}>
      <Link to={`/portfolio/${project.id}`} data-testid={`portfolio-project-${project.id}`} className="group block overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] backdrop-blur-xl transition-colors hover:border-[#CBCC10]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CBCC10]">
        <div className={`relative overflow-hidden ${project.featured ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
          <PortfolioPicture image={project.cover} eager={index < 2} sizes={project.featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/55 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-md"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#CBCC10]" />{project.phase} · {project.imageCount} photos</div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
            <div><p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#CBCC10]">{project.cat}</p><h2 className="mt-2 font-head text-2xl uppercase text-white sm:text-4xl">{project.title}</h2></div>
            <ArrowUpRight aria-hidden className="h-6 w-6 flex-none text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
        </div>
        <p className="px-5 py-4 text-sm text-[#B8B8BC] sm:px-7">{project.detail}</p>
      </Link>
    </motion.article>
  );
}

const getValidFilter = (value) => PORTFOLIO_FILTERS.includes(value) ? value : "ALL";

export default function PortfolioV7() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(() => getValidFilter(searchParams.get("category")));
  const shown = PORTFOLIO_PROJECTS.filter((project) => filter === "ALL" || project.tags.includes(filter));

  useEffect(() => {
    const requestedFilter = getValidFilter(searchParams.get("category"));
    setFilter(requestedFilter);
    if (window.location.hash === "#portfolio-projects") {
      const timer = window.setTimeout(() => document.getElementById("portfolio-projects")?.scrollIntoView({ block: "start" }), 120);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [searchParams]);

  const selectFilter = (item) => {
    setFilter(item);
    if (item === "ALL") setSearchParams({}, { replace: true });
    else setSearchParams({ category: item }, { replace: true });
  };

  return <div data-testid="portfolio-page" className="min-h-screen bg-[#09090B] pt-16 text-[#FAFAFA]">
    <header className="relative min-h-[calc(100svh-4rem)] overflow-hidden border-b border-white/10">
      <img src={PORTFOLIO_HERO_POSTER} alt="Oak Park Construction completed interior work" width="1280" height="720" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      <video data-testid="portfolio-hero-video" aria-hidden autoPlay muted loop playsInline preload="metadata" poster={PORTFOLIO_HERO_POSTER} className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:hidden sm:block">
        <source src={PORTFOLIO_HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.58)_0%,rgba(9,9,11,0.20)_48%,rgba(9,9,11,0.06)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/65 via-transparent to-black/10" />
      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-end px-6 pb-20 pt-14 md:px-10 md:pb-24">
        <div className="grid items-end gap-8 md:grid-cols-[1.4fr_0.6fr]">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#CBCC10]">Portfolio · South Florida</p><h1 className="mt-5 max-w-4xl leading-[0.88] tracking-[-0.035em]"><span className="block font-head text-5xl uppercase sm:text-7xl md:text-8xl">Our Projects</span><span className="font-editorial text-5xl sm:text-7xl md:text-8xl">See the Work</span></h1></div>
          <div className="rounded-[18px] border border-white/15 bg-black/35 p-5 text-sm leading-relaxed text-white/90 backdrop-blur-xl">Open a project to see finished photos and construction progress in order. Full-home projects stay together, so you can follow the complete transformation.</div>
        </div>
        <a href="#portfolio-projects" className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[9px] uppercase tracking-[0.24em] text-white/85 transition-colors hover:text-[#CBCC10]"><span>View Projects</span><ChevronDown aria-hidden className="h-4 w-4" /></a>
      </div>
    </header>
    <nav id="portfolio-projects" aria-label="Portfolio categories" className="sticky top-16 z-30 scroll-mt-16 border-y border-white/15 bg-[linear-gradient(90deg,rgba(9,9,11,0.96),rgba(18,18,19,0.92),rgba(9,9,11,0.96))] shadow-[0_12px_32px_rgba(0,0,0,0.24)] backdrop-blur-xl"><div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4 md:px-10">{PORTFOLIO_FILTERS.map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => selectFilter(item)} className={`flex-none rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors duration-300 ${filter === item ? "border-[#CBCC10] bg-[#CBCC10] text-[#09090B]" : "border-white/25 bg-black/10 text-white/75 hover:border-white/45 hover:text-white"}`}>{item}</button>)}</div></nav>
    {shown.length > 0 ? <main data-testid="portfolio-grid" className="mx-auto grid max-w-7xl scroll-mt-32 grid-cols-1 gap-5 px-6 py-10 md:grid-cols-2 md:px-10 md:py-14">{shown.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</main> : <main data-testid="portfolio-grid-empty" className="mx-auto max-w-7xl px-6 py-20 text-center md:px-10"><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">No documented projects in this category yet.</p><button type="button" onClick={() => selectFilter("ALL")} className="mt-6 inline-flex rounded-full border border-[#CBCC10] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#CBCC10]">View all projects</button></main>}
    <footer className="mx-auto max-w-7xl px-6 pb-24 pt-10 text-center md:px-10"><div className="rounded-[22px] border border-white/10 bg-white/[0.045] px-6 py-14"><p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CBCC10]">Built with one accountable team</p><h2 className="mx-auto mt-5 max-w-3xl font-head text-4xl uppercase sm:text-5xl">Your Project Can Be the Next Documented Transformation</h2><a href="/#contact" className="mt-8 inline-flex rounded-full bg-[#CBCC10] px-7 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#09090B]">Start a Project</a></div></footer>
  </div>;
}
