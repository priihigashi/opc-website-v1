import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HouseSceneV20 from "@/three/HouseSceneV20";
import { scrollStore } from "@/lib/scrollStore";
import { SERVICES_V2_BY_SLUG, SERVICES_V2_RESTING_PROGRESS } from "./servicesDataV2";

export default function ServicesSceneV2() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollStore.intro = 1;
    const slug = pathname.split("/")[2];
    const service = SERVICES_V2_BY_SLUG[slug];

    if (service) {
      scrollStore.p = service.target;
      return;
    }

    scrollStore.p = SERVICES_V2_RESTING_PROGRESS;
  }, [pathname]);

  return (
    <div data-testid="services-scene-v2">
      <HouseSceneV20 />
    </div>
  );
}
