const items = ["Oak Park Construction", "Building Legacies", "Shell to Shoreline", "Since 1998"];

export default function Marquee() {
  const row = [...items, ...items, ...items];
  return (
    <div data-testid="marquee" className="overflow-hidden border-y border-white/10 py-6">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-10">
            {row.map((t, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-10">
                <span className="font-head text-2xl font-bold uppercase tracking-tight text-[#FAFAFA]/80">
                  {t}
                </span>
                <span className="h-2 w-2 rotate-45 bg-[#CBCC10]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
