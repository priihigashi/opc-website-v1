import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import HouseLoadingIndicatorV1 from "@/components/HouseLoadingIndicatorV1";
import HouseStageBoundaryV1 from "@/components/HouseStageBoundaryV1";
import { shouldUseStaticHouse as staticHousePolicy } from "@/lib/houseRenderPolicy";
import { useHouseStageRegistration } from "@/lib/useHouseStageRegistration";

const HomeHouse = lazy(() => import("@/three/HouseSceneV34"));
const ServicesHouse = lazy(() => import("@/pages/ServicesSceneV5"));
export const shouldUseStaticHouse = staticHousePolicy;
const STARTUP_DELAY_MS = 5000;
const isRevealed = (ready, failed) => ready && !failed;

function LightweightHouseV1({ failed, isHome, showRecovery }) {
  return (
    <div
      className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-[#09090B]"
      data-testid="house-lightweight-view-v1"
      data-static-reason={failed ? "webgl-failed" : "prefers-static"}
    >
      <img
        src="/images/opc/house-static-fallback-mobile-v2.png"
        alt=""
        width="1116"
        height="614"
        className="h-auto w-[min(78vw,46rem)] object-contain opacity-80 [mask-image:radial-gradient(ellipse_72%_68%_at_center,black_56%,transparent_100%)]"
      />
      {failed && isHome && showRecovery ? (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="absolute left-1/2 top-[66%] z-20 min-h-11 w-[min(82vw,22rem)] -translate-x-1/2 rounded-full px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D5D800]"
          aria-label="Try refreshing the page for the interactive house"
          data-testid="house-refresh-control-v1"
        >
          Try refreshing for the interactive house ↻
        </button>
      ) : null}
    </div>
  );
}

// V12 preserves V11 as rollback. Pending and delayed startup show only a discreet
// loader; the contained house is mounted solely for static preference or real failure.
export default function DeferredHouseStageV12({ scene = "home" }) {
  const [staticOnly] = useState(shouldUseStaticHouse);
  const [interactiveReady, setInteractiveReady] = useState(false);
  const [interactiveFailed, setInteractiveFailed] = useState(false);
  const [startupDelayed, setStartupDelayed] = useState(false);
  const [recoveryPromptInHero, setRecoveryPromptInHero] = useState(true);
  useHouseStageRegistration({ staticOnly, ready: interactiveReady, failed: interactiveFailed });
  const failInteractive = useCallback(() => setInteractiveFailed(true), []);
  const ownFramesRef = useRef(0);
  const noteOwnFrame = useCallback(() => { ownFramesRef.current += 1; }, []);

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
  const isHome = scene === "home";
  const showLightweight = staticOnly || interactiveFailed;

  return (
    <>
      {!interactiveReady && !showLightweight ? <HouseLoadingIndicatorV1 delayed={startupDelayed} /> : null}
      {showLightweight ? <LightweightHouseV1 failed={interactiveFailed} isHome={isHome} showRecovery={recoveryPromptInHero} /> : null}
      {!staticOnly && !interactiveFailed ? (
        <div
          className={`fixed inset-0 z-0 transition-opacity duration-200 ${isRevealed(interactiveReady, interactiveFailed) ? "opacity-100" : "pointer-events-none opacity-0"}`}
          data-testid="house-interactive-gate-v6"
        >
          <HouseStageBoundaryV1 onFailure={failInteractive}>
            <Suspense fallback={null}><Scene onFrame={noteOwnFrame} onContextLost={failInteractive} /></Suspense>
          </HouseStageBoundaryV1>
        </div>
      ) : null}
    </>
  );
}
