// v25 patch: cost method per item + serial ops + PostgreSQL sync for invItems
const fs = require('fs');
let html = fs.readFileSync('raya_odoo.html', 'utf8');
let ok = true;

function rep(OLD, NEW, label) {
  const idx = html.indexOf(OLD);
  if (idx < 0) { console.error('NOT FOUND: ' + label); ok = false; return; }
  html = html.slice(0, idx) + NEW + html.slice(idx + OLD.length);
  console.log('OK:', label);
}

// ================================================================
// 1. Add costMethod + trackSerial fields to m-inventory modal
// ================================================================
rep(
  '  <div class="form-row">\n    <div class="form-group"><label>سعر التكلفة (د.ع)</label><input type="number" class="form-control" id="inv-cost" placeholder="0"></div>\n    <div class="form-group"><label>سعر البيع (د.ع)</label><input type="number" class="form-control" id="inv-price" placeholder="0"></div>\n  </div>\n</div>\n<div class="modal-footer">\n  <button class="btn btn-secondary" onclick="closeM(\'m-inventory\')">إلغاء</button>\n  <button class="btn btn-primary" onclick="saveInventoryItem()">💾 حفظ الصنف</button>',
  [
    '  <div class="form-row">',
    '    <div class="form-group"><label>سعر التكلفة (د.ع)</label><input type="number" class="form-control" id="inv-cost" placeholder="0"></div>',
    '    <div class="form-group"><label>سعر البيع (د.ع)</label><input type="number" class="form-control" id="inv-price" placeholder="0"></div>',
    '  </div>',
    '  <div class="form-row">',
    '    <div class="form-group">',
    '      <label style="font-weight:600;margin-bottom:8px;display:block">طريقة تقييم التكلفة</label>',
    '      <div style="display:flex;gap:20px;padding:10px 14px;background:#f8f9fa;border-radius:8px;border:1px solid #e0e0e0">',
    '        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:.9rem">',
    '          <input type="radio" name="inv-cost-method" value="average" id="inv-cm-avg" checked style="accent-color:var(--odoo-blue)">',
    '          <span>وسطي</span>',
    '        </label>',
    '        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:.9rem">',
    '          <input type="radio" name="inv-cost-method" value="fifo" id="inv-cm-fifo" style="accent-color:var(--odoo-blue)">',
    '          <span>FIFO</span>',
    '        </label>',
    '        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:.9rem">',
    '          <input type="radio" name="inv-cost-method" value="batch" id="inv-cm-batch" style="accent-color:var(--odoo-blue)">',
    '          <span>دفعة</span>',
    '        </label>',
    '      </div>',
    '    </div>',
    '    <div class="form-group">',
    '      <label style="font-weight:600;margin-bottom:8px;display:block">تتبع السيريل</label>',
    '      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 14px;background:#f8f9fa;border-radius:8px;border:1px solid #e0e0e0">',
    '        <input type="checkbox" id="inv-track-serial" style="width:18px;height:18px;accent-color:var(--odoo-blue)">',
    '        <span style="font-size:.9rem">تفعيل تتبع رقم السيريل لكل وحدة</span>',
    '      </label>',
    '    </div>',
    '  </div>',
    '</div>',
    '<div class="modal-footer">',
    '  <button class="btn btn-secondary" onclick="closeM(\'m-inventory\')">إلغاء</button>',
    '  <button class="btn btn-primary" onclick="saveInventoryItem()">💾 حفظ الصنف</button>'
  ].join('\n'),
  '1. Add costMethod + trackSerial to modal'
);

