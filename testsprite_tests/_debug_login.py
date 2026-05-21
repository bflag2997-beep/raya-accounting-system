import asyncio
from playwright import async_api

async def run_debug():
    pw = await async_api.async_playwright().start()
    browser = await pw.chromium.launch(
        headless=True,
        args=["--window-size=1280,720", "--disable-dev-shm-usage"]
    )
    context = await browser.new_context()

    # Capture console messages
    page = await context.new_page()
    page.on("console", lambda msg: print(f"[CONSOLE {msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))

    await page.goto("http://localhost:3333/raya_odoo.html")
    await page.wait_for_load_state("domcontentloaded", timeout=8000)
    await asyncio.sleep(2)

    # Inject USERS_DB
    result = await page.evaluate("""async () => {
        const r = await fetch('/api/data');
        const d = await r.json();
        window.USERS_DB = d.usersDb || [];
        return { users: window.USERS_DB.length, first: window.USERS_DB[0] && window.USERS_DB[0].username };
    }""")
    print(f"Inject: {result}")

    # Check if doLogin function exists
    has_fn = await page.evaluate("() => typeof doLogin === 'function'")
    print(f"doLogin function exists: {has_fn}")

    # Fill form fields
    await page.locator("#lu").fill("admin")
    await page.locator("#lp").fill("123456")

    # Read back values
    lu_val = await page.evaluate("() => document.getElementById('lu').value")
    lp_val = await page.evaluate("() => document.getElementById('lp').value")
    print(f"#lu value: '{lu_val}', #lp value: '{lp_val}'")

    # Call doLogin() directly via JS
    print("Calling doLogin() via evaluate...")
    await page.evaluate("() => doLogin()")
    await asyncio.sleep(1)

    app_display = await page.evaluate("() => document.getElementById('app').style.display")
    login_display = await page.evaluate("() => document.getElementById('login-screen').style.display")
    err_display = await page.evaluate("() => document.getElementById('login-err').style.display")
    current = await page.evaluate("() => typeof currentUser !== 'undefined' ? currentUser.username : 'undefined'")
    print(f"After doLogin(): #app='{app_display}' #login-screen='{login_display}' #err='{err_display}' user='{current}'")

    await context.close()
    await browser.close()
    await pw.stop()

asyncio.run(run_debug())
