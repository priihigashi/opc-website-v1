"""Candidate 3 loading/failure visual contract. Requires dev server on :3011."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

URL = "http://localhost:3011"
VIEWPORTS = [(390, 844), (820, 1180), (1440, 900)]
OUT = Path(__file__).resolve().parents[1] / "qa-loading-v12"


async def delayed_case(browser, width, height):
    context = await browser.new_context(viewport={"width": width, "height": height})
    page = await context.new_page()
    errors = []
    requests = []
    delayed_house_requests = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("request", lambda request: requests.append(request.url))

    async def delay_house(route):
        if "HouseSceneV34" in route.request.url:
            delayed_house_requests.append(route.request.url)
            await asyncio.sleep(7)
        await route.continue_()

    await page.route("**/*.js", delay_house)
    await page.goto(URL, wait_until="domcontentloaded")
    await page.wait_for_timeout(800)
    assert delayed_house_requests, "the intended HouseSceneV34 chunk was not intercepted"
    assert await page.get_by_test_id("house-loading-indicator-v1").count() == 1
    assert await page.get_by_test_id("house-lightweight-view-v1").count() == 0
    assert not any("house-static-fallback" in url for url in requests)
    await page.screenshot(path=OUT / f"pending-{width}x{height}.png")

    await page.wait_for_timeout(4800)
    assert await page.get_by_test_id("house-loading-indicator-v1").get_attribute("data-loading-state") == "delayed"
    assert await page.get_by_test_id("house-lightweight-view-v1").count() == 0

    await page.locator("canvas").wait_for(state="attached", timeout=15000)
    await page.wait_for_timeout(1000)
    assert await page.get_by_test_id("house-loading-indicator-v1").count() == 0
    assert await page.locator("canvas").count() == 1
    assert not errors
    await page.screenshot(path=OUT / f"ready-{width}x{height}.png")

    await page.locator("canvas").evaluate(
        "canvas => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }))"
    )
    failure = page.get_by_test_id("house-lightweight-view-v1")
    await failure.wait_for()
    assert await failure.get_attribute("data-static-reason") == "webgl-failed"
    box = await failure.locator("img").bounding_box()
    assert await failure.locator("img").evaluate("img => img.complete && img.naturalWidth > 0")
    assert box and box["x"] >= 0 and box["y"] >= 0
    assert box["x"] + box["width"] <= width and box["y"] + box["height"] <= height
    if width == 390:
        assert await page.get_by_test_id("house-refresh-control-v1").count() == 1
    await page.screenshot(path=OUT / f"failure-{width}x{height}.png")
    await context.close()


async def static_preference_case(browser):
    context = await browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    page = await context.new_page()
    await page.goto(URL, wait_until="domcontentloaded")
    view = page.get_by_test_id("house-lightweight-view-v1")
    await view.wait_for()
    assert await view.get_attribute("data-static-reason") == "prefers-static"
    assert await page.get_by_test_id("house-loading-indicator-v1").count() == 0
    assert await page.locator("canvas").count() == 0
    assert await page.get_by_test_id("house-refresh-control-v1").count() == 0
    box = await view.locator("img").bounding_box()
    assert await view.locator("img").evaluate("img => img.complete && img.naturalWidth > 0")
    assert box and box["x"] >= 0 and box["y"] >= 0
    assert box["x"] + box["width"] <= 390 and box["y"] + box["height"] <= 844
    await page.screenshot(path=OUT / "static-preference-390x844.png")
    await context.close()


async def services_case(browser):
    context = await browser.new_context(viewport={"width": 390, "height": 844})
    page = await context.new_page()
    delayed_service_requests = []

    async def delay_services_house(route):
        if "ServicesSceneV5" in route.request.url:
            delayed_service_requests.append(route.request.url)
            await asyncio.sleep(7)
        await route.continue_()

    await page.route("**/*.js", delay_services_house)
    await page.goto(f"{URL}/services", wait_until="domcontentloaded")
    await page.wait_for_timeout(800)
    assert delayed_service_requests, "the intended ServicesSceneV5 chunk was not intercepted"
    assert await page.get_by_test_id("house-loading-indicator-v1").count() == 1
    assert await page.get_by_test_id("house-lightweight-view-v1").count() == 0
    await page.wait_for_timeout(4800)
    assert await page.get_by_test_id("house-loading-indicator-v1").get_attribute("data-loading-state") == "delayed"
    await page.locator("canvas").wait_for(state="attached", timeout=15000)
    await page.wait_for_timeout(1000)
    assert await page.get_by_test_id("house-loading-indicator-v1").count() == 0
    await context.close()

    failure_context = await browser.new_context(viewport={"width": 390, "height": 844})
    failure_page = await failure_context.new_page()

    async def abort_services_house(route):
        if "ServicesSceneV5" in route.request.url:
            await route.abort()
        else:
            await route.continue_()

    await failure_page.route("**/*.js", abort_services_house)
    await failure_page.goto(f"{URL}/services", wait_until="domcontentloaded")
    failure = failure_page.get_by_test_id("house-lightweight-view-v1")
    await failure.wait_for()
    assert await failure.get_attribute("data-static-reason") == "webgl-failed"
    assert await failure_page.get_by_test_id("house-refresh-control-v1").count() == 0
    await failure_context.close()

    static_context = await browser.new_context(
        viewport={"width": 390, "height": 844}, reduced_motion="reduce"
    )
    static_page = await static_context.new_page()
    await static_page.goto(f"{URL}/services", wait_until="domcontentloaded")
    assert await static_page.get_by_test_id("house-lightweight-view-v1").get_attribute("data-static-reason") == "prefers-static"
    assert await static_page.get_by_test_id("house-loading-indicator-v1").count() == 0
    assert await static_page.locator("canvas").count() == 0
    assert await static_page.get_by_test_id("house-refresh-control-v1").count() == 0
    await static_context.close()


async def main():
    OUT.mkdir(exist_ok=True)
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(args=["--use-gl=angle", "--enable-unsafe-swiftshader"])
        for width, height in VIEWPORTS:
            await delayed_case(browser, width, height)
        await static_preference_case(browser)
        await services_case(browser)
        await browser.close()
    print("loading V12 passed: home + services pending, delayed, ready, failure, and static preference")


if __name__ == "__main__":
    asyncio.run(main())
