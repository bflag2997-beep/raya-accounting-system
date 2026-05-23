const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, TableOfContents,
  LevelFormat
} = require('docx');
const fs = require('fs');

// ── Colours ────────────────────────────────────────────────────────────────
const PURPLE = "714B67";
const TEAL   = "017E84";
const WHITE  = "FFFFFF";
const LIGHT_PURPLE = "F3EEF1";
const LIGHT_TEAL   = "EEF7F7";
const GRAY_BG = "F5F5F5";

// ── RTL paragraph defaults ─────────────────────────────────────────────────
function rtlPara(children, opts) {
  opts = opts || {};
  return new Paragraph(Object.assign({
    children: children,
    bidirectional: true,
    alignment: opts.align || AlignmentType.RIGHT,
    spacing: { before: opts.spaceBefore || 80, after: opts.spaceAfter || 80 }
  }, opts.extra || {}));
}

// ── Arabic text run ────────────────────────────────────────────────────────
function ar(text, opts) {
  opts = opts || {};
  return new TextRun({
    text: text,
    font: "Arial",
    size: opts.size || 22,
    bold: opts.bold || false,
    color: opts.color || undefined,
    rtl: true
  });
}

function code(text) {
  return new TextRun({ text: text, font: "Courier New", size: 18, rtl: false });
}

// ── Heading helpers ────────────────────────────────────────────────────────
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text: text, font: "Arial", size: 36, bold: true, color: PURPLE, rtl: true })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text: text, font: "Arial", size: 28, bold: true, color: TEAL, rtl: true })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text: text, font: "Arial", size: 24, bold: true, color: PURPLE, rtl: true })]
  });
}

function para(text, opts) {
  return rtlPara([ar(text, opts)], opts);
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 40, after: 40 },
    children: [ar(text)]
  });
}

function numItem(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 40, after: 40 },
    children: [ar(text)]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE } },
    children: []
  });
}

// ── Table helpers ──────────────────────────────────────────────────────────
const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function headerCell(text, widthDxa) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    borders: borders,
    shading: { fill: PURPLE, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: text, font: "Arial", size: 20, bold: true, color: WHITE, rtl: true })]
    })]
  });
}

function dataCell(text, widthDxa, opts) {
  opts = opts || {};
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    borders: borders,
    shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    children: [new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.RIGHT,
      children: [opts.useCode
        ? code(text)
        : new TextRun({ text: text, font: "Arial", size: opts.size || 20, bold: opts.bold || false, color: opts.color || undefined, rtl: true })]
    })]
  });
}

function makeTable(headers, rows, colWidths) {
  var total = colWidths.reduce(function(s, w) { return s + w; }, 0);
  var tableRows = [];

  // Header row
  var hCells = headers.map(function(h, i) { return headerCell(h, colWidths[i]); });
  tableRows.push(new TableRow({ tableHeader: true, children: hCells }));

  // Data rows
  rows.forEach(function(row, ri) {
    var bg = ri % 2 === 0 ? undefined : GRAY_BG;
    var cells = row.map(function(cell, ci) {
      var opts = { bg: bg };
      if (typeof cell === 'object' && cell.bold) { opts.bold = true; }
      var txt = typeof cell === 'object' ? cell.text : cell;
      return dataCell(txt, colWidths[ci], opts);
    });
    tableRows.push(new TableRow({ children: cells }));
  });

  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: tableRows,
    margins: { top: 120, bottom: 120 }
  });
}

// ── COVER PAGE CONTENT ─────────────────────────────────────────────────────
function coverPage() {
  return [
    new Paragraph({ spacing: { before: 2000, after: 200 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 100 },
      children: [new TextRun({ text: "نظام الراية الزرقاء", font: "Arial", size: 72, bold: true, color: PURPLE, rtl: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: TEAL } },
      children: [new TextRun({ text: "النظام المحاسبي المتكامل لشركات المولدات الكهربائية", font: "Arial", size: 36, bold: false, color: TEAL, rtl: true })]
    }),
    new Paragraph({ spacing: { before: 600, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "دليل التوثيق الشامل", font: "Arial", size: 28, color: "555555", rtl: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "v27", font: "Courier New", size: 48, bold: true, color: PURPLE })] }),
    new Paragraph({ spacing: { before: 800, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "21 مايو 2026", font: "Arial", size: 24, color: "888888", rtl: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "فريق التطوير — شركة الراية الزرقاء", font: "Arial", size: 22, color: "666666", rtl: true })] }),
    pageBreak()
  ];
}

