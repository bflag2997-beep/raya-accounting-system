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
                if (d.maint)  window.MAINT_DB = d.maint || [];
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("admin")
        await page.locator("#lp").fill("123456")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(0.8)

        # ── Step 1: Ensure MAINT_DB and JOURNAL_ENTRIES_DATA exist ────
        await page.evaluate("""
            if (typeof MAINT_DB === 'undefined') window.MAINT_DB = [];
            if (typeof JOURNAL_ENTRIES_DATA === 'undefined') window.JOURNAL_ENTRIES_DATA = [];
        """)

        # ── Step 2: Create a maintenance request via JS directly ──────
        unique_id = str(int(time.time()))[-6:]
        test_customer = f"عميل صيانة {unique_id}"
        test_desc = f"تبديل قطعة غيار — اختبار {unique_id}"
        COST = 250000  # 250,000 د.ع

        new_id = await page.evaluate(f"""() => {{
            var maxNum = MAINT_DB.reduce(function(m, r) {{
                var n = parseInt((r.id || '').replace('MNT-', '')) || 0;
                return n > m ? n : m;
            }}, 0);
            var newId = 'MNT-' + String(maxNum + 1).padStart(3, '0');
            var today = new Date().toISOString().split('T')[0];
            MAINT_DB.unshift({{
                id: newId,
                date: today,
                customer: '{test_customer}',
                serial: 'GEN-TEST-{unique_id}',
                desc: '{test_desc}',
                tech: 'حسين علي',
                type: 'corrective',
                cost: {COST},
                status: 'open',
                priority: 'normal'
            }});
            return newId;
        }}""")

        assert new_id and new_id.startswith("MNT-"), \
            f"New maintenance ID should start with MNT-, got: {new_id}"

        # ── Step 3: Verify request status is 'open' ────────────────────
        status_before = await page.evaluate(
            f"MAINT_DB.find(r => r.id === '{new_id}')?.status"
        )
        assert status_before == "open", \
            f"New maintenance request should have status='open', got: {status_before}"

        # ── Step 4: Record initial journal entry count ─────────────────
        journal_count_before = await page.evaluate(
            "typeof JOURNAL_ENTRIES_DATA !== 'undefined' ? JOURNAL_ENTRIES_DATA.length : 0"
        )

        # ── Step 5: Complete the maintenance request ───────────────────
        await page.evaluate(f"completeMaint('{new_id}')")

        # ── Step 6: Verify success notification ────────────────────────
        await page.wait_for_selector(".notif.success", state="visible", timeout=5000)
        notif_text = await page.locator(".notif.success").first.text_content()
        # Should show journal entry ID since cost > 0 and type is corrective
        assert "إغلاق" in (notif_text or "") or "قيد" in (notif_text or "") or "طلب" in (notif_text or ""), \
            f"Expected completion notification, got: {notif_text}"

        # ── Step 7: Verify status changed to 'completed' ───────────────
        status_after = await page.evaluate(
            f"MAINT_DB.find(r => r.id === '{new_id}')?.status"
        )
        assert status_after == "completed", \
            f"Maintenance request should be 'completed' after completeMaint(), got: {status_after}"

        # ── Step 8: Verify automatic journal entry was created ─────────
        # completeMaint creates a journal when cost > 0 and type != 'warranty'
        journal_count_after = await page.evaluate(
            "typeof JOURNAL_ENTRIES_DATA !== 'undefined' ? JOURNAL_ENTRIES_DATA.length : 0"
        )
        assert journal_count_after == journal_count_before + 1, \
            f"Journal entry should be created for completed maintenance with cost; before={journal_count_before}, after={journal_count_after}"

        # ── Step 9: Verify journal entry correctness ───────────────────
        jv_entry = await page.evaluate(f"""() => {{
            return JOURNAL_ENTRIES_DATA.find(e => e.ref === '{new_id}') || null;
        }}""")
        assert jv_entry is not None, \
            f"Journal entry with ref='{new_id}' should be in JOURNAL_ENTRIES_DATA"

        lines = jv_entry.get("lines", [])
        # Debit: account 5131 (مواد الصيانة المستهلكة)
        debit_line = next((l for l in lines if l.get("code") == "5131"), None)
        # Credit: account 1611 (الصندوق)
        credit_line = next((l for l in lines if l.get("code") == "1611"), None)

        assert debit_line is not None, \
            "Journal should have debit line on account 5131 (مواد الصيانة)"
        assert credit_line is not None, \
            "Journal should have credit line on account 1611 (الصندوق)"
        assert debit_line.get("debit") == COST, \
            f"Debit amount should be {COST}, got: {debit_line.get('debit')}"
        assert credit_line.get("credit") == COST, \
            f"Credit amount should be {COST}, got: {credit_line.get('credit')}"

        # ── Step 10: Verify journal entry is balanced (debit = credit) ─
        total_debit = sum(l.get("debit", 0) for l in lines)
        total_credit = sum(l.get("credit", 0) for l in lines)
        assert abs(total_debit - total_credit) < 1, \
            f"Maintenance journal entry must be balanced: debit={total_debit}, credit={total_credit}"

        # ── Step 11: Verify completed request no longer shows "أنهِ" btn ─
        await page.evaluate("go('maintenance')")
        await page.wait_for_selector("#page-maintenance.active", state="visible", timeout=5000)
        await asyncio.sleep(0.5)

        # The completed entry should NOT have a "أنهِ" (Complete) button
        complete_btn_selector = f"[data-mid='{new_id}'][onclick*='completeMaint']"
        complete_btn_count = await page.locator(complete_btn_selector).count()
        assert complete_btn_count == 0, \
            f"Completed maintenance request should not show 'أنهِ' button, found: {complete_btn_count}"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
