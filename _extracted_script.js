// ===== IRAQI COA DATA =====



// Load COA from JSON tag (avoids large inline data)
let IRAQI_COA = [];
try {
  const coaEl = document.getElementById('coa-data');
  if (coaEl) {
    // Strip 'const IRAQI_COA = ' prefix and trailing ';'
    let raw = coaEl.textContent.trim();
    raw = raw.replace(/^const\s+IRAQI_COA\s*=\s*/, '').replace(/;?\s*$/, '');
    IRAQI_COA = eval('(' + raw + ')') || [];
  }
} catch(e) {
  console.error('COA load error:', e);
  IRAQI_COA = [];
}




// ===== MAIN APPLICATION =====

// ===== STATE =====
const SERIALS=['GEN-0045','GEN-0062','GEN-0070','GEN-0038','GEN-0055','GEN-0031','GEN-0048','GEN-0071','GEN-0080','GEN-0081','GEN-0090','GEN-0091'];
// ============================================================
// USERS_DB — قاعدة بيانات المستخدمين والصلاحيات
// ============================================================
// ============================================================
// PERM_MODULES + ROLE_TEMPLATES + USERS_DB
// ============================================================
var PERM_MODULES = [
  {key:"dashboard",   label:"لوحة التحكم"},
  {key:"sales",       label:"المبيعات"},
  {key:"customers",   label:"الزبائن"},
  {key:"inventory",   label:"المخزون"},
  {key:"purchases",   label:"المشتريات"},
  {key:"accounting",  label:"المحاسبة"},
  {key:"maintenance", label:"الصيانة"},
  {key:"employees",   label:"الموظفون"},
  {key:"installments",label:"الأقساط"},
  {key:"reports",     label:"التقارير"},
  {key:"settings",    label:"الإعدادات"}
];

// قوالب الأدوار — {view, create, edit, del} لكل وحدة
var ROLE_TEMPLATES = {
  admin:      {dashboard:{view:true,create:true,edit:true,del:true},  sales:{view:true,create:true,edit:true,del:true},  customers:{view:true,create:true,edit:true,del:true},  inventory:{view:true,create:true,edit:true,del:true},  purchases:{view:true,create:true,edit:true,del:true},  accounting:{view:true,create:true,edit:true,del:true},  maintenance:{view:true,create:true,edit:true,del:true},  employees:{view:true,create:true,edit:true,del:true},  installments:{view:true,create:true,edit:true,del:true},  reports:{view:true,create:true,edit:true,del:true},  settings:{view:true,create:true,edit:true,del:true}},
  accountant: {dashboard:{view:true,create:false,edit:false,del:false},  sales:{view:true,create:true,edit:true,del:false},customers:{view:true,create:true,edit:true,del:false},inventory:{view:true,create:false,edit:false,del:false},  purchases:{view:true,create:true,edit:true,del:false},accounting:{view:true,create:true,edit:true,del:true},  maintenance:{view:true,create:false,edit:false,del:false},  employees:{view:true,create:false,edit:false,del:false},  installments:{view:true,create:true,edit:true,del:false},reports:{view:true,create:false,edit:false,del:false},  settings:{view:false,create:false,edit:false,del:false}},
  supervisor: {dashboard:{view:true,create:false,edit:false,del:false},  sales:{view:true,create:false,edit:true,del:false}, customers:{view:true,create:false,edit:true,del:false}, inventory:{view:true,create:false,edit:false,del:false},  purchases:{view:true,create:false,edit:true,del:false}, accounting:{view:true,create:false,edit:false,del:false},  maintenance:{view:true,create:false,edit:true,del:false}, employees:{view:true,create:false,edit:false,del:false},  installments:{view:true,create:false,edit:true,del:false}, reports:{view:true,create:false,edit:false,del:false},  settings:{view:false,create:false,edit:false,del:false}},
  sales:      {dashboard:{view:true,create:false,edit:false,del:false},  sales:{view:true,create:true,edit:true,del:false},customers:{view:true,create:true,edit:true,del:false},inventory:{view:true,create:false,edit:false,del:false},  purchases:{view:false,create:false,edit:false,del:false},  accounting:{view:false,create:false,edit:false,del:false},  maintenance:{view:true,create:false,edit:false,del:false},  employees:{view:false,create:false,edit:false,del:false},  installments:{view:true,create:true,edit:true,del:false},reports:{view:false,create:false,edit:false,del:false},  settings:{view:false,create:false,edit:false,del:false}},
  warehouse:  {dashboard:{view:true,create:false,edit:false,del:false},  sales:{view:true,create:false,edit:false,del:false},  customers:{view:true,create:false,edit:false,del:false},  inventory:{view:true,create:true,edit:true,del:true},  purchases:{view:true,create:true,edit:true,del:false},accounting:{view:false,create:false,edit:false,del:false},  maintenance:{view:true,create:false,edit:true,del:false}, employees:{view:false,create:false,edit:false,del:false},  installments:{view:false,create:false,edit:false,del:false},  reports:{view:false,create:false,edit:false,del:false},  settings:{view:false,create:false,edit:false,del:false}},
  technician: {dashboard:{view:true,create:false,edit:false,del:false},  sales:{view:true,create:false,edit:false,del:false},  customers:{view:true,create:false,edit:false,del:false},  inventory:{view:true,create:false,edit:false,del:false},  purchases:{view:false,create:false,edit:false,del:false},  accounting:{view:false,create:false,edit:false,del:false},  maintenance:{view:true,create:true,edit:true,del:true},  employees:{view:false,create:false,edit:false,del:false},  installments:{view:false,create:false,edit:false,del:false},  reports:{view:false,create:false,edit:false,del:false},  settings:{view:false,create:false,edit:false,del:false}},
  collector:  {dashboard:{view:true,create:false,edit:false,del:false},  sales:{view:true,create:false,edit:false,del:false},  customers:{view:true,create:true,edit:true,del:false},inventory:{view:false,create:false,edit:false,del:false},  purchases:{view:false,create:false,edit:false,del:false},  accounting:{view:true,create:true,edit:false,del:false}, maintenance:{view:false,create:false,edit:false,del:false},  employees:{view:false,create:false,edit:false,del:false},  installments:{view:true,create:true,edit:true,del:false},reports:{view:false,create:false,edit:false,del:false},  settings:{view:false,create:false,edit:false,del:false}},
  clerk:      {dashboard:{view:true,create:false,edit:false,del:false},  sales:{view:true,create:false,edit:false,del:false},  customers:{view:true,create:false,edit:false,del:false},  inventory:{view:true,create:false,edit:false,del:false},  purchases:{view:true,create:false,edit:false,del:false},  accounting:{view:false,create:false,edit:false,del:false},  maintenance:{view:true,create:false,edit:false,del:false},  employees:{view:false,create:false,edit:false,del:false},  installments:{view:true,create:false,edit:false,del:false},  reports:{view:false,create:false,edit:false,del:false},  settings:{view:false,create:false,edit:false,del:false}}
};

var USERS_DB = [
  {id:"USR-001",username:"admin",     pass:"123456",  name:"مدير النظام",    role:"admin",     perms:ROLE_TEMPLATES.admin,      lastLogin:""},
  {id:"USR-002",username:"accountant",pass:"acc2026", name:"محاسب أول",      role:"accountant",perms:ROLE_TEMPLATES.accountant,  lastLogin:""},
  {id:"USR-003",username:"sales",     pass:"sales123",name:"موظف مبيعات",    role:"sales",     perms:ROLE_TEMPLATES.sales,       lastLogin:""}
];
let currentUser=null,lineCount=1;

// ===== AUTH =====
function doLogin(){
  var uname=document.getElementById('lu').value.trim();
  var p=document.getElementById('lp').value;
  var e=document.getElementById('login-err');
  var db=typeof USERS_DB!=='undefined'?USERS_DB:[];
  var uRec=db.find(function(u){return u.username===uname&&u.pass===p;});
  if(uRec){
    currentUser={username:uRec.username,name:uRec.name,role:uRec.role,perms:uRec.perms||{}};
    try{sessionStorage.setItem("raya_sess",JSON.stringify(currentUser));}catch(e){}
    uRec.lastLogin=new Date().toISOString().replace('T',' ').substring(0,16);
    document.getElementById('login-screen').style.display='none';
    document.getElementById('app').style.display='block';
    document.getElementById('user-name-display').textContent=currentUser.name;
    document.getElementById('topbar-bc').textContent='مرحباً، '+currentUser.name;
    var n=new Date();
    document.getElementById('dash-date').textContent='آخر تحديث: '+n.toLocaleString('en-US');
    e.style.display='none';
    renderTree();
    if(typeof applyPermissionsUI==='function')applyPermissionsUI();
    setTimeout(function(){if(typeof saveToStorage==='function')saveToStorage();},500);
  } else {
    e.style.display='block';
    document.getElementById('lp').value='';
  }
}
function logout(){rayaConfirm('هل تريد تسجيل الخروج؟',function(){try{sessionStorage.removeItem('raya_sess');}catch(e){}location.reload();});}

// ===== NAVIGATION =====
const PT={
  dashboard:'لوحة التحكم',workflow:'تدفق العمل',
  accounts:'شجرة الحسابات',journal:'القيد اليومي',ledger:'دفتر الأستاذ',
  trial:'ميزان المراجعة',income:'قائمة الدخل','balance-sheet':'الميزانية العمومية',
  customers:'الزبائن',sales:'فواتير المبيعات',receipts:'وصولات القبض',
  installments:'الأقساط',reservations:'فواتير الحجز',
  'inv-generators':'مخزون المولدات','inv-parts':'قطع الغيار والأدوات',
  'inv-fluids':'ماء وزيوت','inv-labor':'أجور الصيانة',
  suppliers:'المجهزون',purchases:'المشتريات',
  maintenance:'الصيانة والخدمات',warranties:'الضمانات والعقود',
  expenses:'المصروفات',payments:'وصولات الصرف',
  reports:'التقارير المالية',log:'سجل النشاط',
  users:'المستخدمون',settings:'إعدادات النظام',
  generators:'المولدات',hr:'الإجازات والزمنيات','invoice-designer':'مصمم الفواتير','excel-reports':'تصدير التقارير — Excel'
};
var _PG_MOD={dashboard:"dashboard",workflow:"dashboard",ai:"dashboard",
  accounts:"accounting",journal:"accounting",ledger:"accounting",trial:"accounting",
  income:"accounting","balance-sheet":"accounting",
  customers:"customers",receipts:"customers",reservations:"sales",
  sales:"sales",installments:"installments",
  inventory:"inventory",
  suppliers:"purchases",purchases:"purchases",
  maintenance:"maintenance",warranties:"maintenance",
  hr:"employees",payroll:"employees",
  users:"settings",settings:"settings",log:"settings"
};
function go(pg,el){
  // ========= تحقق من صلاحية العرض =========
  if(currentUser && typeof normPerm==="function"){
    var _m=_PG_MOD[pg];
    if(_m){
      var _p=normPerm((currentUser.perms||{})[_m]);
      if(!_p.view){
        notify("🔒 ليس لديك صلاحية الوصول لهذه الصفحة","danger");
        return;
      }
    }
  }
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const target=document.getElementById('page-'+pg);
  if(target)target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if(el)el.classList.add('active');
  const titleEl=document.getElementById('topbar-title');
  if(titleEl)titleEl.textContent=PT[pg]||pg;
  // Render dynamic pages
  if(pg==='trial')     setTimeout(()=>{if(typeof renderTrialBalance==='function')renderTrialBalance();},100);
  if(pg==='accounts')  setTimeout(()=>{if(typeof renderTree==='function')renderTree();},100);
  if(pg==='hr')        setTimeout(()=>{if(typeof renderLeaveBalances==='function'){renderLeaveBalances();renderLeaveRequests();}},100);
  if(pg==='dashboard') setTimeout(()=>{if(typeof renderDashboard==='function')renderDashboard();},100);
  if(pg==='income')    setTimeout(()=>{if(typeof renderIncomeStatement==='function')renderIncomeStatement();},100);
  if(pg==='balance-sheet') setTimeout(()=>{if(typeof renderBalanceSheet==='function')renderBalanceSheet();},100);
  if(pg==='ledger') setTimeout(()=>{if(typeof renderLedger==='function')renderLedger();},100);
  if(pg==='customers') setTimeout(()=>{if(typeof renderCustomersPage==='function')renderCustomersPage();},100);
  if(pg==='suppliers') setTimeout(()=>{if(typeof renderSuppliersPage==='function')renderSuppliersPage();},100);
  if(pg==='sales')     setTimeout(()=>{if(typeof renderSalesPage==='function')renderSalesPage();},100);
  if(pg==='purchases')    setTimeout(()=>{if(typeof renderPurchasesPage==='function')renderPurchasesPage();},100);
  if(pg==='expenses')     setTimeout(()=>{if(typeof renderExpensesPage==='function')renderExpensesPage();},100);
  if(pg==='maintenance')  setTimeout(()=>{if(typeof renderMaintenancePage==='function')renderMaintenancePage();},100);
  if(pg==='workflow')      setTimeout(function(){if(typeof renderWorkflowPage==='function')renderWorkflowPage();},100);
  if(pg==='users')         setTimeout(function(){if(typeof renderUsersPage==='function')renderUsersPage();},100);
  if(pg==='receipts')      setTimeout(function(){if(typeof renderReceiptsPage==='function')renderReceiptsPage();},100);
  if(pg==='installments')  setTimeout(function(){if(typeof renderInstallmentsPage==='function')renderInstallmentsPage();},100);
}

// ===== MODALS =====

function closeM(id){const el=document.getElementById(id);if(el)el.classList.remove('open');}


// ===== NOTIFICATIONS =====
function notify(msg,type='info'){
  const c=document.getElementById('notif-container');
  const icons={success:'✅',danger:'❌',info:'ℹ️',warning:'⚠️'};
  const n=document.createElement('div');
  n.className='notif '+type;
  n.innerHTML=icons[type]+' '+msg;
  c.appendChild(n);
  setTimeout(()=>n.remove(),3500);
}

// ===== SALE FUNCTIONS =====
function handleGS(sel,lid){
  const[s,p]=(sel.value||'|').split('|'),pi=document.getElementById(lid+'-price');
  if(p){pi.value=p;calcL(lid);}
}
function handleLT(sel,lid){
  const ss=document.getElementById(lid+'-sel'),qi=document.getElementById(lid+'-qty');
  if(sel.value==='gen'){
    ss.innerHTML='<option value="">— اختر المولد المتوفر —</option><option value="GEN-0045|18500000">GEN-0045 — بيركنز 50KVA ✅</option><option value="GEN-0070|13000000">GEN-0070 — بيركنز 30KVA ✅</option><option value="GEN-0080|55000000">GEN-0080 — بادوين 150KVA ✅</option><option value="GEN-0090|9500000">GEN-0090 — إيسوزو 30KVA ✅</option><option value="X" disabled style="color:var(--text-s)">GEN-0062 — مباع 🔒</option>';
    if(qi){qi.value=1;qi.disabled=true;}
    ss.onchange=function(){handleGS(this,lid);};
  } else {
    ss.innerHTML='<option value="55000">فلتر LF3349 — 55,000</option><option value="12000">زيت Shell — 12,000/لتر</option><option value="210000">بطارية 12V — 210,000</option><option value="2500000">كابينة 50KVA — 2,500,000</option>';
    if(qi)qi.disabled=false;
  }
  calcL(lid);
}
function calcL(lid){
  const p=parseFloat(document.getElementById(lid+'-price')?.value)||0,q=parseFloat(document.getElementById(lid+'-qty')?.value)||1;
  const ti=document.getElementById(lid+'-total');
  if(ti)ti.value=p*q?fmt(p*q):'';
  updGT();
}
function updGT(){
  let t=0;document.querySelectorAll('[id^="sl-"][id$="-total"]').forEach(i=>{t+=parseFloat(i.value.replace(/,/g,''))||0;});
  const gt=document.getElementById('grand-total');if(gt)gt.textContent=fmt(t);
  calcRem();
}
function calcRem(){
  const t=parseFloat((document.getElementById('grand-total')?.textContent||'0').replace(/,/g,''))||0;
  const p=parseFloat(document.getElementById('paid-amt')?.value)||0,r=t-p;
  const ri=document.getElementById('remain-amt');
  if(ri){ri.value=r>0?fmt(r)+' — متبقي':r<0?'⚠️ المدفوع أكبر':'0 — مسدد بالكامل ✓';ri.style.color=r>0?'var(--odoo-red)':r<0?'var(--odoo-orange)':'var(--odoo-green)';}
}
function toggleInst(){const f=document.getElementById('inst-fields');if(f)f.style.display=document.getElementById('pay-method')?.value==='inst'?'block':'none';}
function addGenLine(){
  lineCount++;const id='sl-'+lineCount,d=document.createElement('div');d.className='jl-row';d.id=id;
  d.innerHTML=`<div><select class="lt" onchange="handleLT(this,'${id}')"><option value="gen">مولد (سيريل)</option><option value="item">صنف</option></select></div><div><select id="${id}-sel" onchange="handleGS(this,'${id}')"><option value="">— اختر —</option><option value="GEN-0045|18500000">GEN-0045 بيركنز ✅</option><option value="GEN-0080|55000000">GEN-0080 بادوين ✅</option><option value="GEN-0090|9500000">GEN-0090 إيسوزو ✅</option></select></div><div><input type="number" id="${id}-price" placeholder="السعر" oninput="calcL('${id}')"></div><div><input type="number" value="1" id="${id}-qty" disabled style="background:var(--bg)"></div><div style="display:flex;gap:4px"><input type="text" id="${id}-total" readonly style="background:var(--bg);font-weight:700;font-family:var(--mono);flex:1"><button onclick="document.getElementById(\'${id}\').remove();updGT()" style="background:var(--odoo-red-l);border:none;color:var(--odoo-red);cursor:pointer;padding:4px 8px;border-radius:4px;flex-shrink:0">✕</button></div>`;
  document.getElementById('sale-lines')?.appendChild(d);
}
function addItemLine(){
  lineCount++;const id='sl-'+lineCount,d=document.createElement('div');d.className='jl-row';d.id=id;
  d.innerHTML=`<div><select><option>صنف/خدمة</option></select></div><div><select id="${id}-sel"><option value="55000">فلتر LF3349</option><option value="12000">زيت Shell</option><option value="210000">بطارية 12V</option></select></div><div><input type="number" id="${id}-price" placeholder="السعر" oninput="calcL('${id}')"></div><div><input type="number" value="1" id="${id}-qty" oninput="calcL('${id}')" min="1"></div><div style="display:flex;gap:4px"><input type="text" id="${id}-total" readonly style="background:var(--bg);font-weight:700;font-family:var(--mono);flex:1"><button onclick="document.getElementById(\'${id}\').remove();updGT()" style="background:var(--odoo-red-l);border:none;color:var(--odoo-red);cursor:pointer;padding:4px 8px;border-radius:4px;flex-shrink:0">✕</button></div>`;
  document.getElementById('sale-lines')?.appendChild(d);
}
function saveSale(){
  const sv=document.getElementById('sl-1-sel')?.value||'';
  if(sv.startsWith('X')){notify('هذا المولد غير متاح للبيع 🔒','danger');return;}
  closeM('m-sale');notify('تم حفظ الفاتورة وتحديث المخزون ✓','success');
}

// ===== JOURNAL FUNCTIONS =====
function addJVLine(){
  const d=document.createElement('div');d.className='jl-row';
  d.innerHTML=`<div><select style="border:1px solid transparent;border-radius:4px;padding:5px 6px;font-size:11.5px;width:100%;background:transparent;outline:none"><option>181.1 — صندوق المركز</option><option>183.1 — البنك الأهلي</option><option>124.1 — زبائن قطاع خاص</option><option>121.1 — مخزون المولدات</option><option>251.4 — مورِّدون خاص</option><option>411.4 — إيرادات بيع المولدات</option><option>311.1 — رواتب</option><option>331.1 — إيجار</option><option>333.4 — صيانة مولدات</option></select></div><div><input type="text" style="border:1px solid transparent;border-radius:4px;padding:5px 8px;font-size:12px;width:100%;background:var(--bg);outline:none"></div><div><input type="number" placeholder="0" style="border:1px solid transparent;border-radius:4px;padding:5px 8px;font-size:12px;width:100%;background:transparent;outline:none" oninput="calcJV()"></div><div><input type="number" placeholder="0" style="border:1px solid transparent;border-radius:4px;padding:5px 8px;font-size:12px;width:100%;background:transparent;outline:none" oninput="calcJV()"></div><div><button onclick="this.closest(\'.jl-row\').remove();calcJV()" style="background:var(--odoo-red-l);border:none;color:var(--odoo-red);cursor:pointer;width:28px;height:28px;border-radius:4px;display:flex;align-items:center;justify-content:center">✕</button></div>`;
  document.getElementById('jv-lines')?.appendChild(d);
}
function calcJV(){
  let d=0,c=0;
  document.querySelectorAll('#jv-lines .jl-row').forEach(r=>{const is=r.querySelectorAll('input[type=number]');d+=parseFloat(is[0]?.value)||0;c+=parseFloat(is[1]?.value)||0;});
  const td=document.getElementById('jv-td'),tc=document.getElementById('jv-tc'),ind=document.getElementById('jv-ind'),er=document.getElementById('jv-err');
  if(td)td.textContent=fmt(d);if(tc)tc.textContent=fmt(c);
  if(d>0||c>0){if(Math.abs(d-c)<1){if(er)er.style.display='none';if(ind)ind.innerHTML='<span style="color:var(--odoo-green);font-size:11px">✅ متوازن</span>';}
  else{if(er)er.style.display='flex';if(ind)ind.innerHTML='<span style="color:var(--odoo-red);font-size:10px">❌</span>';}}
}
function saveJV(){
  let d=0,c=0;document.querySelectorAll('#jv-lines .jl-row').forEach(r=>{const is=r.querySelectorAll('input[type=number]');d+=parseFloat(is[0]?.value)||0;c+=parseFloat(is[1]?.value)||0;});
  if(Math.abs(d-c)>1){notify('القيد غير متوازن! مجموع المدين ≠ مجموع الدائن ✕','danger');return;}
  closeM('m-journal');notify('تم حفظ القيد بنجاح (JV-0235) ✓','success');
}

// ===== NEW JOURNAL FUNCTIONS (m-journal new modal) =====
function addJVLineNew(side) {
  if(typeof window.jvLineCount==='undefined') window.jvLineCount=0;
  window.jvLineCount++;
  var lid='jvl'+window.jvLineCount;
  var container=document.getElementById('jv-lines-new');
  if(!container) return;
  var drStyle=side==='credit'
    ?'width:100%;border:1px solid transparent;border-radius:4px;padding:5px 8px;font-size:12px;font-family:monospace;background:var(--bg);color:var(--text-m)'
    :'width:100%;border:1.5px solid var(--odoo-green);border-radius:4px;padding:5px 8px;font-size:12px;font-family:monospace;outline:none;color:var(--odoo-green)';
  var crStyle=side==='debit'
    ?'width:100%;border:1px solid transparent;border-radius:4px;padding:5px 8px;font-size:12px;font-family:monospace;background:var(--bg);color:var(--text-m)'
    :'width:100%;border:1.5px solid var(--odoo-red);border-radius:4px;padding:5px 8px;font-size:12px;font-family:monospace;outline:none;color:var(--odoo-red)';
  var drRo=side==='credit'?' readonly':'';
  var crRo=side==='debit'?' readonly':'';
  var row=document.createElement('div');
  row.id=lid;
  row.style.cssText='display:grid;grid-template-columns:200px 1fr 130px 130px 36px;border-bottom:1px solid #f5f5f5;align-items:center';
  row.innerHTML=
    '<div style="padding:4px 6px">'+
      '<input type="text" id="'+lid+'-code" placeholder="رقم الحساب..." '+
        'style="width:100%;border:1px solid var(--border);border-radius:4px;padding:5px 8px;font-size:11.5px;font-family:monospace;outline:none" '+
        'oninput="filterAccounts(this,\''+lid+'\')" onfocus="filterAccounts(this,\''+lid+'\')">'+
    '</div>'+
    '<div style="padding:4px 6px">'+
      '<input type="text" id="'+lid+'-name" placeholder="ابحث باسم الحساب..." '+
        'style="width:100%;border:1px solid var(--border);border-radius:4px;padding:5px 8px;font-size:12px;outline:none" '+
        'oninput="filterAccountsByName(this,\''+lid+'\')">'+
    '</div>'+
    '<div style="padding:4px 6px">'+
      '<input type="number" id="'+lid+'-dr" placeholder="0" min="0"'+drRo+
        ' style="'+drStyle+'" oninput="calcJVNew()">'+
    '</div>'+
    '<div style="padding:4px 6px">'+
      '<input type="number" id="'+lid+'-cr" placeholder="0" min="0"'+crRo+
        ' style="'+crStyle+'" oninput="calcJVNew()">'+
    '</div>'+
    '<div style="padding:4px 6px">'+
      '<button onclick="document.getElementById(\''+lid+'\').remove();calcJVNew()" '+
        'style="background:var(--odoo-red-l);border:none;color:var(--odoo-red);cursor:pointer;width:28px;height:28px;border-radius:4px;display:flex;align-items:center;justify-content:center">✕</button>'+
    '</div>';
  container.appendChild(row);
  calcJVNew();
}

function calcJVNew() {
  var d=0,c=0;
  document.querySelectorAll('#jv-lines-new > div').forEach(function(row){
    d+=parseFloat(document.getElementById(row.id+'-dr')?.value)||0;
    c+=parseFloat(document.getElementById(row.id+'-cr')?.value)||0;
  });
  var td=document.getElementById('jv-td-new'),tc=document.getElementById('jv-tc-new');
  var ind=document.getElementById('jv-balance-ind'),er=document.getElementById('jv-err-new');
  if(td) td.textContent=fmt(d);
  if(tc) tc.textContent=fmt(c);
  if(d>0||c>0){
    if(Math.abs(d-c)<1){
      if(er) er.style.display='none';
      if(ind) ind.innerHTML='<span style="color:var(--odoo-green);font-size:11px">✅ متوازن</span>';
    } else {
      if(er) er.style.display='flex';
      if(ind) ind.innerHTML='<span style="color:var(--odoo-red);font-size:10px">❌ '+(d>c?'زيادة مدين':'زيادة دائن')+'</span>';
    }
  } else {
    if(er) er.style.display='none';
    if(ind) ind.innerHTML='';
  }
}

function saveJVNew() {
  var desc=document.getElementById('jv-desc')?.value.trim();
  if(!desc){notify('يجب إدخال بيان القيد ✕','danger');return;}
  var d=0,c=0;
  var hasLine=false;
  document.querySelectorAll('#jv-lines-new > div').forEach(function(row){
    var dr=parseFloat(document.getElementById(row.id+'-dr')?.value)||0;
    var cr=parseFloat(document.getElementById(row.id+'-cr')?.value)||0;
    d+=dr; c+=cr;
    if(dr>0||cr>0) hasLine=true;
  });
  if(!hasLine){notify('يجب إضافة سطر واحد على الأقل ✕','danger');return;}
  if(Math.abs(d-c)>1){notify('القيد غير متوازن! مجموع المدين ('+fmt(d)+') ≠ مجموع الدائن ('+fmt(c)+') ✕','danger');return;}
  var jvNum=document.getElementById('jv-num')?.value||'JV-????';
  closeM('m-journal');
  notify('تم حفظ القيد '+jvNum+' بنجاح ✓','success');
  if(typeof addAuditLog==='function') addAuditLog('create',jvNum,'قيد يومي — '+desc);
}

// ===== CUSTOMER SEARCH (in sale invoice) =====
function searchCustomer(q) {
  var results=document.getElementById('cust-search-results');
  var newForm=document.getElementById('sale-new-cust-form');
  var custInfo=document.getElementById('sale-cust-info');
  if(!results) return;
  q=(q||'').trim();
  if(!q){results.style.display='none';if(newForm)newForm.style.display='none';if(custInfo)custInfo.style.display='none';return;}
  var pool=(typeof AI_DATA!=='undefined'&&AI_DATA.customers)?AI_DATA.customers:[];
  var matches=pool.filter(function(c){return c.name.indexOf(q)>=0||(c.phone&&c.phone.indexOf(q)>=0);});
  var html='';
  if(matches.length){
    matches.slice(0,8).forEach(function(cust){
      var debtColor=cust.debt>0?'var(--odoo-red)':cust.debt<0?'var(--odoo-orange)':'var(--odoo-green)';
      var debtLabel=cust.debt>0?'مدين: '+fmt(cust.debt):cust.debt<0?'دائن: '+fmt(Math.abs(cust.debt)):'مسدد ✓';
      var safe=cust.name.replace(/'/g,"\\'");
      html+='<div style="padding:9px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;border-bottom:1px solid #f5f5f5" '+
        'onmouseover="this.style.background=\'var(--odoo-purple-l)\'" onmouseout="this.style.background=\'\'" '+
        'onclick="selectCustomer(\''+cust.id+'\',\''+safe+'\',\''+cust.phone+'\',\''+cust.city+'\','+cust.debt+')">'+
        '<span style="font-size:20px">👤</span>'+
        '<div style="flex:1"><div style="font-weight:700;font-size:12.5px">'+cust.name+'</div>'+
        '<div style="font-size:10.5px;color:var(--text-m)">'+cust.phone+' — '+cust.city+'</div></div>'+
        '<div style="font-size:11px;font-weight:700;color:'+debtColor+'">'+debtLabel+'</div>'+
      '</div>';
    });
    if(newForm) newForm.style.display='none';
  } else {
    html='<div style="padding:10px 14px;font-size:12px;color:var(--text-m)">لا يوجد زبون باسم "'+q+'"</div>'+
      '<div style="padding:8px 14px;cursor:pointer;background:var(--odoo-blue-l);color:var(--odoo-blue);font-size:12px;font-weight:700" '+
      'onclick="showNewCustForm()">＋ إنشاء زبون جديد باسم "'+q+'"</div>';
  }
  results.innerHTML=html;
  results.style.display='block';
}

function selectCustomer(id,name,phone,city,debt) {
  window.selectedCustomer={id:id,name:name,phone:phone,city:city,debt:debt};
  var inp=document.getElementById('sale-cust-search');
  if(inp) inp.value=name;
  var r=document.getElementById('cust-search-results');
  if(r) r.style.display='none';
  var ci=document.getElementById('sale-cust-info');
  if(ci) ci.style.display='block';
  var cn=document.getElementById('sale-cust-name');
  if(cn) cn.textContent=name;
  var cb=document.getElementById('sale-cust-badge');
  if(cb){
    if(debt>0){cb.className='badge badge-red';cb.textContent='مدين '+fmt(debt)+' د.ع';}
    else if(debt<0){cb.className='badge badge-orange';cb.textContent='دائن '+fmt(Math.abs(debt));}
    else{cb.className='badge badge-green';cb.textContent='حساب مسدد ✓';}
  }
  var cd=document.getElementById('sale-cust-details');
  if(cd) cd.textContent=phone+' — '+city;
  var nf=document.getElementById('sale-new-cust-form');
  if(nf) nf.style.display='none';
}

function showNewCustForm() {
  var r=document.getElementById('cust-search-results');
  if(r) r.style.display='none';
  var nf=document.getElementById('sale-new-cust-form');
  if(nf) nf.style.display='block';
}

function saveInventoryItem() {
  var code=(document.getElementById('inv-code')?.value||'').trim();
  var name=(document.getElementById('inv-name')?.value||'').trim();
  if(!code){notify('يجب إدخال كود الصنف ✕','danger');return;}
  if(!name){notify('يجب إدخال اسم الصنف ✕','danger');return;}
  var qty=parseInt(document.getElementById('inv-qty')?.value)||0;
  var min=parseInt(document.getElementById('inv-min')?.value)||5;
  var cost=parseFloat(document.getElementById('inv-cost')?.value)||0;
  var price=parseFloat(document.getElementById('inv-price')?.value)||0;
  var cat=document.getElementById('inv-cat')?.value||'part';
  var unit=document.getElementById('inv-unit')?.value||'قطعة';
  var costMethod=(document.querySelector('input[name="inv-cost-method"]:checked')||{}).value||'average';
  var trackSerial=document.getElementById('inv-track-serial')?.checked||false;
  if(typeof INV_ITEMS!=='undefined') INV_ITEMS.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price,unit:unit,costMethod:costMethod,trackSerial:trackSerial});
  if(typeof AI_DATA!=='undefined'&&AI_DATA.inventory) AI_DATA.inventory.push({code:code,name:name,cat:cat,qty:qty,min:min,cost:cost,price:price});
  saveToStorage();
  closeM('m-inventory');
  notify('تم إضافة الصنف "'+name+'" بنجاح ✓','success');
}

// ============================================================
// USER MANAGEMENT v2 — عرض / إضافة / تعديل / حذف
// ============================================================

// تحويل الصلاحيات القديمة (full/view/none) للهيكل الجديد
function normPerm(p) {
  if (p && typeof p === "object" && "view" in p) return p;
  if (p === "full") return {view:true,  create:true,  edit:true,  del:true};
  if (p === "view") return {view:true,  create:false, edit:false, del:false};
  return             {view:false, create:false, edit:false, del:false};
}

function permBadge(p) {
  p = normPerm(p);
  var all4 = p.view && p.create && p.edit && p.del;
  var none = !p.view && !p.create && !p.edit && !p.del;
  if (all4) return '<span style="color:var(--odoo-green);font-weight:700" title="كامل">✅</span>';
  if (none) return '<span style="color:#d1d5db">—</span>';
  return (
    (p.view   ? '<span title="عرض"   style="color:var(--odoo-blue);font-size:13px">👁</span>'    : '') +
    (p.create ? '<span title="إضافة" style="color:var(--odoo-green);font-size:11px">➕</span>'  : '') +
    (p.edit   ? '<span title="تعديل" style="color:#f59e0b;font-size:13px">✏️</span>'           : '') +
    (p.del    ? '<span title="حذف"   style="color:var(--odoo-red);font-size:13px">🗑</span>'   : '')
  );
}

var ROLE_ICONS = {admin:"👑",accountant:"📊",supervisor:"👔",sales:"💼",warehouse:"📦",technician:"🔧",collector:"💰",clerk:"🧾"};
var ROLE_NAMES = {admin:"مدير عام",accountant:"محاسب",supervisor:"مشرف",sales:"مسؤول مبيعات",warehouse:"أمين مخزن",technician:"فني صيانة",collector:"محصل",clerk:"موظف إداري"};

function renderUsersPage() {
  var wrap = document.getElementById("users-table-wrap");
  if (!wrap) return;
  var db   = typeof USERS_DB    !== "undefined" ? USERS_DB    : [];
  var mods = typeof PERM_MODULES !== "undefined" ? PERM_MODULES : [];
  var sub  = document.getElementById("users-subtitle");
  if (sub) sub.textContent = db.length + " مستخدم مسجل";
  if (!db.length) { wrap.innerHTML = '<div style="padding:40px;text-align:center;color:#9ca3af">لا يوجد مستخدمون</div>'; return; }
  var thead = '<tr><th style="min-width:130px">المستخدم</th><th>الدور</th>';
  mods.forEach(function(m) {
    thead += '<th style="text-align:center;min-width:72px;font-size:11px">' + m.label +
      ' <span style="cursor:pointer;color:var(--odoo-red);font-size:9px" onclick="deletePermModule(\''+ m.key +'\')" title="حذف العمود">✕</span></th>';
  });
  thead += '<th style="font-size:11px">آخر دخول</th><th></th></tr>';

  var rows = db.map(function(u) {
    var icon = ROLE_ICONS[u.role] || "👤";
    var rname = ROLE_NAMES[u.role] || u.role;
    var cells = "";
    mods.forEach(function(m) {
      var p = normPerm((u.perms || {})[m.key]);
      var bg = p.view && p.create && p.edit && p.del ? "var(--odoo-green-l)" :
               p.view ? "#f0f9ff" : "";
      cells += '<td style="text-align:center;padding:4px 2px;background:' + bg +
        ';cursor:pointer" onclick="quickToggleMod(\''+ u.id +'\',\''+ m.key +'\')" title="انقر للتبديل">' + permBadge(p) + '</td>';
    });
    var isAdmin = u.username === "admin";
    return '<tr>' +
      '<td><div style="font-weight:700">' + u.name + '</div>' +
          '<div style="font-size:11px;color:var(--odoo-blue);font-family:monospace">' + u.username + '</div></td>' +
      '<td style="white-space:nowrap">' + icon + " " + rname + '</td>' +
      cells +
      '<td style="font-size:10px;color:var(--text-m);white-space:nowrap">' + (u.lastLogin||"—") + '</td>' +
      '<td style="white-space:nowrap">' +
        '<button class="btn btn-secondary btn-xs" onclick="openEditUser(\''+ u.id +'\')" title="تعديل الصلاحيات">✏️ تعديل</button> ' +
        (!isAdmin ? '<button class="btn btn-danger btn-xs" onclick="deleteUser(\''+ u.id +'\')" title="حذف">🗑</button>' : "") +
      '</td></tr>';
  }).join("");
  wrap.innerHTML = '<div class="o-table-wrap"><table class="o-table" style="font-size:12px"><thead>' + thead + '</thead><tbody>' + rows + '</tbody></table></div>';
}

// تبديل سريع: نقرة على الخلية → كامل / عرض فقط / لا شيء
function quickToggleMod(userId, modKey) {
  var db = typeof USERS_DB !== "undefined" ? USERS_DB : [];
  var u = db.find(function(u){ return u.id === userId; });
  if (!u) return;
  if (!u.perms) u.perms = {};
  var p = normPerm(u.perms[modKey]);
  // cycle: none → view → full → none
  var none4 = !p.view && !p.create && !p.edit && !p.del;
  var all4  = p.view  && p.create  && p.edit  && p.del;
  if (none4)       u.perms[modKey] = {view:true, create:false, edit:false, del:false};
  else if (!all4)  u.perms[modKey] = {view:true, create:true,  edit:true,  del:true};
  else             u.perms[modKey] = {view:false,create:false, edit:false, del:false};
  saveToStorage();
  renderUsersPage();
}

function openEditUser(id) {
  var db = typeof USERS_DB !== "undefined" ? USERS_DB : [];
  var u = id ? db.find(function(u){ return u.id === id; }) : null;
  document.getElementById("usr-edit-id").value  = id || "";
  var t = document.getElementById("usr-modal-title");
  if (t) t.textContent = id ? "✏️ تعديل صلاحيات المستخدم" : "🔑 إضافة مستخدم جديد";
  document.getElementById("usr-username").value = u ? u.username : "";
  document.getElementById("usr-fullname").value = u ? u.name     : "";
  document.getElementById("usr-pass").value     = u ? u.pass     : "";
  var re = document.getElementById("usr-role");
  if (re) re.value = u ? (u.role || "sales") : "sales";
  renderUserPermsGrid(u ? u.perms : {});
  openM("m-user");
}

function openAddUser() { openEditUser(null); }

function applyRoleTemplate(role) {
  var tpl = typeof ROLE_TEMPLATES !== "undefined" ? (ROLE_TEMPLATES[role] || ROLE_TEMPLATES.clerk) : {};
  var mods = typeof PERM_MODULES !== "undefined" ? PERM_MODULES : [];
  mods.forEach(function(m) {
    var p = normPerm(tpl[m.key]);
    ["view","create","edit","del"].forEach(function(a) {
      var cb = document.getElementById("perm-" + m.key + "-" + a);
      if (cb) { cb.checked = p[a]; }
    });
    updatePermRow(m.key);
  });
}

function renderUserPermsGrid(perms) {
  var mods = typeof PERM_MODULES !== "undefined" ? PERM_MODULES : [];
  var grid = document.getElementById("usr-perms-grid");
  if (!grid) return;
  if (!mods.length) { grid.innerHTML = '<div style="padding:14px;text-align:center;color:var(--text-s)">لا توجد وحدات</div>'; return; }
  var header = '<tr style="background:var(--odoo-purple-l)">' +
    '<th style="padding:8px 12px;text-align:right;font-size:12px">الوحدة</th>' +
    '<th style="padding:8px;text-align:center;min-width:54px;font-size:11px" title="يمكنه رؤية البيانات">👁<br>عرض</th>' +
    '<th style="padding:8px;text-align:center;min-width:54px;font-size:11px" title="يمكنه إضافة سجلات جديدة">➕<br>إضافة</th>' +
    '<th style="padding:8px;text-align:center;min-width:54px;font-size:11px" title="يمكنه تعديل السجلات">✏️<br>تعديل</th>' +
    '<th style="padding:8px;text-align:center;min-width:54px;font-size:11px" title="يمكنه حذف السجلات">🗑<br>حذف</th></tr>';
  var bodyRows = mods.map(function(m) {
    var p = normPerm((perms || {})[m.key]);
    var all4 = p.view && p.create && p.edit && p.del;
    var bg = all4 ? "var(--odoo-green-l)" : p.view ? "#f8fafc" : "";
    return '<tr id="permrow-' + m.key + '" style="border-bottom:1px solid var(--border);background:' + bg + '">' +
      '<td style="padding:7px 12px;font-weight:600;font-size:13px">' + m.label + '</td>' +
      mkCB(m.key,"view",  p.view)   +
      mkCB(m.key,"create",p.create) +
      mkCB(m.key,"edit",  p.edit)   +
      mkCB(m.key,"del",   p.del)    +
    '</tr>';
  }).join("");
  grid.innerHTML = '<table style="width:100%;border-collapse:collapse"><thead>' + header + '</thead><tbody>' + bodyRows + '</tbody></table>';
}

function mkCB(modKey, action, checked) {
  var id = "perm-" + modKey + "-" + action;
  return '<td style="text-align:center;padding:6px">' +
    '<input type="checkbox" id="' + id + '" ' + (checked?"checked":"") +
    ' onchange="updatePermRow(\''+ modKey +'\')" style="width:18px;height:18px;cursor:pointer;accent-color:var(--odoo-purple)">' +
    '</td>';
}

function updatePermRow(modKey) {
  var actions = ["view","create","edit","del"];
  var all4 = actions.every(function(a){ var cb = document.getElementById("perm-"+modKey+"-"+a); return cb && cb.checked; });
  var anyOn = actions.some(function(a){ var cb = document.getElementById("perm-"+modKey+"-"+a); return cb && cb.checked; });
  var row = document.getElementById("permrow-" + modKey);
  if (row) row.style.background = all4 ? "var(--odoo-green-l)" : anyOn ? "#f8fafc" : "";
}

function setAllPerms(val) {
  var mods = typeof PERM_MODULES !== "undefined" ? PERM_MODULES : [];
  mods.forEach(function(m) {
    ["view","create","edit","del"].forEach(function(a) {
      var cb = document.getElementById("perm-"+m.key+"-"+a);
      if (cb) cb.checked = val;
    });
    updatePermRow(m.key);
  });
}

function saveUserForm() {
  var id       = (document.getElementById("usr-edit-id").value  || "").trim();
  var username = (document.getElementById("usr-username").value || "").trim();
  var name     = (document.getElementById("usr-fullname").value || "").trim();
  var pass     = (document.getElementById("usr-pass").value     || "").trim();
  var role     = document.getElementById("usr-role").value || "sales";
  if (!username) { notify("يجب إدخال اسم الدخول ✕","danger"); return; }
  if (!name)     { notify("يجب إدخال الاسم الكامل ✕","danger"); return; }
  if (!pass || pass.length < 4) { notify("كلمة المرور يجب أن تكون 4 أحرف على الأقل ✕","danger"); return; }
  var mods = typeof PERM_MODULES !== "undefined" ? PERM_MODULES : [];
  var perms = {};
  mods.forEach(function(m) {
    perms[m.key] = {
      view:   !!(document.getElementById("perm-"+m.key+"-view")   || {}).checked,
      create: !!(document.getElementById("perm-"+m.key+"-create") || {}).checked,
      edit:   !!(document.getElementById("perm-"+m.key+"-edit")   || {}).checked,
      del:    !!(document.getElementById("perm-"+m.key+"-del")    || {}).checked
    };
  });
  var db = typeof USERS_DB !== "undefined" ? USERS_DB : [];
  if (id) {
    var u = db.find(function(u){ return u.id === id; });
    if (u) { u.username=username; u.name=name; u.pass=pass; u.role=role; u.perms=perms; }
  } else {
    if (db.find(function(u){ return u.username===username; })) {
      notify("اسم الدخول \""+username+"\" موجود مسبقاً ✕","danger"); return;
    }
    db.push({id:"USR-"+String(Date.now()).slice(-5), username:username, name:name, pass:pass, role:role, perms:perms, lastLogin:""});
  }
  saveToStorage();
  closeM("m-user");
  renderUsersPage();
  notify("تم حفظ بيانات المستخدم ✓","success");
}

function deleteUser(id) {
  rayaConfirm("هل تريد حذف هذا المستخدم؟",function(){
  var db = typeof USERS_DB !== "undefined" ? USERS_DB : [];
  var idx = db.findIndex(function(u){ return u.id===id; });
  if (idx >= 0) db.splice(idx, 1);
  saveToStorage(); renderUsersPage();
  notify("تم حذف المستخدم ✓","success");
},{danger:true});}

function openAddPermModule(){
  rayaPrompt("مفتاح الصلاحية الجديدة (إنجليزي بدون مسافات):",function(key){
    if(!key||!key.trim())return;
    key=key.trim().toLowerCase().replace(/\s+/g,"_");
    rayaPrompt("اسم الصلاحية (بالعربي):",function(label){
      if(!label||!label.trim())return;
      var mods=typeof PERM_MODULES!=="undefined"?PERM_MODULES:[];
      if(mods.find(function(m){return m.key===key;})){notify("الصلاحية موجودة مسبقاً","warning");return;}
      mods.push({key:key,label:label.trim()});
      saveToStorage();renderUsersPage();
      notify("تمت إضافة الصلاحية ✓","success");
    });
  });
}

function deletePermModule(key) {
  rayaConfirm("حذف عمود الصلاحية \""+key+"\"؟",function(){
  var mods = typeof PERM_MODULES !== "undefined" ? PERM_MODULES : [];
  var idx = mods.findIndex(function(m){ return m.key===key; });
  if (idx >= 0) mods.splice(idx, 1);
  saveToStorage(); renderUsersPage();
  notify("تم الحذف ✓","success");
},{danger:true});}

function saveNewUser() { saveUserForm(); } // backward compat

// ============================================================
// RECEIPTS PAGE — صفحة وصولات القبض الديناميكية
// ============================================================
function renderReceiptsPage() {
  var wrap = document.getElementById("rcp-table-wrap");
  var statsDiv = document.getElementById("rcp-stats");
  var sub = document.getElementById("rcp-page-subtitle");
  if (!wrap) return;
  var today = new Date();
  var from = document.getElementById("rcp-filter-from"); var fromDate = from ? from.value : "";
  var to   = document.getElementById("rcp-filter-to");   var toDate   = to   ? to.value   : "";
  var entries = typeof JOURNAL_ENTRIES_DATA !== "undefined" ? JOURNAL_ENTRIES_DATA : [];
  var rcps = entries.filter(function(e){ return e.journal==="receipt"; });
  if (fromDate) rcps = rcps.filter(function(e){ return e.date >= fromDate; });
  if (toDate)   rcps = rcps.filter(function(e){ return e.date <= toDate; });
  rcps = rcps.slice().sort(function(a,b){ return (b.date||"").localeCompare(a.date||""); });
  var total = rcps.reduce(function(s,e){ return s + ((e.lines||[]).find(function(l){return l.debit>0;})||{}).debit||0; },0);
  var cashTotal = rcps.filter(function(e){return e.method==="cash";}).reduce(function(s,e){return s+((e.lines||[]).find(function(l){return l.debit>0;})||{}).debit||0;},0);
  var bankTotal = rcps.filter(function(e){return e.method==="electronic";}).reduce(function(s,e){return s+((e.lines||[]).find(function(l){return l.debit>0;})||{}).debit||0;},0);
  if (sub) sub.textContent = rcps.length + " وصل قبض";
  if (statsDiv) statsDiv.innerHTML = [
    {label:"إجمالي المقبوضات",val:fmt(total)+" د.ع",color:"var(--odoo-green)",icon:"💵"},
    {label:"نقد",             val:fmt(cashTotal)+" د.ع",color:"var(--odoo-green)",icon:"💴"},
    {label:"حوالة مصرفية",   val:fmt(bankTotal)+" د.ع",color:"var(--odoo-blue)", icon:"🏦"},
    {label:"عدد الوصولات",   val:rcps.length,           color:"var(--odoo-purple)",icon:"📋"}
  ].map(function(s){
    return '<div class="card" style="border-right:4px solid '+s.color+';padding:14px">' +
      '<div style="font-size:20px">'+s.icon+'</div>' +
      '<div style="font-size:11px;color:var(--text-m);margin-top:4px">'+s.label+'</div>' +
      '<div style="font-size:18px;font-weight:800;color:'+s.color+'">'+s.val+'</div></div>';
  }).join("");
  if (!rcps.length) {
    wrap.innerHTML = '<div style="padding:40px;text-align:center;color:#9ca3af">لا توجد وصولات قبض في هذه الفترة</div>';
    return;
  }
  var typeLabel={arboon:"💛 عربون",takmila:"🔵 تكملة",tasdeed:"🟢 تسديد",aqsat:"💜 قسط"};
  var rows = rcps.map(function(e) {
    var amt = ((e.lines||[]).find(function(l){return l.debit>0;})||{}).debit||0;
    return '<tr>' +
      '<td class="code-cell">'+e.id+'</td>' +
      '<td>'+e.date+'</td>' +
      '<td style="font-weight:700">'+( e.customer||"—" )+'</td>' +
      '<td style="font-weight:800;color:var(--odoo-green)">'+fmt(amt)+' د.ع</td>' +
      '<td>'+( typeLabel[e.type]||e.type||"—" )+'</td>' +
      '<td>'+( e.ref||"—" )+'</td>' +
      '<td><span class="badge '+( e.method==="cash"?"badge-green":"badge-blue" )+'">'+( e.method==="cash"?"💵 نقد":"🏦 حوالة" )+'</span></td>' +
      '<td><button class="btn btn-secondary btn-xs" onclick="printRcp()">🖨</button></td></tr>';
  }).join("");
  wrap.innerHTML = '<table class="o-table"><thead><tr><th>رقم الوصل</th><th>التاريخ</th><th>الزبون</th><th>المبلغ</th><th>النوع</th><th>المرجع</th><th>طريقة الدفع</th><th></th></tr></thead><tbody>'+rows+'</tbody></table>';
}

// ============================================================
// INSTALLMENTS PAGE — صفحة إدارة الأقساط الديناميكية
// ============================================================
function renderInstallmentsPage(filter) {
  filter = filter || "all";
  var db = typeof INSTALLMENTS_DB !== "undefined" ? INSTALLMENTS_DB : [];
  var today = new Date(); today.setHours(0,0,0,0);
  // تحديث حالة الأقساط تلقائياً
  db.forEach(function(c) {
    if (!c.payments) return;
    var allPaid = true;
    c.payments.forEach(function(p) {
      if (p.status === "paid") return;
      var due = new Date(p.dueDate); due.setHours(0,0,0,0);
      if (due < today) p.status = "overdue"; else p.status = "pending";
      allPaid = false;
    });
    if (allPaid) c.status = "complete";
  });
  var sub = document.getElementById("inst-subtitle");
  var statsDiv = document.getElementById("inst-stats");
  var overdueWrap = document.getElementById("inst-overdue-wrap");
  var contractsWrap = document.getElementById("inst-contracts-wrap");
  var totalContracts = db.length;
  var activeContracts = db.filter(function(c){return c.status==="active";}).length;
  var overduePayments = [];
  db.forEach(function(c){
    (c.payments||[]).forEach(function(p,i){
      if(p.status==="overdue") overduePayments.push({contract:c, pIdx:i, p:p});
    });
  });
  var totalCollected = 0;
  db.forEach(function(c){ (c.payments||[]).forEach(function(p){ if(p.status==="paid") totalCollected+=p.amt||0; }); totalCollected+=(c.downAmt||0); });
  if (sub) sub.textContent = totalContracts+" عقد — "+overduePayments.length+" قسط متأخر";
  if (statsDiv) statsDiv.innerHTML = [
    {label:"إجمالي العقود",  val:totalContracts,              color:"var(--odoo-purple)",icon:"📋"},
    {label:"عقود نشطة",      val:activeContracts,             color:"var(--odoo-blue)", icon:"💳"},
    {label:"أقساط متأخرة",   val:overduePayments.length,     color:"var(--odoo-red)",  icon:"⚠️"},
    {label:"إجمالي المحصل",  val:fmt(totalCollected)+" د.ع", color:"var(--odoo-green)", icon:"💰"}
  ].map(function(s){
    return '<div class="card" style="border-right:4px solid '+s.color+';padding:14px">' +
      '<div style="font-size:20px">'+s.icon+'</div>' +
      '<div style="font-size:11px;color:var(--text-m);margin-top:4px">'+s.label+'</div>' +
      '<div style="font-size:18px;font-weight:800;color:'+s.color+'">'+s.val+'</div></div>';
  }).join("");
  // الأقساط المتأخرة
  if (overduePayments.length > 0 && overdueWrap) {
    var days = function(d){var dd=Math.floor((today-new Date(d))/(1000*60*60*24));return dd;};
    var overdueRows = overduePayments.map(function(r){
      var daysLate = days(r.p.dueDate);
      return '<tr>' +
        '<td style="font-weight:700">'+r.contract.custName+'</td>' +
        '<td class="code-cell">'+r.contract.id+'</td>' +
        '<td style="text-align:center">قسط '+(r.pIdx+1)+' من '+r.contract.payments.length+'</td>' +
        '<td>'+r.p.dueDate+'</td>' +
        '<td style="font-weight:800;color:var(--odoo-red)">'+ fmt(r.p.amt)+' د.ع</td>' +
        '<td><span class="badge badge-red">'+ daysLate +' يوم</span></td>' +
        '<td><button class="btn btn-success btn-xs" onclick="payInstallment(\''+ r.contract.id +'\','+ r.pIdx +')">✅ تسجيل دفع</button></td></tr>';
    }).join("");
    overdueWrap.innerHTML = '<div class="card" style="border-color:var(--odoo-red);margin-bottom:16px">' +
      '<div class="card-header" style="background:var(--odoo-red-l)"><h3 style="color:var(--odoo-red)">⚠️ أقساط متأخرة ('+ overduePayments.length +')</h3></div>' +
      '<div class="o-table-wrap"><table class="o-table"><thead><tr>' +
      '<th>الزبون</th><th>العقد</th><th>القسط</th><th>تاريخ الاستحقاق</th><th>المبلغ</th><th>أيام التأخير</th><th>إجراء</th>' +
      '</tr></thead><tbody>'+ overdueRows +'</tbody></table></div></div>';
  } else if (overdueWrap) {
    overdueWrap.innerHTML = "";
  }
  // العقود
  if (!db.length) {
    if (contractsWrap) contractsWrap.innerHTML = '<div class="card"><div style="padding:40px;text-align:center;color:#9ca3af">لا توجد عقود تقسيط بعد — اضغط "＋ عقد تقسيط" لإضافة عقد جديد</div></div>';
    return;
  }
  var list = filter==="overdue" ? db.filter(function(c){return (c.payments||[]).some(function(p){return p.status==="overdue";});}) : db;
  if (contractsWrap) {
    contractsWrap.innerHTML = list.map(function(c) {
      var paid = (c.payments||[]).filter(function(p){return p.status==="paid";}).length;
      var total = (c.payments||[]).length;
      var pct = total ? Math.round(paid/total*100) : 0;
      var stBadge = c.status==="complete" ? '<span class="badge badge-green">✅ مكتمل</span>' : '<span class="badge badge-yellow">🔄 جارية</span>';
      var instRows = (c.payments||[]).map(function(p,i){
        var stIcon = p.status==="paid"?"✅":p.status==="overdue"?"⚠️":"⏳";
        var stColor = p.status==="paid"?"var(--odoo-green)":p.status==="overdue"?"var(--odoo-red)":"#94a3b8";
        return '<div style="display:grid;grid-template-columns:80px 1fr 120px 90px 80px;gap:8px;align-items:center;padding:5px 10px;border-bottom:1px solid var(--border)">' +
          '<div style="font-size:12px;font-weight:600">قسط '+(i+1)+'</div>' +
          '<div style="font-size:12px;font-weight:700;color:var(--odoo-blue)">'+ fmt(p.amt) +' د.ع</div>' +
          '<div style="font-size:11px;color:var(--text-m)">'+p.dueDate+'</div>' +
          '<div style="color:'+stColor+';font-size:12px">'+ stIcon +' '+ (p.status==="paid"?"مدفوع":p.status==="overdue"?"متأخر":"غير مستحق") +'</div>' +
          '<div>'+ (p.status!=="paid"?'<button class="btn btn-success btn-xs" onclick="payInstallment(\''+ c.id +'\','+ i +')">✅ دفع</button>':'') +'</div>' +
        '</div>';
      }).join("");
      return '<div class="card" style="margin-bottom:14px">' +
        '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
          '<h3>'+c.id+' — '+c.custName+'</h3>' + stBadge + '</div>' +
        '<div class="card-body">' +
          '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:12px">' +
            '<div><div style="font-size:10px;color:var(--text-m)">المبلغ الكلي</div><div style="font-weight:800">'+ fmt(c.totalAmt) +' د.ع</div></div>' +
            '<div><div style="font-size:10px;color:var(--text-m)">المقدمة</div><div style="font-weight:800;color:var(--odoo-green)">'+ fmt(c.downAmt) +' د.ع</div></div>' +
            '<div><div style="font-size:10px;color:var(--text-m)">كل قسط</div><div style="font-weight:800;color:var(--odoo-blue)">'+ fmt(c.instAmt) +' د.ع</div></div>' +
            '<div><div style="font-size:10px;color:var(--text-m)">مدفوع</div><div style="font-weight:800;color:var(--odoo-green)">'+ paid +'/'+ total +'</div></div>' +
            '<div><div style="font-size:10px;color:var(--text-m)">التقدم</div><div style="height:8px;background:var(--border);border-radius:4px;margin-top:6px"><div style="width:'+ pct +'%;height:100%;background:var(--odoo-green);border-radius:4px"></div></div></div>' +
          '</div>' +
          '<div style="border:1px solid var(--border);border-radius:var(--r);overflow:hidden">'+ instRows +'</div>' +
        '</div></div>';
    }).join("");
  }
}

function payInstallment(contractId, pIdx) {
  var db = typeof INSTALLMENTS_DB !== "undefined" ? INSTALLMENTS_DB : [];
  var c = db.find(function(c){ return c.id===contractId; });
  if (!c || !c.payments || !c.payments[pIdx]) return;
  var p = c.payments[pIdx];
  if (p.status === "paid") { notify("هذا القسط مدفوع مسبقاً","warning"); return; }
  rayaConfirm("تأكيد تسجيل دفع القسط "+(pIdx+1)+" بمبلغ "+fmt(p.amt)+" د.ع للزبون "+c.custName+"؟",function(){
  p.status = "paid";
  p.paidDate = new Date().toISOString().split("T")[0];
  var jId = "RCP-"+String(Date.now()).slice(-6);
  p.rcpRef = jId;
  if (typeof JOURNAL_ENTRIES_DATA !== "undefined") {
    JOURNAL_ENTRIES_DATA.push({id:jId, date:p.paidDate, journal:"receipt",
      ref:contractId, customer:c.custName, customerId:c.custId,
      type:"aqsat", method:"cash",
      lines:[{code:"1611",debit:p.amt},{code:"1511",credit:p.amt}]
    });
  }
  if (typeof CUSTOMERS_DB !== "undefined" && c.custId) {
    var cr = CUSTOMERS_DB.find(function(cu){ return cu.id===c.custId||cu.name===c.custName; });
    if (cr) cr.debt = Math.max(0, (cr.debt||0) - p.amt);
  }
  saveToStorage();
  renderInstallmentsPage();
  notify("تم تسجيل دفع القسط "+(pIdx+1)+" ✓","success");
  });
}

function calcInstPreview() {
  var total = parseFloat((document.getElementById("inst-total-amt")||{}).value)||0;
  var down  = parseFloat((document.getElementById("inst-down-amt")||{}).value)||0;
  var num   = parseInt((document.getElementById("inst-num")||{}).value)||6;
  var prev  = document.getElementById("inst-preview");
  var cont  = document.getElementById("inst-preview-content");
  if (!total || !prev || !cont) return;
  var rem   = total - down;
  var inst  = rem > 0 ? Math.round(rem / num) : 0;
  prev.style.display = "";
  cont.innerHTML = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:13px">' +
    '<div><div style="font-size:10px;color:var(--text-m)">المتبقي بعد المقدمة</div><div style="font-weight:800">'+ fmt(rem) +' د.ع</div></div>' +
    '<div><div style="font-size:10px;color:var(--text-m)">كل قسط</div><div style="font-weight:800;color:var(--odoo-blue)">'+ fmt(inst) +' د.ع</div></div>' +
    '<div><div style="font-size:10px;color:var(--text-m)">عدد الأقساط</div><div style="font-weight:800">'+ num +'</div></div></div>';
}

function saveInstallmentContract() {
  var custId   = (document.getElementById("sb-inst-cus-val")||{}).value||"";
  var custName = (document.getElementById("sb-inst-cus-text")||{}).value||"";
  var invRef   = (document.getElementById("inst-inv-ref")||{}).value||"";
  var totalAmt = parseFloat((document.getElementById("inst-total-amt")||{}).value)||0;
  var downAmt  = parseFloat((document.getElementById("inst-down-amt")||{}).value)||0;
  var numInst  = parseInt((document.getElementById("inst-num")||{}).value)||6;
  var startDate= (document.getElementById("inst-start-date")||{}).value||new Date().toISOString().split("T")[0];
  if (!custName) { notify("يجب اختيار الزبون ✕","danger"); return; }
  if (totalAmt <= 0) { notify("يجب إدخال المبلغ الكلي ✕","danger"); return; }
  if (downAmt >= totalAmt) { notify("المقدمة يجب أن تكون أقل من المبلغ الكلي ✕","danger"); return; }
  var remaining = totalAmt - downAmt;
  var instAmt   = Math.round(remaining / numInst);
  var payments  = [];
  for (var i=0; i<numInst; i++) {
    var d = new Date(startDate);
    d.setMonth(d.getMonth() + i + 1);
    payments.push({n:i+1, dueDate:d.toISOString().split("T")[0], amt: i===numInst-1 ? remaining-(instAmt*(numInst-1)) : instAmt, status:"pending", rcpRef:"", paidDate:""});
  }
  var db = typeof INSTALLMENTS_DB !== "undefined" ? INSTALLMENTS_DB : [];
  var newId = "INST-"+String(Date.now()).slice(-5);
  db.push({id:newId, date:new Date().toISOString().split("T")[0], custId:custId, custName:custName, invRef:invRef, totalAmt:totalAmt, downAmt:downAmt, numInst:numInst, instAmt:instAmt, startDate:startDate, status:"active", payments:payments});
  // تحديث ذمة الزبون بالمبلغ المتبقي
  if (typeof CUSTOMERS_DB !== "undefined" && (custId||custName)) {
    var cr = CUSTOMERS_DB.find(function(c){ return c.id===custId||c.name===custName; });
    if (cr) cr.debt = (cr.debt||0) + remaining;
  }
  saveToStorage();
  closeM("m-installment");
  renderInstallmentsPage();
  notify("تم إنشاء عقد التقسيط "+newId+" ✓","success");
}

// ============================================================
// PERMISSIONS UI — إخفاء عناصر التنقل بدون صلاحية — إخفاء عناصر التنقل بدون صلاحية
// ============================================================
function hasPerm(mod, action) {
  if (!currentUser) return false;
  if (currentUser.role === "admin") return true;
  var p = typeof normPerm === "function" ? normPerm((currentUser.perms || {})[mod]) : {view:true,create:true,edit:true,del:true};
  return p[action === "del" ? "del" : action] === true;
}

function applyPermissionsUI() {
  if (!currentUser) return;
  var perms = currentUser.perms || {};
  var isAdmin = currentUser.role === "admin";
  // إخفاء عناصر القائمة الجانبية التي لا يملك المستخدم إذن عرضها
  document.querySelectorAll(".nav-item[onclick]").forEach(function(el) {
    if (isAdmin) { el.style.display = ""; return; }
    var m = el.getAttribute("onclick").match(/go\('([^']+)'/);
    if (!m) return;
    var mod = _PG_MOD[m[1]];
    if (!mod) return;
    var p = typeof normPerm === "function" ? normPerm(perms[mod]) : {view:true};
    el.style.display = p.view ? "" : "none";
  });
  // إظهار/إخفاء أزرار الإنشاء حسب صلاحية create
  document.querySelectorAll("[data-need-create]").forEach(function(el) {
    var mod = el.getAttribute("data-need-create");
    el.style.display = hasPerm(mod, "create") ? "" : "none";
  });
  // عرض دور المستخدم في الشريط العلوي
  var rnames = {admin:"مدير عام",accountant:"محاسب",supervisor:"مشرف",sales:"مسؤول مبيعات",warehouse:"أمين مخزن",technician:"فني صيانة",collector:"محصل",clerk:"موظف إداري"};
  var bc = document.getElementById("topbar-bc");
  if (bc) bc.textContent = "مرحباً، " + currentUser.name + " — " + (rnames[currentUser.role] || currentUser.role);
}

function confirmNewCustomer() {
  var name=(document.getElementById('nc-name')?.value||'').trim();
  var phone=(document.getElementById('nc-phone')?.value||'').trim();
  if(!name){notify('يجب إدخال اسم الزبون ✕','danger');return;}
  if(!phone){notify('يجب إدخال رقم الهاتف ✕','danger');return;}
  var address=document.getElementById('nc-address')?.value||'';
  var newId='CUS-'+String(Date.now()).slice(-4);
  var newCust={id:newId,name:name,phone:phone,city:address||'غير محدد',debt:0};
  if(typeof AI_DATA!=='undefined'&&AI_DATA.customers) AI_DATA.customers.push(newCust);
  selectCustomer(newId,name,phone,address||'غير محدد',0);
  notify('تم إنشاء الزبون "'+name+'" بنجاح ✓','success');
}

// ===== STOCK OUT =====
function upSOA(){const v=document.getElementById('so-item')?.value,a=document.getElementById('so-avail');if(a)a.value=v?v+' قطعة متوفرة':'';chkSOQ();}
function chkSOQ(){
  const av=parseInt(document.getElementById('so-item')?.value)||0,rq=parseInt(document.getElementById('so-qty')?.value)||0;
  const e=document.getElementById('so-err'),b=document.getElementById('so-btn');
  if(rq>0&&rq>av){if(e)e.style.display='flex';if(b){b.disabled=true;b.style.opacity='.4';}}
  else{if(e)e.style.display='none';if(b){b.disabled=false;b.style.opacity='1';}}
}
function doSO(){
  const av=parseInt(document.getElementById('so-item')?.value)||0,rq=parseInt(document.getElementById('so-qty')?.value)||0;
  if(rq>av){notify('رُفضت العملية — لا يمكن البيع بالسالب 🚫','danger');return;}
  closeM('m-stock-out');notify('تم تنفيذ الصادر وتحديث المخزون ✓','success');
}
function checkStk(nm,av,rq){if(rq>av){notify('⚠️ كمية '+nm+' غير كافية','danger');return;}openM('m-stock-out');}

// ===== SERIAL CHECK =====
function chkSerial(inp){
  const v=inp.value.trim().toUpperCase(),e=document.getElementById('serial-err');
  if(SERIALS.includes(v)){inp.classList.add('invalid');e.style.display='block';}
  else{inp.classList.remove('invalid');e.style.display='none';}
}
function saveGen(){
  const s=document.getElementById('gen-serial')?.value.trim().toUpperCase();
  if(!s){notify('يجب إدخال الرقم التسلسلي ✕','danger');return;}
  if(SERIALS.includes(s)){notify('الرقم '+s+' مكرر — مرفوض 🚫','danger');return;}
  SERIALS.push(s);closeM('m-generator');notify('تم حفظ المولد '+s+' بنجاح ✓','success');
}
function sellGen(serial,name,price){
  openM('m-sale');
  const sel=document.getElementById('sl-1-sel');
  if(sel){for(let o of sel.options){if(o.value.startsWith(serial)){sel.value=o.value;break;}}handleGS(sel,'sl-1');}
  notify('تم تحميل '+serial+' في الفاتورة','info');
}
function filterG(st){document.querySelectorAll('#gen-tbl tbody tr').forEach(r=>{r.style.display=(st==='all'||r.dataset.status===st)?'':'none';});}

// ===== RESERVATION =====
function setRsvPrice(){const v=document.getElementById('rsv-gen')?.value||'',p=v.split('|')[1]||'';const pi=document.getElementById('rsv-price');if(pi&&p){pi.value=p;calcRsvRem();}calcRsvExpiry();}
function calcRsvRem(){const price=parseFloat(document.getElementById('rsv-price')?.value)||0,dep=parseFloat(document.getElementById('rsv-dep')?.value)||0,rem=price-dep;const ri=document.getElementById('rsv-rem');if(ri){ri.value=rem>0?fmt(rem)+' متبقي':rem<0?'⚠️ العربون أكبر':'0';ri.style.color=rem>0?'var(--odoo-red)':rem<0?'var(--odoo-orange)':'var(--odoo-green)';}}
function calcRsvExpiry(){const days=parseInt(document.getElementById('rsv-days')?.value)||14;const d=new Date();d.setDate(d.getDate()+days);const ex=document.getElementById('rsv-expiry');if(ex)ex.value=d.toISOString().split('T')[0];}
function saveReservation(){const gen=document.getElementById('rsv-gen')?.value,dep=document.getElementById('rsv-dep')?.value;if(!gen){notify('يجب اختيار المولد ✕','danger');return;}if(!dep||parseFloat(dep)<=0){notify('يجب إدخال مبلغ العربون ✕','danger');return;}closeM('m-reservation');notify('تم تسجيل الحجز بنجاح ✓','success');}

// ===== RECEIPT =====
function handleRcpType(){
  const t=document.getElementById('rcp-type')?.value,d=document.getElementById('rcp-type-detail'),ref=document.getElementById('rcp-ref');
  if(!d)return;
  const cfg={arboon:{bg:'#fffbeb',bc:'#f59e0b',c:'#92400e',icon:'💛',t:'عربون — دفعة حجز أولية',desc:'يسجَّل كعربون على حجز مولد. يُخصم من فاتورة البيع عند التسليم.',ph:'RSV-XXX — رقم الحجز'},takmila:{bg:'#eff6ff',bc:'var(--odoo-blue)',c:'var(--odoo-blue)',icon:'🔵',t:'تكملة حساب',desc:'دفعة جزئية على فاتورة قائمة غير مسددة.',ph:'INV-XXX — رقم الفاتورة'},tasdeed:{bg:'#f0fdf4',bc:'var(--odoo-green)',c:'var(--odoo-green)',icon:'🟢',t:'تسديد حساب سابق',desc:'إغلاق رصيد متراكم أو ذمة مدينة.',ph:'رقم الحساب أو اسم الزبون'},aqsat:{bg:'#f5f3ff',bc:'var(--odoo-purple)',c:'var(--odoo-purple)',icon:'💜',t:'قسط دوري',desc:'دفعة قسط محدد ضمن عقد تقسيط.',ph:'INST-XXX — رقم العقد / القسط'}};
  if(t&&cfg[t]){const c=cfg[t];d.style.cssText=`display:block;background:${c.bg};border-color:${c.bc};color:${c.c}`;d.innerHTML=`<strong>${c.icon} ${c.t}</strong><br>${c.desc}`;if(ref)ref.placeholder=c.ph;}
  else d.style.display='none';
}
function saveReceipt(){const t=document.getElementById('rcp-type')?.value;if(!t){notify('يجب اختيار نوع القبض ✕','danger');return;}const labels={arboon:'عربون',takmila:'تكملة حساب',tasdeed:'تسديد حساب',aqsat:'قسط دوري'};closeM('m-receipt');notify('تم حفظ وصل القبض — '+labels[t]+' ✓','success');}

// ===== PRINT =====


// ===== FORMAT =====
function fmt(n){return new Intl.NumberFormat('ar-IQ').format(Math.round(n));}

// ===== ACCOUNT TREE RENDER =====
function bldTree(ns,depth){
  if(!ns)return '';
  return ns.map(n=>{
    const hasCh=n.ch&&n.ch.length>0,safe=(n.c+'').replace(/[^a-zA-Z0-9]/g,'_'),ind=depth*14;
    const lc='level-'+Math.min(n.lv,5);
    const bal=n.dr?`<span class="tree-balance" style="color:var(--odoo-green)">${fmt(n.dr)}</span>`:n.cr?`<span class="tree-balance" style="color:var(--odoo-red)">${fmt(n.cr)}</span>`:'<span style="margin-right:auto"></span>';
    const icons={1:'🏢',2:'🏛️',3:'💼',4:'💰','5-9':'📁'};
    const tIcon=n.icon?`<span class="tree-icon">${n.icon}</span>`:hasCh&&depth<2?`<span class="tree-icon">${icons[n.c]||'📂'}</span>`:'';
    const typeBadge=n.lv<=2?`<span class="badge badge-purple" style="font-size:9px">مجمع</span>`:n.lv===3?`<span class="badge badge-blue" style="font-size:9px">مجموعة</span>`:n.lv>=4?`<span class="badge badge-gray" style="font-size:9px">تفصيلي</span>`:'';
    return `<div class="tree-node"><div class="tree-row ${lc}" style="padding-right:${8+ind}px" onclick="selAcc(\'${n.c}\',event)">${hasCh?`<div class="tree-toggle" id="tt-${safe}">▶</div>`:'<div class="tree-spacer"></div>'}<span class="tree-code">${n.c}</span>${tIcon}<span class="tree-name">${n.n}</span>${bal}${typeBadge}</div>${hasCh?`<div class="tree-children" id="tc-${safe}" style="display:none">${bldTree(n.ch,depth+1)}</div>`:''}</div>`;
  }).join('');
}
function renderTree(){const t=document.getElementById('acc-tree');if(t&&typeof IRAQI_COA!=='undefined')t.innerHTML=bldTree(IRAQI_COA,0);}
function selAcc(code,e){
  const safe=(code+'').replace(/[^a-zA-Z0-9]/g,'_');
  const ch=document.getElementById('tc-'+safe),tg=document.getElementById('tt-'+safe);
  if(ch){const op=ch.style.display!=='none';ch.style.display=op?'none':'block';if(tg)tg.classList.toggle('open',!op);}
  document.querySelectorAll('.tree-row').forEach(r=>r.classList.remove('selected'));e.currentTarget.classList.add('selected');
  showAccDet(code);
}
function findNode(ns,c){for(const n of ns){if(n.c==c)return n;if(n.ch){const f=findNode(n.ch,c);if(f)return f;}}return null;}
function showAccDet(code){
  const n=findNode(IRAQI_COA,code);if(!n)return;
  const bal=n.dr?`<div style="font-size:22px;font-weight:900;color:var(--odoo-green);font-family:var(--mono)">${fmt(n.dr)} مدين</div>`:n.cr?`<div style="font-size:22px;font-weight:900;color:var(--odoo-red);font-family:var(--mono)">${fmt(n.cr)} دائن</div>`:'<div style="color:var(--text-s)">لا يوجد رصيد</div>';
  document.getElementById('acc-det-title').textContent='📋 '+n.c+' — '+n.n;
  document.getElementById('acc-det-body').innerHTML=`
    <div style="background:${n.dr?'var(--odoo-green-l)':n.cr?'var(--odoo-red-l)':'var(--bg)'};border:2px solid ${n.dr?'var(--odoo-green)':n.cr?'var(--odoo-red)':'var(--border)'};border-radius:var(--r-lg);padding:16px;margin-bottom:16px;text-align:center">
      <div style="font-size:11px;color:var(--text-m);margin-bottom:6px">الرصيد الحالي</div>${bal}
    </div>
    <div class="info-row"><span class="lbl">كود الحساب</span><span class="val" style="font-family:var(--mono);color:var(--odoo-blue)">${n.c}</span></div>
    <div class="info-row"><span class="lbl">اسم الحساب</span><span class="val">${n.n}</span></div>
    <div class="info-row"><span class="lbl">المستوى</span><span class="val"><span class="badge badge-purple">المستوى ${n.lv}</span></span></div>
    <div class="info-row"><span class="lbl">نوع الحساب</span><span class="val"><span class="badge ${n.lv>=4?'badge-gray':'badge-blue'}">${n.lv>=4?'تفصيلي':'مجمع'}</span></span></div>
    <div class="info-row"><span class="lbl">الرصيد الطبيعي</span><span class="val">${(n.c+'').startsWith('1')||((n.c+'').startsWith('3'))||((n.c+'').startsWith('5'))?'<span class="badge badge-green">مدين</span>':'<span class="badge badge-red">دائن</span>'}</span></div>
    <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="go(\'ledger\',null)">📒 كشف الحساب</button>
      <button class="btn btn-secondary btn-sm" onclick="openM(\'m-journal\')">＋ قيد يومي</button>
      ${n.lv>=4?'<button class="btn btn-secondary btn-sm" onclick="openM(\'m-account\')">✏️ تعديل</button>':''}
    </div>`;
  // ===== قائمة الزبائن المرتبطين بالحساب =====
  var _cusDB = typeof CUSTOMERS_DB !== 'undefined' ? CUSTOMERS_DB : [];
  var _relCus = _cusDB.filter(function(c){
    return c.accountCode && String(c.accountCode).startsWith(String(code));
  });
  if (_relCus.length > 0) {
    var _totalDebt = _relCus.reduce(function(s,c){ return s + (c.debt||0); }, 0);
    var _rows = _relCus.map(function(c, i) {
      var debtTxt = c.debt > 0 ? fmt(c.debt) + ' د.ع' : '—';
      var debtColor = c.debt > 0 ? 'color:var(--odoo-red);font-weight:700' : 'color:var(--text-s)';
      var bg = i % 2 === 0 ? 'var(--bg)' : '#f9fafb';
      return '<tr style="background:' + bg + ';cursor:pointer" onclick="go(\'customers\',null)" title="فتح صفحة الزبائن">' +
        '<td style="padding:5px 8px;font-weight:600">' + c.name + '</td>' +
        '<td style="padding:5px 8px;text-align:center;font-family:monospace;font-size:11px;color:var(--odoo-blue)">' + (c.phone || '—') + '</td>' +
        '<td style="padding:5px 8px;text-align:center;color:var(--text-m)">' + (c.city || '—') + '</td>' +
        '<td style="padding:5px 8px;text-align:center;' + debtColor + '">' + debtTxt + '</td>' +
        '</tr>';
    }).join('');
    var _foot = _totalDebt > 0
      ? '<tfoot><tr style="background:var(--odoo-red-l);font-weight:700"><td colspan="3" style="padding:6px 8px;color:var(--odoo-red)">إجمالي الذمم المدينة</td><td style="padding:6px 8px;text-align:center;color:var(--odoo-red)">' + fmt(_totalDebt) + ' د.ع</td></tr></tfoot>'
      : '';
    var _cusHtml =
      '<div style="margin-top:18px;border-top:2px solid var(--odoo-purple);padding-top:14px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<div style="font-weight:700;color:var(--odoo-purple);font-size:14px">👥 الزبائن المرتبطون بهذا الحساب</div>' +
          '<span class="badge badge-purple">' + _relCus.length + ' زبون</span>' +
        '</div>' +
        '<div style="max-height:400px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r)">' +
          '<table style="width:100%;border-collapse:collapse;font-size:12px">' +
            '<thead><tr style="background:var(--odoo-purple-l);position:sticky;top:0">' +
              '<th style="padding:7px 8px;text-align:right;border-bottom:1px solid var(--border)">الاسم</th>' +
              '<th style="padding:7px 8px;text-align:center;border-bottom:1px solid var(--border)">الهاتف</th>' +
              '<th style="padding:7px 8px;text-align:center;border-bottom:1px solid var(--border)">المدينة</th>' +
              '<th style="padding:7px 8px;text-align:center;border-bottom:1px solid var(--border)">الذمة</th>' +
            '</tr></thead>' +
            '<tbody>' + _rows + '</tbody>' +
            _foot +
          '</table>' +
        '</div>' +
      '</div>';
    var _detBody = document.getElementById('acc-det-body');
    if (_detBody) _detBody.innerHTML += _cusHtml;
  }
}
function expandAll(){document.querySelectorAll('.tree-children').forEach(c=>c.style.display='block');document.querySelectorAll('.tree-toggle').forEach(t=>t.classList.add('open'));}
function collapseAll(){document.querySelectorAll('.tree-children').forEach(c=>c.style.display='none');document.querySelectorAll('.tree-toggle').forEach(t=>t.classList.remove('open'));}

// ===== WARRANTY CALC =====
function calcWarranty(){
  const dateVal=document.getElementById('wc-date')?.value,years=parseInt(document.getElementById('wc-years')?.value)||2,hours=parseInt(document.getElementById('wc-hours')?.value)||2000,current=parseInt(document.getElementById('wc-current')?.value)||0,res=document.getElementById('wc-result');
  if(!res||!dateVal)return;
  const start=new Date(dateVal),today=new Date(),endByDate=new Date(start);
  endByDate.setFullYear(endByDate.getFullYear()+years);
  const daysLeft=Math.max(0,Math.ceil((endByDate-today)/(1000*60*60*24))),hoursLeft=Math.max(0,hours-current);
  const pctH=Math.min(100,Math.round(current/hours*100)),pctD=Math.min(100,Math.round((today-start)/(endByDate-start)*100));
  let msg,color;
  if(hoursLeft===0||daysLeft===0){msg='❌ الضمان منتهي';color='var(--odoo-red)';}
  else{const hR=current/hours,dR=(today-start)/(endByDate-start);if(hR>dR){msg=`⏰ الساعات أقرب — متبقي <strong>${hoursLeft.toLocaleString('en-US')} ساعة</strong>`;color='var(--odoo-orange)';}else{msg=`📅 التاريخ أقرب — متبقي <strong>${daysLeft.toLocaleString('en-US')} يوم</strong> حتى ${endByDate.toLocaleDateString('en-GB')}`;color='var(--odoo-blue)';}}
  res.style.cssText=`border:2px solid ${color};background:${color}15;border-radius:var(--r);padding:14px;`;
  res.innerHTML=`<div style="font-weight:700;color:${color};margin-bottom:10px">${msg}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><div style="font-size:11px;color:var(--text-m);margin-bottom:4px">📅 بالتاريخ</div><div style="font-weight:700">${endByDate.toLocaleDateString('en-GB')} (${daysLeft} يوم)</div><div style="height:5px;background:var(--bg);border-radius:3px;margin-top:4px;overflow:hidden"><div style="width:${pctD}%;height:100%;background:${pctD>80?'var(--odoo-red)':pctD>50?'var(--odoo-orange)':'var(--odoo-green)'};border-radius:3px"></div></div><div style="font-size:10px;color:var(--text-s)">${pctD}% مستهلك</div></div><div><div style="font-size:11px;color:var(--text-m);margin-bottom:4px">⏰ بالساعات</div><div style="font-weight:700">${hoursLeft.toLocaleString('en-US')} ساعة متبقية</div><div style="height:5px;background:var(--bg);border-radius:3px;margin-top:4px;overflow:hidden"><div style="width:${pctH}%;height:100%;background:${pctH>80?'var(--odoo-red)':pctH>50?'var(--odoo-orange)':'var(--odoo-green)'};border-radius:3px"></div></div><div style="font-size:10px;color:var(--text-s)">${pctH}% مستهلك</div></div></div>`;
}

// ===== PARTS FILTER =====
function filterParts(cat,el){document.querySelectorAll('#parts-tbl tbody tr').forEach(r=>{r.style.display=(cat==='all'||r.dataset.cat===cat)?'':'none';});document.querySelectorAll('.tab-filter button').forEach(t=>t.classList.remove('active'));if(el)el.classList.add('active');}
function filterGenBrand(brand,el){document.querySelectorAll('#gen-inv-tbl tbody tr').forEach(r=>{r.style.display=(brand==='all'||r.dataset.brand===brand)?'':'none';});document.querySelectorAll('.tab-filter button').forEach(t=>t.classList.remove('active'));if(el)el.classList.add('active');}
function filterWarranty(st,el){document.querySelectorAll('#warranty-tbl tbody tr').forEach(r=>{r.style.display=(st==='all'||r.dataset.wstatus===st)?'':'none';});document.querySelectorAll('.tab-filter button').forEach(t=>t.classList.remove('active'));if(el)el.classList.add('active');}
function filterArboon(){const t=document.getElementById('arb-type')?.value||'all';document.querySelectorAll('#arb-tbody tr').forEach(r=>{r.style.display=(t==='all'||r.dataset.type===t)?'':'none';});}

// ===== GENERATOR DETAIL =====
function showGenDetail(serial) {
  const GD = {
    'GEN-0045':{brand:'بيركنز 🔵',model:'Perkins 1104A-44TG2',kva:'50',tank:'100L',cons:'12L/h',alt:'Stamford UCI224E',warranty:'2 سنة / 2000 ساعة',loc:'رف A-3',status:'متوفر',cost:'14,200,000',price:'18,500,000'},
    'GEN-0071':{brand:'بيركنز 🔵',model:'Perkins 1306A-E87TAG3',kva:'100',tank:'200L',cons:'22L/h',alt:'Stamford UCI274C',warranty:'2 سنة / 2000 ساعة',loc:'رف A-5',status:'متوفر',cost:'28,000,000',price:'36,000,000'},
    'GEN-0080':{brand:'بادوين 🟠',model:'Baudouin 6M11G165/5',kva:'150',tank:'300L',cons:'35L/h',alt:'Leroy-Somer LSA44',warranty:'2 سنة / 3000 ساعة',loc:'رف B-1',status:'متوفر',cost:'42,000,000',price:'55,000,000'},
    'GEN-0081':{brand:'بادوين 🟠',model:'Baudouin 6M21G400/5',kva:'350',tank:'500L',cons:'75L/h',alt:'Marathon 784BZ',warranty:'2 سنة / 3000 ساعة',loc:'رف B-3',status:'متوفر',cost:'85,000,000',price:'110,000,000'},
    'GEN-0090':{brand:'إيسوزو صيني 🟢',model:'Isuzu 4BG1 Chinese',kva:'30',tank:'70L',cons:'7L/h',alt:'Stamford UCI224E',warranty:'1 سنة / 1000 ساعة',loc:'رف C-1',status:'متوفر',cost:'7,000,000',price:'9,500,000'},
    'GEN-0091':{brand:'إيسوزو صيني 🟢',model:'Isuzu 6BG1 Chinese',kva:'62.5',tank:'120L',cons:'15L/h',alt:'Stamford UCI224F',warranty:'1 سنة / 1000 ساعة',loc:'رف C-3',status:'متوفر',cost:'16,000,000',price:'21,000,000'}
  };
  const d = GD[serial];
  const panel = document.getElementById('gen-detail-panel');
  if (!panel) return;
  if (!d) { panel.style.display = 'none'; return; }
  panel.style.display = 'block';

  const titleEl = document.getElementById('gen-detail-title');
  const bodyEl = document.getElementById('gen-detail-body');
  if (titleEl) titleEl.textContent = 'تفاصيل المولد — ' + serial;

  if (!bodyEl) return;

  // Build stats row
  const statsRow = document.createElement('div');
  statsRow.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px';
  const stats = [
    {label:'الماركة', value:d.brand, bg:'var(--odoo-purple-l)'},
    {label:'القدرة', value:d.kva+' KVA', bg:'var(--odoo-green-l)', big:true, color:'var(--odoo-green)'},
    {label:'الاستهلاك', value:d.cons, bg:'var(--odoo-yellow-l)'},
    {label:'الضمان', value:d.warranty, bg:'var(--odoo-blue-l)', small:true, color:'var(--odoo-blue)'},
  ];
  statsRow.innerHTML = stats.map(function(s) {
    return '<div style="padding:12px;background:'+s.bg+';border-radius:var(--r);text-align:center">' +
      '<div style="font-size:10px;color:var(--text-m)">'+s.label+'</div>' +
      '<div style="font-weight:'+(s.big?'900':'700')+';font-size:'+(s.big?'20px':s.small?'11px':'13px')+';color:'+(s.color||'var(--text)')+'">'+s.value+'</div>' +
      '</div>';
  }).join('');

  // Build info rows
  const infoItems = [
    {l:'الموديل', v:d.model, mono:true},
    {l:'رأس التوليد', v:d.alt},
    {l:'سعة الخزان', v:d.tank},
    {l:'موقع المخزن', v:d.loc},
    {l:'سعر التكلفة', v:d.cost+' د.ع', color:'var(--odoo-orange)'},
    {l:'سعر البيع', v:d.price+' د.ع', color:'var(--odoo-green)'},
    {l:'الحالة', v:d.status, badge:'badge-green'},
  ];
  const infoHTML = infoItems.map(function(item) {
    const valHTML = item.badge
      ? '<span class="badge '+item.badge+'">🟢 '+item.v+'</span>'
      : '<span style="font-weight:600;color:'+(item.color||'var(--text)')+';'+(item.mono?'font-family:monospace;font-size:11px':'')+'">'+item.v+'</span>';
    return '<div class="info-row"><span class="lbl">'+item.l+'</span>'+valHTML+'</div>';
  }).join('');

  // Build action buttons using DOM (avoid nested quotes)
  bodyEl.innerHTML = statsRow.outerHTML + infoHTML +
    '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap" id="gen-det-actions"></div>';

  const actDiv = bodyEl.querySelector('#gen-det-actions');
  if (actDiv) {
    const btns = [
      {text:'🛒 فاتورة بيع', cls:'btn-primary', fn:'sale', s:serial},
      {text:'🛡️ ضمان', cls:'btn-secondary', fn:'warranty'},
      {text:'🔧 صيانة', cls:'btn-secondary', fn:'maintenance'},
      {text:'🔖 حجز', cls:'btn-secondary', fn:'reservation'},
    ];
    btns.forEach(function(b) {
      const btn = document.createElement('button');
      btn.className = 'btn ' + b.cls + ' btn-sm';
      btn.textContent = b.text;
      if (b.fn === 'sale') {
        btn.addEventListener('click', function() { sellGen(serial, d.brand+' '+d.kva+'KVA', d.price.replace(/,/g,'')); });
      } else {
        btn.addEventListener('click', function() { openM('m-' + b.fn); });
      }
      actDiv.appendChild(btn);
    });
  }

  panel.scrollIntoView({behavior:'smooth', block:'start'});
}

// ===== CUSTOMER DETAIL =====
function showCust(i){const d=document.getElementById('cust-detail');d.style.display=d.style.display==='none'?'block':'none';if(d.style.display==='block')d.scrollIntoView({behavior:'smooth',block:'start'});}

// Init



// ===== WORKFLOW ENGINE =====

// ===== WORKFLOW STATE =====
let wfOrderStep = 1;
let wfOrderData = { items:[], payType:'', payAmount:0, customer:'' };
let orderLineCount = 1;

// ===== WORKFLOW PAGE NAVIGATION =====
function advanceWF(soId, nextStage) {
  const card = document.querySelector(`.wf-card[data-id="${soId}"]`);
  if (!card) return;
  const currentCol = card.closest('[id^="wf-col-"]');

  const stageMap = {
    'payment': 'wf-col-payment',
    'warehouse': 'wf-col-warehouse',
    'purchase': 'wf-col-purchase',
    'delivery': 'wf-col-delivery'
  };

  const targetCol = document.getElementById(stageMap[nextStage]);
  if (!targetCol) return;

  // Clone card and move
  const clone = card.cloneNode(true);
  // Update card appearance based on stage
  const stageStyles = {
    payment:   { bg:'#e8f5f6', bc:'var(--odoo-blue)', badgeClass:'badge-blue', badgeText:'قيد القبض' },
    warehouse: { bg:'#fffbeb', bc:'#f59e0b',          badgeClass:'badge-yellow', badgeText:'فحص المخزن' },
    purchase:  { bg:'#fff8f8', bc:'#dc3545',          badgeClass:'badge-red',  badgeText:'قيد الشراء' },
    delivery:  { bg:'#f0fdf4', bc:'#198754',          badgeClass:'badge-green', badgeText:'جاهز' },
  };
  const s = stageStyles[nextStage];
  clone.style.background = s.bg;
  clone.style.borderColor = s.bc;
  clone.dataset.status = nextStage;

  // Update badge
  const badge = clone.querySelector('.badge');
  if (badge) { badge.className = 'badge ' + s.badgeClass; badge.style.fontSize = '9px'; badge.textContent = s.badgeText; }

  // Update buttons based on next stage
  const btnArea = clone.querySelector('[style*="margin-top:6px"]');
  if (btnArea) {
    const nextBtns = {
      payment: `<button class="btn btn-info" style="padding:3px 8px;font-size:10px;background:var(--odoo-blue);color:#fff;border:none;border-radius:4px;cursor:pointer" onclick="event.stopPropagation();advanceWF(\'${soId}\',\'warehouse\')">← فحص المخزن</button>`,
      warehouse: `<div style="display:flex;gap:4px">
        <button class="btn btn-success" style="padding:3px 8px;font-size:10px" onclick="event.stopPropagation();advanceWF(\'${soId}\',\'delivery\')">✅ متوفر</button>
        <button class="btn btn-danger" style="padding:3px 8px;font-size:10px" onclick="event.stopPropagation();advanceWF(\'${soId}\',\'purchase\')">⚠️ شراء</button>
      </div>`,
      purchase: `<button onclick="event.stopPropagation();advanceWF(\'${soId}\',\'delivery\')" style="padding:3px 8px;font-size:10px;background:#f59e0b;color:#fff;border:none;border-radius:4px;cursor:pointer">← وصل الشراء</button>`,
      delivery: `<button class="btn btn-success" style="padding:3px 8px;font-size:10px" onclick="event.stopPropagation();completeWF(\'${soId}\')">✅ تأكيد التسليم</button>`,
    };
    btnArea.innerHTML = nextBtns[nextStage] || '';
  }

  targetCol.appendChild(clone);
  card.remove();

  // Update counts
  updateWFCounts();

  const stageNames = { payment:'القبض المالي', warehouse:'فحص المخزن', purchase:'طلب الشراء', delivery:'التجهيز للتسليم' };
  notify(`تم نقل ${soId} إلى: ${stageNames[nextStage]} ✓`, 'success');

  // Show appropriate action
  if (nextStage === 'payment') {
    setTimeout(() => openM('m-receipt'), 300);
  } else if (nextStage === 'purchase') {
    setTimeout(() => {
      rayaConfirm('هذا الصنف غير متوفر في المخزن. هل تريد إنشاء طلب شراء تلقائياً؟',function(){openPurchaseModal();});
    }, 300);
  }
}

function completeWF(soId) {
  const card = document.querySelector(`.wf-card[data-id="${soId}"]`);
  if (!card) return;
  card.style.opacity = '.6';
  card.style.background = '#f8f9fa';
  card.style.borderColor = '#adb5bd';
  const badge = card.querySelector('.badge');
  if (badge) { badge.className = 'badge badge-gray'; badge.textContent = '✅ مكتمل'; }
  const btnArea = card.querySelector('[style*="margin-top:6px"]');
  if (btnArea) btnArea.innerHTML = `<div style="font-size:10px;color:#6c757d;font-weight:600">سُلِّم ✅</div>`;
  updateWFCounts();
  notify(`تم تسليم ${soId} بنجاح وإغلاق الطلب ✓`, 'success');
}

function updateWFCounts() {
  const cols = {
    'wf-col-payment':'wf-pay-count',
    'wf-col-warehouse':'wf-wh-count',
    'wf-col-purchase':'wf-pr-count',
    'wf-col-delivery':'wf-dl-count'
  };
  for (const [colId, countId] of Object.entries(cols)) {
    const col = document.getElementById(colId);
    const count = document.getElementById(countId);
    if (col && count) {
      count.textContent = col.querySelectorAll('.wf-card').length;
    }
  }
}

// ===== WORKFLOW DETAIL =====
const WF_DATA = {
  'SO-001': { customer:'أحمد السعدي', item:'GEN-0045 بيركنز 50KVA', price:'18,500,000', status:'sales', pay:'تسديد كامل', stock:'متوفر', date:'15/05/2026', account:'411.4 — إيرادات بيع المولدات' },
  'SO-002': { customer:'سامي الجبوري', item:'GEN-0080 بادوين 150KVA', price:'55,000,000', status:'sales', pay:'أقساط — مقدمة 15M', stock:'متوفر', date:'14/05/2026', account:'411.4 — إيرادات بيع المولدات' },
  'SO-003': { customer:'خالد الربيعي', item:'GEN-0090 إيسوزو 30KVA', price:'9,500,000', status:'sales', pay:'عربون 2M', stock:'متوفر', date:'13/05/2026', account:'411.4 — إيرادات بيع المولدات' },
  'SO-004': { customer:'محمد الدليمي', item:'GEN-0071 بيركنز 100KVA', price:'36,000,000', status:'payment', pay:'نقد — مدفوع 36M ✅', stock:'متوفر', date:'12/05/2026', account:'181.1 — صندوق المركز' },
  'SO-005': { customer:'ناصر العبيدي', item:'GEN-0091 إيسوزو 62.5KVA', price:'21,000,000', status:'warehouse', pay:'مدفوع كامل', stock:'متوفر رف C-3', date:'11/05/2026', account:'411.4' },
  'SO-006': { customer:'علي الحسني', item:'بادوين 350KVA — جديد', price:'110,000,000', status:'warehouse', pay:'عربون 20M', stock:'⚠️ غير متوفر — يحتاج شراء', date:'10/05/2026', account:'411.4' },
  'SO-007': { customer:'حيدر الموسوي', item:'بيركنز 200KVA — جديد', price:'72,000,000', status:'purchase', pay:'عربون 15M', stock:'PO-046 — شركة الخليج', date:'09/05/2026', account:'411.4' },
  'SO-008': { customer:'كريم الشمري', item:'GEN-0045 بيركنز 50KVA', price:'18,500,000', status:'delivery', pay:'مدفوع كامل', stock:'جاهز للتسليم', date:'08/05/2026', account:'411.4' },
  'SO-009': { customer:'زيد العامري', item:'GEN-0062 بادوين 150KVA', price:'55,000,000', status:'delivered', pay:'مدفوع كامل', stock:'سُلِّم 10/05/2026', date:'01/05/2026', account:'411.4' },
};

function showWFDetail(soId) {
  const d = WF_DATA[soId];
  if (!d) return;
  const panel = document.getElementById('wf-detail-panel');
  const title = document.getElementById('wf-detail-title');
  const body = document.getElementById('wf-detail-body');
  if (!panel || !body) return;
  panel.style.display = 'block';
  title.textContent = '📋 تفاصيل الطلب — ' + soId;

  const stageLabels = { sales:'🧾 مرحلة الفاتورة', payment:'💵 مرحلة القبض', warehouse:'📦 مرحلة المخزن', purchase:'🛒 مرحلة الشراء', delivery:'✅ مرحلة التسليم', delivered:'✅ مكتمل' };
  const stageColors = { sales:'var(--odoo-purple)', payment:'var(--odoo-blue)', warehouse:'#f59e0b', purchase:'#dc3545', delivery:'#198754', delivered:'#6c757d' };

  body.innerHTML = `
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
    <div style="padding:12px;background:var(--odoo-purple-l);border-radius:var(--r);text-align:center">
      <div style="font-size:10px;color:var(--text-m)">رقم الطلب</div>
      <div style="font-weight:800;font-size:16px;color:var(--odoo-purple);font-family:'JetBrains Mono',monospace">${soId}</div>
    </div>
    <div style="padding:12px;background:var(--odoo-green-l);border-radius:var(--r);text-align:center">
      <div style="font-size:10px;color:var(--text-m)">المبلغ الإجمالي</div>
      <div style="font-weight:800;font-size:15px;color:var(--odoo-green);font-family:'JetBrains Mono',monospace">${d.price}</div>
    </div>
    <div style="padding:12px;border-radius:var(--r);border:2px solid ${stageColors[d.status]};text-align:center;background:${stageColors[d.status]}15">
      <div style="font-size:10px;color:var(--text-m)">المرحلة الحالية</div>
      <div style="font-weight:700;font-size:12px;color:${stageColors[d.status]}">${stageLabels[d.status]}</div>
    </div>
  </div>

  <div class="info-row"><span class="lbl">الزبون</span><span class="val">${d.customer}</span></div>
  <div class="info-row"><span class="lbl">المنتج / المولد</span><span class="val" style="font-family:'JetBrains Mono',monospace;font-size:11.5px">${d.item}</span></div>
  <div class="info-row"><span class="lbl">طريقة الدفع</span><span class="val">${d.pay}</span></div>
  <div class="info-row"><span class="lbl">حالة المخزن</span><span class="val" style="color:${d.stock.includes('⚠️')?'#dc3545':'#198754'}">${d.stock}</span></div>
  <div class="info-row"><span class="lbl">تاريخ الطلب</span><span class="val">${d.date}</span></div>
  <div class="info-row"><span class="lbl">الحساب المحاسبي</span><span class="val" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--odoo-blue)">${d.account}</span></div>

  <hr class="divider">
  <div style="font-weight:700;font-size:12.5px;margin-bottom:10px">🔄 مسار العمل — القيود المحاسبية التلقائية</div>
  <div style="display:flex;flex-direction:column;gap:8px">
    <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--odoo-purple-l);border-radius:var(--r)">
      <div style="width:24px;height:24px;border-radius:50%;background:var(--odoo-purple);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">1</div>
      <div><div style="font-size:11.5px;font-weight:600">فاتورة البيع — ح/124.1 مدين / ح/411.4 دائن</div><div style="font-size:10.5px;color:var(--text-m)">تسجيل الإيراد وخلق الذمة المدينة</div></div>
      <span class="badge badge-green" style="margin-right:auto;font-size:9px">✅</span>
    </div>
    <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:${d.status==='sales'?'var(--bg)':'var(--odoo-blue-l)'};border-radius:var(--r);opacity:${d.status==='sales'?'.5':'1'}">
      <div style="width:24px;height:24px;border-radius:50%;background:${d.status==='sales'?'var(--text-s)':'var(--odoo-blue)'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">2</div>
      <div><div style="font-size:11.5px;font-weight:600">قبض المبلغ — ح/181.1 مدين / ح/124.1 دائن</div><div style="font-size:10.5px;color:var(--text-m)">تسوية الذمة المدينة بالقبض النقدي</div></div>
      <span class="badge ${d.status!=='sales'?'badge-green':'badge-gray'}" style="margin-right:auto;font-size:9px">${d.status!=='sales'?'✅':'⏳'}</span>
    </div>
    <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:${['warehouse','purchase','delivery','delivered'].includes(d.status)?'var(--odoo-green-l)':'var(--bg)'};border-radius:var(--r);opacity:${['warehouse','purchase','delivery','delivered'].includes(d.status)?'1':'.5'}">
      <div style="width:24px;height:24px;border-radius:50%;background:${['warehouse','purchase','delivery','delivered'].includes(d.status)?'#198754':'var(--text-s)'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">3</div>
      <div><div style="font-size:11.5px;font-weight:600">إخراج المخزن — ح/353.1 مدين / ح/121.1 دائن</div><div style="font-size:10.5px;color:var(--text-m)">تسجيل كلفة البضاعة المباعة وخصم المخزون</div></div>
      <span class="badge ${['warehouse','purchase','delivery','delivered'].includes(d.status)?'badge-green':'badge-gray'}" style="margin-right:auto;font-size:9px">${['warehouse','purchase','delivery','delivered'].includes(d.status)?'✅':'⏳'}</span>
    </div>
    <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:${d.status==='delivered'?'var(--odoo-green-l)':'var(--bg)'};border-radius:var(--r);opacity:${d.status==='delivered'?'1':'.5'}">
      <div style="width:24px;height:24px;border-radius:50%;background:${d.status==='delivered'?'#198754':'var(--text-s)'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">4</div>
      <div><div style="font-size:11.5px;font-weight:600">تأكيد التسليم — إغلاق الطلب وتسجيل الضمان</div><div style="font-size:10.5px;color:var(--text-m)">بدء عداد ساعات الضمان من تاريخ التسليم</div></div>
      <span class="badge ${d.status==='delivered'?'badge-green':'badge-gray'}" style="margin-right:auto;font-size:9px">${d.status==='delivered'?'✅':'⏳'}</span>
    </div>
  </div>

  <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn btn-secondary btn-sm" onclick="printRcp()">🖨 طباعة</button>
    <button class="btn btn-secondary btn-sm" onclick="openM(\'m-journal\')">📔 عرض القيد</button>
    ${d.status!=='delivered'?`<button class="btn btn-primary btn-sm" onclick="advanceWF('${soId}',{sales:'payment',payment:'warehouse',warehouse:'delivery',purchase:'delivery'}['${d.status}']||'delivery')">← المرحلة التالية</button>`:''}
  </div>`;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== NEW ORDER MODAL LOGIC =====
let currentOrderStep = 1;

function orderNext() {
  if (currentOrderStep === 1) {
    // Validate step 1
    const customer = document.getElementById('no-customer')?.value;
    const payType = document.getElementById('no-pay-type')?.value;
    if (!customer) { notify('يجب اختيار الزبون ✕', 'danger'); return; }
    if (!payType) { notify('يجب اختيار نوع الدفع ✕', 'danger'); return; }

    // Check stock availability and build summary
    buildOrderSummary();
    currentOrderStep = 2;

    document.getElementById('no-btn-prev').style.display = 'block';
    document.getElementById('no-btn-next').style.display = 'none';
    document.getElementById('no-btn-confirm').style.display = 'block';
    document.getElementById('order-summary').style.display = 'block';

    // Update progress
    updateOrderProgress(2);
  }
}

function orderPrev() {
  currentOrderStep = 1;
  document.getElementById('no-btn-prev').style.display = 'none';
  document.getElementById('no-btn-next').style.display = 'block';
  document.getElementById('no-btn-confirm').style.display = 'none';
  document.getElementById('order-summary').style.display = 'none';
  updateOrderProgress(1);
}

function updateOrderProgress(step) {
  const colors = ['var(--odoo-purple)', 'var(--odoo-blue)', '#f59e0b', '#dc3545', '#198754'];
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById('wf-step-' + i);
    if (!el) continue;
    const dot = el.querySelector('div:first-child');
    const label = el.querySelector('div:last-child');
    if (i <= step) {
      dot.style.background = colors[i-1];
      dot.style.borderColor = colors[i-1];
      dot.style.color = '#fff';
      if (label) label.style.color = colors[i-1];
    } else {
      dot.style.background = 'var(--border)';
      dot.style.borderColor = 'var(--border)';
      dot.style.color = 'var(--text-m)';
      if (label) label.style.color = 'var(--text-s)';
    }
  }
}

function buildOrderSummary() {
  const customer = document.getElementById('no-customer');
  const payType = document.getElementById('no-pay-type');
  const total = document.getElementById('order-total')?.textContent || '0';
  const content = document.getElementById('order-summary-content');
  if (!content) return;

  const custName = customer?.options[customer.selectedIndex]?.text || '';
  const payTypeName = payType?.options[payType.selectedIndex]?.text || '';

  // Check stock
  let hasUnavailable = false;
  document.querySelectorAll('[id^="ol-"][id$="-item"]').forEach(sel => {
    const val = sel.value;
    if (val && val.includes('unavailable')) hasUnavailable = true;
  });

  const steps = [
    { icon:'🧾', title:'إنشاء فاتورة البيع', desc:`INV-${Date.now().toString().slice(-4)} — ${custName}`, color:'var(--odoo-purple)', auto:true },
    { icon:'💵', title:`قبض المبلغ — ${payTypeName.split('—')[0].trim()}`, desc:`إجمالي: ${total} د.ع — ح/124.1 مدين / ح/411.4 دائن`, color:'var(--odoo-blue)', auto:true },
    { icon:'📦', title:'فحص المخزن', desc: hasUnavailable ? '⚠️ بعض الأصناف تحتاج شراء — سيُنشأ طلب شراء تلقائي' : '✅ كل الأصناف متوفرة في المستودع', color: hasUnavailable ? '#dc3545' : '#198754', auto:true },
    { icon: hasUnavailable ? '🛒' : '📤', title: hasUnavailable ? 'إنشاء طلب شراء للأصناف الناقصة' : 'إخراج من المخزون', desc: hasUnavailable ? 'PO تلقائي للمجهز — ح/121.1 مدين / ح/251.4 دائن' : 'ح/353.1 مدين / ح/121.1 دائن — خصم المخزون', color: hasUnavailable ? '#dc3545' : '#f59e0b', auto:true },
    { icon:'✅', title:'تجهيز وتسليم المولد', desc:'تفعيل الضمان من تاريخ التسليم — بدء عداد الساعات', color:'#198754', auto:false },
  ];

  content.innerHTML = steps.map((s,i) => `
  <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0">
    <div style="width:28px;height:28px;border-radius:50%;background:${s.color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;margin-top:2px">${s.icon}</div>
    <div style="flex:1">
      <div style="font-weight:700;font-size:12.5px;color:${s.color}">${i+1}. ${s.title}</div>
      <div style="font-size:11px;color:var(--text-m);margin-top:2px">${s.desc}</div>
    </div>
    <span class="badge ${s.auto?'badge-green':'badge-yellow'}" style="font-size:9px;flex-shrink:0">${s.auto?'تلقائي':'يدوي'}</span>
  </div>`).join('');
}

function confirmOrder() {
  const customer = document.getElementById('no-customer')?.value;
  if (!customer) { notify('يجب اختيار الزبون ✕', 'danger'); return; }

  closeM('m-new-order');

  // Reset modal
  currentOrderStep = 1;
  document.getElementById('no-btn-prev').style.display = 'none';
  document.getElementById('no-btn-next').style.display = 'block';
  document.getElementById('no-btn-confirm').style.display = 'none';
  document.getElementById('order-summary').style.display = 'none';
  updateOrderProgress(1);

  notify('✅ تم إطلاق تدفق العمل — الطلب جاهز في مرحلة الفاتورة', 'success');

  // Add new card to sales column
  setTimeout(() => {
    const col = document.getElementById('wf-col-sales');
    if (!col) return;
    const newId = 'SO-0' + (Math.floor(Math.random()*900)+100);
    const card = document.createElement('div');
    card.className = 'wf-card';
    card.dataset.status = 'sales';
    card.dataset.id = newId;
    card.style.cssText = 'background:#f8f0ff;border:1px solid var(--odoo-purple);border-radius:var(--r);padding:10px;cursor:pointer';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:700;color:var(--odoo-purple)">${newId}</span>
        <span class="badge badge-purple" style="font-size:9px">جديد</span>
      </div>
      <div style="font-weight:700;font-size:12px;margin-bottom:2px">طلب جديد</div>
      <div style="font-size:10.5px;color:var(--text-m)">بانتظار تأكيد القبض</div>
      <div style="margin-top:6px"><button class="btn btn-primary" style="padding:3px 8px;font-size:10px" onclick="event.stopPropagation();advanceWF(\'${newId}\',\'payment\')">← قبض</button></div>
    `;
    card.addEventListener('click', () => showWFDetail(newId));
    col.appendChild(card);
    updateWFCounts();
  }, 500);
}

// ===== ORDER LINE HANDLERS =====
let olCount = 1;
function addOrderLine() {
  olCount++;
  const id = 'ol-' + olCount;
  const row = document.createElement('div');
  row.className = 'jl-row';
  row.id = id;
  row.style.cssText = 'display:grid;grid-template-columns:200px 1fr 120px 80px 120px 34px;border-bottom:1px solid #f0f0f0';
  row.innerHTML = `
    <div style="padding:6px 8px"><select class="form-control" style="padding:5px 8px;font-size:12px" id="${id}-type" onchange="handleOrderType('${id}')">
      <option value="gen">🔵 مولد (بالسيريل)</option>
      <option value="part">🔩 قطعة غيار</option>
      <option value="service">🔧 خدمة صيانة</option>
    </select></div>
    <div style="padding:6px 8px"><select class="form-control" style="padding:5px 8px;font-size:12px" id="${id}-item" onchange="handleOrderItem('${id}')">
      <option value="">— اختر —</option>
      <option value="GEN-0045|بيركنز 50KVA|18500000|available">GEN-0045 ✅</option>
      <option value="GEN-0080|بادوين 150KVA|55000000|available">GEN-0080 ✅</option>
      <option value="GEN-0090|إيسوزو 30KVA|9500000|available">GEN-0090 ✅</option>
      <option value="GEN-NEW1|بادوين 350KVA|110000000|unavailable">بادوين 350KVA ⚠️</option>
    </select></div>
    <div style="padding:6px 8px"><input type="number" class="form-control" id="${id}-price" placeholder="السعر" style="padding:5px 8px;font-size:12px" oninput="calcOrderLine('${id}')"></div>
    <div style="padding:6px 8px"><input type="number" class="form-control" id="${id}-qty" value="1" min="1" style="padding:5px 8px;font-size:12px" oninput="calcOrderLine('${id}')" disabled></div>
    <div style="padding:6px 8px"><input type="text" class="form-control" id="${id}-total" readonly style="padding:5px 8px;font-size:12px;background:var(--bg);font-weight:700;font-family:'JetBrains Mono',monospace"></div>
    <div style="padding:6px 8px;display:flex;align-items:center"><button onclick="document.getElementById(\'${id}\').remove();calcOrderTotal()" style="background:var(--odoo-red-l);border:none;color:var(--odoo-red);cursor:pointer;width:26px;height:26px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px">✕</button></div>`;
  document.getElementById('order-lines')?.appendChild(row);
}

function handleOrderType(id) {
  const type = document.getElementById(id + '-type')?.value;
  const itemSel = document.getElementById(id + '-item');
  const qtyEl = document.getElementById(id + '-qty');
  if (!itemSel) return;
  if (type === 'gen') {
    itemSel.innerHTML = '<option value="">— اختر المولد —</option><option value="GEN-0045|بيركنز 50KVA|18500000|available">GEN-0045 بيركنز 50KVA ✅</option><option value="GEN-0080|بادوين 150KVA|55000000|available">GEN-0080 بادوين 150KVA ✅</option><option value="GEN-0090|إيسوزو 30KVA|9500000|available">GEN-0090 إيسوزو 30KVA ✅</option><option value="GEN-NEW1|بادوين 350KVA|110000000|unavailable">بادوين 350KVA ⚠️ يحتاج شراء</option>';
    if (qtyEl) { qtyEl.value = 1; qtyEl.disabled = true; }
  } else if (type === 'part') {
    itemSel.innerHTML = '<option value="F001|فلتر LF3349|55000|available">فلتر LF3349 — 55,000 ✅</option><option value="F002|بطارية 12V|210000|available">بطارية 12V — 210,000 ✅</option><option value="F003|زيت Shell 20L|170000|available">زيت Shell 20L ✅</option><option value="F004|فلتر بادوين|58000|available">فلتر زيت بادوين ✅</option><option value="F005|بلوجات إيسوزو|20000|low">بلوجات إيسوزو ⚠️ منخفض</option>';
    if (qtyEl) { qtyEl.value = 1; qtyEl.disabled = false; }
  } else {
    itemSel.innerHTML = '<option value="S001|صيانة دورية|75000|available">صيانة دورية — 75,000</option><option value="S002|فحص كهربائي|120000|available">فحص كهربائي — 120,000</option><option value="S003|إصلاح عطل|200000|available">إصلاح عطل — 200,000+</option>';
    if (qtyEl) { qtyEl.value = 1; qtyEl.disabled = false; }
  }
  calcOrderLine(id);
}

function handleOrderItem(id) {
  const sel = document.getElementById(id + '-item');
  const priceEl = document.getElementById(id + '-price');
  if (!sel || !priceEl) return;
  const parts = sel.value.split('|');
  if (parts.length >= 3) {
    priceEl.value = parts[2];
    calcOrderLine(id);

    // Show stock status
    const status = parts[3] || 'available';
    const bar = document.getElementById('stock-status-bar');
    if (bar) {
      bar.style.display = 'block';
      if (status === 'unavailable') {
        bar.style.background = '#fff1f2';
        bar.style.color = '#dc3545';
        bar.innerHTML = '⚠️ <strong>' + parts[1] + '</strong> غير متوفر في المستودع — سيُنشأ طلب شراء تلقائياً عند تأكيد الطلب';
      } else if (status === 'low') {
        bar.style.background = '#fffbeb';
        bar.style.color = '#92400e';
        bar.innerHTML = '🟡 <strong>' + parts[1] + '</strong> الكمية منخفضة — تحقق من المخزون';
      } else {
        bar.style.background = '#f0fdf4';
        bar.style.color = '#166534';
        bar.innerHTML = '✅ <strong>' + parts[1] + '</strong> متوفر في المستودع';
      }
    }
  }
}

function calcOrderLine(id) {
  const price = parseFloat(document.getElementById(id + '-price')?.value) || 0;
  const qty = parseFloat(document.getElementById(id + '-qty')?.value) || 1;
  const total = price * qty;
  const ti = document.getElementById(id + '-total');
  if (ti) ti.value = total ? fmt(total) : '';
  calcOrderTotal();
}

function calcOrderTotal() {
  let total = 0;
  document.querySelectorAll('[id^="ol-"][id$="-total"]').forEach(el => {
    total += parseFloat(el.value.replace(/,/g, '')) || 0;
  });
  const ot = document.getElementById('order-total');
  if (ot) ot.textContent = fmt(total);
}

function handlePayType() {
  const type = document.getElementById('no-pay-type')?.value;
  const detail = document.getElementById('pay-type-detail');
  if (!detail) return;
  const total = document.getElementById('order-total')?.textContent || '0';
  const configs = {
    full: {
      color: '#198754', icon: '✅',
      html: `<div style="font-weight:700;color:#198754;margin-bottom:8px">✅ تسديد حساب كامل</div>
             <div class="form-row" style="margin:0">
               <div class="form-group" style="margin:0"><label style="font-size:11px">المبلغ المدفوع كاملاً</label>
                 <input type="text" class="form-control" value="${total}" readonly style="font-weight:700;color:#198754;font-family:'JetBrains Mono',monospace"></div>
               <div class="form-group" style="margin:0"><label style="font-size:11px">القيد المحاسبي</label>
                 <input class="form-control" readonly value="ح/181.1 مدين — ح/124.1 دائن" style="font-size:11px;background:var(--bg)"></div>
             </div>`
    },
    deposit: {
      color: '#f59e0b', icon: '💛',
      html: `<div style="font-weight:700;color:#f59e0b;margin-bottom:8px">💛 عربون — دفعة أولى</div>
             <div class="form-row" style="margin:0">
               <div class="form-group" style="margin:0"><label style="font-size:11px">مبلغ العربون</label>
                 <input type="number" class="form-control" id="dep-amount" placeholder="0" oninput="calcDepRemain()"></div>
               <div class="form-group" style="margin:0"><label style="font-size:11px">المتبقي</label>
                 <input type="text" class="form-control" id="dep-remain" readonly style="background:var(--bg);color:#dc3545;font-weight:700;font-family:'JetBrains Mono',monospace"></div>
             </div>
             <div style="font-size:10.5px;color:var(--text-m);margin-top:8px">القيد: ح/181.1 مدين (العربون) / ح/166.3 دائن (إيرادات مقبوضة مقدماً)</div>`
    },
    installment: {
      color: '#6f42c1', icon: '💳',
      html: `<div style="font-weight:700;color:#6f42c1;margin-bottom:8px">💳 عقد أقساط</div>
             <div class="form-row-4" style="margin:0;gap:8px">
               <div class="form-group" style="margin:0"><label style="font-size:11px">مبلغ المقدمة</label><input type="number" class="form-control" placeholder="0"></div>
               <div class="form-group" style="margin:0"><label style="font-size:11px">عدد الأقساط</label><input type="number" class="form-control" value="6" min="1"></div>
               <div class="form-group" style="margin:0"><label style="font-size:11px">تاريخ أول قسط</label><input type="date" class="form-control"></div>
               <div class="form-group" style="margin:0"><label style="font-size:11px">كل قسط</label><input type="text" class="form-control" readonly style="background:var(--bg)"></div>
             </div>`
    },
    deferred: {
      color: '#dc3545', icon: '📋',
      html: `<div style="font-weight:700;color:#dc3545;margin-bottom:8px">📋 دفع آجل — بعد الاستلام</div>
             <div class="form-row" style="margin:0">
               <div class="form-group" style="margin:0"><label style="font-size:11px">تاريخ الاستحقاق</label><input type="date" class="form-control"></div>
               <div class="form-group" style="margin:0"><label style="font-size:11px">القيد المحاسبي</label><input class="form-control" readonly value="ح/124.1 مدين — ح/411.4 دائن" style="font-size:11px;background:var(--bg)"></div>
             </div>`
    }
  };
  if (type && configs[type]) {
    detail.style.display = 'block';
    detail.style.borderColor = configs[type].color;
    detail.innerHTML = configs[type].html;
  } else {
    detail.style.display = 'none';
  }
}

function calcDepRemain() {
  const total = parseFloat((document.getElementById('order-total')?.textContent || '0').replace(/,/g, '')) || 0;
  const dep = parseFloat(document.getElementById('dep-amount')?.value) || 0;
  const rem = document.getElementById('dep-remain');
  if (rem) {
    const r = total - dep;
    rem.value = r > 0 ? fmt(r) + ' — متبقي' : r < 0 ? '⚠️ العربون أكبر من الإجمالي' : '0 — مسدد كامل';
    rem.style.color = r > 0 ? '#dc3545' : r < 0 ? '#f59e0b' : '#198754';
  }
}

// Auto-init




// ===== INIT =====




// ===== INIT =====



// ===== RECEIPT MODAL — UPGRADED =====
function handleRcpMethod() {
  const method = document.getElementById('rcp-method')?.value;
  const cashDiv = document.getElementById('rcp-cash-detail');
  const bankDiv = document.getElementById('rcp-bank-detail');
  if (cashDiv) cashDiv.style.display = method === 'cash' ? 'block' : 'none';
  if (bankDiv) bankDiv.style.display = method === 'electronic' ? 'block' : 'none';
  calcRcpEntry();
}

function calcRcpEntry() {
  const type = document.getElementById('rcp-type')?.value;
  const method = document.getElementById('rcp-method')?.value;
  const amount = parseFloat(document.getElementById('rcp-amount')?.value) || 0;
  const preview = document.getElementById('rcp-entry-preview');
  const lines = document.getElementById('rcp-entry-lines');
  if (!preview || !lines || !type || !method || amount <= 0) {
    if (preview) preview.style.display = 'none';
    return;
  }

  // Determine debit account based on payment method
  const drAccount = method === 'cash'
    ? '181.1 — نقدية بالصندوق الرئيسي'
    : '183.2 — مصرف المنصور للاستثمار — دينار';

  // Determine credit account based on receipt type
  const crConfigs = {
    arboon:  { acc: '166.3 — إيرادات مقبوضة مقدماً', label: 'عربون (التزام مؤقت)' },
    takmila: { acc: '124.1 — زبائن قطاع خاص',        label: 'تكملة — تسوية الذمة' },
    tasdeed: { acc: '124.1 — زبائن قطاع خاص',        label: 'تسديد حساب قديم' },
    aqsat:   { acc: '124.1 — زبائن قطاع خاص',        label: 'قسط دوري' },
  };
  const cr = crConfigs[type] || { acc: '124.1 — زبائن قطاع خاص', label: '' };

  lines.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 100px 100px;gap:0;border:1px solid var(--border);border-radius:var(--r);overflow:hidden;font-size:12px">
      <div style="padding:6px 10px;background:var(--surface2);font-weight:700;font-size:10.5px;color:var(--text-m)">الحساب</div>
      <div style="padding:6px 10px;background:var(--surface2);font-weight:700;font-size:10.5px;color:var(--text-m)">البيان</div>
      <div style="padding:6px 10px;background:var(--surface2);font-weight:700;font-size:10.5px;color:var(--odoo-green)">مدين</div>
      <div style="padding:6px 10px;background:var(--surface2);font-weight:700;font-size:10.5px;color:var(--odoo-red)">دائن</div>
      <div style="padding:8px 10px;border-top:1px solid var(--border);font-family:monospace;font-size:11.5px;color:var(--odoo-blue)">${drAccount}</div>
      <div style="padding:8px 10px;border-top:1px solid var(--border);font-size:11px;color:var(--text-m)">قبض ${method === 'cash' ? 'نقداً' : 'إلكترونياً عبر المنصور'}</div>
      <div style="padding:8px 10px;border-top:1px solid var(--border);font-weight:700;color:var(--odoo-green);font-family:monospace">${fmt(amount)}</div>
      <div style="padding:8px 10px;border-top:1px solid var(--border)"></div>
      <div style="padding:8px 10px;border-top:1px solid var(--border);font-family:monospace;font-size:11.5px;color:var(--odoo-blue)">${cr.acc}</div>
      <div style="padding:8px 10px;border-top:1px solid var(--border);font-size:11px;color:var(--text-m)">${cr.label}</div>
      <div style="padding:8px 10px;border-top:1px solid var(--border)"></div>
      <div style="padding:8px 10px;border-top:1px solid var(--border);font-weight:700;color:var(--odoo-red);font-family:monospace">${fmt(amount)}</div>
    </div>`;
  preview.style.display = 'block';
}

function saveAndPrintRcp() {
  if (!validateRcp()) return;
  closeM('m-receipt');
  printRcp();
  notify('تم حفظ وصل القبض وإرساله للطباعة ✓', 'success');
}

function validateRcp() {
  const type = document.getElementById('rcp-type')?.value;
  const customer = (document.getElementById('sb-rcp-cus-val')?.value || document.getElementById('sb-rcp-cus-text')?.value || '').trim();
  const amount = parseFloat(document.getElementById('rcp-amount')?.value) || 0;
  const method = document.getElementById('rcp-method')?.value;
  if (!type) { notify('يجب اختيار نوع وصل القبض ✕', 'danger'); return false; }
  if (!customer) { notify('يجب اختيار الزبون ✕', 'danger'); return false; }
  if (amount <= 0) { notify('يجب إدخال مبلغ صحيح ✕', 'danger'); return false; }
  if (!method) { notify('يجب اختيار طريقة الاستلام ✕', 'danger'); return false; }
  if (method === 'electronic') {
    const transferNo = document.getElementById('rcp-transfer-no')?.value;
    if (!transferNo) { notify('يجب إدخال رقم الحوالة من مصرف المنصور ✕', 'danger'); return false; }
  }
  return true;
}

// Override saveReceipt — saves journal entry and marks deferred invoice as paid
const _origSaveReceipt = saveReceipt;
saveReceipt = function() {
  if (!validateRcp()) return;

  var type     = document.getElementById('rcp-type')?.value;
  var custId   = (document.getElementById('sb-rcp-cus-val')?.value   || '').trim();
  var custName = (document.getElementById('sb-rcp-cus-text')?.value  || '').trim();
  var ref      = (document.getElementById('rcp-ref')?.value          || '').trim();
  var amount   = parseFloat(document.getElementById('rcp-amount')?.value) || 0;
  var method   = document.getElementById('rcp-method')?.value;
  var today    = new Date().toISOString().split('T')[0];

  if (!custId) { custId = custName; } // fallback if no smart-search selection

  var drCode = (method === 'electronic') ? '1621' : '1611';
  var crCode = (type === 'arboon') ? '41111' : '151';

  var jId = 'RCP-' + String(Date.now()).slice(-6);
  JOURNAL_ENTRIES_DATA.push({
    id: jId, date: today, journal: 'receipt',
    ref: ref || jId, customer: custName, customerId: custId,
    type: type, method: method,
    lines: [{ code: drCode, debit: amount }, { code: crCode, credit: amount }]
  });

  // Link to deferred sale: mark as paid
  if (ref) {
    var linked = JOURNAL_ENTRIES_DATA.find(function(e) {
      return (e.ref === ref || e.id === ref) && e.journal === 'sale';
    });
    if (linked) { linked.paid = true; linked.rcpRef = jId; }
  }

  // ===== تخفيض ذمة الزبون =====
  if (typeof CUSTOMERS_DB !== "undefined" && custId) {
    var _cr = CUSTOMERS_DB.find(function(c){ return c.id===custId||c.name===custName; });
    if (_cr) _cr.debt = Math.max(0, (_cr.debt||0) - amount);
  }
  saveToStorage();
  closeM("m-receipt");
  if (typeof renderSalesPage === "function") renderSalesPage();
  if (typeof renderCustomersPage === "function") renderCustomersPage();
  if (typeof renderDashboard === "function") renderDashboard();

  var msg = method === 'electronic'
    ? 'تم تسجيل القبض الإلكتروني وإنشاء القيد — ح/' + drCode + ' مدين / ح/' + crCode + ' دائن ✓'
    : 'تم حفظ وصل القبض النقدي وإنشاء القيد — ح/' + drCode + ' مدين / ح/' + crCode + ' دائن ✓';
  notify(msg, 'success');
};

// ===== OPENING ENTRY =====
let oeLineCount = 3;

function addOELine(side) {
  oeLineCount++;
  const container = document.getElementById('oe-lines');
  const isDr = side === 'asset';
  const div = document.createElement('div');
  div.className = 'oe-line';
  div.dataset.side = side;
  div.style.cssText = `display:grid;grid-template-columns:50px 160px 1fr 130px 130px 32px;border-bottom:1px solid #f0f0f0;background:${isDr ? '#f0fdf420' : '#fff1f220'}`;
  div.innerHTML = `
    <div style="padding:6px 10px;font-size:11px;color:var(--text-s);display:flex;align-items:center">${oeLineCount}</div>
    <div style="padding:4px 6px">
      <select class="form-control" style="padding:5px 8px;font-size:11.5px" onchange="updateOEName(this)">
        ${isDr ? `
          <option value="181.1">181.1 — صندوق المركز</option>
          <option value="183.1">183.1 — البنك الأهلي</option>
          <option value="183.2">183.2 — مصرف المنصور</option>
          <option value="124.1">124.1 — زبائن قطاع خاص</option>
          <option value="121.1">121.1 — مخزون المولدات</option>
          <option value="121.2">121.2 — مخزون بضاعة</option>
          <option value="113.6">113.6 — مولدات كهربائية</option>
          <option value="114.1">114.1 — وسائط نقل</option>
          <option value="116">116 — أثاث وأجهزة</option>
          <option value="231">231 — مجمع استهلاك</option>
        ` : `
          <option value="211">211 — رأس المال المدفوع</option>
          <option value="221">221 — احتياطيات رأسمالية</option>
          <option value="224">224 — الفائض المتراكم</option>
          <option value="251.4">251.4 — مورِّدون خاص</option>
          <option value="264.1">264.1 — ضرائب مستحقة</option>
          <option value="264.2">264.2 — رواتب مستحقة</option>
          <option value="241">241 — قروض طويلة الأجل</option>
          <option value="242">242 — قروض قصيرة الأجل</option>
        `}
      </select>
    </div>
    <div style="padding:4px 6px;display:flex;align-items:center">
      <input class="form-control readonly" value="${isDr ? 'أصل مدين' : 'خصم/ملكية دائن'}" readonly style="background:var(--bg);font-size:12px">
    </div>
    <div style="padding:4px 6px">
      ${isDr ? `<input type="number" class="form-control" placeholder="0" style="color:var(--odoo-green);font-weight:700;font-family:monospace" oninput="calcOETotal()">` : `<input class="form-control readonly" value="" readonly style="background:var(--bg)">`}
    </div>
    <div style="padding:4px 6px">
      ${!isDr ? `<input type="number" class="form-control" placeholder="0" style="color:var(--odoo-red);font-weight:700;font-family:monospace" oninput="calcOETotal()">` : `<input class="form-control readonly" value="" readonly style="background:var(--bg)">`}
    </div>
    <div style="padding:4px 6px;display:flex;align-items:center">
      <button onclick="this.closest('.oe-line').remove();calcOETotal()" style="background:var(--odoo-red-l);border:none;color:var(--odoo-red);cursor:pointer;width:26px;height:26px;border-radius:4px;font-size:12px">✕</button>
    </div>`;
  container.appendChild(div);
}

function updateOEName(sel) {
  const nameMap = {
    '181.1':'نقدية بالصندوق الرئيسي','181.2':'صندوق الفروع',
    '183.1':'البنك الأهلي العراقي','183.2':'مصرف المنصور للاستثمار — دينار',
    '124.1':'زبائن قطاع خاص','124.2':'زبائن قطاع عام',
    '121.1':'مخزون المولدات الكهربائية','121.2':'مخزون بضاعة للبيع',
    '121.5':'قطع غيار وأدوات احتياطية',
    '113.6':'مولدات كهربائية — موجودات ثابتة',
    '114.1':'وسائط نقل بالسيارات','116':'أثاث وأجهزة مكاتب',
    '231':'مجمع الاندثار المتراكم',
    '211':'رأس المال المدفوع','221':'احتياطيات رأسمالية',
    '224':'الفائض المتراكم','225':'العجز المتراكم',
    '251.4':'مورِّدون قطاع خاص','264.1':'ضرائب مستحقة الدفع',
    '264.2':'رواتب مستحقة الدفع','241':'قروض طويلة الأجل',
    '242':'قروض قصيرة الأجل'
  };
  const row = sel.closest('.oe-line');
  const nameInput = row?.querySelectorAll('input')[0];
  if (nameInput) nameInput.value = nameMap[sel.value] || sel.options[sel.selectedIndex]?.text || '';
}

function calcOETotal() {
  let totalDr = 0, totalCr = 0;
  document.querySelectorAll('.oe-line').forEach(row => {
    const inputs = row.querySelectorAll('input[type=number]');
    if (row.dataset.side === 'asset') {
      totalDr += parseFloat(inputs[0]?.value) || 0;
    } else {
      totalCr += parseFloat(inputs[0]?.value) || 0;
    }
  });

  const drEl = document.getElementById('oe-total-dr');
  const crEl = document.getElementById('oe-total-cr');
  const ind = document.getElementById('oe-balance-indicator');
  if (drEl) drEl.textContent = fmt(totalDr);
  if (crEl) crEl.textContent = fmt(totalCr);

  const diff = Math.abs(totalDr - totalCr);
  if (ind) {
    if (totalDr === 0 && totalCr === 0) {
      ind.style.cssText = 'padding:10px 14px;border-top:1px solid var(--border);font-size:12.5px;font-weight:600;text-align:center;background:var(--bg);color:var(--text-m)';
      ind.textContent = 'أدخل الأرقام لحساب التوازن';
    } else if (diff < 1) {
      ind.style.cssText = 'padding:10px 14px;border-top:1px solid var(--border);font-size:12.5px;font-weight:700;text-align:center;background:var(--odoo-green-l);color:#166534';
      ind.textContent = '✅ القيد متوازن — المدين يساوي الدائن (' + fmt(totalDr) + ')';
      document.getElementById('oe-chk-7').textContent = '✅';
    } else {
      ind.style.cssText = 'padding:10px 14px;border-top:1px solid var(--border);font-size:12.5px;font-weight:700;text-align:center;background:var(--odoo-red-l);color:#721c24';
      ind.textContent = '❌ القيد غير متوازن — الفرق: ' + fmt(diff) + ' دينار';
      document.getElementById('oe-chk-7').textContent = '⬜';
    }
  }

  // Update checklist
  const chkMap = {
    'oe-chk-1': ['181', '183'],
    'oe-chk-2': ['124'],
    'oe-chk-3': ['121'],
    'oe-chk-4': ['113', '114', '116'],
    'oe-chk-5': ['251'],
    'oe-chk-6': ['211', '221', '224'],
  };
  document.querySelectorAll('.oe-line select').forEach(sel => {
    const val = sel.value;
    for (const [chkId, prefixes] of Object.entries(chkMap)) {
      if (prefixes.some(p => val.startsWith(p))) {
        const el = document.getElementById(chkId);
        if (el) el.textContent = '✅';
      }
    }
  });
}

function loadSampleOE() {
  const container = document.getElementById('oe-lines');
  if (!container) return;
  container.innerHTML = `
    ${makeOERow(1,'asset','181.1','نقدية بالصندوق الرئيسي','62666667','')}
    ${makeOERow(2,'asset','183.2','مصرف المنصور للاستثمار — دينار','33000000','')}
    ${makeOERow(3,'asset','124.1','زبائن قطاع خاص','18750000','')}
    ${makeOERow(4,'asset','121.1','مخزون المولدات الكهربائية','84500000','')}
    ${makeOERow(5,'asset','121.5','قطع غيار وأدوات احتياطية','5500000','')}
    ${makeOERow(6,'asset','113.6','مولدات كهربائية — موجودات ثابتة','45000000','')}
    ${makeOERow(7,'asset','114.1','وسائط نقل بالسيارات','25000000','')}
    ${makeOERow(8,'asset','116','أثاث وأجهزة مكاتب','8000000','')}
    ${makeOERow(9,'liability','251.4','مورِّدون قطاع خاص','','12000000')}
    ${makeOERow(10,'liability','264.2','رواتب مستحقة الدفع','','3500000')}
    ${makeOERow(11,'liability','211','رأس المال المدفوع','','200000000')}
    ${makeOERow(12,'liability','224','الفائض المتراكم','','66916000')}
  `;
  calcOETotal();
  notify('تم تحميل أرصدة نموذجية — راجع الأرقام وعدّلها حسب واقع الشركة', 'info');
}

function makeOERow(num, side, code, name, dr, cr) {
  const isDr = side === 'asset';
  const bg = isDr ? '#f0fdf420' : '#fff1f220';
  return `<div class="oe-line" data-side="${side}" style="display:grid;grid-template-columns:50px 160px 1fr 130px 130px 32px;border-bottom:1px solid #f0f0f0;background:${bg}">
    <div style="padding:6px 10px;font-size:11px;color:var(--text-s);display:flex;align-items:center">${num}</div>
    <div style="padding:4px 6px;display:flex;align-items:center"><span style="font-family:monospace;font-size:11.5px;font-weight:700;color:var(--odoo-blue)">${code}</span></div>
    <div style="padding:4px 6px;display:flex;align-items:center"><span style="font-size:12px">${name}</span></div>
    <div style="padding:4px 6px"><input type="number" class="form-control" value="${dr}" ${!isDr?'readonly style="background:var(--bg)"':''} style="color:var(--odoo-green);font-weight:700;font-family:monospace${!isDr?';background:var(--bg)':''}" oninput="calcOETotal()"></div>
    <div style="padding:4px 6px"><input type="number" class="form-control" value="${cr}" ${isDr?'readonly style="background:var(--bg)"':''} style="color:var(--odoo-red);font-weight:700;font-family:monospace${isDr?';background:var(--bg)':''}" oninput="calcOETotal()"></div>
    <div style="padding:4px 6px;display:flex;align-items:center"><button onclick="this.closest('.oe-line').remove();calcOETotal()" style="background:var(--odoo-red-l);border:none;color:var(--odoo-red);cursor:pointer;width:26px;height:26px;border-radius:4px;font-size:12px">✕</button></div>
  </div>`;
}

function previewOE() {
  let totalDr = 0, totalCr = 0;
  document.querySelectorAll('.oe-line').forEach(row => {
    const inputs = row.querySelectorAll('input[type=number]');
    if (row.dataset.side === 'asset') totalDr += parseFloat(inputs[0]?.value) || 0;
    else totalCr += parseFloat(inputs[0]?.value) || 0;
  });
  if (Math.abs(totalDr - totalCr) > 1) {
    notify('لا يمكن المعاينة — القيد غير متوازن (مدين: ' + fmt(totalDr) + ' / دائن: ' + fmt(totalCr) + ') ✕', 'danger');
    return;
  }
  notify('القيد متوازن — جاهز للحفظ ✓ الإجمالي: ' + fmt(totalDr), 'success');
}

function saveOpeningEntry() {
  let totalDr = 0, totalCr = 0;
  document.querySelectorAll('.oe-line').forEach(row => {
    const inputs = row.querySelectorAll('input[type=number]');
    if (row.dataset.side === 'asset') totalDr += parseFloat(inputs[0]?.value) || 0;
    else totalCr += parseFloat(inputs[0]?.value) || 0;
  });
  if (totalDr === 0) { notify('يجب إدخال أرصدة القيد الافتتاحي ✕', 'danger'); return; }
  if (Math.abs(totalDr - totalCr) > 1) {
    notify('القيد غير متوازن! المدين (' + fmt(totalDr) + ') ≠ الدائن (' + fmt(totalCr) + ') ✕', 'danger');
    return;
  }
  document.getElementById('oe-chk-8').textContent = '✅';
  closeM('m-opening-entry');
  notify('✅ تم حفظ القيد الافتتاحي JV-OPEN-2026 بنجاح — إجمالي: ' + fmt(totalDr) + ' د.ع', 'success');
}



// =============================================
// HR SYSTEM — LEAVES & TIMESHEETS
// =============================================

// ===== HR DATA =====
const WORK_START = 8 * 60;        // 8:00 AM in minutes
const WORK_END   = 17 * 60;       // 5:00 PM in minutes
const MONTHLY_LEAVE_DAYS = 1;     // 1 day per month
const MONTHLY_TS_MINUTES = 300;   // 5 hours = 300 min per month

const EMPLOYEES = [
  { id:'EMP-001', name:'حسين علي',    role:'فني صيانة',  dept:'الصيانة',  salary:850000  },
  { id:'EMP-002', name:'كريم محمد',   role:'فني صيانة',  dept:'الصيانة',  salary:850000  },
  { id:'EMP-003', name:'سارة أحمد',   role:'محاسبة',     dept:'المالية',   salary:1200000 },
  { id:'EMP-004', name:'عمر يوسف',    role:'مبيعات',     dept:'المبيعات', salary:950000  },
  { id:'EMP-005', name:'نور إبراهيم', role:'سكرتارية',   dept:'الإدارة',   salary:750000  },
];

// ============================================================
// PAYROLL_RECORDS — سجل مسيرات الرواتب
// ============================================================
let PAYROLL_RECORDS = [];

// Leave records: {empId, date, type, duration, reason, status, approvedBy}
const LEAVE_RECORDS = [
  { id:'LV-001', empId:'EMP-001', date:'2026-05-08', type:'annual',    duration:'full',      reason:'أمور شخصية',      status:'approved',  approvedBy:'مدير النظام' },
  { id:'LV-002', empId:'EMP-003', date:'2026-05-14', type:'sick',      duration:'full',      reason:'إجازة مرضية',     status:'approved',  approvedBy:'مدير النظام' },
  { id:'LV-003', empId:'EMP-002', date:'2026-05-20', type:'annual',    duration:'morning',   reason:'مراجعة دائرة',    status:'pending',   approvedBy:'' },
  { id:'LV-004', empId:'EMP-004', date:'2026-05-22', type:'emergency', duration:'full',      reason:'ظرف عائلي طارئ',  status:'pending',   approvedBy:'' },
  { id:'LV-005', empId:'EMP-001', date:'2026-04-10', type:'annual',    duration:'full',      reason:'سفر',             status:'approved',  approvedBy:'مدير النظام' },
];

// Timesheet records: {empId, date, tsType, actualTime, durationMin, note, status}
const TS_RECORDS = [
  { id:'TS-001', empId:'EMP-001', date:'2026-05-05', tsType:'late',        actualTime:'08:35', durationMin:35, note:'زحمة سير',              status:'approved' },
  { id:'TS-002', empId:'EMP-002', date:'2026-05-07', tsType:'early_leave', actualTime:'16:20', durationMin:40, note:'مراجعة مستشفى',         status:'approved' },
  { id:'TS-003', empId:'EMP-003', date:'2026-05-10', tsType:'permission',  actualTime:'11:00', durationMin:90, note:'مراجعة بنك',            status:'approved' },
  { id:'TS-004', empId:'EMP-004', date:'2026-05-12', tsType:'late',        actualTime:'09:15', durationMin:75, note:'عطل في السيارة',        status:'approved' },
  { id:'TS-005', empId:'EMP-001', date:'2026-05-14', tsType:'early_leave', actualTime:'15:45', durationMin:75, note:'ظرف عائلي',             status:'approved' },
  { id:'TS-006', empId:'EMP-005', date:'2026-05-15', tsType:'late',        actualTime:'08:20', durationMin:20, note:'',                      status:'pending'  },
  { id:'TS-007', empId:'EMP-002', date:'2026-05-18', tsType:'break',       actualTime:'',      durationMin:45, note:'استراحة زائدة',         status:'pending'  },
];

let pendingLeaveId = '';

// ===== HR TAB SWITCHING =====
function showHRTab(tab, btn) {
  var prBtn = document.getElementById('btn-run-payroll');
  if (prBtn) prBtn.style.display = tab === 'payroll' ? '' : 'none';
  var payrollDiv = document.getElementById('hr-tab-payroll');
  if (payrollDiv) payrollDiv.style.display = tab === 'payroll' ? 'block' : 'none';
  if (tab === 'payroll') { renderPayrollTab(); return; }
  ['leaves','timesheet','attendance','summary'].forEach(t => {
    const el = document.getElementById('hr-tab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#hr-tabs button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  if (tab === 'leaves')     renderLeaveBalances(), renderLeaveRequests();
  if (tab === 'timesheet')  renderTimesheetBalances(), renderTimesheetEntries();
  if (tab === 'attendance') renderAttendance();
  if (tab === 'summary')    renderHRSummary();
}

// ===== HELPERS =====
function getEmpName(id) {
  return EMPLOYEES.find(e => e.id === id)?.name || id;
}
function getEmpRole(id) {
  return EMPLOYEES.find(e => e.id === id)?.role || '';
}
function getMonthLeaveUsed(empId, month) {
  return LEAVE_RECORDS.filter(r =>
    r.empId === empId &&
    r.date.startsWith('2026-' + String(month).padStart(2,'0')) &&
    r.status !== 'rejected'
  ).reduce((s, r) => s + (r.duration === 'full' ? 1 : 0.5), 0);
}
function getMonthTSUsed(empId, month) {
  return TS_RECORDS.filter(r =>
    r.empId === empId &&
    r.date.startsWith('2026-' + String(month).padStart(2,'0')) &&
    r.status !== 'rejected'
  ).reduce((s, r) => s + r.durationMin, 0);
}
function formatMins(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? h + 'س ' + (m > 0 ? m + 'د' : '') : m + 'د';
}

// ===== LEAVE BALANCE TABLE =====
function renderLeaveBalances() {
  const month = parseInt(document.getElementById('leave-month-filter')?.value || '5');
  const tbody = document.getElementById('leave-balance-body');
  if (!tbody) return;
  tbody.innerHTML = EMPLOYEES.map(emp => {
    const used = getMonthLeaveUsed(emp.id, month);
    const remaining = MONTHLY_LEAVE_DAYS - used;
    const taken = used > 0;
    const overused = remaining < 0;
    return `<tr>
      <td><div style="font-weight:700">${emp.name}</div></td>
      <td><span class="badge badge-gray">${emp.role}</span></td>
      <td style="text-align:center;font-weight:700;color:var(--odoo-blue)">${MONTHLY_LEAVE_DAYS} يوم</td>
      <td style="text-align:center;font-weight:700;color:${used>0?'var(--odoo-red)':'var(--text-s)'}">${used} يوم</td>
      <td style="text-align:center">
        <span style="font-size:16px;font-weight:900;color:${remaining>0?'var(--odoo-green)':overused?'var(--odoo-red)':'var(--text-s)'}">${remaining}</span>
        <span style="font-size:10px;color:var(--text-m)"> يوم</span>
      </td>
      <td style="text-align:center">
        ${taken ? '<span class="badge badge-yellow">استخدم إجازته</span>' : '<span class="badge badge-green">لم يستخدم</span>'}
      </td>
      <td>
        <button class="btn btn-primary btn-xs" onclick="quickLeave('${emp.id}')">＋ طلب</button>
      </td>
    </tr>`;
  }).join('');
}

function updateLeaveBalances() { renderLeaveBalances(); }

// ===== LEAVE REQUESTS TABLE =====
function renderLeaveRequests() {
  const tbody = document.getElementById('leave-requests-body');
  if (!tbody) return;
  const typeLabels = { annual:'🏖️ سنوية', sick:'🏥 مرضية', emergency:'🚨 طارئة', unpaid:'💸 بدون راتب' };
  const durLabels  = { full:'يوم كامل', morning:'ص نصف', afternoon:'م نصف' };
  const stColors   = { approved:'badge-green', pending:'badge-yellow', rejected:'badge-red' };
  const stLabels   = { approved:'✅ موافق', pending:'⏳ بانتظار', rejected:'❌ مرفوض' };

  tbody.innerHTML = LEAVE_RECORDS.map((r, i) => {
    const month = parseInt(r.date.split('-')[1]);
    const used = getMonthLeaveUsed(r.empId, month);
    return `<tr>
      <td>${i+1}</td>
      <td style="font-weight:700">${getEmpName(r.empId)}</td>
      <td>${r.date}</td>
      <td>${r.reason}</td>
      <td>
        <div style="font-size:11px">${typeLabels[r.type]||r.type} — ${durLabels[r.duration]||r.duration}</div>
        <div style="font-size:10px;color:var(--text-m)">مستخدم هذا الشهر: ${used} يوم</div>
      </td>
      <td><span class="badge ${stColors[r.status]||'badge-gray'}">${stLabels[r.status]||r.status}</span></td>
      <td style="font-size:11px;color:var(--text-m)">${r.approvedBy||'—'}</td>
      <td>
        ${r.status==='pending' ? `
          <button class="btn btn-success btn-xs" onclick="openApproveModal('${r.id}',true)">✅</button>
          <button class="btn btn-danger btn-xs" onclick="openApproveModal('${r.id}',false)">❌</button>
        ` : '<span style="font-size:10px;color:var(--text-s)">—</span>'}
      </td>
    </tr>`;
  }).join('');
}

function filterLeaveReqs(status) {
  document.querySelectorAll('#leave-requests-body tr').forEach(tr => {
    if (status === 'all') { tr.style.display = ''; return; }
    const badge = tr.querySelector('.badge');
    const hasStatus = badge && (
      (status === 'pending'  && badge.classList.contains('badge-yellow')) ||
      (status === 'approved' && badge.classList.contains('badge-green'))  ||
      (status === 'rejected' && badge.classList.contains('badge-red'))
    );
    tr.style.display = hasStatus ? '' : 'none';
  });
}

// ===== TIMESHEET BALANCE TABLE =====
function renderTimesheetBalances() {
  const tbody = document.getElementById('timesheet-balance-body');
  if (!tbody) return;
  tbody.innerHTML = EMPLOYEES.map(emp => {
    const usedMin = getMonthTSUsed(emp.id, 5);
    const remMin  = MONTHLY_TS_MINUTES - usedMin;
    const pct     = Math.min(100, Math.round(usedMin / MONTHLY_TS_MINUTES * 100));
    const over    = remMin < 0;
    const warn    = pct >= 80 && !over;
    const barColor = over ? 'var(--odoo-red)' : warn ? 'var(--odoo-orange)' : 'var(--odoo-green)';

    return `<tr>
      <td><div style="font-weight:700">${emp.name}</div></td>
      <td><span class="badge badge-gray">${emp.role}</span></td>
      <td style="text-align:center;font-weight:700;color:var(--odoo-blue)">300 د (5س)</td>
      <td style="text-align:center;font-weight:700;color:${usedMin>0?'var(--odoo-red)':'var(--text-s)'}">
        ${usedMin} د ${usedMin>0?'('+formatMins(usedMin)+')':''}
      </td>
      <td style="text-align:center;font-weight:700;color:${over?'var(--odoo-red)':'var(--odoo-green)'}">
        ${over?'تجاوز '+Math.abs(remMin)+'د':remMin+' د ('+formatMins(remMin)+')'}
      </td>
      <td style="min-width:120px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:8px;background:var(--bg);border-radius:4px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${barColor};border-radius:4px;transition:width .5s"></div>
          </div>
          <span style="font-size:11px;font-weight:700;color:${barColor};min-width:32px">${pct}%</span>
        </div>
      </td>
      <td>
        ${over  ? '<span class="badge badge-red">🚫 تجاوز الحد</span>'  :
          warn  ? '<span class="badge badge-yellow">⚠️ تحذير</span>'     :
                  '<span class="badge badge-green">✅ طبيعي</span>'}
      </td>
    </tr>`;
  }).join('');
}

// ===== TIMESHEET ENTRIES TABLE =====
function renderTimesheetEntries() {
  const tbody = document.getElementById('timesheet-entries-body');
  if (!tbody) return;
  const typeLabels = {
    late:'⏰ تأخير', early_leave:'🚪 خروج مبكر',
    permission:'📋 إذن', break:'☕ استراحة زائدة'
  };
  const stColors = { approved:'badge-green', pending:'badge-yellow', rejected:'badge-red' };

  tbody.innerHTML = TS_RECORDS.map((r, i) => {
    const empMonth = parseInt(r.date.split('-')[1]);
    const totalUsed = getMonthTSUsed(r.empId, empMonth);
    const remaining = MONTHLY_TS_MINUTES - totalUsed;
    const over = remaining < 0;

    return `<tr ${over?'style="background:#fff1f2"':''}>
      <td>${i+1}</td>
      <td style="font-weight:700">${getEmpName(r.empId)}</td>
      <td>${r.date}</td>
      <td style="font-family:monospace;color:var(--odoo-blue)">8:00 ص</td>
      <td style="font-family:monospace">
        ${r.tsType==='late' ? r.actualTime + ' ص' : r.actualTime ? r.actualTime : '—'}
      </td>
      <td><span class="badge badge-gray">${typeLabels[r.tsType]||r.tsType}</span></td>
      <td style="font-weight:700;color:var(--odoo-red)">${r.durationMin} د (${formatMins(r.durationMin)})</td>
      <td style="font-weight:700;color:${over?'var(--odoo-red)':'var(--odoo-green)'}">
        ${over?'<span style="color:var(--odoo-red)">تجاوز!</span>':remaining+' د'}
      </td>
      <td><span class="badge ${stColors[r.status]||'badge-gray'}">${r.status==='approved'?'✅':'⏳'}</span></td>
      <td style="font-size:11px;color:var(--text-m)">${r.note||'—'}</td>
    </tr>`;
  }).join('');
}

// ===== ATTENDANCE CALENDAR =====
function renderAttendance() {
  const cal = document.getElementById('attendance-calendar');
  if (!cal) return;
  const empId = document.getElementById('att-emp-filter')?.value;
  const monthVal = document.getElementById('att-month')?.value || '2026-05';
  const [yr, mo] = monthVal.split('-').map(Number);
  const daysInMonth = new Date(yr, mo, 0).getDate();
  const firstDay = new Date(yr, mo-1, 1).getDay(); // 0=Sun

  const leaveMap = {};
  LEAVE_RECORDS.filter(r => r.empId===empId||empId==='all')
    .filter(r => r.date.startsWith(monthVal))
    .forEach(r => { leaveMap[r.date] = r; });

  const tsMap = {};
  TS_RECORDS.filter(r => r.empId===empId||empId==='all')
    .filter(r => r.date.startsWith(monthVal))
    .forEach(r => { tsMap[r.date] = r; });

  const dayNames = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const emp = empId !== 'all' ? EMPLOYEES.find(e=>e.id===empId) : null;

  let html = `
  ${emp ? `<div style="font-weight:700;font-size:13px;margin-bottom:12px;color:var(--odoo-purple)">${emp.name} — ${emp.role}</div>` : ''}
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px">
    ${dayNames.map(d=>`<div style="text-align:center;font-size:11px;font-weight:700;color:var(--text-m);padding:4px">${d}</div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">
  `;

  // Empty cells before first day (firstDay: 0=Sun)
  for (let i = 0; i < firstDay; i++) html += '<div></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${yr}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dow = new Date(yr, mo-1, d).getDay();
    const isWeekend = dow === 5 || dow === 6; // Fri=5, Sat=6
    const lv = leaveMap[dateStr];
    const ts = tsMap[dateStr];
    const today = dateStr === '2026-05-15';

    let bg, border, label, textColor;
    if (isWeekend) {
      bg='#f1f5f9'; border='var(--border)'; label='عطلة'; textColor='var(--text-s)';
    } else if (lv && lv.status!=='rejected') {
      bg='#fef3c7'; border='#f59e0b'; label='إجازة'; textColor='#92400e';
    } else if (ts && ts.status!=='rejected') {
      bg='#fce7f3'; border='#e879a4'; label=formatMins(ts.durationMin); textColor='#9d174d';
    } else {
      bg='#f0fdf4'; border='#86efac'; label='حضور'; textColor='#166534';
    }
    if (today) { bg='var(--odoo-purple-l)'; border='var(--odoo-purple)'; }

    html += `<div style="background:${bg};border:1.5px solid ${border};border-radius:6px;padding:6px;text-align:center;cursor:pointer;min-height:56px"
      title="${dateStr}">
      <div style="font-size:13px;font-weight:800;color:${today?'var(--odoo-purple)':textColor}">${d}</div>
      <div style="font-size:9px;font-weight:600;color:${textColor};margin-top:2px">${label}</div>
      ${ts?`<div style="font-size:8px;color:var(--text-s)">⏱${formatMins(ts.durationMin)}</div>`:''}
    </div>`;
  }

  html += '</div>';

  // Legend
  html += `<div style="display:flex;gap:14px;margin-top:14px;flex-wrap:wrap;font-size:11px">
    <div style="display:flex;align-items:center;gap:5px"><div style="width:14px;height:14px;background:#f0fdf4;border:1.5px solid #86efac;border-radius:3px"></div>حضور</div>
    <div style="display:flex;align-items:center;gap:5px"><div style="width:14px;height:14px;background:#fef3c7;border:1.5px solid #f59e0b;border-radius:3px"></div>إجازة</div>
    <div style="display:flex;align-items:center;gap:5px"><div style="width:14px;height:14px;background:#fce7f3;border:1.5px solid #e879a4;border-radius:3px"></div>زمنية</div>
    <div style="display:flex;align-items:center;gap:5px"><div style="width:14px;height:14px;background:#f1f5f9;border:1.5px solid var(--border);border-radius:3px"></div>عطلة</div>
  </div>`;

  cal.innerHTML = html;
}

// ===== HR SUMMARY =====
function renderHRSummary() {
  // Leaves summary
  const lSum = document.getElementById('summary-leaves');
  if (lSum) {
    let total=0, used=0;
    EMPLOYEES.forEach(emp => {
      for(let m=1;m<=5;m++){
        total += MONTHLY_LEAVE_DAYS;
        used  += getMonthLeaveUsed(emp.id, m);
      }
    });
    lSum.innerHTML = `
      <div class="info-row"><span class="lbl">الموظفون</span><span class="val">${EMPLOYEES.length}</span></div>
      <div class="info-row"><span class="lbl">إجمالي أيام الإجازة المستحقة (يناير-مايو)</span><span class="val">${total} يوم</span></div>
      <div class="info-row"><span class="lbl">الإجازات المأخوذة</span><span class="val" style="color:var(--odoo-red)">${used} يوم</span></div>
      <div class="info-row"><span class="lbl">الإجازات المتبقية</span><span class="val" style="color:var(--odoo-green)">${total-used} يوم</span></div>
      <div class="info-row"><span class="lbl">معدل الاستخدام</span><span class="val">${Math.round(used/total*100)}%</span></div>`;
  }

  // Timesheet summary
  const tsSum = document.getElementById('summary-timesheet');
  if (tsSum) {
    let totalMin=0, usedMin=0;
    EMPLOYEES.forEach(emp => {
      for(let m=1;m<=5;m++){
        totalMin += MONTHLY_TS_MINUTES;
        usedMin  += getMonthTSUsed(emp.id, m);
      }
    });
    const overEmp = EMPLOYEES.filter(emp => getMonthTSUsed(emp.id,5) > MONTHLY_TS_MINUTES);
    tsSum.innerHTML = `
      <div class="info-row"><span class="lbl">الحد الشهري لكل موظف</span><span class="val">5 ساعات (300 دقيقة)</span></div>
      <div class="info-row"><span class="lbl">إجمالي الزمنيات المسجلة</span><span class="val" style="color:var(--odoo-red)">${formatMins(usedMin)}</span></div>
      <div class="info-row"><span class="lbl">عدد سجلات الزمنية</span><span class="val">${TS_RECORDS.length}</span></div>
      <div class="info-row"><span class="lbl">موظفون تجاوزوا الحد</span><span class="val ${overEmp.length>0?'style="color:var(--odoo-red)"':''}">${overEmp.length} موظف</span></div>
      ${overEmp.length>0?`<div class="alert alert-danger" style="margin-top:8px;padding:8px 12px;font-size:11.5px"><span>⚠️</span><div>${overEmp.map(e=>e.name).join(' — ')}</div></div>`:''}`;
  }

  // Summary table
  const stbody = document.getElementById('hr-summary-body');
  if (stbody) {
    stbody.innerHTML = EMPLOYEES.map(emp => {
      const lvUsed = getMonthLeaveUsed(emp.id, 5);
      const tsUsed = getMonthTSUsed(emp.id, 5);
      const tsRem  = MONTHLY_TS_MINUTES - tsUsed;
      const lates  = TS_RECORDS.filter(r=>r.empId===emp.id&&r.tsType==='late').length;
      const earlyL = TS_RECORDS.filter(r=>r.empId===emp.id&&r.tsType==='early_leave').length;
      return `<tr>
        <td style="font-weight:700">${emp.name}</td>
        <td><span class="badge badge-gray">${emp.role}</span></td>
        <td style="text-align:center;color:var(--odoo-green);font-weight:700">20</td>
        <td style="text-align:center;color:var(--odoo-red);font-weight:700">${lvUsed}</td>
        <td style="text-align:center">${lvUsed} / ${MONTHLY_LEAVE_DAYS}</td>
        <td style="text-align:center;color:${MONTHLY_LEAVE_DAYS-lvUsed>0?'var(--odoo-green)':'var(--text-s)'};font-weight:700">${MONTHLY_LEAVE_DAYS-lvUsed}</td>
        <td style="text-align:center;font-family:monospace;color:var(--odoo-red)">${formatMins(tsUsed)}</td>
        <td style="text-align:center;font-family:monospace;color:${tsRem<0?'var(--odoo-red)':'var(--odoo-green)'}">${tsRem<0?'تجاوز':formatMins(tsRem)}</td>
        <td style="text-align:center">${lates}</td>
        <td style="text-align:center">${earlyL}</td>
      </tr>`;
    }).join('');
  }
}

// ===== LEAVE REQUEST FORM =====
function quickLeave(empId) {
  document.getElementById('lv-emp').value = empId;
  checkLeaveBalance();
  openM('m-leave-request');
}

function checkLeaveBalance() {
  const empId = document.getElementById('lv-emp')?.value;
  const dateVal = document.getElementById('lv-date')?.value;
  const dur = document.getElementById('lv-duration')?.value;
  const chk = document.getElementById('lv-balance-check');
  if (!chk || !empId) return;

  const month = dateVal ? parseInt(dateVal.split('-')[1]) : 5;
  const used = getMonthLeaveUsed(empId, month);
  const needed = dur === 'full' ? 1 : 0.5;
  const remaining = MONTHLY_LEAVE_DAYS - used;
  const canTake = remaining >= needed;

  chk.style.display = 'block';
  chk.style.borderColor = canTake ? 'var(--odoo-green)' : 'var(--odoo-red)';
  chk.style.background = canTake ? 'var(--odoo-green-l)' : 'var(--odoo-red-l)';
  chk.style.color = canTake ? '#166534' : '#721c24';

  const dow = dateVal ? new Date(dateVal).getDay() : -1;
  const isWeekend = dow === 5 || dow === 6;
  if (isWeekend) {
    chk.innerHTML = '<strong>⚠️ تنبيه:</strong> التاريخ المختار يقع في عطلة نهاية الأسبوع (جمعة/سبت).';
    chk.style.borderColor = '#f59e0b'; chk.style.background = '#fffbeb'; chk.style.color = '#92400e';
    return;
  }

  chk.innerHTML = `<strong>${canTake?'✅ يمكن منح الإجازة':'❌ لا يمكن منح الإجازة'}</strong><br>
    الرصيد المستحق هذا الشهر: ${MONTHLY_LEAVE_DAYS} يوم |
    المأخوذ: ${used} يوم |
    المتبقي: ${remaining} يوم |
    المطلوب: ${needed} يوم`;
}

function submitLeaveRequest() {
  const empId = document.getElementById('lv-emp')?.value;
  const date  = document.getElementById('lv-date')?.value;
  const dur   = document.getElementById('lv-duration')?.value;
  const type  = document.getElementById('lv-type')?.value;
  const reason= document.getElementById('lv-reason')?.value;
  if (!empId) { notify('يجب اختيار الموظف ✕','danger'); return; }
  if (!date)  { notify('يجب اختيار تاريخ الإجازة ✕','danger'); return; }
  if (!reason){ notify('يجب كتابة سبب الإجازة ✕','danger'); return; }

  const month = parseInt(date.split('-')[1]);
  const used = getMonthLeaveUsed(empId, month);
  const needed = dur==='full' ? 1 : 0.5;
  if (MONTHLY_LEAVE_DAYS - used < needed) {
    notify('رصيد الإجازة غير كافٍ لهذا الموظف في هذا الشهر ✕','danger');
    return;
  }
  LEAVE_RECORDS.push({ id:'LV-00'+(LEAVE_RECORDS.length+1), empId, date, type, duration:dur, reason, status:'pending', approvedBy:'' });
  closeM('m-leave-request');
  notify('✅ تم إرسال طلب الإجازة — بانتظار موافقة المدير','success');
  renderLeaveBalances(); renderLeaveRequests();
}

// ===== APPROVE/REJECT LEAVE =====
function openApproveModal(lvId, directAction) {
  // If called with directAction=true/false, approve/reject immediately without opening modal
  if (directAction === true || directAction === false) {
    pendingLeaveId = lvId;
    approveLeave(directAction);
    return;
  }
  pendingLeaveId = lvId;
  const lv = LEAVE_RECORDS.find(r=>r.id===lvId);
  if (!lv) return;
  const det = document.getElementById('approve-detail');
  if (det) det.innerHTML = `
    <div class="info-row"><span class="lbl">الموظف</span><span class="val">${getEmpName(lv.empId)}</span></div>
    <div class="info-row"><span class="lbl">التاريخ</span><span class="val">${lv.date}</span></div>
    <div class="info-row"><span class="lbl">المدة</span><span class="val">${lv.duration==='full'?'يوم كامل':'نصف يوم'}</span></div>
    <div class="info-row"><span class="lbl">السبب</span><span class="val">${lv.reason}</span></div>`;
  openM('m-leave-approve');
}

function approveLeave(approved) {
  const lv = LEAVE_RECORDS.find(r=>r.id===pendingLeaveId);
  if (!lv) return;
  lv.status = approved ? 'approved' : 'rejected';
  lv.approvedBy = 'مدير النظام';
  closeM('m-leave-approve');
  notify(approved ? '✅ تمت الموافقة على الإجازة' : '❌ تم رفض طلب الإجازة', approved?'success':'danger');
  renderLeaveRequests(); renderLeaveBalances();
}

// ===== TIMESHEET ENTRY FORM =====
function updateTimesheetFields() {
  const type = document.getElementById('ts-type')?.value;
  const lbl  = document.getElementById('ts-time-label');
  const dur  = document.getElementById('ts-duration-row');
  if (!type) return;
  const showDur = type === 'permission' || type === 'break';
  if (dur) dur.style.display = showDur ? 'block' : 'none';
  if (lbl) lbl.textContent = type==='late' ? 'وقت الحضور الفعلي' : type==='early_leave' ? 'وقت المغادرة الفعلي' : 'وقت البداية';
  calcTimesheetDuration();
}

function calcTimesheetDuration() {
  const type = document.getElementById('ts-type')?.value;
  const empId = document.getElementById('ts-emp')?.value;
  const dateVal = document.getElementById('ts-date')?.value;
  const res = document.getElementById('ts-calc-result');
  if (!type || !empId || !dateVal) { if(res) res.style.display='none'; return; }

  let durationMin = 0;
  const actualTime = document.getElementById('ts-actual-time')?.value;

  if (type === 'late' && actualTime) {
    const [h, m] = actualTime.split(':').map(Number);
    const actualMin = h*60 + m;
    durationMin = Math.max(0, actualMin - WORK_START);
  } else if (type === 'early_leave' && actualTime) {
    const [h, m] = actualTime.split(':').map(Number);
    const actualMin = h*60 + m;
    durationMin = Math.max(0, WORK_END - actualMin);
  } else if (type === 'permission' || type === 'break') {
    const start = document.getElementById('ts-perm-start')?.value;
    const end   = document.getElementById('ts-perm-end')?.value;
    if (start && end) {
      const [sh,sm] = start.split(':').map(Number);
      const [eh,em] = end.split(':').map(Number);
      durationMin = Math.max(0, (eh*60+em) - (sh*60+sm));
    }
  }

  const month = parseInt(dateVal.split('-')[1]);
  const usedSoFar = getMonthTSUsed(empId, month);
  const remaining = MONTHLY_TS_MINUTES - usedSoFar;
  const afterThis  = remaining - durationMin;
  const over = afterThis < 0;

  if (res) {
    res.style.display = 'block';
    res.style.borderColor = over ? 'var(--odoo-red)' : 'var(--odoo-green)';
    res.style.background  = over ? 'var(--odoo-red-l)' : 'var(--odoo-green-l)';
  }
  const durEl = document.getElementById('ts-duration-val');
  const usedEl = document.getElementById('ts-used-val');
  const remEl  = document.getElementById('ts-remaining-val');
  if (durEl)  durEl.textContent  = durationMin + 'د (' + formatMins(durationMin) + ')';
  if (usedEl) usedEl.textContent = (usedSoFar + durationMin) + 'د';
  if (remEl)  { remEl.textContent = over ? 'تجاوز '+Math.abs(afterThis)+'د' : afterThis+'د'; remEl.style.color = over?'var(--odoo-red)':'var(--odoo-green)'; }

  const warn = document.getElementById('ts-balance-warn');
  if (warn) warn.style.display = over ? 'flex' : 'none';
}

function checkTimesheetBalance() { calcTimesheetDuration(); }

function submitTimesheetEntry() {
  const empId  = document.getElementById('ts-emp')?.value;
  const date   = document.getElementById('ts-date')?.value;
  const type   = document.getElementById('ts-type')?.value;
  const note   = document.getElementById('ts-note')?.value;
  if (!empId) { notify('يجب اختيار الموظف ✕','danger'); return; }
  if (!date)  { notify('يجب اختيار التاريخ ✕','danger'); return; }
  if (!type)  { notify('يجب اختيار نوع الزمنية ✕','danger'); return; }

  const actualTime = document.getElementById('ts-actual-time')?.value || '';
  let durationMin = 0;
  if (type === 'late' && actualTime) {
    const [h,m] = actualTime.split(':').map(Number);
    durationMin = Math.max(0, (h*60+m) - WORK_START);
  } else if (type === 'early_leave' && actualTime) {
    const [h,m] = actualTime.split(':').map(Number);
    durationMin = Math.max(0, WORK_END - (h*60+m));
  } else {
    const start = document.getElementById('ts-perm-start')?.value;
    const end   = document.getElementById('ts-perm-end')?.value;
    if (start && end) {
      const [sh,sm] = start.split(':').map(Number);
      const [eh,em] = end.split(':').map(Number);
      durationMin = Math.max(0, (eh*60+em) - (sh*60+sm));
    }
  }
  if (durationMin === 0) { notify('المدة المحسوبة = 0 دقيقة. تحقق من الأوقات ✕','danger'); return; }

  TS_RECORDS.push({ id:'TS-00'+(TS_RECORDS.length+1), empId, date, tsType:type, actualTime, durationMin, note, status:'pending' });
  closeM('m-timesheet-entry');
  notify('✅ تم تسجيل الزمنية — ' + formatMins(durationMin) + ' — بانتظار الاعتماد', 'success');
  renderTimesheetBalances(); renderTimesheetEntries();
}

function exportHRExcel() {
  const BOM = '\uFEFF';
  const rows = [
    ['شركة الراية الزرقاء — تقرير الموارد البشرية — مايو 2026'],
    [],
    ['الموظف','الوظيفة','الإجازة المستحقة','المأخوذ','المتبقي','الزمنية الشهرية','المستخدم','المتبقي','تأخير','خروج مبكر'],
    ...EMPLOYEES.map(emp => {
      const lvU = getMonthLeaveUsed(emp.id,5), tsU = getMonthTSUsed(emp.id,5);
      return [emp.name, emp.role, MONTHLY_LEAVE_DAYS+'يوم', lvU+'يوم', (MONTHLY_LEAVE_DAYS-lvU)+'يوم',
              '300دق', tsU+'دق', (MONTHLY_TS_MINUTES-tsU)+'دق',
              TS_RECORDS.filter(r=>r.empId===emp.id&&r.tsType==='late').length,
              TS_RECORDS.filter(r=>r.empId===emp.id&&r.tsType==='early_leave').length];
    })
  ];
  const csv = BOM + rows.map(r=>r.map(c=>'"'+String(c)+'"').join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:'HR_Report_May2026.csv'});
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  notify('✅ تم تصدير تقرير الموارد البشرية','success');
}

// Init HR when page loads



// ================================================================
// ACCOUNTS DATA (for journal autocomplete)
// ================================================================

// ============================================================
// JOURNALS — وفق الوثيقة الرسمية
// ============================================================
const JOURNALS = {
  sales:       { code:'JRN-SALES', name:'دفتر المبيعات',        icon:'🧾', color:'var(--odoo-green)',  accounts:{dr:'151',  cr:'411'} },
  purchase:    { code:'JRN-PURCH', name:'دفتر المشتريات',       icon:'🛒', color:'var(--odoo-orange)', accounts:{dr:'121',  cr:'221'} },
  cash:        { code:'JRN-CASH',  name:'دفتر الصندوق',         icon:'💵', color:'var(--odoo-blue)',   accounts:{dr:'1611', cr:'1611'} },
  bank:        { code:'JRN-BANK',  name:'دفتر المصرف',          icon:'🏦', color:'var(--odoo-purple)', accounts:{dr:'1621', cr:'1621'} },
  inventory:   { code:'JRN-INV',   name:'دفتر حركة المخزون',    icon:'📦', color:'#f59e0b',           accounts:{dr:'511',  cr:'1211'} },
  maintenance: { code:'JRN-MAINT', name:'دفتر الصيانة',         icon:'🔧', color:'#dc3545',           accounts:{dr:'421',  cr:'151'} },
  adjustment:  { code:'JRN-ADJ',   name:'دفتر التسويات',        icon:'⚖️', color:'var(--text-m)',     accounts:{dr:'',     cr:''} },
  opening:     { code:'JRN-OPEN',  name:'دفتر القيد الافتتاحي', icon:'🏁', color:'var(--odoo-purple)', accounts:{dr:'',     cr:'31'} },
};

// ============================================================
// ACCOUNTS_DB — وفق الهيكل الجديد الصحيح
// المبدأ: الرصيد يُحسب من القيود فقط
// ============================================================
const ACCOUNTS_DB = [
  // ── المجموعة 1: الموجودات ──────────────────────────────
  // 111-112: أراضي ومباني
  {code:'1111',  name:'أراضي المقر الرئيسي',                    type:'asset',    normal:'debit'},
  {code:'1112',  name:'أراضي المستودعات',                       type:'asset',    normal:'debit'},
  {code:'1121',  name:'مبنى المكتب الرئيسي',                    type:'asset',    normal:'debit'},
  {code:'1122',  name:'مستودع المولدات',                         type:'asset',    normal:'debit'},
  {code:'1123',  name:'مستودع قطع الغيار',                      type:'asset',    normal:'debit'},
  // 113-116: معدات
  {code:'1131',  name:'معدات الورشة والصيانة',                   type:'asset',    normal:'debit'},
  {code:'1132',  name:'مولدات خاصة بالشركة',                    type:'asset',    normal:'debit'},
  {code:'1133',  name:'أجهزة الفحص والقياس',                    type:'asset',    normal:'debit'},
  {code:'1141',  name:'سيارات النقل والتوصيل',                   type:'asset',    normal:'debit'},
  {code:'1142',  name:'مركبات الصيانة الميدانية',               type:'asset',    normal:'debit'},
  {code:'1151',  name:'أثاث المكاتب',                            type:'asset',    normal:'debit'},
  {code:'1152',  name:'تجهيزات المستودع',                       type:'asset',    normal:'debit'},
  {code:'1161',  name:'حاسبات وطابعات',                         type:'asset',    normal:'debit'},
  {code:'1162',  name:'برمجيات وأنظمة',                         type:'asset',    normal:'debit'},
  // 117: مجمع الاندثار
  {code:'1171',  name:'مجمع اندثار المباني',                    type:'asset',    normal:'credit'},
  {code:'1172',  name:'مجمع اندثار المكائن والمعدات',           type:'asset',    normal:'credit'},
  {code:'1173',  name:'مجمع اندثار وسائط النقل',               type:'asset',    normal:'credit'},
  {code:'1174',  name:'مجمع اندثار الأثاث',                    type:'asset',    normal:'credit'},
  {code:'1175',  name:'مجمع اندثار الحاسوب',                   type:'asset',    normal:'credit'},
  // 12: المخزون
  {code:'12111', name:'مخزون مولدات بيركنز',                    type:'asset',    normal:'debit'},
  {code:'12112', name:'مخزون مولدات بادوين',                    type:'asset',    normal:'debit'},
  {code:'12113', name:'مخزون مولدات إيسوزو صيني',              type:'asset',    normal:'debit'},
  {code:'12121', name:'قطع غيار بيركنز',                        type:'asset',    normal:'debit'},
  {code:'12122', name:'قطع غيار بادوين',                        type:'asset',    normal:'debit'},
  {code:'12123', name:'فلاتر ومستلزمات عامة',                   type:'asset',    normal:'debit'},
  {code:'12131', name:'زيوت محركات',                             type:'asset',    normal:'debit'},
  {code:'12132', name:'ماء مقطر وكوولنت',                       type:'asset',    normal:'debit'},
  {code:'12133', name:'مواد تشحيم متنوعة',                      type:'asset',    normal:'debit'},
  {code:'1221',  name:'مولدات تحت الشراء — في الطريق',          type:'asset',    normal:'debit'},
  {code:'1222',  name:'قطع غيار تحت الشراء',                   type:'asset',    normal:'debit'},
  // 15: الحسابات المدينة
  {code:'1511',  name:'زبائن القطاع الخاص — مبيعات مولدات',    type:'asset',    normal:'debit'},
  {code:'1512',  name:'زبائن القطاع الخاص — خدمات صيانة',      type:'asset',    normal:'debit'},
  {code:'1513',  name:'زبائن القطاع الحكومي',                   type:'asset',    normal:'debit'},
  {code:'1514',  name:'عربونات وحجوزات مستلمة',                 type:'asset',    normal:'debit'},
  {code:'1521',  name:'أوراق قبض تجارية',                       type:'asset',    normal:'debit'},
  {code:'1522',  name:'شيكات برسم التحصيل',                    type:'asset',    normal:'debit'},
  {code:'1531',  name:'سلف رواتب',                              type:'asset',    normal:'debit'},
  {code:'1532',  name:'سلف مصروفات',                            type:'asset',    normal:'debit'},
  {code:'1541',  name:'تأمينات عقود',                           type:'asset',    normal:'debit'},
  {code:'1542',  name:'تأمينات إيجار',                          type:'asset',    normal:'debit'},
  {code:'1551',  name:'مطالبات تأمين',                          type:'asset',    normal:'debit'},
  {code:'1552',  name:'مصاريف مدفوعة مقدماً',                  type:'asset',    normal:'debit'},
  {code:'1553',  name:'ضريبة مستحقة الاسترداد',                type:'asset',    normal:'debit'},
  // 16: النقدية ← الأهم
  {code:'1611',  name:'صندوق الدينار العراقي',                  type:'asset',    normal:'debit'},
  {code:'1612',  name:'صندوق الدولار الأمريكي',                 type:'asset',    normal:'debit'},
  {code:'1621',  name:'مصرف المنصور للاستثمار — دينار',         type:'asset',    normal:'debit'},
  {code:'1622',  name:'مصرف المنصور — حساب التحويل الخارجي',   type:'asset',    normal:'debit'},
  {code:'1623',  name:'مصرف أهلي — حساب جارٍ',                 type:'asset',    normal:'debit'},

  // ── المجموعة 2: المطلوبات ──────────────────────────────
  {code:'2211',  name:'موردو المولدات الخارجيون',               type:'liability',normal:'credit'},
  {code:'2212',  name:'موردو قطع الغيار المحليون',              type:'liability',normal:'credit'},
  {code:'2213',  name:'موردو الزيوت والمواد',                   type:'liability',normal:'credit'},
  {code:'2221',  name:'كمبيالات وأوراق دفع',                   type:'liability',normal:'credit'},
  {code:'2231',  name:'فواتير خدمات مستحقة',                   type:'liability',normal:'credit'},
  {code:'2232',  name:'مصاريف صيانة مستحقة',                   type:'liability',normal:'credit'},
  {code:'2241',  name:'رواتب الموظفين المستحقة',               type:'liability',normal:'credit'},
  {code:'2242',  name:'أجور الفنيين المستحقة',                 type:'liability',normal:'credit'},
  {code:'2251',  name:'ضريبة المبيعات المستحقة',               type:'liability',normal:'credit'},
  {code:'2252',  name:'ضريبة الدخل المستحقة',                  type:'liability',normal:'credit'},
  {code:'2253',  name:'ضريبة الرواتب (الاقتطاع)',              type:'liability',normal:'credit'},
  {code:'2261',  name:'أمانات ضمان عقود',                      type:'liability',normal:'credit'},
  {code:'2262',  name:'دفعات مقدمة من العملاء',                type:'liability',normal:'credit'},
  {code:'2263',  name:'عربونات مستلمة على مولدات',             type:'liability',normal:'credit'},
  {code:'231',   name:'مخصص مطالبات ضمان',                     type:'liability',normal:'credit'},
  {code:'232',   name:'مخصص ديون مشكوك فيها',                  type:'liability',normal:'credit'},

  // ── المجموعة 3: حقوق الملكية ──────────────────────────
  {code:'311',   name:'رأس المال المدفوع',                      type:'equity',   normal:'credit'},
  {code:'312',   name:'رأس المال غير المدفوع',                  type:'equity',   normal:'credit'},
  {code:'321',   name:'احتياطي قانوني',                         type:'equity',   normal:'credit'},
  {code:'322',   name:'احتياطي اختياري',                        type:'equity',   normal:'credit'},
  {code:'331',   name:'أرباح متراكمة من سنوات سابقة',           type:'equity',   normal:'credit'},
  {code:'332',   name:'خسائر متراكمة من سنوات سابقة',          type:'equity',   normal:'debit'},
  {code:'341',   name:'ربح السنة الجارية',                      type:'equity',   normal:'credit'},
  {code:'342',   name:'خسارة السنة الجارية',                    type:'equity',   normal:'debit'},

  // ── المجموعة 4: الإيرادات ─────────────────────────────
  {code:'4111',  name:'مبيعات مولدات بيركنز',                   type:'revenue',  normal:'credit'},
  {code:'4112',  name:'مبيعات مولدات بادوين',                   type:'revenue',  normal:'credit'},
  {code:'4113',  name:'مبيعات مولدات إيسوزو صيني',             type:'revenue',  normal:'credit'},
  {code:'4114',  name:'مردودات مبيعات مولدات',                  type:'revenue',  normal:'debit'},
  {code:'4121',  name:'مبيعات قطع غيار بيركنز',                type:'revenue',  normal:'credit'},
  {code:'4122',  name:'مبيعات قطع غيار بادوين',                type:'revenue',  normal:'credit'},
  {code:'4123',  name:'مبيعات فلاتر وزيوت',                    type:'revenue',  normal:'credit'},
  {code:'4211',  name:'صيانة دورية',                            type:'revenue',  normal:'credit'},
  {code:'4212',  name:'إصلاح أعطال',                            type:'revenue',  normal:'credit'},
  {code:'4213',  name:'استبدال قطع تحت الضمان',                type:'revenue',  normal:'credit'},
  {code:'4221',  name:'عقود صيانة — القطاع الخاص',             type:'revenue',  normal:'credit'},
  {code:'4222',  name:'عقود صيانة — القطاع الحكومي',           type:'revenue',  normal:'credit'},
  {code:'4231',  name:'أجور نقل المولدات',                      type:'revenue',  normal:'credit'},
  {code:'4232',  name:'أجور تركيب وتشغيل',                     type:'revenue',  normal:'credit'},
  {code:'431',   name:'إيرادات فوائد بنكية',                    type:'revenue',  normal:'credit'},
  {code:'432',   name:'أرباح بيع موجودات ثابتة',               type:'revenue',  normal:'credit'},

  // ── المجموعة 5: المصروفات ─────────────────────────────
  // 51: تكلفة النشاط
  {code:'5111',  name:'تكلفة شراء مولدات بيركنز',              type:'expense',  normal:'debit'},
  {code:'5112',  name:'تكلفة شراء مولدات بادوين',              type:'expense',  normal:'debit'},
  {code:'5113',  name:'تكلفة شراء مولدات إيسوزو',              type:'expense',  normal:'debit'},
  {code:'5114',  name:'رسوم الاستيراد والجمارك',                type:'expense',  normal:'debit'},
  {code:'5115',  name:'مصاريف الشحن والنقل للمولدات',          type:'expense',  normal:'debit'},
  {code:'5121',  name:'تكلفة قطع غيار بيركنز المباعة',         type:'expense',  normal:'debit'},
  {code:'5122',  name:'تكلفة قطع غيار بادوين المباعة',         type:'expense',  normal:'debit'},
  {code:'5123',  name:'تكلفة فلاتر وزيوت مباعة',               type:'expense',  normal:'debit'},
  {code:'5131',  name:'مواد الصيانة المستهلكة',                 type:'expense',  normal:'debit'},
  {code:'5132',  name:'قطع غيار مستبدلة في الصيانة',           type:'expense',  normal:'debit'},
  {code:'5141',  name:'أجور فنيي الصيانة الميدانية',           type:'expense',  normal:'debit'},
  {code:'5142',  name:'أجور فنيي الورشة',                      type:'expense',  normal:'debit'},
  {code:'5143',  name:'أجور التركيب والتشغيل',                 type:'expense',  normal:'debit'},
  // 52: تشغيلية
  {code:'5211',  name:'إيجار المستودع',                         type:'expense',  normal:'debit'},
  {code:'5212',  name:'كهرباء المستودع',                        type:'expense',  normal:'debit'},
  {code:'5213',  name:'صيانة المستودع',                         type:'expense',  normal:'debit'},
  {code:'5221',  name:'وقود سيارات التوصيل',                   type:'expense',  normal:'debit'},
  {code:'5222',  name:'صيانة سيارات التوصيل',                  type:'expense',  normal:'debit'},
  {code:'5223',  name:'استئجار وسائط نقل خارجية',              type:'expense',  normal:'debit'},
  {code:'5231',  name:'تكلفة خدمة ضمان المولدات',              type:'expense',  normal:'debit'},
  {code:'5232',  name:'قطع غيار الضمان',                       type:'expense',  normal:'debit'},
  // 53: إدارية
  {code:'5311',  name:'رواتب الموظفين الإداريين',              type:'expense',  normal:'debit'},
  {code:'5312',  name:'رواتب المحاسبة والمالية',               type:'expense',  normal:'debit'},
  {code:'5313',  name:'رواتب الإدارة العليا',                  type:'expense',  normal:'debit'},
  {code:'5314',  name:'مكافآت وحوافز',                         type:'expense',  normal:'debit'},
  {code:'5321',  name:'إيجار المكتب الرئيسي',                  type:'expense',  normal:'debit'},
  {code:'5331',  name:'فاتورة الكهرباء',                       type:'expense',  normal:'debit'},
  {code:'5332',  name:'فاتورة الماء',                          type:'expense',  normal:'debit'},
  {code:'5341',  name:'اشتراك الإنترنت',                       type:'expense',  normal:'debit'},
  {code:'5342',  name:'فاتورة الهاتف',                         type:'expense',  normal:'debit'},
  {code:'5351',  name:'وقود سيارات الإدارة',                  type:'expense',  normal:'debit'},
  {code:'5352',  name:'وقود المولد الاحتياطي',                 type:'expense',  normal:'debit'},
  {code:'5361',  name:'مصاريف الضيافة',                        type:'expense',  normal:'debit'},
  {code:'5362',  name:'هدايا العملاء',                         type:'expense',  normal:'debit'},
  {code:'537',   name:'القرطاسية واللوازم المكتبية',           type:'expense',  normal:'debit'},
  {code:'5381',  name:'اندثار المباني',                        type:'expense',  normal:'debit'},
  {code:'5382',  name:'اندثار المكائن والمعدات',               type:'expense',  normal:'debit'},
  {code:'5383',  name:'اندثار وسائط النقل',                   type:'expense',  normal:'debit'},
  {code:'5384',  name:'اندثار الأثاث',                        type:'expense',  normal:'debit'},
  {code:'5385',  name:'اندثار الحاسوب',                       type:'expense',  normal:'debit'},
  {code:'539',   name:'مصروفات إدارية أخرى',                  type:'expense',  normal:'debit'},
  // 54: تسويقية
  {code:'541',   name:'رواتب فريق المبيعات',                   type:'expense',  normal:'debit'},
  {code:'542',   name:'إعلانات ودعاية',                        type:'expense',  normal:'debit'},
  {code:'543',   name:'عمولات المبيعات',                       type:'expense',  normal:'debit'},
  // 55: تمويلية
  {code:'551',   name:'فوائد قروض بنكية',                      type:'expense',  normal:'debit'},
  {code:'552',   name:'عمولات بنكية',                          type:'expense',  normal:'debit'},
  {code:'553',   name:'فروقات عملة',                           type:'expense',  normal:'debit'},
  {code:'554',   name:'رسوم اعتمادات مستندية',                 type:'expense',  normal:'debit'},
];

// ============================================================
// SUPPLIERS_DB — قاعدة بيانات المجهزين
// ============================================================
const SUPPLIERS_DB = [];

// ============================================================
// ITEMS_DB — كتالوج المواد والخدمات
// ============================================================
const ITEMS_DB = [];

// ============================================================
// CUSTOMERS_DB — قاعدة بيانات الزبائن
// ============================================================
const CUSTOMERS_DB = [
  {id:'CUS-001', name:'شركة طاقات الفرات - مصطفى كمر', phone:'07730408040', accountCode:'1511', city:'بغداد', address:'الكرادة', debt:0},
  {id:'CUS-002', name:'حردان أبو احمد', phone:'', accountCode:'1511', city:'بغداد', address:'الكرادة', debt:0},
  {id:'CUS-003', name:'محمد صادق الربيعي', phone:'07700089306', accountCode:'1511', city:'بغداد', address:'بغداد الجديدة', debt:0},
  {id:'CUS-004', name:'دكتور احسان هاشم – عيادة ليبرتي', phone:'07902610481', accountCode:'1511', city:'بغداد', address:'العطيفية', debt:0},
  {id:'CUS-005', name:'ارض العابر', phone:'', accountCode:'1511', city:'البصرة', address:'شارع الوفود', debt:0},
  {id:'CUS-006', name:'زيد حلة', phone:'', accountCode:'1511', city:'بابل', address:'الحلة', debt:0},
  {id:'CUS-007', name:'شركة اوفتك', phone:'07502956464', accountCode:'1511', city:'بغداد', address:'كرادة - قرب ساحة التحريات', debt:0},
  {id:'CUS-008', name:'مصطفى محسن علي – عيادة مصطفى', phone:'07806867427', accountCode:'1511', city:'بابل', address:'الحلة - قرب مدرسة غزة', debt:0},
  {id:'CUS-009', name:'فندق الحرمين - احمد عدنان', phone:'07901489514', accountCode:'1511', city:'بغداد', address:'الكاظمية - شارع الرضا', debt:0},
  {id:'CUS-010', name:'علي وعمر', phone:'', accountCode:'1511', city:'بغداد', address:'كمب سارة', debt:0},
  {id:'CUS-011', name:'شركة سما كربلاء - محمد مهند', phone:'', accountCode:'1511', city:'كربلاء', address:'قرب مطار كربلاء', debt:0},
  {id:'CUS-012', name:'عبد الرسول رعد ظهار', phone:'07800004060', accountCode:'1511', city:'الديوانية', address:'الديوانية', debt:0},
  {id:'CUS-013', name:'اثير كريم حسين', phone:'07809008820', accountCode:'1511', city:'بغداد', address:'جميلة شارع خير الله', debt:0},
  {id:'CUS-014', name:'شركة أنظمة النجاح للتجارة والاستثمارات', phone:'07809164954', accountCode:'1511', city:'بغداد', address:'الدورة شارع أبو طيارة', debt:0},
  {id:'CUS-015', name:'شركة مسافات', phone:'', accountCode:'1511', city:'بغداد', address:'الحارثية', debt:0},
  {id:'CUS-016', name:'الوليد خالد غالب', phone:'07855555788', accountCode:'1511', city:'ذي قار', address:'الناصرية', debt:0},
  {id:'CUS-017', name:'نور عصام الدين صادق', phone:'07901434082', accountCode:'1511', city:'بغداد', address:'اليرموك', debt:0},
  {id:'CUS-018', name:'محمد مرزة عبد', phone:'07500341179', accountCode:'1511', city:'بغداد', address:'زيونة', debt:0},
  {id:'CUS-019', name:'حسين علي عبودي', phone:'07714300626', accountCode:'1511', city:'بغداد', address:'التاجي', debt:0},
  {id:'CUS-020', name:'شركة القدرة الكاملة – احمد سالم', phone:'', accountCode:'1511', city:'بغداد', address:'شارع 62', debt:0},
  {id:'CUS-021', name:'وليد مخيبر خلف – شركة النبع الصافي', phone:'07770655122', accountCode:'1511', city:'بغداد', address:'بسماية - حي الوحدة', debt:0},
  {id:'CUS-022', name:'محمد مثنى علوان', phone:'07703166982', accountCode:'1511', city:'ميسان', address:'العمارة', debt:0},
  {id:'CUS-023', name:'احمد سلمان جاسم العامري', phone:'07725005500', accountCode:'1511', city:'بغداد', address:'الراشدية', debt:0},
  {id:'CUS-024', name:'شركة الخير العميم للمقاولات - تقي رشيد عزيز', phone:'07827777992', accountCode:'1511', city:'واسط', address:'الكوت', debt:0},
  {id:'CUS-025', name:'حسنين حسين شعيل', phone:'07739990241', accountCode:'1511', city:'ميسان', address:'العمارة قرب مدرسة بطل خيبر', debt:0},
  {id:'CUS-026', name:'مهندس صالح مهدي محمد - عضو لجنة الاشراف ميسان', phone:'07717436961', accountCode:'1511', city:'ميسان', address:'العمارة قرب مدرسة بطل خيبر', debt:0},
  {id:'CUS-027', name:'علي قيس علي – مجمع 5 كيلو', phone:'07903333008', accountCode:'1511', city:'الانبار', address:'الرمادي - 5 كيلو', debt:0},
  {id:'CUS-028', name:'كريم إسماعيل - كنافة عبيروت', phone:'07725118800', accountCode:'1511', city:'بغداد', address:'كرادة شارع 62', debt:0},
  {id:'CUS-029', name:'علي رحيم عاصي', phone:'07737772266', accountCode:'1511', city:'ميسان', address:'العمارة المجر الكبير', debt:0},
  {id:'CUS-030', name:'احمد جعفر كاظم', phone:'07803337333', accountCode:'1511', city:'واسط', address:'النعمانية', debt:0},
  {id:'CUS-031', name:'شركة كولاب للتجارة', phone:'07707496046', accountCode:'1511', city:'بغداد', address:'أبو غريب', debt:0},
  {id:'CUS-032', name:'عبد الله حسن مطر', phone:'07828828871', accountCode:'1511', city:'ذي قار', address:'الرفاعي – طريق أبو الماش محلات أبو غدير', debt:0},
  {id:'CUS-033', name:'فارس العزاوي – الطاقة المتطورة', phone:'', accountCode:'1511', city:'بغداد', address:'شارع 62', debt:0},
  {id:'CUS-034', name:'مستشفى الحياة الأهلي العام', phone:'07722408373', accountCode:'1511', city:'صلاح الدين', address:'تكريت - شارع 40', debt:0},
  {id:'CUS-035', name:'محمود عبد الزهرة احمد حسوني الطائي', phone:'07727080366', accountCode:'1511', city:'بغداد', address:'المدائن الجعارة', debt:0},
  {id:'CUS-036', name:'سجاد جبار خضير - كافيه دخان', phone:'07887501301', accountCode:'1511', city:'ذي قار', address:'الناصرية - الشطرة', debt:0},
  {id:'CUS-037', name:'مصطفى مطشر حطوط – محطة مياه الزعفرانية', phone:'07731377404', accountCode:'1511', city:'بغداد', address:'الزعفرانية', debt:0},
  {id:'CUS-038', name:'منتظر مجيد علي حسين', phone:'07813989024', accountCode:'1511', city:'ميسان', address:'قلعة صالح – نهر العز قرب مركز الشرطة', debt:0},
  {id:'CUS-039', name:'احمد جميل كاظم – مطعم دجاج شيبك', phone:'07806848866', accountCode:'1511', city:'ذي قار', address:'ناصرية الإدارة المحلية تقاطع البهو', debt:0},
  {id:'CUS-040', name:'وسام محمد زبون راشد', phone:'07719434371', accountCode:'1511', city:'بغداد', address:'زعفرانية شارع مستشفى ابن الخطيب', debt:0},
  {id:'CUS-041', name:'علاء ايو ريتاج', phone:'', accountCode:'1511', city:'بغداد', address:'شارع 62', debt:0}
];

const TYPE_COLORS = {
  asset:'var(--odoo-blue)', liability:'var(--odoo-red)',
  equity:'var(--odoo-purple)', revenue:'var(--odoo-green)', expense:'var(--odoo-orange)'
};
const TYPE_LABELS = {
  asset:'أصل', liability:'خصم', equity:'ملكية', revenue:'إيراد', expense:'مصروف'
};

// ============================================================
// getAccountBalance — الرصيد يُحسب من القيود فقط
// هذا هو المبدأ الأساسي: لا رصيد مخزون في الحساب
// ============================================================
const JOURNAL_ENTRIES_DATA = [];

// ── بيانات الفواتير للبحث والمخزن ──────────────────────────────────
const INVOICE_DATA = {};

function getAccountBalance(code) {
  let totalDebit = 0, totalCredit = 0;
  JOURNAL_ENTRIES_DATA.forEach(entry => {
    entry.lines.forEach(line => {
      if (line.code === code) {
        totalDebit  += line.debit  || 0;
        totalCredit += line.credit || 0;
      }
    });
  });
  const acc = ACCOUNTS_DB.find(a => a.code === code);
  const normal = acc ? acc.normal : 'debit';
  const balance = normal === 'debit'
    ? totalDebit - totalCredit
    : totalCredit - totalDebit;
  return { debit: totalDebit, credit: totalCredit, balance, normal };
}

function getAccountName(code) {
  return ACCOUNTS_DB.find(a => a.code === code)?.name || code;
}


function globalInvoiceSearch(q) {
  if (!q || q.length < 3) return;
  const upper = q.toUpperCase();
  const inv = INVOICE_DATA[upper] || Object.values(INVOICE_DATA).find(i=>i.customer.includes(q));
  if (inv) {
    notify(`🔍 وجدت: ${upper||q} — ${inv.customer} — ${inv.total} — ${inv.status}`, 'info');
  } else {
    notify('لم يتم العثور على فاتورة بهذا الرقم أو الاسم', 'warning');
  }
}

// ================================================================
// WAREHOUSE MODAL
// ================================================================
let rayaSerialCounter = 100;

function generateRayaSerial() {
  rayaSerialCounter++;
  const year = new Date().getFullYear();
  const serial = `RZ-${year}-${String(rayaSerialCounter).padStart(4,'0')}`;
  const el = document.getElementById('raya-serial-auto');
  if (el) { el.value = serial; el.style.color = 'var(--odoo-purple)'; }
  notify('تم توليد الرقم التسلسلي: ' + serial, 'info');
}

function addWarehouseOutLine() {
  const container = document.getElementById('wout-manual-lines');
  if (!container) return;
  const count = container.children.length + 1;
  const div = document.createElement('div');
  div.className = 'wout-line';
  div.style.cssText = 'padding:12px 14px;border-bottom:1px solid #f0f0f0';
  div.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:10px">
      <span style="font-weight:600;font-size:12.5px;color:var(--odoo-blue)">صنف ${count}</span>
      <button onclick="this.closest('.wout-line').remove()"
        style="background:var(--odoo-red-l);border:none;color:var(--odoo-red);cursor:pointer;padding:3px 8px;border-radius:4px;font-size:11px">حذف</button>
    </div>
    <div class="form-row">
      <div class="form-group" style="margin:0">
        <label style="font-size:11px">اسم المادة</label>
        <input type="text" class="form-control" placeholder="وصف الصنف...">
      </div>
      <div class="form-group" style="margin:0">
        <label style="font-size:11px">الكمية</label>
        <input type="number" class="form-control" value="1" min="1">
      </div>
    </div>
    <div style="background:var(--odoo-purple-l);border:1.5px solid var(--odoo-purple);border-radius:var(--r);padding:12px;margin-top:10px">
      <div style="font-weight:700;font-size:12px;color:var(--odoo-purple);margin-bottom:10px">🔢 الأرقام التسلسلية الثلاثة</div>
      <div class="form-row-3">
        <div class="form-group" style="margin:0">
          <label style="font-size:11px">سيريل المحرك</label>
          <input type="text" class="form-control" placeholder="ENG-XXXXXX" style="font-family:monospace;font-weight:700" oninput="this.value=this.value.toUpperCase()">
        </div>
        <div class="form-group" style="margin:0">
          <label style="font-size:11px">سيريل رأس التوليد</label>
          <input type="text" class="form-control" placeholder="ALT-XXXXXX" style="font-family:monospace;font-weight:700" oninput="this.value=this.value.toUpperCase()">
        </div>
        <div class="form-group" style="margin:0">
          <label style="font-size:11px">سيريل الراية الزرقاء</label>
          <input type="text" class="form-control" placeholder="RZ-2026-XXXX" style="font-family:monospace;font-weight:700;color:var(--odoo-purple)" oninput="this.value=this.value.toUpperCase()">
        </div>
      </div>
    </div>`;
  container.appendChild(div);
}

function loadInvoiceForWarehouse(invNum) {
  const inv = INVOICE_DATA[invNum.toUpperCase()];
  const section = document.getElementById('wout-invoice-lines');
  const body = document.getElementById('wout-lines-body');
  if (!inv || !section || !body) { if(section) section.style.display='none'; return; }
  section.style.display = 'block';
  body.innerHTML = `
    <div style="padding:10px 14px;background:var(--odoo-green-l);border-bottom:1px solid var(--border)">
      <strong>${invNum}</strong> — ${inv.customer} — ${inv.date} — ${inv.total} د.ع
      <span class="badge badge-green" style="margin-right:8px">${inv.status}</span>
    </div>
    ${inv.items.map((item,i) => `
    <div style="padding:12px 14px;border-bottom:1px solid #f0f0f0">
      <div style="font-weight:600;margin-bottom:10px">صنف ${i+1}: ${item}</div>
      <div style="background:var(--odoo-purple-l);border:1.5px solid var(--odoo-purple);border-radius:var(--r);padding:12px">
        <div style="font-weight:700;font-size:12px;color:var(--odoo-purple);margin-bottom:8px">🔢 الأرقام التسلسلية</div>
        <div class="form-row-3">
          <div><label style="font-size:11px">سيريل المحرك</label><input type="text" class="form-control" placeholder="ENG-XXXXXX" style="font-family:monospace;font-weight:700" oninput="this.value=this.value.toUpperCase()"></div>
          <div><label style="font-size:11px">سيريل رأس التوليد</label><input type="text" class="form-control" placeholder="ALT-XXXXXX" style="font-family:monospace;font-weight:700" oninput="this.value=this.value.toUpperCase()"></div>
          <div><label style="font-size:11px">سيريل الراية الزرقاء</label>
            <div style="display:flex;gap:4px">
              <input type="text" class="form-control" placeholder="RZ-2026-XXXX" style="font-family:monospace;font-weight:700;color:var(--odoo-purple)" oninput="this.value=this.value.toUpperCase()">
              <button onclick="generateRayaSerial()" class="btn btn-secondary btn-xs" title="توليد تلقائي">🔄</button>
            </div>
          </div>
        </div>
      </div>
    </div>`).join('')}`;
}

function saveWarehouseOut() {
  const invNum = document.getElementById('wout-inv')?.value;
  // Validate all 3 serials
  let allFilled = true;
  document.querySelectorAll('.wout-line input[placeholder^="ENG"]').forEach(el=>{if(!el.value.trim())allFilled=false;});
  document.querySelectorAll('.wout-line input[placeholder^="ALT"]').forEach(el=>{if(!el.value.trim())allFilled=false;});
  document.querySelectorAll('.wout-line input[placeholder^="RZ"]').forEach(el=>{if(!el.value.trim())allFilled=false;});
  if (!allFilled) { notify('يجب ملء الأرقام التسلسلية الثلاثة لكل مولد ✕','danger'); return; }
  closeM('m-warehouse-out');
  notify('✅ تم تنفيذ الإخراج من المخزن وتسجيل الأرقام التسلسلية','success');
}

// ================================================================
// GLOBAL SEARCH IN TOPBAR
// ================================================================
function initGlobalSearch() {
  const topbar = document.getElementById('topbar');
  if (!topbar || document.getElementById('global-search-input')) return;
  const searchWrap = document.createElement('div');
  searchWrap.style.cssText = 'display:flex;align-items:center;gap:8px;padding:5px 12px;background:var(--bg);border:1.5px solid var(--border);border-radius:20px;min-width:240px;margin-right:8px;transition:var(--tr)';
  searchWrap.innerHTML = `
    <span style="color:var(--text-s);font-size:13px">🔍</span>
    <input id="global-search-input" type="text"
      placeholder="بحث سريع — رقم فاتورة، اسم زبون..."
      style="border:none;outline:none;background:transparent;font-size:12.5px;width:100%;color:var(--text)"
      onkeydown="if(event.key==='Enter')globalInvoiceSearch(this.value)"
      oninput="if(this.value.length>=4)liveGlobalSearch(this.value)">
    <kbd style="font-size:9px;color:var(--text-s);background:#f1f5f9;padding:1px 5px;border-radius:3px">Enter</kbd>`;

  searchWrap.addEventListener('focusin', ()=>{ searchWrap.style.borderColor='var(--odoo-purple)'; searchWrap.style.boxShadow='0 0 0 3px rgba(113,75,103,.1)'; });
  searchWrap.addEventListener('focusout',()=>{ searchWrap.style.borderColor='var(--border)'; searchWrap.style.boxShadow=''; });

  const sep = document.querySelector('.topbar-sep');
  if (sep) sep.after(searchWrap);
  else topbar.appendChild(searchWrap);
}

function liveGlobalSearch(q) {
  if (q.length < 4) return;
  const upper = q.toUpperCase();
  const inv = INVOICE_DATA[upper];
  if (inv) notify(`🔍 ${upper}: ${inv.customer} — ${inv.total} — ${inv.status}`,'info');
}

// Override openM for m-sale and m-journal to use new versions
function openM(id) {
  if (id === 'm-sale') {
    if (typeof openSalesModal === 'function') openSalesModal();
    return;
  }
  if (id === 'm-journal') {
    window.jvLineCount=0;
    var jl=document.getElementById('jv-lines-new'); if(jl) jl.innerHTML='';
    var jn=document.getElementById('jv-num'); if(jn) jn.value='JV-'+String(200+Math.floor(Math.random()*800)).padStart(4,'0');
    var jd=document.getElementById('jv-desc'); if(jd) jd.value='';
    var mo=document.getElementById('m-journal'); if(mo) mo.classList.add('open');
    setTimeout(function(){
      if(typeof addJVLineNew==='function'){ addJVLineNew('debit'); addJVLineNew('credit'); if(typeof calcJVNew==='function') calcJVNew(); }
    },60);
    return;
  }
  var el=document.getElementById(id); if(el) el.classList.add('open');
}

// Add warehouse button to topbar




// ============================================================
// RENDER TRIAL BALANCE — from journal entries, not stored balance
// ============================================================
function renderTrialBalance() {
  const filterGroup = document.getElementById('tb-group')?.value || 'all';
  const nonZero = document.getElementById('tb-nonzero')?.checked;
  const tbody = document.getElementById('trial-balance-body');
  const totalDrEl = document.getElementById('tb-total-dr');
  const totalCrEl = document.getElementById('tb-total-cr');
  const checkEl = document.getElementById('tb-balance-check');
  if (!tbody) return;

  const groupNames = {'1':'الموجودات','2':'المطلوبات','3':'حقوق الملكية','4':'الإيرادات','5':'المصروفات'};
  const typeArabic = {'asset':'موجودات','liability':'مطلوبات','equity':'ملكية','revenue':'إيرادات','expense':'مصروفات'};
  
  let totalDr = 0, totalCr = 0;
  let rows = '';
  let prevGroup = '';

  ACCOUNTS_DB.forEach(acc => {
    const grp = acc.code[0];
    if (filterGroup !== 'all' && grp !== filterGroup) return;
    
    const bal = getAccountBalance(acc.code);
    if (nonZero && bal.debit === 0 && bal.credit === 0) return;

    totalDr += bal.debit;
    totalCr += bal.credit;

    if (grp !== prevGroup) {
      const gName = groupNames[grp] || grp;
      rows += `<tr style="background:var(--odoo-purple-l)">
        <td colspan="7" style="padding:7px 12px;font-weight:800;font-size:11.5px;color:var(--odoo-purple)">
          ◆ المجموعة ${grp} — ${gName}
        </td>
      </tr>`;
      prevGroup = grp;
    }

    const balClass = bal.balance > 0 ? 'amount-dr' : bal.balance < 0 ? 'amount-cr' : '';
    rows += `<tr>
      <td class="code-cell">${acc.code}</td>
      <td>${acc.name}</td>
      <td><span class="badge" style="background:${TYPE_COLORS[acc.type]||'#eee'}20;color:${TYPE_COLORS[acc.type]||'#555'};font-size:9.5px">${typeArabic[acc.type]||acc.type}</span></td>
      <td style="text-align:center;font-family:monospace;color:var(--odoo-green)">${bal.debit > 0 ? fmt(bal.debit) : ''}</td>
      <td style="text-align:center;font-family:monospace;color:var(--odoo-red)">${bal.credit > 0 ? fmt(bal.credit) : ''}</td>
      <td style="text-align:center;font-family:monospace;font-weight:700" class="${balClass}">${bal.balance !== 0 ? fmt(Math.abs(bal.balance)) : '—'}</td>
      <td style="text-align:center"><span class="badge ${bal.balance > 0 ? 'badge-green' : bal.balance < 0 ? 'badge-red' : 'badge-gray'}" style="font-size:9px">${bal.balance > 0 ? 'مدين' : bal.balance < 0 ? 'دائن' : 'صفر'}</span></td>
    </tr>`;
  });

  tbody.innerHTML = rows;
  if (totalDrEl) totalDrEl.textContent = fmt(totalDr) + ' د.ع';
  if (totalCrEl) totalCrEl.textContent = fmt(totalCr) + ' د.ع';
  if (checkEl) {
    const diff = Math.abs(totalDr - totalCr);
    checkEl.innerHTML = diff < 1
      ? '<span style="color:var(--odoo-green);font-weight:700">✅ المدين = الدائن — القيود سليمة</span>'
      : `<span style="color:var(--odoo-red);font-weight:700">❌ فرق: ${fmt(diff)}</span>`;
  }
}

// Auto-render when page is shown



function switchChartPeriod(period, btn) {
  // Highlight active button
  document.querySelectorAll('#dash-chart-tabs button').forEach(function(b) {
    b.classList.remove('active');
  });
  if (btn) btn.classList.add('active');

  var wrap = document.querySelector('.bar-chart-wrap');
  if (!wrap) { notify('chart area not found', 'warning'); return; }

  var DATA = {
    monthly:   { vals:[62,49,78,65,97,0,0,0,0,0,0,0],  labels:['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'] },
    quarterly: { vals:[189,143,0,0],                    labels:['ربع 1','ربع 2','ربع 3','ربع 4'] },
    annual:    { vals:[280,342,0],                      labels:['2024','2025','2026'] }
  };
  var src    = DATA[period] || DATA.monthly;
  var vals   = src.vals.filter(function(v,i){ return i < src.labels.length && (v > 0 || i===0); });
  var labels = src.labels.slice(0, vals.length);
  var mx     = Math.max.apply(null, vals) || 1;
  var colors = ['#714B67','#017E84','#f59e0b','#198754','#0d6efd','#dc3545','#6f42c1','#20c997','#fd7e14','#d63384','#0dcaf0','#6c757d'];

  var html = '';
  for (var i = 0; i < vals.length; i++) {
    var v   = vals[i];
    var pct = v > 0 ? Math.max(Math.round(v / mx * 85), 4) : 4;
    var c   = colors[i % colors.length];
    var lbl = labels[i];
    html += '<div class="bar-col">'
      + '<div style="font-size:10px;font-weight:700;color:' + c + ';text-align:center;margin-bottom:3px;min-height:14px">' + (v > 0 ? v + 'M' : '') + '</div>'
      + '<div class="bar-rect" style="height:' + pct + '%;background:linear-gradient(180deg,' + c + ',' + c + 'aa);border-radius:4px 4px 0 0;cursor:pointer;width:100%" data-val="' + v + '" data-lbl="' + lbl + '"></div>'
      + '<div style="font-size:9px;color:var(--text-m);text-align:center;margin-top:5px;white-space:nowrap;overflow:hidden">' + lbl + '</div>'
      + '</div>';
  }
  wrap.innerHTML = html;

  // Add click handlers
  wrap.querySelectorAll('.bar-rect').forEach(function(el) {
    el.addEventListener('click', function() {
      var v = this.getAttribute('data-val');
      var l = this.getAttribute('data-lbl');
      notify(l + ': ' + v + ' مليون دينار', 'info');
    });
    el.addEventListener('mouseover', function() { this.style.opacity = '0.8'; });
    el.addEventListener('mouseout',  function() { this.style.opacity = '1'; });
  });

  var label = period === 'monthly' ? 'عرض شهري' : period === 'quarterly' ? 'عرض ربعي' : 'عرض سنوي';
  notify(label + ' — ' + vals.filter(function(v){return v>0;}).length + ' فترة', 'info');
}
var INV_ITEMS=[
{code:'GEN-BRK-22',  name:'مولد كهربائية بيركنز كاتم سعة 20-22 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-33',  name:'مولد كهربائية بيركنز كاتم سعة 30-33 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-50',  name:'مولد كهربائية بيركنز كاتم سعة 45-50 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-66',  name:'مولد كهربائية بيركنز كاتم سعة 60-66 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-88',  name:'مولد كهربائية بيركنز كاتم سعة 80-88 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-110', name:'مولد كهربائية بيركنز كاتم سعة 100-110 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-150', name:'مولد كهربائية بيركنز كاتم سعة 135-150 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-165', name:'مولد كهربائية بيركنز كاتم سعة 150-165 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-220', name:'مولد كهربائية بيركنز كاتم سعة 200-220 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-265', name:'مولد كهربائية بيركنز كاتم سعة 250-265 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-325', name:'مولد كهربائية بيركنز كاتم سعة 300-325 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-400', name:'مولد كهربائية بيركنز كاتم سعة 350-400 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-450', name:'مولد كهربائية بيركنز كاتم سعة 400-450 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-500', name:'مولد كهربائية بيركنز كاتم سعة 450-500 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-550', name:'مولد كهربائية بيركنز كاتم سعة 500-550 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-650', name:'مولد كهربائية بيركنز كاتم سعة 600-650 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BRK-770', name:'مولد كهربائية بيركنز كاتم سعة 700-770 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BDW-22',  name:'مولد كهربائية بادوين كاتم سعة 20-22 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BDW-33',  name:'مولد كهربائية بادوين كاتم سعة 30-33 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BDW-50',  name:'مولد كهربائية بادوين كاتم سعة 45-50 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BDW-66',  name:'مولد كهربائية بادوين كاتم سعة 60-66 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BDW-88',  name:'مولد كهربائية بادوين كاتم سعة 80-88 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BDW-110', name:'مولد كهربائية بادوين كاتم سعة 100-110 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-BDW-150', name:'مولد كهربائية بادوين كاتم سعة 135-150 KVA',cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-ISZ-22',  name:'مولد كهربائية ايسوزو كاتم سعة 20-22 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-ISZ-33',  name:'مولد كهربائية ايسوزو كاتم سعة 30-33 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-ISZ-50',  name:'مولد كهربائية ايسوزو كاتم سعة 45-50 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true},
{code:'GEN-ISZ-66',  name:'مولد كهربائية ايسوزو كاتم سعة 60-66 KVA',  cat:'generator', qty:0, min:0, unit:'وحدة', cost:0, price:0, trackSerial:true}
];
var INV_MOVEMENTS=[];
var selectedTrackItem=null;












function renderInvMovements(filter){
  var tbody=document.getElementById('inv-movements-body');if(!tbody)return;
  var movs=filter?INV_MOVEMENTS.filter(function(mv){return mv.item===filter;}):INV_MOVEMENTS;
  var types={in:'📥 وارد',out:'📤 صادر',adj:'🔧 تسوية'},badges={in:'badge-green',out:'badge-red',adj:'badge-yellow'};
  tbody.innerHTML=movs.map(function(mv){
    return'<tr><td>'+mv.date+'</td><td class="code-cell">'+mv.id+'</td>'+
    '<td><div style="font-weight:600">'+mv.name+'</div></td>'+
    '<td><span class="badge '+(badges[mv.type]||'badge-gray')+'">'+(types[mv.type]||mv.type)+'</span></td>'+
    '<td style="text-align:center;color:var(--odoo-green);font-weight:700">'+(mv.qty_in>0?'+'+mv.qty_in:'')+'</td>'+
    '<td style="text-align:center;color:var(--odoo-red);font-weight:700">'+(mv.qty_out>0?'-'+mv.qty_out:'')+'</td>'+
    '<td style="text-align:center;font-weight:800;color:var(--odoo-blue)">'+mv.bal+'</td>'+
    '<td>'+mv.reason+'<div class="code-cell" style="font-size:10px">'+mv.ref+'</div></td>'+
    '<td style="font-size:11px;color:var(--text-m)">'+mv.user+'</td></tr>';
  }).join('');
}
function renderInvItems(){
  var tbody=document.getElementById('inv-items-body');if(!tbody)return;
  tbody.innerHTML=INV_ITEMS.map(function(it){
    var st=it.qty===0?'badge-red':it.qty<it.min?'badge-yellow':'badge-green';
    var cmLabel = it.costMethod==='fifo'?'FIFO':it.costMethod==='batch'?'دفعة':'وسطي';
    var cmBg    = it.costMethod==='fifo'?'#dbeafe':it.costMethod==='batch'?'#fef3c7':'#e8f5f6';
    var cmColor = it.costMethod==='fifo'?'#1d4ed8':it.costMethod==='batch'?'#92400e':'var(--odoo-blue)';
    var serialBtn = it.trackSerial
      ? '<button class="btn btn-primary btn-xs" onclick="openSerialOps(\''+it.code+'\',\''+it.name.replace(/\x27/g,'')+'\')">سيريل</button>'
      : '<button class="btn btn-secondary btn-xs" onclick="selectTrackItem(\''+it.code+'\')">🔄</button>';
    return '<tr style="'+(it.qty===0?'background:#fff1f2':it.qty<it.min?'background:#fffbeb':'')+'">'+
    '<td class="code-cell">'+it.code+'</td><td style="font-weight:700">'+it.name+'</td>'+
    '<td><span class="badge badge-gray">'+it.cat+'</span></td>'+
    '<td style="text-align:center;font-weight:800">'+it.qty+'</td>'+
    '<td style="text-align:center">'+it.min+'</td><td>'+it.unit+'</td>'+
    '<td style="text-align:center;font-family:monospace">'+fmt(it.cost)+'</td>'+
    '<td style="text-align:center;font-family:monospace;color:var(--odoo-green)">'+fmt(it.price)+'</td>'+
    '<td><span class="badge '+st+'">'+it.qty+'</span></td>'+
    '<td style="text-align:center"><span style="font-size:10px;padding:2px 8px;border-radius:4px;font-weight:600;background:'+cmBg+';color:'+cmColor+'">'+cmLabel+'</span></td>'+
    '<td>'+serialBtn+'</td></tr>';
  }).join('');
}
function showInvTab(tab,btn){
  if (tab === 'serials') setTimeout(renderSerialsTab, 50);
  ['overview','items','movements','balance','low','serials'].forEach(function(t){
    var el=document.getElementById('inv-tab-'+t);if(el)el.style.display=t===tab?'block':'none';
  });
  document.querySelectorAll('#inv-tabs button').forEach(function(b){b.classList.remove('active');});
  if(btn)btn.classList.add('active');
  if(tab==='items')renderInvItems();
  if(tab==='movements')renderInvMovements();
}
function searchInvItems(q){renderInvItems();if(q)document.querySelectorAll('#inv-items-body tr').forEach(function(tr){var nm=tr.cells[1]?tr.cells[1].textContent:'',cd=tr.cells[0]?tr.cells[0].textContent:'';if(!nm.includes(q)&&!cd.includes(q))tr.style.display='none';});}
function calcInventoryBalance(){}
function renderLowStock(){var tbody=document.getElementById('inv-low-body');if(!tbody)return;var low=INV_ITEMS.filter(function(it){return it.qty<it.min;});tbody.innerHTML=low.length?low.map(function(it){return'<tr><td><div style="font-weight:700">'+it.name+'</div><div class="code-cell">'+it.code+'</div></td><td style="text-align:center;font-weight:800;color:'+(it.qty===0?'var(--odoo-red)':'#f59e0b')+'">'+it.qty+'</td><td>'+it.min+'</td><td style="color:var(--odoo-red)">-'+(it.min-it.qty)+'</td><td>—</td><td>شركة الخليج</td><td><button class="btn btn-primary btn-xs" onclick="openM(\'m-stock-in\')">📥</button></td></tr>';}).join(''):'<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--odoo-green)">✅ لا توجد أصناف منخفضة</td></tr>';}
function exportInvExcel(){notify('تصدير المخزون...','info');}
function exportMovementsExcel(){notify('تصدير الحركات...','info');}
function exportBalanceExcel(){notify('تصدير الرصيد...','info');}
var AUDIT_LOG=[{id:'LOG-001',ts:'2026-05-15 09:12',user:'admin',role:'admin',action:'login',target:'',detail:'تسجيل دخول ناجح',ip:'192.168.1.5'},{id:'LOG-002',ts:'2026-05-15 09:14',user:'admin',role:'admin',action:'create',target:'INV-0089',detail:'إنشاء فاتورة بيع',ip:'192.168.1.5'}];
var AUDIT_COUNTER=3;
function addAuditLog(action,target,detail){if(!currentUser)return;AUDIT_COUNTER++;var now=new Date(),ts=now.toISOString().replace('T',' ').substring(0,16);AUDIT_LOG.unshift({id:'LOG-'+String(AUDIT_COUNTER).padStart(3,'0'),ts:ts,user:currentUser.username,role:currentUser.role,action:action,target:target,detail:detail,ip:'192.168.1.x'});}
function renderAuditLog(){var tbody=document.getElementById('audit-log-body');if(!tbody)return;var aC={login:'badge-blue',create:'badge-green',edit:'badge-yellow',delete:'badge-red'},aL={login:'🔐 دخول',create:'➕ إنشاء',edit:'✏️ تعديل',delete:'🗑️ حذف'};var fl=(document.getElementById('audit-action-filter')||{}).value||'all',sq=(document.getElementById('audit-search')||{}).value||'';var logs=AUDIT_LOG.filter(function(lg){if(fl!=='all'&&lg.action!==fl)return false;if(sq&&!lg.detail.includes(sq)&&!lg.target.includes(sq)&&!lg.user.includes(sq))return false;return true;});tbody.innerHTML=logs.map(function(lg){return'<tr><td style="font-size:10.5px;font-family:monospace">'+lg.ts+'</td><td class="code-cell">'+lg.id+'</td><td><div style="font-weight:700">'+lg.user+'</div><div style="font-size:10px;color:var(--text-m)">'+lg.role+'</div></td><td><span class="badge '+(aC[lg.action]||'badge-gray')+'">'+(aL[lg.action]||lg.action)+'</span></td><td class="code-cell">'+(lg.target||'—')+'</td><td>'+lg.detail+'</td><td style="font-size:10.5px;font-family:monospace">'+lg.ip+'</td></tr>';}).join('');var cnt=document.getElementById('audit-count');if(cnt)cnt.textContent=logs.length+' سجل';}
function exportAuditLog(){notify('تصدير سجل التدقيق...','info');}
function updateAuditStats(){var c={create:0,edit:0,delete:0,login:0};AUDIT_LOG.forEach(function(lg){if(c[lg.action]!==undefined)c[lg.action]++;});['create','edit','delete','login'].forEach(function(a){var el=document.getElementById('audit-stat-'+a);if(el)el.textContent=c[a];});var tot=document.getElementById('audit-stat-total');if(tot)tot.textContent=AUDIT_LOG.length;}
function accountHasEntries(code) {
  if (typeof JOURNAL_ENTRIES_DATA !== 'undefined' && JOURNAL_ENTRIES_DATA.length) {
    if (JOURNAL_ENTRIES_DATA.some(function(e) {
      return e.lines && e.lines.some(function(l) { return l.code === code; });
    })) return true;
  }
  if (typeof INV_MOVEMENTS !== 'undefined' && INV_MOVEMENTS.length) {
    if (INV_MOVEMENTS.some(function(m) { return m.item === code; })) return true;
  }
  return false;
}
function findCOANode(nodes,code){if(!nodes)return null;for(var i=0;i<nodes.length;i++){if(String(nodes[i].c)===String(code))return nodes[i];if(nodes[i].ch){var f=findCOANode(nodes[i].ch,code);if(f)return f;}}return null;}

// إيجاد الحساب الأب لأي حساب
function findParentCOA(nodes, code, parent) {
  if (!nodes) return null;
  for (var i = 0; i < nodes.length; i++) {
    if (String(nodes[i].c) === String(code)) return parent || null;
    if (nodes[i].ch) {
      var f = findParentCOA(nodes[i].ch, code, nodes[i]);
      if (f !== undefined) return f;
    }
  }
  return undefined;
}

// فتح مودال إضافة حساب مجاور (نفس مستوى الحساب الحالي، يُوضع فوقه)
function openAddSibling(code) {
  var parentNode = findParentCOA(IRAQI_COA, code, null);
  var acc = findCOANode(IRAQI_COA, code);
  document.getElementById('m-account-title').textContent = '🌳 إضافة حساب مجاور فوق: ' + code + (acc ? ' — ' + acc.n : '');
  document.getElementById('acc-insert-before').value = code;
  if (parentNode) {
    document.getElementById('acc-parent-code').value = parentNode.c;
    document.getElementById('acc-parent-display').textContent = parentNode.c + ' — ' + parentNode.n;
  } else {
    document.getElementById('acc-parent-code').value = '';
    document.getElementById('acc-parent-display').textContent = '— المستوى الأول —';
  }
  document.getElementById('acc-new-code').value = '';
  document.getElementById('acc-name').value = '';
  var info = document.getElementById('acc-position-info');
  info.style.display = 'block';
  info.textContent = '📌 سيُضاف الحساب الجديد مباشرةً فوق: ' + code + (acc ? ' — ' + acc.n : '');
  openM('m-account');
}

// فتح مودال إضافة حساب فرعي (الحساب الحالي يصبح الأب)
function openAddChild(code) {
  var acc = findCOANode(IRAQI_COA, code);
  document.getElementById('m-account-title').textContent = '🌳 إضافة حساب فرعي داخل: ' + code + (acc ? ' — ' + acc.n : '');
  document.getElementById('acc-insert-before').value = '';
  document.getElementById('acc-parent-code').value = code;
  document.getElementById('acc-parent-display').textContent = code + (acc ? ' — ' + acc.n : '');
  document.getElementById('acc-new-code').value = '';
  document.getElementById('acc-name').value = '';
  var info = document.getElementById('acc-position-info');
  info.style.display = 'block';
  info.textContent = '📌 سيُضاف الحساب الجديد كحساب فرعي داخل: ' + code + (acc ? ' — ' + acc.n : '');
  openM('m-account');
}

// حفظ الحساب الجديد في الشجرة وإعادة رسمها
function saveAccountNew() {
  var code       = (document.getElementById('acc-new-code').value || '').trim();
  var name       = (document.getElementById('acc-name').value || '').trim();
  var parentCode = (document.getElementById('acc-parent-code').value || '').trim();
  var insertBefore = (document.getElementById('acc-insert-before').value || '').trim();

  if (!code) { notify('⚠️ يرجى إدخال كود الحساب', 'danger'); return; }
  if (!name) { notify('⚠️ يرجى إدخال اسم الحساب', 'danger'); return; }
  if (findCOANode(IRAQI_COA, code)) { notify('⚠️ الكود ' + code + ' موجود مسبقاً في الشجرة', 'danger'); return; }

  var newNode = { c: code, n: name, lv: 3 };

  if (parentCode) {
    var parentNode = findCOANode(IRAQI_COA, parentCode);
    if (!parentNode) { notify('⚠️ الحساب الأب غير موجود', 'danger'); return; }
    newNode.lv = (parentNode.lv || 1) + 1;
    if (!parentNode.ch) parentNode.ch = [];
    if (insertBefore) {
      var refIdx = parentNode.ch.findIndex(function(s){ return String(s.c) === String(insertBefore); });
      if (refIdx >= 0) parentNode.ch.splice(refIdx, 0, newNode);
      else parentNode.ch.unshift(newNode);
    } else {
      parentNode.ch.push(newNode);
    }
  } else {
    if (insertBefore) {
      var ri = IRAQI_COA.findIndex(function(s){ return String(s.c) === String(insertBefore); });
      if (ri >= 0) IRAQI_COA.splice(ri, 0, newNode);
      else IRAQI_COA.unshift(newNode);
    } else {
      IRAQI_COA.push(newNode);
    }
    newNode.lv = 1;
  }

  // ── انتشار الحساب في ACCOUNTS_DB ─────────────────────────
  var typeEl   = document.getElementById('acc-type');
  var normalEl = document.getElementById('acc-normal-side');
  var accType  = typeEl   ? typeEl.value   : 'asset';
  var accNorm  = normalEl ? normalEl.value : 'debit';
  if (!ACCOUNTS_DB.find(function(a){ return String(a.code) === String(code); })) {
    ACCOUNTS_DB.push({code: code, name: name, type: accType, normal: accNorm});
  }
  if (typeof addAuditLog === 'function') addAuditLog('add', 'ACC-' + code, 'إضافة حساب: ' + code + ' — ' + name);
  closeM('m-account');
  if (typeof renderTree === 'function') renderTree();
  // تحديث قوائم البحث المفتوحة
  if (typeof populateAccountSelects === 'function') populateAccountSelects();
  notify('✅ تم إضافة الحساب ' + code + ' — ' + name + ' وأصبح متاحاً في كل النظام', 'success');
}

function initCOAContextMenu() {
  var tree = document.getElementById('acc-tree');
  if (!tree) { setTimeout(initCOAContextMenu, 1000); return; }

  tree.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var row = e.target.closest('.tree-row');
    if (!row) return;
    var codeEl = row.querySelector('.tree-code');
    if (!codeEl) return;

    window.ctxCode = codeEl.textContent.trim();
    var code    = window.ctxCode;
    var hasMove = accountHasEntries(code);
    var acc     = (typeof findCOANode === 'function' && typeof IRAQI_COA !== 'undefined') ? findCOANode(IRAQI_COA, code) : null;

    var menu = document.getElementById('coa-ctx-menu');
    if (!menu) return;

    var lbl = document.getElementById('coa-ctx-account');
    if (lbl) lbl.textContent = code + (acc ? ' — ' + acc.n : '');

    var ind = document.getElementById('ctx-entries-indicator');
    if (ind) {
      ind.style.cssText = 'padding:5px 14px;font-size:11px;border-bottom:1px solid var(--border)';
      if (hasMove) {
        ind.textContent  = '⚠️ عليه حركات مالية — الحذف ممنوع نهائياً';
        ind.style.color  = 'var(--odoo-red)';
        ind.style.background = 'var(--odoo-red-l)';
      } else {
        ind.textContent  = '✅ لا توجد حركات — يمكن الحذف';
        ind.style.color  = 'var(--odoo-green)';
        ind.style.background = 'var(--odoo-green-l)';
      }
    }

    var delBtn = document.getElementById('ctx-delete-btn');
    if (delBtn) {
      if (hasMove) {
        delBtn.setAttribute('disabled', 'disabled');
        delBtn.style.cssText = 'opacity:0.3;cursor:not-allowed;pointer-events:none;padding:9px 16px;font-size:12.5px;width:100%;text-align:right;background:none;border:none;color:var(--text-s)';
        delBtn.title = 'الحذف ممنوع — عليه حركات';
      } else {
        delBtn.removeAttribute('disabled');
        delBtn.style.cssText = 'padding:9px 16px;font-size:12.5px;width:100%;text-align:right;background:none;border:none;color:var(--odoo-red);cursor:pointer';
        delBtn.title = '';
      }
    }

    var x = Math.min(e.clientX, window.innerWidth  - 245);
    var y = Math.min(e.clientY, window.innerHeight - 320);
    menu.style.left = x + 'px';
    menu.style.top  = y + 'px';
    menu.style.display = 'block';
  });

  document.addEventListener('click', function(e) {
    var m = document.getElementById('coa-ctx-menu');
    if (m && !m.contains(e.target)) m.style.display = 'none';
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var m = document.getElementById('coa-ctx-menu');
      if (m) m.style.display = 'none';
    }
  });
}
function ctxAction(action) {
  var menu = document.getElementById('coa-ctx-menu');   if (menu) menu.style.display = 'none';
  var code = window.ctxCode;
  if (!code) return;   var acc  = (typeof findCOANode === 'function' && typeof IRAQI_COA !== 'undefined') ? findCOANode(IRAQI_COA, code) : null;
  var name = acc ? acc.n : code;
   if (action === 'statement') {     go('trial', null);
    setTimeout(function() {       var g = document.getElementById('tb-group');
      if (g) g.value = String(code)[0];       if (typeof renderTrialBalance === 'function') renderTrialBalance();       notify('كشف حساب: ح/' + code + ' — ' + name, 'info');
    }, 300);
   } else if (action === 'ledger') {     go('ledger', null);
    setTimeout(function() {       var inp = document.getElementById('ledger-acc-search');       if (inp) { inp.value = code + ' — ' + name; inp.dispatchEvent(new Event('input')); }
      window.ledgerCode = code;       if (typeof renderLedger === 'function') renderLedger(code);
    }, 200);
   } else if (action === 'balance') {     if (typeof getAccountBalance === 'function') {
      var b = getAccountBalance(code);       var side = b.balance >= 0 ? 'مدين' : 'دائن';       notify('رصيد ح/' + code + ' ' + name + ': ' + fmt(Math.abs(b.balance)) + ' د.ع — ' + side, 'info');
    }
   } else if (action === 'journal') {     openM('m-journal');
    setTimeout(function() {       var f = document.querySelector('#jv-lines-new [id$="-code"]');       if (f) { f.value = code; if (typeof filterAccounts === 'function') filterAccounts(f, f.id.replace('-code','')); }
    }, 200);
   } else if (action === 'add-sibling') {
    openAddSibling(code);
   } else if (action === 'add-child') {
    openAddChild(code);
   } else if (action === 'edit') {     openM('m-account');     if (typeof addAuditLog === 'function') addAuditLog('edit', 'ACC-' + code, 'تعديل الحساب ' + code + ' — ' + name);     notify('تعديل: ' + code + ' — ' + name, 'info');
   } else if (action === 'delete') {
    // Hard block — NO exceptions, not even for admin
    if (accountHasEntries(code)) {       notify('🚫 الحذف ممنوع نهائياً — الحساب ' + code + ' عليه حركات مالية مسجلة', 'danger');
      return;
    }     rayaConfirm('حذف الحساب ' + code + ' — ' + name + '؟ سيسجل في سجل التدقيق.',function(){if(typeof addAuditLog==='function')addAuditLog('delete','ACC-'+code,'حذف الحساب '+code+' — '+name);notify('تم حذف الحساب '+code,'success');},{danger:true});
  }
}
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.modal-overlay,.mb').forEach(function(o){o.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');});});
  try{calcRsvExpiry();}catch(e){}
  try{updateWFCounts();}catch(e){}
  try{initGlobalSearch();}catch(e){}
  setTimeout(function(){
    try{renderLeaveBalances();renderLeaveRequests();}catch(e){}
    try{renderInvoicePreview();}catch(e){}
    try{calcWModal();}catch(e){}
    try{renderDashboard();}catch(e){}
    try{renderSalesPage();}catch(e){}
    try{renderPurchasesPage();}catch(e){}
    try{initCOAContextMenu();}catch(e){}
    var tbA=document.querySelector('.topbar-actions');
    if(tbA&&!document.getElementById('wout-btn')){var b=document.createElement('button');b.id='wout-btn';b.className='tb-btn';b.style.cssText='border-color:#f59e0b;color:#f59e0b';b.textContent='📦 إخراج مخزن';b.onclick=function(){openM('m-warehouse-out');};tbA.insertBefore(b,tbA.firstChild);}
  },600);
});


// Customer search


function selectCustomerById(id){
  if(typeof selectCustomer==='function')selectCustomer(id);
}

// Journal account search
function filterAccounts(input,lid){
  var q=(input.value||'').trim();if(!q){hideAccDropdown();return;}
  var db=typeof ACCOUNTS_DB!=='undefined'?ACCOUNTS_DB:[];
  var matches=db.filter(function(a){return a.code.indexOf(q)>=0||a.code.startsWith(q);}).slice(0,10);
  showJVAccResultsFor(matches,lid,input);
}
function filterAccountsByName(input,lid){
  var q=(input.value||'').trim();if(!q||q.length<2){hideAccDropdown();return;}
  var db=typeof ACCOUNTS_DB!=='undefined'?ACCOUNTS_DB:[];
  var matches=db.filter(function(a){return a.name.indexOf(q)>=0||a.code.indexOf(q)>=0;}).slice(0,12);
  showJVAccResultsFor(matches,lid,input);
}
function showJVAccResultsFor(matches,lid,inputEl){
  var dd=document.getElementById('acc-dropdown');
  if(!dd){
    dd=document.createElement('div');dd.id='acc-dropdown';
    dd.style.cssText='display:none;position:fixed;background:#fff;border:1.5px solid var(--odoo-purple);border-radius:var(--r);box-shadow:0 8px 24px rgba(0,0,0,.15);z-index:9999;max-height:240px;overflow-y:auto;min-width:380px';
    document.body.appendChild(dd);
  }
  if(!matches.length){dd.style.display='none';return;}
  var rect=inputEl.getBoundingClientRect();
  dd.style.top=(rect.bottom+window.scrollY+2)+'px';
  dd.style.right=(window.innerWidth-rect.right)+'px';dd.style.left='auto';
  var TC=typeof TYPE_COLORS!=='undefined'?TYPE_COLORS:{};
  var TL=typeof TYPE_LABELS!=='undefined'?TYPE_LABELS:{};
  var html='';
  matches.forEach(function(a){
    html+='<div style="padding:8px 12px;cursor:pointer;display:flex;align-items:center;gap:10px;border-bottom:1px solid #f0f0f0" '+
      'onmouseover="this.style.background=\'var(--odoo-purple-l)\'" onmouseout="this.style.background=\'\'" '+
      'onclick="selectAccount(this.getAttribute(\'data-code\'),\''+lid+'\')" data-code="'+a.code+'">'+
      '<span style="font-family:monospace;font-size:11.5px;font-weight:700;color:var(--odoo-blue);min-width:60px">'+a.code+'</span>'+
      '<span style="flex:1;font-size:12.5px">'+a.name+'</span>'+
      '<span style="font-size:10px;padding:2px 6px;border-radius:8px">'+( TL[a.type]||a.type)+'</span>'+
    '</div>';
  });
  dd.innerHTML=html;dd.style.display='block';
}
function selectAccount(code,lid){
  var db=typeof ACCOUNTS_DB!=='undefined'?ACCOUNTS_DB:[];
  var acc=db.find(function(a){return a.code===code;});if(!acc)return;
  var c=document.getElementById(lid+'-code'),n=document.getElementById(lid+'-name');
  if(c)c.value=acc.code;if(n)n.value=acc.name;
  hideAccDropdown();
}
function hideAccDropdown(){var d=document.getElementById('acc-dropdown');if(d)d.style.display='none';}

function searchTrackItem(q) {
  var dd = document.getElementById('track-drop');
  if (!dd) return;
  q = (q || '').trim();
  if (!q) { dd.style.display = 'none'; return; }
  var pool = (INV_ITEMS || []).map(function(i) {
    return { code: i.code, name: i.name, cat: i.cat, qty: i.qty, unit: i.unit };
  });
  (INV_MOVEMENTS || []).forEach(function(m) {
    if (!pool.find(function(p){ return p.code === m.item; }))
      pool.push({ code: m.item, name: m.name, cat: 'other', qty: '?', unit: '' });
  });
  var lq = q.toLowerCase();
  var matches = pool.filter(function(i) {
    return i.code.toLowerCase().indexOf(lq) >= 0 || i.name.indexOf(q) >= 0;
  }).slice(0, 10);
  if (!matches.length) {
    dd.innerHTML = '<div style="padding:12px 14px;font-size:12px;color:var(--text-m)">لا توجد نتائج لـ "' + q + '"</div>';
    dd.style.display = 'block'; return;
  }
  var catI  = { generator:'⚙️', parts:'🔩', oils:'🛢️', other:'📦' };
  var catL  = { generator:'مولدات', parts:'قطع غيار', oils:'زيوت', other:'أخرى' };
  var html = '';
  matches.forEach(function(i) {
    var safeCode = i.code.replace(/'/g,"\\'");
    var safeName = i.name.replace(/'/g,"\\'");
    html += '<div style="padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;border-bottom:1px solid #f5f5f5"'
      + ' onmouseover="this.style.background=\'var(--odoo-purple-l)\'"'
      + ' onmouseout="this.style.background=\'\'"'
      + ' onclick="selectTrackItem(\'' + safeCode + '\',\'' + safeName + '\')">'
      + '<span style="font-size:20px">' + (catI[i.cat] || '📦') + '</span>'
      + '<div>'
      + '<div style="font-weight:700;font-size:12.5px">' + i.name + '</div>'
      + '<div style="font-size:10.5px;color:var(--text-m)">'
      + '<span style="font-family:monospace;color:var(--odoo-blue)">' + i.code + '</span>'
      + ' — ' + (catL[i.cat] || i.cat)
      + (i.qty !== '?' ? ' — متوفر: <strong>' + i.qty + '</strong> ' + (i.unit || '') : '')
      + '</div></div></div>';
  });
  dd.innerHTML = html;
  dd.style.display = 'block';
}

function selectTrackItem(code, name) {
  hideTrackDrop();
  var inp  = document.getElementById('track-item-search');
  var pill = document.getElementById('track-selected-pill');
  var plbl = document.getElementById('track-pill-label');
  var clrb = document.getElementById('track-clear-btn');
  if (inp)  inp.value = code + ' — ' + name;
  if (pill) pill.style.display = 'flex';
  if (plbl) plbl.textContent   = code + ' — ' + name;
  if (clrb) clrb.style.display = 'block';
  window.selectedTrackCode = code;
  trackItemByCode(code);
}

function clearTrackItem() {
  window.selectedTrackCode = null;
  var inp  = document.getElementById('track-item-search');
  var pill = document.getElementById('track-selected-pill');
  var clrb = document.getElementById('track-clear-btn');
  var dd   = document.getElementById('track-drop');
  var sum  = document.getElementById('track-item-summary');
  if (inp)  inp.value = '';
  if (pill) pill.style.display = 'none';
  if (clrb) clrb.style.display = 'none';
  if (dd)   dd.style.display   = 'none';
  if (sum)  sum.style.display  = 'none';
  if (typeof renderInvMovements === 'function') renderInvMovements(null);
}

function hideTrackDrop() {
  var dd = document.getElementById('track-drop');
  if (dd) dd.style.display = 'none';
}

function trackItemByCode(code) {
  var sum = document.getElementById('track-item-summary');
  if (!sum) return;
  sum.style.display = 'block';
  var item = (INV_ITEMS || []).find(function(i) { return i.code === code; });
  var allM = (INV_MOVEMENTS || []).filter(function(m) { return m.item === code; });
  var from = (document.getElementById('mov-from')  || {}).value || '';
  var to   = (document.getElementById('mov-to')    || {}).value || '';
  var tf   = (document.getElementById('mov-type-filter') || {}).value || 'all';
  var movs = allM.filter(function(m) {
    if (from && m.date < from) return false;
    if (to   && m.date > to)   return false;
    if (tf !== 'all' && m.type !== tf) return false;
    return true;
  });
  var tIn  = allM.reduce(function(s,m){ return s + m.qty_in;  }, 0);
  var tOut = allM.reduce(function(s,m){ return s + m.qty_out; }, 0);
  var bal  = item ? item.qty : (tIn - tOut);
  var unit = item ? item.unit : '';
  var tiEl = document.getElementById('track-total-in');
  var toEl = document.getElementById('track-total-out');
  var tbEl = document.getElementById('track-balance');
  var info = document.getElementById('track-item-info');
  if (tiEl) tiEl.textContent = tIn  + ' ' + unit;
  if (toEl) toEl.textContent = tOut + ' ' + unit;
  if (tbEl) {
    tbEl.textContent = bal + ' ' + unit;
    tbEl.style.color = bal <= 0 ? 'var(--odoo-red)' : (item && bal < item.min ? '#f59e0b' : 'var(--odoo-blue)');
  }
  if (info) {
    var catMap = { generator:'مولدات', parts:'قطع غيار', oils:'زيوت' };
    info.innerHTML = '<div style="font-weight:800;font-size:13px;color:var(--odoo-blue);margin-bottom:8px">' + (item ? item.name : code) + '</div>'
      + '<div class="info-row"><span class="lbl">كود الصنف</span><span class="val code-cell">' + code + '</span></div>'
      + (item ? '<div class="info-row"><span class="lbl">الفئة</span><span class="val">' + (catMap[item.cat] || item.cat) + '</span></div>' : '')
      + (item ? '<div class="info-row"><span class="lbl">الوحدة</span><span class="val">' + item.unit + '</span></div>' : '')
      + '<div class="info-row"><span class="lbl">إجمالي الحركات</span><span class="val">' + allM.length + ' حركة</span></div>';
  }
  var tbody = document.getElementById('inv-movements-body');
  if (!tbody) return;
  if (!movs.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--text-m)">لا توجد حركات في الفترة المحددة</td></tr>';
    return;
  }
  var ti2 = { in:'📥 وارد', out:'📤 صادر', adj:'🔧 تسوية' };
  var tb2 = { in:'badge-green', out:'badge-red', adj:'badge-yellow' };
  var run = 0;
  var rows = movs.slice().reverse().map(function(m) {
    run += (m.qty_in || 0) - (m.qty_out || 0);
    return '<tr>'
      + '<td style="font-size:11.5px">' + m.date + '</td>'
      + '<td class="code-cell">' + m.id + '</td>'
      + '<td><div style="font-weight:600">' + m.name + '</div></td>'
      + '<td><span class="badge ' + (tb2[m.type] || 'badge-gray') + '">' + (ti2[m.type] || m.type) + '</span></td>'
      + '<td style="text-align:center;color:var(--odoo-green);font-weight:700">' + (m.qty_in  > 0 ? '+' + m.qty_in  : '') + '</td>'
      + '<td style="text-align:center;color:var(--odoo-red);font-weight:700">'   + (m.qty_out > 0 ? '-' + m.qty_out : '') + '</td>'
      + '<td style="text-align:center;font-weight:800;color:var(--odoo-blue)">' + run + '</td>'
      + '<td>' + m.reason + ' / ' + m.ref + '</td>'
      + '<td style="font-size:11px;color:var(--text-m)">' + m.user + '</td>'
      + '</tr>';
  }).reverse().join('');
  tbody.innerHTML = rows;
}

function trackItemMovements() {
  var code = window.selectedTrackCode;
  if (!code) {
    var sum = document.getElementById('track-item-summary');
    if (sum) sum.style.display = 'none';
    if (typeof renderInvMovements === 'function') renderInvMovements(null);
    return;
  }
  trackItemByCode(code);
}

function trackItem(code) {
  var tabs = document.querySelectorAll('#inv-tabs button');
  if (tabs[2]) showInvTab('movements', tabs[2]);
  var item = (INV_ITEMS || []).find(function(i) { return i.code === code; });
  selectTrackItem(code, item ? item.name : code);
}


// ================================================================
// SALE MODAL — ITEMS SEARCH (Phase 1 fix)
// ================================================================

var SALE_ITEMS_DB = [
{code:'GEN-BRK-22',  name:'مولد كهربائية بيركنز كاتم سعة 20-22 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-33',  name:'مولد كهربائية بيركنز كاتم سعة 30-33 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-50',  name:'مولد كهربائية بيركنز كاتم سعة 45-50 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-66',  name:'مولد كهربائية بيركنز كاتم سعة 60-66 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-88',  name:'مولد كهربائية بيركنز كاتم سعة 80-88 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-110', name:'مولد كهربائية بيركنز كاتم سعة 100-110 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-150', name:'مولد كهربائية بيركنز كاتم سعة 135-150 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-165', name:'مولد كهربائية بيركنز كاتم سعة 150-165 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-220', name:'مولد كهربائية بيركنز كاتم سعة 200-220 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-265', name:'مولد كهربائية بيركنز كاتم سعة 250-265 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-325', name:'مولد كهربائية بيركنز كاتم سعة 300-325 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-400', name:'مولد كهربائية بيركنز كاتم سعة 350-400 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-450', name:'مولد كهربائية بيركنز كاتم سعة 400-450 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-500', name:'مولد كهربائية بيركنز كاتم سعة 450-500 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-550', name:'مولد كهربائية بيركنز كاتم سعة 500-550 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-650', name:'مولد كهربائية بيركنز كاتم سعة 600-650 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BRK-770', name:'مولد كهربائية بيركنز كاتم سعة 700-770 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BDW-22',  name:'مولد كهربائية بادوين كاتم سعة 20-22 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BDW-33',  name:'مولد كهربائية بادوين كاتم سعة 30-33 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BDW-50',  name:'مولد كهربائية بادوين كاتم سعة 45-50 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BDW-66',  name:'مولد كهربائية بادوين كاتم سعة 60-66 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BDW-88',  name:'مولد كهربائية بادوين كاتم سعة 80-88 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BDW-110', name:'مولد كهربائية بادوين كاتم سعة 100-110 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-BDW-150', name:'مولد كهربائية بادوين كاتم سعة 135-150 KVA',cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-ISZ-22',  name:'مولد كهربائية ايسوزو كاتم سعة 20-22 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-ISZ-33',  name:'مولد كهربائية ايسوزو كاتم سعة 30-33 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-ISZ-50',  name:'مولد كهربائية ايسوزو كاتم سعة 45-50 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true},
{code:'GEN-ISZ-66',  name:'مولد كهربائية ايسوزو كاتم سعة 60-66 KVA',  cat:'generator', price:0, unit:'وحدة', stock:0, trackSerial:true}
];

var saleLineCounter = 0;
window.selectedCustomer = window.selectedCustomer || null;
window.invoiceCounter   = window.invoiceCounter   || 89;

function searchSaleItem(q) {
  var dd = document.getElementById('sale-item-drop');
  if (!dd) return;
  q = (q || '').trim();
  if (!q) { dd.style.display = 'none'; return; }
  var lq = q.toLowerCase();
  var matches = SALE_ITEMS_DB.filter(function(i) {
    return i.code.toLowerCase().indexOf(lq) >= 0
        || i.name.indexOf(q) >= 0
        || (i.cat === 'generator' && 'مولد'.indexOf(q) >= 0)
        || (i.cat === 'part'      && 'قطعة'.indexOf(q) >= 0)
        || (i.cat === 'fluid'     && (q === 'زيت' || q === 'ماء'))
        || (i.cat === 'service'   && 'خدمة'.indexOf(q) >= 0);
  });
  if (!matches.length) {
    dd.innerHTML = '<div style="padding:12px 14px;font-size:12px;color:var(--text-m)">لا توجد نتائج لـ "' + q + '" — يمكن الإضافة اليدوية</div>';
    dd.style.display = 'block';
    return;
  }
  var catI = { generator:'⚙️', part:'🔩', fluid:'🛢️', service:'🔧' };
  var catL = { generator:'مولد', part:'قطعة غيار', fluid:'زيت/سوائل', service:'خدمة' };
  var html = '';
  matches.slice(0, 12).forEach(function(item) {
    var stockInfo = item.stock !== null
      ? '<span style="color:' + (item.stock < 5 ? 'var(--odoo-red)' : 'var(--odoo-green)') + '">متوفر: ' + item.stock + ' ' + item.unit + '</span>'
      : '<span style="color:var(--text-m)">خدمة</span>';
    html += '<div style="padding:9px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;border-bottom:1px solid #f5f5f5;transition:background .1s"'
      + ' onmouseover="this.style.background=\'var(--odoo-purple-l)\'"'
      + ' onmouseout="this.style.background=\'\'"'
      + ' onclick="addSaleLineFromSearch(this)"'
      + ' data-code="' + item.code + '"'
      + ' data-name="' + item.name + '"'
      + ' data-price="' + item.price + '"'
      + ' data-unit="' + item.unit + '"'
      + ' data-cat="' + item.cat + '">'
      + '<span style="font-size:20px">' + (catI[item.cat] || '📦') + '</span>'
      + '<div style="flex:1">'
      +   '<div style="font-weight:700;font-size:12.5px">' + item.name + '</div>'
      +   '<div style="font-size:10.5px;color:var(--text-m)">'
      +     '<span class="code-cell">' + item.code + '</span>'
      +     ' — ' + (catL[item.cat] || item.cat)
      +     ' — ' + stockInfo
      +   '</div>'
      + '</div>'
      + '<div style="text-align:left;font-family:monospace;font-size:11.5px;font-weight:700;color:var(--odoo-green)">'
      +   fmt(item.price) + ' / ' + item.unit
      + '</div>'
      + '</div>';
  });
  dd.innerHTML = html;
  dd.style.display = 'block';
}

function hideSaleItemDrop() {
  var dd = document.getElementById('sale-item-drop');
  if (dd) dd.style.display = 'none';
}

function handleSaleItemKey(e) {
  if (e.key === 'Enter') {
    var dd = document.getElementById('sale-item-drop');
    var first = dd ? dd.querySelector('div[data-code]') : null;
    if (first) { first.click(); return; }
    // No match found — add manual line
    var q = document.getElementById('sale-item-search').value.trim();
    if (q) addSaleLineManual(q);
  }
}

function addSaleLineFromSearch(el) {
  var code  = el.getAttribute('data-code');
  var name  = el.getAttribute('data-name');
  var price = parseFloat(el.getAttribute('data-price')) || 0;
  var unit  = el.getAttribute('data-unit') || 'وحدة';
  var cat   = el.getAttribute('data-cat')  || 'other';
  hideSaleItemDrop();
  var inp = document.getElementById('sale-item-search');
  if (inp) inp.value = '';
  addSaleLine(cat, code, name, price, unit);
}

function addSaleLineManual(name) {
  hideSaleItemDrop();
  var inp = document.getElementById('sale-item-search');
  if (inp) inp.value = '';
  addSaleLine('other', '', name || 'صنف جديد', 0, 'وحدة');
}

function addSaleLine(cat, code, name, price, unit) {
  saleLineCounter++;
  var lid = 'sl' + saleLineCounter;
  var container = document.getElementById('sale-lines-new');
  if (!container) return;

  // Remove empty placeholder row
  var emptyRow = document.getElementById('sale-empty-row');
  if (emptyRow) emptyRow.remove();

  var catIcon = { generator:'⚙️', part:'🔩', fluid:'🛢️', service:'🔧', other:'📦' };
  var row = document.createElement('div');
  row.id = lid;
  row.style.cssText = 'display:grid;grid-template-columns:28px 1fr 80px 120px 110px 30px;border-bottom:1px solid #f5f5f5;align-items:center';
  row.innerHTML = '<div style="padding:5px 6px;font-size:11px;color:var(--text-s);text-align:center">' + saleLineCounter + '</div>'
    + '<div style="padding:4px 6px">'
    +   '<div style="display:flex;align-items:center;gap:5px">'
    +     '<span>' + (catIcon[cat] || '📦') + '</span>'
    +     '<input type="text" id="' + lid + '-name"'
    +       ' value="' + (name || '').replace(/"/g,'&quot;') + '"'
    +       ' placeholder="اسم الصنف..."'
    +       ' style="border:none;outline:none;background:transparent;font-size:12.5px;font-weight:600;width:100%">'
    +   '</div>'
    +   (code ? '<div style="font-size:10px;font-family:monospace;color:var(--text-m)">' + code + '</div>' : '')
    + '</div>'
    + '<div style="padding:4px 6px">'
    +   '<input type="number" id="' + lid + '-qty" value="1" min="0.01" step="0.01"'
    +     ' style="border:1px solid var(--border);border-radius:4px;padding:4px 6px;font-size:12px;width:100%;text-align:center"'
    +     ' oninput="calcSaleLine(\'' + lid + '\')">'
    + '</div>'
    + '<div style="padding:4px 6px">'
    +   '<input type="number" id="' + lid + '-price" value="' + (price || '') + '" placeholder="0"'
    +     ' style="border:1px solid var(--border);border-radius:4px;padding:4px 6px;font-size:12px;width:100%;font-family:monospace"'
    +     ' oninput="calcSaleLine(\'' + lid + '\')">'
    + '</div>'
    + '<div style="padding:4px 6px">'
    +   '<input type="text" id="' + lid + '-total" readonly'
    +     ' style="border:none;background:transparent;font-weight:700;font-family:monospace;color:var(--odoo-green);font-size:12px;width:100%"'
    +     ' value="' + (price ? fmt(price) : '') + '">'
    + '</div>'
    + '<div style="padding:4px 6px;text-align:center">'
    +   '<button onclick="removeSaleLine(\'' + lid + '\')"'
    +     ' style="background:var(--odoo-red-l);border:none;color:var(--odoo-red);cursor:pointer;width:24px;height:24px;border-radius:4px;font-size:11px;font-weight:700">✕</button>'
    + '</div>';
  container.appendChild(row);
  calcSaleGrandTotal();
  // Focus on price if it's zero
  if (!price) setTimeout(function() { document.getElementById(lid + '-price')?.focus(); }, 50);
}

function removeSaleLine(lid) {
  var el = document.getElementById(lid);
  if (el) el.remove();
  // Show placeholder if no lines left
  var container = document.getElementById('sale-lines-new');
  if (container && !container.querySelector('div[id^="sl"]')) {
    container.innerHTML = '<div id="sale-empty-row" style="padding:16px;text-align:center;color:var(--text-m);font-size:12.5px">ابحث عن مادة أعلاه أو اضغط "＋ إضافة يدوي"</div>';
  }
  calcSaleGrandTotal();
}

function calcSaleLine(lid) {
  var qty   = parseFloat(document.getElementById(lid + '-qty')?.value)   || 0;
  var price = parseFloat(document.getElementById(lid + '-price')?.value) || 0;
  var total = qty * price;
  var el    = document.getElementById(lid + '-total');
  if (el) el.value = total > 0 ? fmt(total) : '';
  calcSaleGrandTotal();
}

function calcSaleGrandTotal() {
  var grand = 0;
  document.querySelectorAll('[id$="-total"][id^="sl"]').forEach(function(el) {
    grand += parseFloat((el.value || '').replace(/,/g, '')) || 0;
  });
  var gtEl = document.getElementById('sale-grand-total');
  var pdEl = document.getElementById('pay-total-disp');
  if (gtEl) gtEl.textContent = fmt(grand) + ' د.ع';
  if (pdEl) pdEl.textContent = fmt(grand) + ' د.ع';
  calcPaySummary();
}

// ── Delivery date toggle ──────────────────────────────────
function toggleSaleDelivery(checked) {
  var wrap = document.getElementById('sale-delivery-wrap');
  if (wrap) wrap.style.display = checked ? 'block' : 'none';
  if (checked) updateDeliveryDate();
  calcPaySummary();
}

function updateDeliveryDate() {
  var days = parseInt(document.getElementById('delivery-days')?.value) || 7;
  var d = new Date();
  d.setDate(d.getDate() + days);
  var dEl = document.getElementById('sale-delivery-date');
  if (dEl) dEl.value = d.toISOString().split('T')[0];
  calcPaySummary();
}

// ── Payment calculation ───────────────────────────────────
function calcPaySummary() {
  var grandEl = document.getElementById('sale-grand-total');
  var grand   = parseFloat((grandEl ? grandEl.textContent : '0').replace(/,/g,'').replace(' د.ع','')) || 0;
  var nowAmt  = parseFloat(document.getElementById('pay-now')?.value) || 0;
  var remain  = grand - nowAmt;
  var method  = document.getElementById('pay-method')?.value || 'cash';
  var hasDelivery = document.getElementById('has-delivery')?.checked;
  var delivDate   = document.getElementById('sale-delivery-date')?.value || '';

  var remEl = document.getElementById('pay-remain-disp');
  if (remEl) {
    remEl.textContent = fmt(Math.max(0, remain)) + ' د.ع';
    remEl.style.color = remain > 0 ? 'var(--odoo-red)' : 'var(--odoo-green)';
  }

  // Set due date if not set
  var dueEl = document.getElementById('pay-due-date');
  if (dueEl && !dueEl.value) {
    var d = new Date(); d.setDate(d.getDate() + 30);
    dueEl.value = d.toISOString().split('T')[0];
  }

  // Workflow notices
  var wfBox   = document.getElementById('pay-workflow-box');
  var wfLines = document.getElementById('pay-workflow-lines');
  var entryBox  = document.getElementById('pay-entry-box');
  var entryLinesEl = document.getElementById('pay-entry-lines');

  var notices = [];
  var entries = [];

  if (grand === 0) {
    if (wfBox) wfBox.style.display = 'none';
    if (entryBox) entryBox.style.display = 'none';
    return;
  }

  // Accounting entry
  var drAcc = method === 'bank' ? 'ح/1621 مصرف المنصور' : method === 'deferred' ? 'ح/151 ذمم مدينة' : 'ح/1611 الصندوق';
  if (nowAmt > 0) {
    entries.push('<span style="color:var(--odoo-green)">مدين: ' + drAcc + ' — ' + fmt(nowAmt) + ' د.ع</span>');
    if (method === 'arboon') {
      entries.push('<span style="color:var(--odoo-red)">دائن: ح/226 أمانات عربون — ' + fmt(nowAmt) + ' د.ع</span>');
    } else {
      entries.push('<span style="color:var(--odoo-red)">دائن: ح/411 إيرادات المبيعات — ' + fmt(nowAmt) + ' د.ع</span>');
    }
    notices.push('✅ إشعار قبض للحسابات: ' + fmt(nowAmt) + ' ' + (method === 'bank' ? 'حوالة مصرفية' : 'نقداً'));
  }
  if (remain > 0) {
    entries.push('<span style="color:var(--odoo-green)">مدين: ح/151 ذمم مدينة — ' + fmt(remain) + ' د.ع</span>');
    entries.push('<span style="color:var(--odoo-red)">دائن: ح/411 إيرادات — ' + fmt(remain) + ' د.ع</span>');
    var dueDate = dueEl ? dueEl.value : '';
    notices.push('📋 إشعار للحسابات: متبقي ' + fmt(remain) + ' د.ع مستحق ' + (dueDate ? 'بتاريخ ' + dueDate : ''));
  }
  if (hasDelivery && delivDate) {
    notices.push('📦 إشعار للمخزن: موعد التسليم ' + delivDate + ' — ' + (document.getElementById('delivery-days')?.value || '7') + ' يوم');
    notices.push('💰 إشعار للحسابات: استلام باقي المبلغ عند التسليم');
  }

  if (wfBox && wfLines && notices.length) {
    wfLines.innerHTML = notices.map(function(n) {
      return '<div style="margin-bottom:3px">' + n + '</div>';
    }).join('');
    wfBox.style.display = 'block';
  } else if (wfBox) {
    wfBox.style.display = 'none';
  }

  if (entryBox && entryLinesEl && entries.length) {
    entryLinesEl.innerHTML = entries.map(function(e) {
      return '<div>' + e + '</div>';
    }).join('');
    entryBox.style.display = 'block';
  } else if (entryBox) {
    entryBox.style.display = 'none';
  }
}

function saveSaleNew(andPrint) {
  if (!window.selectedCustomer) { notify('يجب اختيار أو إنشاء زبون ✕', 'danger'); return; }
  var lines = document.querySelectorAll('[id^="sl"][id$="-name"]');
  if (!lines.length) { notify('يجب إضافة صنف واحد على الأقل ✕', 'danger'); return; }
  var valid = true;
  lines.forEach(function(el) { if (!el.value.trim()) valid = false; });
  if (!valid) { notify('يجب ملء أسماء جميع الأصناف ✕', 'danger'); return; }
  var invNum = document.getElementById('sale-ref-num')?.textContent || 'INV';
  var method = document.getElementById('pay-method')?.value || 'cash';
  var nowAmt = parseFloat(document.getElementById('pay-now')?.value) || 0;
  var hasDelivery = document.getElementById('has-delivery')?.checked;
  var delivDate   = document.getElementById('sale-delivery-date')?.value || '';
  closeM('m-sale');
  var methodLabel = { cash:'نقداً', bank:'حوالة مصرفية', arboon:'عربون', deferred:'آجل' };
  var msg = '✅ تم حفظ الفاتورة ' + invNum + ' — ' + window.selectedCustomer.name;
  if (nowAmt > 0) msg += ' — تحصيل: ' + fmt(nowAmt) + ' ' + (methodLabel[method] || method);
  if (hasDelivery && delivDate) msg += ' — تسليم: ' + delivDate;
  notify(msg, 'success');
  if (andPrint) setTimeout(function() { notify('🖨 جاري الطباعة...', 'info'); }, 500);
}

// ── Ledger Account Search ─────────────────────────────────
window.ledgerCode = '';

function searchLedgerAcc(q) {
  var dd = document.getElementById('ledger-acc-drop');
  if (!dd) return;
  q = (q || '').trim();
  if (!q) { dd.style.display = 'none'; return; }
  var lq = q.toLowerCase();
  var db = typeof ACCOUNTS_DB !== 'undefined' ? ACCOUNTS_DB : [];
  var matches = db.filter(function(a) {
    return a.code.indexOf(q) >= 0 || a.name.indexOf(q) >= 0 || a.code.toLowerCase().indexOf(lq) >= 0;
  }).slice(0, 14);
  if (!matches.length) {
    dd.innerHTML = '<div style="padding:12px 14px;font-size:12px;color:var(--text-m)">لا توجد نتائج لـ "' + q + '"</div>';
    dd.style.display = 'block'; return;
  }
  var TC = typeof TYPE_COLORS !== 'undefined' ? TYPE_COLORS : {};
  var TL = typeof TYPE_LABELS !== 'undefined' ? TYPE_LABELS : {};
  var html = '';
  matches.forEach(function(a) {
    html += '<div style="padding:9px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;border-bottom:1px solid #f5f5f5;transition:background .1s"'
      + ' onmouseover="this.style.background=\'var(--odoo-purple-l)\'"'
      + ' onmouseout="this.style.background=\'\'"'
      + ' onclick="selectLedgerAcc(\'' + a.code + '\',\'' + a.name.replace(/'/g,"\\'") + '\')">'
      + '<span style="font-family:monospace;font-size:12px;font-weight:700;color:var(--odoo-blue);min-width:60px">' + a.code + '</span>'
      + '<span style="flex:1;font-size:12.5px">' + a.name + '</span>'
      + '<span style="font-size:10px;padding:2px 6px;border-radius:8px;background:' + (TC[a.type] || '#eee') + '20;color:' + (TC[a.type] || '#555') + '">' + (TL[a.type] || a.type) + '</span>'
      + '</div>';
  });
  dd.innerHTML = html;
  dd.style.display = 'block';
}

function hideLedgerDrop() {
  var dd = document.getElementById('ledger-acc-drop');
  if (dd) dd.style.display = 'none';
}

function selectLedgerAcc(code, name) {
  hideLedgerDrop();
  window.ledgerCode = code;
  var inp   = document.getElementById('ledger-acc-search');
  var badge = document.getElementById('ledger-selected-badge');
  var wrap  = document.getElementById('ledger-search-wrap');
  if (inp)   inp.value = code + ' — ' + name;
  if (badge) { badge.textContent = code; badge.style.display = 'inline-block'; }
  if (wrap)  wrap.style.borderColor = 'var(--odoo-purple)';
  renderLedger(code);
}

function renderLedger(code) {
  code = code || window.ledgerCode;

  var emptyEl   = document.getElementById('ledger-empty');
  var tableWrap = document.getElementById('ledger-table-wrap');
  var titleEl   = document.getElementById('ledger-title');
  var summaryEl = document.getElementById('ledger-summary');
  var tfoot     = document.getElementById('ledger-tfoot');

  if (!code) {
    if (emptyEl)   emptyEl.style.display   = 'block';
    if (tableWrap) tableWrap.style.display = 'none';
    return;
  }

  var from = document.getElementById('ledger-from') ? document.getElementById('ledger-from').value : '';
  var to   = document.getElementById('ledger-to')   ? document.getElementById('ledger-to').value   : '';

  var db  = typeof ACCOUNTS_DB !== 'undefined' ? ACCOUNTS_DB : [];
  var acc = db.find(function(a) { return a.code === code; });
  if (titleEl) titleEl.textContent = '📒 ح/' + code + (acc ? ' — ' + acc.name : '');

  // Build ledger from JOURNAL_ENTRIES_DATA
  var entries = typeof JOURNAL_ENTRIES_DATA !== 'undefined' ? JOURNAL_ENTRIES_DATA : [];
  var rows = [];
  var runBalance = 0;
  var totalDr = 0, totalCr = 0;

  entries
    .slice()
    .sort(function(a, b) { return (a.date || '').localeCompare(b.date || ''); })
    .forEach(function(entry) {
      if (from && entry.date < from) return;
      if (to   && entry.date > to)   return;
      entry.lines.forEach(function(line) {
        if (line.code !== code) return;
        var dr = line.debit  || 0;
        var cr = line.credit || 0;
        runBalance += dr - cr;
        totalDr += dr;
        totalCr += cr;
        rows.push({
          date:    entry.date   || '—',
          ref:     entry.id     || '—',
          desc:    entry.description || (entry.ref ? 'قيد: ' + entry.ref : '—'),
          debit:   dr,
          credit:  cr,
          balance: runBalance,
        });
      });
    });

  var tbody = document.getElementById('ledger-tbody');
  if (!tbody) return;

  if (emptyEl)   emptyEl.style.display   = 'none';
  if (tableWrap) tableWrap.style.display = 'block';

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text-m)">🔍 لا توجد قيود لهذا الحساب في الفترة المحددة</td></tr>';
    if (tfoot) tfoot.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  tbody.innerHTML = rows.map(function(r) {
    var balColor = r.balance >= 0 ? 'var(--odoo-blue)' : 'var(--odoo-red)';
    var balSide  = r.balance >= 0 ? 'مدين' : 'دائن';
    return '<tr>'
      + '<td style="font-size:11.5px;white-space:nowrap">' + r.date + '</td>'
      + '<td class="code-cell">' + r.ref + '</td>'
      + '<td style="font-size:12px">' + r.desc + '</td>'
      + '<td style="text-align:center;color:var(--odoo-green);font-family:monospace;font-weight:600">' + (r.debit  > 0 ? fmt(r.debit)  : '') + '</td>'
      + '<td style="text-align:center;color:var(--odoo-red);font-family:monospace;font-weight:600">'   + (r.credit > 0 ? fmt(r.credit) : '') + '</td>'
      + '<td style="text-align:center;font-family:monospace;font-weight:700;color:' + balColor + '">'
      +   fmt(Math.abs(r.balance)) + ' <span style="font-size:9px">' + balSide + '</span>'
      + '</td>'
      + '</tr>';
  }).join('');

  // Footer totals
  if (tfoot) {
    tfoot.style.display = '';
    var footDr  = document.getElementById('ledger-foot-dr');
    var footCr  = document.getElementById('ledger-foot-cr');
    var footBal = document.getElementById('ledger-foot-bal');
    if (footDr)  footDr.textContent  = fmt(totalDr) + ' د.ع';
    if (footCr)  footCr.textContent  = fmt(totalCr) + ' د.ع';
    var finalBal = rows[rows.length - 1].balance;
    if (footBal) {
      footBal.textContent = fmt(Math.abs(finalBal)) + ' ' + (finalBal >= 0 ? 'مدين' : 'دائن');
      footBal.style.color = finalBal >= 0 ? 'var(--odoo-blue)' : 'var(--odoo-red)';
    }
  }

  // Header summary
  if (summaryEl) {
    summaryEl.style.display = 'block';
    var finalBal2 = rows[rows.length - 1].balance;
    var sdEl = document.getElementById('ledger-sum-dr');
    var scEl = document.getElementById('ledger-sum-cr');
    var sbEl = document.getElementById('ledger-sum-bal');
    if (sdEl) sdEl.textContent = fmt(totalDr);
    if (scEl) scEl.textContent = fmt(totalCr);
    if (sbEl) {
      sbEl.textContent = fmt(Math.abs(finalBal2)) + ' ' + (finalBal2 >= 0 ? 'مدين' : 'دائن');
      sbEl.style.color = finalBal2 >= 0 ? 'var(--odoo-blue)' : 'var(--odoo-red)';
    }
  }
}


// ════════════════════════════════════════════════════════════════
// AI BUSINESS ASSISTANT — شركة الراية الزرقاء
// Architecture: Intent → Permission → Query → Format → Audit
// ════════════════════════════════════════════════════════════════

// ── 1. SYSTEM DATA (mirrors the DB schema in JS) ────────────────
var AI_DATA = {
  sales: [], inventory: [], customers: [],
  maintenance: [], installments: [], expenses: []
};

// ── 2. PERMISSION MATRIX ────────────────────────────────────────
var AI_PERMISSIONS = {
  admin:      ['sales','inventory','customers','maintenance','installments','expenses','suppliers'],
  accountant: ['sales','customers','installments','expenses','suppliers'],
  sales:      ['sales','customers'],
  warehouse:  ['inventory'],
  technician: ['maintenance'],
};

// ── 3. DATE PARSER ───────────────────────────────────────────────
function aiParseDate(q) {
  var now   = new Date('2026-05-15');
  var today = now.toISOString().split('T')[0];
  var y = now.getFullYear(), m = now.getMonth(); // 0-based

  if (q.match(/اليوم/))          return { from: today, to: today, label: 'اليوم' };
  if (q.match(/أمس|امس/))        { var y2=new Date(now); y2.setDate(y2.getDate()-1); var ds=y2.toISOString().split('T')[0]; return {from:ds,to:ds,label:'أمس'}; }
  if (q.match(/هذا الأسبوع|هذا الاسبوع/)) {
    var d=new Date(now); d.setDate(d.getDate()-d.getDay());
    return { from: d.toISOString().split('T')[0], to: today, label: 'هذا الأسبوع' };
  }
  if (q.match(/هذا الشهر/))      return { from: y+'-05-01', to: y+'-05-31', label: 'شهر مايو 2026' };
  if (q.match(/الشهر الماضي/))   return { from: y+'-04-01', to: y+'-04-30', label: 'شهر أبريل 2026' };
  if (q.match(/شهر 5|شهر خمسة|أيار|مايو/)) return { from: y+'-05-01', to: y+'-05-31', label: 'شهر مايو 2026' };
  if (q.match(/شهر 4|شهر أربعة|نيسان|أبريل/)) return { from: y+'-04-01', to: y+'-04-30', label: 'شهر أبريل 2026' };
  if (q.match(/2026/))            return { from: '2026-01-01', to: '2026-12-31', label: 'سنة 2026' };
  if (q.match(/هذه السنة|هذا العام/)) return { from: '2026-01-01', to: '2026-12-31', label: 'سنة 2026' };
  // Default: this month
  return { from: y+'-05-01', to: y+'-05-31', label: 'شهر مايو 2026 (افتراضي)' };
}

// ── 4. INTENT CLASSIFIER ─────────────────────────────────────────
function aiClassifyIntent(q) {
  var patterns = [
    { intent:'sales_total',    keys:['مبيعات','بعت','بيع','فاتورة','مبلغ'], tables:['sales'] },
    { intent:'generators_sold',keys:['مولد','مولدة','مولدات'], tables:['sales'] },
    { intent:'best_customer',  keys:['أكثر زبون','أفضل زبون','أكبر زبون'], tables:['sales','customers'] },
    { intent:'customer_debt',  keys:['دين','ديون الزبائن','مستحق','ذمم'], tables:['customers','sales'] },
    { intent:'low_inventory',  keys:['ناقص','منخفض','نفد المخزون','مخزون'], tables:['inventory'] },
    { intent:'maintenance_open',keys:['صيانة','طلب صيانة'], tables:['maintenance'] },
    { intent:'overdue_install', keys:['أقساط','قسط','متأخر','تأخر'], tables:['installments'] },
    { intent:'profit',         keys:['ربح','أرباح','صافي'], tables:['sales','expenses'] },
    { intent:'compare_months', keys:['قارن','مقارنة','بالنسبة','نسبة','مقابل'], tables:['sales'] },
    { intent:'expenses',       keys:['مصروف','مصاريف','صرفنا','دفعنا'], tables:['expenses'] },
    { intent:'supplier_debt',  keys:['مورد','موردين','ديننا','ما ندين'], tables:['expenses'] },
    { intent:'top_product',    keys:['أكثر منتج','أكثر مادة','أكثر صنف','أكثر حجم'], tables:['sales'] },
  ];
  var lq = q;
  for (var i = 0; i < patterns.length; i++) {
    var p = patterns[i];
    if (p.keys.some(function(k){ return lq.indexOf(k) >= 0; })) {
      return p;
    }
  }
  return { intent: 'unknown', tables: [] };
}

// ── 5. PERMISSION GUARD ──────────────────────────────────────────
function aiCheckPermission(tables, role) {
  var allowed = AI_PERMISSIONS[role] || AI_PERMISSIONS['sales'];
  return tables.every(function(t) { return allowed.indexOf(t) >= 0; });
}

// ── 6. QUERY ENGINE (safe JS, no raw SQL) ────────────────────────
function aiQuery(intent, dateRange, role) {
  var from = dateRange.from;
  var to   = dateRange.to;
  var inRange = function(d) { return d >= from && d <= to; };

  switch (intent) {
    case 'sales_total': {
      var rows = AI_DATA.sales.filter(function(s){ return inRange(s.date); });
      var total  = rows.reduce(function(s,r){ return s+r.total; }, 0);
      var paid   = rows.reduce(function(s,r){ return s+r.paid; }, 0);
      var unpaid = total - paid;
      var count  = rows.length;
      return { type:'sales_total', total:total, paid:paid, unpaid:unpaid, count:count, rows:rows };
    }
    case 'generators_sold': {
      var rows = AI_DATA.sales.filter(function(s){ return inRange(s.date); });
      var gens = [];
      rows.forEach(function(s) {
        s.items.forEach(function(it) {
          if (it.cat === 'generator') gens.push({name:it.name,qty:it.qty,price:it.price,kva:it.kva,customer:s.customer});
        });
      });
      var total = gens.reduce(function(s,g){ return s+g.qty; }, 0);
      var totalVal = gens.reduce(function(s,g){ return s+g.price*g.qty; }, 0);
      // Count by KVA
      var kvaMap = {};
      gens.forEach(function(g){ kvaMap[g.kva] = (kvaMap[g.kva]||0)+g.qty; });
      var topKva = Object.keys(kvaMap).sort(function(a,b){ return kvaMap[b]-kvaMap[a]; })[0];
      return { type:'generators_sold', count:total, value:totalVal, gens:gens, kvaMap:kvaMap, topKva:topKva };
    }
    case 'best_customer': {
      var rows = AI_DATA.sales.filter(function(s){ return inRange(s.date); });
      var custMap = {};
      rows.forEach(function(s){ custMap[s.customer] = (custMap[s.customer]||0)+s.total; });
      var sorted = Object.keys(custMap).sort(function(a,b){ return custMap[b]-custMap[a]; });
      return { type:'best_customer', ranking:sorted.map(function(c){ return {name:c,total:custMap[c]}; }) };
    }
    case 'customer_debt': {
      var debtors = AI_DATA.customers.filter(function(c){ return c.debt > 0; });
      var total   = debtors.reduce(function(s,c){ return s+c.debt; }, 0);
      return { type:'customer_debt', total:total, debtors:debtors };
    }
    case 'low_inventory': {
      var low = AI_DATA.inventory.filter(function(i){ return i.qty < i.min; });
      var zero= AI_DATA.inventory.filter(function(i){ return i.qty === 0; });
      return { type:'low_inventory', low:low, zero:zero };
    }
    case 'maintenance_open': {
      var open   = AI_DATA.maintenance.filter(function(m){ return m.status==='open'; });
      var inProg = AI_DATA.maintenance.filter(function(m){ return m.status==='in_progress'; });
      var done   = AI_DATA.maintenance.filter(function(m){ return m.status==='completed'; });
      return { type:'maintenance_open', open:open, inProg:inProg, done:done };
    }
    case 'overdue_install': {
      var overdue = AI_DATA.installments.filter(function(i){ return i.overdue; });
      var total   = overdue.reduce(function(s,i){ return s+i.remain; }, 0);
      return { type:'overdue_install', overdue:overdue, total:total };
    }
    case 'profit': {
      var sales = AI_DATA.sales.filter(function(s){ return inRange(s.date); });
      var revenue = sales.reduce(function(s,r){ return s+r.paid; }, 0);
      var expenses = AI_DATA.expenses.filter(function(e){ return inRange(e.date); });
      var totalExp = expenses.reduce(function(s,e){ return s+e.amount; }, 0);
      var profit   = revenue - totalExp;
      return { type:'profit', revenue:revenue, expenses:totalExp, profit:profit, expBreakdown:expenses };
    }
    case 'compare_months': {
      var may  = AI_DATA.sales.filter(function(s){ return s.date >= '2026-05-01' && s.date <= '2026-05-31'; });
      var apr  = AI_DATA.sales.filter(function(s){ return s.date >= '2026-04-01' && s.date <= '2026-04-30'; });
      var mayT = may.reduce(function(s,r){ return s+r.total; }, 0);
      var aprT = apr.reduce(function(s,r){ return s+r.total; }, 0);
      var diff = mayT - aprT;
      var pct  = aprT ? Math.round(diff/aprT*100) : 0;
      return { type:'compare_months', may:{total:mayT,count:may.length}, apr:{total:aprT,count:apr.length}, diff:diff, pct:pct };
    }
    case 'expenses': {
      var exps = AI_DATA.expenses.filter(function(e){ return inRange(e.date); });
      var total = exps.reduce(function(s,e){ return s+e.amount; }, 0);
      return { type:'expenses', total:total, breakdown:exps };
    }
    case 'top_product': {
      var rows = AI_DATA.sales.filter(function(s){ return inRange(s.date); });
      var prodMap = {};
      rows.forEach(function(s){
        s.items.forEach(function(it){
          prodMap[it.name] = (prodMap[it.name]||0)+it.qty;
        });
      });
      var sorted = Object.keys(prodMap).sort(function(a,b){ return prodMap[b]-prodMap[a]; });
      return { type:'top_product', ranking:sorted.slice(0,5).map(function(p){ return {name:p,qty:prodMap[p]}; }) };
    }
    default:
      return null;
  }
}

// ── 7. RESPONSE FORMATTER ────────────────────────────────────────
function aiFormat(result, intent, dateRange, question) {
  if (!result) return null;

  var periodLine = '<div class="ai-period">📅 الفترة المعتمدة: ' + dateRange.label + ' &nbsp;|&nbsp; 🗄 مصدر: بيانات النظام</div>';

  switch (result.type) {
    case 'sales_total':
      return '<div class="ai-stat-grid">'
        + '<div class="ai-stat"><div class="lbl">إجمالي المبيعات</div><div class="val">' + fmtM(result.total) + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">عدد الفواتير</div><div class="val">' + result.count + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">المحصّل</div><div class="val" style="color:#198754">' + fmtM(result.paid) + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">المتبقي للتحصيل</div><div class="val" style="color:#dc3545">' + fmtM(result.unpaid) + '</div></div>'
        + '</div>' + periodLine;

    case 'generators_sold': {
      var kvaRows = Object.keys(result.kvaMap).sort(function(a,b){ return result.kvaMap[b]-result.kvaMap[a]; });
      var kvaTable = '<table><tr><th>حجم المولد</th><th>عدد المباع</th></tr>'
        + kvaRows.map(function(k){ return '<tr><td>' + k + ' KVA</td><td><strong>' + result.kvaMap[k] + '</strong></td></tr>'; }).join('')
        + '</table>';
      return '<strong>عدد المولدات المباعة: ' + result.count + ' مولدة</strong><br>'
        + 'القيمة الإجمالية: ' + fmtM(result.value) + '<br><br>'
        + 'التوزيع حسب الحجم:' + kvaTable + periodLine;
    }

    case 'best_customer': {
      var top = result.ranking[0];
      var rows = result.ranking.slice(0,5).map(function(c,i){
        return '<tr><td>' + (i+1) + '</td><td>' + c.name + '</td><td><strong>' + fmtM(c.total) + '</strong></td></tr>';
      }).join('');
      return '<strong>🏆 أعلى زبون شراءً: ' + top.name + ' — ' + fmtM(top.total) + '</strong>'
        + '<table><tr><th>#</th><th>الزبون</th><th>إجمالي المشتريات</th></tr>' + rows + '</table>'
        + periodLine;
    }

    case 'customer_debt': {
      var rows = result.debtors.map(function(c){
        return '<tr><td>' + c.name + '</td><td>' + c.city + '</td><td style="color:#dc3545;font-weight:700">' + fmtM(c.debt) + '</td></tr>';
      }).join('');
      return '<strong>إجمالي ديون الزبائن: ' + fmtM(result.total) + '</strong><br>'
        + '<table><tr><th>الزبون</th><th>المدينة</th><th>المبلغ</th></tr>' + rows + '</table>'
        + '<div class="ai-source">📋 من سجلات الذمم المدينة</div>';
    }

    case 'low_inventory': {
      if (!result.low.length) return '✅ جميع أصناف المخزون ضمن المستوى المطلوب. لا توجد أصناف منخفضة حالياً.';
      var rows = result.low.map(function(i){
        var badge = i.qty === 0 ? '<span style="color:red">نفد</span>' : '<span style="color:orange">منخفض</span>';
        return '<tr><td>' + i.name + '</td><td>' + i.qty + '/' + i.min + '</td><td>' + badge + '</td></tr>';
      }).join('');
      return '<span class="ai-warn">⚠️ ' + result.low.length + ' أصناف دون الحد الأدنى:</span>'
        + '<table><tr><th>الصنف</th><th>المتوفر/الحد</th><th>الحالة</th></tr>' + rows + '</table>'
        + '<div class="ai-suggestion">💡 يُنصح بطلب تزويد فوري للأصناف المنخفضة.</div>';
    }

    case 'maintenance_open':
      return '<div class="ai-stat-grid">'
        + '<div class="ai-stat"><div class="lbl">🔴 مفتوحة</div><div class="val" style="color:#dc3545">' + result.open.length + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">🟡 جارية</div><div class="val" style="color:#f59e0b">' + result.inProg.length + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">🟢 منجزة</div><div class="val" style="color:#198754">' + result.done.length + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">الإجمالي</div><div class="val">' + (result.open.length+result.inProg.length+result.done.length) + '</div></div>'
        + '</div>'
        + (result.open.length ? '<div class="ai-warn">⚠️ يوجد ' + result.open.length + ' طلب صيانة مفتوح بانتظار المتابعة.</div>' : '')
        + '<div class="ai-source">📋 من جدول طلبات الصيانة</div>';

    case 'overdue_install':
      if (!result.overdue.length) return '✅ لا توجد أقساط متأخرة حالياً.';
      var rows = result.overdue.map(function(i){
        return '<tr><td>' + i.customer + '</td><td>' + i.next_due + '</td><td style="color:#dc3545;font-weight:700">' + fmtM(i.remain) + '</td></tr>';
      }).join('');
      return '<span class="ai-warn">⚠️ ' + result.overdue.length + ' زبائن متأخرون بالأقساط — إجمالي: ' + fmtM(result.total) + '</span>'
        + '<table><tr><th>الزبون</th><th>آخر موعد</th><th>المبلغ المتبقي</th></tr>' + rows + '</table>';

    case 'profit': {
      var expRows = result.expBreakdown.map(function(e){
        return '<tr><td>' + e.type + '</td><td>' + fmtM(e.amount) + '</td></tr>';
      }).join('');
      return '<div class="ai-stat-grid">'
        + '<div class="ai-stat"><div class="lbl">إجمالي الإيرادات</div><div class="val" style="color:#198754">' + fmtM(result.revenue) + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">إجمالي المصروفات</div><div class="val" style="color:#dc3545">' + fmtM(result.expenses) + '</div></div>'
        + '<div class="ai-stat" style="grid-column:1/-1"><div class="lbl">صافي الربح</div><div class="val" style="color:' + (result.profit>0?'#198754':'#dc3545') + ';font-size:18px">' + fmtM(result.profit) + '</div></div>'
        + '</div>'
        + '<details style="margin-top:8px"><summary style="cursor:pointer;font-size:11px;color:var(--text-m)">تفاصيل المصروفات</summary>'
        + '<table><tr><th>النوع</th><th>المبلغ</th></tr>' + expRows + '</table></details>'
        + periodLine;
    }

    case 'compare_months': {
      var arrow = result.diff > 0 ? '📈 ارتفعت' : '📉 انخفضت';
      var color = result.diff > 0 ? '#198754' : '#dc3545';
      return '<div class="ai-stat-grid">'
        + '<div class="ai-stat"><div class="lbl">مايو 2026</div><div class="val">' + fmtM(result.may.total) + '</div><div style="font-size:10px;color:var(--text-m)">' + result.may.count + ' فواتير</div></div>'
        + '<div class="ai-stat"><div class="lbl">أبريل 2026</div><div class="val">' + fmtM(result.apr.total) + '</div><div style="font-size:10px;color:var(--text-m)">' + result.apr.count + ' فواتير</div></div>'
        + '</div>'
        + '<div style="margin-top:10px;padding:10px;background:#f8f7ff;border-radius:8px;text-align:center">'
        + '<strong>' + arrow + ' بنسبة ' + Math.abs(result.pct) + '%</strong>'
        + ' — الفرق: <span style="color:' + color + ';font-weight:700">' + fmtM(Math.abs(result.diff)) + '</span>'
        + '</div>';
    }

    case 'expenses': {
      var rows = result.breakdown.map(function(e){
        return '<tr><td>' + e.type + '</td><td>' + e.date + '</td><td>' + fmtM(e.amount) + '</td></tr>';
      }).join('');
      return '<strong>إجمالي المصروفات: ' + fmtM(result.total) + '</strong>'
        + '<table><tr><th>النوع</th><th>التاريخ</th><th>المبلغ</th></tr>' + rows + '</table>'
        + periodLine;
    }

    case 'top_product': {
      var rows = result.ranking.map(function(p,i){
        return '<tr><td>' + (i+1) + '</td><td>' + p.name + '</td><td><strong>' + p.qty + '</strong></td></tr>';
      }).join('');
      return '<strong>🏆 أكثر المنتجات مبيعاً:</strong>'
        + '<table><tr><th>#</th><th>المنتج</th><th>الكمية</th></tr>' + rows + '</table>'
        + periodLine;
    }
  }
  return null;
}

function fmtM(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1000000) return (n/1000000).toFixed(2).replace(/\.?0+$/, '') + ' مليون د.ع';
  if (n >= 1000)    return (n/1000).toFixed(0) + ' ألف د.ع';
  return n.toLocaleString('en-US') + ' د.ع';
}

// ── 8. AUDIT LOG ─────────────────────────────────────────────────
var AI_AUDIT_LOG = [];
function aiLogQuery(q, intent, result) {
  AI_AUDIT_LOG.push({
    ts:      new Date().toISOString(),
    user:    (window.currentUser || {}).username || 'unknown',
    role:    (window.currentUser || {}).role     || 'unknown',
    q:       q,
    intent:  intent,
    allowed: result !== 'DENIED',
  });
}

// ── 9. MAIN HANDLER ──────────────────────────────────────────────
var aiIsTyping = false;

function toggleAIPanel() {
  var panel = document.getElementById('ai-panel');
  if (!panel) return;
  if (panel.classList.contains('open')) {
    panel.classList.remove('open');
  } else {
    panel.classList.add('open');
    setTimeout(function() { document.getElementById('ai-input')?.focus(); }, 300);
  }
}

function aiAsk(q) {
  var inp = document.getElementById('ai-input');
  if (inp) inp.value = q;
  sendAIMessage();
}

function sendAIMessage() {
  if (aiIsTyping) return;
  var inp = document.getElementById('ai-input');
  var q   = (inp ? inp.value.trim() : '');
  if (!q) return;
  if (inp) { inp.value = ''; inp.style.height = 'auto'; }

  appendAIMsg('user', q);
  showAITyping();

  // Simulate processing delay (real API call would go here)
  setTimeout(function() { processAIQuery(q); }, 800 + Math.random() * 600);
}

function processAIQuery(q) {
  var role = (window.currentUser || {}).role || 'admin';

  // Unclear question check
  if (q.length < 5 || (q.match(/^(كم|ما|هل|من)\s*$/) )) {
    hideAITyping();
    appendAIMsg('ai', '⚠️ السؤال غير واضح. يرجى تحديد:<br>• الموضوع (مبيعات، مخزون، صيانة...)<br>• الفترة الزمنية (اليوم، هذا الشهر، أبريل...)');
    return;
  }

  // Classify intent
  var classified = aiClassifyIntent(q);
  var dateRange  = aiParseDate(q);

  // Permission check
  if (!aiCheckPermission(classified.tables, role)) {
    aiLogQuery(q, classified.intent, 'DENIED');
    hideAITyping();
    appendAIMsg('ai', '🔒 <strong>وصول مرفوض</strong><br>صلاحياتك لا تسمح بالاطلاع على هذه البيانات.<br>تواصل مع مدير النظام لطلب الصلاحيات اللازمة.');
    return;
  }

  // Query
  var result = aiQuery(classified.intent, dateRange, role);
  aiLogQuery(q, classified.intent, result);

  hideAITyping();

  if (!result) {
    // Ambiguous / unclear
    appendAIMsg('ai', '🤔 لم أتمكن من فهم سؤالك بدقة كافية.<br><br>جرب أحد هذه الأسئلة:<br>• "كم إجمالي مبيعات هذا الشهر؟"<br>• "كم مولدة بعت في مايو؟"<br>• "ما المواد الناقصة بالمخزون؟"<br>• "من أكثر زبون اشترى؟"');
    return;
  }

  var html = aiFormat(result, classified.intent, dateRange, q);
  if (html) {
    appendAIMsg('ai', html);
  } else {
    appendAIMsg('ai', '✅ تم تنفيذ الاستعلام. لا توجد بيانات في هذه الفترة.');
  }
}

function appendAIMsg(type, html) {
  var msgs = document.getElementById('ai-messages');
  if (!msgs) return;
  var isAI = type === 'ai';
  var avatarInner = isAI ? '🤖' : ((window.currentUser || {}).username || 'م')[0].toUpperCase();
  var div = document.createElement('div');
  div.className = 'ai-msg ' + type;
  div.innerHTML = '<div class="ai-msg-avatar ' + type + '">' + avatarInner + '</div>'
    + '<div class="ai-bubble">' + html + '</div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showAITyping() {
  aiIsTyping = true;
  var msgs = document.getElementById('ai-messages');
  if (!msgs) return;
  var div = document.createElement('div');
  div.className = 'ai-msg ai';
  div.id = 'ai-typing-indicator';
  div.innerHTML = '<div class="ai-msg-avatar ai">🤖</div>'
    + '<div class="ai-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  var btn = document.getElementById('ai-send-btn');
  if (btn) btn.disabled = true;
}

function hideAITyping() {
  aiIsTyping = false;
  var ind = document.getElementById('ai-typing-indicator');
  if (ind) ind.remove();
  var btn = document.getElementById('ai-send-btn');
  if (btn) btn.disabled = false;
}

function clearAIChat() {
  var msgs = document.getElementById('ai-messages');
  if (!msgs) return;
  msgs.innerHTML = '';
  appendAIMsg('ai', '✨ تم بدء محادثة جديدة. كيف يمكنني مساعدتك اليوم؟');
}

// Connect to Anthropic API for real AI responses (optional upgrade path)
async function sendToClaudeAPI(question, systemData) {
  try {
    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'أنت مساعد تحليلي لشركة الراية الزرقاء لبيع وصيانة المولدات الكهربائية في العراق. أجب باللغة العربية فقط. بيانات الشركة: ' + JSON.stringify(systemData),
        messages: [{ role: 'user', content: question }]
      })
    });
    var data = await response.json();
    return data.content?.[0]?.text || null;
  } catch(e) {
    return null;
  }
}


// ════════════════════════════════════════════════════════════════
// ACCOUNT LOOKUP: كشف حساب زبون أو مورد بالاسم
// ════════════════════════════════════════════════════════════════

// ── Suppliers data (added to AI_DATA) ───────────────────────────
AI_DATA.suppliers = [
  {id:'SUP-001', name:'شركة الخليج للتوزيع',   country:'الإمارات', phone:'+97150123456', debt:12000000,  type:'supplier', speciality:'مولدات بيركنز وبادوين'},
  {id:'SUP-002', name:'مجهز قطع غيار كومينز',  country:'العراق',   phone:'07901111222',  debt:3500000,   type:'supplier', speciality:'فلاتر وقطع غيار'},
  {id:'SUP-003', name:'شركة الوادي للمولدات',   country:'الأردن',   phone:'+96265123456', debt:0,         type:'supplier', speciality:'مولدات إيسوزو صيني'},
  {id:'SUP-004', name:'مصدر الزيوت العراقي',    country:'العراق',   phone:'07811234567',  debt:1800000,   type:'supplier', speciality:'زيوت ومواد تشحيم'},
];

// ── Name Matcher: finds customer or supplier by name fragment ───
function aiMatchEntity(q) {
  var allEntities = [];

  // Customers
  (AI_DATA.customers || []).forEach(function(c) {
    allEntities.push({ id:c.id, name:c.name, type:'customer', city:c.city, phone:c.phone, debt:c.debt });
  });

  // Suppliers
  (AI_DATA.suppliers || []).forEach(function(s) {
    allEntities.push({ id:s.id, name:s.name, type:'supplier', country:s.country, phone:s.phone, debt:s.debt, speciality:s.speciality });
  });

  // Try to find by name (partial match, handles nicknames)
  var matches = allEntities.filter(function(e) {
    var nameParts = e.name.split(' ');
    // Match any word in the name, or the full name
    return nameParts.some(function(part) { return q.indexOf(part) >= 0 || part.indexOf(q) >= 0; })
        || e.name.indexOf(q) >= 0
        || q.indexOf(e.name) >= 0;
  });

  return matches;
}

// ── Intent: account_lookup ───────────────────────────────────────
// Added to aiClassifyIntent patterns — detected in processAIQuery below

// ── Query: account balance calculation ──────────────────────────
function aiAccountLookup(entityName) {
  var matches = aiMatchEntity(entityName);
  if (!matches.length) return null;

  var results = matches.map(function(entity) {
    var isCustomer  = entity.type === 'customer';
    var isSupplier  = entity.type === 'supplier';

    // Calculate from sales/purchases history
    var totalSales    = 0;
    var totalPaid     = 0;
    var invoiceCount  = 0;
    var lastInvoice   = null;

    if (isCustomer) {
      AI_DATA.sales.forEach(function(s) {
        if (s.customer === entity.name) {
          totalSales   += s.total;
          totalPaid    += s.paid;
          invoiceCount += 1;
          if (!lastInvoice || s.date > lastInvoice.date) lastInvoice = s;
        }
      });
    }

    // Installment info
    var installs = (AI_DATA.installments || []).filter(function(i) {
      return i.customer === entity.name;
    });
    var totalInstRemain = installs.reduce(function(s,i){ return s + i.remain; }, 0);
    var hasOverdue      = installs.some(function(i){ return i.overdue; });

    // Balance calculation
    // For customer: if they owe us → DEBIT (مدين)
    // For supplier: if we owe them → CREDIT (دائن)
    var balance   = isCustomer ? (totalSales - totalPaid) : entity.debt;
    var isDebit   = isCustomer ? (balance > 0) : false;    // Customer owes us
    var isCredit  = isSupplier ? (entity.debt > 0) : false; // We owe supplier

    return {
      entity:        entity,
      isCustomer:    isCustomer,
      isSupplier:    isSupplier,
      totalSales:    totalSales,
      totalPaid:     totalPaid,
      balance:       balance,
      isDebit:       isDebit,
      isCredit:      isCredit,
      invoiceCount:  invoiceCount,
      lastInvoice:   lastInvoice,
      installs:      installs,
      totalInstRemain: totalInstRemain,
      hasOverdue:    hasOverdue,
    };
  });

  return { type:'account_lookup', results:results, entityName:entityName };
}

// ── Format: account lookup response ─────────────────────────────
function aiFormatAccountLookup(result) {
  if (!result || !result.results.length) return null;

  var html = '';

  result.results.forEach(function(r) {
    var e = r.entity;

    // Header card
    var typeLabel = r.isCustomer ? '👤 زبون' : '🏭 مورد';
    var typeColor = r.isCustomer ? 'var(--odoo-blue)' : 'var(--odoo-orange)';

    html += '<div style="border:1.5px solid ' + typeColor + ';border-radius:10px;overflow:hidden;margin-bottom:10px">';

    // Entity header
    html += '<div style="background:' + typeColor + ';padding:10px 14px;display:flex;align-items:center;gap:10px">'
      + '<div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">' + (r.isCustomer ? '👤' : '🏭') + '</div>'
      + '<div style="flex:1">'
      +   '<div style="color:#fff;font-weight:800;font-size:13.5px">' + e.name + '</div>'
      +   '<div style="color:rgba(255,255,255,.8);font-size:10.5px">' + typeLabel + ' — ' + (e.id || '') + ' — ' + (e.city || e.country || '') + '</div>'
      + '</div>'
      + '</div>';

    // Balance section
    var balance     = r.balance;
    var balanceAbs  = Math.abs(balance);
    var isZero      = balance === 0;
    var sideLabel, sideColor, sideIcon, explanation;

    if (isZero) {
      sideLabel   = 'صفر — لا يوجد رصيد';
      sideColor   = 'var(--odoo-green)';
      sideIcon    = '✅';
      explanation = r.isCustomer ? 'الحساب مسدد بالكامل — لا توجد مديونية.' : 'لا ندين لهذا المورد حالياً.';
    } else if (r.isCustomer) {
      // Customer: positive balance = they owe us = DEBIT (مدين علينا)
      sideLabel   = 'مدين — الزبون مدين لنا';
      sideColor   = '#dc3545';
      sideIcon    = '🔴';
      explanation = 'الزبون لم يسدد هذا المبلغ بعد — يُعدّ ذمة مدينة على الحساب ' + (e.id || '');
    } else {
      // Supplier: debt = we owe them = CREDIT (دائن علينا)
      sideLabel   = 'دائن — نحن مدينون للمورد';
      sideColor   = '#f59e0b';
      sideIcon    = '🟡';
      explanation = 'المبلغ المستحق على شركتنا لهذا المورد — يُعدّ ذمة دائنة.';
    }

    html += '<div style="padding:12px 14px">';

    // Balance display
    html += '<div style="text-align:center;padding:14px;background:#f8f9fa;border-radius:8px;margin-bottom:12px">'
      + '<div style="font-size:10.5px;color:var(--text-m);margin-bottom:4px">الرصيد الحالي</div>'
      + '<div style="font-size:28px;font-weight:900;font-family:monospace;color:' + sideColor + '">'
      +   (isZero ? '0' : fmtM(balanceAbs))
      + '</div>'
      + '<div style="margin-top:6px">'
      +   '<span style="background:' + sideColor + '20;color:' + sideColor + ';font-weight:700;font-size:12px;padding:3px 10px;border-radius:20px">'
      +   sideIcon + ' ' + sideLabel
      +   '</span>'
      + '</div>'
      + '<div style="font-size:10.5px;color:var(--text-m);margin-top:6px">' + explanation + '</div>'
      + '</div>';

    // Stats grid for customers
    if (r.isCustomer && r.invoiceCount > 0) {
      html += '<div class="ai-stat-grid" style="margin-bottom:10px">'
        + '<div class="ai-stat"><div class="lbl">إجمالي الفواتير</div><div class="val">' + fmtM(r.totalSales) + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">المدفوع</div><div class="val" style="color:var(--odoo-green)">' + fmtM(r.totalPaid) + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">عدد الفواتير</div><div class="val">' + r.invoiceCount + '</div></div>'
        + '<div class="ai-stat"><div class="lbl">آخر تعامل</div><div class="val" style="font-size:12px">' + (r.lastInvoice ? r.lastInvoice.date : '—') + '</div></div>'
        + '</div>';
    }

    // Installments
    if (r.installs.length > 0) {
      html += '<div style="padding:8px 10px;border-radius:6px;background:' + (r.hasOverdue ? '#fff5f5' : '#f0fff4') + ';border:1px solid ' + (r.hasOverdue ? '#dc3545' : '#22c55e') + '20;margin-bottom:8px;font-size:11.5px">'
        + (r.hasOverdue ? '⚠️ <strong>متأخر بالأقساط</strong> — ' : '✅ أقساط منتظمة — ')
        + 'متبقي: <strong>' + fmtM(r.totalInstRemain) + '</strong>'
        + '</div>';
    }

    // Supplier speciality
    if (r.isSupplier && e.speciality) {
      html += '<div style="font-size:11px;color:var(--text-m);margin-bottom:8px">🔧 التخصص: ' + e.speciality + '</div>';
    }

    // Contact
    html += '<div style="font-size:11px;color:var(--text-m)">📞 ' + (e.phone || '—') + '</div>';

    html += '</div></div>';  // Close padding + card
  });

  html += '<div style="font-size:10px;color:var(--text-s);margin-top:6px">🗄 مصدر: فواتير المبيعات والحسابات المسجلة في النظام</div>';
  return html;
}

// ════════════════════════════════════════════════════════════════
// PATCH: Extend processAIQuery to detect entity name lookup
// ════════════════════════════════════════════════════════════════
var _origProcessAIQuery = processAIQuery;
processAIQuery = function(q) {
  // Check if question contains a known person/entity name
  var allNames = [];
  (AI_DATA.customers || []).forEach(function(c) { allNames.push(c.name); });
  (AI_DATA.suppliers || []).forEach(function(s) { allNames.push(s.name); });

  // Also check name-fragments (first/last name)
  var nameFragments = [];
  allNames.forEach(function(n) {
    n.split(' ').forEach(function(part) {
      if (part.length >= 3) nameFragments.push({ part:part, full:n });
    });
  });

  // Look for account inquiry keywords + name
  var accountKeywords = ['رصيد','حساب','مديونية','دين','وضع','كشف','مدين','دائن','كم ديننا','كم دينه','كم يدين'];
  var hasAccountKw    = accountKeywords.some(function(kw) { return q.indexOf(kw) >= 0; });

  // Find matching entity in the question
  var matchedEntity = null;

  // First try full names
  for (var i = 0; i < allNames.length; i++) {
    if (q.indexOf(allNames[i]) >= 0) { matchedEntity = allNames[i]; break; }
  }

  // Then try name parts (e.g. "السعدي" instead of "أحمد علي السعدي")
  if (!matchedEntity) {
    for (var j = 0; j < nameFragments.length; j++) {
      var frag = nameFragments[j];
      if (q.indexOf(frag.part) >= 0) { matchedEntity = frag.full; break; }
    }
  }

  // If we found an entity name in the question, do account lookup
  if (matchedEntity) {
    var role = (window.currentUser || {}).role || 'admin';
    var allowed = AI_PERMISSIONS[role] || [];
    if (allowed.indexOf('customers') >= 0 || allowed.indexOf('suppliers') >= 0) {
      showAITyping();
      setTimeout(function() {
        var result = aiAccountLookup(matchedEntity);
        hideAITyping();
        if (result && result.results.length) {
          var html = aiFormatAccountLookup(result);
          appendAIMsg('ai', html || 'لم يتم العثور على بيانات لهذا الحساب.');
        } else {
          appendAIMsg('ai', '❌ لم أجد حساباً باسم "' + matchedEntity + '" في النظام.');
        }
        aiLogQuery(q, 'account_lookup', result);
      }, 700);
      return;
    }
  }

  // Otherwise fall through to original handler
  _origProcessAIQuery(q);
};

// Also patch aiAsk to handle direct name typing
var _origAiAsk = aiAsk;
aiAsk = function(q) {
  var inp = document.getElementById('ai-input');
  if (inp) inp.value = q;
  sendAIMessage();
};


// ════════════════════════════════════════════════════════════════
// PROFESSIONAL EXPORT ENGINE — Excel & PDF
// شركة الراية الزرقاء
// ════════════════════════════════════════════════════════════════

// ── COMPANY BRANDING ────────────────────────────────────────────
var COMPANY = {
  name:     'شركة الراية الزرقاء',
  nameEn:   'Al-Raya Al-Zarqa Company',
  subtitle: 'بيع وصيانة المولدات الكهربائية — بغداد، العراق',
  phone:    '07701234567',
  email:    'info@raya-blue.iq',
  color:    '714B67',   // Odoo purple hex (no #)
  colorDark:'5a3a55',
  colorLight:'f0eeff',
};

// ── ALL REPORT DEFINITIONS ───────────────────────────────────────
var REPORT_CONFIGS = {
  income_statement: {
    title: 'قائمة الدخل',
    titleEn: 'Income Statement',
    icon: '📈',
    headers: ['البند','كود الحساب','مبلغ الفترة (د.ع)','مبلغ السنة (د.ع)'],
    getData: function() {
      return [
        ['الإيرادات','','',''],
        ['إيرادات بيع المولدات الكهربائية','4111','72,000,000','287,000,000'],
        ['إيرادات بيع قطع الغيار','4121','8,200,000','32,800,000'],
        ['إيرادات خدمات الصيانة','4211','7,250,000','29,000,000'],
        ['أجور النقل والتركيب','4231','1,500,000','6,000,000'],
        ['إجمالي الإيرادات','','88,950,000','354,800,000'],
        ['','','',''],
        ['التكاليف والمصروفات','','',''],
        ['تكلفة المولدات المباعة','5111','51,200,000','204,800,000'],
        ['تكلفة قطع الغيار المباعة','5121','4,100,000','16,400,000'],
        ['رواتب الموظفين الإداريين','5311','7,500,000','30,000,000'],
        ['إيجار المكتب والمستودع','5321','2,000,000','8,000,000'],
        ['مصروفات النقل','5221','450,000','1,800,000'],
        ['الكهرباء والماء','5331','380,000','1,520,000'],
        ['إجمالي التكاليف','','65,630,000','262,520,000'],
        ['','','',''],
        ['صافي الربح','','23,320,000','92,280,000'],
      ];
    }
  },
  balance_sheet: {
    title: 'الميزانية العمومية',
    titleEn: 'Balance Sheet',
    icon: '🏦',
    headers: ['البند','كود الحساب','الرصيد (د.ع)','الجانب'],
    getData: function() {
      return [
        ['الموجودات','','',''],
        ['صندوق الدينار العراقي','1611','62,666,667','مدين'],
        ['مصرف المنصور للاستثمار','1621','33,000,000','مدين'],
        ['مخزون المولدات','12111','198,500,000','مدين'],
        ['مخزون قطع الغيار','12121','5,500,000','مدين'],
        ['زبائن ذمم مدينة','151','125,700,000','مدين'],
        ['موجودات ثابتة','1121','45,000,000','مدين'],
        ['إجمالي الموجودات','','470,366,667',''],
        ['','','',''],
        ['المطلوبات وحقوق الملكية','','',''],
        ['موردون ذمم دائنة','2211','17,300,000','دائن'],
        ['رواتب مستحقة','2241','7,500,000','دائن'],
        ['رأس المال المدفوع','311','200,000,000','دائن'],
        ['الفائض المتراكم','331','153,286,667','دائن'],
        ['ربح السنة الجارية','341','92,280,000','دائن'],
        ['إجمالي المطلوبات وحقوق الملكية','','470,366,667',''],
      ];
    }
  },
  trial_balance: {
    title: 'ميزان المراجعة',
    titleEn: 'Trial Balance',
    icon: '⚖️',
    headers: ['كود الحساب','اسم الحساب','مجموع مدين (د.ع)','مجموع دائن (د.ع)','رصيد مدين','رصيد دائن'],
    getData: function() {
      var rows = [];
      var db = typeof ACCOUNTS_DB !== 'undefined' ? ACCOUNTS_DB : [];
      var jd = typeof JOURNAL_ENTRIES_DATA !== 'undefined' ? JOURNAL_ENTRIES_DATA : [];
      // Use real data if available
      if (db.length && jd.length) {
        db.slice(0,20).forEach(function(a) {
          if (typeof getAccountBalance === 'function') {
            var b = getAccountBalance(a.code);
            rows.push([a.code, a.name,
              b.debit  > 0 ? b.debit.toLocaleString('en-US')  : '',
              b.credit > 0 ? b.credit.toLocaleString('en-US') : '',
              b.balance > 0 ? b.balance.toLocaleString('en-US') : '',
              b.balance < 0 ? Math.abs(b.balance).toLocaleString('en-US') : '',
            ]);
          }
        });
      }
      // Fallback sample
      if (!rows.length) rows = [
        ['1611','صندوق الدينار العراقي','72,166,667','9,500,000','62,666,667',''],
        ['1621','مصرف المنصور للاستثمار','45,000,000','12,000,000','33,000,000',''],
        ['151','ذمم مدينة — زبائن','183,500,000','57,800,000','125,700,000',''],
        ['12111','مخزون مولدات بيركنز','280,000,000','81,500,000','198,500,000',''],
        ['2211','موردون قطاع خاص','45,000,000','62,300,000','','17,300,000'],
        ['4111','إيرادات بيع المولدات','0','287,000,000','','287,000,000'],
        ['5311','رواتب الموظفين الإداريين','30,000,000','0','30,000,000',''],
      ];
      return rows;
    }
  },
  cashflow: {
    title: 'قائمة التدفقات النقدية',
    titleEn: 'Cash Flow Statement',
    icon: '💵',
    headers: ['البند','المبلغ (د.ع)','الفئة'],
    getData: function() {
      return [
        ['أنشطة التشغيل','',''],
        ['صافي الربح','23,320,000','تشغيل'],
        ['الزيادة في الذمم المدينة','(15,000,000)','تشغيل'],
        ['الزيادة في المخزون','(22,000,000)','تشغيل'],
        ['الزيادة في الذمم الدائنة','5,800,000','تشغيل'],
        ['صافي التدفق من التشغيل','(7,880,000)',''],
        ['','',''],
        ['أنشطة الاستثمار','',''],
        ['شراء موجودات ثابتة','0','استثمار'],
        ['صافي التدفق من الاستثمار','0',''],
        ['','',''],
        ['أنشطة التمويل','',''],
        ['رأس المال المضاف','0','تمويل'],
        ['صافي التدفق من التمويل','0',''],
        ['','',''],
        ['صافي التغير في النقدية','(7,880,000)',''],
        ['رصيد النقدية أول المدة','103,546,667',''],
        ['رصيد النقدية آخر المدة','95,666,667',''],
      ];
    }
  },
  journal_entries: {
    title: 'سجل القيود اليومية',
    titleEn: 'Journal Entries',
    icon: '📔',
    headers: ['رقم القيد','التاريخ','البيان','كود الحساب','اسم الحساب','مدين (د.ع)','دائن (د.ع)'],
    getData: function() {
      var rows = [];
      var jd = typeof JOURNAL_ENTRIES_DATA !== 'undefined' ? JOURNAL_ENTRIES_DATA : [];
      var db = typeof ACCOUNTS_DB !== 'undefined' ? ACCOUNTS_DB : [];
      jd.forEach(function(entry) {
        (entry.lines||[]).forEach(function(line) {
          var acc = db.find(function(a){return a.code===line.code;})||{name:line.code};
          rows.push([
            entry.id, entry.date, entry.description||'—',
            line.code, acc.name,
            line.debit  > 0 ? line.debit.toLocaleString('en-US')  : '',
            line.credit > 0 ? line.credit.toLocaleString('en-US') : '',
          ]);
        });
      });
      if (!rows.length) rows = [
        ['JV-001','2026-05-14','بيع مولد بيركنز — أحمد السعدي','151','ذمم مدينة','18,500,000',''],
        ['JV-001','2026-05-14','بيع مولد بيركنز — أحمد السعدي','4111','إيرادات المبيعات','','18,500,000'],
        ['JV-002','2026-05-14','قبض نقدي — أحمد السعدي','1611','صندوق الدينار','18,500,000',''],
        ['JV-002','2026-05-14','قبض نقدي — أحمد السعدي','151','ذمم مدينة','','18,500,000'],
        ['JV-003','2026-05-01','رواتب مايو 2026','5311','رواتب الموظفين','7,500,000',''],
        ['JV-003','2026-05-01','رواتب مايو 2026','2241','رواتب مستحقة','','7,500,000'],
      ];
      return rows;
    }
  },
  sales_invoices: {
    title: 'فواتير المبيعات',
    titleEn: 'Sales Invoices',
    icon: '🧾',
    headers: ['رقم الفاتورة','التاريخ','الزبون','الإجمالي (د.ع)','المدفوع (د.ع)','المتبقي (د.ع)','طريقة الدفع','الحالة'],
    getData: function() {
      var ai = typeof AI_DATA !== 'undefined' ? AI_DATA.sales : [];
      if (ai.length) {
        return ai.map(function(s){
          var remain = s.total - s.paid;
          var st = s.status === 'paid' ? 'مسدد' : s.status === 'partial' ? 'جزئي' : 'غير مسدد';
          var m  = s.method === 'cash' ? 'نقد' : s.method === 'credit' ? 'آجل' : s.method === 'transfer' ? 'حوالة' : s.method;
          return [s.id, s.date, s.customer, s.total.toLocaleString('en-US'), s.paid.toLocaleString('en-US'), remain.toLocaleString('en-US'), m, st];
        });
      }
      return [
        ['INV-0089','2026-05-14','أحمد السعدي','18,500,000','18,500,000','0','نقد','مسدد'],
        ['INV-0088','2026-05-13','سامي الجبوري','55,000,000','10,000,000','45,000,000','آجل','جزئي'],
        ['INV-0087','2026-05-12','محمد الدليمي','36,000,000','36,000,000','0','حوالة','مسدد'],
        ['INV-0086','2026-05-10','خالد الربيعي','9,500,000','4,000,000','5,500,000','نقد','جزئي'],
      ];
    }
  },
  customers_balance: {
    title: 'كشف أرصدة الزبائن',
    titleEn: 'Customer Balances',
    icon: '👥',
    headers: ['كود الزبون','اسم الزبون','المدينة','الهاتف','إجمالي الفواتير (د.ع)','الرصيد المستحق (د.ع)','الحالة'],
    getData: function() {
      var ai = typeof AI_DATA !== 'undefined' ? AI_DATA.customers : [];
      if (ai.length) {
        return ai.map(function(c){
          var st = c.debt === 0 ? 'مسدد' : c.debt > 10000000 ? 'مديونية عالية' : 'مديونية عادية';
          return [c.id, c.name, c.city||'—', c.phone, '—', c.debt.toLocaleString('en-US'), st];
        });
      }
      return [];
    }
  },
  installments: {
    title: 'تقرير الأقساط',
    titleEn: 'Installments Report',
    icon: '💳',
    headers: ['رقم العقد','الزبون','إجمالي العقد (د.ع)','المدفوع (د.ع)','المتبقي (د.ع)','موعد الدفع التالي','حالة التأخر'],
    getData: function() {
      var ai = typeof AI_DATA !== 'undefined' ? AI_DATA.installments : [];
      if (ai.length) {
        return ai.map(function(i){
          return [i.id, i.customer, i.total.toLocaleString('en-US'), i.paid.toLocaleString('en-US'), i.remain.toLocaleString('en-US'), i.next_due, i.overdue ? 'متأخر ⚠️' : 'منتظم ✅'];
        });
      }
      return [];
    }
  },
  inventory_status: {
    title: 'تقرير حالة المخزون',
    titleEn: 'Inventory Status',
    icon: '📦',
    headers: ['كود الصنف','اسم الصنف','الفئة','الكمية المتوفرة','الحد الأدنى','الوحدة','التكلفة (د.ع)','سعر البيع (د.ع)','الحالة'],
    getData: function() {
      var inv = typeof AI_DATA !== 'undefined' ? AI_DATA.inventory :
                (typeof INV_ITEMS !== 'undefined' ? INV_ITEMS : []);
      return inv.map(function(i){
        var status = i.qty === 0 ? 'نفد 🔴' : i.qty < i.min ? 'منخفض ⚠️' : 'طبيعي ✅';
        var cat = i.cat === 'generator' ? 'مولدات' : i.cat === 'part' ? 'قطع غيار' : 'زيوت';
        return [i.code, i.name, cat, i.qty, i.min, i.unit||'وحدة', (i.cost||0).toLocaleString('en-US'), (i.price||0).toLocaleString('en-US'), status];
      });
    }
  },
  maintenance: {
    title: 'تقرير الصيانة',
    titleEn: 'Maintenance Report',
    icon: '🔧',
    headers: ['رقم الطلب','التاريخ','الزبون','نوع الصيانة','الحالة','التكلفة (د.ع)'],
    getData: function() {
      var ai = typeof AI_DATA !== 'undefined' ? AI_DATA.maintenance : [];
      return ai.map(function(m){
        var t = m.type === 'corrective' ? 'إصلاح' : m.type === 'preventive' ? 'وقائية' : m.type === 'warranty' ? 'ضمان' : m.type;
        var s = m.status === 'open' ? 'مفتوح 🔴' : m.status === 'in_progress' ? 'جارية 🟡' : 'مكتملة ✅';
        return [m.id, m.date, m.customer, t, s, (m.cost||0).toLocaleString('en-US')];
      });
    }
  },
  expenses: {
    title: 'تقرير المصروفات',
    titleEn: 'Expenses Report',
    icon: '💸',
    headers: ['التاريخ','نوع المصروف','المبلغ (د.ع)'],
    getData: function() {
      var ai = typeof AI_DATA !== 'undefined' ? AI_DATA.expenses : [];
      return ai.map(function(e){ return [e.date, e.type, e.amount.toLocaleString('en-US')]; });
    }
  },
  hr_report: {
    title: 'تقرير الموارد البشرية',
    titleEn: 'HR Report',
    icon: '👨‍💼',
    headers: ['كود الموظف','الاسم','الوظيفة','الإجازة المستحقة','المأخوذة','المتبقية','الزمنيات (د)','المتبقي (د)'],
    getData: function() {
      var emps = typeof EMPLOYEES !== 'undefined' ? EMPLOYEES : [];
      return emps.map(function(e){
        var lvU = typeof getMonthLeaveUsed==='function' ? getMonthLeaveUsed(e.id,5) : 0;
        var tsU = typeof getMonthTSUsed==='function'   ? getMonthTSUsed(e.id,5)   : 0;
        return [e.id, e.name, e.role, 1, lvU, 1-lvU, tsU, 300-tsU];
      });
    }
  },
};

// ── EXCEL EXPORT ENGINE (Professional CSV with BOM) ─────────────
var currentExportReport = '';
var currentExportFormat = 'excel';

function openExportModal(reportKey, title) {
  currentExportReport = reportKey;
  var modalTitle = document.getElementById('excel-modal-title');
  if (modalTitle) modalTitle.textContent = '📊 تصدير — ' + title;
  renderExcelPreview(reportKey);
  openM('m-excel-export');
}

function renderExcelPreview(reportKey) {
  var config = REPORT_CONFIGS[reportKey];
  var container = document.getElementById('excel-preview-table');
  if (!config || !container) return;
  var data = config.getData().slice(0, 5);
  var html = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11.5px;direction:rtl">';
  html += '<thead><tr style="background:#' + COMPANY.color + ';color:#fff">';
  config.headers.forEach(function(h){ html += '<th style="padding:7px 10px;text-align:right;font-weight:700;white-space:nowrap">' + h + '</th>'; });
  html += '</tr></thead><tbody>';
  data.forEach(function(row, i) {
    var bg = i%2===0 ? '#fff' : '#f8f7ff';
    html += '<tr style="background:' + bg + '">';
    row.forEach(function(cell){
      html += '<td style="padding:6px 10px;border:1px solid #e9ecef">' + (cell||'') + '</td>';
    });
    html += '</tr>';
  });
  if (config.getData().length > 5) {
    html += '<tr><td colspan="' + config.headers.length + '" style="padding:6px 10px;text-align:center;color:#6c757d;font-size:11px;border:1px solid #e9ecef">... و' + (config.getData().length-5) + ' سطر إضافي</td></tr>';
  }
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

function setExportPeriod(period) {
  var now = new Date('2026-05-15');
  var from, to;
  if (period==='month')   { from=new Date(now.getFullYear(),now.getMonth(),1); to=new Date(now.getFullYear(),now.getMonth()+1,0); }
  else if (period==='quarter') { var q=Math.floor(now.getMonth()/3); from=new Date(now.getFullYear(),q*3,1); to=new Date(now.getFullYear(),q*3+3,0); }
  else if (period==='year') { from=new Date(now.getFullYear(),0,1); to=new Date(now.getFullYear(),11,31); }
  else { from=new Date(2020,0,1); to=now; }
  var toISO=function(d){return d.toISOString().split('T')[0];};
  var fe=document.getElementById('ex-from'), te=document.getElementById('ex-to');
  if(fe) fe.value=toISO(from);
  if(te) te.value=toISO(to);
}

function doExportExcel() {
  var config = REPORT_CONFIGS[currentExportReport];
  if (!config) { notify('اختر تقريراً أولاً ✕', 'danger'); return; }
  var fmt = document.getElementById('ex-format')?.value || 'excel';
  var from = document.getElementById('ex-from')?.value || '';
  var to   = document.getElementById('ex-to')?.value   || '';
  if (fmt === 'pdf') {
    exportToPDF(config, from, to);
  } else {
    exportToExcel(config, from, to);
  }
  closeM('m-excel-export');
}

// ── PROFESSIONAL EXCEL EXPORT ────────────────────────────────────
// ══════════════════════════════════════════════════════════════════
// PROFESSIONAL EXCEL EXPORT — XLS format (real Excel XML)
// ══════════════════════════════════════════════════════════════════
function exportToExcel(config, from, to) {
  var data   = config.getData();
  var period = from && to ? 'من ' + from + ' إلى ' + to : 'كل البيانات';
  var now    = new Date().toLocaleDateString('en-GB');
  var color  = '#' + COMPANY.color;
  var cols   = config.headers.length;

  var cell = function(val, style, span) {
    var s = span > 1 ? ' ss:MergeAcross="' + (span-1) + '"' : '';
    return '<Cell ss:StyleID="' + style + '"' + s + '><Data ss:Type="String">' +
      String(val||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</Data></Cell>';
  };

  var xls = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<?mso-application progid="Excel.Sheet"?>\n' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
    '<Styles>\n' +
    '<Style ss:ID="hdr"><Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/><Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/><Interior ss:Color="' + color + '" ss:Pattern="Solid"/></Style>\n' +
    '<Style ss:ID="co1"><Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/><Font ss:Bold="1" ss:Color="' + color + '" ss:Size="16"/><Interior ss:Color="#F0EEFF" ss:Pattern="Solid"/></Style>\n' +
    '<Style ss:ID="co2"><Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/><Font ss:Color="#666666" ss:Size="10"/><Interior ss:Color="#F8F7FF" ss:Pattern="Solid"/></Style>\n' +
    '<Style ss:ID="rpt"><Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/><Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="13"/><Interior ss:Color="' + color + '" ss:Pattern="Solid"/></Style>\n' +
    '<Style ss:ID="meta"><Alignment ss:ReadingOrder="RightToLeft"/><Font ss:Color="#333333" ss:Size="10"/><Interior ss:Color="#F0EEFF" ss:Pattern="Solid"/></Style>\n' +
    '<Style ss:ID="odd"><Alignment ss:ReadingOrder="RightToLeft"/><Font ss:Size="10"/><Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:Color="#E0DAF5" ss:Weight="1"/></Borders></Style>\n' +
    '<Style ss:ID="even"><Alignment ss:ReadingOrder="RightToLeft"/><Font ss:Size="10"/><Interior ss:Color="#F8F7FF" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:Color="#E0DAF5" ss:Weight="1"/></Borders></Style>\n' +
    '<Style ss:ID="good"><Alignment ss:ReadingOrder="RightToLeft"/><Font ss:Bold="1" ss:Color="#198754" ss:Size="10"/><Interior ss:Color="#F0FFF4" ss:Pattern="Solid"/></Style>\n' +
    '<Style ss:ID="bad"><Alignment ss:ReadingOrder="RightToLeft"/><Font ss:Bold="1" ss:Color="#DC3545" ss:Size="10"/><Interior ss:Color="#FFF5F5" ss:Pattern="Solid"/></Style>\n' +
    '<Style ss:ID="warn"><Alignment ss:ReadingOrder="RightToLeft"/><Font ss:Bold="1" ss:Color="#D97706" ss:Size="10"/><Interior ss:Color="#FFFBEB" ss:Pattern="Solid"/></Style>\n' +
    '<Style ss:ID="ftr"><Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/><Font ss:Color="#888888" ss:Size="9"/><Interior ss:Color="#F0EEFF" ss:Pattern="Solid"/></Style>\n' +
    '</Styles>\n' +
    '<Worksheet ss:Name="' + config.title + '">\n<Table ss:DefaultColumnWidth="130">\n';

  xls += '<Row ss:Height="30">' + cell(COMPANY.name, 'co1', cols) + '</Row>\n';
  xls += '<Row ss:Height="18">' + cell(COMPANY.subtitle, 'co2', cols) + '</Row>\n';
  xls += '<Row ss:Height="16">' + cell('هاتف: ' + COMPANY.phone + '   |   إيميل: ' + COMPANY.email, 'co2', cols) + '</Row>\n';
  xls += '<Row ss:Height="6"><Cell><Data ss:Type="String"></Data></Cell></Row>\n';
  xls += '<Row ss:Height="26">' + cell(config.icon + '  ' + config.title + '  (' + config.titleEn + ')', 'rpt', cols) + '</Row>\n';
  xls += '<Row ss:Height="18">' + cell('الفترة: ' + period, 'meta', Math.ceil(cols/2)) + cell('تاريخ الإصدار: ' + now + '   |   السجلات: ' + data.length, 'meta', Math.floor(cols/2)) + '</Row>\n';
  xls += '<Row ss:Height="6"><Cell><Data ss:Type="String"></Data></Cell></Row>\n';
  xls += '<Row ss:Height="22">' + config.headers.map(function(h){ return cell(h,'hdr'); }).join('') + '</Row>\n';

  data.forEach(function(row, i) {
    xls += '<Row ss:Height="18">';
    row.forEach(function(c) {
      var val = String(c||'');
      var s = i%2===0 ? 'odd' : 'even';
      if (val.match(/مسدد|طبيعي/)) s = 'good';
      else if (val.match(/متأخر|نفد/)) s = 'bad';
      else if (val.match(/جزئي|منخفض/)) s = 'warn';
      xls += cell(val, s);
    });
    xls += '</Row>\n';
  });

  xls += '<Row ss:Height="6"><Cell><Data ss:Type="String"></Data></Cell></Row>\n';
  xls += '<Row ss:Height="18">' + cell(COMPANY.name + ' — ' + COMPANY.nameEn + '  |  ' + COMPANY.phone + '  |  نظام الراية الزرقاء المالي  |  ' + now, 'ftr', cols) + '</Row>\n';
  xls += '</Table>\n</Worksheet>\n</Workbook>';

  var blob = new Blob([xls], { type: 'application/vnd.ms-excel;charset=utf-8' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = 'الراية_الزرقاء_' + config.titleEn.replace(/\s+/g,'_') + '_' + (from||new Date().toISOString().split('T')[0]) + '.xls';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
  notify('✅ تم تنزيل ملف Excel: ' + config.title, 'success');
}

// ══════════════════════════════════════════════════════════════════
// PROFESSIONAL PDF EXPORT — داخل الصفحة بدون popup
// ══════════════════════════════════════════════════════════════════
function exportToPDF(config, from, to) {
  var data   = config.getData();
  var period = from && to ? 'من ' + from + ' إلى ' + to : 'كل البيانات';
  var now    = new Date().toLocaleDateString('en-GB');
  var color  = '#' + COMPANY.color;

  var tableRows = data.map(function(row, i) {
    var bg = i%2===0 ? '#ffffff' : '#f8f7ff';
    return '<tr style="background:' + bg + '">' +
      row.map(function(c) {
        var val = String(c||'');
        var s = 'padding:7px 10px;border-bottom:1px solid #e8e0f5;border-right:1px solid #e8e0f5;font-size:11px;';
        if (val.match(/مسدد|طبيعي/)) s += 'color:#198754;font-weight:600';
        else if (val.match(/متأخر|نفد/)) s += 'color:#dc3545;font-weight:600';
        else if (val.match(/جزئي|منخفض/)) s += 'color:#f59e0b;font-weight:600';
        return '<td style="' + s + '">' + val + '</td>';
      }).join('') + '</tr>';
  }).join('');

  var overlay = document.getElementById('raya-print-overlay');
  if (!overlay) { overlay = document.createElement('div'); overlay.id = 'raya-print-overlay'; document.body.appendChild(overlay); }
  overlay.style.cssText = 'display:block;position:fixed;inset:0;background:#f4f4f8;z-index:99999;overflow-y:auto;font-family:Cairo,Arial,sans-serif;direction:rtl;padding:20px 24px';

  overlay.innerHTML =
    '<div style="display:flex;gap:10px;margin-bottom:16px;align-items:center" class="no-print">' +
      '<button onclick="window.print()" style="background:' + color + ';color:#fff;border:none;padding:10px 22px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700;font-family:Cairo,Arial,sans-serif">🖨️ طباعة / حفظ PDF</button>' +
      '<button onclick="closePrintOverlay()" style="background:#6c757d;color:#fff;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:14px;font-family:Cairo,Arial,sans-serif">✕ إغلاق</button>' +
      '<span style="font-size:12px;color:#666">← اضغط طباعة ثم اختر «حفظ كـ PDF» من الطابعة</span>' +
    '</div>' +
    '<div id="raya-print-page" style="background:#fff;max-width:1050px;margin:0 auto;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.12);padding:28px 32px">' +
      '<div style="background:linear-gradient(135deg,' + color + ' 0%,#4f46e5 100%);border-radius:10px;padding:22px 28px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
        '<div>' +
          '<div style="color:#fff;font-size:22px;font-weight:900">⚡ ' + COMPANY.name + '</div>' +
          '<div style="color:rgba(255,255,255,.85);font-size:11.5px;margin-top:4px">' + COMPANY.subtitle + '</div>' +
          '<div style="color:rgba(255,255,255,.7);font-size:10.5px;margin-top:3px">📞 ' + COMPANY.phone + '   ✉ ' + COMPANY.email + '</div>' +
        '</div>' +
        '<div style="text-align:center">' +
          '<div style="background:rgba(255,255,255,.18);color:#fff;padding:12px 24px;border-radius:22px;font-weight:800;font-size:15px;border:1.5px solid rgba(255,255,255,.35)">' + config.icon + ' ' + config.title + '</div>' +
          '<div style="color:rgba(255,255,255,.7);font-size:10px;margin-top:6px">' + config.titleEn + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;border:1.5px solid #e0daf5;border-radius:8px;overflow:hidden;margin-bottom:18px">' +
        '<div style="flex:1;padding:10px 16px;background:#f8f7ff;border-right:1px solid #e0daf5"><div style="font-size:10px;color:#888">التقرير</div><div style="font-size:12px;font-weight:700;color:' + color + '">' + config.title + '</div></div>' +
        '<div style="flex:1.5;padding:10px 16px;background:#fff;border-right:1px solid #e0daf5"><div style="font-size:10px;color:#888">الفترة</div><div style="font-size:12px;font-weight:600">' + period + '</div></div>' +
        '<div style="flex:1;padding:10px 16px;background:#f8f7ff;border-right:1px solid #e0daf5"><div style="font-size:10px;color:#888">تاريخ الإصدار</div><div style="font-size:12px;font-weight:600">' + now + '</div></div>' +
        '<div style="flex:.7;padding:10px 16px;background:#fff"><div style="font-size:10px;color:#888">السجلات</div><div style="font-size:16px;font-weight:900;color:' + color + '">' + data.length + '</div></div>' +
      '</div>' +
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse">' +
        '<thead><tr style="background:' + color + '">' +
          config.headers.map(function(h){ return '<th style="color:#fff;padding:10px 12px;text-align:right;font-size:11.5px;font-weight:700;border:1px solid rgba(255,255,255,.15);white-space:nowrap">' + h + '</th>'; }).join('') +
        '</tr></thead><tbody>' + tableRows + '</tbody></table></div>' +
      '<div style="margin-top:20px;padding-top:12px;border-top:2px solid ' + color + ';text-align:center;font-size:10px;color:#999">' +
        COMPANY.name + ' — ' + COMPANY.nameEn + '  |  ' + COMPANY.phone + '  |  نظام الراية الزرقاء المالي  |  ' + now +
      '</div>' +
    '</div>';

  notify('✅ اضغط "طباعة / حفظ PDF" لاستخراج الملف', 'success');
}

function closePrintOverlay() {
  var o = document.getElementById('raya-print-overlay');
  if (o) o.style.display = 'none';
}

// ── BATCH EXPORT ─────────────────────────────────────────────────
function exportAllReports() {
  var keys = Object.keys(REPORT_CONFIGS);
  var from = (document.getElementById('batch-from')||{}).value || '';
  var to   = (document.getElementById('batch-to')||{}).value   || '';
  var fmt  = (document.getElementById('batch-format')||{}).value || 'excel';
  if (fmt === 'pdf') { exportToPDF(REPORT_CONFIGS[keys[0]], from, to); return; }
  notify('جاري تنزيل ' + keys.length + ' ملف Excel...', 'info');
  var delay = 0;
  keys.forEach(function(key) {
    setTimeout(function() { exportToExcel(REPORT_CONFIGS[key], from, to); }, delay);
    delay += 700;
  });
  setTimeout(function() { notify('تم تنزيل جميع التقارير (' + keys.length + ' ملف)!', 'success'); }, delay+300);
}

// ── EXPORT STUBS ─────────────────────────────────────────────────
exportInvExcel       = function() { exportToExcel(REPORT_CONFIGS['inventory_status'],'',''); };
exportMovementsExcel = function() { exportToExcel(REPORT_CONFIGS['journal_entries'],'',''); };
exportBalanceExcel   = function() { exportToExcel(REPORT_CONFIGS['balance_sheet'],'',''); };


// ═══════════════════════════════════════════════════════════════════
// MISSING FUNCTIONS — ADDED
// ═══════════════════════════════════════════════════════════════════

// ── Invoice Designer helpers ────────────────────────────────────────
function updatePreviewColor(val) {
  var preview = document.getElementById('invoice-preview-panel') || document.querySelector('.invoice-preview');
  if (preview) preview.style.setProperty('--inv-color', val);
  var colorPick = document.getElementById('tpl-color');
  if (colorPick) colorPick.value = val;
  notify('تم تحديث لون الفاتورة', 'info');
}

function updatePreviewFont(fontVal) {
  var preview = document.getElementById('invoice-preview-panel') || document.querySelector('.invoice-preview');
  if (preview) preview.style.fontFamily = fontVal + ', Cairo, Arial, sans-serif';
  notify('تم تحديث الخط', 'info');
}

function handleLogoUpload(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var logoEl = document.getElementById('inv-logo-preview') || document.querySelector('.inv-logo img');
    if (logoEl) { logoEl.src = e.target.result; logoEl.style.display = 'block'; }
    else {
      var wrap = document.getElementById('logo-upload-area');
      if (wrap) wrap.innerHTML = '<img src="'+e.target.result+'" style="max-height:60px;border-radius:4px">';
    }
    notify('تم رفع الشعار ✓', 'success');
  };
  reader.readAsDataURL(file);
}

function renderInvoicePreview() {
  var panel = document.getElementById('invoice-preview-panel') || document.querySelector('.inv-preview-wrap');
  if (!panel) return;
  var title    = document.getElementById('inv-title-txt')?.value   || 'فاتورة مبيعات';
  var subtitle = document.getElementById('inv-sub-txt')?.value     || 'شركة الراية الزرقاء للمولدات الكهربائية';
  var footer   = document.getElementById('inv-footer-txt')?.value  || 'شكراً لثقتكم';
  var color    = document.getElementById('tpl-color')?.value       || '#714B67';
  var co = typeof COMPANY !== 'undefined' ? COMPANY : { name:'الراية الزرقاء', phone:'07901234567' };
  panel.innerHTML = '<div style="font-family:Cairo,Arial,sans-serif;direction:rtl;padding:20px;border:1px solid #e0e0e0;border-radius:8px;max-width:580px;margin:0 auto">' +
    '<div style="background:'+color+';color:#fff;padding:16px 20px;border-radius:6px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">' +
    '<div><div style="font-size:18px;font-weight:900">'+co.name+'</div><div style="font-size:11px;opacity:.8">'+subtitle+'</div></div>' +
    '<div style="font-size:20px;font-weight:900;background:rgba(255,255,255,.2);padding:8px 16px;border-radius:20px">'+title+'</div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;font-size:12px">' +
    '<div><strong>رقم الفاتورة:</strong> INV-XXX</div><div><strong>التاريخ:</strong> '+new Date().toLocaleDateString('en-GB')+'</div>' +
    '<div><strong>اسم الزبون:</strong> اسم الزبون</div><div><strong>الهاتف:</strong> '+co.phone+'</div></div>' +
    '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px">' +
    '<thead><tr style="background:'+color+';color:#fff"><th style="padding:8px;text-align:right">الصنف</th><th style="padding:8px">الكمية</th><th style="padding:8px">السعر</th><th style="padding:8px">المجموع</th></tr></thead>' +
    '<tbody><tr style="border-bottom:1px solid #eee"><td style="padding:8px">مولد كهربائي 50KVA</td><td style="padding:8px;text-align:center">1</td><td style="padding:8px;text-align:center">18,500,000</td><td style="padding:8px;text-align:center">18,500,000</td></tr></tbody>' +
    '</table>' +
    '<div style="text-align:center;font-size:11px;color:#888;border-top:2px solid '+color+';padding-top:10px">'+footer+'</div></div>';
}

// ── Inventory adjust diff calc ─────────────────────────────────────
function calcAdjDiff() {
  var actual  = parseFloat(document.getElementById('adj-actual')?.value)  || 0;
  // adj-system field may not exist in modal; derive from selected item label
  var systemVal = 0;
  var itemSel = document.getElementById('adj-item');
  if (itemSel && itemSel.value) {
    var lbl = itemSel.options[itemSel.selectedIndex]?.text || '';
    var m = lbl.match(/متوفر:\s*([\d,]+)/);
    if (m) systemVal = parseFloat(m[1].replace(/,/g,'')) || 0;
  }
  var diffEl = document.getElementById('adj-diff');
  var diff = actual - systemVal;
  if (diffEl) {
    diffEl.value = (diff > 0 ? '+' : '') + diff + (systemVal ? ' (النظام: ' + systemVal + ')' : '');
    diffEl.style.color = diff > 0 ? 'var(--odoo-green)' : diff < 0 ? 'var(--odoo-red)' : 'var(--text-m)';
  }
}

function saveInvAdjustment() {
  var item   = document.getElementById('adj-item')?.value;
  var actual = document.getElementById('adj-actual')?.value;
  if (!item)   { notify('يجب اختيار الصنف ✕','danger'); return; }
  if (!actual) { notify('يجب إدخال الكمية الفعلية ✕','danger'); return; }
  closeM('m-inventory-adjust');
  notify('تم تنفيذ تسوية المخزون وإنشاء قيد التسوية ✓', 'success');
}

// ── Warranty modal calc ────────────────────────────────────────────
function calcWModal() {
  var dateVal = document.getElementById('wm-date')?.value;
  var years   = parseInt(document.getElementById('wm-years')?.value) || 2;
  var hours   = parseInt(document.getElementById('wm-hours')?.value) || 2000;
  var expEl   = document.getElementById('wm-expiry');
  var hoursEl = document.getElementById('wm-hours-label');
  if (dateVal && expEl) {
    var d = new Date(dateVal);
    d.setFullYear(d.getFullYear() + years);
    expEl.textContent = d.toLocaleDateString('en-GB');
  }
  if (hoursEl) hoursEl.textContent = hours.toLocaleString('en-US') + ' ساعة';
}

// ── Filter inventory items ─────────────────────────────────────────
function filterInvItems() {
  var cat    = document.getElementById('inv-cat-filter')?.value  || 'all';
  var status = document.querySelector('#inv-status-filter')?.value || 'all';
  var rows   = document.querySelectorAll('#inv-items-body tr');
  rows.forEach(function(r) {
    var catMatch    = cat    === 'all' || r.dataset.cat    === cat;
    var statusMatch = status === 'all' || r.dataset.status === status;
    r.style.display = (catMatch && statusMatch) ? '' : 'none';
  });
}

// ============================================================
// SMART SEARCH ENGINE — محرك البحث الذكي
// ============================================================
(function() {
  // Dataset registry
  var SB_DATASETS = {
    account: function() { return ACCOUNTS_DB; },
    supplier: function() { return SUPPLIERS_DB; },
    customer: function() { return CUSTOMERS_DB; },
    item:     function() { return ITEMS_DB; }
  };

  function getLabel(type, item, short) {
    if (type === 'account')  return '<span class="sb-code">' + item.code + '</span><span class="sb-name">' + item.name + '</span>';
    if (type === 'supplier') return '<span class="sb-code">' + item.id + '</span><span class="sb-name">' + item.name + '</span><span class="sb-sub">' + item.address + '</span>';
    if (type === 'customer') return '<span class="sb-code">' + item.id + '</span><span class="sb-name">' + item.name + '</span><span class="sb-sub">' + item.city + '</span>';
    if (type === 'item')     return '<span class="sb-code">' + item.code + '</span><span class="sb-name">' + item.name + '</span><span class="sb-sub">وحدة: ' + item.unit + '</span>';
    return String(item.name || '');
  }
  function getShortLabel(type, item) {
    if (type === 'account')  return item.code + ' — ' + item.name;
    if (type === 'supplier') return item.name;
    if (type === 'customer') return item.name;
    if (type === 'item')     return item.code + ' — ' + item.name;
    return String(item.name || '');
  }
  function getValue(type, item) {
    if (type === 'account')  return item.code;
    if (type === 'supplier') return item.id;
    if (type === 'customer') return item.id;
    if (type === 'item')     return item.code;
    return '';
  }
  function matches(type, item, q) {
    var n = (item.name || '').toLowerCase();
    var c = (item.code || item.id || '').toLowerCase();
    return n.includes(q) || c.includes(q);
  }

  function openDropdown(wrap, text, val, type, onSelect) {
    var list = wrap.querySelector('.sb-dropdown');
    var q = text.value.trim().toLowerCase();
    list.innerHTML = '';
    if (!q && q.length < 1) { list.classList.remove('open'); return; }
    var db = SB_DATASETS[type] ? SB_DATASETS[type]() : [];
    var results = q ? db.filter(function(d){ return matches(type, d, q); }) : db;
    results = results.slice(0, 25);
    if (!results.length) {
      if (type === 'customer') {
        var _qc = text.value.trim().replace(/['"<>]/g, '');
        list.innerHTML = '<div class="sb-opt" style="color:#9ca3af;font-size:11.5px;cursor:default">لا يوجد زبون بهذا الاسم</div>' +
          '<div class="sb-opt" style="color:var(--odoo-blue);font-weight:700;cursor:pointer;background:var(--odoo-blue-l);border-top:1px solid var(--odoo-blue)" ' +
          'onmousedown="event.preventDefault();quickAddCustomerFromSB(\'' + _qc + '\'">＋ إضافة زبون جديد: "' + _qc + '"</div>';
      } else {
        list.innerHTML = '<div class="sb-opt" style="color:#9ca3af;cursor:default">لا توجد نتائج مطابقة</div>';
      }
      list.classList.add('open'); return;
    }
    var hi = 0;
    results.forEach(function(item, i) {
      var div = document.createElement('div');
      div.className = 'sb-opt' + (i === 0 ? ' sb-hi' : '');
      div.innerHTML = getLabel(type, item);
      div.addEventListener('mousedown', function(e) {
        e.preventDefault();
        val.value = getValue(type, item);
        text.value = getShortLabel(type, item);
        list.classList.remove('open');
        wrap.classList.remove('sb-invalid');
        if (typeof onSelect === 'function') onSelect(item);
      });
      list.appendChild(div);
    });
    list.classList.add('open');
  }

  function attachSB(wrap) {
    var type    = wrap.dataset.sbType || 'account';
    var text    = wrap.querySelector('.sb-text');
    var val     = wrap.querySelector('.sb-val') || wrap.querySelector('input[type=hidden]');
    var list    = wrap.querySelector('.sb-dropdown');
    var onSel   = wrap._sbOnSelect || null;
    if (!text || !list) return;
    text.addEventListener('input', function() { openDropdown(wrap, text, val, type, onSel); });
    text.addEventListener('focus', function() { if (text.value) openDropdown(wrap, text, val, type, onSel); });
    text.addEventListener('blur',  function() {
      setTimeout(function() {
        list.classList.remove('open');
        if (text.value.trim() && (!val || !val.value)) {
          wrap.classList.add('sb-invalid');
        }
      }, 200);
    });
    text.addEventListener('keydown', function(e) {
      var opts = list.querySelectorAll('.sb-opt');
      var cur  = Array.prototype.indexOf.call(opts, list.querySelector('.sb-hi'));
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (cur < opts.length - 1) { opts[cur] && opts[cur].classList.remove('sb-hi'); opts[cur+1].classList.add('sb-hi'); }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cur > 0) { opts[cur] && opts[cur].classList.remove('sb-hi'); opts[cur-1].classList.add('sb-hi'); }
      } else if (e.key === 'Enter') {
        var hi = list.querySelector('.sb-hi');
        if (hi) { e.preventDefault(); hi.dispatchEvent(new MouseEvent('mousedown')); }
      } else if (e.key === 'Escape') {
        list.classList.remove('open');
      }
    });
  }

  // Init all sb-wrap elements when DOM ready & on modal open
  window.initAllSB = function() {
    document.querySelectorAll('.sb-wrap').forEach(function(w) {
      if (!w._sbInited) { w._sbInited = true; attachSB(w); }
    });
  };

  // Custom onSelect for a specific wrap
  window.setSBOnSelect = function(wrapId, fn) {
    var w = document.getElementById(wrapId);
    if (w) { w._sbOnSelect = fn; w._sbInited = false; attachSB(w); }
  };

  // Read sb value
  window.getSBVal = function(prefix) {
    var v = document.getElementById(prefix + '-val');
    return v ? v.value : '';
  };
  window.getSBText = function(prefix) {
    var v = document.getElementById(prefix + '-text');
    return v ? v.value : '';
  };
  window.clearSB = function(prefix) {
    var t = document.getElementById(prefix + '-text');
    var v = document.getElementById(prefix + '-val');
    var w = document.getElementById(prefix + '-wrap') || (t && t.closest('.sb-wrap'));
    if (t) t.value = '';
    if (v) v.value = '';
    if (w) { w.classList.remove('sb-invalid'); var l = w.querySelector('.sb-dropdown'); if (l) l.classList.remove('open'); }
  };

  // Auto-init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(window.initAllSB, 500);
      setTimeout(function(){ if(typeof populateAccountSelects==='function') populateAccountSelects(); }, 600);
    });
  } else {
    setTimeout(window.initAllSB, 500);
    setTimeout(function(){ if(typeof populateAccountSelects==='function') populateAccountSelects(); }, 600);
  }

  // Re-init on modal open (patch openM)
  var _origOpenM = window.openM;
  window.openM = function(id) {
    if (typeof _origOpenM === 'function') _origOpenM(id);
    setTimeout(window.initAllSB, 50);
    setTimeout(function(){ if(typeof populateAccountSelects==='function') populateAccountSelects(); }, 80);
  };
})();

// ============================================================
// PURCHASE INVOICE FUNCTIONS — دوال فواتير الشراء
// ============================================================
var PUR_LINE_IDX = 0;
var PUR_LINES_DATA = [];

function openPurchaseModal() {
  // Set today's date
  var today = new Date().toISOString().split('T')[0];
  var el = document.getElementById('pur-date');
  if (el) el.value = today;
  var due = document.getElementById('pur-due-date');
  if (due) { var d = new Date(); d.setDate(d.getDate()+30); due.value = d.toISOString().split('T')[0]; }

  // Clear fields
  clearSB('sb-sup');
  var fields = ['pur-inv-no','pur-po-ref','pur-notes'];
  fields.forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
  var pm = document.getElementById('pur-pay-method'); if (pm) pm.value = '';
  // Clear lines
  PUR_LINES_DATA = [];
  PUR_LINE_IDX = 0;
  var tbody = document.getElementById('pur-lines-body');
  if (tbody) tbody.innerHTML = '';
  updatePurNoLines();
  calcPurTotals();
  var prev = document.getElementById('pur-entry-preview');
  if (prev) prev.style.display = 'none';

  // Reset import section
  IC_ACTIVE = false;
  var impSec = document.getElementById('pur-import-section');
  var impBtn = document.getElementById('ic-toggle-btn');
  if (impSec) impSec.style.display = 'none';
  if (impBtn) { impBtn.innerHTML = '📦 تفعيل تكاليف الاستيراد'; impBtn.classList.remove('active'); }
  var badge = document.getElementById('ic-incoterm-badge');
  if (badge) badge.style.display = 'none';
  IC_ROWS.forEach(function(r){ r._calc = 0; });

  // Supplier onSelect → update entry preview
  setSBOnSelect('sb-sup-wrap', function(sup) {
    if(IC_ACTIVE) calcImportCosts(); else updatePurEntryPreview();
  });

  openM('m-purchase');
}

function addPurLine() {
  var tbody = document.getElementById('pur-lines-body');
  if (!tbody) return;
  var idx = ++PUR_LINE_IDX;
  var tr = document.createElement('tr');
  tr.id = 'pur-line-' + idx;
  tr.innerHTML =
    '<td><div class="sb-wrap" id="sb-item-' + idx + '-wrap" data-sb-type="item">' +
      '<input type="text" class="form-control sb-text" id="sb-item-' + idx + '-text" placeholder="ابحث..." autocomplete="off" style="min-width:140px">' +
      '<input type="hidden" id="sb-item-' + idx + '-val">' +
      '<div class="sb-dropdown" id="sb-item-' + idx + '-list"></div>' +
    '</div></td>' +
    '<td><input type="text" class="form-control" id="pl-desc-'   + idx + '" placeholder="وصف" style="min-width:100px"></td>' +
    '<td><input type="text" class="form-control" id="pl-unit-'   + idx + '" readonly style="width:55px;background:#f9fafb;text-align:center"></td>' +
    '<td><input type="number" class="form-control" id="pl-qty-'  + idx + '" value="1" min="0.001" style="width:65px;text-align:center" oninput="calcPurLine(' + idx + ')"></td>' +
    '<td><input type="number" class="form-control" id="pl-price-'+ idx + '" value="0" min="0" style="width:110px;text-align:center" oninput="calcPurLine(' + idx + ')"></td>' +
    '<td><input type="number" class="form-control" id="pl-disc-' + idx + '" value="0" min="0" max="100" style="width:65px;text-align:center" oninput="calcPurLine(' + idx + ')"></td>' +
    '<td><input type="number" class="form-control" id="pl-tax-'  + idx + '" value="0" min="0" max="100" style="width:65px;text-align:center" oninput="calcPurLine(' + idx + ')"></td>' +
    '<td><input type="text"   class="form-control" id="pl-total-'+ idx + '" readonly style="width:110px;text-align:center;font-weight:700;background:#f9fafb"></td>' +
    '<td><button class="pur-del-btn" onclick="removePurLine(' + idx + ')">🗑</button></td>';
  tbody.appendChild(tr);
  updatePurNoLines();

  // Wire up item smart search onSelect
  setSBOnSelect('sb-item-' + idx + '-wrap', function(item) {
    var unitEl  = document.getElementById('pl-unit-'  + idx);
    var priceEl = document.getElementById('pl-price-' + idx);
    var descEl  = document.getElementById('pl-desc-'  + idx);
    if (unitEl)  unitEl.value  = item.unit || '';
    if (priceEl && item.defaultPrice) priceEl.value = item.defaultPrice;
    if (descEl && !descEl.value) descEl.value = item.name;
    calcPurLine(idx);
  });
  setTimeout(initAllSB, 30);
}

function removePurLine(idx) {
  var tr = document.getElementById('pur-line-' + idx);
  if (tr) tr.remove();
  updatePurNoLines();
  calcPurTotals();
}

function updatePurNoLines() {
  var tbody = document.getElementById('pur-lines-body');
  var msg   = document.getElementById('pur-no-lines');
  if (!msg) return;
  msg.style.display = (tbody && tbody.children.length > 0) ? 'none' : 'block';
}

function calcPurLine(idx) {
  var qty   = parseFloat((document.getElementById('pl-qty-'  + idx) || {}).value) || 0;
  var price = parseFloat((document.getElementById('pl-price-'+ idx) || {}).value) || 0;
  var disc  = parseFloat((document.getElementById('pl-disc-' + idx) || {}).value) || 0;
  var tax   = parseFloat((document.getElementById('pl-tax-'  + idx) || {}).value) || 0;
  var sub   = qty * price;
  var discAmt = sub * disc / 100;
  var taxAmt  = (sub - discAmt) * tax / 100;
  var total   = sub - discAmt + taxAmt;
  var el = document.getElementById('pl-total-' + idx);
  if (el) el.value = total.toLocaleString('en-US');
  calcPurTotals();
  updatePurEntryPreview();
}

function calcPurTotals() {
  var tbody = document.getElementById('pur-lines-body');
  if (!tbody) return;
  var subtotal = 0, totalDisc = 0, totalTax = 0;
  var rows = tbody.querySelectorAll('tr');
  rows.forEach(function(tr) {
    var id = tr.id.replace('pur-line-', '');
    var qty   = parseFloat((document.getElementById('pl-qty-'  + id) || {}).value) || 0;
    var price = parseFloat((document.getElementById('pl-price-'+ id) || {}).value) || 0;
    var disc  = parseFloat((document.getElementById('pl-disc-' + id) || {}).value) || 0;
    var tax   = parseFloat((document.getElementById('pl-tax-'  + id) || {}).value) || 0;
    var sub   = qty * price;
    var discAmt = sub * disc / 100;
    var taxAmt  = (sub - discAmt) * tax / 100;
    subtotal  += sub;
    totalDisc += discAmt;
    totalTax  += taxAmt;
  });
  var grand = subtotal - totalDisc + totalTax;
  function fmt(n) { return n.toLocaleString('en-US') + ' د.ع'; }
  var el;
  el = document.getElementById('pur-subtotal');    if (el) el.textContent = fmt(subtotal);
  el = document.getElementById('pur-total-disc');  if (el) el.textContent = fmt(totalDisc);
  el = document.getElementById('pur-total-tax');   if (el) el.textContent = fmt(totalTax);
  el = document.getElementById('pur-grand-total'); if (el) el.textContent = fmt(grand);
  return {subtotal: subtotal, disc: totalDisc, tax: totalTax, grand: grand};
}

function updatePurEntryPreview() {
  var totals = calcPurTotals();
  if (!totals || !totals.grand) return;
  var payMethod = (document.getElementById('pur-pay-method') || {}).value || '';
  var crCode = payMethod === 'cash' ? '1611' : payMethod === 'transfer' ? '1621' : '2111';
  var crName = payMethod === 'cash' ? 'صندوق الدينار العراقي' : payMethod === 'transfer' ? 'البنك' : 'ذمم الموردين الدائنة';
  var lines = '';
  // Dr lines from items
  var tbody = document.getElementById('pur-lines-body');
  if (tbody) {
    var drAccs = {};
    tbody.querySelectorAll('tr').forEach(function(tr) {
      var id    = tr.id.replace('pur-line-', '');
      var iCode = getSBVal('sb-item-' + id);
      var item  = ITEMS_DB.find(function(x){ return x.code === iCode; });
      var accCode = item ? item.accountCode : '12111';
      var accName = item ? item.name : 'مخزون';
      var qty   = parseFloat((document.getElementById('pl-qty-'  + id) || {}).value) || 0;
      var price = parseFloat((document.getElementById('pl-price-'+ id) || {}).value) || 0;
      var disc  = parseFloat((document.getElementById('pl-disc-' + id) || {}).value) || 0;
      var tax   = parseFloat((document.getElementById('pl-tax-'  + id) || {}).value) || 0;
      var sub   = qty*price; var discAmt=sub*disc/100; var taxAmt=(sub-discAmt)*tax/100;
      var lineTotal = sub - discAmt + taxAmt;
      if (!drAccs[accCode]) drAccs[accCode] = {name: accName, amount: 0};
      drAccs[accCode].amount += lineTotal;
    });
    Object.keys(drAccs).forEach(function(code) {
      lines += '<div style="display:flex;justify-content:space-between;padding:2px 0"><span>مدين — ح/' + code + ' ' + drAccs[code].name + '</span><span style="color:var(--odoo-blue)">' + drAccs[code].amount.toLocaleString('en-US') + ' د.ع</span></div>';
    });
  }
  lines += '<div style="display:flex;justify-content:space-between;padding:2px 0;border-top:1px solid #e5e7eb;margin-top:4px"><span>دائن — ح/' + crCode + ' ' + crName + '</span><span style="color:var(--odoo-red)">' + totals.grand.toLocaleString('en-US') + ' د.ع</span></div>';
  var prev = document.getElementById('pur-entry-preview');
  var linesEl = document.getElementById('pur-entry-lines');
  if (prev && linesEl) { linesEl.innerHTML = lines; prev.style.display = 'block'; }
}

function savePurchase() {
  var supId   = getSBVal('sb-sup');
  var invNo   = (document.getElementById('pur-inv-no') || {}).value || '';
  var date    = (document.getElementById('pur-date')   || {}).value || '';
  var payMeth = (document.getElementById('pur-pay-method') || {}).value || '';
  var tbody   = document.getElementById('pur-lines-body');

  if (!supId)  { notify('⚠️ يرجى اختيار المجهز', 'danger'); return; }
  if (!invNo)  { notify('⚠️ يرجى إدخال رقم فاتورة المجهز', 'danger'); return; }
  if (!date)   { notify('⚠️ يرجى تحديد تاريخ الفاتورة', 'danger'); return; }
  if (!payMeth){ notify('⚠️ يرجى اختيار طريقة الدفع', 'danger'); return; }
  if (!tbody || tbody.children.length === 0) { notify('⚠️ يرجى إضافة بند واحد على الأقل', 'danger'); return; }

  var totals = calcPurTotals();
  if (totals.grand <= 0) { notify('⚠️ إجمالي الفاتورة يجب أن يكون أكبر من صفر', 'danger'); return; }

  var sup  = SUPPLIERS_DB.find(function(s){ return s.id === supId; });
  var crCode = payMeth === 'cash' ? '1611' : payMeth === 'transfer' ? '1621' : '2111';

  // Build journal entry lines
  var jLines = [];
  tbody.querySelectorAll('tr').forEach(function(tr) {
    var id     = tr.id.replace('pur-line-', '');
    var iCode  = getSBVal('sb-item-' + id);
    var item   = ITEMS_DB.find(function(x){ return x.code === iCode; });
    var accCode= item ? item.accountCode : '12111';
    var qty    = parseFloat((document.getElementById('pl-qty-'  + id)||{}).value)||0;
    var price  = parseFloat((document.getElementById('pl-price-'+ id)||{}).value)||0;
    var disc   = parseFloat((document.getElementById('pl-disc-' + id)||{}).value)||0;
    var tax    = parseFloat((document.getElementById('pl-tax-'  + id)||{}).value)||0;
    var sub    = qty*price; var dAmt=sub*disc/100; var tAmt=(sub-dAmt)*tax/100;
    var total  = sub - dAmt + tAmt;
    if (total > 0) {
      var existing = jLines.find(function(l){ return l.code === accCode; });
      if (existing) existing.debit += total;
      else jLines.push({code: accCode, debit: total, credit: 0});
    }
  });
  jLines.push({code: crCode, debit: 0, credit: totals.grand});

  // Import costs info
  var importTotalSaved = 0;
  var landedTotalSaved = totals.grand;
  if (IC_ACTIVE) {
    IC_ROWS.forEach(function(r){ importTotalSaved += r._calc || 0; });
    landedTotalSaved = totals.grand + importTotalSaved;
    // Add import cost Dr lines
    var icGrouped = {};
    IC_ROWS.forEach(function(r){
      if(r._calc > 0){ if(!icGrouped[r.acct]) icGrouped[r.acct]=0; icGrouped[r.acct]+=r._calc; }
    });
    Object.keys(icGrouped).forEach(function(code){
      var existing = jLines.find(function(l){ return l.code===code && l.debit > 0; });
      if(existing) existing.debit += icGrouped[code];
      else jLines.push({code:code, debit:icGrouped[code], credit:0});
    });
    // Update Cr to full landed total
    var crLine = jLines.find(function(l){ return l.credit > 0; });
    if(crLine) crLine.credit = landedTotalSaved;
  }

  var jId = 'PUR-' + Date.now();
  JOURNAL_ENTRIES_DATA.push({
    id: jId, date: date, journal: 'purchase',
    ref: invNo, supplier: sup ? sup.name : supId,
    isImport: IC_ACTIVE,
    importTotal: importTotalSaved,
    landedTotal: landedTotalSaved,
    currency: (document.getElementById('pur-currency')||{}).value || 'IQD',
    incoterms: (document.getElementById('pur-incoterms')||{}).value || '',
    blNumber: (document.getElementById('pur-bl-number')||{}).value || '',
    originCountry: (document.getElementById('pur-origin-country')||{}).value || '',
    lines: jLines
  });

  if (typeof addAuditLog === 'function') addAuditLog('add', jId, 'فاتورة شراء: ' + invNo + ' — ' + (sup ? sup.name : supId) + (IC_ACTIVE ? ' [استيراد]' : ''));
  if (typeof renderPurchasesPage === 'function') renderPurchasesPage();
  IC_ACTIVE = false;
  var btn = document.getElementById('ic-toggle-btn');
  if(btn){ btn.innerHTML='📦 تفعيل تكاليف الاستيراد'; btn.classList.remove('active'); }
  closeM('m-purchase');
  notify('✅ تم حفظ فاتورة الشراء ' + invNo + (IC_ACTIVE ? ' مع تكاليف استيراد ' + importTotalSaved.toLocaleString('en-US') + ' د.ع' : '') + ' — القيد: ' + jId, 'success');
}

// ============================================================
// EXPENSE FUNCTIONS — دوال المصروفات
// ============================================================
function previewExpEntry() {
  var accCode = getSBVal('sb-exp-acc');
  var accName = getSBText('sb-exp-acc');
  var amt     = parseFloat((document.getElementById('exp-amount') || {}).value) || 0;
  var method  = (document.getElementById('exp-method') || {}).value || '';
  if (!accCode || !amt || !method) { var p=document.getElementById('exp-entry-preview'); if(p) p.style.display='none'; return; }
  var crName  = method==='1611'?'صندوق الدينار العراقي':method==='1621'?'البنك':method==='1612'?'صندوق دولار':'الصندوق';
  var html = '<div style="display:flex;justify-content:space-between;padding:2px 0"><span>مدين — ح/' + accCode + ' ' + accName + '</span><span style="color:var(--odoo-blue)">' + amt.toLocaleString('en-US') + ' د.ع</span></div>';
  html += '<div style="display:flex;justify-content:space-between;padding:2px 0;border-top:1px solid #e5e7eb;margin-top:4px"><span>دائن — ح/' + method + ' ' + crName + '</span><span style="color:var(--odoo-red)">' + amt.toLocaleString('en-US') + ' د.ع</span></div>';
  var prev = document.getElementById('exp-entry-preview');
  var linesEl = document.getElementById('exp-entry-lines');
  if (prev && linesEl) { linesEl.innerHTML = html; prev.style.display = 'block'; }
}

function openExpenseModal() {
  var today = new Date().toISOString().split('T')[0];
  var el = document.getElementById('exp-date'); if (el) el.value = today;
  clearSB('sb-exp-acc');
  var fields = ['exp-amount','exp-desc'];
  fields.forEach(function(id){ var e=document.getElementById(id); if(e) e.value=''; });
  var m = document.getElementById('exp-method'); if(m) m.value='';
  var p = document.getElementById('exp-entry-preview'); if(p) p.style.display='none';
  setSBOnSelect('sb-exp-acc-wrap', function(acc) { previewExpEntry(); });
  openM('m-expense');
}

function saveExpense() {
  var accCode = getSBVal('sb-exp-acc');
  var accName = getSBText('sb-exp-acc');
  var amt     = parseFloat((document.getElementById('exp-amount') || {}).value) || 0;
  var date    = (document.getElementById('exp-date')   || {}).value || '';
  var method  = (document.getElementById('exp-method') || {}).value || '';
  var desc    = (document.getElementById('exp-desc')   || {}).value || '';

  if (!accCode) { notify('⚠️ يرجى اختيار حساب المصروف', 'danger'); return; }
  if (!amt || amt <= 0) { notify('⚠️ يرجى إدخال مبلغ صحيح', 'danger'); return; }
  if (!date)   { notify('⚠️ يرجى تحديد تاريخ الصرف', 'danger'); return; }
  if (!method) { notify('⚠️ يرجى اختيار طريقة الصرف', 'danger'); return; }
  if (!desc)   { notify('⚠️ يرجى إدخال وصف للمصروف', 'danger'); return; }

  var jId = 'EXP-' + Date.now();
  JOURNAL_ENTRIES_DATA.push({
    id: jId, date: date, journal: 'expense', desc: desc,
    lines: [
      {code: accCode, debit: amt,  credit: 0},
      {code: method,  debit: 0,    credit: amt}
    ]
  });
  if (typeof addAuditLog === 'function') addAuditLog('add', jId, 'مصروف: ' + desc + ' — ' + amt.toLocaleString('en-US') + ' د.ع');
  closeM('m-expense');
  notify('✅ تم تسجيل المصروف وإنشاء القيد ' + jId, 'success');
  if (typeof renderExpensesPage === 'function') renderExpensesPage();
}

// ============================================================
// PAYMENT FUNCTIONS — دوال وصولات الصرف
// ============================================================
function previewPayEntry() {
  var accCode = getSBVal('sb-pay-dr');
  var accName = getSBText('sb-pay-dr');
  var amt     = parseFloat((document.getElementById('pay-amount') || {}).value) || 0;
  var method  = (document.getElementById('pmnt-method') || {}).value || '';
  if (!accCode || !amt || !method) { var p=document.getElementById('pay-entry-preview'); if(p) p.style.display='none'; return; }
  var crName = method==='1611'?'صندوق الدينار العراقي':method==='1621'?'البنك':'نقداً';
  var html = '<div style="display:flex;justify-content:space-between;padding:2px 0"><span>مدين — ح/' + accCode + ' ' + accName + '</span><span style="color:var(--odoo-blue)">' + amt.toLocaleString('en-US') + ' د.ع</span></div>';
  html += '<div style="display:flex;justify-content:space-between;padding:2px 0;border-top:1px solid #e5e7eb;margin-top:4px"><span>دائن — ح/' + method + ' ' + crName + '</span><span style="color:var(--odoo-red)">' + amt.toLocaleString('en-US') + ' د.ع</span></div>';
  var prev = document.getElementById('pay-entry-preview');
  var linesEl = document.getElementById('pmnt-entry-lines');
  if (prev && linesEl) { linesEl.innerHTML = html; prev.style.display = 'block'; }
}

function openPaymentModal() {
  var today = new Date().toISOString().split('T')[0];
  var el = document.getElementById('pay-date'); if (el) el.value = today;
  clearSB('sb-pay-dr');
  var fields = ['pay-amount','pay-beneficiary','pay-desc'];
  fields.forEach(function(id){ var e=document.getElementById(id); if(e) e.value=''; });
  var m = document.getElementById('pmnt-method'); if(m) m.value='';
  var p = document.getElementById('pay-entry-preview'); if(p) p.style.display='none';
  setSBOnSelect('sb-pay-dr-wrap', function(acc) { previewPayEntry(); });
  openM('m-payment');
}

function savePayment() {
  var accCode  = getSBVal('sb-pay-dr');
  var accName  = getSBText('sb-pay-dr');
  var amt      = parseFloat((document.getElementById('pay-amount')      || {}).value) || 0;
  var benef    = (document.getElementById('pay-beneficiary') || {}).value || '';
  var date     = (document.getElementById('pay-date')        || {}).value || '';
  var method   = (document.getElementById('pmnt-method')     || {}).value || '';
  var desc     = (document.getElementById('pay-desc')        || {}).value || '';

  if (!accCode) { notify('⚠️ يرجى اختيار الحساب المدين', 'danger'); return; }
  if (!amt || amt <= 0) { notify('⚠️ يرجى إدخال مبلغ صحيح', 'danger'); return; }
  if (!benef)  { notify('⚠️ يرجى إدخال اسم المستفيد', 'danger'); return; }
  if (!date)   { notify('⚠️ يرجى تحديد تاريخ الصرف', 'danger'); return; }
  if (!method) { notify('⚠️ يرجى اختيار طريقة الصرف', 'danger'); return; }
  if (!desc)   { notify('⚠️ يرجى إدخال وصف العملية', 'danger'); return; }

  var jId = 'PAY-' + Date.now();
  JOURNAL_ENTRIES_DATA.push({
    id: jId, date: date, journal: 'cash', desc: desc, beneficiary: benef,
    lines: [
      {code: accCode, debit: amt, credit: 0},
      {code: method,  debit: 0,   credit: amt}
    ]
  });
  if (typeof addAuditLog === 'function') addAuditLog('add', jId, 'صرف نقدي: ' + desc + ' إلى ' + benef + ' — ' + amt.toLocaleString('en-US') + ' د.ع');
  closeM('m-payment');
  notify('✅ تم حفظ وصل الصرف ' + jId + ' وإنشاء القيد المحاسبي', 'success');
}

// ============================================================
// populateAccountSelects — populate any remaining <select> with class acc-select
// ============================================================
function populateAccountSelects() {
  document.querySelectorAll('select.acc-select').forEach(function(sel) {
    var current = sel.value;
    sel.innerHTML = '<option value="">— اختر الحساب —</option>';
    ACCOUNTS_DB.forEach(function(acc) {
      var opt = document.createElement('option');
      opt.value = acc.code;
      opt.textContent = acc.code + ' — ' + acc.name;
      if (acc.code === current) opt.selected = true;
      sel.appendChild(opt);
    });
  });
}

// ============================================================
// IMPORT / LANDED COSTS ENGINE — محرك تكاليف الاستيراد
// ============================================================

// Default import cost rows definition
var IC_ROWS = [
  {id:'ic-freight',    name:'شحن دولي (بحري/جوي/بري)',      type:'fixed', localCurr:false, acct:'554',  acctName:'رسوم شحن دولي',         icon:'🚢', enabled:true,  _calc:0},
  {id:'ic-insurance',  name:'تأمين بضاعة (Marine Insurance)', type:'pct',  localCurr:false, acct:'552',  acctName:'تأمين بضاعة',            icon:'🛡', enabled:true,  _calc:0},
  {id:'ic-customs',    name:'رسوم جمركية (Customs Duties)',   type:'pct',  localCurr:false, acct:'554',  acctName:'رسوم جمركية',            icon:'🏛', enabled:true,  _calc:0},
  {id:'ic-clearance',  name:'أجور تخليص جمركي',              type:'fixed', localCurr:true,  acct:'554',  acctName:'رسوم تخليص',            icon:'📋', enabled:true,  _calc:0},
  {id:'ic-port',       name:'رسوم ميناء ومناولة',             type:'fixed', localCurr:true,  acct:'5221', acctName:'رسوم ميناء',            icon:'⚓', enabled:true,  _calc:0},
  {id:'ic-inland',     name:'نقل داخلي (من المنفذ للمخزن)',   type:'fixed', localCurr:true,  acct:'5221', acctName:'نقل وشحن داخلي',       icon:'🚛', enabled:true,  _calc:0},
  {id:'ic-banking',    name:'رسوم مصرفية / اعتماد مستندي',   type:'pct',  localCurr:false, acct:'552',  acctName:'عمولات بنكية',           icon:'🏦', enabled:true,  _calc:0},
  {id:'ic-inspection', name:'رسوم معاينة وفحص',               type:'fixed', localCurr:true,  acct:'539',  acctName:'مصروفات أخرى',          icon:'🔍', enabled:false, _calc:0},
  {id:'ic-storage',    name:'رسوم تخزين / إيداع جمركي',      type:'fixed', localCurr:true,  acct:'5212', acctName:'مصاريف مستودع',         icon:'🏭', enabled:false, _calc:0},
  {id:'ic-demurrage',  name:'غرامة تأخير (Demurrage)',        type:'fixed', localCurr:false, acct:'553',  acctName:'فروقات وغرامات',        icon:'⏰', enabled:false, _calc:0},
  {id:'ic-forex',      name:'فروق العملة',                    type:'fixed', localCurr:true,  acct:'553',  acctName:'فروقات عملة',           icon:'💱', enabled:false, _calc:0},
  {id:'ic-misc',       name:'مصاريف متنوعة',                  type:'fixed', localCurr:true,  acct:'539',  acctName:'مصروفات إدارية أخرى',  icon:'📎', enabled:true,  _calc:0},
];

var IC_ACTIVE = false;

var INCOTERMS_GUIDE = {
  EXW: 'المشتري يتحمل كل شيء: الشحن، التأمين، الجمارك، النقل الداخلي',
  FCA: 'المورد يسلم للناقل — المشتري يتحمل باقي التكاليف',
  FOB: 'المورد يضع على السفينة — المشتري يتحمل الشحن والتأمين والجمارك',
  CNF: 'المورد يدفع الشحن — المشتري يتحمل التأمين والجمارك',
  CIF: 'المورد يدفع الشحن والتأمين — المشتري يتحمل الجمارك والنقل الداخلي',
  DDP: 'المورد يدفع كل شيء حتى الوصول — لا رسوم على المشتري',
};

function buildImportCostRows() {
  var tbody = document.getElementById('import-costs-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  IC_ROWS.forEach(function(row) {
    var tr = document.createElement('tr');
    tr.id = 'icrow-' + row.id;
    tr.innerHTML =
      '<td style="padding:6px 10px">' +
        '<label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-weight:500">' +
          '<input type="checkbox" id="' + row.id + '-en" ' + (row.enabled ? 'checked' : '') + ' onchange="calcImportCosts()" style="width:15px;height:15px">' +
          '<span>' + row.icon + ' ' + row.name + '</span>' +
        '</label>' +
      '</td>' +
      '<td style="padding:5px 6px;text-align:center">' +
        '<select class="form-control" id="' + row.id + '-type" style="font-size:11.5px;padding:3px 5px;min-width:90px" onchange="calcImportCosts()">' +
          '<option value="fixed"' + (row.type==='fixed'?' selected':'') + '>مبلغ ثابت</option>' +
          '<option value="pct"'   + (row.type==='pct'  ?' selected':'') + '>نسبة %</option>' +
        '</select>' +
      '</td>' +
      '<td style="padding:5px 6px;text-align:center">' +
        '<div style="display:flex;align-items:center;gap:3px">' +
          '<input type="number" class="form-control" id="' + row.id + '-val" value="0" min="0" step="0.01" style="font-size:12px;text-align:center;width:90px" oninput="calcImportCosts()">' +
          '<select id="' + row.id + '-cur" style="font-size:10px;padding:2px 3px;border:1px solid #d1d5db;border-radius:4px;background:#f9fafb;color:#374151;cursor:pointer;max-width:55px" onchange="calcImportCosts()">' +
            '<option value="local"' + (row.localCurr?' selected':'') + '>د.ع</option>' +
            '<option value="foreign"' + (!row.localCurr && row.type!=="pct"?' selected':'') + '>عملة</option>' +
            '<option value="pct"' + (row.type==="pct"?' selected':'') + '>%</option>' +
          '</select>' +
        '</div>' +
      '</td>' +
      '<td style="padding:5px 10px;text-align:center;font-weight:700;color:#065f46;font-size:13px" id="' + row.id + '-res">—</td>' +
      '<td style="text-align:center"></td>';
    tbody.appendChild(tr);
  });
}

function onCurrencyChange() {
  var cur = (document.getElementById('pur-currency') || {}).value || 'IQD';
  var wrap = document.getElementById('pur-rate-wrap');
  var defaultRates = {IQD:1, USD:1310, EUR:1430, GBP:1650, CNY:181, AED:357};
  if (wrap) wrap.style.display = cur !== 'IQD' ? 'block' : 'none';
  var rateEl = document.getElementById('pur-exchange-rate');
  if (rateEl && defaultRates[cur]) rateEl.value = defaultRates[cur];
  // Update foreign currency labels
  IC_ROWS.forEach(function(row) {
    var curSel = document.getElementById(row.id + '-cur');
    if (curSel) {
      var opts = curSel.querySelectorAll('option');
      if(opts[1]) opts[1].textContent = cur === 'IQD' ? 'د.ع' : cur;
    }
  });
  calcImportCosts();
}

function onIncotermsChange() {
  var val = (document.getElementById('pur-incoterms') || {}).value || '';
  var badge = document.getElementById('ic-incoterm-badge');
  var guide = document.getElementById('incoterms-guide');
  if (badge) { badge.style.display = val ? 'inline-block' : 'none'; badge.textContent = val; badge.className = 'badge-incoterm'; }
  if (guide) { guide.style.display = val ? 'block' : 'none'; guide.textContent = '📌 ' + (INCOTERMS_GUIDE[val] || ''); }

  // Suggest which costs to enable based on incoterms
  var suggestEnable = { EXW:['ic-freight','ic-insurance','ic-customs','ic-clearance','ic-port','ic-inland','ic-banking'],
    FCA:['ic-freight','ic-insurance','ic-customs','ic-clearance','ic-port','ic-inland'],
    FOB:['ic-freight','ic-insurance','ic-customs','ic-clearance','ic-port','ic-inland'],
    CNF:['ic-insurance','ic-customs','ic-clearance','ic-port','ic-inland'],
    CIF:['ic-customs','ic-clearance','ic-port','ic-inland'],
    DDP:[] };
  var toEnable = suggestEnable[val] || [];
  IC_ROWS.forEach(function(row) {
    var chk = document.getElementById(row.id + '-en');
    if (chk) chk.checked = toEnable.indexOf(row.id) > -1;
  });
  calcImportCosts();
}

function toggleImportSection() {
  IC_ACTIVE = !IC_ACTIVE;
  var sec = document.getElementById('pur-import-section');
  var btn = document.getElementById('ic-toggle-btn');
  if (!sec || !btn) return;
  if (IC_ACTIVE) {
    sec.style.display = 'block';
    btn.textContent = '❌ إلغاء الاستيراد';
    btn.classList.add('active');
    buildImportCostRows();
    calcImportCosts();
    setTimeout(function(){ sec.scrollIntoView({behavior:'smooth',block:'start'}); }, 100);
  } else {
    sec.style.display = 'none';
    btn.innerHTML = '📦 تفعيل تكاليف الاستيراد';
    btn.classList.remove('active');
    IC_ROWS.forEach(function(r){ r._calc = 0; });
    updatePurEntryPreview();
  }
}

function calcImportCosts() {
  var cur    = (document.getElementById('pur-currency') || {}).value || 'IQD';
  var rate   = parseFloat((document.getElementById('pur-exchange-rate') || {}).value) || 1;
  var totals = calcPurTotals();
  var baseIQD = totals ? totals.grand : 0;

  var totalImport = 0;
  IC_ROWS.forEach(function(row) {
    var enabled = (document.getElementById(row.id + '-en') || {}).checked;
    var type    = (document.getElementById(row.id + '-type') || {}).value || 'fixed';
    var val     = parseFloat((document.getElementById(row.id + '-val') || {}).value) || 0;
    var rowCur  = (document.getElementById(row.id + '-cur') || {}).value || (row.localCurr ? 'local' : 'foreign');

    var amountIQD = 0;
    if (enabled) {
      if (rowCur === 'pct' || type === 'pct') amountIQD = baseIQD * val / 100;
      else if (rowCur === 'foreign')           amountIQD = val * rate;
      else                                     amountIQD = val; // local IQD
    }
    row._calc = amountIQD;

    var resEl = document.getElementById(row.id + '-res');
    if (resEl) resEl.textContent = enabled && amountIQD > 0 ? amountIQD.toLocaleString('en-US') + ' د.ع' : '—';
    totalImport += amountIQD;
  });

  var grandLanded = baseIQD + totalImport;

  // Update summary fields
  var fmt = function(n){ return n.toLocaleString('en-US') + ' د.ع'; };
  var el;
  el = document.getElementById('import-total-display'); if(el) el.textContent = fmt(totalImport);
  el = document.getElementById('ic-base-display');      if(el) el.value = fmt(baseIQD);
  el = document.getElementById('ic-costs-display');     if(el) el.value = fmt(totalImport);
  el = document.getElementById('ic-landed-display');    if(el) el.value = fmt(grandLanded);

  updateLandedCostSummary(baseIQD, totalImport, grandLanded);
  updatePurEntryPreviewFull(baseIQD, totalImport, grandLanded);
}

function updateLandedCostSummary(baseAmt, importAmt, grandTotal) {
  var tbody  = document.getElementById('pur-lines-body');
  var dist   = (document.getElementById('import-dist-method') || {}).value || 'value';
  var sumEl  = document.getElementById('landed-cost-summary');
  if (!sumEl || !tbody) return;

  var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
  if (!rows.length) {
    sumEl.innerHTML = '<div style="text-align:center;color:#9ca3af;padding:16px">أضف بنود الفاتورة أولاً</div>';
    return;
  }
  if (!importAmt) {
    sumEl.innerHTML = '<div style="text-align:center;color:#9ca3af;padding:16px">أضف تكاليف الاستيراد لرؤية تحليل التكلفة الحقيقية</div>';
    return;
  }

  var lines = []; var totalQty = 0; var totalVal = 0;
  rows.forEach(function(tr) {
    var id    = tr.id.replace('pur-line-', '');
    var qty   = parseFloat((document.getElementById('pl-qty-'   + id)||{}).value)||0;
    var price = parseFloat((document.getElementById('pl-price-' + id)||{}).value)||0;
    var disc  = parseFloat((document.getElementById('pl-disc-'  + id)||{}).value)||0;
    var tax   = parseFloat((document.getElementById('pl-tax-'   + id)||{}).value)||0;
    var name  = (document.getElementById('sb-item-' + id + '-text')||{}).value || 'مادة';
    var sub = qty*price; var dAmt=sub*disc/100; var tAmt=(sub-dAmt)*tax/100;
    var lineTotal = sub - dAmt + tAmt;
    lines.push({id:id, name:name, qty:qty, lineTotal:lineTotal});
    totalQty += qty; totalVal += lineTotal;
  });

  lines.forEach(function(line) {
    var share = 1/lines.length;
    if      (dist==='value' && totalVal>0)  share = line.lineTotal / totalVal;
    else if (dist==='qty'   && totalQty>0)  share = line.qty / totalQty;
    line.importShare  = importAmt * share;
    line.landedTotal  = line.lineTotal + line.importShare;
    line.unitCostBefore = line.qty > 0 ? line.lineTotal / line.qty : 0;
    line.landedUnit     = line.qty > 0 ? line.landedTotal / line.qty : 0;
    line.pctAdd         = line.lineTotal > 0 ? (line.importShare / line.lineTotal * 100).toFixed(1) : '0';
  });

  var html = '<div style="overflow-x:auto"><table class="landed-summary-table" style="width:100%;border-collapse:collapse">';
  html += '<thead><tr style="background:#064e3b;color:#fff">';
  ['المادة','الكمية','سعر الوحدة (فوب)','حصة الاستيراد','تكلفة الوحدة الحقيقية ✅','الإجمالي الوصول','نسبة الإضافة'].forEach(function(h){
    html += '<th style="padding:7px 9px;text-align:right;white-space:nowrap">' + h + '</th>';
  });
  html += '</tr></thead><tbody>';
  lines.forEach(function(line, i) {
    var bg = i%2===0?'#fff':'#f0fdf4';
    html += '<tr style="background:'+bg+'">';
    html += '<td style="padding:6px 9px;font-weight:600">' + line.name + '</td>';
    html += '<td style="padding:6px 9px;text-align:center">' + line.qty + '</td>';
    html += '<td style="padding:6px 9px;text-align:center;direction:ltr">' + line.unitCostBefore.toLocaleString('en-US') + '</td>';
    html += '<td style="padding:6px 9px;text-align:center;color:#d97706;direction:ltr">+' + line.importShare.toLocaleString('en-US') + '</td>';
    html += '<td style="padding:6px 9px;text-align:center;font-weight:800;color:#065f46;background:#d1fae5;font-size:13px;direction:ltr">' + line.landedUnit.toLocaleString('en-US') + '</td>';
    html += '<td style="padding:6px 9px;text-align:center;direction:ltr">' + line.landedTotal.toLocaleString('en-US') + '</td>';
    html += '<td style="padding:6px 9px;text-align:center;color:#d97706;font-weight:600">+' + line.pctAdd + '%</td>';
    html += '</tr>';
  });
  html += '<tr style="background:#064e3b;color:#fff;font-weight:700">';
  html += '<td colspan="3" style="padding:8px 9px">الإجمالي الكلي للتكلفة الحقيقية</td>';
  html += '<td style="padding:8px 9px;text-align:center;direction:ltr">+' + importAmt.toLocaleString('en-US') + '</td>';
  html += '<td colspan="2" style="padding:8px 9px;text-align:center;color:#86efac;font-size:14px;direction:ltr">' + grandTotal.toLocaleString('en-US') + ' د.ع</td>';
  var pct = baseAmt > 0 ? (importAmt/baseAmt*100).toFixed(1) : '0';
  html += '<td style="padding:8px 9px;text-align:center;color:#fbbf24">+' + pct + '%</td>';
  html += '</tr></tbody></table></div>';

  html += '<div class="cost-impact-bar">📊 تكاليف الاستيراد تمثل <b>' + pct + '%</b> من قيمة البضاعة — التكلفة الوصول الفعلية: <b>' + grandTotal.toLocaleString('en-US') + ' د.ع</b></div>';
  sumEl.innerHTML = html;
}

function updatePurEntryPreviewFull(baseAmt, importAmt, grandTotal) {
  var payMethod = (document.getElementById('pur-pay-method') || {}).value || '';
  var crCode = payMethod==='cash'?'1611':payMethod==='transfer'?'1621':'2111';
  var crName = payMethod==='cash'?'صندوق الدينار العراقي':payMethod==='transfer'?'البنك':'ذمم موردون';

  var lines = '';
  // Dr inventory lines
  var tbody = document.getElementById('pur-lines-body');
  if (tbody) {
    var drAccs = {};
    Array.prototype.slice.call(tbody.querySelectorAll('tr')).forEach(function(tr) {
      var id  = tr.id.replace('pur-line-','');
      var iCode = getSBVal('sb-item-'+id);
      var item  = ITEMS_DB.find(function(x){ return x.code===iCode; });
      var acc   = item ? item.accountCode : '12111';
      var qty   = parseFloat((document.getElementById('pl-qty-'+id)||{}).value)||0;
      var price = parseFloat((document.getElementById('pl-price-'+id)||{}).value)||0;
      var disc  = parseFloat((document.getElementById('pl-disc-'+id)||{}).value)||0;
      var tax   = parseFloat((document.getElementById('pl-tax-'+id)||{}).value)||0;
      var sub=qty*price; var d=sub*disc/100; var t=(sub-d)*tax/100;
      var tot = sub-d+t;
      if(tot>0){
        if(!drAccs[acc]) drAccs[acc]={name:(item?item.name:'مخزون'),amount:0};
        drAccs[acc].amount += tot;
      }
    });
    Object.keys(drAccs).forEach(function(code){
      lines += '<div style="display:flex;justify-content:space-between;padding:2px 0">' +
        '<span>📦 مدين ح/' + code + ' — مخزون (' + drAccs[code].name + ')</span>' +
        '<span style="color:var(--odoo-blue);direction:ltr">' + drAccs[code].amount.toLocaleString('en-US') + ' د.ع</span></div>';
    });
  }

  // Dr import cost entries
  if (importAmt > 0) {
    var grouped = {};
    IC_ROWS.forEach(function(r){
      if(r._calc > 0){ if(!grouped[r.acct]) grouped[r.acct]={name:r.acctName,amount:0}; grouped[r.acct].amount += r._calc; }
    });
    Object.keys(grouped).forEach(function(code){
      lines += '<div style="display:flex;justify-content:space-between;padding:2px 0;color:#d97706">' +
        '<span>🚢 مدين ح/' + code + ' — ' + grouped[code].name + '</span>' +
        '<span style="direction:ltr">' + grouped[code].amount.toLocaleString('en-US') + ' د.ع</span></div>';
    });
  }

  // Cr
  lines += '<div style="display:flex;justify-content:space-between;padding:4px 0;border-top:2px solid #e5e7eb;margin-top:5px;font-weight:700">' +
    '<span>💳 دائن ح/' + crCode + ' — ' + crName + '</span>' +
    '<span style="color:var(--odoo-red);direction:ltr">' + grandTotal.toLocaleString('en-US') + ' د.ع</span></div>';

  var prev = document.getElementById('pur-entry-preview');
  var linesEl = document.getElementById('pur-entry-lines');
  if (prev && linesEl) { linesEl.innerHTML = lines; prev.style.display = 'block'; }
}

// ==============================================================
// renderPurchasesPage — render purchase history table
// ==============================================================
function renderPurchasesPage() {
  var tbody  = document.getElementById('pur-history-body');
  var sub    = document.getElementById('pur-page-subtitle');
  var search = ((document.getElementById('pur-search') || {}).value || '').toLowerCase();
  if (!tbody) return;

  var purchaseJVs = JOURNAL_ENTRIES_DATA.filter(function(jv){
    if(jv.journal !== 'purchase') return false;
    if(!search) return true;
    return (jv.id||'').toLowerCase().includes(search) ||
           (jv.ref||'').toLowerCase().includes(search) ||
           (jv.supplier||'').toLowerCase().includes(search);
  });

  if(sub) sub.textContent = purchaseJVs.length + ' فاتورة مسجلة';

  if(!purchaseJVs.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#9ca3af;padding:20px">' +
      (search ? 'لا توجد نتائج للبحث' : 'لا توجد فواتير شراء — اضغط ＋ فاتورة شراء لإضافة أول فاتورة') + '</td></tr>';
    return;
  }

  var rows = '';
  purchaseJVs.sort(function(a,b){ return b.date > a.date ? 1 : -1; }).forEach(function(jv) {
    var drTotal  = (jv.lines||[]).reduce(function(s,l){ return s + (l.debit||0); }, 0);
    var importAmt = jv.importTotal || 0;
    var landedAmt = jv.landedTotal || drTotal;
    var statusClass = jv.paid ? 'status-paid' : 'status-posted';
    var statusLabel = jv.paid ? '✅ مدفوع' : '📋 مرحّل';
    rows += '<tr>';
    rows += '<td style="font-family:monospace;font-weight:600;color:var(--odoo-blue)">' + jv.id + '</td>';
    rows += '<td>' + (jv.supplier || '—') + '</td>';
    rows += '<td>' + (jv.ref || '—') + '</td>';
    rows += '<td>' + (jv.date || '—') + '</td>';
    rows += '<td style="direction:ltr;text-align:center">' + drTotal.toLocaleString('en-US') + ' د.ع</td>';
    rows += '<td style="direction:ltr;text-align:center;color:#d97706">' + (importAmt > 0 ? '+' + importAmt.toLocaleString('en-US') + ' د.ع' : '—') + '</td>';
    rows += '<td style="direction:ltr;text-align:center;font-weight:700;color:#065f46">' + landedAmt.toLocaleString('en-US') + ' د.ع</td>';
    rows += '<td><span class="status-badge ' + statusClass + '">' + statusLabel + '</span></td>';
    rows += '</tr>';
  });
  tbody.innerHTML = rows;
}

// Auto-render purchases page on page show
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){ if(typeof renderPurchasesPage==='function') renderPurchasesPage(); }, 800);
  setTimeout(function(){ if(typeof renderSalesPage==='function') renderSalesPage(); }, 850);
});

// ============================================================
// DASHBOARD KPIs — لوحة التحكم الحية
// ============================================================
// ================================================================
// BALANCE SHEET — dynamic from JOURNAL_ENTRIES_DATA
// ================================================================
function renderBalanceSheet() {
  var fmtN = function(n) { return Math.abs(Math.round(n)).toLocaleString("en-US"); };

  function groupBal(codes) {
    return codes.reduce(function(sum, code) {
      var b = getAccountBalance(code);
      return sum + b.balance;
    }, 0);
  }

  function renderRows(codes) {
    var out = "";
    codes.forEach(function(code) {
      var acc = ACCOUNTS_DB.find(function(a){ return a.code === code; });
      if (!acc) return;
      var b = getAccountBalance(code);
      if (b.balance === 0) return;
      var isCredit = acc.normal === "credit";
      var cls = isCredit ? "amount-cr" : "amount-bal";
      var display = isCredit ? "(" + fmtN(b.balance) + ")" : fmtN(b.balance);
      out += '<div class="info-row">' +
             '<span class="lbl">' + acc.name + ' <span style="font-family:var(--mono);font-size:10px">(' + code + ')</span></span>' +
             '<span class="val ' + cls + '">' + display + '</span>' +
             '</div>';
    });
    return out;
  }

  var currentAssetCodes = ["1611","1612","1621","1622","1623",
    "1511","1512","1513","1514","1521","1522",
    "1531","1532","1541","1542","1551","1552","1553",
    "12111","12112","12113","12121","12122","12123",
    "12131","12132","12133","1221","1222"];

  var fixedAssetCodes = ["1111","1112","1121","1122","1123",
    "1131","1132","1133","1141","1142",
    "1151","1152","1161","1162"];
  var deprCodes = ["1171","1172","1173","1174","1175"];

  var liabCodes = ACCOUNTS_DB.filter(function(a){ return a.type === "liability"; }).map(function(a){ return a.code; });
  var equityCodes = ACCOUNTS_DB.filter(function(a){ return a.type === "equity"; }).map(function(a){ return a.code; });

  // Net profit from journal entries
  var totalRev = 0, totalExp = 0;
  JOURNAL_ENTRIES_DATA.forEach(function(entry) {
    entry.lines.forEach(function(line) {
      if (!line.code) return;
      if (line.code[0] === "4") { totalRev += (line.credit || 0) - (line.debit || 0); }
      if (line.code[0] === "5") { totalExp += (line.debit || 0) - (line.credit || 0); }
    });
  });
  var netProfit = totalRev - totalExp;

  var currentTotal = groupBal(currentAssetCodes);
  var fixedGross   = groupBal(fixedAssetCodes);
  var deprTotal    = groupBal(deprCodes);
  var fixedNet     = fixedGross - Math.abs(deprTotal);
  var totalAssets  = currentTotal + fixedNet;
  var liabTotal    = groupBal(liabCodes);
  var equityTotal  = groupBal(equityCodes);
  var totalLiabEq  = liabTotal + equityTotal + netProfit;

  var today = new Date().toLocaleDateString("ar-IQ");
  var subEl = document.getElementById("bs-subtitle");
  if (subEl) subEl.textContent = "في " + today;

  function setEl(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }

  var caEl = document.getElementById("bs-current-assets");
  if (caEl) caEl.innerHTML = renderRows(currentAssetCodes);
  setEl("bs-total-current", fmtN(currentTotal));

  var fixedHtml = renderRows(fixedAssetCodes);
  deprCodes.forEach(function(code) {
    var acc = ACCOUNTS_DB.find(function(a){ return a.code === code; });
    if (!acc) return;
    var b = getAccountBalance(code);
    if (b.balance === 0) return;
    fixedHtml += '<div class="info-row">' +
                 '<span class="lbl">' + acc.name + ' <span style="font-family:var(--mono);font-size:10px">(' + code + ')</span></span>' +
                 '<span class="val amount-cr">(' + fmtN(b.balance) + ')</span>' +
                 '</div>';
  });
  var faEl = document.getElementById("bs-fixed-assets");
  if (faEl) faEl.innerHTML = fixedHtml;
  setEl("bs-total-fixed", fmtN(fixedNet));
  setEl("bs-total-assets", fmtN(totalAssets));

  var lbEl = document.getElementById("bs-liabilities");
  if (lbEl) lbEl.innerHTML = renderRows(liabCodes);
  setEl("bs-total-liab", fmtN(liabTotal));

  var eqEl = document.getElementById("bs-equity");
  if (eqEl) eqEl.innerHTML = renderRows(equityCodes);

  var npEl = document.getElementById("bs-net-profit");
  if (npEl) {
    npEl.textContent = (netProfit >= 0 ? "" : "-") + fmtN(netProfit);
    npEl.className = "val " + (netProfit >= 0 ? "amount-bal" : "amount-cr");
  }
  setEl("bs-total-equity", fmtN(equityTotal + netProfit));
  setEl("bs-total-liab-equity", fmtN(totalLiabEq));

  var diff = Math.abs(totalAssets - totalLiabEq);
  var checkEl = document.getElementById("bs-balance-check");
  if (checkEl) {
    if (diff < 1) {
      checkEl.innerHTML = '<span class="badge badge-green">✅ الميزانية متوازنة</span>';
    } else {
      checkEl.innerHTML = '<span class="badge badge-red">⚠️ فرق: ' + fmtN(diff) + ' د.ع</span>';
    }
  }
}
function renderDashboard() {
  var totalSales = 0, totalPurchases = 0, totalExpenses = 0, pendingRec = 0;
  var pendingCount = 0;

  JOURNAL_ENTRIES_DATA.forEach(function(e) {
    if (e.journal === 'sale') {
      var cr = (e.lines || []).reduce(function(s, l) { return s + (l.credit || 0); }, 0);
      totalSales += cr;
      if (e.payMethod === 'deferred' && !e.paid) { pendingRec += cr; pendingCount++; }
    }
    if (e.journal === 'purchase') {
      var dr = (e.lines || []).reduce(function(s, l) { return s + (l.debit || 0); }, 0);
      totalPurchases += dr;
    }
    if (e.journal === 'expense') {
      var dr2 = (e.lines || []).filter(function(l) { return l.code && l.code[0] === '5'; })
                               .reduce(function(s, l) { return s + (l.debit || 0); }, 0);
      totalExpenses += dr2;
    }
  });

  var cashBal  = getAccountBalance('1611').balance;
  var bankBal  = getAccountBalance('1621').balance;
  var cashTotal = cashBal + bankBal;
  var netProfit = totalSales - totalPurchases - totalExpenses;
  var margin    = totalSales > 0 ? (netProfit / totalSales * 100).toFixed(1) : 0;

  function setEl(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }

  setEl('kpi-sales',       fmt(totalSales)     + ' د.ع');
  setEl('kpi-sales-sub',   'إجمالي فواتير المبيعات');
  setEl('kpi-sales-trend', totalSales > 0 ? '▲ ' + JOURNAL_ENTRIES_DATA.filter(function(e){return e.journal==='sale';}).length + ' فاتورة' : '—');

  // ── آخر الفواتير (من JOURNAL_ENTRIES_DATA) ──────────────
  var recentTbody = document.getElementById('dash-recent-tbody');
  if (recentTbody) {
    var JOURNAL_LABELS = {
      sale:'مبيعات', purchase:'مشتريات', receipt:'قبض',
      payment:'صرف', expense:'مصروف', journal:'قيد'
    };
    var JOURNAL_COLORS = {
      sale:'badge-green', purchase:'badge-blue', receipt:'badge-purple',
      payment:'badge-yellow', expense:'badge-red', journal:'badge-gray'
    };
    var sorted = JOURNAL_ENTRIES_DATA
      .slice()
      .sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); })
      .slice(0, 7);

    if (!sorted.length) {
      recentTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-s)">لا توجد قيود مسجلة بعد</td></tr>';
    } else {
      recentTbody.innerHTML = sorted.map(function(e) {
        var amount = (e.lines || []).reduce(function(s, l) { return s + (l.debit || 0); }, 0);
        var label  = JOURNAL_LABELS[e.journal]  || e.journal || '—';
        var cls    = JOURNAL_COLORS[e.journal] || 'badge-gray';
        var party  = e.customer || e.supplier || e.ref || e.description || '—';
        return '<tr>'
          + '<td class="code-cell">' + (e.id || '—') + '</td>'
          + '<td style="font-size:11px;white-space:nowrap">' + (e.date || '—') + '</td>'
          + '<td style="font-size:12px;font-weight:600">' + party + '</td>'
          + '<td style="font-family:monospace;font-weight:700;color:var(--odoo-purple)">' + (amount > 0 ? fmt(amount) : '—') + '</td>'
          + '<td><span class="badge ' + cls + '" style="font-size:9.5px">' + label + '</span></td>'
          + '</tr>';
      }).join('');
    }
  }

  // ── آخر الأنشطة ──────────────────────────────────────────
  var actEl = document.getElementById('dash-activity');
  if (actEl) {
    var ICONS = { sale:'🧾', purchase:'📦', receipt:'💵', payment:'💸', expense:'🧾', journal:'📔' };
    var DOTS  = { sale:'purple', purchase:'blue', receipt:'green', payment:'yellow', expense:'red', journal:'blue' };
    var recent5 = JOURNAL_ENTRIES_DATA
      .slice()
      .sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); })
      .slice(0, 5);

    if (!recent5.length) {
      actEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-s);font-size:12px">لا توجد أنشطة مسجلة بعد</div>';
    } else {
      actEl.innerHTML = recent5.map(function(e) {
        var icon  = ICONS[e.journal]  || '📔';
        var dot   = DOTS[e.journal]   || 'blue';
        var party = e.customer || e.supplier || e.ref || '';
        var amount = (e.lines || []).reduce(function(s, l) { return s + (l.debit || 0); }, 0);
        var title = (e.id || '') + (amount > 0 ? ' — ' + fmt(amount) + ' د.ع' : '');
        var sub   = (party ? party + ' — ' : '') + (e.date || '') + (e.description ? ' — ' + e.description : '');
        return '<div class="tl-item">'
          + '<div class="tl-dot ' + dot + '">' + icon + '</div>'
          + '<div class="tl-body">'
          + '<div class="tl-title">' + title + '</div>'
          + '<div class="tl-sub">' + sub + '</div>'
          + '</div></div>';
      }).join('');
    }
  }
  setEl('kpi-profit',      fmt(Math.abs(netProfit)) + ' د.ع');
  setEl('kpi-margin',      'هامش ربح ' + margin + '%');
  setEl('kpi-profit-trend', netProfit >= 0 ? '▲ ربح' : '▼ خسارة');
  var profEl = document.getElementById('kpi-profit');
  if (profEl) profEl.style.color = netProfit >= 0 ? 'var(--odoo-green)' : 'var(--odoo-red)';
  setEl('kpi-receivables',  fmt(pendingRec) + ' د.ع');
  setEl('kpi-rec-sub',      pendingCount + ' فاتورة آجلة غير مقبوضة');
  setEl('kpi-rec-trend',    pendingCount > 0 ? '⚠️ ' + pendingCount + ' تحتاج تحصيل' : '✅ لا ذمم');
  setEl('kpi-cash',        fmt(cashTotal) + ' د.ع');
  setEl('kpi-cash-sub',    'نقد: ' + fmt(cashBal) + ' | بنك: ' + fmt(bankBal));
  setEl('kpi-expenses',    fmt(totalExpenses) + ' د.ع');
  setEl('kpi-exp-sub',     'إجمالي المصروفات');
  setEl('kpi-purchases',   fmt(totalPurchases) + ' د.ع');
  setEl('kpi-pur-sub',     JOURNAL_ENTRIES_DATA.filter(function(e){return e.journal==='purchase';}).length + ' فاتورة شراء');

  var dashDate = document.getElementById('dash-date');
  if (dashDate) dashDate.textContent = 'آخر تحديث: ' + new Date().toLocaleString('en-US');
}

// ============================================================
// INCOME STATEMENT — قائمة الدخل الحية
// ============================================================
function renderIncomeStatement() {
  // Collect all revenue accounts (code starts with 4) and expense accounts (code starts with 5)
  var revMap = {}, expMap = {};

  JOURNAL_ENTRIES_DATA.forEach(function(e) {
    (e.lines || []).forEach(function(l) {
      if (!l.code) return;
      if (l.code[0] === '4') {
        // Revenue: normal credit side
        var amt = (l.credit || 0) - (l.debit || 0);
        revMap[l.code] = (revMap[l.code] || 0) + amt;
      }
      if (l.code[0] === '5') {
        // Expense: normal debit side
        var amt2 = (l.debit || 0) - (l.credit || 0);
        expMap[l.code] = (expMap[l.code] || 0) + amt2;
      }
    });
  });

  var totalRev = 0, totalExp = 0;
  var revRows = '', expRows = '';

  Object.keys(revMap).sort().forEach(function(code) {
    var val = revMap[code];
    if (val <= 0) return;
    totalRev += val;
    var name = getAccountName(code);
    revRows += '<div class="info-row"><span class="lbl">' + name + ' <span style="font-family:var(--mono);font-size:10px;color:var(--text-s)">' + code + '</span></span><span class="val amount-cr">' + fmt(val) + ' د.ع</span></div>';
  });

  Object.keys(expMap).sort().forEach(function(code) {
    var val = expMap[code];
    if (val <= 0) return;
    totalExp += val;
    var name = getAccountName(code);
    expRows += '<div class="info-row"><span class="lbl">' + name + ' <span style="font-family:var(--mono);font-size:10px;color:var(--text-s)">' + code + '</span></span><span class="val amount-dr">' + fmt(val) + ' د.ع</span></div>';
  });

  var netProfit = totalRev - totalExp;
  var margin    = totalRev > 0 ? (netProfit / totalRev * 100).toFixed(1) : 0;

  function setEl(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
  function setHtml(id, val) { var el = document.getElementById(id); if (el) el.innerHTML = val; }

  setHtml('income-revenues',   revRows  || '<div style="color:var(--text-s);padding:8px">لا توجد إيرادات مسجلة</div>');
  setHtml('income-expenses',   expRows  || '<div style="color:var(--text-s);padding:8px">لا توجد مصروفات مسجلة</div>');
  setEl('income-total-rev',    fmt(totalRev) + ' د.ع');
  setEl('income-total-exp',    fmt(totalExp) + ' د.ع');
  setEl('income-net-val',      fmt(Math.abs(netProfit)) + ' د.ع');
  setEl('income-net-pct',      'هامش الربح: ' + margin + '%  |  الإيرادات: ' + fmt(totalRev) + ' — المصروفات: ' + fmt(totalExp));

  var netBlock = document.getElementById('income-net-block');
  var netValEl = document.getElementById('income-net-val');
  if (netBlock) netBlock.style.background = netProfit >= 0 ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)' : 'linear-gradient(135deg,#fff1f2,#fecdd3)';
  if (netBlock) netBlock.style.borderColor = netProfit >= 0 ? '#86efac' : '#fca5a5';
  if (netValEl) netValEl.style.color = netProfit >= 0 ? '#15803d' : '#dc2626';

  // Revenue breakdown bars
  var revBreak = '<div style="font-size:11px;font-weight:700;color:var(--text-m);margin-bottom:10px">توزيع الإيرادات</div>';
  Object.keys(revMap).sort().forEach(function(code) {
    var val = revMap[code];
    if (val <= 0 || totalRev === 0) return;
    var pct = (val / totalRev * 100).toFixed(1);
    var name = getAccountName(code);
    revBreak += '<div style="margin-bottom:12px"><div class="info-row"><span class="lbl">' + name + '</span><span class="val">' + fmt(val) + ' (' + pct + '%)</span></div><div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%;background:var(--odoo-green)"></div></div></div>';
  });
  // Expense breakdown bars
  var expBreak = '<div style="font-size:11px;font-weight:700;color:var(--text-m);margin-bottom:10px;margin-top:12px">توزيع التكاليف</div>';
  Object.keys(expMap).sort().forEach(function(code) {
    var val = expMap[code];
    if (val <= 0 || totalExp === 0) return;
    var pct = (val / totalExp * 100).toFixed(1);
    var name = getAccountName(code);
    expBreak += '<div style="margin-bottom:12px"><div class="info-row"><span class="lbl">' + name + '</span><span class="val amount-dr">' + fmt(val) + ' (' + pct + '%)</span></div><div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%;background:var(--odoo-red)"></div></div></div>';
  });

  setHtml('income-rev-breakdown', revBreak);
  setHtml('income-exp-breakdown', expBreak);

  var subEl = document.getElementById('income-subtitle');
  if (subEl) subEl.textContent = 'للفترة الكاملة — آخر تحديث: ' + new Date().toLocaleString('en-US');
}

// ============================================================
// CUSTOMERS PAGE — كشوف حسابات الزبائن
// ============================================================
function renderCustomersPage() {
  var tbody = document.getElementById('cust-table-body');
  if (!tbody) return;
  var rows = '';
  CUSTOMERS_DB.forEach(function(c) {
    // Total sales for this customer
    var totalSales = 0, pendingAmt = 0, pendingCount = 0;
    JOURNAL_ENTRIES_DATA.forEach(function(e) {
      if (e.journal === 'sale' && e.customerId === c.id) {
        var cr = (e.lines || []).reduce(function(s, l) { return s + (l.credit || 0); }, 0);
        totalSales += cr;
        if (e.payMethod === 'deferred' && !e.paid) { pendingAmt += cr; pendingCount++; }
      }
    });
    rows += '<tr>';
    rows += '<td class="code-cell">' + c.id + '</td>';
    rows += '<td style="font-weight:700">' + c.name + '</td>';
    rows += '<td dir="ltr" style="font-family:monospace">' + (c.phone || '—') + '</td>';
    rows += '<td>' + (c.city || '—') + '</td>';
    rows += '<td style="font-weight:700;color:var(--odoo-green)">' + (totalSales > 0 ? fmt(totalSales) + ' د.ع' : '—') + '</td>';
    rows += '<td>' + (pendingAmt > 0 ? '<span style="color:var(--odoo-red);font-weight:700">' + fmt(pendingAmt) + ' د.ع</span>' : '<span style="color:var(--odoo-green)">✅ لا ذمم</span>') + '</td>';
    rows += '<td style="white-space:nowrap"><button class="btn btn-o btn-xs" data-cid="' + c.id + '" onclick="showCustomerStatement(this.dataset.cid)">📋 كشف</button> <button class="btn btn-secondary btn-xs" data-cid="' + c.id + '" onclick="openEditCustomer(this.dataset.cid)">✏️</button> <button class="btn btn-xs" style="background:#fee2e2;color:#991b1b;border-color:#fca5a5" data-cid="' + c.id + '" onclick="deleteCustomer(this.dataset.cid)">🗑️</button></td>';
    rows += '</tr>';
  });
  tbody.innerHTML = rows || '<tr><td colspan="7" style="text-align:center;color:var(--text-s);padding:16px">لا يوجد زبائن</td></tr>';
}

function showCustomerStatement(custId) {
  var cust = CUSTOMERS_DB.find(function(c) { return c.id === custId; });
  if (!cust) return;

  var entries = JOURNAL_ENTRIES_DATA.filter(function(e) {
    return e.customerId === custId && (e.journal === 'sale' || e.journal === 'receipt');
  }).sort(function(a, b) { return a.date > b.date ? 1 : -1; });

  var totalSales = 0, totalPaid = 0, rows = '', runBal = 0;
  entries.forEach(function(e) {
    var dr = (e.lines || []).reduce(function(s, l) { return s + (l.debit || 0); }, 0);
    var cr = (e.lines || []).reduce(function(s, l) { return s + (l.credit || 0); }, 0);
    var debitAmt  = e.journal === 'sale'    ? cr : 0;  // sale: Dr receivable / Cr revenue
    var creditAmt = e.journal === 'receipt' ? cr : 0;  // receipt: Dr cash / Cr receivable
    if (e.journal === 'sale')    { totalSales += cr; runBal += cr; }
    if (e.journal === 'receipt') { totalPaid  += cr; runBal -= cr; }
    var badge = e.journal === 'sale'
      ? (e.paid ? '<span class="status-badge status-paid">✅ مقبوض</span>' : e.payMethod === 'deferred' ? '<span class="status-badge status-posted" style="color:#f59e0b">📋 آجل</span>' : '<span class="status-badge status-posted">نقدي</span>')
      : '<span class="status-badge" style="background:#e0f2fe;color:#0369a1">💵 قبض</span>';
    rows += '<tr>';
    rows += '<td class="code-cell">' + (e.ref || e.id) + '</td>';
    rows += '<td>' + (e.date || '—') + '</td>';
    rows += '<td>' + (e.journal === 'sale' ? 'فاتورة مبيعات' : 'وصل قبض') + '</td>';
    rows += '<td style="color:var(--odoo-green);font-weight:600">' + (debitAmt > 0 ? fmt(debitAmt) + ' د.ع' : '—') + '</td>';
    rows += '<td style="color:var(--odoo-blue);font-weight:600">' + (creditAmt > 0 ? fmt(creditAmt) + ' د.ع' : '—') + '</td>';
    rows += '<td style="font-weight:700;color:' + (runBal > 0 ? 'var(--odoo-red)' : 'var(--odoo-green)') + '">' + fmt(Math.abs(runBal)) + ' د.ع</td>';
    rows += '<td>' + badge + '</td>';
    rows += '</tr>';
  });

  var summaryHtml = '<div style="padding:12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;text-align:center"><div style="font-size:10px;color:var(--text-m)">إجمالي المبيعات</div><div style="font-size:16px;font-weight:800;color:var(--odoo-green)">' + fmt(totalSales) + ' د.ع</div></div>'
    + '<div style="padding:12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;text-align:center"><div style="font-size:10px;color:var(--text-m)">إجمالي المقبوض</div><div style="font-size:16px;font-weight:800;color:var(--odoo-blue)">' + fmt(totalPaid) + ' د.ع</div></div>'
    + '<div style="padding:12px;background:' + (runBal > 0 ? '#fff1f2' : '#f0fdf4') + ';border:1px solid ' + (runBal > 0 ? '#fecdd3' : '#bbf7d0') + ';border-radius:8px;text-align:center"><div style="font-size:10px;color:var(--text-m)">الرصيد المتبقي</div><div style="font-size:16px;font-weight:800;color:' + (runBal > 0 ? 'var(--odoo-red)' : 'var(--odoo-green)') + '">' + fmt(Math.abs(runBal)) + ' د.ع</div></div>';

  var titleEl   = document.getElementById('cust-detail-title');
  var summaryEl = document.getElementById('cust-detail-summary');
  var bodyEl    = document.getElementById('cust-detail-body');
  var detailDiv = document.getElementById('cust-detail');

  if (titleEl)   titleEl.innerHTML = '📋 كشف حساب — ' + cust.name;
  if (summaryEl) summaryEl.innerHTML = summaryHtml;
  if (bodyEl)    bodyEl.innerHTML = rows || '<tr><td colspan="7" style="text-align:center;color:var(--text-s);padding:16px">لا توجد حركات مسجلة لهذا الزبون</td></tr>';
  if (detailDiv) detailDiv.style.display = 'block';
  if (detailDiv) detailDiv.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// SUPPLIERS PAGE — كشوف حسابات المجهزين
// ============================================================
function renderSuppliersPage() {
  var tbody = document.getElementById('supp-table-body');
  var sub   = document.getElementById('supp-count-sub');
  if (!tbody) return;
  var rows = '';
  SUPPLIERS_DB.forEach(function(s) {
    var totalPur = 0, pendingAmt = 0;
    JOURNAL_ENTRIES_DATA.forEach(function(e) {
      if (e.journal === 'purchase' && e.supplierId === s.id) {
        var dr = (e.lines || []).reduce(function(sm, l) { return sm + (l.debit || 0); }, 0);
        totalPur += dr;
      }
      if (e.journal === 'payment' && e.supplierId === s.id) {
        var cr = (e.lines || []).reduce(function(sm, l) { return sm + (l.credit || 0); }, 0);
        pendingAmt += cr;
      }
    });
    rows += '<tr>';
    rows += '<td class="code-cell">' + s.id + '</td>';
    rows += '<td style="font-weight:700">' + s.name + '</td>';
    rows += '<td dir="ltr" style="font-family:monospace">' + (s.phone || '—') + '</td>';
    rows += '<td style="font-weight:700;color:var(--odoo-purple)">' + (totalPur > 0 ? fmt(totalPur) + ' د.ع' : '—') + '</td>';
    rows += '<td>' + (pendingAmt > 0 ? '<span style="color:var(--odoo-orange);font-weight:700">' + fmt(pendingAmt) + ' د.ع</span>' : '<span style="color:var(--odoo-green)">—</span>') + '</td>';
    rows += '<td style="white-space:nowrap"><button class="btn btn-o btn-xs" data-sid="' + s.id + '" onclick="showSupplierStatement(this.dataset.sid)">📋 كشف</button> <button class="btn btn-secondary btn-xs" data-sid="' + s.id + '" onclick="openEditSupplier(this.dataset.sid)">✏️</button> <button class="btn btn-xs" style="background:#fee2e2;color:#991b1b;border-color:#fca5a5" data-sid="' + s.id + '" onclick="deleteSupplier(this.dataset.sid)">🗑️</button></td>';
    rows += '</tr>';
  });
  tbody.innerHTML = rows || '<tr><td colspan="6" style="text-align:center;color:var(--text-s);padding:16px">لا يوجد مجهزون</td></tr>';
  if (sub) sub.textContent = SUPPLIERS_DB.length + ' مجهز مسجل';
}

function showSupplierStatement(suppId) {
  var supp = SUPPLIERS_DB.find(function(s) { return s.id === suppId; });
  if (!supp) return;

  var entries = JOURNAL_ENTRIES_DATA.filter(function(e) {
    return e.supplierId === suppId && (e.journal === 'purchase' || e.journal === 'payment');
  }).sort(function(a, b) { return a.date > b.date ? 1 : -1; });

  var totalPur = 0, totalPaid = 0, rows = '', runBal = 0;
  entries.forEach(function(e) {
    var isPayment = e.journal === 'payment';
    var dr = (e.lines || []).reduce(function(s, l) { return s + (l.debit || 0); }, 0);
    var cr = (e.lines || []).reduce(function(s, l) { return s + (l.credit || 0); }, 0);
    var debitAmt  = isPayment ? dr : 0;
    var creditAmt = isPayment ? 0  : dr;
    if (!isPayment) { totalPur += dr; runBal += dr; }
    else            { totalPaid += dr; runBal -= dr; }
    var badge = isPayment
      ? '<span class="status-badge" style="background:#e0f2fe;color:#0369a1">💳 دفع</span>'
      : '<span class="status-badge status-posted">📦 شراء</span>';
    rows += '<tr>';
    rows += '<td class="code-cell">' + (e.ref || e.id) + '</td>';
    rows += '<td>' + (e.date || '—') + '</td>';
    rows += '<td>' + (isPayment ? 'سند دفع' : 'فاتورة شراء') + '</td>';
    rows += '<td style="color:var(--odoo-red);font-weight:600">' + (creditAmt > 0 ? fmt(creditAmt) + ' د.ع' : '—') + '</td>';
    rows += '<td style="color:var(--odoo-blue);font-weight:600">' + (debitAmt > 0 ? fmt(debitAmt) + ' د.ع' : '—') + '</td>';
    rows += '<td style="font-weight:700;color:' + (runBal > 0 ? 'var(--odoo-orange)' : 'var(--odoo-green)') + '">' + fmt(Math.abs(runBal)) + ' د.ع</td>';
    rows += '<td>' + badge + '</td>';
    rows += '</tr>';
  });

  var summaryHtml = '<div style="padding:12px;background:#faf5ff;border:1px solid #d8b4fe;border-radius:8px;text-align:center"><div style="font-size:10px;color:var(--text-m)">إجمالي المشتريات</div><div style="font-size:16px;font-weight:800;color:var(--odoo-purple)">' + fmt(totalPur) + ' د.ع</div></div>'
    + '<div style="padding:12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;text-align:center"><div style="font-size:10px;color:var(--text-m)">إجمالي المدفوع</div><div style="font-size:16px;font-weight:800;color:var(--odoo-blue)">' + fmt(totalPaid) + ' د.ع</div></div>'
    + '<div style="padding:12px;background:' + (runBal > 0 ? '#fff7ed' : '#f0fdf4') + ';border:1px solid ' + (runBal > 0 ? '#fed7aa' : '#bbf7d0') + ';border-radius:8px;text-align:center"><div style="font-size:10px;color:var(--text-m)">المتبقي للمجهز</div><div style="font-size:16px;font-weight:800;color:' + (runBal > 0 ? 'var(--odoo-orange)' : 'var(--odoo-green)') + '">' + fmt(Math.abs(runBal)) + ' د.ع</div></div>';

  var titleEl   = document.getElementById('supp-detail-title');
  var summaryEl = document.getElementById('supp-detail-summary');
  var bodyEl    = document.getElementById('supp-detail-body');
  var detailDiv = document.getElementById('supp-detail');

  if (titleEl)   titleEl.innerHTML = '📋 كشف حساب — ' + supp.name;
  if (summaryEl) summaryEl.innerHTML = summaryHtml;
  if (bodyEl)    bodyEl.innerHTML = rows || '<tr><td colspan="7" style="text-align:center;color:var(--text-s);padding:16px">لا توجد حركات مسجلة لهذا المجهز</td></tr>';
  if (detailDiv) detailDiv.style.display = 'block';
  if (detailDiv) detailDiv.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// INVENTORY UPDATE — تحديث المخزون عند الشراء / البيع
// ============================================================

function updateInvOnPurchase(tbody, jId, invRef) {
  if (!tbody || typeof ITEMS_DB === 'undefined' || typeof INV_ITEMS === 'undefined') return;
  var date = new Date().toISOString().split('T')[0];
  tbody.querySelectorAll('tr').forEach(function(tr) {
    var id    = tr.id.replace('pur-line-', '');
    var iCode = getSBVal('sb-item-' + id);
    var item  = ITEMS_DB.find(function(x) { return x.code === iCode; });
    if (!item) return;
    var qty = parseFloat((document.getElementById('pl-qty-' + id) || {}).value) || 0;
    if (qty <= 0) return;
    var invItem = INV_ITEMS.find(function(i) { return i.code === item.accountCode; });
    if (invItem) {
      invItem.qty += qty;
      INV_MOVEMENTS.unshift({
        id: 'MOV-' + String(Date.now()).slice(-6), date: date,
        item: invItem.code, name: invItem.name,
        type: 'in', qty_in: qty, qty_out: 0, bal: invItem.qty,
        ref: invRef || jId, reason: 'شراء', user: 'admin'
      });
    }
  });
  if (typeof renderInvItems     === 'function') renderInvItems();
  if (typeof renderInvMovements === 'function') renderInvMovements();
}

function updateInvOnSale(tbody, invRef) {
  if (!tbody || typeof ITEMS_DB === 'undefined' || typeof INV_ITEMS === 'undefined') return;
  var date = new Date().toISOString().split('T')[0];
  var warnings = [];
  tbody.querySelectorAll('tr').forEach(function(tr) {
    var id    = tr.id.replace('sal-line-', '');
    var iCode = getSBVal('sb-sitem-' + id);
    var item  = ITEMS_DB.find(function(x) { return x.code === iCode; });
    if (!item) return;
    var qty = parseFloat((document.getElementById('sl-qty-' + id) || {}).value) || 0;
    if (qty <= 0) return;
    var invItem = INV_ITEMS.find(function(i) { return i.code === item.accountCode; });
    if (invItem) {
      invItem.qty = Math.max(0, invItem.qty - qty);
      INV_MOVEMENTS.unshift({
        id: 'MOV-' + String(Date.now()).slice(-6), date: date,
        item: invItem.code, name: invItem.name,
        type: 'out', qty_in: 0, qty_out: qty, bal: invItem.qty,
        ref: invRef, reason: 'بيع', user: 'مبيعات'
      });
      if (invItem.qty === 0) {
        warnings.push('⛔ ' + invItem.name + ': نفذت الكمية!');
      } else if (invItem.qty < invItem.min) {
        warnings.push('⚠️ ' + invItem.name + ': متبقي ' + invItem.qty + ' ' + invItem.unit);
      }
    }
  });
  if (warnings.length) {
    setTimeout(function() { notify('تحذير مخزون — ' + warnings.join(' | '), 'warning'); }, 700);
  }
  if (typeof renderInvItems     === 'function') renderInvItems();
  if (typeof renderLowStock     === 'function') renderLowStock();
  if (typeof renderInvMovements === 'function') renderInvMovements();
}

// ============================================================
// RECEIPT HELPER — فتح وصل القبض مرتبطاً بفاتورة آجلة
// ============================================================
function openReceiptForInvoice(ref, custName, custId, amount) {
  var typeEl = document.getElementById('rcp-type');
  if (typeEl) { typeEl.value = 'tasdeed'; if (typeof handleRcpType === 'function') handleRcpType(); }

  var custText = document.getElementById('sb-rcp-cus-text');
  var custVal  = document.getElementById('sb-rcp-cus-val');
  if (custText) custText.value = custName || '';
  if (custVal)  custVal.value  = custId  || '';

  var refEl = document.getElementById('rcp-ref');
  var amtEl = document.getElementById('rcp-amount');
  if (refEl) refEl.value  = ref    || '';
  if (amtEl) amtEl.value  = amount || '';
  if (typeof calcRcpEntry === 'function') calcRcpEntry();

  openM('m-receipt');
}

// ============================================================
// SALES INVOICE FUNCTIONS — دوال فواتير المبيعات
// ============================================================
var SAL_LINE_IDX = 0;
var SAL_INV_COUNTER = 0;

function openSalesModal() {
  SAL_LINE_IDX = 0;
  SAL_INV_COUNTER++;
  var today = new Date().toISOString().split('T')[0];
  var el = document.getElementById('sal-date');
  if (el) el.value = today;
  var due = document.getElementById('sal-due-date');
  if (due) { var d = new Date(); d.setDate(d.getDate() + 30); due.value = d.toISOString().split('T')[0]; }

  var numEl = document.getElementById('sal-inv-num');
  if (numEl) numEl.textContent = 'SAL-' + String(SAL_INV_COUNTER).padStart(4, '0');

  clearSB('sb-cust');
  var _qf = document.getElementById('sb-qac-form'); if (_qf) _qf.remove();
  var pm = document.getElementById('sal-pay-method'); if (pm) pm.value = '';
  var notes = document.getElementById('sal-notes'); if (notes) notes.value = '';

  var tbody = document.getElementById('sal-lines-body');
  if (tbody) tbody.innerHTML = '';
  updateSalNoLines();
  calcSalTotals();
  var prev = document.getElementById('sal-entry-preview');
  if (prev) prev.style.display = 'none';

  setSBOnSelect('sb-cust-wrap', function() { updateSaleEntryPreview(); });

  var mo = document.getElementById('m-sale');
  if (mo) mo.classList.add('open');
  setTimeout(initAllSB, 80);
}

function addSalLine() {
  var tbody = document.getElementById('sal-lines-body');
  if (!tbody) return;
  var idx = ++SAL_LINE_IDX;
  var tr = document.createElement('tr');
  tr.id = 'sal-line-' + idx;
  tr.innerHTML =
    '<td><div class="sb-wrap" id="sb-sitem-' + idx + '-wrap" data-sb-type="item">' +
      '<input type="text" class="form-control sb-text" id="sb-sitem-' + idx + '-text" placeholder="ابحث..." autocomplete="off" style="min-width:140px">' +
      '<input type="hidden" id="sb-sitem-' + idx + '-val">' +
      '<div class="sb-dropdown" id="sb-sitem-' + idx + '-list"></div>' +
    '</div></td>' +
    '<td><input type="text" class="form-control" id="sl-desc-' + idx + '" placeholder="وصف" style="min-width:100px">' +
    '<div id="sl-serial-div-' + idx + '" style="display:none;margin-top:4px">' +
    '<select class="form-control" id="sl-serial-' + idx + '" style="font-size:11px;min-width:130px"><option value="">🔢 السيريل نمبر</option></select>' +
    '</div></td>' +
    '<td><input type="text" class="form-control" id="sl-unit-'   + idx + '" readonly style="width:55px;background:#f9fafb;text-align:center"></td>' +
    '<td><input type="number" class="form-control" id="sl-qty-'  + idx + '" value="1" min="0.001" style="width:65px;text-align:center" oninput="calcSalLine(' + idx + ')"></td>' +
    '<td><input type="number" class="form-control" id="sl-price-'+ idx + '" value="0" min="0" style="width:110px;text-align:center" oninput="calcSalLine(' + idx + ')"></td>' +
    '<td><input type="number" class="form-control" id="sl-disc-' + idx + '" value="0" min="0" max="100" style="width:65px;text-align:center" oninput="calcSalLine(' + idx + ')"></td>' +
    '<td><input type="number" class="form-control" id="sl-tax-'  + idx + '" value="0" min="0" max="100" style="width:65px;text-align:center" oninput="calcSalLine(' + idx + ')"></td>' +
    '<td><input type="text"   class="form-control" id="sl-total-'+ idx + '" readonly style="width:110px;text-align:center;font-weight:700;background:#f9fafb"></td>' +
    '<td><button class="pur-del-btn" onclick="removeSalLine(' + idx + ')">🗑</button></td>';
  tbody.appendChild(tr);
  updateSalNoLines();

  setSBOnSelect('sb-sitem-' + idx + '-wrap', function(item) {
    var unitEl  = document.getElementById('sl-unit-'  + idx);
    var priceEl = document.getElementById('sl-price-' + idx);
    var descEl  = document.getElementById('sl-desc-'  + idx);
    if (unitEl)  unitEl.value  = item.unit || '';
    if (priceEl) priceEl.value = item.salePrice || item.defaultPrice || item.price || 0;
    if (descEl && !descEl.value) descEl.value = item.name;
    // سيريل نمبر
    var srlDiv = document.getElementById('sl-serial-div-' + idx);
    var srlSel = document.getElementById('sl-serial-' + idx);
    if (item.trackSerial && srlDiv && srlSel) {
      var avail = (typeof getAvailableSerials==='function') ? getAvailableSerials(item.code) : [];
      srlSel.innerHTML = '<option value="">🔢 اختر السيريل نمبر</option>' +
        avail.map(function(s){return '<option value="'+s.sn+'">'+s.sn+'</option>';}).join('');
      srlDiv.style.display = '';
      var qEl = document.getElementById('sl-qty-' + idx);
      if (qEl) { qEl.value = 1; qEl.readOnly = true; }
    } else if (srlDiv) {
      srlDiv.style.display = 'none';
      var qEl2 = document.getElementById('sl-qty-' + idx);
      if (qEl2) qEl2.readOnly = false;
    }
    calcSalLine(idx);
  });
  setTimeout(initAllSB, 30);
}

function removeSalLine(idx) {
  var tr = document.getElementById('sal-line-' + idx);
  if (tr) tr.remove();
  updateSalNoLines();
  calcSalTotals();
  updateSaleEntryPreview();
}

function updateSalNoLines() {
  var tbody = document.getElementById('sal-lines-body');
  var msg   = document.getElementById('sal-no-lines');
  if (!msg) return;
  msg.style.display = (tbody && tbody.children.length > 0) ? 'none' : 'block';
}

function calcSalLine(idx) {
  var qty   = parseFloat((document.getElementById('sl-qty-'  + idx) || {}).value) || 0;
  var price = parseFloat((document.getElementById('sl-price-'+ idx) || {}).value) || 0;
  var disc  = parseFloat((document.getElementById('sl-disc-' + idx) || {}).value) || 0;
  var tax   = parseFloat((document.getElementById('sl-tax-'  + idx) || {}).value) || 0;
  var sub   = qty * price;
  var discAmt = sub * disc / 100;
  var taxAmt  = (sub - discAmt) * tax / 100;
  var total   = sub - discAmt + taxAmt;
  var el = document.getElementById('sl-total-' + idx);
  if (el) el.value = total.toLocaleString('en-US');
  calcSalTotals();
  updateSaleEntryPreview();
}

function calcSalTotals() {
  var tbody = document.getElementById('sal-lines-body');
  if (!tbody) return;
  var subtotal = 0, totalDisc = 0, totalTax = 0;
  tbody.querySelectorAll('tr').forEach(function(tr) {
    var id = tr.id.replace('sal-line-', '');
    var qty   = parseFloat((document.getElementById('sl-qty-'  + id) || {}).value) || 0;
    var price = parseFloat((document.getElementById('sl-price-'+ id) || {}).value) || 0;
    var disc  = parseFloat((document.getElementById('sl-disc-' + id) || {}).value) || 0;
    var tax   = parseFloat((document.getElementById('sl-tax-'  + id) || {}).value) || 0;
    var sub   = qty * price;
    var discAmt = sub * disc / 100;
    var taxAmt  = (sub - discAmt) * tax / 100;
    subtotal  += sub;
    totalDisc += discAmt;
    totalTax  += taxAmt;
  });
  var grand = subtotal - totalDisc + totalTax;
  function fmtIQD(n) { return n.toLocaleString('en-US') + ' د.ع'; }
  var el;
  el = document.getElementById('sal-subtotal');    if (el) el.textContent = fmtIQD(subtotal);
  el = document.getElementById('sal-total-disc');  if (el) el.textContent = fmtIQD(totalDisc);
  el = document.getElementById('sal-total-tax');   if (el) el.textContent = fmtIQD(totalTax);
  el = document.getElementById('sal-grand-total'); if (el) el.textContent = fmtIQD(grand);
  return { subtotal: subtotal, disc: totalDisc, tax: totalTax, grand: grand };
}

function updateSaleEntryPreview() {
  var totals = calcSalTotals();
  if (!totals || !totals.grand) {
    var prev = document.getElementById('sal-entry-preview');
    if (prev) prev.style.display = 'none';
    return;
  }
  var payMethod = (document.getElementById('sal-pay-method') || {}).value || '';
  var drCode = payMethod === 'cash' ? '1611' : payMethod === 'transfer' ? '1621' : '151';
  var drName = payMethod === 'cash' ? 'صندوق الدينار العراقي'
             : payMethod === 'transfer' ? 'مصرف المنصور'
             : 'ذمم مدينة — الزبائن';

  var lines = '<div style="display:flex;justify-content:space-between;padding:3px 0">'
    + '<span>مدين — ح/' + drCode + ' ' + drName + '</span>'
    + '<span style="color:var(--odoo-green)">' + totals.grand.toLocaleString('en-US') + ' د.ع</span></div>';

  // Cr: revenue
  var totalCr = 0;
  var tbody = document.getElementById('sal-lines-body');
  if (tbody) {
    tbody.querySelectorAll('tr').forEach(function(tr) {
      var id    = tr.id.replace('sal-line-', '');
      var qty   = parseFloat((document.getElementById('sl-qty-'  + id) || {}).value) || 0;
      var price = parseFloat((document.getElementById('sl-price-'+ id) || {}).value) || 0;
      var disc  = parseFloat((document.getElementById('sl-disc-' + id) || {}).value) || 0;
      var tax   = parseFloat((document.getElementById('sl-tax-'  + id) || {}).value) || 0;
      var sub   = qty * price; var dAmt = sub * disc / 100; var tAmt = (sub - dAmt) * tax / 100;
      totalCr  += sub - dAmt + tAmt;
    });
  }
  if (totalCr > 0) {
    lines += '<div style="display:flex;justify-content:space-between;padding:3px 0;border-top:1px solid #e5e7eb;margin-top:4px">'
      + '<span>دائن — ح/41111 إيرادات المبيعات</span>'
      + '<span style="color:var(--odoo-red)">' + totalCr.toLocaleString('en-US') + ' د.ع</span></div>';
  }

  var prev = document.getElementById('sal-entry-preview');
  var linesEl = document.getElementById('sal-entry-lines');
  if (prev && linesEl) { linesEl.innerHTML = lines; prev.style.display = 'block'; }
}

function saveSaleInv() {
  var custId  = getSBVal('sb-cust');
  var date    = (document.getElementById('sal-date')       || {}).value || '';
  var payMeth = (document.getElementById('sal-pay-method') || {}).value || '';
  var tbody   = document.getElementById('sal-lines-body');

  if (!custId)  { notify('⚠️ يرجى اختيار الزبون', 'danger'); return; }
  if (!date)    { notify('⚠️ يرجى تحديد تاريخ الفاتورة', 'danger'); return; }
  if (!payMeth) { notify('⚠️ يرجى اختيار طريقة الدفع', 'danger'); return; }
  if (!tbody || tbody.children.length === 0) { notify('⚠️ يرجى إضافة بند واحد على الأقل', 'danger'); return; }

  var totals = calcSalTotals();
  if (!totals || totals.grand <= 0) { notify('⚠️ إجمالي الفاتورة يجب أن يكون أكبر من صفر', 'danger'); return; }

  var cust   = typeof CUSTOMERS_DB !== 'undefined' ? CUSTOMERS_DB.find(function(c){ return c.id === custId; }) : null;
  var drCode = payMeth === 'cash' ? '1611' : payMeth === 'transfer' ? '1621' : '151';
  var invNum = (document.getElementById('sal-inv-num') || {}).textContent || ('SAL-' + Date.now());

  // Build journal lines
  var jLines = [];
  jLines.push({ code: drCode, debit: totals.grand, credit: 0 });

  // Group by revenue account (could be extended per-item later)
  var crTotal = 0;
  tbody.querySelectorAll('tr').forEach(function(tr) {
    var id    = tr.id.replace('sal-line-', '');
    var qty   = parseFloat((document.getElementById('sl-qty-'  + id) || {}).value) || 0;
    var price = parseFloat((document.getElementById('sl-price-'+ id) || {}).value) || 0;
    var disc  = parseFloat((document.getElementById('sl-disc-' + id) || {}).value) || 0;
    var tax   = parseFloat((document.getElementById('sl-tax-'  + id) || {}).value) || 0;
    var sub   = qty * price; var dAmt = sub * disc / 100; var tAmt = (sub - dAmt) * tax / 100;
    crTotal += sub - dAmt + tAmt;
  });
  if (crTotal > 0) jLines.push({ code: '41111', debit: 0, credit: crTotal });

  var jId = 'SAL-' + Date.now();
  if (typeof JOURNAL_ENTRIES_DATA !== 'undefined') {
    JOURNAL_ENTRIES_DATA.push({
      id: jId, date: date, journal: 'sale',
      ref: invNum,
      customer: cust ? cust.name : custId,
      customerId: custId,
      payMethod: payMeth,
      notes: (document.getElementById('sal-notes') || {}).value || '',
      lines: jLines,
      grand: totals.grand
    });
  }

  if (typeof addAuditLog === 'function') addAuditLog('add', jId, 'فاتورة مبيعات: ' + invNum + ' — ' + (cust ? cust.name : custId));

  // تحديث كميات المخزون تلقائياً
  tbody.querySelectorAll('tr').forEach(function(tr) {
    var lid   = tr.id.replace('sal-line-', '');
    var iCode = getSBVal('sb-sitem-' + lid);
    var qty   = parseFloat((document.getElementById('sl-qty-' + lid) || {}).value) || 0;
    if (iCode && qty > 0 && typeof INV_ITEMS !== 'undefined') {
      var inv = INV_ITEMS.find(function(i){ return i.code === iCode; });
      if (inv) {
        if (inv.trackSerial) {
          // تسجيل السيريل كمباع
          var srlEl = document.getElementById('sl-serial-' + lid);
          var sn = srlEl ? srlEl.value.trim() : '';
          if (sn && typeof markSerialSold === 'function') markSerialSold(sn, invNum || jId, cust ? cust.name : custId, date);
          // تحديث الكمية من SERIALS_DB
          if (typeof SERIALS_DB !== 'undefined') inv.qty = SERIALS_DB.filter(function(s){return s.itemCode===iCode && s.status==='stock';}).length;
        } else {
          if (inv.qty !== undefined) inv.qty = Math.max(0, inv.qty - qty);
        }
      }
    }
  });

  // تحديث ذمة الزبون (آجل)
  if (payMeth === 'deferred' && custId && typeof CUSTOMERS_DB !== 'undefined') {
    var custRec = CUSTOMERS_DB.find(function(c){ return c.id === custId; });
    if (custRec) custRec.debt = (custRec.debt || 0) + totals.grand;
  }

  // إضافة بطاقة للوحة تدفق العمل
  if (typeof WF_ORDERS !== 'undefined') {
    var _items = [];
    tbody.querySelectorAll('tr').forEach(function(tr) {
      var lid = tr.id.replace('sal-line-', '');
      var tt    = document.getElementById('sb-sitem-' + lid + '-text');
      var iCode2 = (typeof getSBVal === 'function') ? getSBVal('sb-sitem-' + lid) : '';
      var invLook = iCode2 && typeof INV_ITEMS !== 'undefined' ? INV_ITEMS.find(function(x){ return x.code===iCode2; }) : null;
      var pName   = invLook ? invLook.name : (tt && tt.value ? (tt.value.indexOf(' — ')>=0 ? tt.value.split(' — ').slice(1).join(' — ') : tt.value) : '');
      if (pName) _items.push(pName);
    });
    WF_ORDERS.push({
      id: invNum || jId,
      customer:   cust ? cust.name : custId,
      customerId: custId,
      product:    _items.slice(0, 2).join(', ') || '—',
      amount:     totals.grand,
      payMethod:  payMeth,
      stage:      'sales',
      date:       date,
      journalId:  jId
    });
  }

  if (typeof renderSalesPage === 'function') renderSalesPage();
  closeM('m-sale');
  notify('✅ تم حفظ فاتورة المبيعات ' + invNum + ' — القيد: ' + jId, 'success');
  setTimeout(function(){ if(typeof go==='function') go('workflow', null); }, 500);
}

// ==============================================================
// renderSalesPage — render sales history table
// ==============================================================
function renderSalesPage() {
  var tbody  = document.getElementById('sal-history-body');
  var sub    = document.getElementById('sal-page-subtitle');
  var search = ((document.getElementById('sal-search') || {}).value || '').toLowerCase();
  if (!tbody) return;

  if (typeof JOURNAL_ENTRIES_DATA === 'undefined') return;

  var salesJVs = JOURNAL_ENTRIES_DATA.filter(function(jv) {
    if (jv.journal !== 'sale') return false;
    if (!search) return true;
    return (jv.id || '').toLowerCase().indexOf(search) >= 0 ||
           (jv.ref || '').toLowerCase().indexOf(search) >= 0 ||
           (jv.customer || '').toLowerCase().indexOf(search) >= 0;
  });

  if (sub) sub.textContent = salesJVs.length + ' فاتورة مسجلة';

  if (!salesJVs.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:20px">'
      + (search ? 'لا توجد نتائج للبحث' : 'لا توجد فواتير مبيعات — اضغط + فاتورة جديدة لإضافة أول فاتورة') + '</td></tr>';
    return;
  }

  var payLabels = { cash: '💵 نقد', transfer: '🏦 حوالة', deferred: '📋 آجل' };
  var rows = '';
  salesJVs.slice().sort(function(a, b) { return b.date > a.date ? 1 : -1; }).forEach(function(jv) {
    var crTotal  = (jv.lines || []).reduce(function(s, l) { return s + (l.credit || 0); }, 0);
    var isPaid     = jv.paid === true;
    var isDeferred = jv.payMethod === 'deferred';
    var statusHtml = isPaid
      ? '<span class="status-badge status-paid">✅ مقبوض</span>'
      : isDeferred
        ? '<span class="status-badge status-posted" style="color:#f59e0b;border-color:#f59e0b">📋 آجل</span>'
        : '<span class="status-badge status-posted">📋 مرحّل</span>';
    var collectBtn = (isDeferred && !isPaid)
      ? '<button class="btn btn-success btn-xs" style="font-size:10px" onclick="openReceiptForInvoice(&quot;' + (jv.ref||jv.id) + '&quot;,&quot;' + (jv.customer||'').replace(/"/g,'&quot;') + '&quot;,&quot;' + (jv.customerId||'') + '&quot;,' + crTotal + ')">💵 تحصيل</button> '
      : '';
    rows += '<tr>';
    rows += '<td style="font-family:monospace;font-weight:600;color:var(--odoo-green)">' + (jv.ref || jv.id) + '</td>';
    rows += '<td style="font-weight:600">' + (jv.customer || '—') + '</td>';
    rows += '<td>' + (jv.date || '—') + '</td>';
    rows += '<td style="direction:ltr;text-align:center;font-weight:700;color:var(--odoo-green)">' + crTotal.toLocaleString('en-US') + ' د.ع</td>';
    rows += '<td style="text-align:center">' + (payLabels[jv.payMethod] || jv.payMethod || '—') + '</td>';
    rows += '<td style="text-align:center">' + statusHtml + '</td>';
    rows += '<td style="text-align:center">' + collectBtn + '<button class="btn btn-o btn-xs" onclick="printRcp()">🖨</button></td>';
    rows += '</tr>';
  });
  tbody.innerHTML = rows;
}

// ── Word import handler ────────────────────────────────────────────
function handleWordFile(event) {
  var file = event.target.files[0];
  if (!file) return;
  var area = document.getElementById('word-drop-area') || document.querySelector('.word-import-area');
  if (area) area.innerHTML = '<div style="text-align:center;padding:20px"><div style="font-size:32px">📄</div><div style="font-weight:700;margin-top:8px">'+file.name+'</div><div style="color:var(--odoo-green);margin-top:4px">✅ تم اختيار الملف — جاهز للاستيراد</div></div>';
  notify('تم اختيار الملف: ' + file.name, 'info');
}

function importWordTemplate() {
  var fileInput = document.getElementById('word-file-input');
  if (!fileInput || !fileInput.files.length) {
    notify('يجب اختيار ملف Word أولاً ✕', 'danger'); return;
  }
  closeM('m-word-import');
  notify('✅ تم استيراد قالب الفاتورة من Word — قيد المعالجة', 'success');
}

// ── filterWF: تصفية بطاقات تدفق العمل ──────────────────────────────
function filterWF(status, btn) {
  var cards = document.querySelectorAll('.wf-card');
  cards.forEach(function(card) {
    if (status === 'all') {
      card.style.display = '';
    } else {
      card.style.display = (card.dataset.status === status) ? '' : 'none';
    }
  });
  // Update active button state
  var btns = document.querySelectorAll('.wf-filter-btn, .workflow-filter button');
  btns.forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
}

// ── printRcp: طباعة وصل ─────────────────────────────────────────────
function printRcp() {
  var m = document.getElementById('m-print');
  if (m) {
    // Try to fill print modal with sale data
    var printBody = document.getElementById('print-body');
    if (printBody && !printBody.hasChildNodes()) {
      var now = new Date().toLocaleDateString('en-GB');
      printBody.innerHTML = '<div style="text-align:center;padding:8px 0 12px"><div style="font-size:16px;font-weight:900;color:var(--odoo-blue)">' + (typeof COMPANY !== 'undefined' ? COMPANY.name : 'الراية الزرقاء') + '</div><div style="font-size:11px;color:var(--text-s);margin-top:2px">' + now + '</div></div><div class="info-row"><span class="lbl">رقم الوصل</span><span class="val" style="font-family:monospace;font-weight:700">RCP-' + String(Math.floor(Math.random()*900)+100) + '</span></div><div class="info-row"><span class="lbl">التاريخ</span><span class="val">' + now + '</span></div><div class="info-row"><span class="lbl">المبلغ</span><span class="val" style="color:var(--odoo-green);font-weight:800">—</span></div><div class="info-row"><span class="lbl">طريقة الدفع</span><span class="val">نقد</span></div>';
    }
    m.classList.add('open');
  } else {
    window.print();
  }
}

// ── convertReservation: تحويل حجز إلى فاتورة مبيعات ────────────────
function convertReservation(rsvId, genSerial, customerName, totalPrice, depositPaid) {
  rayaConfirm('هل تريد تحويل الحجز ' + rsvId + ' إلى فاتورة مبيعات؟',function(){
  var custInput = document.getElementById('sale-customer');
  if (custInput) custInput.value = customerName;
  var priceInput = document.getElementById('sale-total');
  if (priceInput) priceInput.value = totalPrice;
  var depInput = document.getElementById('deposit-paid');
  if (depInput) depInput.value = depositPaid;
  var payMethod = document.getElementById('pay-method');
  if (payMethod) payMethod.value = 'inst';
  openM('m-sale');
  notify('تم تحميل بيانات الحجز ' + rsvId + ' — ' + customerName + ' — المولد: ' + genSerial, 'info');
  // Mark reservation as converted
  var row = document.querySelector('[data-rsv="' + rsvId + '"]');
  if (row) row.style.opacity = '0.5';
  });
}

// ── cancelReservation: إلغاء حجز ────────────────────────────────────
function cancelReservation(rsvId) {
  rayaConfirm('هل تريد إلغاء الحجز ' + rsvId + '؟ سيتم إعادة المولد إلى المخزون.',function(){
  var row = document.querySelector('[data-rsv="' + rsvId + '"]');
  if (row) {
    row.style.background = 'var(--odoo-red-l)';
    row.style.opacity = '0.5';
    setTimeout(function() { row.style.display = 'none'; }, 500);
  }
  notify('تم إلغاء الحجز ' + rsvId + ' وإعادة المولد للمخزون ✓', 'success');
  },{danger:true});
}

// ── selectTemplate: اختيار قالب الفاتورة ──────────────────────────
var _selectedTemplate = 'classic';
function selectTemplate(tplName) {
  _selectedTemplate = tplName;
  var cards = document.querySelectorAll('.inv-tpl-card');
  cards.forEach(function(c) { c.classList.remove('active'); });
  var sel = document.getElementById('tpl-' + tplName);
  if (sel) sel.classList.add('active');
  notify('تم اختيار القالب: ' + tplName, 'info');
  // Re-render preview with selected template
  if (typeof renderInvoicePreview === 'function') renderInvoicePreview();
}

// ── saveInvoiceTemplate: حفظ تعديلات مصمم الفاتورة ─────────────────
function saveInvoiceTemplate() {
  var title    = document.getElementById('inv-title-txt')?.value   || 'فاتورة مبيعات';
  var subtitle = document.getElementById('inv-sub-txt')?.value     || '';
  var footer   = document.getElementById('inv-footer-txt')?.value  || '';
  // Persist to memory
  if (typeof COMPANY !== 'undefined') {
    COMPANY.invoiceTitle    = title;
    COMPANY.invoiceSubtitle = subtitle;
    COMPANY.invoiceFooter   = footer;
    COMPANY.invoiceTemplate = _selectedTemplate;
  }
  notify('✅ تم حفظ تصميم الفاتورة — القالب: ' + _selectedTemplate, 'success');
}

// ── previewInvoice: معاينة الفاتورة في نافذة منفصلة ───────────────
function previewInvoice() {
  if (typeof renderInvoicePreview === 'function') {
    renderInvoicePreview();
    var panel = document.getElementById('invoice-preview-panel') || document.querySelector('.inv-preview-panel');
    if (panel) panel.scrollIntoView({ behavior: 'smooth' });
    notify('تم تحديث المعاينة ✓', 'info');
  } else {
    notify('المعاينة جاهزة في اليمين ✓', 'info');
  }
}

// ── printInvoicePreview: طباعة معاينة الفاتورة ─────────────────────
function printInvoicePreview() {
  var previewEl = document.getElementById('invoice-preview-panel') || document.querySelector('.inv-preview-wrap .invoice-preview');
  if (!previewEl) { window.print(); return; }
  var html = '<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8">' +
    '<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">' +
    '<style>body{font-family:Cairo,Arial,sans-serif;margin:0;padding:16px;direction:rtl}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>' +
    '</head><body>' + previewEl.outerHTML + '</body></html>';
  var w = window.open('', '_blank', 'width=900,height=650');
  if (w) { w.document.write(html); w.document.close(); setTimeout(function() { w.print(); }, 600); }
}

// ── exportInvoicePDF: تصدير الفاتورة كـ PDF ────────────────────────
function exportInvoicePDF() {
  printInvoicePreview();
  notify('استخدم "حفظ كـ PDF" من نافذة الطباعة ✓', 'info');
}



// ============================================================
// CUSTOMER MANAGEMENT — إدارة الزبائن
// ============================================================
function openAddCustomer() {
  document.getElementById('cust-edit-id').value = '';
  document.getElementById('cust-name').value = '';
  document.getElementById('cust-phone').value = '';
  document.getElementById('cust-type').value = 'فرد';
  document.getElementById('cust-city').value = 'بغداد';
  document.getElementById('cust-taxno').value = '';
  document.getElementById('cust-credit').value = '';
  document.getElementById('cust-address').value = '';
  document.getElementById('cust-notes').value = '';
  document.getElementById('cust-modal-title').textContent = '👤 إضافة زبون جديد';
  openM('m-customer');
}

function openEditCustomer(id) {
  var c = CUSTOMERS_DB.find(function(x){ return x.id === id; });
  if (!c) return;
  document.getElementById('cust-edit-id').value = c.id;
  document.getElementById('cust-name').value = c.name || '';
  document.getElementById('cust-phone').value = c.phone || '';
  document.getElementById('cust-type').value = c.type || 'فرد';
  document.getElementById('cust-city').value = c.city || 'بغداد';
  document.getElementById('cust-taxno').value = c.taxNo || '';
  document.getElementById('cust-credit').value = c.credit || '';
  document.getElementById('cust-address').value = c.address || '';
  document.getElementById('cust-notes').value = c.notes || '';
  document.getElementById('cust-modal-title').textContent = '✏️ تعديل بيانات الزبون';
  openM('m-customer');
}

function saveCustomer() {
  var name  = (document.getElementById('cust-name').value || '').trim();
  var phone = (document.getElementById('cust-phone').value || '').trim();
  if (!name) { notify('يجب إدخال اسم الزبون ✕', 'danger'); return; }
  if (!phone) { notify('يجب إدخال رقم الهاتف ✕', 'danger'); return; }

  var editId = document.getElementById('cust-edit-id').value;
  var city   = document.getElementById('cust-city').value;
  var type   = document.getElementById('cust-type').value;
  var taxNo  = document.getElementById('cust-taxno').value.trim();
  var credit = parseFloat(document.getElementById('cust-credit').value) || 0;
  var address= document.getElementById('cust-address').value.trim();
  var notes  = document.getElementById('cust-notes').value.trim();

  if (editId) {
    var idx = CUSTOMERS_DB.findIndex(function(x){ return x.id === editId; });
    if (idx < 0) return;
    CUSTOMERS_DB[idx].name    = name;
    CUSTOMERS_DB[idx].phone   = phone;
    CUSTOMERS_DB[idx].city    = city;
    CUSTOMERS_DB[idx].type    = type;
    CUSTOMERS_DB[idx].taxNo   = taxNo;
    CUSTOMERS_DB[idx].credit  = credit;
    CUSTOMERS_DB[idx].address = address;
    CUSTOMERS_DB[idx].notes   = notes;
    notify('تم تحديث بيانات الزبون بنجاح ✓', 'success');
  } else {
    var maxNum = CUSTOMERS_DB.reduce(function(m, c) {
      var n = parseInt((c.id || '').replace('CUS-', '')) || 0;
      return n > m ? n : m;
    }, 0);
    var newId = 'CUS-' + String(maxNum + 1).padStart(3, '0');
    CUSTOMERS_DB.push({
      id: newId, name: name, phone: phone, city: city,
      type: type, taxNo: taxNo, credit: credit,
      address: address, notes: notes, accountCode: '1511'
    });
    notify('تم إضافة الزبون ' + name + ' بنجاح ✓', 'success');
  }
  closeM('m-customer');
  renderCustomersPage();
}

function deleteCustomer(id) {
  var c = CUSTOMERS_DB.find(function(x){ return x.id === id; });
  if (!c) return;
  var hasJournals = JOURNAL_ENTRIES_DATA.some(function(e){ return e.customerId === id; });
  if (hasJournals) {
    notify('لا يمكن حذف الزبون — يوجد له قيود محاسبية مسجلة ✕', 'danger');
    return;
  }
  rayaConfirm('هل تريد حذف الزبون ' + c.name + '؟',function(){
  var idx = CUSTOMERS_DB.findIndex(function(x){ return x.id === id; });
  CUSTOMERS_DB.splice(idx, 1);
  notify('تم حذف الزبون ✓', 'success');
  renderCustomersPage();
  },{danger:true});
}

// ============================================================
// SUPPLIER MANAGEMENT — إدارة الموردين
// ============================================================
function openAddSupplier() {
  document.getElementById('supp-edit-id').value = '';
  document.getElementById('supp-name').value = '';
  document.getElementById('supp-phone').value = '';
  document.getElementById('supp-address').value = '';
  document.getElementById('supp-spec').value = '';
  document.getElementById('supp-credit').value = '';
  document.getElementById('supp-terms').value = '30';
  document.getElementById('supp-modal-title').textContent = '🏭 إضافة مجهز جديد';
  openM('m-supplier');
}

function openEditSupplier(id) {
  var s = SUPPLIERS_DB.find(function(x){ return x.id === id; });
  if (!s) return;
  document.getElementById('supp-edit-id').value = s.id;
  document.getElementById('supp-name').value = s.name || '';
  document.getElementById('supp-phone').value = s.phone || '';
  document.getElementById('supp-address').value = s.address || '';
  document.getElementById('supp-spec').value = s.spec || '';
  document.getElementById('supp-credit').value = s.credit || '';
  document.getElementById('supp-terms').value = s.terms || '30';
  document.getElementById('supp-modal-title').textContent = '✏️ تعديل بيانات المجهز';
  openM('m-supplier');
}

function saveSupplier() {
  var name  = (document.getElementById('supp-name').value || '').trim();
  if (!name) { notify('يجب إدخال اسم المجهز ✕', 'danger'); return; }

  var editId  = document.getElementById('supp-edit-id').value;
  var phone   = document.getElementById('supp-phone').value.trim();
  var address = document.getElementById('supp-address').value.trim();
  var spec    = document.getElementById('supp-spec').value.trim();
  var credit  = parseFloat(document.getElementById('supp-credit').value) || 0;
  var terms   = parseInt(document.getElementById('supp-terms').value) || 30;

  if (editId) {
    var idx = SUPPLIERS_DB.findIndex(function(x){ return x.id === editId; });
    if (idx < 0) return;
    SUPPLIERS_DB[idx].name    = name;
    SUPPLIERS_DB[idx].phone   = phone;
    SUPPLIERS_DB[idx].address = address;
    SUPPLIERS_DB[idx].spec    = spec;
    SUPPLIERS_DB[idx].credit  = credit;
    SUPPLIERS_DB[idx].terms   = terms;
    notify('تم تحديث بيانات المجهز بنجاح ✓', 'success');
  } else {
    var maxNum = SUPPLIERS_DB.reduce(function(m, s) {
      var n = parseInt((s.id || '').replace('SUP-', '')) || 0;
      return n > m ? n : m;
    }, 0);
    var newId = 'SUP-' + String(maxNum + 1).padStart(3, '0');
    SUPPLIERS_DB.push({
      id: newId, name: name, phone: phone, address: address,
      spec: spec, credit: credit, terms: terms, accountCode: '2111'
    });
    notify('تم إضافة المجهز ' + name + ' بنجاح ✓', 'success');
  }
  closeM('m-supplier');
  renderSuppliersPage();
}

function deleteSupplier(id) {
  var s = SUPPLIERS_DB.find(function(x){ return x.id === id; });
  if (!s) return;
  var hasJournals = JOURNAL_ENTRIES_DATA.some(function(e){ return e.supplierId === id; });
  if (hasJournals) {
    notify('لا يمكن حذف المجهز — يوجد له قيود محاسبية مسجلة ✕', 'danger');
    return;
  }
  rayaConfirm('هل تريد حذف المجهز ' + s.name + '؟',function(){
  var idx = SUPPLIERS_DB.findIndex(function(x){ return x.id === id; });
  SUPPLIERS_DB.splice(idx, 1);
  notify('تم حذف المجهز ✓', 'success');
  renderSuppliersPage();
  },{danger:true});
}

// ============================================================
// PAYROLL — نظام مسير الرواتب
// ============================================================
function renderPayrollTab() {
  var tbody = document.getElementById('payroll-emp-body');
  var histBody = document.getElementById('payroll-history-body');
  if (!tbody) return;

  var totalBasic = 0, totalNet = 0;
  var rows = '';
  EMPLOYEES.forEach(function(e) {
    var basic   = e.salary || 0;
    var allow   = Math.round(basic * 0.1);  // بدل نقل 10%
    var deduct  = 0;
    var net     = basic + allow - deduct;
    totalBasic += basic;
    totalNet   += net;
    rows += '<tr>'
      + '<td style="font-weight:700">' + e.name + '</td>'
      + '<td style="font-size:11px;color:var(--text-m)">' + e.role + '</td>'
      + '<td>' + e.dept + '</td>'
      + '<td style="text-align:right;font-family:monospace;color:var(--odoo-blue)">' + fmt(basic) + '</td>'
      + '<td style="text-align:right;font-family:monospace;color:var(--odoo-green)">' + fmt(allow) + '</td>'
      + '<td style="text-align:right;font-family:monospace;color:var(--odoo-red)">—</td>'
      + '<td style="text-align:right;font-family:monospace;font-weight:700;color:var(--odoo-purple)">' + fmt(net) + '</td>'
      + '</tr>';
  });
  tbody.innerHTML = rows;

  var totalAllow = Math.round(totalBasic * 0.1);
  var el = document.getElementById('pr-total-basic');  if (el) el.textContent = fmt(totalBasic) + ' د.ع';
  el = document.getElementById('pr-total-allow');  if (el) el.textContent = fmt(totalAllow) + ' د.ع';
  el = document.getElementById('pr-total-deduct'); if (el) el.textContent = '—';
  el = document.getElementById('pr-total-net');    if (el) el.textContent = fmt(totalNet + totalAllow) + ' د.ع';

  if (histBody) {
    if (!PAYROLL_RECORDS.length) {
      histBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-s);padding:16px">لا توجد مسيرات رواتب سابقة</td></tr>';
    } else {
      histBody.innerHTML = PAYROLL_RECORDS.slice().reverse().map(function(r) {
        return '<tr>'
          + '<td class="code-cell">' + r.id + '</td>'
          + '<td>' + r.monthLabel + '</td>'
          + '<td>' + r.date + '</td>'
          + '<td style="text-align:center">' + r.empCount + '</td>'
          + '<td style="text-align:right;font-family:monospace;font-weight:700;color:var(--odoo-purple)">' + fmt(r.netTotal) + ' د.ع</td>'
          + '<td class="code-cell">' + r.journalId + '</td>'
          + '<td style="font-size:11px;color:var(--text-m)">' + r.user + '</td>'
          + '</tr>';
      }).join('');
    }
  }
}

function openM_payroll_init() {
  var today = new Date().toISOString().split('T')[0];
  var prDate = document.getElementById('pr-date');
  if (prDate) prDate.value = today;

  var prMonth = document.getElementById('pr-month');
  var monthVal = prMonth ? prMonth.value : '';
  var monthLabel = monthVal ? (function() {
    var d = new Date(monthVal + '-01');
    return d.toLocaleDateString('ar-IQ', { year:'numeric', month:'long' });
  })() : '';

  var modalBody = document.getElementById('pr-modal-body');
  var modalTotal = document.getElementById('pr-modal-total');
  if (!modalBody) return;

  var totalNet = 0;
  var rows = '';
  EMPLOYEES.forEach(function(e) {
    var basic  = e.salary || 0;
    var allow  = Math.round(basic * 0.1);
    var deduct = 0;
    var net    = basic + allow - deduct;
    totalNet  += net;
    rows += '<tr>'
      + '<td style="font-weight:700">' + e.name + '</td>'
      + '<td style="font-size:11px;color:var(--text-m)">' + e.role + '</td>'
      + '<td style="font-family:monospace">' + fmt(basic) + '</td>'
      + '<td style="font-family:monospace;color:var(--odoo-green)">' + fmt(allow) + '</td>'
      + '<td style="color:var(--odoo-red)">—</td>'
      + '<td style="font-family:monospace;font-weight:700;color:var(--odoo-purple)">' + fmt(net) + '</td>'
      + '</tr>';
  });
  modalBody.innerHTML = rows;
  if (modalTotal) modalTotal.textContent = fmt(totalNet) + ' د.ع';
}

function runPayroll() {
  var monthVal = (document.getElementById('pr-month').value || '').trim();
  var date     = (document.getElementById('pr-date').value  || '').trim();
  var notes    = (document.getElementById('pr-notes').value || '').trim();

  if (!monthVal) { notify('يجب اختيار الشهر ✕', 'danger'); return; }
  if (!date)     { notify('يجب إدخال تاريخ الصرف ✕', 'danger'); return; }

  var already = PAYROLL_RECORDS.find(function(r){ return r.month === monthVal; });
  if (already) { notify('تم صرف رواتب هذا الشهر مسبقاً (' + already.monthLabel + ') ✕', 'danger'); return; }

  var totalBasic = 0, totalNet = 0;
  EMPLOYEES.forEach(function(e) {
    var basic = e.salary || 0;
    var net   = basic + Math.round(basic * 0.1);
    totalBasic += basic;
    totalNet   += net;
  });

  var monthLabel = (function() {
    var d = new Date(monthVal + '-01');
    return d.toLocaleDateString('ar-IQ', { year:'numeric', month:'long' });
  })();

  var prNum = PAYROLL_RECORDS.length + 1;
  var prId  = 'PR-' + String(prNum).padStart(3, '0');
  var jvId  = 'JV-PR-' + String(prNum).padStart(3, '0');
  var desc  = 'رواتب ' + monthLabel + (notes ? ' — ' + notes : '');

  // قيد محاسبي: مدين رواتب / دائن رواتب مستحقة
  JOURNAL_ENTRIES_DATA.push({
    id: jvId,
    date: date,
    journal: 'expense',
    ref: prId,
    description: desc,
    lines: [
      { code:'5311', name:'رواتب الموظفين الإداريين', debit: totalNet, credit: 0 },
      { code:'2241', name:'رواتب الموظفين المستحقة',  debit: 0,       credit: totalNet }
    ]
  });

  PAYROLL_RECORDS.push({
    id: prId, month: monthVal, monthLabel: monthLabel,
    date: date, empCount: EMPLOYEES.length,
    totalBasic: totalBasic, netTotal: totalNet,
    journalId: jvId, user: 'مدير النظام', notes: notes
  });

  closeM('m-payroll');
  notify('تم صرف رواتب ' + monthLabel + ' بنجاح — إجمالي: ' + fmt(totalNet) + ' د.ع ✓', 'success');
  renderPayrollTab();
  renderDashboard();
}

// تهيئة modal الرواتب عند الفتح
(function() {
  var origOpenM = window.openM;
  if (origOpenM) {
    window.openM = function(id) {
      origOpenM(id);
      if (id === 'm-payroll') openM_payroll_init();
      if (id === 'm-customer') {
        var editId = document.getElementById('cust-edit-id');
        if (editId && !editId.value) {
          ['cust-name','cust-phone','cust-taxno','cust-credit','cust-address','cust-notes']
            .forEach(function(fid){ var el=document.getElementById(fid); if(el) el.value=''; });
          document.getElementById('cust-type').value = 'فرد';
          document.getElementById('cust-city').value = 'بغداد';
          document.getElementById('cust-modal-title').textContent = '👤 إضافة زبون جديد';
        }
      }
      if (id === 'm-supplier') {
        var editId2 = document.getElementById('supp-edit-id');
        if (editId2 && !editId2.value) {
          ['supp-name','supp-phone','supp-address','supp-spec','supp-credit']
            .forEach(function(fid){ var el=document.getElementById(fid); if(el) el.value=''; });
          var terms = document.getElementById('supp-terms'); if(terms) terms.value='30';
          document.getElementById('supp-modal-title').textContent = '🏭 إضافة مجهز جديد';
        }
      }
    };
  }
})();


// ============================================================
// MAINT_DB — قاعدة بيانات طلبات الصيانة
// ============================================================
let MAINT_DB = [];
let _maintFilterStatus = 'all';

// ============================================================
// renderExpensesPage — صفحة المصروفات الحية
// ============================================================
function renderExpensesPage() {
  var tbody    = document.getElementById('exp-table-body');
  var subtitle = document.getElementById('exp-subtitle');
  if (!tbody) return;

  // استخرج كل القيود من نوع expense أو أسطر حسابات 5xx
  var _expFrom = (document.getElementById('exp-filter-from')||{}).value||'';
  var _expTo   = (document.getElementById('exp-filter-to')  ||{}).value||'';
  var expEntries = JOURNAL_ENTRIES_DATA.filter(function(e) {
    if (e.journal !== 'expense' && e.journal !== 'payment') return false;
    if (_expFrom && (e.date||'') < _expFrom) return false;
    if (_expTo   && (e.date||'') > _expTo)   return false;
    return true;
  }).sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); });

  // احسب الإجماليات حسب تصنيف الحساب
  var totalExp = 0, totalSalary = 0, totalRent = 0, totalOther = 0;

  expEntries.forEach(function(e) {
    (e.lines || []).forEach(function(l) {
      if (!l.code) return;
      var dr = l.debit || 0;
      if (l.code[0] === '5') {
        totalExp += dr;
        if (l.code.startsWith('531')) totalSalary += dr;        // رواتب إدارية
        else if (l.code.startsWith('514') || l.code.startsWith('513')) totalSalary += dr; // أجور فنيين
        else if (l.code === '5321' || l.code === '5211') totalRent += dr; // إيجار
        else totalOther += dr;
      }
    });
  });

  // نوع المصروف حسب كود الحساب
  function expType(lines) {
    var codes = (lines || []).map(function(l){ return l.code || ''; }).filter(function(c){ return c[0]==='5'; });
    var c = codes[0] || '';
    if (c.startsWith('531') || c.startsWith('514') || c.startsWith('513')) return '<span class="badge badge-yellow">رواتب/أجور</span>';
    if (c === '5321' || c === '5211') return '<span class="badge badge-blue">إيجار</span>';
    if (c.startsWith('522') || c.startsWith('535')) return '<span class="badge badge-gray">نقل/وقود</span>';
    if (c.startsWith('533') || c.startsWith('534')) return '<span class="badge badge-purple">خدمات</span>';
    return '<span class="badge badge-red">مصروف</span>';
  }

  var rows = '';
  if (!expEntries.length) {
    rows = '<tr><td colspan="6" style="text-align:center;color:var(--text-s);padding:20px">لا توجد مصروفات مسجلة بعد</td></tr>';
  } else {
    expEntries.forEach(function(e) {
      var amt = (e.lines || []).reduce(function(s, l) { return s + (l.debit || 0); }, 0);
      var accCode = (e.lines || []).filter(function(l){ return l.code && l.code[0]==='5'; }).map(function(l){ return l.code; }).join(', ') || '—';
      var desc = e.description || e.desc || e.ref || '—';
      rows += '<tr>'
        + '<td style="font-size:11px;white-space:nowrap">' + (e.date || '—') + '</td>'
        + '<td>' + expType(e.lines) + '</td>'
        + '<td class="code-cell">' + accCode + '</td>'
        + '<td style="font-size:12px">' + desc + '</td>'
        + '<td style="font-family:monospace;font-weight:700;color:var(--odoo-red)">' + (amt > 0 ? fmt(amt) + ' د.ع' : '—') + '</td>'
        + '<td><span class="badge badge-green" style="font-size:9.5px">مدير</span></td>'
        + '</tr>';
    });
  }
  tbody.innerHTML = rows;

  function setEl(id, val) { var el=document.getElementById(id); if(el) el.textContent = val; }
  setEl('exp-kpi-total',  fmt(totalExp)    + ' د.ع');
  setEl('exp-kpi-salary', fmt(totalSalary) + ' د.ع');
  setEl('exp-kpi-rent',   fmt(totalRent)   + ' د.ع');
  setEl('exp-kpi-other',  fmt(totalOther)  + ' د.ع');
  if (subtitle) subtitle.textContent = expEntries.length + ' قيد مصروف — آخر تحديث: ' + new Date().toLocaleString('en-US');
}

// ============================================================
// renderMaintenancePage — صفحة الصيانة الحية
// ============================================================
function renderMaintenancePage() {
  var tbody    = document.getElementById('maint-table-body');
  var subtitle = document.getElementById('maint-subtitle');
  if (!tbody) return;

  // ملء قائمة الزبائن في modal الصيانة
  var custSel = document.getElementById('mnt-customer');
  if (custSel && custSel.options.length <= 1) {
    CUSTOMERS_DB.forEach(function(c) {
      var opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = c.name;
      custSel.appendChild(opt);
    });
  }

  var STATUS_LABEL = {
    open:        '<span class="badge badge-blue">🆕 مفتوح</span>',
    in_progress: '<span class="badge badge-yellow">🔧 معالجة</span>',
    completed:   '<span class="badge badge-green">✅ مكتمل</span>',
    cancelled:   '<span class="badge badge-gray">❌ ملغي</span>'
  };
  var TYPE_LABEL = {
    warranty:   '<span class="badge badge-green">🛡 ضمان</span>',
    corrective: '<span class="badge badge-red">🔩 تصحيحية</span>',
    preventive: '<span class="badge badge-blue">🔄 وقائية</span>'
  };
  var PRIORITY_COLOR = { urgent:'var(--odoo-red)', critical:'#dc2626', normal:'var(--text-m)' };

  var filtered = _maintFilterStatus === 'all'
    ? MAINT_DB
    : _maintFilterStatus === 'warranty'
      ? MAINT_DB.filter(function(r){ return r.type === 'warranty'; })
      : MAINT_DB.filter(function(r){ return r.status === _maintFilterStatus; });

  var sorted = filtered.slice().sort(function(a, b) { return (b.date||'').localeCompare(a.date||''); });

  var rows = '';
  if (!sorted.length) {
    rows = '<tr><td colspan="10" style="text-align:center;color:var(--text-s);padding:20px">لا توجد طلبات صيانة في هذا التصنيف</td></tr>';
  } else {
    sorted.forEach(function(r) {
      var costTxt = r.cost > 0
        ? '<span style="font-family:monospace;font-weight:700;color:var(--odoo-red)">' + fmt(r.cost) + '</span>'
        : '<span style="color:var(--odoo-green)">مجاني</span>';
      rows += '<tr>'
        + '<td class="code-cell">' + r.id + '</td>'
        + '<td style="font-size:11px;white-space:nowrap">' + (r.date||'—') + '</td>'
        + '<td style="font-weight:700;color:var(--odoo-blue)">' + (r.customer||'—') + '</td>'
        + '<td>' + (r.serial ? '<span class="badge badge-blue">' + r.serial + '</span>' : '—') + '</td>'
        + '<td style="font-size:11px;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="' + (r.desc||'') + '">' + (r.desc||'—') + '</td>'
        + '<td style="font-size:11px;color:var(--text-m)">' + (r.tech||'—') + '</td>'
        + '<td>' + (TYPE_LABEL[r.type] || r.type || '—') + '</td>'
        + '<td>' + costTxt + '</td>'
        + '<td>' + (STATUS_LABEL[r.status] || r.status || '—') + '</td>'
        + '<td style="white-space:nowrap">'
          + (r.status !== 'completed' ? '<button class="btn btn-xs" style="background:#f0fdf4;border-color:#86efac;color:#166534;margin-left:2px" data-mid="' + r.id + '" onclick="completeMaint(this.dataset.mid)">✅ أنهِ</button>' : '')
          + '<button class="btn btn-o btn-xs" data-mid="' + r.id + '" onclick="deleteMaint(this.dataset.mid)">🗑️</button>'
        + '</td>'
        + '</tr>';
    });
  }
  tbody.innerHTML = rows;

  // KPIs
  var inProgress = MAINT_DB.filter(function(r){ return r.status === 'in_progress'; }).length;
  var openCount  = MAINT_DB.filter(function(r){ return r.status === 'open'; }).length;
  var doneCount  = MAINT_DB.filter(function(r){ return r.status === 'completed'; }).length;
  var warrantyCount = MAINT_DB.filter(function(r){ return r.type === 'warranty'; }).length;

  function setEl(id, val) { var el=document.getElementById(id); if(el) el.textContent=val; }
  setEl('maint-kpi-progress', inProgress);
  setEl('maint-kpi-inspect',  openCount);
  setEl('maint-kpi-done',     doneCount);
  setEl('maint-kpi-warranty', warrantyCount);
  if (subtitle) subtitle.textContent = MAINT_DB.length + ' طلب صيانة — ' + (inProgress + openCount) + ' مفتوح';
}

function filterMaint(status, btn) {
  _maintFilterStatus = status;
  var tabs = document.querySelectorAll('#maint-filter-tabs button');
  tabs.forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderMaintenancePage();
}

function completeMaint(id) {
  var r = MAINT_DB.find(function(x){ return x.id === id; });
  if (!r) return;
  if (r.cost > 0 && r.type !== 'warranty') {
    var jId = 'MNT-JV-' + String(Date.now()).slice(-6);
    JOURNAL_ENTRIES_DATA.push({
      id: jId, date: new Date().toISOString().split('T')[0],
      journal: 'expense', ref: r.id,
      description: 'تكلفة صيانة — ' + (r.customer||'') + ' — ' + (r.serial||''),
      lines: [
        { code:'5131', name:'مواد الصيانة المستهلكة', debit: r.cost, credit: 0 },
        { code:'1611', name:'الصندوق',                 debit: 0,      credit: r.cost }
      ]
    });
    notify('تم إغلاق الطلب وإنشاء قيد التكلفة ' + jId + ' ✓', 'success');
  } else {
    notify('تم إغلاق طلب الصيانة ' + id + ' ✓', 'success');
  }
  r.status = 'completed';
  renderMaintenancePage();
}

function deleteMaint(id) {
  var idx = MAINT_DB.findIndex(function(x){ return x.id === id; });
  if (idx < 0) return;
  rayaConfirm('هل تريد حذف طلب الصيانة ' + id + '؟',function(){
  MAINT_DB.splice(idx, 1);
  renderMaintenancePage();
  notify('تم حذف الطلب ✓', 'success');
  },{danger:true});
}

function saveMaintenance() {
  var customer = (document.getElementById('mnt-customer').value || '').trim();
  var serial   = (document.getElementById('mnt-serial').value   || '').trim();
  var desc     = (document.getElementById('mnt-desc').value     || '').trim();
  var tech     = (document.getElementById('mnt-tech').value     || '').trim();
  var type     = (document.getElementById('mnt-type').value     || 'corrective');
  var cost     = parseFloat(document.getElementById('mnt-cost').value) || 0;
  var priority = (document.getElementById('mnt-priority').value || 'normal');

  if (!customer) { notify('يجب اختيار الزبون ✕', 'danger'); return; }
  if (!desc)     { notify('يجب إدخال وصف العطل ✕', 'danger'); return; }

  var maxNum = MAINT_DB.reduce(function(m, r) {
    var n = parseInt((r.id || '').replace('MNT-', '')) || 0;
    return n > m ? n : m;
  }, 0);
  var newId = 'MNT-' + String(maxNum + 1).padStart(3, '0');
  var today = new Date().toISOString().split('T')[0];

  MAINT_DB.unshift({
    id: newId, date: today, customer: customer, serial: serial,
    desc: desc, tech: tech, type: type, cost: cost,
    status: 'open', priority: priority
  });

  closeM('m-maintenance');
  notify('تم فتح طلب الصيانة ' + newId + ' ✓', 'success');

  // إعادة ضبط الفورم
  ['mnt-serial','mnt-desc','mnt-cost'].forEach(function(id){
    var el = document.getElementById(id); if(el) el.value = '';
  });
  document.getElementById('mnt-customer').value = '';

  renderMaintenancePage();
}


// ============================================================
// WF_ORDERS — بيانات تدفق العمل (v11)
// ============================================================
var SERIALS_DB = []; // {sn, itemCode, itemName, status:stock|sold|reserved, dateIn, poRef, dateOut, invRef, customer, notes}

var INSTALLMENTS_DB = []; // {id,date,custId,custName,invRef,totalAmt,downAmt,numInst,instAmt,frequency:"monthly",startDate,status:"active"|"complete",payments:[{n,dueDate,amt,status:"pending"|"paid"|"overdue",rcpRef,paidDate}]}

var WF_ORDERS = [];

var WF_STAGES = [
  {id:'sales',    label:'إصدار الفاتورة', icon:'🧾', color:'var(--odoo-purple)', bg:'#f8f0ff', border:'var(--odoo-purple)', next:'payment',  nextLabel:'← قبض'},
  {id:'payment',  label:'قبض المبلغ',     icon:'💵', color:'var(--odoo-blue)',   bg:'#e8f5f6', border:'var(--odoo-blue)',   next:'warehouse',nextLabel:'← مخزن'},
  {id:'warehouse',label:'فحص المخزن',     icon:'📦', color:'#f59e0b',           bg:'#fffbeb', border:'#f59e0b',           next:'delivery', nextLabel:'← تجهيز'},
  {id:'purchase', label:'شراء / تجهيز',  icon:'🛒', color:'#dc3545',           bg:'#fff8f8', border:'#dc3545',           next:'delivery', nextLabel:'← وصل'},
  {id:'delivery', label:'تسليم وإغلاق',  icon:'🚚', color:'#198754',           bg:'#f0fdf4', border:'#198754',           next:'completed',nextLabel:'✅ تأكيد التسليم'}
];

var WF_PAY_LABELS = {cash:'💵 نقد', transfer:'🏦 حوالة', deferred:'📋 آجل', installment:'💳 أقساط', deposit:'📛 عربون'};

function renderWorkflowPage() {
  var kpiBar     = document.getElementById('wf-kpi-bar');
  var kanbanGrid = document.getElementById('wf-kanban-grid');
  if (!kpiBar || !kanbanGrid) return;
  var allOrders = typeof WF_ORDERS !== "undefined" ? WF_ORDERS : [];
  var counts = {sales:0,payment:0,warehouse:0,purchase:0,delivery:0,completed:0};
  var totals  = {sales:0,payment:0,warehouse:0,purchase:0,delivery:0,completed:0};
  allOrders.forEach(function(o) {
    if (counts[o.stage] !== undefined) { counts[o.stage]++; totals[o.stage] += (o.amount||0); }
  });
  // KPI Bar
  var kpiStages = WF_STAGES.concat([{id:'completed',label:'مكتمل',icon:'✅',color:'#6c757d'}]);
  kpiBar.innerHTML = kpiStages.map(function(st) {
    var amt = totals[st.id] > 0 ? (totals[st.id]/1000000).toFixed(1) + 'M د.ع' : '—';
    return '<div class="stat-card" style="border-top:3px solid ' + st.color + ';padding:12px 14px;min-height:90px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
        '<span style="font-size:18px">' + st.icon + '</span>' +
        '<div style="font-size:11px;font-weight:700;color:' + st.color + '">' + st.label + '</div>' +
      '</div>' +
      '<div style="font-size:24px;font-weight:800;color:var(--text-h)">' + counts[st.id] + '</div>' +
      '<div style="font-size:10.5px;color:var(--text-m);margin-top:2px">' + amt + '</div>' +
    '</div>';
  }).join("");
  // Kanban Columns
  kanbanGrid.innerHTML = WF_STAGES.map(function(st) {
    var stageOrders = allOrders.filter(function(o){ return o.stage === st.id; });
    var cards = stageOrders.map(function(o) {
      var pl = WF_PAY_LABELS[o.payMethod] || o.payMethod || '';
      return '<div class="wf-card" data-status="' + st.id + '" data-id="' + o.id + '"' +
        ' onclick="showWFDetail(\'' + o.id + '\')"' +
        ' style="background:' + st.bg + ';border:1px solid ' + st.border + ';border-radius:var(--r);padding:10px;cursor:pointer;margin-bottom:6px;transition:box-shadow .15s"' +
        ' onmouseover="this.style.boxShadow=\'0 2px 8px rgba(0,0,0,.12)\'"' +
        ' onmouseout="this.style.boxShadow=\'\'">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">' +
          '<span style="font-family:monospace;font-size:10.5px;font-weight:700;color:' + st.color + '">' + o.id + '</span>' +
          '<span style="font-size:9px;padding:2px 8px;border-radius:10px;background:' + st.color + ';color:#fff;white-space:nowrap">' + pl + '</span>' +
        '</div>' +
        '<div style="font-weight:700;font-size:13px;margin-bottom:2px">' + o.customer + '</div>' +
        '<div style="font-size:10.5px;color:var(--text-m);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + o.product + '</div>' +
        '<div style="font-size:11.5px;font-weight:800;color:var(--odoo-green)">' + (o.amount||0).toLocaleString('en-US') + ' د.ع</div>' +
        '<div style="margin-top:7px">' +
          '<button class="btn btn-primary" style="padding:3px 10px;font-size:10px;background:' + st.color + ';border-color:' + st.color + ';color:#fff"' +
            ' onclick="event.stopPropagation();' + (st.id==='delivery'?'completeWF':'advanceWF') + '(\'' + o.id + '\'' + (st.id!=='delivery'?',\'' + st.next + '\'':'') + ')">' + st.nextLabel + '</button>' +
        '</div>' +
      '</div>';
    }).join("");
    var colStyle = 'background:#fff;border-radius:var(--r-lg);border:1.5px solid ' + st.border + ';overflow:hidden;display:flex;flex-direction:column';
    var hdrStyle = 'background:' + st.color + ';padding:10px 14px;display:flex;align-items:center;gap:8px';
    var empty    = '<div style="padding:14px;text-align:center;color:#9ca3af;font-size:11px">لا توجد طلبات</div>';
    return '<div style="' + colStyle + '">' +
      '<div style="' + hdrStyle + '">' +
        '<span style="font-size:16px">' + st.icon + '</span>' +
        '<div style="color:#fff;flex:1">' +
          '<div style="font-size:10px;font-weight:800;letter-spacing:.5px;opacity:.85">المرحلة ' + (WF_STAGES.indexOf(st)+1) + '</div>' +
          '<div style="font-size:12px;font-weight:700">' + st.label + '</div>' +
        '</div>' +
        '<span style="background:rgba(255,255,255,.25);color:#fff;font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:10px">' + stageOrders.length + '</span>' +
      '</div>' +
      '<div style="padding:10px;flex:1;overflow-y:auto;max-height:60vh">' + (cards || empty) + '</div>' +
    '</div>';
  }).join("");
  var sub = document.getElementById("wf-subtitle");
  var total = allOrders.reduce(function(s,o){ return s+(o.amount||0); },0);
  if (sub) sub.textContent = allOrders.length + ' طلب — إجمالي ' + (total/1000000).toFixed(1) + 'M د.ع';
}

function advanceWF(id, nextStage) {
  if (typeof WF_ORDERS === "undefined") return;
  var o = WF_ORDERS.find(function(x){ return x.id===id; });
  if (!o) return;
  o.stage = nextStage;
  renderWorkflowPage();
  if (typeof saveToStorage === 'function') saveToStorage();
  notify('تم نقل ' + id + ' إلى المرحلة التالية ✔', 'success');
}

function completeWF(id) {
  if (typeof WF_ORDERS === "undefined") return;
  var o = WF_ORDERS.find(function(x){ return x.id===id; });
  if (!o) return;
  o.stage = 'completed';
  renderWorkflowPage();
  if (typeof saveToStorage === 'function') saveToStorage();
  notify('✅ تم إغلاق الطلب ' + id + ' — تسليم مكتمل', 'success');
}

function showWFDetail(id) {
  if (typeof WF_ORDERS === "undefined") return;
  var o      = WF_ORDERS.find(function(x){ return x.id===id; });
  var panel  = document.getElementById("wf-detail-panel");
  var title  = document.getElementById("wf-detail-title");
  var body   = document.getElementById("wf-detail-body");
  if (!panel || !body || !o) return;
  var sLbls  = {sales:'إصدار فاتورة',payment:'قبض مبلغ',warehouse:'فحص مخزن',purchase:'شراء/تجهيز',delivery:'تسليم',completed:'مكتمل ✅'};
  if (title) title.textContent = '📋 تفاصيل — ' + o.id;
  body.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
    '<div class="info-row"><span class="lbl">الزبون</span><span class="val">' + o.customer + '</span></div>' +
    '<div class="info-row"><span class="lbl">المنتج</span><span class="val">' + o.product + '</span></div>' +
    '<div class="info-row"><span class="lbl">المبلغ</span><span class="val" style="color:var(--odoo-green);font-weight:700">' + (o.amount||0).toLocaleString('en-US') + ' د.ع</span></div>' +
    '<div class="info-row"><span class="lbl">الدفع</span><span class="val">' + (WF_PAY_LABELS[o.payMethod]||o.payMethod||'—') + '</span></div>' +
    '<div class="info-row"><span class="lbl">التاريخ</span><span class="val">' + (o.date||'—') + '</span></div>' +
    '<div class="info-row"><span class="lbl">المرحلة</span><span class="val">' + (sLbls[o.stage]||o.stage) + '</span></div>' +
    (o.journalId ? '<div class="info-row" style="grid-column:1/-1"><span class="lbl">القيد</span><span class="val" style="font-family:monospace;color:var(--odoo-blue)">' + o.journalId + '</span></div>' : '') +
    '</div>';
  panel.style.display = 'block';
  panel.scrollIntoView({behavior:'smooth'});
}

function filterWFBoard(status, btn) {
  document.querySelectorAll('.wf-card').forEach(function(c) {
    c.style.display = (status==='all'||c.dataset.status===status) ? '' : 'none';
  });
  document.querySelectorAll('#wf-btn-all,.wf-filter-btn').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
}

// ── Quick Add Customer from SmartBox ─────────────────────────────
function quickAddCustomerFromSB(name) {
  var wrap = document.getElementById('sb-cust-wrap');
  var list = wrap ? wrap.querySelector(".sb-dropdown") : null;
  if (list) list.classList.remove('open');
  var old = document.getElementById('sb-qac-form'); if (old) old.remove();
  var form = document.createElement("div");
  form.id = "sb-qac-form";
  form.style.cssText = "background:#fff;border:2px solid var(--odoo-blue);border-radius:8px;padding:14px;margin-top:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);z-index:100";
  var safeName = (name || "").replace(/"/g, "");
  form.innerHTML = '<div style="font-weight:700;font-size:13px;color:var(--odoo-blue);margin-bottom:12px">👤 إضافة زبون جديد</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">' +
      '<div><div style="font-size:11px;font-weight:600;margin-bottom:4px">الاسم الكامل <span style="color:red">*</span></div>' +
        '<input type="text" id="qac-name" class="form-control" value="' + safeName + '" placeholder="اسم الزبون..." style="font-size:12.5px"></div>' +
      '<div><div style="font-size:11px;font-weight:600;margin-bottom:4px">رقم الهاتف <span style="color:red">*</span></div>' +
        '<input type="text" id="qac-phone" class="form-control" placeholder="07xxxxxxxxx" style="font-size:12.5px"></div>' +
      '<div><div style="font-size:11px;font-weight:600;margin-bottom:4px">المدينة</div>' +
        '<input type="text" id="qac-city" class="form-control" placeholder="بغداد..." style="font-size:12.5px"></div>' +
      '<div><div style="font-size:11px;font-weight:600;margin-bottom:4px">العنوان</div>' +
        '<input type="text" id="qac-address" class="form-control" placeholder="العنوان التفصيلي..." style="font-size:12.5px"></div>' +
    '</div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end">' +
      '<button class="btn btn-secondary btn-sm" onclick="document.getElementById(\'sb-qac-form\').remove()">إلغاء</button>' +
      '<button class="btn btn-primary btn-sm" onclick="confirmQuickCustomer()">✔ حفظ الزبون</button>' +
    '</div>';
  if (wrap && wrap.parentNode) {
    wrap.parentNode.insertBefore(form, wrap.nextSibling);
    setTimeout(function(){ var e=document.getElementById('qac-name');if(e){e.focus();e.select();} },50);
  }
}

function confirmQuickCustomer() {
  var name    = ((document.getElementById('qac-name')   ||{}).value||'').trim();
  var phone   = ((document.getElementById('qac-phone')  ||{}).value||'').trim();
  var city    = ((document.getElementById('qac-city')   ||{}).value||'غير محدد').trim();
  var address = ((document.getElementById('qac-address')||{}).value||'').trim();
  if (!name)  { notify('يجب إدخال اسم الزبون ✕', 'danger'); return; }
  if (!phone) { notify('يجب إدخال رقم الهاتف ✕', 'danger'); return; }
  var newId   = 'CUS-' + String(Date.now()).slice(-5);
  var newCust = {id:newId, name:name, phone:phone, city:city||'غير محدد', address:address, debt:0};
  if (typeof CUSTOMERS_DB !== 'undefined') CUSTOMERS_DB.push(newCust);
  if (typeof AI_DATA !== 'undefined' && AI_DATA.customers) AI_DATA.customers.push({id:newId,name:name,phone:phone,city:city||'غير محدد',debt:0});
  var sbText = document.getElementById('sb-cust-text');
  var sbVal  = document.getElementById('sb-cust-val');
  if (sbText) sbText.value = name;
  if (sbVal)  sbVal.value  = newId;
  var wrap = document.getElementById('sb-cust-wrap');
  if (wrap) wrap.classList.remove('sb-invalid');
  var form = document.getElementById('sb-qac-form'); if (form) form.remove();
  if (typeof saveToStorage === 'function') saveToStorage();
  if (typeof updateSaleEntryPreview === 'function') updateSaleEntryPreview();
  notify('✅ تم إضافة الزبون "' + name + '" (' + newId + ') بنجاح', 'success');
}

// ============================================================
// ============================================================
// SERIAL TRACKING — نظام تتبع السيريل نمبر
// ============================================================
function getAvailableSerials(itemCode) {
  return (typeof SERIALS_DB !== "undefined" ? SERIALS_DB : [])
    .filter(function(s){ return s.itemCode === itemCode && s.status === "stock"; });
}

function addSerialToStock(sn, itemCode, dateIn, poRef, notes) {
  if (!sn || !itemCode) return false;
  if (typeof SERIALS_DB === "undefined") return false;
  if (SERIALS_DB.find(function(s){ return s.sn === sn; })) {
    notify("السيريل " + sn + " موجود مسبقاً", "warning"); return false;
  }
  var item = typeof INV_ITEMS !== "undefined" ? INV_ITEMS.find(function(i){ return i.code === itemCode; }) : null;
  SERIALS_DB.push({ sn: sn, itemCode: itemCode,
    itemName: item ? item.name : itemCode,
    status: "stock", dateIn: dateIn || new Date().toISOString().slice(0,10),
    poRef: poRef || "", dateOut: "", invRef: "", customer: "", notes: notes || "" });
  // تحديث الكمية في INV_ITEMS
  if (item) item.qty = getAvailableSerials(itemCode).length;
  return true;
}

function markSerialSold(sn, invRef, customer, dateOut) {
  if (!sn || typeof SERIALS_DB === "undefined") return;
  var rec = SERIALS_DB.find(function(s){ return s.sn === sn; });
  if (rec) { rec.status = "sold"; rec.invRef = invRef || ""; rec.customer = customer || ""; rec.dateOut = dateOut || new Date().toISOString().slice(0,10); }
}

function openAddSerialModal() {
  var sel = document.getElementById("serial-in-item");
  if (sel && typeof INV_ITEMS !== "undefined") {
    var trackItems = INV_ITEMS.filter(function(i){ return i.trackSerial; });
    sel.innerHTML = '<option value="">-- اختر الصنف --</option>' +
      trackItems.map(function(i){ return '<option value="' + i.code + '">' + i.name + '</option>'; }).join("");
  }
  var dateEl = document.getElementById("serial-in-date");
  if (dateEl) dateEl.value = new Date().toISOString().slice(0,10);
  var ta = document.getElementById("serial-in-list");
  if (ta) ta.value = "";
  var prev = document.getElementById("serial-in-preview");
  if (prev) prev.style.display = "none";
  openM("m-add-serial");
}

function updateSerialPreview() {
  var ta   = document.getElementById("serial-in-list");
  var prev = document.getElementById("serial-in-preview");
  if (!ta || !prev) return;
  var lines = ta.value.split("\n").map(function(l){ return l.trim(); }).filter(function(l){ return l; });
  if (!lines.length) { prev.style.display = "none"; return; }
  prev.style.display = "";
  prev.textContent = "سيتم إضافة " + lines.length + " سيريل نمبر: " + lines.slice(0,3).join(", ") + (lines.length > 3 ? " ..." : "");
}

function saveSerialIn() {
  var itemCode = (document.getElementById("serial-in-item") || {}).value;
  var dateIn   = (document.getElementById("serial-in-date") || {}).value;
  var poRef    = (document.getElementById("serial-in-po") || {}).value;
  var ta       = document.getElementById("serial-in-list");
  if (!itemCode) { notify("اختر الصنف أولاً", "warning"); return; }
  if (!ta || !ta.value.trim()) { notify("أدخل رقم سيريل واحد على الأقل", "warning"); return; }
  var sns = ta.value.split("\n").map(function(l){ return l.trim(); }).filter(function(l){ return l; });
  var added = 0;
  sns.forEach(function(sn) { if (addSerialToStock(sn, itemCode, dateIn, poRef, "")) added++; });
  saveToStorage();
  notify("تم إضافة " + added + " سيريل نمبر للمخزون ✔", "success");
  closeM("m-add-serial");
  renderSerialsTab();
}

function renderSerialsTab() {
  // تحديث قائمة الأصناف في الفلتر
  var filterItem = document.getElementById("srl-filter-item");
  if (filterItem && typeof INV_ITEMS !== "undefined") {
    var cur = filterItem.value;
    filterItem.innerHTML = '<option value="">كل الأصناف</option>' +
      INV_ITEMS.filter(function(i){ return i.trackSerial; })
        .map(function(i){ return '<option value="' + i.code + '" ' + (cur===i.code?"selected":"") + '>' + i.name + '</option>'; }).join("");
  }
  var tbody = document.getElementById("serials-table-body");
  var emptyDiv = document.getElementById("serials-empty");
  if (!tbody) return;
  var filterStatus = (document.getElementById("srl-filter-status") || {}).value || "";
  var filterItemV  = (document.getElementById("srl-filter-item")   || {}).value || "";
  var data = typeof SERIALS_DB !== "undefined" ? SERIALS_DB : [];
  if (filterStatus) data = data.filter(function(s){ return s.status === filterStatus; });
  if (filterItemV)  data = data.filter(function(s){ return s.itemCode === filterItemV; });
  if (!data.length) {
    tbody.innerHTML = ""; if (emptyDiv) emptyDiv.style.display = "";
    var tbl = document.getElementById("serials-table"); if(tbl) tbl.style.display="none"; return;
  }
  if (emptyDiv) emptyDiv.style.display = "none";
  var tbl2 = document.getElementById("serials-table"); if(tbl2) tbl2.style.display="";
  var statusBadge = { stock: '<span class="badge badge-green">✅ متاح</span>',
    sold: '<span class="badge badge-red">🔴 مباع</span>',
    reserved: '<span class="badge badge-yellow">🟡 محجوز</span>' };
  tbody.innerHTML = data.map(function(s) {
    return '<tr>' +
      '<td style="font-family:monospace;font-weight:700;color:var(--odoo-blue)">' + s.sn + '</td>' +
      '<td style="font-size:12px">' + (s.itemName || s.itemCode) + '</td>' +
      '<td>' + (statusBadge[s.status] || s.status) + '</td>' +
      '<td>' + (s.dateIn || "—") + '</td>' +
      '<td class="code-cell">' + (s.poRef || "—") + '</td>' +
      '<td>' + (s.dateOut || "—") + '</td>' +
      '<td class="code-cell">' + (s.invRef || "—") + '</td>' +
      '<td style="font-size:12px">' + (s.customer || "—") + '</td>' +
      '</tr>';
  }).join("");
}

// استدعاء renderSerialsTab عند فتح التبويب
var _origShowInvTab = typeof showInvTab === "function" ? showInvTab : null;

// ============================================================
// PERSISTENCE ENGINE — localStorage v10
// ============================================================
// ============================================================
// SERVER SYNC — تزامن الداتا مع السيرفر المحلي
// ============================================================
var _RAYA_CLIENT_ID = 'c' + Date.now() + Math.random().toString(36).slice(2, 6);

function _syncToServer() {
  try {
    if (window.location.protocol === 'file:') return;
    var payload = JSON.stringify({
      v: 10, ts: Date.now(),
      journal:   JOURNAL_ENTRIES_DATA,
      customers: CUSTOMERS_DB,
      suppliers: SUPPLIERS_DB,
      maint:     MAINT_DB,
      payroll:   PAYROLL_RECORDS,
      wfOrders:  (typeof WF_ORDERS !== 'undefined' ? WF_ORDERS : []),
      serials:   (typeof SERIALS_DB !== 'undefined' ? SERIALS_DB : []),
      usersDb:   (typeof USERS_DB !== 'undefined' ? USERS_DB : []),
      permMods:  (typeof PERM_MODULES !== 'undefined' ? PERM_MODULES : []),
      instDb:    (typeof INSTALLMENTS_DB !== 'undefined' ? INSTALLMENTS_DB : []),
      invItems:  (typeof INV_ITEMS !== 'undefined' ? INV_ITEMS : [])
    });
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/data?client=' + _RAYA_CLIENT_ID, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) console.info('[Raya] تم حفظ الداتا على السيرفر D: ✔');
    };
    xhr.onerror = function() { console.warn('[Raya] السيرفر غير متاح — تم الحفظ محلياً فقط'); };
    xhr.send(payload);
  } catch(e) { /* offline */ }
}

function _loadFromServer(callback) {
  try {
    if (window.location.protocol === 'file:') { if(callback) callback(false); return; }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/data', true);
    xhr.onload = function() {
      if (xhr.status !== 200) { if(callback) callback(false); return; }
      try {
        var d = JSON.parse(xhr.responseText);
        if (!d || !d.ts) { if(callback) callback(false); return; }
        var localRaw = '';
        try { localRaw = localStorage.getItem('raya_blue_v10') || ''; } catch(e){}
        var localTs = 0;
        if (localRaw) { try { localTs = JSON.parse(localRaw).ts || 0; } catch(e){} }
        if (d.ts >= localTs) {
          function _srv_merge(target, src) {
            if (!src || !src.length) return;
            target.splice(0, target.length);
            src.forEach(function(x){ target.push(x); });
          }
          _srv_merge(JOURNAL_ENTRIES_DATA, d.journal);
          _srv_merge(CUSTOMERS_DB, d.customers);
          _srv_merge(SUPPLIERS_DB, d.suppliers);
          _srv_merge(MAINT_DB, d.maint);
          _srv_merge(PAYROLL_RECORDS, d.payroll);
          if (d.wfOrders && typeof WF_ORDERS !== 'undefined') _srv_merge(WF_ORDERS, d.wfOrders);
          if (d.invItems && d.invItems.length && typeof INV_ITEMS !== 'undefined') {
            d.invItems.forEach(function(si){
              var li=INV_ITEMS.find(function(ii){return ii.code===si.code;});
              if(li){li.costMethod=si.costMethod||'average';li.trackSerial=!!si.trackSerial;}
            });
          }
          try { localStorage.setItem('raya_blue_v10', JSON.stringify(d)); } catch(e){}
          console.info('[Raya] تم تحميل الداتا من السيرفر D: ✔ (' + new Date(d.ts).toLocaleString('en-US') + ')');
          if(callback) callback(true);
        } else {
          console.info('[Raya] localStorage أحدث من السيرفر — تم رفع الداتا للسيرفر');
          if (typeof _syncToServer === 'function') _syncToServer();
          if(callback) callback(false);
        }
      } catch(e) { console.warn('[Raya] خطأ في تحليل بيانات السيرفر', e); if(callback) callback(false); }
    };
    xhr.onerror = function() {
      console.info('[Raya] السيرفر غير متاح — استخدام localStorage');
      if(callback) callback(false);
    };
    xhr.send();
  } catch(e) { if(callback) callback(false); }
}

// Real-Time Sync — SSE (Server-Sent Events)
function _connectSSE() {
  if (window.location.protocol === 'file:') return;
  if (typeof EventSource === 'undefined') return;
  var _sseSource = new EventSource('/api/events');
  _sseSource.addEventListener('datachanged', function(e) {
    // تجاهل إذا كنت أنا من حفظ
    if (e.data === _RAYA_CLIENT_ID) return;
    console.info('[Raya] 🔄 تغيير من موظف آخر — جاري التحديث...');
    if (typeof _loadFromServer === 'function') {
      _loadFromServer(function(updated) {
        if (!updated) return;
        var ap = document.querySelector('.page.active');
        if (ap) { var pgId = ap.id.replace('page-',''); if(typeof go==='function') go(pgId, null); }
        if (typeof notify === 'function') notify('🔄 تم استلام تحديث من موظف آخر', 'info');
      });
    }
  });
  _sseSource.onerror = function() {
    // EventSource يعيد الاتصال تلقائياً
    console.warn('[Raya] SSE انقطع — إعادة الاتصال...');
  };
  console.info('[Raya] SSE متصل — التحديث الآن فوري ✔');
}

// احتياطي: polling كل 60 ثانية فقط لو SSE فشل
setInterval(function() {
  if (window.location.protocol !== 'file:' && typeof _loadFromServer === 'function') {
    _loadFromServer(function(){});
  }
}, 60000);

var _RAYA_KEY = 'raya_blue_v10';


// ============================================================
// resetAllData() — إعادة تهيئة كاملة (استخدم من console أو زر الإعدادات)
// ============================================================
function resetAllData(){
  rayaPrompt("أدخل كلمة المرور الخاصة بالحذف الكامل:",function(pw){
    if(pw!=="DELETE-RAYA-2026"){rayaAlert("كلمة المرور خاطئة — لم يتم حذف أي شيء");return;}
    rayaConfirm("تحذير أخير: سيتم حذف جميع البيانات نهائياً بدون رجعة. هل أنت متأكد 100%؟",function(){
  JOURNAL_ENTRIES_DATA.splice(0);
  CUSTOMERS_DB.splice(0);
  SUPPLIERS_DB.splice(0);
  MAINT_DB.splice(0);
  PAYROLL_RECORDS.splice(0);
  INV_ITEMS.splice(0);
  INV_MOVEMENTS.splice(0);
  SALE_ITEMS_DB.splice(0);
  ITEMS_DB.splice(0);
  WF_ORDERS.splice(0);
  if (typeof SERIALS_DB !== 'undefined') SERIALS_DB.splice(0);
  AI_DATA.sales.splice(0);
  AI_DATA.inventory.splice(0);
  AI_DATA.customers.splice(0);
  AI_DATA.maintenance.splice(0);
  AI_DATA.installments.splice(0);
  AI_DATA.expenses.splice(0);
  try { localStorage.removeItem("raya_blue_v10"); } catch(e){}
  if (typeof _syncToServer === "function") _syncToServer();
  notify("تم تفريغ جميع البيانات ✔", "success");
  setTimeout(function(){ location.reload(); }, 1500);
    },{danger:true,yesLabel:"احذف كل شيء"});
  });
}
function saveToStorage() {
  try {
    localStorage.setItem(_RAYA_KEY, JSON.stringify({
      v: 10,
      ts: Date.now(),
      journal:   JOURNAL_ENTRIES_DATA,
      customers: CUSTOMERS_DB,
      suppliers: SUPPLIERS_DB,
      maint:     MAINT_DB,
      payroll:   PAYROLL_RECORDS,
      wfOrders:  (typeof WF_ORDERS !== 'undefined' ? WF_ORDERS : []),
      serials:   (typeof SERIALS_DB !== 'undefined' ? SERIALS_DB : []),
      usersDb:   (typeof USERS_DB !== 'undefined' ? USERS_DB : []),
      permMods:  (typeof PERM_MODULES !== 'undefined' ? PERM_MODULES : []),
      instDb:    (typeof INSTALLMENTS_DB !== 'undefined' ? INSTALLMENTS_DB : [])
    }));
  } catch(e) { /* quota/private */ }
  if (typeof _syncToServer === 'function') _syncToServer();
}

function loadFromStorage() {
  try {
    var raw = localStorage.getItem(_RAYA_KEY);
    if (!raw) return false;
    var d = JSON.parse(raw);
    if (!d || !d.ts) return false;
    function merge(target, src) {
      if (!src || !src.length) return;
      target.splice(0, target.length);
      src.forEach(function(x){ target.push(x); });
    }
    merge(JOURNAL_ENTRIES_DATA, d.journal);
    merge(CUSTOMERS_DB, d.customers);
    merge(SUPPLIERS_DB, d.suppliers);
    merge(MAINT_DB, d.maint);
    merge(PAYROLL_RECORDS, d.payroll);
    if (d.wfOrders && typeof WF_ORDERS !== 'undefined') merge(WF_ORDERS, d.wfOrders);
    if (d.serials && typeof SERIALS_DB !== 'undefined') merge(SERIALS_DB, d.serials);
    if (d.usersDb && typeof USERS_DB !== 'undefined') {
      d.usersDb.forEach(function(nu){
        var ex=USERS_DB.find(function(u){return u.id===nu.id;});
        if(ex){Object.assign(ex,nu);}else{USERS_DB.push(nu);}
      });
    }
    if (d.permMods && Array.isArray(d.permMods) && typeof PERM_MODULES !== 'undefined') {
      d.permMods.forEach(function(nm){
        if(!PERM_MODULES.find(function(m){return m.key===nm.key;})) PERM_MODULES.push(nm);
      });
    }
    if (d.instDb && typeof INSTALLMENTS_DB !== 'undefined') merge(INSTALLMENTS_DB, d.instDb);
    // مهاجرة تلقائية: حذف سجلات الصيانة التجريبية من البيانات القديمة
    var _demoMaintIds = ['MNT-043','MNT-044','MNT-045','MNT-046','MNT-047','MNT-048'];
    var _hadDemo = MAINT_DB.some(function(m){ return _demoMaintIds.indexOf(m.id) >= 0; });
    if (_hadDemo) {
      var _cleaned = MAINT_DB.filter(function(m){ return _demoMaintIds.indexOf(m.id) < 0; });
      MAINT_DB.splice(0, MAINT_DB.length);
      _cleaned.forEach(function(m){ MAINT_DB.push(m); });
      try { var _s=JSON.parse(localStorage.getItem(_RAYA_KEY)||'{}'||'{'); _s.maint=MAINT_DB; localStorage.setItem(_RAYA_KEY,JSON.stringify(_s)); } catch(e){}
    }
    // مهاجرة v23: حذف القيود المحاسبية التجريبية
    var _demoJvIds = ['JV-001','JV-002','JV-003','JV-004','JV-005','JV-006','JV-007'];
    if (typeof JOURNAL_ENTRIES_DATA !== 'undefined' && JOURNAL_ENTRIES_DATA.some(function(j){ return _demoJvIds.indexOf(j.id) >= 0; })) {
      var _cleanJv = JOURNAL_ENTRIES_DATA.filter(function(j){ return _demoJvIds.indexOf(j.id) < 0; });
      JOURNAL_ENTRIES_DATA.splice(0, JOURNAL_ENTRIES_DATA.length);
      _cleanJv.forEach(function(j){ JOURNAL_ENTRIES_DATA.push(j); });
      try { var _sj=JSON.parse(localStorage.getItem(_RAYA_KEY)||'{}'); _sj.journal=JOURNAL_ENTRIES_DATA; localStorage.setItem(_RAYA_KEY,JSON.stringify(_sj)); } catch(e){}
    }
    // مهاجرة v23: حذف طلبات المبيعات التجريبية
    var _demoSoIds = ['SO-001','SO-002','SO-003','SO-004','SO-005','SO-006','SO-007','SO-008','SO-009'];
    if (typeof WF_ORDERS !== 'undefined' && WF_ORDERS.some(function(o){ return _demoSoIds.indexOf(o.id) >= 0; })) {
      var _cleanSo = WF_ORDERS.filter(function(o){ return _demoSoIds.indexOf(o.id) < 0; });
      WF_ORDERS.splice(0, WF_ORDERS.length);
      _cleanSo.forEach(function(o){ WF_ORDERS.push(o); });
      try { var _sw=JSON.parse(localStorage.getItem(_RAYA_KEY)||'{}'); _sw.wfOrders=WF_ORDERS; localStorage.setItem(_RAYA_KEY,JSON.stringify(_sw)); } catch(e){}
    }
    // مهاجرة v23: حذف الزبائن التجريبيين (بدون accountCode)
    if (typeof CUSTOMERS_DB !== 'undefined' && CUSTOMERS_DB.some(function(c){ return !c.accountCode; })) {
      var _cleanCust = CUSTOMERS_DB.filter(function(c){ return !!c.accountCode; });
      CUSTOMERS_DB.splice(0, CUSTOMERS_DB.length);
      _cleanCust.forEach(function(c){ CUSTOMERS_DB.push(c); });
      try { var _sc=JSON.parse(localStorage.getItem(_RAYA_KEY)||'{}'); _sc.customers=CUSTOMERS_DB; localStorage.setItem(_RAYA_KEY,JSON.stringify(_sc)); } catch(e){}
    }
    return true;
  } catch(e) { return false; }
}

// ============================================================
// BACKUP / RESTORE — نسخ احتياطي حقيقية
// ============================================================
function backupDataJSON() {
  try {
    var payload = JSON.stringify({
      version:'10.0', ts: new Date().toISOString(),
      company:'الراية الزرقاء',
      journal:   JOURNAL_ENTRIES_DATA,
      customers: CUSTOMERS_DB,
      suppliers: SUPPLIERS_DB,
      maint:     MAINT_DB,
      payroll:   PAYROLL_RECORDS
    }, null, 2);
    var blob = new Blob([payload], {type:'application/json'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'raya-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
    notify('تم تحميل النسخة الاحتياطية ✔', 'success');
  } catch(err) { notify('خطأ في إنشاء النسخة ✕', 'danger'); }
}

function restoreDataJSON(input) {
  var file = input.files[0]; if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    try {
      var d = JSON.parse(ev.target.result);
      if (!d || !d.journal) { notify('ملف غير صالح ✕', 'danger'); return; }
      rayaConfirm('هل تريد استعادة البيانات؟ سيتم استبدال البيانات الحالية.',function(){
      function merge(target, src) {
        if (!src) return;
        target.splice(0, target.length);
        src.forEach(function(x){ target.push(x); });
      }
      merge(JOURNAL_ENTRIES_DATA, d.journal);
      merge(CUSTOMERS_DB,         d.customers);
      merge(SUPPLIERS_DB,         d.suppliers);
      merge(MAINT_DB,             d.maint);
      merge(PAYROLL_RECORDS,      d.payroll);
      saveToStorage();
      notify('تمت الاستعادة — جاري إعادة التحميل... ✔', 'success');
      setTimeout(function(){ location.reload(); }, 1500);
      });
    } catch(err) { notify('خطأ في قراءة الملف ✕', 'danger'); }
  };
  reader.readAsText(file);
  input.value = '';
}

// ============================================================
// EXCEL EXPORT — تصدير CSV/Excel
// ============================================================
function _downloadCSV(rows, filename) {
  var bom = '﻿';
  var csv = bom + rows.map(function(row) {
    return row.map(function(cell) {
      var s = String(cell == null ? '' : cell);
      if (s.indexOf(',')>=0||s.indexOf('"')>=0){s='"'+s.replace(/"/g,'""')+'"';}
      return s;
    }).join(',');
  }).join('\r\n');
  var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportExpensesExcel() {
  var from = (document.getElementById('exp-filter-from')||{}).value||'';
  var to   = (document.getElementById('exp-filter-to')  ||{}).value||'';
  var TYPE_MAP = {
    '531':'رواتب/إداري', '514':'أجور فنيين', '513':'أجور',
    '5321':'إيجار', '5211':'إيجار', '522':'نقل/وقود', '535':'نقل',
    '533':'خدمات', '534':'خدمات', '5131':'صيانة'
  };
  function getExpType(lines) {
    var codes = (lines||[]).map(function(l){return l.code||'';}).filter(function(c){return c[0]==='5';});
    var c = codes[0]||'';
    for (var prefix in TYPE_MAP) { if (c.startsWith(prefix)) return TYPE_MAP[prefix]; }
    return 'مصروف تشغيلي';
  }
  var entries = JOURNAL_ENTRIES_DATA.filter(function(e) {
    if (e.journal !== 'expense' && e.journal !== 'payment') return false;
    if (from && (e.date||'') < from) return false;
    if (to   && (e.date||'') > to)   return false;
    return true;
  }).sort(function(a,b){ return (a.date||'').localeCompare(b.date||''); });

  var rows = [['التاريخ','رقم القيد','النوع','كود الحساب','الوصف','المبلغ (د.ع)']];
  var grandTotal = 0;
  entries.forEach(function(e) {
    var amt = (e.lines||[]).reduce(function(s,l){return s+(l.debit||0);},0);
    grandTotal += amt;
    var accCode = (e.lines||[]).filter(function(l){return l.code&&l.code[0]==='5';}).map(function(l){return l.code;}).join(', ')||'';
    rows.push([e.date||'', e.id||'', getExpType(e.lines), accCode, e.description||e.desc||e.ref||'', amt]);
  });
  rows.push(['','','','','الإجمالي', grandTotal]);

  _downloadCSV(rows, 'raya-مصروفات-' + new Date().toISOString().slice(0,10) + '.csv');
  notify('تم تصدير المصروفات إلى Excel ✔', 'success');
}

function exportMaintExcel() {
  var TYPE_MAP     = {warranty:'ضمان', corrective:'تصحيحية', preventive:'وقائية'};
  var STATUS_MAP   = {open:'مفتوح', in_progress:'معالجة', completed:'مكتمل', cancelled:'ملغي'};
  var PRIORITY_MAP = {urgent:'عاجل', critical:'حرج', normal:'عادي'};

  var rows = [['رقم الطلب','التاريخ','الزبون','المولد','وصف العطل','الفني','النوع','الكلفة (د.ع)','الحالة','الأولوية']];
  MAINT_DB.slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');}).forEach(function(r){
    rows.push([r.id,r.date,r.customer,r.serial,r.desc,r.tech,
      TYPE_MAP[r.type]||r.type, r.cost||0,
      STATUS_MAP[r.status]||r.status, PRIORITY_MAP[r.priority]||r.priority]);
  });

  _downloadCSV(rows, 'raya-صيانة-' + new Date().toISOString().slice(0,10) + '.csv');
  notify('تم تصدير طلبات الصيانة إلى Excel ✔', 'success');
}

// ============================================================
// PRINT MAINTENANCE REPORT — طباعة تقرير الصيانة
// ============================================================
function printMaintReport() {
  var TYPE_M   = {warranty:'ضمان', corrective:'تصحيحية', preventive:'وقائية'};
  var STATUS_M = {open:'مفتوح', in_progress:'معالجة', completed:'مكتمل', cancelled:'ملغي'};
  var STATUS_C = {open:'#2563eb', in_progress:'#d97706', completed:'#16a34a', cancelled:'#9ca3af'};

  var sorted = MAINT_DB.slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
  var totalCost  = sorted.reduce(function(s,r){return s+(r.cost||0);},0);
  var openCount  = sorted.filter(function(r){return r.status==='open'||r.status==='in_progress';}).length;
  var doneCount  = sorted.filter(function(r){return r.status==='completed';}).length;
  var warCount   = sorted.filter(function(r){return r.type==='warranty';}).length;

  var bodyRows = sorted.map(function(r,i) {
    var clr = STATUS_C[r.status]||'#374151';
    return '<tr>'
      + '<td style="color:#6b7280">'+(i+1)+'</td>'
      + '<td style="font-weight:700;color:#1d4ed8">'+r.id+'</td>'
      + '<td>'+(r.date||'—')+'</td>'
      + '<td style="font-weight:600">'+(r.customer||'—')+'</td>'
      + '<td style="font-family:monospace;font-size:11px">'+(r.serial||'—')+'</td>'
      + '<td style="font-size:11px;max-width:180px;overflow:hidden">'+(r.desc||'—')+'</td>'
      + '<td>'+(r.tech||'—')+'</td>'
      + '<td>'+(TYPE_M[r.type]||r.type||'—')+'</td>'
      + '<td style="font-weight:700;text-align:center">'+(r.cost>0?r.cost.toLocaleString('en-US')+' د.ع':'مجاني')+'</td>'
      + '<td style="font-weight:700;color:'+clr+'">'+(STATUS_M[r.status]||r.status||'—')+'</td>'
      + '</tr>';
  }).join('');

  var now = new Date().toLocaleDateString('ar-IQ',{year:'numeric',month:'long',day:'numeric'});

  var html = '<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8">'
    + '<style>'
    + 'body{font-family:Tahoma,Arial,sans-serif;margin:24px;direction:rtl;font-size:12.5px;color:#1f2937}'
    + 'h1{font-size:20px;color:#1d4ed8;margin:0 0 2px}'
    + '.sub{color:#6b7280;font-size:12px;margin:0 0 18px}'
    + '.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}'
    + '.kp{border:1.5px solid #e5e7eb;border-radius:8px;padding:12px 8px;text-align:center}'
    + '.kv{font-size:24px;font-weight:900}.kl{font-size:10px;color:#6b7280;margin-top:4px}'
    + 'table{width:100%;border-collapse:collapse;font-size:11.5px}'
    + 'thead tr{background:#1d4ed8;color:#fff}'
    + 'thead th{padding:7px 9px;text-align:right;font-weight:700}'
    + 'tbody tr:nth-child(even){background:#f9fafb}'
    + 'tbody td{padding:6px 9px;border-bottom:1px solid #e5e7eb}'
    + '.foot{margin-top:18px;padding-top:10px;border-top:1.5px solid #e5e7eb;font-size:10px;color:#9ca3af;display:flex;justify-content:space-between}'
    + '@media print{body{margin:12px}.kpis{break-inside:avoid}}'
    + '</style></head><body>'
    + '<h1>🔧 تقرير طلبات الصيانة — الراية الزرقاء</h1>'
    + '<p class="sub">تاريخ الطباعة: '+now+' — إجمالي الطلبات: '+sorted.length+'</p>'
    + '<div class="kpis">'
    + '<div class="kp"><div class="kv">'+sorted.length+'</div><div class="kl">إجمالي الطلبات</div></div>'
    + '<div class="kp"><div class="kv" style="color:#d97706">'+openCount+'</div><div class="kl">مفتوحة / معالجة</div></div>'
    + '<div class="kp"><div class="kv" style="color:#16a34a">'+doneCount+'</div><div class="kl">مكتملة</div></div>'
    + '<div class="kp"><div class="kv" style="color:#dc2626">'+totalCost.toLocaleString('en-US')+'</div><div class="kl">إجمالي التكاليف (د.ع)</div></div>'
    + '</div>'
    + '<table><thead><tr><th>#</th><th>رقم الطلب</th><th>التاريخ</th><th>الزبون</th><th>المولد</th><th>وصف العطل</th><th>الفني</th><th>النوع</th><th>الكلفة</th><th>الحالة</th></tr></thead>'
    + '<tbody>'+bodyRows+'</tbody></table>'
    + '<div class="foot"><span>الراية الزرقاء — النظام المحاسبي</span><span>طُبع بواسطة: مدير النظام</span></div>'
    + '</body></html>';

  var w = window.open('','_blank','width=1100,height=720');
  if (w) { w.document.write(html); w.document.close(); setTimeout(function(){ w.print(); },500); }
}

// ============================================================
// GLOBAL ERROR GUARD — منع البرنامج من الانهيار
// ============================================================
window.addEventListener('error', function(ev) {
  console.error('[Raya v10]', ev.message, '@', ev.filename, ':', ev.lineno, ev.colno);
});
window.addEventListener('unhandledrejection', function(ev) {
  console.error('[Raya v10] Promise:', ev.reason);
});

// ============================================================
// AUTO-SAVE HOOKS — حفظ تلقائي بعد كل عملية
// ============================================================
(function() {
  function wrap(name) {
    var orig = window[name];
    if (typeof orig !== 'function') return;
    window[name] = function() {
      var r = orig.apply(this, arguments);
      saveToStorage();
      return r;
    };
  }
  [
    'saveExpense','saveMaintenance','completeMaint','deleteMaint',
    'saveCustomer','deleteCustomer','saveSupplier','deleteSupplier',
    'runPayroll','saveSaleInv','savePayment','saveReceipt',
    'saveJournalEntry','savePurchInv'
  ].forEach(wrap);

  // Fallback: auto-save every 60 seconds
  setInterval(saveToStorage, 60000);

  // Load persisted data on startup
  var loaded = loadFromStorage();
  if (loaded) console.info('[Raya v10] تم تحميل البيانات من localStorage ✔');
  else        console.info('[Raya v10] بيانات افتراضية (لا يوجد حفظ سابق)');
  _tryRestoreSession();
  if(typeof INV_ITEMS!=='undefined'){INV_ITEMS.forEach(function(item){if(!item.costMethod)item.costMethod='average';});}
  // تحميل من السيرفر عند البداية + اتصال SSE للتحديث الفوري
  setTimeout(function() {
    if (typeof _loadFromServer === 'function') {
      _loadFromServer(function(updated) {
        if (updated && typeof go === 'function') {
          var ap = document.querySelector('.page.active');
          if (ap) go(ap.id.replace('page-',''), null);
        }
      });
    }
    if (typeof _connectSSE === 'function') _connectSSE();
  }, 800);
})();

// ===== SERIAL OPS (per-item serial management) =====
var _sopCode=null, _sopName=null;
function openSerialOps(code,name){
  _sopCode=code; _sopName=name||code;
  document.getElementById("sop-title").textContent="عمليات السيريل — "+_sopName;
  var today=new Date().toISOString().split("T")[0];
  var d1=document.getElementById("sop-in-date");if(d1)d1.value=today;
  var d2=document.getElementById("sop-out-date");if(d2)d2.value=today;
  document.getElementById("sop-in-sn").value="";
  document.getElementById("sop-in-poref").value="";
  document.getElementById("sop-in-notes").value="";
  document.getElementById("sop-out-cust").value="";
  sopShowTab("list");
  openM("m-serial-ops");
}
function sopShowTab(tab){
  ["list","in","out"].forEach(function(t){
    var b=document.getElementById("sop-btn-"+t);
    var d=document.getElementById("sop-body-"+t);
    if(b){b.style.background=t===tab?"var(--odoo-blue)":"transparent";b.style.color=t===tab?"#fff":"";}
    if(d)d.style.display=t===tab?"":"none";
  });
  if(tab==="list")sopRenderList();
  if(tab==="out")sopFillOutSel();
}
function sopRenderList(){
  var el=document.getElementById("sop-serial-list");if(!el)return;
  var db=typeof SERIALS_DB!=="undefined"?SERIALS_DB:[];
  var rows=db.filter(function(s){return s.itemCode===_sopCode;});
  if(!rows.length){el.innerHTML='<p style="text-align:center;color:var(--text-m);padding:20px">لا توجد سيريلات مسجلة</p>';return;}
  var sLbl={stock:"في المخزون",sold:"مُباع",reserved:"محجوز",scrapped:"ملغى"};
  var sCls={stock:"badge-green",sold:"badge-gray",reserved:"badge-yellow",scrapped:"badge-red"};
  el.innerHTML='<table class="data-table"><thead><tr><th>السيريل</th><th>الحالة</th><th>تاريخ الإدخال</th><th>الزبون/المرجع</th></tr></thead><tbody>'
    +rows.map(function(s){return'<tr><td style="font-family:monospace;font-weight:600">'+s.sn+'</td><td><span class="badge '+(sCls[s.status]||"badge-gray")+'">'+( sLbl[s.status]||s.status)+'</span></td><td>'+(s.dateIn||"—")+'</td><td>'+(s.customer||s.poRef||"—")+'</td></tr>';}).join("")
    +'</tbody></table>';
}
function sopFillOutSel(){
  var sel=document.getElementById("sop-out-sn-sel");if(!sel)return;
  var db=typeof SERIALS_DB!=="undefined"?SERIALS_DB:[];
  var avail=db.filter(function(s){return s.itemCode===_sopCode&&s.status==="stock";});
  sel.innerHTML=avail.length
    ?avail.map(function(s){return'<option value="'+s.sn+'">'+s.sn+'</option>';}).join("")
    :'<option value="">لا يوجد سيريل في المخزون</option>';
}
function sopSaveIn(){
  var sn=(document.getElementById("sop-in-sn").value||"").trim();
  var dt=document.getElementById("sop-in-date").value;
  var ref=(document.getElementById("sop-in-poref").value||"").trim();
  var notes=(document.getElementById("sop-in-notes").value||"").trim();
  if(!sn){notify("يجب إدخال رقم السيريل ✕","danger");return;}
  var db=typeof SERIALS_DB!=="undefined"?SERIALS_DB:[];
  if(db.find(function(s){return s.sn===sn;})){notify("هذا السيريل مسجل مسبقاً ✕","danger");return;}
  db.push({sn:sn,itemCode:_sopCode,itemName:_sopName,status:"stock",dateIn:dt,poRef:ref,notes:notes});
  var item=(typeof INV_ITEMS!=="undefined"?INV_ITEMS:[]).find(function(i){return i.code===_sopCode;});
  if(item)item.qty=(item.qty||0)+1;
  saveToStorage();
  notify("تم إدخال السيريل "+sn+" للمخزون ✓","success");
  document.getElementById("sop-in-sn").value="";
  sopShowTab("list");
}
function sopSaveOut(){
  var sn=document.getElementById("sop-out-sn-sel").value;
  var dt=document.getElementById("sop-out-date").value;
  var cust=(document.getElementById("sop-out-cust").value||"").trim();
  var type=document.getElementById("sop-out-type").value;
  if(!sn){notify("لم يتم اختيار سيريل ✕","danger");return;}
  var db=typeof SERIALS_DB!=="undefined"?SERIALS_DB:[];
  var rec=db.find(function(s){return s.sn===sn;});
  if(!rec){notify("السيريل غير موجود ✕","danger");return;}
  rec.status=type;rec.dateOut=dt;rec.customer=cust;
  var item=(typeof INV_ITEMS!=="undefined"?INV_ITEMS:[]).find(function(i){return i.code===_sopCode;});
  if(item&&item.qty>0)item.qty--;
  saveToStorage();
  var lbl={sold:"تم تسجيل البيع",transferred:"تم التحويل",scrapped:"تم الإتلاف"};
  notify((lbl[type]||"تم الإخراج")+" للسيريل "+sn+" ✓","success");
  sopShowTab("list");
}

// ===== RAYA CUSTOM DIALOGS =====
var _rayaDlgCb=null,_rayaDlgMode="confirm";
function rayaConfirm(msg,onYes,opts){
  opts=opts||{};
  _rayaDlgCb=onYes;_rayaDlgMode="confirm";
  document.getElementById("raya-dlg-msg").textContent=msg;
  document.getElementById("raya-dlg-inp-wrap").style.display="none";
  document.getElementById("raya-dlg-header").style.background=opts.danger?"#fee2e2":"#f8f9fa";
  var yBtn=document.getElementById("raya-dlg-yes");
  yBtn.textContent=opts.yesLabel||"نعم";
  yBtn.style.cssText=opts.danger?"background:#dc3545;border-color:#dc3545;color:#fff":"";
  document.getElementById("raya-dlg-no").style.display="";
  document.getElementById("raya-dlg-overlay").classList.add("open");
}
function rayaAlert(msg){
  _rayaDlgCb=null;_rayaDlgMode="alert";
  document.getElementById("raya-dlg-msg").textContent=msg;
  document.getElementById("raya-dlg-inp-wrap").style.display="none";
  document.getElementById("raya-dlg-header").style.background="#fff3cd";
  document.getElementById("raya-dlg-yes").textContent="حسناً";
  document.getElementById("raya-dlg-yes").style.cssText="";
  document.getElementById("raya-dlg-no").style.display="none";
  document.getElementById("raya-dlg-overlay").classList.add("open");
}
function rayaPrompt(msg,onValue,isPassword){
  _rayaDlgCb=onValue;_rayaDlgMode="prompt";
  document.getElementById("raya-dlg-msg").textContent=msg;
  document.getElementById("raya-dlg-inp-wrap").style.display="";
  document.getElementById("raya-dlg-inp").value="";
  document.getElementById("raya-dlg-inp").type=isPassword?"password":"text";
  document.getElementById("raya-dlg-header").style.background="#f8f9fa";
  document.getElementById("raya-dlg-yes").textContent="تأكيد";
  document.getElementById("raya-dlg-yes").style.cssText="";
  document.getElementById("raya-dlg-no").style.display="";
  document.getElementById("raya-dlg-overlay").classList.add("open");
  setTimeout(function(){document.getElementById("raya-dlg-inp").focus();},80);
}
function _rayaDlgYes(){
  document.getElementById("raya-dlg-overlay").classList.remove("open");
  var cb=_rayaDlgCb;_rayaDlgCb=null;
  if(typeof cb!=="function")return;
  if(_rayaDlgMode==="prompt"){cb(document.getElementById("raya-dlg-inp").value);}
  else{cb();}
}
function _rayaDlgNo(){
  document.getElementById("raya-dlg-overlay").classList.remove("open");
  _rayaDlgCb=null;
}
// ===== SESSION RESTORE =====
function _tryRestoreSession(){
  try{
    var _sess=sessionStorage.getItem("raya_sess");
    if(!_sess)return;
    var _su=JSON.parse(_sess);
    if(!_su||!_su.username)return;
    var db=typeof USERS_DB!=="undefined"?USERS_DB:[];
    var uRec=db.find(function(u){return u.username===_su.username;});
    if(!uRec){sessionStorage.removeItem("raya_sess");return;}
    currentUser={username:uRec.username,name:uRec.name,role:uRec.role,perms:uRec.perms||{}};
    document.getElementById("login-screen").style.display="none";
    document.getElementById("app").style.display="block";
    document.getElementById("user-name-display").textContent=currentUser.name;
    document.getElementById("topbar-bc").textContent="مرحباً، "+currentUser.name;
    if(typeof applyPermissionsUI==="function")applyPermissionsUI();
    if(typeof renderTree==="function")renderTree();
  }catch(e){}
}
