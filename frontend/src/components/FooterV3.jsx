import { Link } from "react-router-dom";
import { trackPhoneClick } from "@/lib/analytics";

export const FLORIDA_LICENSE = "CBC1263425";

export default function FooterV3() {
  return (
    <footer data-testid="footer" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-24 md:px-10">
        <div className="grid grid-cols-12 gap-y-10 border-b border-white/10 pb-16">
          <div className="col-span-12 md:col-span-5">
            <img src="/images/opc/logo-white.png" alt="Oak Park Construction" width="210" height="126" loading="lazy" className="h-24 w-auto opacity-90" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#A1A1AA]">Residential construction for the whole life of a home — shell construction, remodels, additions, outdoor living, concrete and pavers.</p>
          </div>
          <div className="col-span-6 md:col-span-3 md:col-start-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-[#FAFAFA]">
              <li><Link className="transition-colors hover:text-[#CBCC10]" to="/services">Services</Link></li>
              <li><Link className="transition-colors hover:text-[#CBCC10]" to="/portfolio">Portfolio</Link></li>
              <li><Link className="transition-colors hover:text-[#CBCC10]" to="/service-areas">Service Areas</Link></li>
              <li><Link className="transition-colors hover:text-[#CBCC10]" to="/privacy">Privacy</Link></li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-[#FAFAFA]">
              <li><a data-testid="footer-phone" onClick={() => trackPhoneClick("footer")} className="transition-colors hover:text-[#CBCC10]" href="tel:+19542586769">(954) 258-6769</a></li>
              <li><a className="break-words transition-colors hover:text-[#CBCC10]" href="mailto:contact@oakpark-construction.com">contact@oakpark-construction.com</a></li>
              <li><Link className="transition-colors hover:text-[#CBCC10]" to="/service-areas">Broward · Palm Beach · Miami-Dade</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 py-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[#A1A1AA]">
          <p>© {new Date().getFullYear()} Oak Park Construction</p>
          <p data-testid="florida-license">Florida Certified Building Contractor · {FLORIDA_LICENSE}</p>
        </div>
      </div>
      <p aria-hidden className="pointer-events-none select-none whitespace-nowrap text-center font-head text-[18vw] font-bold leading-[0.8] tracking-tighter text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}>OAK PARK</p>
    </footer>
  );
}
