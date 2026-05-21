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
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("admin")
        await page.locator("#lp").fill("123456")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(0.8)

        # ── Step 1: Navigate to customers page ────────────────────────
        await page.evaluate("go('customers')")
        await page.wait_for_selector("#page-customers.active", state="visible", timeout=6000)
        await asyncio.sleep(0.3)

        # ── Step 2: Record initial customer count ─────────────────────
        initial_count = await page.evaluate("typeof CUSTOMERS_DB !== 'undefined' ? CUSTOMERS_DB.length : 0")

        # ── Step 3: Open customer add modal ───────────────────────────
        await page.evaluate("""
            document.getElementById('cust-edit-id').value = '';
            document.getElementById('cust-name').value = '';
            document.getElementById('cust-phone').value = '';
        """)
        await page.evaluate("openM('m-customer')")
        await page.wait_for_selector("#m-customer.open", state="visible", timeout=5000)

        # ── Step 4: Fill customer form ────────────────────────────────
        unique_id = str(int(time.time()))[-6:]
        cust_name = f"زبون اختبار {unique_id}"
        await page.locator("#cust-name").fill(cust_name)
        await page.locator("#cust-phone").fill(f"0790{unique_id}")
        # City is a select — pick البصرة
        await page.locator("#cust-city").select_option("البصرة")
        # Type is a select — keep default (فرد)

        # ── Step 5: Save customer ─────────────────────────────────────
        await page.evaluate("saveCustomer()")

        # ── Step 6: Verify success notification ───────────────────────
        await page.wait_for_selector(".notif.success", state="visible", timeout=5000)
        notif_text = await page.locator(".notif.success").first.text_content()
        assert "تم إضافة الزبون" in (notif_text or ""), \
            f"Expected 'تم إضافة الزبون' notification, got: {notif_text}"

        # ── Step 7: Verify customer was added to CUSTOMERS_DB ─────────
        new_count = await page.evaluate("typeof CUSTOMERS_DB !== 'undefined' ? CUSTOMERS_DB.length : 0")
        assert new_count == initial_count + 1, \
            f"CUSTOMERS_DB should have one more entry: was {initial_count}, now {new_count}"

        # ── Step 8: Verify the specific customer name in DB ───────────
        found = await page.evaluate(
            f"typeof CUSTOMERS_DB !== 'undefined' ? CUSTOMERS_DB.some(c => c.name === '{cust_name}') : false"
        )
        assert found, f"Customer '{cust_name}' should be in CUSTOMERS_DB after save"

        # ── Step 9: Verify modal is closed ────────────────────────────
        modal_open = await page.locator("#m-customer.open").count()
        assert modal_open == 0, "Customer modal should be closed after save"

        # ── Step 10: Verify customer appears in rendered table ────────
        await asyncio.sleep(0.5)  # renderCustomersPage runs after save
        table_html = await page.locator("#cust-table-body").inner_html()
        assert cust_name in table_html, \
            f"Customer '{cust_name}' should appear in rendered customers table"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
