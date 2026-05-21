import asyncio
from playwright import async_api

# Expected payroll totals based on EMPLOYEES static data:
# EMP-001 حسين علي    850,000 + 85,000 (10%) = 935,000
# EMP-002 كريم محمد   850,000 + 85,000       = 935,000
# EMP-003 سارة أحمد  1,200,000 + 120,000     = 1,320,000
# EMP-004 عمر يوسف    950,000 + 95,000        = 1,045,000
# EMP-005 نور إبراهيم 750,000 + 75,000        = 825,000
# Total net = 5,060,000 د.ع

EXPECTED_NET_TOTAL = 5_060_000


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

        # ── Login as admin ────────────────────────────────────────────
        await page.evaluate("""async () => {
            try {
                const r = await fetch('/api/data');
                const d = await r.json();
                if (d.usersDb && d.usersDb.length) window.USERS_DB = d.usersDb;
                if (d.payroll)  window.PAYROLL_RECORDS = d.payroll || [];
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("admin")
        await page.locator("#lp").fill("123456")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(0.8)

        # ── Step 1: Ensure PAYROLL_RECORDS exists ─────────────────────
        await page.evaluate("""
            if (typeof PAYROLL_RECORDS === 'undefined') window.PAYROLL_RECORDS = [];
        """)

        # ── Step 2: Compute expected totals via JS (use same formula) ─
        computed = await page.evaluate("""() => {
            if (typeof EMPLOYEES === 'undefined') return null;
            var totalBasic = 0, totalNet = 0;
            EMPLOYEES.forEach(function(e) {
                var basic = e.salary || 0;
                var net   = basic + Math.round(basic * 0.1);
                totalBasic += basic;
                totalNet   += net;
            });
            return { basic: totalBasic, net: totalNet, count: EMPLOYEES.length };
        }""")

        assert computed is not None, "EMPLOYEES array must be defined in the app"
        assert computed["count"] == 5, \
            f"Expected 5 employees, got: {computed['count']}"
        assert computed["net"] == EXPECTED_NET_TOTAL, \
            f"Expected net total {EXPECTED_NET_TOTAL}, computed: {computed['net']}"

        # ── Step 3: Navigate to HR page ───────────────────────────────
        await page.evaluate("go('hr')")
        await page.wait_for_selector("#page-hr.active", state="visible", timeout=6000)
        await asyncio.sleep(0.3)

        # ── Step 4: Open payroll modal ────────────────────────────────
        await page.evaluate("openM('m-payroll')")
        await page.wait_for_selector("#m-payroll.open", state="visible", timeout=5000)
        await asyncio.sleep(0.5)  # Wait for modal population

        # ── Step 5: Verify modal shows correct total ──────────────────
        modal_total_text = await page.locator("#pr-modal-total").text_content()
        # Handle Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) used by the fmt() function
        computed_total_in_modal = await page.evaluate("""() => {
            var el = document.getElementById('pr-modal-total');
            if (!el) return null;
            var raw = el.textContent;
            // Convert Arabic-Indic digits to Western digits
            raw = raw.replace(/[٠-٩]/g, function(c) {
                return c.charCodeAt(0) - 0x0660;
            });
            // Remove all non-digit characters
            raw = raw.replace(/[^0-9]/g, '');
            return raw ? parseInt(raw, 10) : null;
        }""")
        assert computed_total_in_modal == EXPECTED_NET_TOTAL, \
            f"Modal total should show {EXPECTED_NET_TOTAL}, got: {computed_total_in_modal} (raw: '{modal_total_text}')"

        # ── Step 6: Set month to a unique past month (avoid duplicate) ─
        payroll_month = "2024-03"
        await page.evaluate(f"document.getElementById('pr-month').value = '{payroll_month}'")
        await page.evaluate("document.getElementById('pr-date').value = '2024-03-31'")

        # ── Step 7: Remove any existing payroll for this month ────────
        await page.evaluate(f"""
            if (typeof PAYROLL_RECORDS !== 'undefined') {{
                var idx = PAYROLL_RECORDS.findIndex(function(r) {{ return r.month === '{payroll_month}'; }});
                if (idx >= 0) PAYROLL_RECORDS.splice(idx, 1);
            }}
        """)

        # ── Step 8: Record initial payroll count ──────────────────────
        initial_count = await page.evaluate(
            "typeof PAYROLL_RECORDS !== 'undefined' ? PAYROLL_RECORDS.length : 0"
        )

        # ── Step 9: Execute payroll ───────────────────────────────────
        await page.evaluate("runPayroll()")

        # ── Step 10: Verify success notification ──────────────────────
        await page.wait_for_selector(".notif.success", state="visible", timeout=5000)
        notif_text = await page.locator(".notif.success").first.text_content()
        assert "تم صرف رواتب" in (notif_text or ""), \
            f"Expected 'تم صرف رواتب' notification, got: {notif_text}"

        # ── Step 11: Verify payroll record created ────────────────────
        new_count = await page.evaluate(
            "typeof PAYROLL_RECORDS !== 'undefined' ? PAYROLL_RECORDS.length : 0"
        )
        assert new_count == initial_count + 1, \
            f"PAYROLL_RECORDS should have one more entry: was {initial_count}, now {new_count}"

        # ── Step 12: Verify correct net total in PAYROLL_RECORDS ──────
        payroll_rec = await page.evaluate(
            f"typeof PAYROLL_RECORDS !== 'undefined' ? PAYROLL_RECORDS.find(r => r.month === '{payroll_month}') : null"
        )
        assert payroll_rec is not None, \
            f"Payroll record for month '{payroll_month}' should exist in PAYROLL_RECORDS"
        assert payroll_rec.get("netTotal") == EXPECTED_NET_TOTAL, \
            f"Expected netTotal={EXPECTED_NET_TOTAL}, got: {payroll_rec.get('netTotal')}"
        assert payroll_rec.get("empCount") == 5, \
            f"Expected empCount=5, got: {payroll_rec.get('empCount')}"

        # ── Step 13: Verify automatic journal entry was created ───────
        payroll_id = payroll_rec.get("id")
        journal_entry = await page.evaluate(f"""
            typeof JOURNAL_ENTRIES_DATA !== 'undefined'
                ? JOURNAL_ENTRIES_DATA.find(e => e.ref === '{payroll_id}')
                : null
        """)
        assert journal_entry is not None, \
            f"Journal entry for payroll ref '{payroll_id}' should be in JOURNAL_ENTRIES_DATA"

        # Verify journal entry lines: debit account 5311, credit account 2241
        lines = journal_entry.get("lines", [])
        debit_line = next((l for l in lines if l.get("code") == "5311"), None)
        credit_line = next((l for l in lines if l.get("code") == "2241"), None)
        assert debit_line is not None, "Journal should have debit on account 5311 (رواتب)"
        assert credit_line is not None, "Journal should have credit on account 2241 (رواتب مستحقة)"
        assert debit_line.get("debit") == EXPECTED_NET_TOTAL, \
            f"Journal debit should be {EXPECTED_NET_TOTAL}, got: {debit_line.get('debit')}"
        assert credit_line.get("credit") == EXPECTED_NET_TOTAL, \
            f"Journal credit should be {EXPECTED_NET_TOTAL}, got: {credit_line.get('credit')}"

        # ── Step 14: Verify duplicate payroll is rejected ─────────────
        await page.evaluate("openM('m-payroll')")
        await page.wait_for_selector("#m-payroll.open", state="visible", timeout=5000)
        await asyncio.sleep(0.2)
        await page.evaluate(f"document.getElementById('pr-month').value = '{payroll_month}'")
        await page.evaluate("document.getElementById('pr-date').value = '2024-03-31'")
        await page.evaluate("runPayroll()")
        # Should get danger notification about duplicate
        await page.wait_for_function(
            "() => Array.from(document.querySelectorAll('.notif.danger')).some(n => n.textContent.includes('مسبقاً'))",
            timeout=5000
        )

        # Modal should still be open (save rejected)
        assert await page.locator("#m-payroll.open").count() == 1, \
            "Payroll modal should stay open when duplicate month is detected"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