// ── CHAPTER 1 ──────────────────────────────────────────────────────────────
function chapter1() {
  return [
    h1("الفصل الأول: نظرة عامة على النظام"),
    h2("1.1 مقدمة"),
    para("نظام الراية الزرقاء هو نظام محاسبي متكامل مبني بتقنية الويب (Single-Page Application) مخصص لشركات بيع وصيانة المولدات الكهربائية في العراق. يعتمد النظام المحاسبي الموحد العراقي الصادر عن وزارة المالية 2011.", { size: 22 }),

    h2("1.2 المواصفات التقنية"),
    makeTable(
      ["المواصفة", "القيمة"],
      [
        ["نوع التطبيق", "Single-Page Application (HTML/CSS/JavaScript)"],
        ["المتصفح المدعوم", "Chromium / Chrome / Edge"],
        ["قاعدة البيانات", "PostgreSQL 16"],
        ["الخادم", "Node.js + Express"],
        ["المنفذ الافتراضي", "3333"],
        ["الاتجاه", "RTL (يمين إلى يسار)"],
        ["اللغة", "العربية"],
        ["المسار الرئيسي", "D:\\raya_blue\\"]
      ],
      [4503, 4503]
    ),

    h2("1.3 مبادئ التصميم"),
    bullet("القيد المزدوج: كل عملية مالية تولد قيداً متوازناً (مدين = دائن)"),
    bullet("النظام المحاسبي العراقي: المجموعة 1 موجودات | 2 مطلوبات | 3 استخدامات | 4 إيرادات | 5-9 خاصة"),
    bullet("RBAC: نظام صلاحيات متدرج (مشاهدة / إنشاء / تعديل / حذف)"),
    bullet("البيانات الحية: جميع الأرقام تُحسب من JOURNAL_ENTRIES_DATA في الوقت الفعلي"),
    pageBreak()
  ];
}

// ── CHAPTER 2 ──────────────────────────────────────────────────────────────
function chapter2() {
  return [
    h1("الفصل الثاني: هيكل النظام والمكونات"),
    h2("2.1 ملفات النظام"),
    makeTable(
      ["الملف", "الوصف", "الحجم التقريبي"],
      [
        ["raya_odoo.html", "التطبيق الكامل (HTML + CSS + JS)", "~932 KB"],
        ["server.js", "خادم Node.js + API PostgreSQL", "~23 KB"],
        ["package.json", "تبعيات Node.js", "1 KB"],
        ["db_schema.sql", "مخطط قاعدة البيانات", "~196 KB"]
      ],
      [2800, 4200, 2006]
    ),

    h2("2.2 قواعد البيانات في الذاكرة"),
    makeTable(
      ["المتغير", "المحتوى"],
      [
        ["JOURNAL_ENTRIES_DATA", "جميع القيود المحاسبية"],
        ["CUSTOMERS_DB", "بيانات الزبائن"],
        ["SUPPLIERS_DB", "بيانات المجهزين"],
        ["MAINT_DB", "طلبات الصيانة"],
        ["INV_ITEMS", "أصناف المخزون"],
        ["PAYROLL_RECORDS", "سجلات الرواتب"],
        ["INSTALLMENTS_DB", "خطط الأقساط"],
        ["EMPLOYEES", "بيانات الموظفين"],
        ["ACCOUNTS_DB", "شجرة الحسابات"],
        ["WF_ORDERS", "أوامر سير العمل"]
      ],
      [3000, 6006]
    ),

    h2("2.3 دورة حفظ البيانات"),
    numItem("المستخدم يُدخل البيانات → يضغط حفظ"),
    numItem("دالة JS تتحقق من الصحة (validation)"),
    numItem("البيانات تُضاف للمصفوفة في الذاكرة"),
    numItem("saveToStorage() → localStorage (raya_blue_v10)"),
    numItem("_syncToServer() → POST /api/data → PostgreSQL"),
    pageBreak()
  ];
}

