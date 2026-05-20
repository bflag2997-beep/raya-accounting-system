// v24 patch: session persistence + replace all browser dialogs with custom modal
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
// 1. Add custom dialog modal HTML before </body>
// ================================================================
rep(
  '</body>',
  [
    '<div class="modal-overlay" id="raya-dlg-overlay" style="z-index:9999">',
    '  <div class="modal" style="width:480px;max-width:95%">',
    '    <div id="raya-dlg-header" class="modal-header" style="padding:16px 20px;background:#f8f9fa;border-radius:var(--r-lg) var(--r-lg) 0 0">',
    '      <h3 id="raya-dlg-title" style="margin:0;font-size:1rem;font-weight:600;color:var(--text-d)">تأكيد</h3>',
    '    </div>',
    '    <div class="modal-body" style="padding:20px 24px 24px">',
    '      <p id="raya-dlg-msg" style="margin:0 0 18px;line-height:1.9;font-size:.95rem;color:var(--text-d)"></p>',
    '      <div id="raya-dlg-inp-wrap" style="display:none;margin-bottom:16px">',
    '        <input id="raya-dlg-inp" type="text" class="form-control" dir="rtl" style="text-align:right"',
    '          onkeydown="if(event.key===\'Enter\')_rayaDlgYes()">',
    '      </div>',
    '      <div style="display:flex;gap:10px;justify-content:flex-start">',
    '        <button id="raya-dlg-yes" class="btn btn-primary" onclick="_rayaDlgYes()">نعم</button>',
    '        <button id="raya-dlg-no" class="btn btn-secondary" onclick="_rayaDlgNo()">إلغاء</button>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>',
    '</body>'
  ].join('\n'),
  '1. Add dialog modal HTML'
);

// ================================================================
// 2. Add JS functions at end of script (hoisted, so IIFE can call them)
// ================================================================
rep(
  '})();\n\n</script>',
  [
    '})();',
    '',
    '// ===== RAYA CUSTOM DIALOGS =====',
    'var _rayaDlgCb=null,_rayaDlgMode="confirm";',
    'function rayaConfirm(msg,onYes,opts){',
    '  opts=opts||{};',
    '  _rayaDlgCb=onYes;_rayaDlgMode="confirm";',
    '  document.getElementById("raya-dlg-msg").textContent=msg;',
    '  document.getElementById("raya-dlg-inp-wrap").style.display="none";',
    '  document.getElementById("raya-dlg-header").style.background=opts.danger?"#fee2e2":"#f8f9fa";',
    '  var yBtn=document.getElementById("raya-dlg-yes");',
    '  yBtn.textContent=opts.yesLabel||"نعم";',
    '  yBtn.style.cssText=opts.danger?"background:#dc3545;border-color:#dc3545;color:#fff":"";',
    '  document.getElementById("raya-dlg-no").style.display="";',
    '  document.getElementById("raya-dlg-overlay").classList.add("open");',
    '}',
    'function rayaAlert(msg){',
    '  _rayaDlgCb=null;_rayaDlgMode="alert";',
    '  document.getElementById("raya-dlg-msg").textContent=msg;',
    '  document.getElementById("raya-dlg-inp-wrap").style.display="none";',
    '  document.getElementById("raya-dlg-header").style.background="#fff3cd";',
    '  document.getElementById("raya-dlg-yes").textContent="حسناً";',
    '  document.getElementById("raya-dlg-yes").style.cssText="";',
    '  document.getElementById("raya-dlg-no").style.display="none";',
    '  document.getElementById("raya-dlg-overlay").classList.add("open");',
    '}',
    'function rayaPrompt(msg,onValue,isPassword){',
    '  _rayaDlgCb=onValue;_rayaDlgMode="prompt";',
    '  document.getElementById("raya-dlg-msg").textContent=msg;',
    '  document.getElementById("raya-dlg-inp-wrap").style.display="";',
    '  document.getElementById("raya-dlg-inp").value="";',
    '  document.getElementById("raya-dlg-inp").type=isPassword?"password":"text";',
    '  document.getElementById("raya-dlg-header").style.background="#f8f9fa";',
    '  document.getElementById("raya-dlg-yes").textContent="تأكيد";',
    '  document.getElementById("raya-dlg-yes").style.cssText="";',
    '  document.getElementById("raya-dlg-no").style.display="";',
    '  document.getElementById("raya-dlg-overlay").classList.add("open");',
    '  setTimeout(function(){document.getElementById("raya-dlg-inp").focus();},80);',
    '}',
    'function _rayaDlgYes(){',
    '  document.getElementById("raya-dlg-overlay").classList.remove("open");',
    '  var cb=_rayaDlgCb;_rayaDlgCb=null;',
    '  if(typeof cb!=="function")return;',
    '  if(_rayaDlgMode==="prompt"){cb(document.getElementById("raya-dlg-inp").value);}',
    '  else{cb();}',
    '}',
    'function _rayaDlgNo(){',
    '  document.getElementById("raya-dlg-overlay").classList.remove("open");',
    '  _rayaDlgCb=null;',
    '}',
    '// ===== SESSION RESTORE =====',
    'function _tryRestoreSession(){',
    '  try{',
    '    var _sess=sessionStorage.getItem("raya_sess");',
    '    if(!_sess)return;',
    '    var _su=JSON.parse(_sess);',
    '    if(!_su||!_su.username)return;',
    '    var db=typeof USERS_DB!=="undefined"?USERS_DB:[];',
    '    var uRec=db.find(function(u){return u.username===_su.username;});',
    '    if(!uRec){sessionStorage.removeItem("raya_sess");return;}',
    '    currentUser={username:uRec.username,name:uRec.name,role:uRec.role,perms:uRec.perms||{}};',
    '    document.getElementById("login-screen").style.display="none";',
    '    document.getElementById("app").style.display="block";',
    '    document.getElementById("user-name-display").textContent=currentUser.name;',
    '    document.getElementById("topbar-bc").textContent="مرحباً، "+currentUser.name;',
    '    if(typeof applyPermissionsUI==="function")applyPermissionsUI();',
    '    if(typeof renderTree==="function")renderTree();',
    '  }catch(e){}',
    '}',
    '',
    '</script>'
  ].join('\n'),
  '2. Add dialog JS + _tryRestoreSession'
);

