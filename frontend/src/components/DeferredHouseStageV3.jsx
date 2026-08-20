import { lazy, Suspense, useEffect, useState } from "react";
import ResponsiveImageV1 from "@/components/ResponsiveImageV1";

const HomeHouse = lazy(() => import("@/three/HouseSceneV24"));
const ServicesHouse = lazy(() => import("@/pages/ServicesSceneV5"));

export const shouldUseStaticHouse = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || window.matchMedia("(max-width: 767px)").matches
    || connection?.saveData
    || ["slow-2g", "2g"].includes(connection?.effectiveType);
};

export default function DeferredHouseStageV3({ scene = "home" }) {
  const [staticOnly] = useState(shouldUseStaticHouse);
  const [showInteractive, setShowInteractive] = useState(false);
  const [interactiveReady, setInteractiveReady] = useState(false);

  useEffect(() => {
    if (staticOnly) return undefined;

    const startedAt = performance.now();
    let idleId;
    let mountTimer;
    let readyTimer;

    const reveal = () => {
      const mount = () => {
        const introRemaining = Math.max(0, 2450 - (performance.now() - startedAt));
        mountTimer = window.setTimeout(() => {
          setShowInteractive(true);
          readyTimer = window.setTimeout(() => setInteractiveReady(true), 500);
        }, introRemaining);
      };

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(mount, { timeout: 1200 });
      } else {
        idleId = window.setTimeout(mount, 450);
      }
    };

    if (document.readyState === "complete") reveal();
    else window.addEventListener("load", reveal, { once: true });

    return () => {
      window.removeEventListener("load", reveal);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      window.clearTimeout(mountTimer);
      window.clearTimeout(readyTimer);
    };
  }, [staticOnly]);

  const Scene = scene === "services" ? ServicesHouse : HomeHouse;

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#09090B]" aria-hidden data-testid="house-static-fallback-v3">
        {staticOnly ? (
          <ResponsiveImageV1
            src="/images/opc/house-static-fallback-v1.jpg"
            alt=""
            sizes="100vw"
            width="1600"
            height="900"
            fetchPriority="high"
            className="h-full w-full object-contain object-center"
          />
        ) : null}
      </div>
      {showInteractive ? (
        <div
          className={`fixed inset-0 z-0 transition-opacity duration-700 ${interactiveReady ? "opacity-100" : "opacity-0"}`}
          data-testid="house-interactive-gate-v3"
        >
          <Suspense fallback={null}><Scene /></Suspense>
        </div>
      ) : null}
    </>
  );
}
