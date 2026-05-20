# ملف استئناف المحادثة — الراية الزرقاء
## للاستخدام في المحادثة الجديدة

---

## موقع الملفات
```
C:\Users\user\Desktop\ب رنامح\
├── raya_odoo.html        ← البرنامج الرئيسي (~807 KB, ~13410 سطر) ✅ محفوظ
├── raya_guard.ps1        ← مراقب USB
├── raya_guard.vbs        ← مشغّل صامت
├── raya_key.txt          ← مفتاح USB
└── .claude\launch.json   ← سيرفر المعاينة (port 3333, name: raya)
```

---

## ما تم إنجازه — مكتمل 100% (الإصدار 10.0)

### 1–23. الميزات الأساسية ✅
USB، شجرة حسابات، فواتير، مصروفات، سند قبض، Dashboard، P&L، كشوفات، ميزانية، أستاذ، زبائن، موردون، مسير رواتب

### 24. صفحة المصروفات — حية ✅
`renderExpensesPage()` — KPIs حية — فلتر بالتاريخ — تصدير Excel

### 25. صفحة الصيانة — حية ✅
`renderMaintenancePage()` — فلاتر الحالة — `completeMaint()` / `deleteMaint()` / `saveMaintenance()`

### 26. فلترة المصروفات بالتاريخ ✅ (جلسة 2026-05-20)
- حقلا `exp-filter-from` / `exp-filter-to` في شريط فوق جدول المصروفات
- `renderExpensesPage()` يحترم الفلتر تلقائياً
- زر "كل الفترات" لمسح الفلتر

### 27. تصدير Excel — مصروفات وصيانة ✅ (جلسة 2026-05-20)
- `exportExpensesExcel()` — CSV بـ BOM عربي — يحترم فلتر التاريخ
- `exportMaintExcel()` — CSV كامل لطلبات الصيانة

### 28. طباعة تقرير الصيانة ✅ (جلسة 2026-05-20)
- `printMaintReport()` — نافذة طباعة مستقلة مع KPIs وجدول كامل

### 29. نسخ احتياطي / استعادة حقيقية ✅ (جلسة 2026-05-20)
- `backupDataJSON()` — تحميل JSON شامل لكل البيانات
- `restoreDataJSON(input)` — استعادة كاملة مع إعادة تحميل الصفحة
- أزرار الإعدادات مفعّلة فعلياً

### 30. Persistence — localStorage ✅ (جلسة 2026-05-20) — الأهم
- `saveToStorage()` / `loadFromStorage()` — مفتاح `raya_blue_v10`
- كل العمليات (saveExpense, saveMaintenance, saveCustomer, saveSupplier, runPayroll, saveSaleInv...) تستدعي `saveToStorage()` تلقائياً بعد التنفيذ
- Auto-save كل 60 ثانية
- البيانات لا تضيع عند إغلاق المتصفح أو إعادة التحميل ✅
- محقَّق: 6 طلبات صيانة + 7 قيود + 8 زبائن محفوظة في localStorage

### 31. Global Error Handler ✅ (جلسة 2026-05-20)
- `window.addEventListener('error', ...)` — يسجّل الأخطاء في console
- `window.addEventListener('unhandledrejection', ...)` — يسجّل Promise errors

---

## الدوال الحيوية

```javascript
go('dashboard')      → renderDashboard()
go('income')         → renderIncomeStatement()
go('customers')      → renderCustomersPage()
go('suppliers')      → renderSuppliersPage()
go('trial')          → renderTrialBalance()
go('balance-sheet')  → renderBalanceSheet()
go('ledger')         → renderLedger()
go('sales')          → renderSalesPage()
go('purchases')      → renderPurchasesPage()
go('expenses')       → renderExpensesPage()    ✅ حي + فلتر تاريخ
go('maintenance')    → renderMaintenancePage() ✅ حي

saveExpense()         → JOURNAL + renderExpensesPage() + saveToStorage()
saveMaintenance()     → MAINT_DB + renderMaintenancePage() + saveToStorage()
saveCustomer()        → CUSTOMERS_DB + renderCustomersPage() + saveToStorage()
saveSupplier()        → SUPPLIERS_DB + renderSuppliersPage() + saveToStorage()
runPayroll()          → PAYROLL_RECORDS + renderPayrollTab() + saveToStorage()
saveSaleInv()         → JOURNAL + renderSalesPage() + saveToStorage()
exportExpensesExcel() → CSV download (يحترم فلتر التاريخ)
exportMaintExcel()    → CSV download
printMaintReport()    → نافذة طباعة HTML
backupDataJSON()      → JSON download شامل
restoreDataJSON(inp)  → استعادة + reload
saveToStorage()       → localStorage['raya_blue_v10']
loadFromStorage()     → يُسترجع عند تحميل الصفحة
```

---

## مواقع الدوال المهمة

```
السطر ~95:        CSS — .page.active { animation }
السطر ~2031:      page-expenses HTML — فلتر تاريخ + جدول
السطر ~2044:      page-maintenance HTML — فلاتر + جدول
السطر ~3919:      m-maintenance modal
السطر ~4939:      go() — كل hooks التنقل
السطر ~6172:      EMPLOYEES[]
السطر ~6711:      ACCOUNTS_DB
السطر ~6833:      SUPPLIERS_DB
السطر ~6863:      CUSTOMERS_DB
السطر ~10281:     openExpenseModal() / saveExpense()
السطر ~10954:     renderCustomersPage()
السطر ~11030:     renderSuppliersPage()
السطر ~12086:     MAINT_DB[] — 6 طلبات أولية
السطر ~12099:     renderExpensesPage()
السطر ~12168:     renderMaintenancePage()
السطر ~12336:     saveToStorage() / loadFromStorage()   ← جديد
السطر ~12398:     backupDataJSON() / restoreDataJSON()  ← جديد
السطر ~12429:     exportExpensesExcel() / exportMaintExcel() / _downloadCSV() ← جديد
السطر ~12504:     printMaintReport() ← جديد
السطر ~12556:     Global error handler ← جديد
السطر ~12565:     Auto-save IIFE + loadFromStorage() ← جديد
```

---

## القواعد التقنية

1. **Node.js دائماً** لتعديل الملف — لا Edit tool للنصوص العربية
2. **لا `\n` أو `\r\n` داخل template literals** في patch scripts — تُحوَّل لـ newlines حرفية تكسر الـ JS
3. **تحقق syntax:** استخرج script الثاني وشغّل `node --check _temp.js`
4. **localStorage:** مفتاح `raya_blue_v10` — يُحمَّل تلقائياً عند بدء الصفحة
5. **سيرفر:** `preview_start` باسم `raya` — `http://localhost:3333/raya_odoo.html`
6. **كلمة مرور:** `admin` / `123456`
7. **preview_eval** يعمل في isolated context لا يرى JS variables — استخدم DOM queries للتحقق

---

## ما تبقى

- **لا شيء جوهري** — النظام مكتمل ومحمي ومستمر بين الجلسات
- تحسينات اختيارية مستقبلية: فلترة الصيانة بالتاريخ، تصدير قائمة الدخل PDF

---

*تم الحفظ: 2026-05-20 | الإصدار: 10.0 | الحجم: ~807 KB | الأسطر: ~13410*
