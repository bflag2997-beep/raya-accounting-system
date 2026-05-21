// v23 patch: add migrations for demo journal, wfOrders, and customers
const fs = require('fs');
const html = fs.readFileSync('raya_odoo.html', 'utf8');

const migrationCode = [
  "    // مهاجرة v23: حذف القيود المحاسبية التجريبية",
  "    var _demoJvIds = ['JV-001','JV-002','JV-003','JV-004','JV-005','JV-006','JV-007'];",
  "    if (typeof JOURNAL_ENTRIES_DATA !== 'undefined' && JOURNAL_ENTRIES_DATA.some(function(j){ return _demoJvIds.indexOf(j.id) >= 0; })) {",
  "      var _cleanJv = JOURNAL_ENTRIES_DATA.filter(function(j){ return _demoJvIds.indexOf(j.id) < 0; });",
  "      JOURNAL_ENTRIES_DATA.splice(0, JOURNAL_ENTRIES_DATA.length);",
  "      _cleanJv.forEach(function(j){ JOURNAL_ENTRIES_DATA.push(j); });",
  "      try { var _sj=JSON.parse(localStorage.getItem(_RAYA_KEY)||'{}'); _sj.journal=JOURNAL_ENTRIES_DATA; localStorage.setItem(_RAYA_KEY,JSON.stringify(_sj)); } catch(e){}",
  "    }",
  "    // مهاجرة v23: حذف طلبات المبيعات التجريبية",
  "    var _demoSoIds = ['SO-001','SO-002','SO-003','SO-004','SO-005','SO-006','SO-007','SO-008','SO-009'];",
  "    if (typeof WF_ORDERS !== 'undefined' && WF_ORDERS.some(function(o){ return _demoSoIds.indexOf(o.id) >= 0; })) {",
  "      var _cleanSo = WF_ORDERS.filter(function(o){ return _demoSoIds.indexOf(o.id) < 0; });",
  "      WF_ORDERS.splice(0, WF_ORDERS.length);",
  "      _cleanSo.forEach(function(o){ WF_ORDERS.push(o); });",
  "      try { var _sw=JSON.parse(localStorage.getItem(_RAYA_KEY)||'{}'); _sw.wfOrders=WF_ORDERS; localStorage.setItem(_RAYA_KEY,JSON.stringify(_sw)); } catch(e){}",
  "    }",
  "    // مهاجرة v23: حذف الزبائن التجريبيين (بدون accountCode)",
  "    if (typeof CUSTOMERS_DB !== 'undefined' && CUSTOMERS_DB.some(function(c){ return !c.accountCode; })) {",
  "      var _cleanCust = CUSTOMERS_DB.filter(function(c){ return !!c.accountCode; });",
  "      CUSTOMERS_DB.splice(0, CUSTOMERS_DB.length);",
  "      _cleanCust.forEach(function(c){ CUSTOMERS_DB.push(c); });",
  "      try { var _sc=JSON.parse(localStorage.getItem(_RAYA_KEY)||'{}'); _sc.customers=CUSTOMERS_DB; localStorage.setItem(_RAYA_KEY,JSON.stringify(_sc)); } catch(e){}",
  "    }"
].join('\n');

const ANCHOR = [
  "    try { var _s=JSON.parse(localStorage.getItem(_RAYA_KEY)||'{}'||'{'); _s.maint=MAINT_DB; localStorage.setItem(_RAYA_KEY,JSON.stringify(_s)); } catch(e){}",
  "    }",
  "    return true;",
  "  } catch(e) { return false; }"
].join('\n');

const REPLACEMENT = [
  "    try { var _s=JSON.parse(localStorage.getItem(_RAYA_KEY)||'{}'||'{'); _s.maint=MAINT_DB; localStorage.setItem(_RAYA_KEY,JSON.stringify(_s)); } catch(e){}",
  "    }",
  migrationCode,
  "    return true;",
  "  } catch(e) { return false; }"
].join('\n');

if (html.indexOf(ANCHOR) < 0) {
  console.error('ERROR: anchor not found!');
  process.exit(1);
}

const patched = html.replace(ANCHOR, REPLACEMENT);

if (patched === html) {
  console.error('ERROR: no change made!');
  process.exit(1);
}

fs.writeFileSync('raya_odoo.html', patched, 'utf8');
console.log('v23 migration patch applied successfully');
