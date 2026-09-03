import { HOME_STORY_BANNER_TIMELINE_V1 } from "./homeStoryBannerTimelineV1.mjs";

const FOCUS_ADVANCE = 0.0125;

// V2 preserves every start/end boundary and advances only the center arrival.
// This shortens the quiet rise by roughly 14–17% without changing section length,
// house choreography, banner travel, or the rollback-safe V1 timeline.
export const HOME_STORY_BANNER_TIMELINE_V2 = Object.freeze(
  HOME_STORY_BANNER_TIMELINE_V1.map((timing) => Object.freeze({
    ...timing,
    focus: timing.focus - FOCUS_ADVANCE,
  })),
);

