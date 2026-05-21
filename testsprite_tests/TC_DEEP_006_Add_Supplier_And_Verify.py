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
                if (d.suppliers)  window.SUPPLIERS_DB = d.suppliers;
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("admin")
        await page.locator("#lp").fill("123456")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(0.8)

        # ── Step 1: Navigate to suppliers page ───────────────────────
        await page.evaluate("go('suppliers')")
        await page.wait_for_selector("#page-suppliers.active", state="visible", timeout=6000)
        await asyncio.sleep(0.3)

        # ── Step 2: Record initial supplier count ─────────────────────
        initial_count = await page.evaluate(
            "typeof SUPPLIERS_DB !== 'undefined' ? SUPPLIERS_DB.length : 0"
        )

        # ── Step 3: Open supplier add modal ───────────────────────────
        await page.evaluate("""
            if (document.getElementById('supp-edit-id')) {
                document.getElementById('supp-edit-id').value = '';
            }
        """)
        await page.evaluate("openM('m-supplier')")
        await page.wait_for_selector("#m-supplier.open", state="visible", timeout=5000)
        await asyncio.sleep(0.2)

        # ── Step 4: Fill supplier form ────────────────────────────────
        unique_id = str(int(time.time()))[-6:]
        supp_name = f"مجهز اختبار {unique_id}"

        await page.locator("#supp-name").fill(supp_name)
        await page.locator("#supp-phone").fill(f"0780{unique_id}")
        await page.locator("#supp-address").fill("بغداد، شارع الصناعة")
        await page.locator("#supp-spec").fill("مواد كهربائية")
        await page.locator("#supp-credit").fill("5000000")
        await page.locator("#supp-terms").fill("45")

        # ── Step 5: Save supplier ─────────────────────────────────────
        await page.evaluate("saveSupplier()")

        # ── Step 6: Verify success notification ───────────────────────
        await page.wait_for_selector(".notif.success", state="visible", timeout=5000)
        notif_text = await page.locator(".notif.success").first.text_content()
        assert "تم إضافة المجهز" in (notif_text or ""), \
            f"Expected 'تم إضافة المجهز' notification, got: {notif_text}"

        # ── Step 7: Verify supplier added to SUPPLIERS_DB ─────────────
        new_count = await page.evaluate(
            "typeof SUPPLIERS_DB !== 'undefined' ? SUPPLIERS_DB.length : 0"
        )
        assert new_count == initial_count + 1, \
            f"SUPPLIERS_DB should have one more entry: was {initial_count}, now {new_count}"

        # ── Step 8: Verify specific supplier in DB ────────────────────
        found = await page.evaluate(
            f"typeof SUPPLIERS_DB !== 'undefined' ? SUPPLIERS_DB.some(s => s.name === '{supp_name}') : false"
        )
        assert found, f"Supplier '{supp_name}' should be in SUPPLIERS_DB after save"

        # ── Step 9: Verify supplier data stored correctly ─────────────
        supp_data = await page.evaluate(
            f"typeof SUPPLIERS_DB !== 'undefined' ? SUPPLIERS_DB.find(s => s.name === '{supp_name}') : null"
        )
        assert supp_data is not None, "Supplier data should be retrievable from SUPPLIERS_DB"
        assert supp_data.get("terms") == 45, \
            f"Expected payment terms=45, got: {supp_data.get('terms')}"
        assert supp_data.get("credit") == 5000000, \
            f"Expected credit limit=5000000, got: {supp_data.get('credit')}"

        # ── Step 10: Verify modal closed ──────────────────────────────
        modal_open = await page.locator("#m-supplier.open").count()
        assert modal_open == 0, "Supplier modal should be closed after save"

        # ── Step 11: Verify supplier appears in rendered table ─────────
        await asyncio.sleep(0.5)  # renderSuppliersPage runs after save
        table_html = await page.locator("#supp-table-body").inner_html()
        assert supp_name in table_html, \
            f"Supplier '{supp_name}' should appear in rendered suppliers table"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
