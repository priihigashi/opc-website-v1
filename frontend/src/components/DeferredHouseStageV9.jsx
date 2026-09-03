import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import ResponsiveImageV1 from "@/components/ResponsiveImageV1";
import HouseStageBoundaryV1 from "@/components/HouseStageBoundaryV1";
import { shouldUseStaticHouse as staticHousePolicy, setHouseStageFailed } from "@/lib/houseRenderPolicy";
import { useHouseStageRegistration } from "@/lib/useHouseStageRegistration";

const HomeHouse = lazy(() => import("@/three/HouseSceneV32"));
const ServicesHouse = lazy(() => import("@/pages/ServicesSceneV5"));
export const shouldUseStaticHouse = staticHousePolicy;
const FIRST_FRAME_FAILSAFE_MS = 4000;
const isRevealed = (ready, failed) => ready && !failed;
const staticReason = (staticOnly, failed) => staticOnly ? "prefers-static" : failed ? "webgl-failed" : "backdrop-only";
const fallbackCompositionFor = (scene) => scene === "home"
  ? "max-md:-translate-y-[16svh] max-md:scale-[0.62] md:translate-x-[14%] md:translate-y-[4%] md:scale-[0.56]"
  : "max-md:translate-y-[6svh] max-md:scale-[0.82] md:translate-x-[14%] md:translate-y-[4%] md:scale-[0.56]";

// V9 preserves V8 lifecycle/fallback/Services behavior and routes only the home scene through V32.
export default function DeferredHouseStageV9({ scene = "home" }) {
  const [staticOnly] = useState(shouldUseStaticHouse);
  const [interactiveReady, setInteractiveReady] = useState(false);
  const [interactiveFailed, setInteractiveFailed] = useState(false);
  const stageIdRef = useHouseStageRegistration({ staticOnly, ready: interactiveReady, failed: interactiveFailed });
  const failInteractive = useCallback(() => setInteractiveFailed(true), []);
  const ownFramesRef = useRef(0);
  const noteOwnFrame = useCallback(() => { ownFramesRef.current += 1; }, []);
  useEffect(() => {
    if (staticOnly || interactiveFailed) return undefined;
    ownFramesRef.current = 0; let animationFrame; let settled = false;
    const failsafe = window.setTimeout(() => { if (settled) return; settled = true; window.cancelAnimationFrame(animationFrame); setInteractiveFailed(true); if (stageIdRef.current) setHouseStageFailed(stageIdRef.current, true); }, FIRST_FRAME_FAILSAFE_MS);
    const confirmRenderedScene = () => { if (ownFramesRef.current >= 2) { settled = true; window.clearTimeout(failsafe); setInteractiveReady(true); return; } animationFrame = window.requestAnimationFrame(confirmRenderedScene); };
    animationFrame = window.requestAnimationFrame(confirmRenderedScene);
    return () => { settled = true; window.cancelAnimationFrame(animationFrame); window.clearTimeout(failsafe); };
  }, [staticOnly, interactiveFailed, stageIdRef]);
  const Scene = scene === "services" ? ServicesHouse : HomeHouse;
  const showStatic = staticOnly || interactiveFailed;
  const fallbackComposition = fallbackCompositionFor(scene);
  return (
    <>
      <div className={`fixed inset-0 z-0 overflow-hidden bg-[#09090B] transition-opacity duration-200 ${isRevealed(interactiveReady, interactiveFailed) ? "opacity-0" : "opacity-100"}`} aria-hidden data-testid="house-static-fallback-v4" data-static-reason={staticReason(staticOnly, interactiveFailed)}>
        {showStatic ? <ResponsiveImageV1 src="/images/opc/house-static-fallback-v1.jpg" alt="" sizes="100vw" width="1600" height="900" fetchPriority="high" className={`h-full w-full object-contain object-center [mask-image:radial-gradient(ellipse_62%_58%_at_center,black_58%,transparent_92%)] ${fallbackComposition}`} /> : null}
      </div>
      {!showStatic ? <div className={`fixed inset-0 z-0 transition-opacity duration-200 ${isRevealed(interactiveReady, interactiveFailed) ? "opacity-100" : "opacity-0"}`} data-testid="house-interactive-gate-v4"><HouseStageBoundaryV1 onFailure={failInteractive}><Suspense fallback={null}><Scene onFrame={noteOwnFrame} /></Suspense></HouseStageBoundaryV1></div> : null}
    </>
  );
}
