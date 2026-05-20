// v25c patch: apply missing changes from v25 (renamed serial ops functions)
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
// 1. Add costMethod + trackSerial to modal
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
    '        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:.9rem"><input type="radio" name="inv-cost-method" value="average" id="inv-cm-avg" checked style="accent-color:var(--odoo-blue)"><span>وسطي</span></label>',
    '        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:.9rem"><input type="radio" name="inv-cost-method" value="fifo" id="inv-cm-fifo" style="accent-color:var(--odoo-blue)"><span>FIFO</span></label>',
    '        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:.9rem"><input type="radio" name="inv-cost-method" value="batch" id="inv-cm-batch" style="accent-color:var(--odoo-blue)"><span>دفعة</span></label>',
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
// 2. Update saveInventoryItem
// ================================================================
rep(
  "  if(typeof INV_ITEMS!=='undefined') INV_ITEMS.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price,unit:unit});\n  if(typeof AI_DATA!=='undefined'&&AI_DATA.inventory) AI_DATA.inventory.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price});\n  closeM('m-inventory');\n  notify('تم إضافة الصنف \"'+name+'\" بنجاح ✓','success');\n}",
  [
    "  var costMethod=(document.querySelector('input[name=\"inv-cost-method\"]:checked')||{}).value||'average';",
    "  var trackSerial=document.getElementById('inv-track-serial')?.checked||false;",
    "  if(typeof INV_ITEMS!=='undefined') INV_ITEMS.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price,unit:unit,costMethod:costMethod,trackSerial:trackSerial});",
    "  if(typeof AI_DATA!=='undefined'&&AI_DATA.inventory) AI_DATA.inventory.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price});",
    "  saveToStorage();",
    "  closeM('m-inventory');",
    "  notify('تم إضافة الصنف \"'+name+'\" بنجاح ✓','success');",
    "}"
  ].join('\n'),
  '2. Update saveInventoryItem'
);

// ================================================================
// 3. Add invItems to server sync payload
// ================================================================
rep(
  "      instDb:    (typeof INSTALLMENTS_DB !== 'undefined' ? INSTALLMENTS_DB : [])\n    });",
  [
    "      instDb:    (typeof INSTALLMENTS_DB !== 'undefined' ? INSTALLMENTS_DB : []),",
    "      invItems:  (typeof INV_ITEMS !== 'undefined' ? INV_ITEMS : [])",
    "    });"
  ].join('\n'),
  '3. Add invItems to server payload'
);

// ================================================================
// 4. Handle invItems from server
// ================================================================
rep(
  "          if (d.wfOrders && typeof WF_ORDERS !== 'undefined') _srv_merge(WF_ORDERS, d.wfOrders);\n          try { localStorage.setItem('raya_blue_v10', JSON.stringify(d)); } catch(e){}",
  [
    "          if (d.wfOrders && typeof WF_ORDERS !== 'undefined') _srv_merge(WF_ORDERS, d.wfOrders);",
    "          if (d.invItems && d.invItems.length && typeof INV_ITEMS !== 'undefined') {",
    "            d.invItems.forEach(function(si){",
    "              var li=INV_ITEMS.find(function(ii){return ii.code===si.code;});",
    "              if(li){li.costMethod=si.costMethod||'average';li.trackSerial=!!si.trackSerial;}",
    "            });",
    "          }",
    "          try { localStorage.setItem('raya_blue_v10', JSON.stringify(d)); } catch(e){}"
  ].join('\n'),
  '4. Handle invItems from server'
);

// ================================================================
// 5. Migration: default costMethod for existing items
// ================================================================
rep(
  "  _tryRestoreSession();\n  // تحميل من السيرفر",
  [
    "  _tryRestoreSession();",
    "  if(typeof INV_ITEMS!=='undefined'){INV_ITEMS.forEach(function(item){if(!item.costMethod)item.costMethod='average';});}",
    "  // تحميل من السيرفر"
  ].join('\n'),
  '5. costMethod migration'
);

