import { lazy, Suspense, useEffect, useState } from "react";
import ResponsiveImageV1 from "@/components/ResponsiveImageV1";
import HouseStageBoundaryV1 from "@/components/HouseStageBoundaryV1";
import { scrollStore } from "@/lib/scrollStore";

const HomeHouse = lazy(() => import("@/three/HouseSceneV27"));
const ServicesHouse = lazy(() => import("@/pages/ServicesSceneV5"));

export const shouldUseStaticHouse = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || connection?.saveData
    || ["slow-2g", "2g"].includes(connection?.effectiveType);
};

export default function DeferredHouseStageV5({ scene = "home" }) {
  const [staticOnly] = useState(shouldUseStaticHouse);
  const [interactiveReady, setInteractiveReady] = useState(false);

  useEffect(() => {
    if (staticOnly) return undefined;

    window.__dbg = undefined;
    let animationFrame;

    const confirmRenderedScene = () => {
      if (window.__dbg && scrollStore.intro >= 0.995) {
        setInteractiveReady(true);
        return;
      }
      animationFrame = window.requestAnimationFrame(confirmRenderedScene);
    };

    animationFrame = window.requestAnimationFrame(confirmRenderedScene);
    return () => window.cancelAnimationFrame(animationFrame);
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
      {!staticOnly ? (
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