// ================================================================
// 2. Update saveInventoryItem() to read new fields + sync
// ================================================================
rep(
  "  if(typeof INV_ITEMS!=='undefined') INV_ITEMS.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price,unit:unit});\n  if(typeof AI_DATA!=='undefined'&&AI_DATA.inventory) AI_DATA.inventory.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price});\n  closeM('m-inventory');\n  notify('تم إضافة الصنف \"'+name+'\" بنجاح ✓','success');\n}",
  [
    "  var costMethod = (document.querySelector('input[name=\"inv-cost-method\"]:checked')||{}).value||'average';",
    "  var trackSerial = document.getElementById('inv-track-serial')?.checked||false;",
    "  if(typeof INV_ITEMS!=='undefined') INV_ITEMS.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price,unit:unit,costMethod:costMethod,trackSerial:trackSerial});",
    "  if(typeof AI_DATA!=='undefined'&&AI_DATA.inventory) AI_DATA.inventory.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price});",
    "  saveToStorage();",
    "  closeM('m-inventory');",
    "  notify('تم إضافة الصنف \"'+name+'\" بنجاح ✓','success');",
    "}"
  ].join('\n'),
  '2. Update saveInventoryItem with costMethod + trackSerial'
);

// ================================================================
// 3. Update renderInvItems to show cost method badge + serial btn
// ================================================================
rep(
  "'<td><button class=\"btn btn-secondary btn-xs\" onclick=\"selectTrackItem('\\''+'it.code+'\\'')\">🔄</button></td></tr>';",
  [
    "'<td style=\"text-align:center\">' +",
    "      '<span class=\"badge\" style=\"font-size:10px;padding:2px 7px;background:' + (it.costMethod==='fifo'?'#dbeafe':it.costMethod==='batch'?'#fef3c7':'#e8f5f6') + ';color:' + (it.costMethod==='fifo'?'#1d4ed8':it.costMethod==='batch'?'#92400e':'var(--odoo-blue)') + '\">' + (it.costMethod==='fifo'?'FIFO':it.costMethod==='batch'?'دفعة':'وسطي') + '</span>' +",
    "    '</td>' +",
    "    '<td style=\"text-align:center\">' +",
    "      (it.trackSerial ? '<button class=\"btn btn-primary btn-xs\" onclick=\"openSerialOps(\\''+it.code+'\\',\\''+it.name.replace(/\\'/g,'')+'\\')\">سيريل</button>' : '<button class=\"btn btn-secondary btn-xs\" onclick=\"selectTrackItem(\\''+it.code+'\\')\">🔄</button>') +",
    "    '</td></tr>';"
  ].join('\n'),
  '3. renderInvItems - add cost badge + serial btn'
);

// Fix table header to add cost method column
rep(
  '<th>السعر</th><th>المخزون</th><th></th>',
  '<th>السعر</th><th>المخزون</th><th>التكلفة</th><th></th>',
  '3b. Add cost method column header'
);

// ================================================================
// 4. Add invItems to server sync payload
// ================================================================
rep(
  "      instDb:    (typeof INSTALLMENTS_DB !== 'undefined' ? INSTALLMENTS_DB : [])\n    });",
  [
    "      instDb:    (typeof INSTALLMENTS_DB !== 'undefined' ? INSTALLMENTS_DB : []),",
    "      invItems:  (typeof INV_ITEMS !== 'undefined' ? INV_ITEMS : [])",
    "    });"
  ].join('\n'),
  '4. Add invItems to server sync payload'
);

// ================================================================
// 5. Handle invItems in _loadFromServer callback
// ================================================================
rep(
  "          if (d.wfOrders && typeof WF_ORDERS !== 'undefined') _srv_merge(WF_ORDERS, d.wfOrders);\n          try { localStorage.setItem('raya_blue_v10', JSON.stringify(d)); } catch(e){}",
  [
    "          if (d.wfOrders && typeof WF_ORDERS !== 'undefined') _srv_merge(WF_ORDERS, d.wfOrders);",
    "          // مزامنة طرق التكلفة وتتبع السيريل للمواد",
    "          if (d.invItems && d.invItems.length && typeof INV_ITEMS !== 'undefined') {",
    "            d.invItems.forEach(function(si) {",
    "              var li = INV_ITEMS.find(function(ii){ return ii.code === si.code; });",
    "              if (li) { li.costMethod = si.costMethod || 'average'; li.trackSerial = !!si.trackSerial; }",
    "            });",
    "          }",
    "          try { localStorage.setItem('raya_blue_v10', JSON.stringify(d)); } catch(e){}"
  ].join('\n'),
  '5. Handle invItems from server'
);

