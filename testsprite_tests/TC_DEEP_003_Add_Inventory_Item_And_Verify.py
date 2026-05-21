import asyncio
import time
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    try:
        pw = await async_api.async_playwright().start()
        browser = await pw.chromium.launch(
            headless=True,
            args=["--window-size=1280,720", "--disable-dev-shm-usage",
                  "--ipc=host", "--single-process"],
        )
        context = await browser.new_context()
        context.set_default_timeout(15000)
        page = await context.new_page()

        await page.goto("http://localhost:3333/raya_odoo.html")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass

        # ── Login ──────────────────────────────────────────────────────
        await page.evaluate("""async () => {
            try {
                const r = await fetch('/api/data');
                const d = await r.json();
                if (d.usersDb && d.usersDb.length) window.USERS_DB = d.usersDb;
                if (d.invItems)   window.INV_ITEMS   = d.invItems;
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("admin")
        await page.locator("#lp").fill("123456")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(0.8)

        # ── Step 1: Navigate to inventory parts page ──────────────────
        await page.evaluate("go('inv-parts')")
        await page.wait_for_selector("#page-inv-parts.active", state="visible", timeout=6000)
        await asyncio.sleep(0.3)

        # ── Step 2: Record initial inventory count ────────────────────
        initial_count = await page.evaluate(
            "typeof INV_ITEMS !== 'undefined' ? INV_ITEMS.length : 0"
        )

        # ── Step 3: Open inventory add modal ──────────────────────────
        await page.evaluate("openM('m-inventory')")
        await page.wait_for_selector("#m-inventory.open", state="visible", timeout=5000)
        await asyncio.sleep(0.2)

        # ── Step 4: Fill inventory item form ─────────────────────────
        unique_id = str(int(time.time()))[-6:]
        item_code = f"TEST-{unique_id}"
        item_name = f"صنف اختبار {unique_id}"

        await page.locator("#inv-code").fill(item_code)
        await page.locator("#inv-name").fill(item_name)
        await page.locator("#inv-qty").fill("50")
        await page.locator("#inv-min").fill("10")
        await page.locator("#inv-cost").fill("2500")
        await page.locator("#inv-price").fill("3500")

        # Category: use default (part) or select if needed
        # Unit: fill with قطعة (default)

        # ── Step 5: Save inventory item ───────────────────────────────
        await page.evaluate("saveInventoryItem()")

        # ── Step 6: Verify success notification ───────────────────────
        await page.wait_for_selector(".notif.success", state="visible", timeout=5000)
        notif_text = await page.locator(".notif.success").first.text_content()
        assert "تم إضافة الصنف" in (notif_text or ""), \
            f"Expected 'تم إضافة الصنف' notification, got: {notif_text}"

        # ── Step 7: Verify item added to INV_ITEMS ────────────────────
        new_count = await page.evaluate(
            "typeof INV_ITEMS !== 'undefined' ? INV_ITEMS.length : 0"
        )
        assert new_count == initial_count + 1, \
            f"INV_ITEMS should have one more entry: was {initial_count}, now {new_count}"

        # ── Step 8: Verify specific item in INV_ITEMS ─────────────────
        found = await page.evaluate(
            f"typeof INV_ITEMS !== 'undefined' ? INV_ITEMS.some(i => i.code === '{item_code}') : false"
        )
        assert found, f"Item with code '{item_code}' should be in INV_ITEMS after save"

        # ── Step 9: Verify correct qty and price stored ───────────────
        item_data = await page.evaluate(
            f"typeof INV_ITEMS !== 'undefined' ? INV_ITEMS.find(i => i.code === '{item_code}') : null"
        )
        assert item_data is not None, "Item data should be retrievable from INV_ITEMS"
        assert item_data.get("qty") == 50, \
            f"Expected qty=50, got: {item_data.get('qty')}"
        assert item_data.get("price") == 3500, \
            f"Expected price=3500, got: {item_data.get('price')}"

        # ── Step 10: Verify modal closed ──────────────────────────────
        modal_open = await page.locator("#m-inventory.open").count()
        assert modal_open == 0, "Inventory modal should be closed after save"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
