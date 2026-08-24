import { lazy, Suspense, useEffect, useState } from "react";
import ResponsiveImageV1 from "@/components/ResponsiveImageV1";
import HouseStageBoundaryV1 from "@/components/HouseStageBoundaryV1";

const HomeHouse = lazy(() => import("@/three/HouseSceneV27"));
const ServicesHouse = lazy(() => import("@/pages/ServicesSceneV5"));

export const shouldUseStaticHouse = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || connection?.saveData
    || ["slow-2g", "2g"].includes(connection?.effectiveType);
};

// How long the interactive scene may stay mounted-but-unconfirmed before we
// declare 3D failed and keep the verified static hero. Generous enough for a
// slow chunk download; slow-2g/2g/save-data clients never mount 3D at all.
const FIRST_FRAME_FAILSAFE_MS = 15000;

export default function DeferredHouseStageV5({ scene = "home" }) {
  const [staticOnly] = useState(shouldUseStaticHouse);
  const [interactiveReady, setInteractiveReady] = useState(false);
  const [interactiveFailed, setInteractiveFailed] = useState(false);

  useEffect(() => {
    if (staticOnly) return undefined;

    // First-real-render-frame gate (reviewed P-1 approach): the house model
    // publishes window.__dbg from inside its useFrame loop, so __dbg only
    // exists after the renderer has actually drawn the model. We require two
    // confirmations on separate animation frames so a presented frame is on
    // screen before the static cover fades — no intro timer may mask the
    // first seconds where a real 3D glitch would appear.
    window.__dbg = undefined;
    let animationFrame;
    let confirmedFrames = 0;
    let settled = false;

    const failsafe = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      window.cancelAnimationFrame(animationFrame);
      setInteractiveFailed(true); // static hero stays; broken 3D never shows
    }, FIRST_FRAME_FAILSAFE_MS);

    const confirmRenderedScene = () => {
      if (window.__dbg) confirmedFrames += 1;
      if (confirmedFrames >= 2) {
        settled = true;
        window.clearTimeout(failsafe);
        setInteractiveReady(true);
        return;
      }
      animationFrame = window.requestAnimationFrame(confirmRenderedScene);
    };

    animationFrame = window.requestAnimationFrame(confirmRenderedScene);
    return () => {
      settled = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(failsafe);
    };
  }, [staticOnly]);

  const Scene = scene === "services" ? ServicesHouse : HomeHouse;

  return (
    <>
      <div
        className={`fixed inset-0 z-0 overflow-hidden bg-[#09090B] transition-opacity duration-700 ${interactiveReady ? "opacity-0" : "opacity-100"}`}
        aria-hidden
        data-testid="house-static-fallback-v4"
      >
        <ResponsiveImageV1
          src="/images/opc/house-static-fallback-v1.jpg"
          alt=""
          sizes="100vw"
          width="1600"
          height="900"
          fetchPriority="high"
          className="h-full w-full object-contain object-center max-md:translate-x-[2%] max-md:-translate-y-[3svh] max-md:scale-[1.16]"
        />
      </div>
      {!staticOnly && !interactiveFailed ? (
        <div
          className={`fixed inset-0 z-0 transition-opacity duration-700 ${interactiveReady ? "opacity-100" : "opacity-0"}`}
          data-testid="house-interactive-gate-v4"
        >
          <HouseStageBoundaryV1>
            <Suspense fallback={null}><Scene /></Suspense>
          </HouseStageBoundaryV1>
        </div>
      ) : null}
    </>
  );
}