// ================================================================
// 6. Migration: default costMethod for existing hardcoded items
// ================================================================
rep(
  "  _tryRestoreSession();\n  // تحميل من السيرفر",
  [
    "  _tryRestoreSession();",
    "  // مهاجرة v25: تعيين costMethod الافتراضي للمواد الموجودة",
    "  if (typeof INV_ITEMS !== 'undefined') {",
    "    INV_ITEMS.forEach(function(item) { if (!item.costMethod) item.costMethod = 'average'; });",
    "  }",
    "  // تحميل من السيرفر"
  ].join('\n'),
  '6. Migration: default costMethod for existing items'
);

// ================================================================
// 7. Add serial operations modal HTML
// ================================================================
rep(
  '<div class="modal-overlay" id="raya-dlg-overlay"',
  [
    '<!-- ===== SERIAL OPS MODAL ===== -->',
    '<div class="modal-overlay" id="m-serial-ops">',
    '  <div class="modal" style="width:560px;max-width:95%">',
    '    <div class="modal-header" style="background:var(--odoo-blue-l)">',
    '      <h3 id="serial-ops-title" style="margin:0;font-size:1rem;color:var(--odoo-blue)">عمليات السيريل</h3>',
    '      <button class="modal-close" onclick="closeM(\'m-serial-ops\')">✕</button>',
    '    </div>',
    '    <div class="modal-body" style="padding:0">',
    '      <!-- Tabs -->',
    '      <div style="display:flex;border-bottom:2px solid #eee;background:#f8f9fa">',
    '        <button id="sop-tab-list" onclick="showSerialOpsTab(\'list\')" style="flex:1;padding:12px;border:none;background:var(--odoo-blue);color:#fff;font-weight:600;font-size:.9rem">قائمة السيريلات</button>',
    '        <button id="sop-tab-in" onclick="showSerialOpsTab(\'in\')" style="flex:1;padding:12px;border:none;background:transparent;font-size:.9rem">إدخال سيريل</button>',
    '        <button id="sop-tab-out" onclick="showSerialOpsTab(\'out\')" style="flex:1;padding:12px;border:none;background:transparent;font-size:.9rem">إخراج سيريل</button>',
    '      </div>',
    '      <!-- List Tab -->',
    '      <div id="sop-tab-list-body" style="padding:16px">',
    '        <div id="sop-serials-list" style="max-height:300px;overflow-y:auto"></div>',
    '      </div>',
    '      <!-- In Tab -->',
    '      <div id="sop-tab-in-body" style="padding:16px;display:none">',
    '        <div class="form-row">',
    '          <div class="form-group"><label>رقم السيريل <span class="req">*</span></label><input type="text" class="form-control" id="sop-in-sn" placeholder="SN-12345"></div>',
    '          <div class="form-group"><label>تاريخ الإدخال</label><input type="date" class="form-control" id="sop-in-date"></div>',
    '        </div>',
    '        <div class="form-row">',
    '          <div class="form-group"><label>مرجع أمر الشراء</label><input type="text" class="form-control" id="sop-in-ref" placeholder="PO-001"></div>',
    '          <div class="form-group"><label>ملاحظات</label><input type="text" class="form-control" id="sop-in-notes"></div>',
    '        </div>',
    '        <button class="btn btn-primary" style="width:100%" onclick="saveSerialIn()">إدخال السيريل للمخزون</button>',
    '      </div>',
    '      <!-- Out Tab -->',
    '      <div id="sop-tab-out-body" style="padding:16px;display:none">',
    '        <div class="form-group" style="margin-bottom:12px"><label>اختر السيريل</label>',
    '          <select class="form-control" id="sop-out-sn"></select>',
    '        </div>',
    '        <div class="form-row">',
    '          <div class="form-group"><label>تاريخ الإخراج</label><input type="date" class="form-control" id="sop-out-date"></div>',
    '          <div class="form-group"><label>اسم الزبون / المرجع</label><input type="text" class="form-control" id="sop-out-customer"></div>',
    '        </div>',
    '        <div class="form-group"><label>نوع الإخراج</label>',
    '          <select class="form-control" id="sop-out-status">',
    '            <option value="sold">بيع</option>',
    '            <option value="transferred">تحويل</option>',
    '            <option value="scrapped">إتلاف</option>',
    '          </select>',
    '        </div>',
    '        <button class="btn btn-danger" style="width:100%;margin-top:8px" onclick="saveSerialOut()">تأكيد الإخراج</button>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>',
    '',
    '<div class="modal-overlay" id="raya-dlg-overlay"'
  ].join('\n'),
  '7. Add serial ops modal HTML'
);