// ── CHAPTER 3 ──────────────────────────────────────────────────────────────
function chapter3() {
  return [
    h1("الفصل الثالث: وحدات النظام"),

    h2("3.1 وحدة المحاسبة"),
    para("الصفحات: شجرة الحسابات — القيد اليومي — دفتر الأستاذ — ميزان المراجعة — قائمة الدخل — الميزانية العمومية"),

    h3("القيود التلقائية المُنشأة بالنظام"),
    makeTable(
      ["العملية", "مدين", "دائن"],
      [
        ["بيع بالكاش", "1611 الصندوق", "4111 إيرادات المبيعات"],
        ["بيع آجل", "151 الذمم المدينة", "4111 إيرادات المبيعات"],
        ["قبض نقدي", "1611 الصندوق", "151 الذمم المدينة"],
        ["قبض إلكتروني", "1621 البنك", "151 الذمم المدينة"],
        ["رواتب", "5311 مصروف الرواتب", "2241 رواتب مستحقة"],
        ["صيانة مكتملة", "5131 مواد الصيانة", "1611 الصندوق"],
        ["تسوية مخزون (+)", "1511 المخزون", "5999 تسوية مخزون"],
        ["تسوية مخزون (-)", "5999 تسوية مخزون", "1511 المخزون"]
      ],
      [3002, 3002, 3002]
    ),

    h2("3.2 وحدة المبيعات والزبائن"),
    bullet("saveSale(): حفظ فاتورة بيع مع إنشاء قيد محاسبي تلقائي"),
    bullet("saveReceipt(): حفظ وصل قبض مع قيد مدين/دائن"),
    bullet("printSaleInvoice(id): طباعة فاتورة مبيعات فردية بتنسيق احترافي"),
    bullet("showCustStatement(id): عرض كشف حساب الزبون الكامل"),

    h2("3.3 وحدة المخزون والمشتريات"),
    bullet("saveStockIn(): استلام مخزون + تحديث الكمية + قيد محاسبي"),
    bullet("saveInvAdjustment(): تسوية جرد مع قيد تسوية تلقائي"),
    bullet("renderLowStock(): عرض الأصناف دون الحد الأدنى"),

    h2("3.4 وحدة الصيانة والضمانات"),
    makeTable(
      ["نوع الطلب", "الوصف", "قيد مالي"],
      [
        ["corrective", "صيانة تصحيحية", "يُنشأ عند الإغلاق"],
        ["preventive", "صيانة وقائية", "اختياري"],
        ["warranty", "ضمان", "لا يُنشأ قيد مالي"],
        ["annual", "عقد صيانة سنوي", "حسب العقد"]
      ],
      [3002, 3002, 3002]
    ),

    h2("3.5 وحدة الموارد البشرية"),
    para("جدول الموظفين وصافي الرواتب (+ 10% بدل حضور):"),
    makeTable(
      ["الكود", "الاسم", "الراتب الأساسي", "صافي الراتب"],
      [
        ["EMP-001", "حسين علي", "850,000", "935,000"],
        ["EMP-002", "كريم محمد", "850,000", "935,000"],
        ["EMP-003", "سارة أحمد", "1,200,000", "1,320,000"],
        ["EMP-004", "عمر يوسف", "950,000", "1,045,000"],
        ["EMP-005", "نور إبراهيم", "750,000", "825,000"],
        [{ text: "المجموع", bold: true }, { text: "", bold: true }, { text: "4,600,000", bold: true }, { text: "5,060,000", bold: true }]
      ],
      [2000, 3000, 2500, 2506]
    ),
    pageBreak()
  ];
}

// ── CHAPTER 4 ──────────────────────────────────────────────────────────────
function chapter4() {
  return [
    h1("الفصل الرابع: نظام الصلاحيات (RBAC)"),

    h2("4.1 المستخدمون الافتراضيون"),
    makeTable(
      ["المستخدم", "كلمة المرور", "الدور", "الصلاحيات"],
      [
        ["admin", "123456", "مدير", "كامل — جميع الوحدات"],
        ["accountant", "acc2026", "محاسب", "محاسبة + تقارير"],
        ["sales", "sales123", "مبيعات", "مبيعات + زبائن + صيانة (عرض)"],
        ["viewer", "view123", "مشاهد", "عرض فقط بدون تعديل"]
      ],
      [2000, 2000, 2000, 3006]
    ),

    h2("4.2 مصفوفة صلاحيات مستخدم المبيعات"),
    makeTable(
      ["الوحدة", "مشاهدة", "إنشاء", "تعديل", "حذف"],
      [
        ["المبيعات", "✅", "✅", "❌", "❌"],
        ["الزبائن", "✅", "✅", "❌", "❌"],
        ["الصيانة", "✅", "❌", "❌", "❌"],
        ["المحاسبة", "❌", "❌", "❌", "❌"],
        ["الموارد البشرية", "❌", "❌", "❌", "❌"],
        ["المشتريات", "❌", "❌", "❌", "❌"]
      ],
      [3006, 1500, 1500, 1500, 1500]
    ),

    h2("4.3 آلية التحقق من الصلاحيات"),
    para("دالة go(page) تتحقق من currentUser.perms[module].view قبل تفعيل الصفحة. عند الرفض: تظهر إشعار خطر \"لا تملك صلاحية...\" ولا تُفعّل الصفحة."),
    pageBreak()
  ];
}

