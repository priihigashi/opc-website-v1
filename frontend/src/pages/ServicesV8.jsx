import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { houseStageStatus, whenHouseStageSettled, HOUSE_FAILED, HOUSE_PENDING } from "@/lib/houseRenderPolicy";
import { scrollStore } from "@/lib/scrollStore";
import { SERVICES_V5, SERVICES_V5_RESTING_PROGRESS } from "./servicesDataV5";
import { servicesPreviewStoreV3 as previewStore } from "./servicesPreviewStoreV3";

const SERVICES_HEADING = "Choose Its Next Chapter";

const phaseLabel = (service, elapsed) => {
  if (elapsed < service.revealMs) return `Revealing ${service.label}`;
  if (elapsed < service.revealMs + service.holdMs) return `${service.label} view complete`;
  return `Opening ${service.label}`;
};

function ServiceControl({ service, selected, disabled, preparing = false, onPick }) {
  return (
    <button
      type="button"
      data-testid={`svc-${service.slug}`}
      aria-pressed={selected}
      aria-busy={preparing}
      data-preparing={preparing ? "true" : undefined}
      disabled={disabled}
      onClick={() => onPick(service)}
      className={`service-control-v2 pointer-events-auto group flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CBCC10] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] ${
        selected ? "service-control-v2-selected" : ""
      }`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#EEEDE9] sm:text-xs">
        {service.label}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 transition duration-300 ${selected ? "text-[#09090B]" : "text-[#CBCC10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"}`}
      />
    </button>
  );
}

export default function ServicesV8() {
  const navigate = useNavigate();
  const animationRef = useRef(0);
  const [preparing, setPreparing] = useState(null);
  const mountedRef = useRef(true);
  const [selected, setSelected] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    scrollStore.intro = 1;
    scrollStore.p = SERVICES_V5_RESTING_PROGRESS;
    previewStore.active = null;
    previewStore.kind = null;
    previewStore.t = 0;

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const play = (service) => {
    const startedAt = performance.now();
    const totalMs = service.revealMs + service.holdMs + service.handoffMs;
    setSelected(service);
    setElapsed(0);
    scrollStore.p = service.target;
    previewStore.active = service.slug;
    previewStore.kind = service.kind;
    previewStore.t = 0;
    previewStore.reducedMotion = false;

    const tick = (now) => {
      const nextElapsed = Math.min(totalMs, now - startedAt);
      previewStore.t = Math.min(1, nextElapsed / service.revealMs);

      if (mountedRef.current) setElapsed(nextElapsed);
      if (nextElapsed < totalMs) {
        animationRef.current = requestAnimationFrame(tick);
        return;
      }

      navigate(`/services/${service.slug}`);
    };

    animationRef.current = requestAnimationFrame(tick);
  };

  const pick = (service) => {
    if (selected || preparing) return;

    import("./ServiceDetailV3");
    const status = houseStageStatus();
    if (status === HOUSE_FAILED) {
      navigate(`/services/${service.slug}`);
      return;
    }
    if (status === HOUSE_PENDING) {
      setPreparing(service.slug);
      whenHouseStageSettled().then((settled) => {
        if (!mountedRef.current) return;
        setPreparing(null);
        if (settled === HOUSE_FAILED) navigate(`/services/${service.slug}`);
        else play(service);
      });
      return;
    }
    play(service);
  };

  const totalMs = selected ? selected.revealMs + selected.holdMs + selected.handoffMs : 1;
  const progress = Math.min(1, elapsed / totalMs);

  return (
    <main
      data-testid="services-page-v8"
      className="pointer-events-none relative z-10 min-h-[100svh] overflow-hidden bg-transparent text-[#FAFAFA]"
    >
      <section className="mx-auto flex min-h-[100svh] w-full max-w-[110rem] flex-col px-4 pb-5 pt-20 sm:px-6 md:px-8 md:pb-8 md:pt-24 xl:px-12">
        <div className="services-heading-v3 pointer-events-auto mx-auto w-full max-w-5xl text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#CBCC10] sm:text-[10px]">
            Oak Park Construction
          </p>
          <h1 className="mt-1.5 flex items-baseline justify-center gap-2.5 whitespace-nowrap text-[#FAFAFA] sm:gap-4">
            <span className="font-head text-[clamp(1.65rem,6.2vw,4.5rem)] uppercase leading-[0.9] tracking-[-0.025em]">
              {SERVICES_HEADING.slice(0, 10)}
            </span>
            <span className="font-editorial text-[clamp(1.72rem,5.8vw,4.2rem)] font-medium italic leading-[0.92] tracking-[-0.04em]">
              {SERVICES_HEADING.slice(11)}
            </span>
          </h1>
          <p className="mx-auto mt-2 hidden max-w-xl text-xs leading-relaxed text-[#C8C7C1] sm:block">
            Select a service. Watch the house respond, then explore the work.
          </p>
        </div>

        <div className="services-spacer-v2 min-h-[34svh] flex-1 sm:min-h-[38svh] md:min-h-0" aria-hidden="true" />

        <div className="pointer-events-auto mx-auto grid w-full max-w-6xl grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {SERVICES_V5.map((service) => (
            <ServiceControl
              preparing={preparing === service.slug}
              key={service.slug}
              service={service}
              selected={selected?.slug === service.slug}
              disabled={Boolean(selected) || Boolean(preparing)}
              onPick={pick}
            />
          ))}
        </div>

        <div className="mt-3 min-h-9 text-center" aria-live="polite">
          {preparing && !selected ? (
            <p data-testid="preview-preparing-v8" className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#CBCC10]">
              Preparing the view&hellip;
            </p>
          ) : null}
          {selected ? (
            <div data-testid="preview-progress-v8" className="pointer-events-auto mx-auto w-full max-w-sm">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#EEEDE9]">
                {phaseLabel(selected, elapsed)}
              </p>
              <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full bg-[#CBCC10] transition-[width] duration-75"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8F8F94] sm:text-[10px]">
              Select any service to preview its scope.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
