"""Browser contract for the versioned home story banner candidate.

Run with the local development server on PORT (default 4173):
    python3 e2e/story-banner.spec.py
"""
import asyncio
import json
import os
import sys
from playwright.async_api import async_playwright

URL = os.environ.get("OPC_BANNER_TEST_URL", "http://127.0.0.1:4173")
OUT = os.environ.get("OPC_BANNER_TEST_OUT", "../.artifacts/banner-verify")
VIEWPORTS = [
    (320, 568), (360, 800), (390, 844), (430, 932),
    (768, 1024), (820, 1180), (1024, 768), (1099, 800), (1100, 800),
    (1366, 768), (1440, 900), (1726, 650), (1920, 1080), (2560, 1440),
]
if os.environ.get("OPC_BANNER_TEST_QUICK") == "1":
    quick_width, quick_height = os.environ.get("OPC_BANNER_TEST_QUICK_VIEWPORT", "390x844").split("x")
    VIEWPORTS = [(int(quick_width), int(quick_height))]
TIMINGS = [
    ("ch-01", "right", 0.145, 0.2200, 0.255),
    ("ch-02", "left", 0.300, 0.3875, 0.407),
    ("ch-03", "right", 0.455, 0.5375, 0.565),
    ("ch-04", "left", 0.630, 0.7175, 0.737),
    ("ch-05", "right", 0.800, 0.8825, 0.902),
]

async def scroll_to_progress(page, progress):
    await page.evaluate("""p => {
      const story = document.querySelector('[data-testid="story"]');
      const top = story.getBoundingClientRect().top + window.scrollY;
      const total = story.getBoundingClientRect().height - window.innerHeight;
      window.scrollTo(0, top + total * p);
    }""", progress)
    await page.wait_for_timeout(800)

async def panel_metric(page, panel_id):
    return await page.evaluate("""id => {
      const panel = document.querySelector(`[data-testid="${id}-panel"]`);
      if (!panel) return null;
      const nav = document.querySelector('[data-testid="site-nav"]');
      const r = panel.getBoundingClientRect();
      const n = nav.getBoundingClientRect();
      const link = panel.querySelector('a');
      return {
        id, top:r.top, bottom:r.bottom, left:r.left, right:r.right,
        width:r.width, height:r.height, navBottom:n.bottom,
        progress:Number(panel.dataset.storyProgress),
        travelY:Number(panel.dataset.travelY),
        ariaHidden:panel.getAttribute('aria-hidden'),
        linkTabIndex:link ? link.tabIndex : null,
        overflow:document.documentElement.scrollWidth - innerWidth,
      };
    }""", panel_id)

