import asyncio
from playwright import async_api

LOGIN_BLOCK = """
async def _login(page):
    await page.evaluate(\"\"\"async () => {
        try {
            const r = await fetch('/api/data');
            const d = await r.json();
            if (d.usersDb && d.usersDb.length) window.USERS_DB = d.usersDb;
            if (d.invItems)   window.INV_ITEMS   = d.invItems;
            if (d.customers)  window.CUSTOMERS_DB = d.customers;
            if (d.suppliers)  window.SUPPLIERS_DB = d.suppliers;
            if (d.maint)      window.MAINT_DB     = d.maint;
        } catch(e) {}
    }\"\"\")
    await page.locator('#lu').wait_for(state='visible', timeout=10000)
    await page.locator('#lu').fill('admin')
    await page.locator('#lp').fill('123456')
    await page.locator('.btn-login').click()
    await page.wait_for_selector('#app', state='visible', timeout=15000)
    await asyncio.sleep(0.8)
"""
exec(LOGIN_BLOCK)


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

        await _login(page)

        # ── Step 1: Navigate to journal page ──────────────────────────
        await page.evaluate("go('journal')")
        await page.wait_for_selector("#page-journal.active", state="visible", timeout=6000)
        await asyncio.sleep(0.3)

        # ── Step 2: Open journal modal ─────────────────────────────────
        await page.evaluate("openM('m-journal')")
        await page.wait_for_selector("#m-journal.open", state="visible", timeout=5000)
        await asyncio.sleep(0.3)  # Let 60ms timeout create jvl1 and jvl2 lines

        # ── Step 3: Wait for debit/credit line inputs ──────────────────
        await page.wait_for_selector("#jvl1-dr", state="attached", timeout=5000)
        await page.wait_for_selector("#jvl2-cr", state="attached", timeout=5000)

        # ── Step 4: Fill description ───────────────────────────────────
        await page.locator("#jv-desc").fill("قيد اختبار E2E — مصاريف إيجار")

        # ── Step 5: Fill debit line (account: الإيجار) ──────────────
        await page.locator("#jvl1-name").fill("مصروف الإيجار")
        await page.locator("#jvl1-dr").fill("5000")

        # ── Step 6: Fill credit line (account: الصندوق) ─────────────
        await page.locator("#jvl2-name").fill("الصندوق")
        await page.locator("#jvl2-cr").fill("5000")

        # ── Step 7: Trigger balance calculation ───────────────────────
        await page.evaluate("calcJVNew()")
        await asyncio.sleep(0.2)

        # ── Step 8: Verify balance indicator shows balanced ───────────
        balance_html = await page.locator("#jv-balance-ind").inner_html()
        assert "متوازن" in balance_html, \
            f"Balance indicator should show balanced, got: {balance_html}"

        # ── Step 9: Save journal entry ────────────────────────────────
        await page.evaluate("saveJVNew()")

        # ── Step 10: Verify success notification ──────────────────────
        await page.wait_for_selector(".notif.success", state="visible", timeout=5000)
        notif_text = await page.locator(".notif.success").first.text_content()
        assert "تم حفظ القيد" in (notif_text or ""), \
            f"Expected 'تم حفظ القيد' in notification, got: {notif_text}"

        # ── Step 11: Verify modal is closed ───────────────────────────
        await asyncio.sleep(0.3)
        modal_open = await page.locator("#m-journal.open").count()
        assert modal_open == 0, "Journal modal should be closed after save"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