// ── CHAPTER 5 ──────────────────────────────────────────────────────────────
function chapter5() {
  return [
    h1("الفصل الخامس: الميزات الجديدة (v27)"),

    h2("5.1 وضع الظلام (Dark Mode)"),
    bullet("زر 🌙 في الشريط العلوي"),
    bullet('يُفعّل CSS class "dark-mode" على body'),
    bullet("متغيرات CSS مخصصة: خلفية #1a1a2e، بطاقات #16213e"),
    bullet("يُحفظ في localStorage ويُستعاد عند التحميل"),
    bullet("الدالة: toggleDarkMode() / initDarkMode()"),

    h2("5.2 البحث العالمي (Ctrl+K)"),
    bullet("اختصار لوحة مفاتيح: Ctrl+K أو زر 🔍 في الشريط العلوي"),
    bullet("نافذة منبثقة بحث في: الزبائن، المجهزين، الصيانة، القيود المحاسبية"),
    bullet("يُغلق بـ Escape أو النقر خارج النافذة"),

    h2("5.3 Badges الديناميكية"),
    makeTable(
      ["العنصر", "المصدر", "معرف HTML"],
      [
        ["الصيانة المفتوحة", "MAINT_DB.filter(status==='open').length", "badge-maintenance"],
        ["الأقساط المتأخرة", "INSTALLMENTS_DB.filter(dueDate < today)", "badge-installments"],
        ["المخزون المنخفض", "INV_ITEMS.filter(qty < min).length", "badge-low-stock"]
      ],
      [3002, 3500, 2504]
    ),

    h2("5.4 طباعة فاتورة المبيعات"),
    bullet("زر 🖸️ في كل سطر بفواتير المبيعات"),
    bullet("يفتح نافذة طباعة HTML منسّقة بالعربية"),
    bullet("يتضمن: بيانات الشركة، رقم الفاتورة، التاريخ، الزبون، البنود، الإجمالي"),
    bullet("الدالة: printSaleInvoice(entryId)"),

    h2("5.5 تنبيهات المواعيد النهائية"),
    bullet("تُشغَّل تلقائياً عند DOMContentLoaded بعد 2 ثانية"),
    bullet("أقساط متأخرة (dueDate < today)"),
    bullet("ضمانات تنتهي خلال 30 يوم"),
    bullet("عقود سنوية تنتهي خلال 30 يوم"),

    h2("5.6 مرفقات الصيانة"),
    bullet("زر 📎 في كل طلب صيانة"),
    bullet("رفع صور (image/*) وملفات PDF / Word"),
    bullet("الحد الأقصى للحجم: 2 ميغابايت"),
    bullet("التخزين: base64 في MAINT_DB[].attachments"),
    pageBreak()
  ];
}

