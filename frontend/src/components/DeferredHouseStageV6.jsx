import { lazy, Suspense, useEffect, useState } from "react";
import ResponsiveImageV1 from "@/components/ResponsiveImageV1";

const HomeHouse = lazy(() => import("@/three/HouseSceneV27"));
const ServicesHouse = lazy(() => import("@/pages/ServicesSceneV5"));

// If the scene has still not produced a rendered frame by this point, assume the
// interactive path is not going to arrive (WebGL unavailable, context lost, very slow
// device) and show the static house rather than leaving the visitor on empty ground.
const STATIC_FAILSAFE_MS = 4000;

export const shouldUseStaticHouse = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || connection?.saveData
    || ["slow-2g", "2g"].includes(connection?.effectiveType);
};

export default function DeferredHouseStageV6({ scene = "home" }) {
  const [staticOnly] = useState(shouldUseStaticHouse);
  const [interactiveReady, setInteractiveReady] = useState(false);
  const [failsafeStatic, setFailsafeStatic] = useState(false);

  useEffect(() => {
    if (staticOnly) return undefined;

    window.__dbg = undefined;
    let animationFrame;
    let cancelled = false;

    const failsafeTimer = window.setTimeout(() => {
      if (cancelled) return;
      setFailsafeStatic(true);
    }, STATIC_FAILSAFE_MS);

    // Only the real first rendered frame releases the loading state. V4 also required
    // scrollStore.intro >= 0.995, which is the 2400ms intro easing rather than a
    // readiness signal, so the static house was pinned on screen for ~2s on every load.
    const confirmRenderedScene = () => {
      if (cancelled) return;
      if (window.__dbg) {
        window.clearTimeout(failsafeTimer);
        setFailsafeStatic(false);
        setInteractiveReady(true);
        return;
      }
      animationFrame = window.requestAnimationFrame(confirmRenderedScene);
    };

    animationFrame = window.requestAnimationFrame(confirmRenderedScene);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafeTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [staticOnly]);

  const Scene = scene === "services" ? ServicesHouse : HomeHouse;
  const showStaticHouse = staticOnly || failsafeStatic;

  return (
    <>
      <div
        className={`fixed inset-0 z-0 overflow-hidden bg-[#09090B] transition-opacity duration-700 ${interactiveReady ? "opacity-0" : "opacity-100"}`}
        aria-hidden
        data-testid="house-static-fallback-v6"
        data-static-house={showStaticHouse ? "true" : "false"}
      >
        {showStaticHouse ? (
          <ResponsiveImageV1
            src="/images/opc/house-static-fallback-v1.jpg"
            alt=""
            sizes="100vw"
            width="1600"
            height="900"
            fetchPriority={staticOnly ? "high" : "low"}
            className="h-full w-full object-contain object-center max-md:translate-x-[2%] max-md:-translate-y-[3svh] max-md:scale-[1.16]"
          />
        ) : null}
      </div>
      {!staticOnly ? (
        <div
          className={`fixed inset-0 z-0 transition-opacity duration-700 ${interactiveReady ? "opacity-100" : "opacity-0"}`}
          data-testid="house-interactive-gate-v6"
        >
          <Suspense fallback={null}><Scene /></Suspense>
        </div>
      ) : null}
    </>
  );
}
