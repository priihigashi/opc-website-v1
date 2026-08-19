import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import FooterV2 from "@/components/FooterV2";

const counties = [
  {
    name: "Broward County",
    detail: "Residential renovations, additions, kitchens, bathrooms, outdoor living, concrete and pavers coordinated across the home as one scope.",
  },
  {
    name: "Palm Beach County",
    detail: "Construction planning and execution for existing homes and new residential work, with structure, interiors and exterior spaces considered together.",
  },
  {
    name: "Miami-Dade County",
    detail: "Residential construction services shaped around the project site, existing conditions, defined scope and the approvals required for the work.",
  },
];

export default function ServiceAreasV1() {
  return (
    <div className="min-h-screen bg-[#09090B] pt-16 text-[#FAFAFA]">
      <main>
        <header className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 md:px-10 md:pb-28 md:pt-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#CBCC10]">South Florida service area</p>
            <h1 className="mt-5 max-w-5xl font-head text-5xl uppercase leading-[0.92] sm:text-7xl">
              Broward. Palm Beach.
              <span className="block font-editorial normal-case">Miami-Dade.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              Oak Park Construction serves residential projects across these three South Florida counties. Every enquiry begins with the property, the requested scope and whether our team is the right fit for the work.
            </p>
          </div>
        </header>

        <section aria-labelledby="county-coverage" className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CBCC10]">Coverage</p>
              <h2 id="county-coverage" className="mt-4 font-head text-4xl uppercase sm:text-5xl">Three counties. One accountable team.</h2>
            </div>
            <div className="border-t border-white/15">
              {counties.map((county, index) => (
                <article key={county.name} className="grid gap-4 border-b border-white/15 py-8 sm:grid-cols-[auto_1fr] sm:gap-8">
                  <span className="font-mono text-[10px] tracking-[0.24em] text-[#CBCC10]">0{index + 1}</span>
                  <div>
                    <h3 className="font-head text-3xl uppercase">{county.name}</h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-white/65">{county.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.035]">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-[1fr_auto] md:items-center md:px-10 md:py-20">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CBCC10]">Project fit</p>
              <h2 className="mt-4 max-w-3xl font-head text-4xl uppercase">Start with the service, property and intended scope.</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-white/65">We will confirm coverage and next steps after reviewing the project details. County coverage does not imply that every property or scope is automatically accepted.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/services" className="inline-flex items-center gap-3 rounded-full border border-[#CBCC10] px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#CBCC10] transition-colors hover:bg-[#CBCC10] hover:text-black">View Services <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/" state={{ scrollTo: "#contact" }} className="inline-flex items-center gap-3 rounded-full bg-[#CBCC10] px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-black">Start a Project <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <FooterV2 />
    </div>
  );
}
