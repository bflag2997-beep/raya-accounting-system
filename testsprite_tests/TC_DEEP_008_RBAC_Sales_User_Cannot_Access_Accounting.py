import asyncio
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

        # ── Login as SALES user (limited permissions) ─────────────────
        await page.evaluate("""async () => {
            try {
                const r = await fetch('/api/data');
                const d = await r.json();
                if (d.usersDb && d.usersDb.length) window.USERS_DB = d.usersDb;
                if (d.customers)  window.CUSTOMERS_DB = d.customers;
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("sales")
        await page.locator("#lp").fill("sales123")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(0.8)

        # Verify we're logged in as sales user
        current_user = await page.evaluate(
            "typeof currentUser !== 'undefined' ? currentUser.username : null"
        )
        assert current_user == "sales", \
            f"Should be logged in as 'sales', got: {current_user}"

        # ── Test 1: Sales user CANNOT access accounting journal ────────
        await page.evaluate("go('journal')")
        await asyncio.sleep(0.3)

        # Accounting journal page should NOT be active
        journal_active = await page.locator("#page-journal.active").count()
        assert journal_active == 0, \
            "Sales user should NOT be able to navigate to journal (accounting) page"

        # Permission denied notification should appear
        await page.wait_for_function(
            "() => Array.from(document.querySelectorAll('.notif.danger')).some(n => n.textContent.includes('صلاحية'))",
            timeout=5000
        )

        # ── Test 2: Sales user CANNOT access HR/employees ─────────────
        await page.evaluate("go('hr')")
        await asyncio.sleep(0.3)

        hr_active = await page.locator("#page-hr.active").count()
        assert hr_active == 0, \
            "Sales user should NOT be able to navigate to HR/employees page"

        # ── Test 3: Sales user CANNOT access purchases ─────────────────
        await page.evaluate("go('purchases')")
        await asyncio.sleep(0.3)

        purchases_active = await page.locator("#page-purchases.active").count()
        assert purchases_active == 0, \
            "Sales user should NOT be able to navigate to purchases page"

        # ── Test 4: Sales user CAN access customers ────────────────────
        await page.evaluate("go('customers')")
        await page.wait_for_selector("#page-customers.active", state="visible", timeout=5000)

        customers_active = await page.locator("#page-customers.active").count()
        assert customers_active == 1, \
            "Sales user SHOULD be able to navigate to customers page"

        # ── Test 5: Sales user CAN access sales page ──────────────────
        await page.evaluate("go('sales')")
        await page.wait_for_selector("#page-sales.active", state="visible", timeout=5000)

        sales_active = await page.locator("#page-sales.active").count()
        assert sales_active == 1, \
            "Sales user SHOULD be able to navigate to sales page"

        # ── Test 6: Sales user CAN access maintenance (view only) ─────
        await page.evaluate("go('maintenance')")
        await page.wait_for_selector("#page-maintenance.active", state="visible", timeout=5000)

        maint_active = await page.locator("#page-maintenance.active").count()
        assert maint_active == 1, \
            "Sales user SHOULD be able to view maintenance page"

        # ── Test 7: Verify RBAC permissions object for current user ───
        user_perms = await page.evaluate("""() => {
            if (typeof currentUser === 'undefined' || !currentUser) return null;
            return currentUser.perms || null;
        }""")
        assert user_perms is not None, "Current user should have a perms object"

        accounting_perm = user_perms.get("accounting", {})
        assert accounting_perm.get("view") == False, \
            f"Sales user should NOT have accounting view permission, got: {accounting_perm}"

        sales_perm = user_perms.get("sales", {})
        assert sales_perm.get("view") == True, \
            f"Sales user SHOULD have sales view permission, got: {sales_perm}"
        assert sales_perm.get("create") == True, \
            f"Sales user SHOULD have sales create permission, got: {sales_perm}"
        assert sales_perm.get("del") == False, \
            f"Sales user should NOT have sales delete permission, got: {sales_perm}"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
