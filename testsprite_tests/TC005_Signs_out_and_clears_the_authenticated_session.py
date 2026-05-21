import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        pw = await async_api.async_playwright().start()
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )
        context = await browser.new_context()
        context.set_default_timeout(15000)
        page = await context.new_page()
        # -> navigate
        await page.goto("http://localhost:3333/raya_odoo.html")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass

        # ✅ FIXED: Inject USERS_DB via fetch + single-click login + wait for #app
        await page.evaluate("""async () => {
            try {
                const r = await fetch('/api/data');
                const d = await r.json();
                if (d.usersDb && d.usersDb.length) window.USERS_DB = d.usersDb;
                if (d.invItems)   window.INV_ITEMS  = d.invItems;
                if (d.customers)  window.CUSTOMERS_DB = d.customers;
                if (d.suppliers)  window.SUPPLIERS_DB = d.suppliers;
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("admin")
        await page.locator("#lp").wait_for(state="visible", timeout=10000)
        await page.locator("#lp").fill("123456")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(1)

        await asyncio.sleep(1)

        await asyncio.sleep(1)

        await asyncio.sleep(5)
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    