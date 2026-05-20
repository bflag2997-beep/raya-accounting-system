' raya_guard.vbs — مشغّل صامت لسكريبت المراقبة
' يشتغل بدون نافذة PowerShell

Dim objShell
Set objShell = CreateObject("WScript.Shell")
objShell.Run "powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File """ & _
    "C:\Users\user\Desktop\ب رنامح\raya_guard.ps1""", 0, False
Set objShell = Nothing
