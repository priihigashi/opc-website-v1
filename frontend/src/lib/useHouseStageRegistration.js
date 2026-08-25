import { useEffect, useRef, useState } from "react";
import {
  registerHouseStage,
  unregisterHouseStage,
  setHouseStageReady,
  setHouseStageFailed,
} from "@/lib/houseRenderPolicy";

/**
 * Publishes ONE mounted house stage's live state to the shared policy.
 *
 * REGISTRATION HAPPENS IN AN EFFECT, NEVER DURING RENDER. A render-phase call
 * mutates module state that React may then throw away: StrictMode's discarded
 * render would leave an orphan record that never receives cleanup, and an orphan
 * record stuck at pending stops the aggregate from ever reaching FAILED — so a
 * routed page would wait out its whole timeout on every click.
 *
 * Declared before the publishing effects so registration always runs first.
 */
export function useHouseStageRegistration({ staticOnly, ready, failed }) {
  const idRef = useRef(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const stageId = registerHouseStage();
    idRef.current = stageId;
    setId(stageId);
    return () => {
      unregisterHouseStage(stageId);
      idRef.current = null;
      setId(null);
    };
  }, []);

  useEffect(() => {
    if (idRef.current && staticOnly) setHouseStageFailed(idRef.current, true);
  }, [staticOnly, id]);

  useEffect(() => {
    if (!idRef.current) return;
    if (failed) setHouseStageFailed(idRef.current, true);
    else setHouseStageReady(idRef.current, ready);
  }, [ready, failed, id]);

  return idRef;
}
