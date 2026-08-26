import assert from "node:assert/strict";
import test from "node:test";
import {
  HOME_STORY_BANNER_TIMELINE_V1,
  bannerTravelY,
  safeFocusCenter,
} from "../lib/homeStoryBannerTimelineV1.mjs";

test("banner lanes remain right, left, right, left, right", () => {
  assert.deepEqual(HOME_STORY_BANNER_TIMELINE_V1.map(({ side }) => side), ["right", "left", "right", "left", "right"]);
});

test("every banner starts below, is fully focused, and exits above", () => {
  const viewportHeight = 900;
  const panelHeight = 480;
  const focusCenter = safeFocusCenter(viewportHeight, panelHeight, false);

  for (const timing of HOME_STORY_BANNER_TIMELINE_V1) {
    assert.ok(bannerTravelY(timing.start, timing, viewportHeight, panelHeight, focusCenter) > viewportHeight);
    assert.equal(bannerTravelY(timing.focus, timing, viewportHeight, panelHeight, focusCenter), focusCenter - panelHeight / 2);
    assert.ok(bannerTravelY(timing.end, timing, viewportHeight, panelHeight, focusCenter) < -panelHeight);
  }
});

test("travel is deterministic in either scroll direction", () => {
  for (const timing of HOME_STORY_BANNER_TIMELINE_V1) {
    const samples = [timing.start, (timing.start + timing.focus) / 2, timing.focus, (timing.focus + timing.end) / 2, timing.end];
    const forward = samples.map((progress) => bannerTravelY(progress, timing, 844, 410, 540));
    const reverse = [...samples].reverse().map((progress) => bannerTravelY(progress, timing, 844, 410, 540)).reverse();
    assert.deepEqual(forward, reverse);
  }
});

test("focus happens after each house stage is complete and exit precedes retraction", () => {
  const semanticPlateaus = [
    { ready: 0.185, retract: 0.262 },
    { ready: 0.360, retract: 0.415 },
    { ready: 0.500, retract: 0.575 },
    { ready: 0.690, retract: 0.747 },
    { ready: 0.855, retract: 0.912 },
  ];
  HOME_STORY_BANNER_TIMELINE_V1.forEach((timing, index) => {
    assert.ok(timing.focus >= semanticPlateaus[index].ready);
    assert.ok(timing.focus < semanticPlateaus[index].retract);
    assert.ok(timing.end < semanticPlateaus[index].retract);
  });
});

test("mobile focus stays inside the safe viewport when the panel fits", () => {
  const center = safeFocusCenter(844, 410, true);
  assert.ok(center - 205 >= 88);
  assert.ok(center + 205 <= 832);
});
