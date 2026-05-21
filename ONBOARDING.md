# مشروع الراية الزرقاء — نظام المحاسبة

## الملف الرئيسي
`C:\Users\user\Desktop\ب رنامح\raya_odoo.html`

## الريبو
`https://github.com/bflag2997-beep/raya-accounting-system.git` (master)

## وصف المشروع
برنامج محاسبة متكامل لشركة بيع مولدات كهربائية في العراق. ملف HTML واحد يعمل مع Node.js server للمزامنة الفورية بين المستخدمين.

- **السيرفر:** port 3333 — `http://localhost:3333/raya_odoo.html`
- **البيانات:** `D:\raya_data\raya_data.json`
- **localStorage key:** `raya_blue_v10`
- **تسجيل الدخول:** admin / 123456

## الإصدار الحالي: v22

### ما تم بناؤه
- 41 زبون حقيقي (CUSTOMERS_DB، accountCode: '1511')
- 28 نوع مولد: Perkins×17, Baudouin×7, Isuzu×4 (INV_ITEMS + SALE_ITEMS_DB)
- SERIALS_DB: تتبع الأرقام التسلسلية
- شجرة الحسابات تُظهر الزبائن تحت 1511/151
- USERS_DB: 3 مستخدمين — نظام صلاحيات كامل (8 أدوار، 4 إجراءات لكل وحدة)
- applyPermissionsUI() + hasPerm() + تطبيق في go()
- INSTALLMENTS_DB + renderInstallmentsPage() + payInstallment() + saveInstallmentContract()
- renderReceiptsPage() ديناميكية
- saveReceipt يُقلّل debt الزبون
- مزامنة SSE فورية بين المستخدمين
- قسم الصيانة نظيف (لا بيانات تجريبية)

## قواعد تقنية حرجة — يجب الالتزام بها
1. **دائماً Node.js patch scripts** — لا تستخدم Edit tool مباشرة على raya_odoo.html
2. **لا template literals مع `\n`** في patch scripts — استخدم `array.join('\n')` بدلاً منها
3. **لا Edit tool** على ملف قُرئ في جلسة سابقة (stale cache يُكتب فوق التغييرات)
4. بعد كل patch: تحقق بـ `grep` أن النص المُضاف موجود في الملف
5. بعد كل patch ناجح: `git add raya_odoo.html && git commit && git push`

## كيفية كتابة patch script
```javascript
const fs = require('fs');
const FILE = 'C:\\Users\\user\\Desktop\\ب رنامح\\raya_odoo.html';
let html = fs.readFileSync(FILE, 'utf8');

function applyPatch(label, oldStr, newStr) {
  if (html.indexOf(oldStr) === -1) { console.error('FAIL: ' + label); process.exit(1); }
  html = html.replace(oldStr, newStr);
  console.log('OK: ' + label);
}

// مثال:
applyPatch('وصف التغيير',
  'النص القديم الذي سيُستبدل',
  'النص الجديد'
);

fs.writeFileSync(FILE, html, 'utf8');
```

## المرحلة القادمة (Phase 2)
- إضافة قطع الغيار والإكسسوارات — `trackSerial: false` — المستخدم سيرسل قائمة البيانات

## هيكل البيانات الرئيسية
```
CUSTOMERS_DB[]     — الزبائن
SUPPLIERS_DB[]     — الموردون
INV_ITEMS[]        — المخزون (مولدات)
SALE_ITEMS_DB[]    — أصناف المبيعات
SERIALS_DB[]       — الأرقام التسلسلية
JOURNAL_ENTRIES_DATA[] — القيود المحاسبية
MAINT_DB[]         — طلبات الصيانة
INSTALLMENTS_DB[]  — عقود التقسيط
USERS_DB[]         — المستخدمون
PERM_MODULES[]     — وحدات الصلاحيات (11 وحدة)
ROLE_TEMPLATES{}   — قوالب الأدوار (8 أدوار)
```