// ── CHAPTER 6 ──────────────────────────────────────────────────────────────
function chapter6() {
  return [
    h1("الفصل السادس: الإصلاحات التقنية (v27 — 12 إصلاح)"),

    h2("6.1 إصلاحات حفظ البيانات (5 إصلاحات)"),
    makeTable(
      ["رقم", "الدالة", "المشكلة", "الحل"],
      [
        ["1", "saveJVNew()", "القيود تظهر لكن لا تُحفظ في JOURNAL_ENTRIES_DATA", "إضافة منطق تجميع السطور + التحقق من التوازن"],
        ["2", "saveReceipt()", "وصل القبض بدون قيد محاسبي", "إنشاء قيد 1611/1621 + 151"],
        ["3", "saveInvAdjustment()", "لا تُعدّل qty ولا تُنشئ قيد", "تحديث inv.qty + قيد ADJ"],
        ["4", "saveToStorage()", "INV_ITEMS لا يُحفظ في localStorage", "إضافة invItems لـ payload"],
        ["5", "confirmOrder()", "لا يُضيف إلى WF_ORDERS", "push + saveToStorage()"]
      ],
      [600, 2500, 3200, 2706]
    ),

    h2("6.2 إصلاحات الوظائف المفقودة (7 إصلاحات)"),
    makeTable(
      ["رقم", "المشكلة", "الحل"],
      [
        ["6", "saveWarranty() مفقودة كلياً", "تمت إضافتها + IDs للنموذج"],
        ["7", "saveAnnualContract() مفقودة كلياً", "تمت إضافتها + IDs للنموذج"],
        ["8", "saveStockIn() + selects مشفّرة", "إعادة كتابة كاملة + selects ديناميكية"],
        ["9", "4 سطور HTML معلّقة بعد m-installment", "تمت إزالتها"],
        ["10", "adj-item select لا يُملأ من INV_ITEMS", "renderAdjItemSelect() مربوطة بـ openM"],
        ["11", "no-customer select لا يُملأ من CUSTOMERS_DB", "renderOrderCustomerSelect() مربوطة"],
        ["12", "completeMaint() لا تُنشئ قيداً", "إضافة قيد 5131/1611"]
      ],
      [600, 4000, 4406]
    ),
    pageBreak()
  ];
}

// ── CHAPTER 7 ──────────────────────────────────────────────────────────────
function chapter7() {
  return [
    h1("الفصل السابع: الاختبارات التلقائية"),

    h2("7.1 مجموعة الاختبارات العميقة (TC_DEEP_001-010)"),
    para("10 اختبارات Playwright E2E تغطي الوظائف الجوهرية — جميعها تجتاز بنجاح."),
    makeTable(
      ["الكود", "الاسم", "ما يختبره"],
      [
        ["TC_DEEP_001", "Create Balanced Journal Entry", "إنشاء قيد متوازن والتحقق من الحفظ"],
        ["TC_DEEP_002", "Add Customer And Verify", "إضافة زبون والتحقق من CUSTOMERS_DB"],
        ["TC_DEEP_003", "Add Inventory Item", "إضافة صنف مع qty/cost/price"],
        ["TC_DEEP_004", "Create Maintenance Request", "إنشاء طلب صيانة بالحالة open"],
        ["TC_DEEP_005", "Journal Unbalanced Error", "قيد غير متوازن + بيان فارغ → خطأ"],
        ["TC_DEEP_006", "Add Supplier", "إضافة مجهز بجميع الحقول"],
        ["TC_DEEP_007", "Payroll Calculation", "صحة حساب الرواتب + قيد 5311/2241"],
        ["TC_DEEP_008", "RBAC Sales User", "مستخدم مبيعات محجوب عن المحاسبة/HR"],
        ["TC_DEEP_009", "Trial Balance Equation", "مجموع مدين = مجموع دائن"],
        ["TC_DEEP_010", "Maintenance Complete Journal", "completeMaint → قيد 5131/1611 متوازن"]
      ],
      [2400, 3000, 3606]
    ),

    h2("7.2 متطلبات تشغيل الاختبارات"),
    numItem("Python 3.12+"),
    numItem("pip install playwright"),
    numItem("playwright install chromium"),
    numItem("خادم Node.js يعمل على المنفذ 3333"),
    numItem("PYTHONIOENCODING=utf-8 python TC_DEEP_001_Create_Balanced_Journal_Entry.py"),
    pageBreak()
  ];
}