// ================================================================
// 3. Save session after successful login in doLogin()
// ================================================================
rep(
  'currentUser={username:uRec.username,name:uRec.name,role:uRec.role,perms:uRec.perms||{}};',
  [
    'currentUser={username:uRec.username,name:uRec.name,role:uRec.role,perms:uRec.perms||{}};',
    '    try{sessionStorage.setItem("raya_sess",JSON.stringify(currentUser));}catch(e){}'
  ].join('\n'),
  '3. Save session to sessionStorage on login'
);

// ================================================================
// 4. Restore session in IIFE after loadFromStorage
// ================================================================
rep(
  "else        console.info('[Raya v10] بيانات افتراضية (لا يوجد حفظ سابق)');\n  // تحميل من السيرفر",
  [
    "else        console.info('[Raya v10] بيانات افتراضية (لا يوجد حفظ سابق)');",
    "  _tryRestoreSession();",
    "  // تحميل من السيرفر"
  ].join('\n'),
  '4. Call _tryRestoreSession in IIFE'
);

// ================================================================
// 5. logout() — replace confirm + clear session
// ================================================================
rep(
  "function logout(){if(confirm('هل تريد تسجيل الخروج؟')){location.reload();}}",
  "function logout(){rayaConfirm('هل تريد تسجيل الخروج؟',function(){try{sessionStorage.removeItem('raya_sess');}catch(e){}location.reload();});}",
  '5. logout() with rayaConfirm + session clear'
);

// ================================================================
// 6. deleteUser — danger confirm
// ================================================================
rep(
  'if (!confirm("هل تريد حذف هذا المستخدم؟")) return;\n  var db = typeof USERS_DB !== "undefined" ? USERS_DB : [];\n  var idx = db.findIndex(function(u){ return u.id===id; });\n  if (idx >= 0) db.splice(idx, 1);\n  saveToStorage(); renderUsersPage();\n  notify("تم حذف المستخدم ✓","success");\n}',
  [
    'rayaConfirm("هل تريد حذف هذا المستخدم؟",function(){',
    '  var db = typeof USERS_DB !== "undefined" ? USERS_DB : [];',
    '  var idx = db.findIndex(function(u){ return u.id===id; });',
    '  if (idx >= 0) db.splice(idx, 1);',
    '  saveToStorage(); renderUsersPage();',
    '  notify("تم حذف المستخدم ✓","success");',
    '},{danger:true});}'
  ].join('\n'),
  '6. deleteUser rayaConfirm'
);

