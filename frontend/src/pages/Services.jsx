import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { servicesCtx as ctx } from "./servicesStore";

export const SERVICES = [
  { slug: "full-renovation", label: "Full Renovation", dur: 1.8, rot: 0.55, kind: "reno" },
  { slug: "kitchen", label: "Kitchen", dur: 1.5, rot: 0.02, kind: "cut" },
  { slug: "bathroom", label: "Bathroom", dur: 1.5, rot: 0.02, kind: "cut" },
  { slug: "new-construction", label: "New Construction", dur: 1.8, rot: 0.55, kind: "build" },
  { slug: "additions", label: "Additions", dur: 1.6, rot: -1.38, kind: "add" },
  { slug: "shell-construction", label: "Shell Construction", dur: 1.5, rot: 0.85, kind: "peel" },
  { slug: "outdoor-living", label: "Outdoor Living", dur: 1.7, rot: -3.05, kind: "out" },
  { slug: "concrete-pavers", label: "Concrete + Pavers", dur: 1.5, rot: 0.15, kind: "conc" },
];

function Label({ svc, side, disabled, onHover, onLeave, onPick }) {
  return (
    <button
      data-testid={`svc-${svc.slug}`}
      disabled={disabled}
      onMouseEnter={() => onHover(svc)}
      onMouseLeave={onLeave}
      onClick={() => onPick(svc)}
      className={`group pointer-events-auto flex items-center gap-3 ${side === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA] transition-colors duration-300 group-hover:text-[#FAFAFA] md:text-xs">
        {svc.label}
      </span>
      <span className="h-px w-8 bg-white/25 transition-colors duration-300 group-hover:bg-[#CBCC10] md:w-12" />
      <span className="h-1.5 w-1.5 rounded-full border border-white/40 transition-colors duration-300 group-hover:border-[#CBCC10] group-hover:bg-[#CBCC10]" />
    </button>
  );
}

export default function Services() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(null);
  const [prog, setProg] = useState(0);

  const pick = (svc) => {
    if (ctx.active) return;
    import("./ServiceDetail");
    ctx.active = svc.slug;
    ctx.svc = svc;
    ctx.t = 0;
    ctx.tTarget = 0;
    setBusy(svc);
    setProg(0);
    const t0 = performance.now();
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / (svc.dur * 1000));
      ctx.tTarget = k;
      setProg(k);
      if (k < 1) requestAnimationFrame(tick);
      else navigate(`/services/${svc.slug}`);
    };
    requestAnimationFrame(tick);
  };

  const left = SERVICES.slice(0, 4);
  const right = SERVICES.slice(4);

  return (
    <div data-testid="services-page" className="pointer-events-none relative z-10 flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-7xl px-6 pt-24 text-center md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#CBCC10]">Oak Park Construction</p>
        <h1 className="mt-3 font-head text-4xl font-bold tracking-tight text-[#FAFAFA] [text-shadow:0_2px_28px_rgba(9,9,11,0.9)] sm:text-5xl">
          One house. Choose its next chapter.
        </h1>
      </div>

      {/* desktop annotation labels around the house */}
      <div className="absolute left-[6%] top-[26%] hidden flex-col gap-12 md:flex">
        {left.map((s) => (
          <Label key={s.slug} svc={s} side="left" disabled={!!busy} onHover={(x) => (ctx.hover = x.slug)} onLeave={() => (ctx.hover = null)} onPick={pick} />
        ))}
      </div>
      <div className="absolute right-[6%] top-[26%] hidden flex-col items-end gap-12 md:flex">
        {right.map((s) => (
          <Label key={s.slug} svc={s} side="right" disabled={!!busy} onHover={(x) => (ctx.hover = x.slug)} onLeave={() => (ctx.hover = null)} onPick={pick} />
        ))}
      </div>

      {/* mobile label grid */}
      <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-5 px-6 pb-24 pt-[52vh] md:hidden">
        {SERVICES.map((s) => (
          <Label key={s.slug} svc={s} side="left" disabled={!!busy} onHover={(x) => (ctx.hover = x.slug)} onLeave={() => (ctx.hover = null)} onPick={pick} />
        ))}
      </div>

      {busy && (
        <div data-testid="preview-progress" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#FAFAFA]">Entering {busy.label}</p>
          <div className="mx-auto mt-3 h-px w-56 bg-white/15">
            <div className="h-px bg-[#CBCC10]" style={{ width: `${prog * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
