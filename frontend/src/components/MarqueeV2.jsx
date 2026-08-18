const items = [
  "Oak Park Construction",
  "Full-service residential builder",
  "Structure to finish",
  "South Florida",
];

export default function MarqueeV2() {
  const row = [...items, ...items, ...items];
  return (
    <div data-testid="marquee" className="overflow-hidden border-y border-white/10 py-6">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-10">
            {row.map((item, index) => (
              <span key={`${half}-${index}`} className="flex items-center gap-10">
                <span className="font-head text-2xl font-bold uppercase tracking-tight text-[#FAFAFA]/80">
                  {item}
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