// ================================================================
// 7. deletePermModule — danger confirm
// ================================================================
rep(
  'if (!confirm("حذف عمود الصلاحية \\""+key+"\\"؟")) return;\n  var mods = typeof PERM_MODULES !== "undefined" ? PERM_MODULES : [];\n  var idx = mods.findIndex(function(m){ return m.key===key; });\n  if (idx >= 0) mods.splice(idx, 1);\n  saveToStorage(); renderUsersPage();\n  notify("تم الحذف ✓","success");\n}',
  [
    'rayaConfirm("حذف عمود الصلاحية \\""+key+"\\"؟",function(){',
    '  var mods = typeof PERM_MODULES !== "undefined" ? PERM_MODULES : [];',
    '  var idx = mods.findIndex(function(m){ return m.key===key; });',
    '  if (idx >= 0) mods.splice(idx, 1);',
    '  saveToStorage(); renderUsersPage();',
    '  notify("تم الحذف ✓","success");',
    '},{danger:true});}'
  ].join('\n'),
  '7. deletePermModule rayaConfirm'
);

// ================================================================
// 8. openAddPermModule — replace 2 prompts
// ================================================================
rep(
  'function openAddPermModule() {\n  var key = prompt("مفتاح الصلاحية الجديدة (إنجليزي بدون مسافات):");\n  if (!key || !key.trim()) return;\n  key = key.trim().toLowerCase().replace(/\\s+/g,"_");\n  var label = prompt("اسم الصلاحية (بالعربي):");\n  if (!label || !label.trim()) return;\n  var mods = typeof PERM_MODULES !== "undefined" ? PERM_MODULES : [];\n  if (mods.find(function(m){ return m.key===key; })) { notify("الصلاحية موجودة مسبقاً","warning"); return; }\n  mods.push({key:key, label:label.trim()});\n  saveToStorage(); renderUsersPage();\n  notify("تمت إضافة الصلاحية ✓","success");\n}',
  [
    'function openAddPermModule(){',
    '  rayaPrompt("مفتاح الصلاحية الجديدة (إنجليزي بدون مسافات):",function(key){',
    '    if(!key||!key.trim())return;',
    '    key=key.trim().toLowerCase().replace(/\\s+/g,"_");',
    '    rayaPrompt("اسم الصلاحية (بالعربي):",function(label){',
    '      if(!label||!label.trim())return;',
    '      var mods=typeof PERM_MODULES!=="undefined"?PERM_MODULES:[];',
    '      if(mods.find(function(m){return m.key===key;})){notify("الصلاحية موجودة مسبقاً","warning");return;}',
    '      mods.push({key:key,label:label.trim()});',
    '      saveToStorage();renderUsersPage();',
    '      notify("تمت إضافة الصلاحية ✓","success");',
    '    });',
    '  });',
    '}'
  ].join('\n'),
  '8. openAddPermModule replace 2 prompts'
);

