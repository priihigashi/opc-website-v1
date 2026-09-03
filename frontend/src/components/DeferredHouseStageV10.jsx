import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import ResponsiveImageV1 from "@/components/ResponsiveImageV1";
import HouseStageBoundaryV1 from "@/components/HouseStageBoundaryV1";
import { shouldUseStaticHouse as staticHousePolicy } from "@/lib/houseRenderPolicy";
import { useHouseStageRegistration } from "@/lib/useHouseStageRegistration";

const HomeHouse = lazy(() => import("@/three/HouseSceneV33"));
const ServicesHouse = lazy(() => import("@/pages/ServicesSceneV5"));
export const shouldUseStaticHouse = staticHousePolicy;
const STARTUP_DELAY_MS = 4000;
const isRevealed = (ready, failed) => ready && !failed;
const staticReason = (staticOnly, failed, delayed) => staticOnly
  ? "prefers-static"
  : failed
    ? "webgl-failed"
    : delayed
      ? "startup-delayed"
      : "loading";
const desktopFallbackCompositionFor = (scene) => scene === "home"
  ? "md:translate-x-[14%] md:translate-y-[4%] md:scale-[0.56]"
  : "max-md:translate-y-[6svh] max-md:scale-[0.82] md:translate-x-[14%] md:translate-y-[4%] md:scale-[0.56]";

// V10 preserves V9's scene/choreography and corrects only fallback reliability and presentation.
export default function DeferredHouseStageV10({ scene = "home" }) {
  const [staticOnly] = useState(shouldUseStaticHouse);
  const [isPhone, setIsPhone] = useState(() => window.innerWidth < 768);
  const [interactiveReady, setInteractiveReady] = useState(false);
  const [interactiveFailed, setInteractiveFailed] = useState(false);
  const [startupDelayed, setStartupDelayed] = useState(false);
  const [recoveryPromptInHero, setRecoveryPromptInHero] = useState(true);
  const stageIdRef = useHouseStageRegistration({ staticOnly, ready: interactiveReady, failed: interactiveFailed });
  const failInteractive = useCallback(() => setInteractiveFailed(true), []);
  const ownFramesRef = useRef(0);
  const noteOwnFrame = useCallback(() => { ownFramesRef.current += 1; }, []);

  useEffect(() => {
    const updateViewport = () => setIsPhone(window.innerWidth < 768);
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const updateRecoveryPrompt = () => setRecoveryPromptInHero(window.scrollY < window.innerHeight * 0.72);
    window.addEventListener("scroll", updateRecoveryPrompt, { passive: true });
    window.addEventListener("resize", updateRecoveryPrompt);
    updateRecoveryPrompt();
    return () => {
      window.removeEventListener("scroll", updateRecoveryPrompt);
      window.removeEventListener("resize", updateRecoveryPrompt);
    };
  }, []);

  useEffect(() => {
    if (staticOnly || interactiveFailed) return undefined;
    ownFramesRef.current = 0;
    let animationFrame;
    let settled = false;
    const delayMarker = window.setTimeout(() => {
      if (!settled) setStartupDelayed(true);
    }, STARTUP_DELAY_MS);
    const confirmRenderedScene = () => {
      if (ownFramesRef.current >= 2) {
        settled = true;
        window.clearTimeout(delayMarker);
        setStartupDelayed(false);
        setInteractiveReady(true);
        return;
      }
      animationFrame = window.requestAnimationFrame(confirmRenderedScene);
    };
    animationFrame = window.requestAnimationFrame(confirmRenderedScene);
    return () => {
      settled = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(delayMarker);
    };
  }, [staticOnly, interactiveFailed]);

  const Scene = scene === "services" ? ServicesHouse : HomeHouse;
  const showStatic = !interactiveReady || staticOnly || interactiveFailed;
  const isHome = scene === "home";
  const desktopFallbackComposition = desktopFallbackCompositionFor(scene);

  return (
    <>
      <div
        className={`fixed inset-0 z-0 overflow-hidden bg-[#09090B] transition-opacity duration-200 ${showStatic ? "opacity-100" : "pointer-events-none opacity-0"}`}
        data-testid="house-static-fallback-v5"
        data-static-reason={staticReason(staticOnly, interactiveFailed, startupDelayed)}
      >
        <div className="absolute inset-0" aria-hidden>
          {isHome && isPhone ? (
            <img
              src="/images/opc/house-static-fallback-mobile-v2.png"
              alt=""
              width="1116"
              height="614"
              fetchPriority="high"
              className="h-full w-full scale-90 object-contain object-center [mask-image:radial-gradient(ellipse_54%_45%_at_center,black_58%,transparent_100%)] md:hidden"
            />
          ) : null}
          {!isHome || !isPhone ? (
            <ResponsiveImageV1
              src="/images/opc/house-static-fallback-v1.jpg"
              alt=""
              sizes="100vw"
              width="1600"
              height="900"
              fetchPriority="high"
              className={`h-full w-full object-contain object-center [mask-image:radial-gradient(ellipse_72%_64%_at_center,black_62%,transparent_100%)] ${desktopFallbackComposition}`}
            />
          ) : null}
        </div>
      </div>
      {interactiveFailed && isHome && recoveryPromptInHero ? (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="fixed left-1/2 top-[59svh] z-20 min-h-11 w-[min(82vw,22rem)] -translate-x-1/2 rounded-full px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D5D800] md:top-[66vh]"
          aria-label="Try refreshing the page for the interactive house"
          data-testid="house-refresh-control-v1"
        >
          Try refreshing for the interactive house ↻
        </button>
      ) : null}
      {!staticOnly && !interactiveFailed ? (
        <div className={`fixed inset-0 z-0 transition-opacity duration-200 ${isRevealed(interactiveReady, interactiveFailed) ? "opacity-100" : "opacity-0"}`} data-testid="house-interactive-gate-v5">
          <HouseStageBoundaryV1 onFailure={failInteractive}>
            <Suspense fallback={null}><Scene onFrame={noteOwnFrame} onContextLost={failInteractive} /></Suspense>
          </HouseStageBoundaryV1>
        </div>
      ) : null}
    </>
  );
}