async def main():
    os.makedirs(OUT, exist_ok=True)
    failures, focus_rows, journey_rows, reverse_rows, cue_rows = [], [], [], [], []
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=["--use-gl=angle", "--enable-unsafe-swiftshader"])
        for width, height in VIEWPORTS:
            context = await browser.new_context(viewport={"width": width, "height": height}, device_scale_factor=1)
            page = await context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            await page.goto(URL, wait_until="domcontentloaded")
            await page.wait_for_timeout(4500)

            for panel_id, side, start, focus, end in TIMINGS:
                await scroll_to_progress(page, start + 0.0001)
                start_metric = await panel_metric(page, panel_id)
                await scroll_to_progress(page, focus)
                focus_metric = await panel_metric(page, panel_id)
                await scroll_to_progress(page, end - 0.0001)
                end_metric = await panel_metric(page, panel_id)
                journey_rows.append({"viewport": f"{width}x{height}", "id": panel_id, "start": start_metric, "end": end_metric})
                focus_rows.append({"viewport": f"{width}x{height}", **(focus_metric or {"id": panel_id})})

                if not start_metric or start_metric["top"] <= height:
                    failures.append(f"{width}x{height} {panel_id}: start is not below viewport")
                if not end_metric or end_metric["bottom"] >= 0:
                    failures.append(f"{width}x{height} {panel_id}: end is not above viewport")
                if not focus_metric:
                    failures.append(f"{width}x{height} {panel_id}: missing at focus")
                    continue
                if focus_metric["top"] < focus_metric["navBottom"] - 2 or focus_metric["bottom"] > height + 2:
                    failures.append(f"{width}x{height} {panel_id}: focus cropped or intersects nav")
                if focus_metric["overflow"] > 1:
                    failures.append(f"{width}x{height} {panel_id}: horizontal overflow")
                center = (focus_metric["left"] + focus_metric["right"]) / 2
                if width >= 768 and ((side == "right" and center <= width / 2) or (side == "left" and center >= width / 2)):
                    failures.append(f"{width}x{height} {panel_id}: wrong lane")
                if focus_metric["ariaHidden"] is not None or focus_metric["linkTabIndex"] != 0:
                    failures.append(f"{width}x{height} {panel_id}: readable panel not keyboard accessible")
                if start_metric["ariaHidden"] != "true" or start_metric["linkTabIndex"] != -1:
                    failures.append(f"{width}x{height} {panel_id}: offscreen start remains accessible")
                if end_metric["ariaHidden"] != "true" or end_metric["linkTabIndex"] != -1:
                    failures.append(f"{width}x{height} {panel_id}: offscreen end remains accessible")

            _, _, _, reverse_focus, _ = TIMINGS[2]
            await scroll_to_progress(page, reverse_focus + 0.015)
            await scroll_to_progress(page, reverse_focus)
            down = await panel_metric(page, "ch-03")
            await scroll_to_progress(page, reverse_focus - 0.015)
            await scroll_to_progress(page, reverse_focus)
            up = await panel_metric(page, "ch-03")
            delta = max(abs(down[key] - up[key]) for key in ("top", "left", "width", "height"))
            reverse_rows.append({"viewport": f"{width}x{height}", "deltaPx": delta, "down": down, "up": up})
            if delta > 2:
                failures.append(f"{width}x{height}: reverse drift {delta:.2f}px")

            await page.evaluate("window.scrollTo(0, 0)")
            await page.wait_for_timeout(400)
            cue_start = await page.locator('[data-testid="story-scroll-cue"]').get_attribute("data-visible")
            await page.evaluate("window.scrollTo(0, innerHeight * 2.1)")
            await page.wait_for_timeout(600)
            cue_end = await page.locator('[data-testid="story-scroll-cue"]').get_attribute("data-visible")
            cue_rows.append({"viewport": f"{width}x{height}", "fold0": cue_start, "afterFold2": cue_end})
            if cue_start != "true" or cue_end != "false":
                failures.append(f"{width}x{height}: cue states {cue_start}->{cue_end}")
            if errors:
                failures.append(f"{width}x{height}: page errors {errors}")

            if (width, height) in [(320, 568), (390, 844), (820, 1180), (1099, 800), (1100, 800), (1440, 900), (1726, 650)]:
                await scroll_to_progress(page, TIMINGS[0][3])
                await page.screenshot(path=f"{OUT}/{width}x{height}.png", full_page=False)
            await context.close()

        reduced_context = await browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        reduced_page = await reduced_context.new_page()
        await reduced_page.goto(URL, wait_until="domcontentloaded")
        await reduced_page.wait_for_timeout(1200)
        reduced = await reduced_page.evaluate("""() => ({
          railCount: document.querySelectorAll('[data-testid="story-banner-rail"]').length,
          panelCount: document.querySelectorAll('[data-testid$="-panel"]').length,
          animatedCue: document.querySelector('[data-testid="story-scroll-cue"] svg').className.baseVal.includes('animate-'),
          homeFallbackClass: document.querySelector('[data-testid="house-static-fallback-v4"] img')?.className || '',
        })""")
        if reduced["railCount"] != 0 or reduced["panelCount"] != 5 or reduced["animatedCue"]:
            failures.append(f"reduced motion contract failed: {reduced}")
        if "-translate-y-[16svh]" not in reduced["homeFallbackClass"]:
            failures.append("reduced-motion home fallback did not use candidate composition")
        await reduced_page.goto(f"{URL}/services", wait_until="domcontentloaded")
        await reduced_page.wait_for_timeout(1200)
        services_class = await reduced_page.evaluate("document.querySelector('[data-testid=\"house-static-fallback-v4\"] img')?.className || ''")
        if "translate-y-[6svh]" not in services_class or "-translate-y-[16svh]" in services_class:
            failures.append("Services inherited the Home fallback composition")
        await reduced_context.close()
        await browser.close()

    evidence = {
        "summary": {"viewports": len(VIEWPORTS), "focusMeasurements": len(focus_rows), "failures": len(failures)},
        "focus": focus_rows,
        "journey": journey_rows,
        "reverse": reverse_rows,
        "cue": cue_rows,
        "reducedMotion": reduced,
        "servicesFallbackClass": services_class,
        "failures": failures,
    }
    with open(f"{OUT}/metrics.json", "w") as handle:
        json.dump(evidence, handle, indent=2)
    print(json.dumps(evidence["summary"] | {"failureDetails": failures}, indent=2))
    sys.exit(1 if failures else 0)

asyncio.run(main())