// ================================================================
// 9. payInstallment — confirm in middle of function
// ================================================================
rep(
  '  if (!confirm("تأكيد تسجيل دفع القسط "+(pIdx+1)+" بمبلغ "+fmt(p.amt)+" د.ع للزبون "+c.custName+"؟")) return;\n  p.status = "paid";\n  p.paidDate = new Date().toISOString().split("T")[0];\n  // قيد محاسبي: مدين الصندوق / دائن حساب الزبون\n  var jId = "RCP-"+String(Date.now()).slice(-6);\n  p.rcpRef = jId;\n  if (typeof JOURNAL_ENTRIES_DATA !== "undefined") {\n    JOURNAL_ENTRIES_DATA.push({id:jId, date:p.paidDate, journal:"receipt",\n      ref:contractId, customer:c.custName, customerId:c.custId,\n      type:"aqsat", method:"cash",\n      lines:[{code:"1611",debit:p.amt},{code:"1511",credit:p.amt}]\n    });\n  }\n  // تخفيض ذمة الزبون\n  if (typeof CUSTOMERS_DB !== "undefined" && c.custId) {\n    var cr = CUSTOMERS_DB.find(function(cu){ return cu.id===c.custId||cu.name===c.custName; });\n    if (cr) cr.debt = Math.max(0, (cr.debt||0) - p.amt);\n  }\n  saveToStorage();\n  renderInstallmentsPage();\n  notify("تم تسجيل دفع القسط "+(pIdx+1)+" ✓","success");\n}',
  [
    '  rayaConfirm("تأكيد تسجيل دفع القسط "+(pIdx+1)+" بمبلغ "+fmt(p.amt)+" د.ع للزبون "+c.custName+"؟",function(){',
    '  p.status = "paid";',
    '  p.paidDate = new Date().toISOString().split("T")[0];',
    '  var jId = "RCP-"+String(Date.now()).slice(-6);',
    '  p.rcpRef = jId;',
    '  if (typeof JOURNAL_ENTRIES_DATA !== "undefined") {',
    '    JOURNAL_ENTRIES_DATA.push({id:jId, date:p.paidDate, journal:"receipt",',
    '      ref:contractId, customer:c.custName, customerId:c.custId,',
    '      type:"aqsat", method:"cash",',
    '      lines:[{code:"1611",debit:p.amt},{code:"1511",credit:p.amt}]',
    '    });',
    '  }',
    '  if (typeof CUSTOMERS_DB !== "undefined" && c.custId) {',
    '    var cr = CUSTOMERS_DB.find(function(cu){ return cu.id===c.custId||cu.name===c.custName; });',
    '    if (cr) cr.debt = Math.max(0, (cr.debt||0) - p.amt);',
    '  }',
    '  saveToStorage();',
    '  renderInstallmentsPage();',
    '  notify("تم تسجيل دفع القسط "+(pIdx+1)+" ✓","success");',
    '  });',
    '}'
  ].join('\n'),
  '9. payInstallment rayaConfirm'
);

// ================================================================
// 10. confirm#5 — out of stock, suggest purchase
// ================================================================
rep(
  "if(confirm('هذا الصنف غير متوفر في المخزن. هل تريد إنشاء طلب شراء تلقائياً؟')) {\n        openPurchaseModal();\n      }",
  "rayaConfirm('هذا الصنف غير متوفر في المخزن. هل تريد إنشاء طلب شراء تلقائياً؟',function(){openPurchaseModal();});",
  '10. out-of-stock purchase suggest'
);

// ================================================================
// 11. deleteAccount — confirm inside if block
// ================================================================
rep(
  "if (confirm('حذف الحساب ' + code + ' — ' + name + '? سيسجل في سجل التدقيق.')) {       if (typeof addAuditLog === 'function') addAuditLog('delete', 'ACC-' + code, 'حذف الحساب ' + code + ' — ' + name);       notify('تم حذف الحساب ' + code, 'success');\n    }",
  "rayaConfirm('حذف الحساب ' + code + ' — ' + name + '؟ سيسجل في سجل التدقيق.',function(){if(typeof addAuditLog==='function')addAuditLog('delete','ACC-'+code,'حذف الحساب '+code+' — '+name);notify('تم حذف الحساب '+code,'success');},{danger:true});",
  '11. deleteAccount rayaConfirm'
);

// ================================================================
// 12. convertReservation
// ================================================================
rep(
  "  if (!confirm('هل تريد تحويل الحجز ' + rsvId + ' إلى فاتورة مبيعات؟')) return;\n  // Pre-fill sale modal with reservation data\n  var custInput = document.getElementById('sale-customer');\n  if (custInput) custInput.value = customerName;\n  var priceInput = document.getElementById('sale-total');\n  if (priceInput) priceInput.value = totalPrice;\n  var depInput = document.getElementById('deposit-paid');\n  if (depInput) depInput.value = depositPaid;\n  var payMethod = document.getElementById('pay-method');\n  if (payMethod) payMethod.value = 'inst';\n  openM('m-sale');\n  notify('تم تحميل بيانات الحجز ' + rsvId",
  [
    "  rayaConfirm('هل تريد تحويل الحجز ' + rsvId + ' إلى فاتورة مبيعات؟',function(){",
    "  var custInput = document.getElementById('sale-customer');",
    "  if (custInput) custInput.value = customerName;",
    "  var priceInput = document.getElementById('sale-total');",
    "  if (priceInput) priceInput.value = totalPrice;",
    "  var depInput = document.getElementById('deposit-paid');",
    "  if (depInput) depInput.value = depositPaid;",
    "  var payMethod = document.getElementById('pay-method');",
    "  if (payMethod) payMethod.value = 'inst';",
    "  openM('m-sale');",
    "  notify('تم تحميل بيانات الحجز ' + rsvId"
  ].join('\n'),
  '12. convertReservation'
);

