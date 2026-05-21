"""
Shared login helper for all raya_odoo Playwright tests.
Fixes the multi-click login defect identified in the TestSprite report.
"""
import asyncio

APP_URL = "http://localhost:3333/raya_odoo.html"
USERNAME = "admin"
PASSWORD = "123456"

BROWSER_ARGS = [
    "--window-size=1280,720",
    "--disable-dev-shm-usage",
    "--ipc=host",
    "--single-process"
]

async def do_login(page, username=USERNAME, password=PASSWORD):
    """
    Correct login sequence:
    1. Navigate to app
    2. Wait for USERS_DB to be loaded from server (SSE data sync)
    3. Fill username (#lu) and password (#lp)
    4. Click login button ONCE (.btn-login)
    5. Wait for #app to be visible — do NOT click again
    """
    await page.goto(APP_URL)
    try:
        await page.wait_for_load_state("domcontentloaded", timeout=8000)
    except Exception:
        pass

    # Wait for USERS_DB to be populated from server (SSE sync)
    # The app loads users via SSE from localhost:3333/events
    await page.wait_for_function(
        "() => typeof USERS_DB !== 'undefined' && USERS_DB.length > 0",
        timeout=15000
    )

    # Fill username
    await page.locator("#lu").wait_for(state="visible", timeout=10000)
    await page.locator("#lu").fill(username)

    # Fill password
    await page.locator("#lp").wait_for(state="visible", timeout=10000)
    await page.locator("#lp").fill(password)

    # Click login button ONCE
    await page.locator(".btn-login").click()

    # Wait for app shell to appear (do NOT click again)
    await page.wait_for_selector("#app", state="visible", timeout=15000)
    # Small settle time for initial render
    await asyncio.sleep(1)


async def navigate_to(page, section_id):
    """Navigate to a sidebar section after login."""
    await page.evaluate(f"go('{section_id}')")
    await asyncio.sleep(0.5)