// ── CHAPTER 8 ──────────────────────────────────────────────────────────────
function chapter8() {
  return [
    h1("الفصل الثامن: دليل التشغيل والصيانة"),

    h2("8.1 تشغيل النظام"),
    numItem("فتح موجه الأوامر في D:\\raya_blue\\"),
    numItem("تشغيل الخادم: node server.js"),
    numItem("فتح المتصفح: http://localhost:3333/raya_odoo.html"),
    numItem("تسجيل الدخول: admin / 123456"),

    h2("8.2 النسخ الاحتياطي"),
    bullet("تلقائي: يتزامن مع PostgreSQL عبر _syncToServer() بعد كل تغيير"),
    bullet("يدوي: زر 💾 في الشريط العلوي → يُنزّل ملف JSON"),
    bullet("استعادة: إعدادات النظام → استعادة من نسخة احتياطية"),

    h2("8.3 متغيرات البيئة (server.js)"),
    makeTable(
      ["المتغير", "القيمة الافتراضية", "الوصف"],
      [
        ["PORT", "3333", "منفذ الخادم"],
        ["DB_HOST", "localhost", "عنوان PostgreSQL"],
        ["DB_PORT", "5432", "منفذ PostgreSQL"],
        ["DB_NAME", "raya_db", "اسم قاعدة البيانات"],
        ["DB_USER", "postgres", "مستخدم قاعدة البيانات"],
        ["DB_PASS", "Ihsaan.1997@@", "كلمة المرور"]
      ],
      [2500, 2500, 4006]
    ),
    pageBreak()
  ];
}

// ── CHAPTER 9 ──────────────────────────────────────────────────────────────
function chapter9() {
  return [
    h1("الفصل التاسع: خارطة الطريق المستقبلية"),

    h2("9.1 ميزات مقترحة للإصدارات القادمة"),
    bullet("تقرير تدفق النقد (Cash Flow Statement)"),
    bullet("إدارة الضرائب والقيمة المضافة"),
    bullet("ربط بارزودة البنك (Bank Reconciliation)"),
    bullet("تقارير مقارنة بين الفترات"),
    bullet("دعم العملات الأجنبية (USD / EUR)"),
    bullet("تطبيق موبايل (PWA)"),
    bullet("نسخة متعددة الفروع"),
    bullet("API خارجي للتكامل مع أنظمة أخرى"),

    h2("9.2 تحسينات الأداء المقترحة"),
    bullet("Virtual scrolling للجداول الكبيرة"),
    bullet("IndexedDB بدلاً من localStorage"),
    bullet("Service Worker للعمل بدون إنترنت"),
    bullet("ضغط بيانات localStorage"),

    divider(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: "نهاية الوثيقة", font: "Arial", size: 24, bold: true, color: PURPLE, rtl: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "شركة الراية الزرقاء — جميع الحقوق محفوظة 2026", font: "Arial", size: 20, color: "888888", rtl: true })]
    })
  ];
}

// ── BUILD DOCUMENT ─────────────────────────────────────────────────────────
var allContent = [].concat(
  coverPage(),
  [new TableOfContents("فهرس المحتويات", { hyperlink: true, headingStyleRange: "1-3" })],
  [pageBreak()],
  chapter1(),
  chapter2(),
  chapter3(),
  chapter4(),
  chapter5(),
  chapter6(),
  chapter7(),
  chapter8(),
  chapter9()
);

var doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.RIGHT,
          style: { paragraph: { indent: { right: 360, hanging: 360 }, bidirectional: true } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.RIGHT,
          style: { paragraph: { indent: { right: 360, hanging: 360 }, bidirectional: true } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, rtl: true } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: PURPLE },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0, bidirectional: true }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1, bidirectional: true }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: PURPLE },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2, bidirectional: true }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PURPLE } },
          children: [
            new TextRun({ text: "نظام الراية الزرقاء", font: "Arial", size: 18, bold: true, color: PURPLE, rtl: true }),
            new TextRun({ text: "  —  النظام المحاسبي المتكامل", font: "Arial", size: 16, color: "888888", rtl: true })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: TEAL } },
          children: [
            new TextRun({ text: "صفحة ", font: "Arial", size: 18, color: "888888", rtl: true }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18 }),
            new TextRun({ text: " من ", font: "Arial", size: 18, color: "888888", rtl: true }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18 }),
            new TextRun({ text: "  —  الراية الزرقاء v27 — 2026", font: "Arial", size: 16, color: "AAAAAA", rtl: true })
          ]
        })]
      })
    },
    children: allContent
  }]
});

Packer.toBuffer(doc).then(function(buffer) {
  fs.writeFileSync("D:/raya_blue/توثيق_نظام_الراية_الزرقاء.docx", buffer);
  console.log("SUCCESS: Document saved.");
}).catch(function(err) {
  console.error("ERROR:", err.message);
  process.exit(1);
});