// ================================================================
// 8. Add JS functions for serial ops
// ================================================================
rep(
  '// ===== RAYA CUSTOM DIALOGS =====',
  [
    '// ===== SERIAL OPERATIONS =====',
    'var _serialOpsCode = null, _serialOpsName = null;',
    'function openSerialOps(code, name) {',
    '  _serialOpsCode = code; _serialOpsName = name;',
    '  document.getElementById("serial-ops-title").textContent = "عمليات السيريل — " + name;',
    '  // Set today\'s date',
    '  var today = new Date().toISOString().split("T")[0];',
    '  var inDate = document.getElementById("sop-in-date"); if(inDate) inDate.value = today;',
    '  var outDate = document.getElementById("sop-out-date"); if(outDate) outDate.value = today;',
    '  document.getElementById("sop-in-sn").value = "";',
    '  document.getElementById("sop-in-ref").value = "";',
    '  document.getElementById("sop-in-notes").value = "";',
    '  document.getElementById("sop-out-customer").value = "";',
    '  showSerialOpsTab("list");',
    '  openM("m-serial-ops");',
    '}',
    'function showSerialOpsTab(tab) {',
    '  ["list","in","out"].forEach(function(t) {',
    '    var body = document.getElementById("sop-tab-"+t+"-body");',
    '    var btn  = document.getElementById("sop-tab-"+t);',
    '    if (body) body.style.display = t===tab ? "" : "none";',
    '    if (btn) { btn.style.background = t===tab ? "var(--odoo-blue)" : "transparent"; btn.style.color = t===tab ? "#fff" : ""; }',
    '  });',
    '  if (tab === "list") _renderSerialOpsList();',
    '  if (tab === "out")  _fillSerialOutSelect();',
    '}',
    'function _renderSerialOpsList() {',
    '  var list = document.getElementById("sop-serials-list"); if(!list) return;',
    '  var db = typeof SERIALS_DB !== "undefined" ? SERIALS_DB : [];',
    '  var items = db.filter(function(s){ return s.itemCode === _serialOpsCode; });',
    '  if (!items.length) { list.innerHTML = \'<p style="color:var(--text-m);text-align:center;padding:20px">لا توجد سيريلات مسجلة لهذه المادة</p>\'; return; }',
    '  var statusLabel = {stock:"في المخزون",sold:"مُباع",reserved:"محجوز",scrapped:"ملغى"};',
    '  var statusColor = {stock:"badge-green",sold:"badge-gray",reserved:"badge-yellow",scrapped:"badge-red"};',
    '  list.innerHTML = \'<table class="data-table"><thead><tr><th>السيريل</th><th>الحالة</th><th>تاريخ الإدخال</th><th>الزبون/المرجع</th></tr></thead><tbody>\' +',
    '    items.map(function(s) {',
    '      return \'<tr><td style="font-family:monospace;font-weight:600">\'+s.sn+\'</td><td><span class="badge \'+( statusColor[s.status]||"badge-gray")+\'">\'+( statusLabel[s.status]||s.status)+\'</span></td><td>\'+( s.dateIn||"—")+\'</td><td>\'+( s.customer||s.poRef||"—")+\'</td></tr>\';',
    '    }).join("") + \'</tbody></table>\';',
    '}',
    'function _fillSerialOutSelect() {',
    '  var sel = document.getElementById("sop-out-sn"); if(!sel) return;',
    '  var db = typeof SERIALS_DB !== "undefined" ? SERIALS_DB : [];',
    '  var inStock = db.filter(function(s){ return s.itemCode === _serialOpsCode && s.status === "stock"; });',
    '  sel.innerHTML = inStock.length',
    '    ? inStock.map(function(s){ return \'<option value="\'+s.sn+\'">\'+s.sn+\'</option>\'; }).join("")',
    '    : \'<option value="">لا يوجد في المخزون</option>\';',
    '}',
    'function saveSerialIn() {',
    '  var sn   = (document.getElementById("sop-in-sn").value||"").trim();',
    '  var date = document.getElementById("sop-in-date").value;',
    '  var ref  = (document.getElementById("sop-in-ref").value||"").trim();',
    '  var notes= (document.getElementById("sop-in-notes").value||"").trim();',
    '  if (!sn) { notify("يجب إدخال رقم السيريل ✕","danger"); return; }',
    '  var db = typeof SERIALS_DB !== "undefined" ? SERIALS_DB : [];',
    '  if (db.find(function(s){ return s.sn === sn; })) { notify("هذا السيريل مسجل مسبقاً ✕","danger"); return; }',
    '  db.push({ sn:sn, itemCode:_serialOpsCode, itemName:_serialOpsName,',
    '    status:"stock", dateIn:date, poRef:ref, notes:notes });',
    '  // Update item qty',
    '  var item = (typeof INV_ITEMS !== "undefined" ? INV_ITEMS : []).find(function(i){ return i.code===_serialOpsCode; });',
    '  if (item) item.qty = (item.qty||0) + 1;',
    '  saveToStorage();',
    '  notify("تم إدخال السيريل "+sn+" للمخزون ✓","success");',
    '  document.getElementById("sop-in-sn").value = "";',
    '  showSerialOpsTab("list");',
    '}',
    'function saveSerialOut() {',
    '  var sn     = document.getElementById("sop-out-sn").value;',
    '  var date   = document.getElementById("sop-out-date").value;',
    '  var cust   = (document.getElementById("sop-out-customer").value||"").trim();',
    '  var status = document.getElementById("sop-out-status").value;',
    '  if (!sn) { notify("لم يتم اختيار سيريل ✕","danger"); return; }',
    '  var db = typeof SERIALS_DB !== "undefined" ? SERIALS_DB : [];',
    '  var rec = db.find(function(s){ return s.sn === sn; });',
    '  if (!rec) { notify("السيريل غير موجود ✕","danger"); return; }',
    '  rec.status  = status;',
    '  rec.dateOut = date;',
    '  rec.customer= cust;',
    '  // Update item qty',
    '  var item = (typeof INV_ITEMS !== "undefined" ? INV_ITEMS : []).find(function(i){ return i.code===_serialOpsCode; });',
    '  if (item && item.qty > 0) item.qty--;',
    '  saveToStorage();',
    '  var labels = {sold:"تم تسجيل البيع",transferred:"تم التحويل",scrapped:"تم الإتلاف"};',
    '  notify((labels[status]||"تم الإخراج")+" للسيريل "+sn+" ✓","success");',
    '  showSerialOpsTab("list");',
    '}',
    '',
    '// ===== RAYA CUSTOM DIALOGS ====='
  ].join('\n'),
  '8. Add serial ops JS functions'
);

// ================================================================
// Finalize
// ================================================================
if (ok) {
  // Verify
  const hasCostMethod = html.includes('inv-cost-method');
  const hasSerialOps = html.includes('openSerialOps');
  const hasInvItems = html.includes('invItems:  (typeof INV_ITEMS');
  console.log('\nVerify:');
  console.log('  costMethod in modal:', hasCostMethod ? 'OK' : 'MISSING');
  console.log('  serial ops:', hasSerialOps ? 'OK' : 'MISSING');
  console.log('  invItems sync:', hasInvItems ? 'OK' : 'MISSING');

  fs.writeFileSync('raya_odoo.html', html, 'utf8');
  console.log('\nv25 patch applied!');
} else {
  console.error('\nPATCH FAILED');
  process.exit(1);
}