// ================================================================
// 6. Add serial ops modal (with renamed save functions: sopSaveIn/Out)
// ================================================================
rep(
  '<!-- ===== USER MODAL ===== -->',
  [
    '<!-- ===== SERIAL OPS MODAL ===== -->',
    '<div class="modal-overlay" id="m-serial-ops">',
    '  <div class="modal" style="width:580px;max-width:95%">',
    '    <div class="modal-header" style="background:var(--odoo-blue-l)">',
    '      <h3 id="sop-title" style="margin:0;font-size:1rem;color:var(--odoo-blue)">عمليات السيريل</h3>',
    '      <button class="modal-close" onclick="closeM(\'m-serial-ops\')">✕</button>',
    '    </div>',
    '    <div class="modal-body" style="padding:0">',
    '      <div style="display:flex;border-bottom:2px solid #e0e0e0;background:#f8f9fa">',
    '        <button id="sop-btn-list" onclick="sopShowTab(\'list\')" style="flex:1;padding:12px 6px;border:none;background:var(--odoo-blue);color:#fff;font-weight:600;font-size:.88rem;cursor:pointer">قائمة السيريلات</button>',
    '        <button id="sop-btn-in" onclick="sopShowTab(\'in\')" style="flex:1;padding:12px 6px;border:none;background:transparent;font-size:.88rem;cursor:pointer">إدخال للمخزون</button>',
    '        <button id="sop-btn-out" onclick="sopShowTab(\'out\')" style="flex:1;padding:12px 6px;border:none;background:transparent;font-size:.88rem;cursor:pointer">إخراج من المخزون</button>',
    '      </div>',
    '      <div id="sop-body-list" style="padding:16px">',
    '        <div id="sop-serial-list" style="max-height:320px;overflow-y:auto"></div>',
    '      </div>',
    '      <div id="sop-body-in" style="padding:16px;display:none">',
    '        <div class="form-row">',
    '          <div class="form-group"><label>رقم السيريل <span class="req">*</span></label><input type="text" class="form-control" id="sop-in-sn" placeholder="SN-12345"></div>',
    '          <div class="form-group"><label>تاريخ الإدخال</label><input type="date" class="form-control" id="sop-in-date"></div>',
    '        </div>',
    '        <div class="form-row">',
    '          <div class="form-group"><label>مرجع أمر الشراء</label><input type="text" class="form-control" id="sop-in-poref" placeholder="PO-001"></div>',
    '          <div class="form-group"><label>ملاحظات</label><input type="text" class="form-control" id="sop-in-notes"></div>',
    '        </div>',
    '        <button class="btn btn-primary" style="width:100%;margin-top:4px" onclick="sopSaveIn()">إدخال السيريل للمخزون</button>',
    '      </div>',
    '      <div id="sop-body-out" style="padding:16px;display:none">',
    '        <div class="form-group" style="margin-bottom:12px"><label>اختر رقم السيريل</label><select class="form-control" id="sop-out-sn-sel"></select></div>',
    '        <div class="form-row">',
    '          <div class="form-group"><label>تاريخ الإخراج</label><input type="date" class="form-control" id="sop-out-date"></div>',
    '          <div class="form-group"><label>الزبون / المرجع</label><input type="text" class="form-control" id="sop-out-cust"></div>',
    '        </div>',
    '        <div class="form-group"><label>نوع الإخراج</label>',
    '          <select class="form-control" id="sop-out-type">',
    '            <option value="sold">بيع</option>',
    '            <option value="transferred">تحويل</option>',
    '            <option value="scrapped">إتلاف</option>',
    '          </select>',
    '        </div>',
    '        <button class="btn btn-danger" style="width:100%;margin-top:8px" onclick="sopSaveOut()">تأكيد الإخراج</button>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>',
    '',
    '<!-- ===== USER MODAL ====='
  ].join('\n'),
  '6. Add serial ops modal HTML'
);

