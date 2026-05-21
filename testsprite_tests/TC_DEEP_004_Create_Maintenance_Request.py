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
                if (d.customers)  window.CUSTOMERS_DB = d.customers;
                if (d.maint)      window.MAINT_DB      = d.maint;
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("admin")
        await page.locator("#lp").fill("123456")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(0.8)

        # ── Step 1: Ensure MAINT_DB array exists ─────────────────────
        await page.evaluate("""
            if (typeof MAINT_DB === 'undefined') window.MAINT_DB = [];
        """)

        # ── Step 2: Record initial maintenance request count ──────────
        initial_count = await page.evaluate(
            "typeof MAINT_DB !== 'undefined' ? MAINT_DB.length : 0"
        )

        # ── Step 3: Navigate to maintenance page ──────────────────────
        await page.evaluate("go('maintenance')")
        await page.wait_for_selector("#page-maintenance.active", state="visible", timeout=6000)
        await asyncio.sleep(0.5)  # Wait for renderMaintenancePage() to populate customer select

        # ── Step 4: Open maintenance modal ────────────────────────────
        await page.evaluate("openM('m-maintenance')")
        await page.wait_for_selector("#m-maintenance.open", state="visible", timeout=5000)
        await asyncio.sleep(0.2)

        # ── Step 5: Inject a test customer into the select (reliable) ─
        unique_id = str(int(time.time()))[-6:]
        test_customer = f"مستخدم صيانة {unique_id}"
        await page.evaluate(f"""
            var sel = document.getElementById('mnt-customer');
            if (sel) {{
                var opt = document.createElement('option');
                opt.value = '{test_customer}';
                opt.textContent = '{test_customer}';
                sel.appendChild(opt);
                sel.value = '{test_customer}';
            }}
        """)

        # ── Step 6: Fill serial number ────────────────────────────────
        await page.locator("#mnt-serial").fill(f"GEN-{unique_id}")

        # ── Step 7: Fill fault description ───────────────────────────
        fault_desc = f"عطل اختبار E2E — تاريخ {unique_id}"
        await page.locator("#mnt-desc").fill(fault_desc)

        # ── Step 8: Select technician from dropdown ───────────────────
        await page.locator("#mnt-tech").select_option("حسين علي")

        # ── Step 9: Fill cost ─────────────────────────────────────────
        await page.locator("#mnt-cost").fill("150000")

        # ── Step 10: Set type to corrective (default) ─────────────────
        # mnt-type is a select: warranty/corrective/preventive
        await page.locator("#mnt-type").select_option("corrective")

        # ── Step 11: Save maintenance request ────────────────────────
        await page.evaluate("saveMaintenance()")

        # ── Step 12: Verify success notification ─────────────────────
        await page.wait_for_selector(".notif.success", state="visible", timeout=5000)
        notif_text = await page.locator(".notif.success").first.text_content()
        assert "تم فتح طلب الصيانة" in (notif_text or ""), \
            f"Expected 'تم فتح طلب الصيانة' notification, got: {notif_text}"

        # ── Step 13: Verify request added to MAINT_DB ─────────────────
        new_count = await page.evaluate(
            "typeof MAINT_DB !== 'undefined' ? MAINT_DB.length : 0"
        )
        assert new_count == initial_count + 1, \
            f"MAINT_DB should have one more entry: was {initial_count}, now {new_count}"

        # ── Step 14: Verify the new request has status='open' ─────────
        new_entry = await page.evaluate(
            f"typeof MAINT_DB !== 'undefined' ? MAINT_DB.find(r => r.customer === '{test_customer}') : null"
        )
        assert new_entry is not None, \
            f"Maintenance entry for customer '{test_customer}' should exist in MAINT_DB"
        assert new_entry.get("status") == "open", \
            f"New maintenance request should have status='open', got: {new_entry.get('status')}"

        # ── Step 15: Verify modal closed ──────────────────────────────
        modal_open = await page.locator("#m-maintenance.open").count()
        assert modal_open == 0, "Maintenance modal should be closed after save"

        # ── Step 16: Verify request appears in rendered table ─────────
        await asyncio.sleep(0.5)
        table_html = await page.locator("#maint-table-body").inner_html()
        assert test_customer in table_html, \
            f"Customer '{test_customer}' should appear in maintenance table after save"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
