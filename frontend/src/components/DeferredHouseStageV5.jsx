import { lazy, Suspense, useCallback, useEffect, useState } from "react";
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

// T-234/T-261 spec: if the 3D cannot produce a usable frame within ~4 seconds,
// fall back to the static hero. On the normal path the photograph is never even
// mounted, so a healthy device never requests it.
const FIRST_FRAME_FAILSAFE_MS = 4000;

/**
 * Normal path (working 3D):
 *   dark stage backdrop -> 3D mounts immediately (invisible) -> first REAL
 *   stable frame confirmed on two consecutive animation frames (window.__dbg is
 *   written from inside the house model's useFrame) -> reveal in 200ms.
 *   No static house photograph is mounted or requested on this path.
 *
 * Static photograph mounts ONLY for: prefers-reduced-motion, Save-Data,
 * 2g/slow-2g, a WebGL/scene error (boundary onFailure), or the 4s no-frame
 * failsafe. The photo is object-contain (never clipped) and composed at the
 * live-hero scale/position instead of the old 116% zoomed crop.
 */
export default function DeferredHouseStageV5({ scene = "home" }) {
  const [staticOnly] = useState(shouldUseStaticHouse);
  const [interactiveReady, setInteractiveReady] = useState(false);
  const [interactiveFailed, setInteractiveFailed] = useState(false);
  const failInteractive = useCallback(() => setInteractiveFailed(true), []);

  useEffect(() => {
    if (staticOnly || interactiveFailed) return undefined;

    window.__dbg = undefined;
    let animationFrame;
    let confirmedFrames = 0;
    let settled = false;

    const failsafe = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      window.cancelAnimationFrame(animationFrame);
      setInteractiveFailed(true); // static hero mounts; broken 3D never shows
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
  }, [staticOnly, interactiveFailed]);

  const Scene = scene === "services" ? ServicesHouse : HomeHouse;
  const showStatic = staticOnly || interactiveFailed;

  return (
    <>
      {/* Dark stage backdrop. The photograph exists ONLY on fallback paths. */}
      <div
        className={`fixed inset-0 z-0 overflow-hidden bg-[#09090B] transition-opacity duration-200 ${interactiveReady ? "opacity-0" : "opacity-100"}`}
        aria-hidden
        data-testid="house-static-fallback-v4"
        data-static-reason={staticOnly ? "prefers-static" : interactiveFailed ? "webgl-failed" : "backdrop-only"}
      >
        {showStatic ? (
          <ResponsiveImageV1
            src="/images/opc/house-static-fallback-v1.jpg"
            alt=""
            sizes="100vw"
            width="1600"
            height="900"
            fetchPriority="high"
            className="h-full w-full object-contain object-center [mask-image:radial-gradient(ellipse_62%_58%_at_center,black_58%,transparent_92%)] max-md:translate-y-[6svh] max-md:scale-[0.82] md:translate-x-[14%] md:translate-y-[4%] md:scale-[0.56]"
          />
        ) : null}
      </div>
      {!showStatic ? (
        <div
          className={`fixed inset-0 z-0 transition-opacity duration-200 ${interactiveReady ? "opacity-100" : "opacity-0"}`}
          data-testid="house-interactive-gate-v4"
        >
          <HouseStageBoundaryV1 onFailure={failInteractive}>
            <Suspense fallback={null}><Scene /></Suspense>
          </HouseStageBoundaryV1>
        </div>
      ) : null}
    </>
  );
}