// ================================================================
// 13. cancelReservation
// ================================================================
rep(
  "  if (!confirm('هل تريد إلغاء الحجز ' + rsvId + '؟ سيتم إعادة المولد إلى المخزون.')) return;\n  var row = document.querySelector('[data-rsv=\"' + rsvId + '\"]');\n  if (row) {\n    row.style.background = 'var(--odoo-red-l)';\n    row.style.opacity = '0.5';\n    setTimeout(function() { row.style.display = 'none'; }, 500);\n  }\n  notify('تم إلغاء الحجز ' + rsvId + ' وإعادة المولد للمخزون ✓', 'success');\n}",
  [
    "  rayaConfirm('هل تريد إلغاء الحجز ' + rsvId + '؟ سيتم إعادة المولد إلى المخزون.',function(){",
    "  var row = document.querySelector('[data-rsv=\"' + rsvId + '\"]');",
    "  if (row) {",
    "    row.style.background = 'var(--odoo-red-l)';",
    "    row.style.opacity = '0.5';",
    "    setTimeout(function() { row.style.display = 'none'; }, 500);",
    "  }",
    "  notify('تم إلغاء الحجز ' + rsvId + ' وإعادة المولد للمخزون ✓', 'success');",
    "  },{danger:true});",
    "}"
  ].join('\n'),
  '13. cancelReservation'
);

// ================================================================
// 14. deleteCustomer
// ================================================================
rep(
  "  if (!confirm('هل تريد حذف الزبون ' + c.name + '؟')) return;\n  var idx = CUSTOMERS_DB.findIndex(function(x){ return x.id === id; });\n  CUSTOMERS_DB.splice(idx, 1);\n  notify('تم حذف الزبون ✓', 'success');\n  renderCustomersPage();\n}",
  [
    "  rayaConfirm('هل تريد حذف الزبون ' + c.name + '؟',function(){",
    "  var idx = CUSTOMERS_DB.findIndex(function(x){ return x.id === id; });",
    "  CUSTOMERS_DB.splice(idx, 1);",
    "  notify('تم حذف الزبون ✓', 'success');",
    "  renderCustomersPage();",
    "  },{danger:true});",
    "}"
  ].join('\n'),
  '14. deleteCustomer'
);

// ================================================================
// 15. deleteSupplier
// ================================================================
rep(
  "  if (!confirm('هل تريد حذف المجهز ' + s.name + '؟')) return;\n  var idx = SUPPLIERS_DB.findIndex(function(x){ return x.id === id; });\n  SUPPLIERS_DB.splice(idx, 1);\n  notify('تم حذف المجهز ✓', 'success');\n  renderSuppliersPage();\n}",
  [
    "  rayaConfirm('هل تريد حذف المجهز ' + s.name + '؟',function(){",
    "  var idx = SUPPLIERS_DB.findIndex(function(x){ return x.id === id; });",
    "  SUPPLIERS_DB.splice(idx, 1);",
    "  notify('تم حذف المجهز ✓', 'success');",
    "  renderSuppliersPage();",
    "  },{danger:true});",
    "}"
  ].join('\n'),
  '15. deleteSupplier'
);

// ================================================================
// 16. deleteMaint
// ================================================================
rep(
  "  if (!confirm('هل تريد حذف طلب الصيانة ' + id + '؟')) return;\n  MAINT_DB.splice(idx, 1);\n  renderMaintenancePage();\n  notify('تم حذف الطلب ✓', 'success');\n}",
  [
    "  rayaConfirm('هل تريد حذف طلب الصيانة ' + id + '؟',function(){",
    "  MAINT_DB.splice(idx, 1);",
    "  renderMaintenancePage();",
    "  notify('تم حذف الطلب ✓', 'success');",
    "  },{danger:true});",
    "}"
  ].join('\n'),
  '16. deleteMaint'
);

