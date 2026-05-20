@echo off
chcp 65001 > nul
title نظام الراية الزرقاء — السيرفر
color 0A
echo.
echo  ========================================
echo   نظام الراية الزرقاء - جاري التشغيل...
echo  ========================================
echo.
cd /d "%~dp0"
:start
node server.js
echo.
echo  السيرفر توقف. إعادة تشغيل بعد 3 ثواني...
timeout /t 3 /nobreak > nul
goto start
