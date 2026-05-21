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

        # ── Login as accountant (full accounting access) ──────────────
        await page.evaluate("""async () => {
            try {
                const r = await fetch('/api/data');
                const d = await r.json();
                if (d.usersDb && d.usersDb.length) window.USERS_DB = d.usersDb;
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("accountant")
        await page.locator("#lp").fill("acc2026")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(0.8)

        # ── Step 1: Navigate to trial balance page ────────────────────
        await page.evaluate("go('trial')")
        await page.wait_for_selector("#page-trial.active", state="visible", timeout=6000)
        await asyncio.sleep(0.7)  # Wait for renderTrialBalance() timeout (100ms) + render

        # ── Step 2: Wait for trial balance body to be populated ───────
        # The table body should have account rows after rendering
        await page.wait_for_function(
            "() => { var tb = document.getElementById('trial-balance-body'); return tb && tb.children.length > 0; }",
            timeout=8000
        )

        # ── Step 3: Verify totals are displayed (not empty) ───────────
        dr_text = await page.locator("#tb-total-dr").text_content()
        cr_text = await page.locator("#tb-total-cr").text_content()
        assert dr_text and dr_text.strip(), \
            "Trial balance debit total should not be empty"
        assert cr_text and cr_text.strip(), \
            "Trial balance credit total should not be empty"

        # ── Step 4: Verify balance check shows equation holds ─────────
        balance_check_html = await page.locator("#tb-balance-check").inner_html()
        assert "المدين = الدائن" in balance_check_html, \
            f"Trial balance should show balanced equation, got: {balance_check_html}"
        assert "القيود سليمة" in balance_check_html, \
            f"Trial balance should confirm entries are sound, got: {balance_check_html}"

        # ── Step 5: Verify totals are equal via JS computation ────────
        def arabic_to_int(text):
            """Convert Arabic-Indic digits to integer."""
            import re
            # Map Arabic-Indic digits to ASCII
            mapped = ""
            for ch in text:
                code = ord(ch)
                if 0x0660 <= code <= 0x0669:
                    mapped += chr(code - 0x0660 + ord('0'))
                elif ch.isdigit():
                    mapped += ch
            digits = re.sub(r'[^0-9]', '', mapped)
            return int(digits) if digits else 0

        dr_total = arabic_to_int(dr_text)
        cr_total = arabic_to_int(cr_text)

        assert dr_total > 0, \
            f"Total debit should be > 0 (means journal entries exist), got: {dr_total}"
        assert cr_total > 0, \
            f"Total credit should be > 0, got: {cr_total}"
        assert dr_total == cr_total, \
            f"Accounting equation violated: total debit ({dr_total}) ≠ total credit ({cr_total})"

        # ── Step 6: Verify ACCOUNTS_DB and JOURNAL_ENTRIES_DATA exist ─
        accounts_count = await page.evaluate(
            "typeof ACCOUNTS_DB !== 'undefined' ? ACCOUNTS_DB.length : 0"
        )
        assert accounts_count > 0, \
            "ACCOUNTS_DB should have accounts for trial balance to render"

        journal_count = await page.evaluate(
            "typeof JOURNAL_ENTRIES_DATA !== 'undefined' ? JOURNAL_ENTRIES_DATA.length : 0"
        )
        assert journal_count > 0, \
            "JOURNAL_ENTRIES_DATA should have entries for meaningful trial balance"

        # ── Step 7: Verify table has rows (accounts rendered) ─────────
        row_count = await page.evaluate(
            "document.getElementById('trial-balance-body').querySelectorAll('tr').length"
        )
        assert row_count > 0, \
            f"Trial balance table should have rows, got {row_count}"

        # ── Step 8: Filter by group 5 (expenses) and verify still balanced ──
        await page.evaluate("document.getElementById('tb-group').value = '5'")
        await page.evaluate("renderTrialBalance()")
        await asyncio.sleep(0.3)

        # After filtering, check balance check still shows or shows diff
        # (filtered view might not be balanced since it's only a subset)
        # Just verify it renders without crashing
        dr_text_filtered = await page.locator("#tb-total-dr").text_content()
        assert dr_text_filtered is not None, \
            "Trial balance should render when filtered by group"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
