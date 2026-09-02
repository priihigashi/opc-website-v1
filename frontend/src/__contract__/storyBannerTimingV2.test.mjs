import assert from "node:assert/strict";
import test from "node:test";
import { HOME_STORY_BANNER_TIMELINE_V1 } from "../lib/homeStoryBannerTimelineV1.mjs";
import { HOME_STORY_BANNER_TIMELINE_V2 } from "../lib/homeStoryBannerTimelineV2.mjs";

test("V2 advances only banner focus by the reversible 0.0125 timeline step", () => {
  HOME_STORY_BANNER_TIMELINE_V2.forEach((timing, index) => {
    const previous = HOME_STORY_BANNER_TIMELINE_V1[index];
    assert.equal(timing.id, previous.id);
    assert.equal(timing.side, previous.side);
    assert.equal(timing.start, previous.start);
    assert.equal(timing.end, previous.end);
    assert.ok(Math.abs((previous.focus - timing.focus) - 0.0125) < Number.EPSILON);
  });
});

test("V2 focus remains after each completed house state and before retraction", () => {
  const semanticPlateaus = [
    { ready: 0.185, retract: 0.262 },
    { ready: 0.360, retract: 0.415 },
    { ready: 0.500, retract: 0.575 },
    { ready: 0.690, retract: 0.747 },
    { ready: 0.855, retract: 0.912 },
  ];
  HOME_STORY_BANNER_TIMELINE_V2.forEach((timing, index) => {
    assert.ok(timing.focus >= semanticPlateaus[index].ready);
    assert.ok(timing.focus < semanticPlateaus[index].retract);
    assert.ok(timing.end < semanticPlateaus[index].retract);
  });
});