// ================================================================
// 7. Add JS: openSerialOps + sopShowTab + sopSaveIn + sopSaveOut
// ================================================================
rep(
  '// ===== RAYA CUSTOM DIALOGS =====',
  [
    '// ===== SERIAL OPS (per-item serial management) =====',
    'var _sopCode=null, _sopName=null;',
    'function openSerialOps(code,name){',
    '  _sopCode=code; _sopName=name||code;',
    '  document.getElementById("sop-title").textContent="عمليات السيريل — "+_sopName;',
    '  var today=new Date().toISOString().split("T")[0];',
    '  var d1=document.getElementById("sop-in-date");if(d1)d1.value=today;',
    '  var d2=document.getElementById("sop-out-date");if(d2)d2.value=today;',
    '  document.getElementById("sop-in-sn").value="";',
    '  document.getElementById("sop-in-poref").value="";',
    '  document.getElementById("sop-in-notes").value="";',
    '  document.getElementById("sop-out-cust").value="";',
    '  sopShowTab("list");',
    '  openM("m-serial-ops");',
    '}',
    'function sopShowTab(tab){',
    '  ["list","in","out"].forEach(function(t){',
    '    var b=document.getElementById("sop-btn-"+t);',
    '    var d=document.getElementById("sop-body-"+t);',
    '    if(b){b.style.background=t===tab?"var(--odoo-blue)":"transparent";b.style.color=t===tab?"#fff":"";}',
    '    if(d)d.style.display=t===tab?"":"none";',
    '  });',
    '  if(tab==="list")sopRenderList();',
    '  if(tab==="out")sopFillOutSel();',
    '}',
    'function sopRenderList(){',
    '  var el=document.getElementById("sop-serial-list");if(!el)return;',
    '  var db=typeof SERIALS_DB!=="undefined"?SERIALS_DB:[];',
    '  var rows=db.filter(function(s){return s.itemCode===_sopCode;});',
    '  if(!rows.length){el.innerHTML=\'<p style="text-align:center;color:var(--text-m);padding:20px">لا توجد سيريلات مسجلة</p>\';return;}',
    '  var sLbl={stock:"في المخزون",sold:"مُباع",reserved:"محجوز",scrapped:"ملغى"};',
    '  var sCls={stock:"badge-green",sold:"badge-gray",reserved:"badge-yellow",scrapped:"badge-red"};',
    '  el.innerHTML=\'<table class="data-table"><thead><tr><th>السيريل</th><th>الحالة</th><th>تاريخ الإدخال</th><th>الزبون/المرجع</th></tr></thead><tbody>\'',
    '    +rows.map(function(s){return\'<tr><td style="font-family:monospace;font-weight:600">\'+s.sn+\'</td><td><span class="badge \'+(sCls[s.status]||"badge-gray")+\'">\'+( sLbl[s.status]||s.status)+\'</span></td><td>\'+(s.dateIn||"—")+\'</td><td>\'+(s.customer||s.poRef||"—")+\'</td></tr>\';}).join("")',
    '    +\'</tbody></table>\';',
    '}',
    'function sopFillOutSel(){',
    '  var sel=document.getElementById("sop-out-sn-sel");if(!sel)return;',
    '  var db=typeof SERIALS_DB!=="undefined"?SERIALS_DB:[];',
    '  var avail=db.filter(function(s){return s.itemCode===_sopCode&&s.status==="stock";});',
    '  sel.innerHTML=avail.length',
    '    ?avail.map(function(s){return\'<option value="\'+s.sn+\'">\'+s.sn+\'</option>\';}).join("")',
    '    :\'<option value="">لا يوجد سيريل في المخزون</option>\';',
    '}',
    'function sopSaveIn(){',
    '  var sn=(document.getElementById("sop-in-sn").value||"").trim();',
    '  var dt=document.getElementById("sop-in-date").value;',
    '  var ref=(document.getElementById("sop-in-poref").value||"").trim();',
    '  var notes=(document.getElementById("sop-in-notes").value||"").trim();',
    '  if(!sn){notify("يجب إدخال رقم السيريل ✕","danger");return;}',
    '  var db=typeof SERIALS_DB!=="undefined"?SERIALS_DB:[];',
    '  if(db.find(function(s){return s.sn===sn;})){notify("هذا السيريل مسجل مسبقاً ✕","danger");return;}',
    '  db.push({sn:sn,itemCode:_sopCode,itemName:_sopName,status:"stock",dateIn:dt,poRef:ref,notes:notes});',
    '  var item=(typeof INV_ITEMS!=="undefined"?INV_ITEMS:[]).find(function(i){return i.code===_sopCode;});',
    '  if(item)item.qty=(item.qty||0)+1;',
    '  saveToStorage();',
    '  notify("تم إدخال السيريل "+sn+" للمخزون ✓","success");',
    '  document.getElementById("sop-in-sn").value="";',
    '  sopShowTab("list");',
    '}',
    'function sopSaveOut(){',
    '  var sn=document.getElementById("sop-out-sn-sel").value;',
    '  var dt=document.getElementById("sop-out-date").value;',
    '  var cust=(document.getElementById("sop-out-cust").value||"").trim();',
    '  var type=document.getElementById("sop-out-type").value;',
    '  if(!sn){notify("لم يتم اختيار سيريل ✕","danger");return;}',
    '  var db=typeof SERIALS_DB!=="undefined"?SERIALS_DB:[];',
    '  var rec=db.find(function(s){return s.sn===sn;});',
    '  if(!rec){notify("السيريل غير موجود ✕","danger");return;}',
    '  rec.status=type;rec.dateOut=dt;rec.customer=cust;',
    '  var item=(typeof INV_ITEMS!=="undefined"?INV_ITEMS:[]).find(function(i){return i.code===_sopCode;});',
    '  if(item&&item.qty>0)item.qty--;',
    '  saveToStorage();',
    '  var lbl={sold:"تم تسجيل البيع",transferred:"تم التحويل",scrapped:"تم الإتلاف"};',
    '  notify((lbl[type]||"تم الإخراج")+" للسيريل "+sn+" ✓","success");',
    '  sopShowTab("list");',
    '}',
    '',
    '// ===== RAYA CUSTOM DIALOGS ====='
  ].join('\n'),
  '7. Add serial ops JS'
);

if (ok) {
  const checks = ['inv-cost-method','m-serial-ops','openSerialOps','sopSaveIn','sopSaveOut','invItems:  (typeof INV_ITEMS'];
  checks.forEach(function(c) { console.log((html.includes(c)?'OK':'MISSING') + ': ' + c); });
  fs.writeFileSync('raya_odoo.html', html, 'utf8');
  console.log('\nv25c patch applied!');
} else {
  console.error('\nPATCH FAILED');
  process.exit(1);
}
