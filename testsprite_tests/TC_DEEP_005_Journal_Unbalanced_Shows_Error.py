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

        # ── Login ──────────────────────────────────────────────────────
        await page.evaluate("""async () => {
            try {
                const r = await fetch('/api/data');
                const d = await r.json();
                if (d.usersDb && d.usersDb.length) window.USERS_DB = d.usersDb;
            } catch(e) {}
        }""")
        await page.locator("#lu").wait_for(state="visible", timeout=10000)
        await page.locator("#lu").fill("admin")
        await page.locator("#lp").fill("123456")
        await page.locator(".btn-login").click()
        await page.wait_for_selector("#app", state="visible", timeout=15000)
        await asyncio.sleep(0.8)

        # ── Step 1: Navigate to journal page ──────────────────────────
        await page.evaluate("go('journal')")
        await page.wait_for_selector("#page-journal.active", state="visible", timeout=6000)
        await asyncio.sleep(0.3)

        # ── Step 2: Open journal modal ─────────────────────────────────
        await page.evaluate("openM('m-journal')")
        await page.wait_for_selector("#m-journal.open", state="visible", timeout=5000)
        await asyncio.sleep(0.3)

        # ── Step 3: Wait for jv line inputs ───────────────────────────
        await page.wait_for_selector("#jvl1-dr", state="attached", timeout=5000)
        await page.wait_for_selector("#jvl2-cr", state="attached", timeout=5000)

        # ── Step 4: Fill description ───────────────────────────────────
        await page.locator("#jv-desc").fill("قيد غير متوازن — اختبار التحقق")

        # ── Step 5: Fill IMBALANCED amounts (1000 debit, 500 credit) ──
        await page.locator("#jvl1-dr").fill("1000")
        await page.locator("#jvl2-cr").fill("500")

        # ── Step 6: Trigger balance calculation ───────────────────────
        await page.evaluate("calcJVNew()")
        await asyncio.sleep(0.2)

        # ── Step 7: Verify balance indicator shows unbalanced ─────────
        err_banner = await page.locator("#jv-err-new").evaluate("el => el.style.display")
        assert err_banner == "flex", \
            f"Error banner should be visible (display:flex) for unbalanced entry, got: {err_banner}"

        # ── Step 8: Attempt to save the unbalanced entry ──────────────
        await page.evaluate("saveJVNew()")

        # ── Step 9: Verify DANGER notification (save rejected) ────────
        await page.wait_for_selector(".notif.danger", state="visible", timeout=5000)
        notif_text = await page.locator(".notif.danger").first.text_content()
        assert "غير متوازن" in (notif_text or ""), \
            f"Expected 'غير متوازن' danger notification, got: {notif_text}"

        # ── Step 10: Verify modal is still OPEN (save was blocked) ────
        modal_open = await page.locator("#m-journal.open").count()
        assert modal_open == 1, \
            "Journal modal should remain open when save is rejected due to imbalance"

        # ── Test 2: Validate missing description also blocks save ─────
        # Reset lines to balanced amounts but clear description
        await page.locator("#jvl1-dr").fill("2000")
        await page.locator("#jvl2-cr").fill("2000")
        await page.locator("#jv-desc").fill("")
        await page.evaluate("calcJVNew()")
        await asyncio.sleep(0.2)

        await page.evaluate("saveJVNew()")
        # Wait for the specific "يجب إدخال بيان" notification (filter by text content)
        await page.wait_for_function(
            "() => Array.from(document.querySelectorAll('.notif.danger')).some(n => n.textContent.includes('يجب إدخال بيان'))",
            timeout=5000
        )

        # Modal should still be open
        assert await page.locator("#m-journal.open").count() == 1, \
            "Modal should stay open when description is missing"

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
