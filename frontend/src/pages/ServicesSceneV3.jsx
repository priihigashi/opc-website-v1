import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HouseSceneV22 from "@/three/HouseSceneV22";
import { scrollStore } from "@/lib/scrollStore";
import { SERVICES_V3_BY_SLUG, SERVICES_V3_RESTING_PROGRESS } from "./servicesDataV3";
import { servicesPreviewStoreV3 as previewStore } from "./servicesPreviewStoreV3";

export default function ServicesSceneV3() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollStore.intro = 1;
    const slug = pathname.split("/")[2];
    const service = SERVICES_V3_BY_SLUG[slug];

    if (service) {
      scrollStore.p = service.target;
      previewStore.active = service.slug;
      previewStore.kind = service.kind;
      previewStore.t = 1;
      return;
    }

    scrollStore.p = SERVICES_V3_RESTING_PROGRESS;
    previewStore.active = null;
    previewStore.kind = null;
    previewStore.t = 0;
  }, [pathname]);

  return (
    <div data-testid="services-scene-v3">
      <HouseSceneV22 />
    </div>
  );
}
