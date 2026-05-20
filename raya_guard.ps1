# ============================================================
# raya_guard.ps1 — مفتاح USB لنظام الراية الزرقاء
# ============================================================

$KeyFileName = "raya_key.txt"
$AppDir      = 'C:\Users\user\Desktop\ب رنامح'
$AppFile     = "raya_odoo.html"
$Port        = 3333
$Chrome      = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$AppURL      = "http://localhost:$Port/$AppFile"

$global:AppRunning = $false

# ── هل مفتاح USB موجود؟ ────────────────────────────────────
function Test-Key {
    $disks = Get-WmiObject Win32_LogicalDisk | Where-Object { $_.DriveType -eq 2 }
    foreach ($d in $disks) {
        if (Test-Path "$($d.DeviceID)\$KeyFileName") { return $true }
    }
    return $false
}

# ── هل السيرفر شغّال؟ ──────────────────────────────────────
function Test-Server {
    try {
        $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        return ($null -ne $conn)
    } catch { return $false }
}

# ── تشغيل البرنامج ──────────────────────────────────────────
function Start-App {
    if (-not (Test-Server)) {
        Start-Process "cmd" -ArgumentList "/c npx serve -p $Port `"$AppDir`" > nul 2>&1" -WindowStyle Hidden
        Start-Sleep -Seconds 2
    }
    if (Test-Path $Chrome) {
        Start-Process $Chrome $AppURL
    } else {
        Start-Process $AppURL
    }
    $global:AppRunning = $true
    Write-Host "$(Get-Date -f 'HH:mm:ss') — البرنامج شغّل ✅"
}

# ── إيقاف البرنامج ──────────────────────────────────────────
function Stop-App {
    # إيقاف السيرفر
    try {
        $pids = (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue).OwningProcess
        foreach ($p in $pids) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }
    } catch {}

    # إغلاق Chrome
    Get-Process "chrome" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

    $global:AppRunning = $false
    Write-Host "$(Get-Date -f 'HH:mm:ss') — البرنامج أُغلق 🔒"
}

# ── البداية ──────────────────────────────────────────────────
Write-Host "=== مراقب مفتاح USB — الراية الزرقاء ==="
Write-Host "ابحث عن: $KeyFileName على فلاشة USB"

if (Test-Key) {
    Write-Host "المفتاح موجود — تشغيل البرنامج..."
    Start-App
} else {
    Write-Host "لا يوجد مفتاح — انتظار..."
}

# ── حلقة المراقبة الرئيسية ───────────────────────────────────
while ($true) {
    $keyNow = Test-Key

    if ($keyNow -and -not $global:AppRunning) {
        Write-Host "$(Get-Date -f 'HH:mm:ss') — تم توصيل المفتاح 🔑"
        Start-App
    }
    elseif (-not $keyNow -and $global:AppRunning) {
        Write-Host "$(Get-Date -f 'HH:mm:ss') — تم نشل المفتاح ⚠️"
        Stop-App
    }

    Start-Sleep -Seconds 2
}
