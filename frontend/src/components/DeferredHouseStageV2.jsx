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

export default function DeferredHouseStageV2({ scene = "home" }) {
  const [showInteractive, setShowInteractive] = useState(false);

  useEffect(() => {
    if (shouldUseStaticHouse()) return undefined;

    let idleId;
    const reveal = () => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(() => setShowInteractive(true), { timeout: 1200 });
      else idleId = window.setTimeout(() => setShowInteractive(true), 450);
    };

    if (document.readyState === "complete") reveal();
    else window.addEventListener("load", reveal, { once: true });

    return () => {
      window.removeEventListener("load", reveal);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, []);

  const Scene = scene === "services" ? ServicesHouse : HomeHouse;

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#09090B]" aria-hidden data-testid="house-static-fallback-v2">
        <ResponsiveImageV1
          src="/images/opc/house-static-fallback-v1.jpg"
          alt=""
          sizes="100vw"
          width="1600"
          height="900"
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
      </div>
      {showInteractive ? <Suspense fallback={null}><Scene /></Suspense> : null}
    </>
  );
}
