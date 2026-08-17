export default function Footer() {
  return (
    <footer data-testid="footer" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-24 md:px-10">
        <div className="grid grid-cols-12 gap-y-10 border-b border-white/10 pb-16">
          <div className="col-span-12 md:col-span-5">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-[#FAFAFA]">
              Oak Park<span className="text-[#CBCC10]">&nbsp;Co.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#A1A1AA]">
              General contractors for the whole life of a home — shell construction,
              remodels, additions, outdoor living, concrete and pavers.
            </p>
          </div>
          <div className="col-span-6 md:col-span-3 md:col-start-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">Services</p>
            <ul className="mt-4 space-y-2 text-sm text-[#FAFAFA]">
              <li>Shell Construction</li>
              <li>Kitchen + Bath Remodels</li>
              <li>Additions</li>
              <li>Outdoor Living</li>
              <li>Concrete + Pavers</li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-[#FAFAFA]">
              <li>(555) 013-4477</li>
              <li>build@oakparkconstruction.com</li>
              <li>214 Oak Park Ave</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 py-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[#A1A1AA]">
          <p>© {new Date().getFullYear()} Oak Park Construction</p>
          <p>Licensed · Bonded · Insured</p>
        </div>
      </div>
      <p
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap text-center font-head text-[18vw] font-bold leading-[0.8] tracking-tighter text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}
      >
        OAK PARK
      </p>
    </footer>
  );
}
