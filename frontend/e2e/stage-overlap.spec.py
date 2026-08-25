"""
T-273 round-4 — the old-live / new-suspended stage overlap.

WHY: window.__dbg is a single global written by EVERY house model. AppV3 keeps
ServicesStageGate mounted for 800ms after leaving /services while Landing mounts a
second stage. When readiness was counted on that global, the departing Services
canvas could certify the brand-new Home stage as ready before its own scene had
rendered — revealing an empty canvas and cancelling its failsafe.

This test forces the race by DELAYING the Home scene's lazy chunk, so the new stage
is genuinely suspended while the old one is still painting frames. The new stage must
stay covered (backdrop opaque, 3D layer hidden) until its OWN model reports frames.

Run: yarn test:e2e:stage   (needs the dev server on :3111 — it is deliberately NOT part of
     test:all, which must stay runnable with no server)

KNOWN LIMIT, recorded rather than hidden: this drives the browser's real frame loop, so it
proves the new stage stays covered until its OWN frames arrive, but it does not step the
two-frame threshold one frame at a time. Lowering that threshold from two frames to one would
still pass here. Closing that needs a test hook in production code; parked deliberately.
"""
import asyncio, sys
from playwright.async_api import async_playwright

URL = "http://localhost:3111"
CHUNK_DELAY_S = 2.5          # under the stage's own 4s failsafe on purpose

async def main():
    failures = []
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle", "--enable-unsafe-swiftshader"])
        pg = await (await b.new_context(viewport={"width": 1440, "height": 900})).new_page()
        errors = []
        pg.on("pageerror", lambda e: errors.append(str(e)))

        async def slow_home_chunk(route):
            if "HouseSceneV27" in route.request.url:
                await asyncio.sleep(CHUNK_DELAY_S)
            await route.continue_()
        await pg.route("**/*.js", slow_home_chunk)

        # 1. land directly on /services and let that stage become live
        await pg.goto(f"{URL}/services", wait_until="domcontentloaded")
        await pg.wait_for_timeout(7000)

        async def stage_state():
            # During the 800ms overlap BOTH stages are in the DOM, so opacity alone
            # cannot tell "the old stage is still painting" from "the new stage has
            # falsely revealed itself". The distinguishing fact is whether a REVEALED
            # 3D layer actually contains a canvas: a stage that certified itself on a
            # foreign frame reveals a gate whose Suspense fallback is still null.
            return await pg.evaluate("""() => {
              const gates = [...document.querySelectorAll('[data-testid="house-interactive-gate-v4"]')];
              const backs = [...document.querySelectorAll('[data-testid="house-static-fallback-v4"]')];
              return {
                stages: backs.length,
                gates: gates.map((g) => ({
                  opacity: getComputedStyle(g).opacity,
                  hasCanvas: !!g.querySelector('canvas'),
                })),
                backdrops: backs.map((b) => getComputedStyle(b).opacity),
              };
            }""")

        # 2. navigate Home; the Home scene chunk is now artificially slow
        await pg.click('[data-testid="site-nav"] >> text=HOME', timeout=8000)

        # 3. while the new stage is suspended it must stay COVERED
        for step in range(1, 5):
            await pg.wait_for_timeout(450)
            st = await stage_state()
            t = step * 0.45
            empty_reveals = [g for g in st["gates"] if g["opacity"] == "1" and not g["hasCanvas"]]
            all_hidden = st["gates"] and all(g["opacity"] == "0" for g in st["gates"]) \
                and all(b == "0" for b in st["backdrops"])
            print(f"  suspended t~{t:.2f}s  stages={st['stages']}  "
                  f"gates={[(g['opacity'], 'canvas' if g['hasCanvas'] else 'EMPTY') for g in st['gates']]}  "
                  f"backdrops={st['backdrops']}")
            if empty_reveals:
                failures.append(
                    f"t~{t:.2f}s FALSE REVEAL: a 3D layer is fully visible with no canvas inside — "
                    f"the stage certified itself on another stage's frames")
            # The NEW stage is last in DOM order. While its scene is suspended it must
            # be covered: gate hidden, backdrop opaque. Checked on that stage alone, so
            # a legitimately painting OLD stage cannot mask a false reveal on the new one.
            if st["gates"]:
                newest_gate = st["gates"][-1]
                newest_backdrop = st["backdrops"][-1] if st["backdrops"] else None
                if not newest_gate["hasCanvas"]:
                    if newest_gate["opacity"] != "0":
                        failures.append(
                            f"t~{t:.2f}s the suspended new stage revealed its gate (opacity "
                            f"{newest_gate['opacity']}) before its own canvas existed")
                    if newest_backdrop != "1":
                        failures.append(
                            f"t~{t:.2f}s the suspended new stage was not covered "
                            f"(backdrop opacity {newest_backdrop})")
            if all_hidden:
                failures.append(f"t~{t:.2f}s blank stage: every layer hidden")

        # 4. once its own frames arrive it must reveal normally
        await pg.wait_for_timeout(6000)
        st = await stage_state()
        print(f"  settled           stages={st['stages']}  "
              f"gates={[(g['opacity'], 'canvas' if g['hasCanvas'] else 'EMPTY') for g in st['gates']]}  "
              f"backdrops={st['backdrops']}")
        # The NEW stage is the last one in DOM order. Assert on IT, not on "any stage".
        if st["stages"] != 1:
            failures.append(f"expected exactly one stage after the overlap window, saw {st['stages']}")
        new_gate = st["gates"][-1] if st["gates"] else None
        new_backdrop = st["backdrops"][-1] if st["backdrops"] else None
        if not new_gate or new_gate["opacity"] != "1" or not new_gate["hasCanvas"]:
            # A static-photograph outcome MUST fail here: the point of this test is
            # that the new stage came good on its OWN frames, not that it survived by
            # falling back to the photo.
            failures.append(
                f"the new stage did not reveal its own canvas after settling "
                f"(gate={new_gate}, backdrop={new_backdrop}) — a fallback-photo outcome is a FAILURE here")
        if new_backdrop != "0":
            failures.append(f"the new stage's backdrop should be hidden once its canvas is live, got {new_backdrop}")
        if errors:
            failures.append(f"page errors: {errors}")
        await b.close()

    if failures:
        print("\nFAIL")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("\nPASS — the suspended stage stayed covered and revealed only on its own frames")

asyncio.run(main())
