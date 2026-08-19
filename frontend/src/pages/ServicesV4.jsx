import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { shouldUseStaticHouse } from "@/components/DeferredHouseStageV1";
import { scrollStore } from "@/lib/scrollStore";
import { SERVICES_V3, SERVICES_V3_RESTING_PROGRESS } from "./servicesDataV3";
import { servicesPreviewStoreV3 as previewStore } from "./servicesPreviewStoreV3";

const phaseLabel = (service, progress) => {
  const holdAt = service.kind === "build" ? 0.84 : 0.58;
  if (progress < holdAt) return `Revealing ${service.label}`;
  if (progress < 0.9) return `Holding ${service.label} view`;
  return `Opening ${service.label}`;
};

function ServiceControl({ service, selected, disabled, onPick }) {
  return (
    <button
      type="button"
      data-testid={`svc-${service.slug}`}
      aria-pressed={selected}
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

export default function ServicesV4() {
  const navigate = useNavigate();
  const animationRef = useRef(0);
  const mountedRef = useRef(true);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    scrollStore.intro = 1;
    scrollStore.p = SERVICES_V3_RESTING_PROGRESS;
    previewStore.active = null;
    previewStore.kind = null;
    previewStore.t = 0;

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const pick = (service) => {
    if (selected) return;

    import("./ServiceDetail");
    if (shouldUseStaticHouse()) {
      navigate(`/services/${service.slug}`);
      return;
    }

    const startedAt = performance.now();
    setSelected(service);
    setProgress(0);
    scrollStore.p = service.target;
    previewStore.active = service.slug;
    previewStore.kind = service.kind;
    previewStore.t = 0;
    previewStore.reducedMotion = false;

    const tick = (now) => {
      const raw = Math.min(1, (now - startedAt) / (service.duration * 1000));
      previewStore.t = raw;

      if (mountedRef.current) setProgress(raw);
      if (raw < 1) {
        animationRef.current = requestAnimationFrame(tick);
        return;
      }

      navigate(`/services/${service.slug}`);
    };

    animationRef.current = requestAnimationFrame(tick);
  };

  return (
    <main
      data-testid="services-page-v4"
      className="pointer-events-none relative z-10 min-h-[100svh] overflow-hidden bg-transparent text-[#FAFAFA]"
    >
      <section className="mx-auto flex min-h-[100svh] w-full max-w-[110rem] flex-col px-4 pb-5 pt-20 sm:px-6 md:px-8 md:pb-8 md:pt-24 xl:px-12">
        <div className="services-heading-v2 pointer-events-auto mx-auto w-full max-w-4xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#CBCC10] sm:text-[11px]">
            Oak Park Construction
          </p>
          <h1 className="mt-2 font-head text-[clamp(2.15rem,5vw,4.9rem)] uppercase leading-[0.96] tracking-tight text-[#FAFAFA]">
            One House. Choose Its Next Chapter.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#C8C7C1] sm:text-sm">
            Select a service to see its own transformation, then explore the full service page.
          </p>
        </div>

        <div className="services-spacer-v2 min-h-[34svh] flex-1 sm:min-h-[38svh] md:min-h-0" aria-hidden="true" />

        <div className="pointer-events-auto mx-auto grid w-full max-w-6xl grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {SERVICES_V3.map((service) => (
            <ServiceControl
              key={service.slug}
              service={service}
              selected={selected?.slug === service.slug}
              disabled={Boolean(selected)}
              onPick={pick}
            />
          ))}
        </div>

        <div className="mt-3 min-h-9 text-center" aria-live="polite">
          {selected ? (
            <div data-testid="preview-progress-v4" className="pointer-events-auto mx-auto w-full max-w-sm">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#EEEDE9]">
                {phaseLabel(selected, progress)}
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
              Each selection previews its own service on larger screens and opens directly on performance-limited devices.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
