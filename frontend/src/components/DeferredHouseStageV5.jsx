import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import ResponsiveImageV1 from "@/components/ResponsiveImageV1";
import HouseStageBoundaryV1 from "@/components/HouseStageBoundaryV1";
import { shouldUseStaticHouse as staticHousePolicy, setHouseStageFailed } from "@/lib/houseRenderPolicy";
import { useHouseStageRegistration } from "@/lib/useHouseStageRegistration";

const HomeHouse = lazy(() => import("@/three/HouseSceneV27"));
const ServicesHouse = lazy(() => import("@/pages/ServicesSceneV5"));

// T-273: the policy now lives in @/lib/houseRenderPolicy (non-versioned, so it
// cannot go stale). Re-exported here only so existing importers keep working;
// new code must import from the policy module directly.
export const shouldUseStaticHouse = staticHousePolicy;

// T-234/T-261 spec: if the 3D cannot produce a usable frame within ~4 seconds,
// fall back to the static hero. On the normal path the photograph is never even
// mounted, so a healthy device never requests it.
const FIRST_FRAME_FAILSAFE_MS = 4000;

// A scene that fails AFTER becoming ready used to leave a BLANK stage: the canvas
// was unmounted while the fallback parent stayed at opacity-0, because reveal was
// keyed on readiness alone. Reveal requires readiness AND no failure.
const isRevealed = (ready, failed) => ready && !failed;

/**
 * Normal path (working 3D):
 *   dark stage backdrop -> 3D mounts immediately (invisible) -> first REAL
 *   stable frame confirmed on two consecutive animation frames reported by THIS
 *   stage's own model through the onFrame prop -> reveal in 200ms.
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

  // Each mounted stage owns its OWN record. Two stages can overlap (AppV3 keeps
  // ServicesStageGate alive for 800ms after leaving /services while Landing mounts
  // another), so a single shared flag would let a departing stage clobber the
  // healthy one it left behind.
  const stageIdRef = useHouseStageRegistration({
    staticOnly,
    ready: interactiveReady,
    failed: interactiveFailed,
  });

  const failInteractive = useCallback(() => setInteractiveFailed(true), []);

  // Frames from THIS stage's own canvas. window.__dbg is a shared global and two
  // stages overlap by 800ms on a route change, so counting frames on it let a
  // departing stage certify a brand-new, still-suspended one as ready — which
  // revealed an empty canvas and cancelled its failsafe. Each stage now counts
  // only the frames its own model reports through onFrame.
  const ownFramesRef = useRef(0);
  const noteOwnFrame = useCallback(() => { ownFramesRef.current += 1; }, []);

  useEffect(() => {
    if (staticOnly || interactiveFailed) return undefined;

    ownFramesRef.current = 0;
    let animationFrame;
    let settled = false;

    const failsafe = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      window.cancelAnimationFrame(animationFrame);
      setInteractiveFailed(true); // static hero mounts; broken 3D never shows
      if (stageIdRef.current) setHouseStageFailed(stageIdRef.current, true);
    }, FIRST_FRAME_FAILSAFE_MS);

    const confirmRenderedScene = () => {
      // Two consecutive frames from our OWN model, exactly as before — only the
      // source of truth changed from the shared global to this instance.
      if (ownFramesRef.current >= 2) {
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
  }, [staticOnly, interactiveFailed, stageIdRef]);

  const Scene = scene === "services" ? ServicesHouse : HomeHouse;
  const showStatic = staticOnly || interactiveFailed;

  return (
    <>
      {/* Dark stage backdrop. The photograph exists ONLY on fallback paths. */}
      <div
        className={`fixed inset-0 z-0 overflow-hidden bg-[#09090B] transition-opacity duration-200 ${isRevealed(interactiveReady, interactiveFailed) ? "opacity-0" : "opacity-100"}`}
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
          className={`fixed inset-0 z-0 transition-opacity duration-200 ${isRevealed(interactiveReady, interactiveFailed) ? "opacity-100" : "opacity-0"}`}
          data-testid="house-interactive-gate-v4"
        >
          <HouseStageBoundaryV1 onFailure={failInteractive}>
            <Suspense fallback={null}><Scene onFrame={noteOwnFrame} /></Suspense>
          </HouseStageBoundaryV1>
        </div>
      ) : null}
    </>
  );
}