// ================================================================
// 17. resetAllData — replace prompt + alert + confirm
// ================================================================
rep(
  'function resetAllData() {\n  var pw = prompt("أدخل كلمة المرور الخاصة بالحذف الكامل:");\n  if (pw !== "DELETE-RAYA-2026") { alert("كلمة المرور خاطئة — لم يتم حذف أي شيء"); return; }\n  if (!confirm("تحذير أخير: سيتم حذف جميع البيانات نهائياً بدون رجعة. هل أنت متأكد 100%؟")) return;',
  [
    'function resetAllData(){',
    '  rayaPrompt("أدخل كلمة المرور الخاصة بالحذف الكامل:",function(pw){',
    '    if(pw!=="DELETE-RAYA-2026"){rayaAlert("كلمة المرور خاطئة — لم يتم حذف أي شيء");return;}',
    '    rayaConfirm("تحذير أخير: سيتم حذف جميع البيانات نهائياً بدون رجعة. هل أنت متأكد 100%؟",function(){'
  ].join('\n'),
  '17a. resetAllData — prompt+alert+confirm start'
);

// Close the nested callbacks in resetAllData
rep(
  'try { localStorage.removeItem("raya_blue_v10"); } catch(e){}\n  if (typeof _syncToServer === "function") _syncToServer();\n  notify("تم تفريغ جميع البيانات ✔", "success");\n  setTimeout(function(){ location.reload(); }, 1500);\n}',
  [
    'try { localStorage.removeItem("raya_blue_v10"); } catch(e){}',
    '  if (typeof _syncToServer === "function") _syncToServer();',
    '  notify("تم تفريغ جميع البيانات ✔", "success");',
    '  setTimeout(function(){ location.reload(); }, 1500);',
    '    },{danger:true,yesLabel:"احذف كل شيء"});',
    '  });',
    '}'
  ].join('\n'),
  '17b. resetAllData — close nested callbacks'
);

// ================================================================
// 18. restoreDataJSON — confirm inside file reader
// ================================================================
rep(
  "      if (!confirm('هل تريد استعادة البيانات؟ سيتم استبدال البيانات الحالية.')) return;\n      function merge(target, src) {\n        if (!src) return;\n        target.splice(0, target.length);\n        src.forEach(function(x){ target.push(x); });\n      }\n      merge(JOURNAL_ENTRIES_DATA, d.journal);\n      merge(CUSTOMERS_DB,         d.customers);\n      merge(SUPPLIERS_DB,         d.suppliers);\n      merge(MAINT_DB,             d.maint);\n      merge(PAYROLL_RECORDS,      d.payroll);\n      saveToStorage();\n      notify('تمت الاستعادة — جاري إعادة التحميل... ✔', 'success');\n      setTimeout(function(){ location.reload(); }, 1500);",
  [
    "      rayaConfirm('هل تريد استعادة البيانات؟ سيتم استبدال البيانات الحالية.',function(){",
    "      function merge(target, src) {",
    "        if (!src) return;",
    "        target.splice(0, target.length);",
    "        src.forEach(function(x){ target.push(x); });",
    "      }",
    "      merge(JOURNAL_ENTRIES_DATA, d.journal);",
    "      merge(CUSTOMERS_DB,         d.customers);",
    "      merge(SUPPLIERS_DB,         d.suppliers);",
    "      merge(MAINT_DB,             d.maint);",
    "      merge(PAYROLL_RECORDS,      d.payroll);",
    "      saveToStorage();",
    "      notify('تمت الاستعادة — جاري إعادة التحميل... ✔', 'success');",
    "      setTimeout(function(){ location.reload(); }, 1500);",
    "      });"
  ].join('\n'),
  '18. restoreDataJSON'
);

// ================================================================
// Verify no browser dialogs remain
// ================================================================
if (ok) {
  const remainConfirm = (html.match(/\bconfirm\s*\(/g) || []).length;
  const remainAlert = (html.match(/\balert\s*\(/g) || []).length;
  const remainPrompt = (html.match(/\bprompt\s*\(/g) || []).length;
  console.log('\nRemaining browser dialogs — confirm:', remainConfirm, 'alert:', remainAlert, 'prompt:', remainPrompt);
  if (remainConfirm > 0 || remainAlert > 0 || remainPrompt > 0) {
    console.warn('WARNING: some browser dialogs remain');
  }
  fs.writeFileSync('raya_odoo.html', html, 'utf8');
  console.log('\nv24 patch applied successfully!');
} else {
  console.error('\nPATCH FAILED — file not written');
  process.exit(1);
}
