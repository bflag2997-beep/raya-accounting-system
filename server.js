'use strict';
// =====================================================
//  نظام الراية الزرقاء — السيرفر المحلي
//  Real-Time Sync عبر SSE | البيانات في PostgreSQL
// =====================================================
const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { Pool } = require('pg');

// ===== إعدادات =====
const PORT     = 3333;
const HTML_DIR = __dirname;
// ===================

// ===== اتصال PostgreSQL =====
const pool = new Pool({
  host:     'localhost',
  port:     5432,
  database: 'raya_db',
  user:     'postgres',
  password: 'Ihsaan.1997@@',
  max:      10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', function(err) {
  console.error('[PG] خطأ في الاتصال:', err.message);
});

// اختبار الاتصال عند البدء
pool.query('SELECT NOW() as now').then(function(r) {
  console.log('[PG] متصل بـ raya_db ✔ —', r.rows[0].now);
}).catch(function(e) {
  console.error('[PG] فشل الاتصال:', e.message);
  process.exit(1);
});

// ===== MIME Types =====
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico':  'image/x-icon'
};

// ===== SSE Clients =====
var sseClients = [];

function broadcastChange(fromClientId) {
  var dead = [];
  sseClients.forEach(function(c) {
    try { c.res.write('event: datachanged\ndata: ' + (fromClientId || '') + '\n\n'); }
    catch(e) { dead.push(c.id); }
  });
  if (dead.length) {
    sseClients = sseClients.filter(function(c) { return dead.indexOf(c.id) < 0; });
  }
}

// ============================================================
// تحويل بيانات قاعدة البيانات → تنسيق HTML
// ============================================================
function mapJournal(r) {
  return { id: r.id, date: r.entry_date, journal: r.journal, ref: r.ref,
    customer: r.customer, customerId: r.customer_id,
    supplier: r.supplier, supplierId: r.supplier_id,
    type: r.entry_type, method: r.method, narration: r.narration,
    lines: r.lines || [] };
}
function mapCustomer(r) {
  return { id: r.id, code: r.code, name: r.name, accountCode: r.account_code,
    phone: r.phone, city: r.city, debt: parseFloat(r.debt) || 0, notes: r.notes };
}
function mapSupplier(r) {
  return { id: r.id, code: r.code, name: r.name, accountCode: r.account_code,
    phone: r.phone, city: r.city, balance: parseFloat(r.balance) || 0, notes: r.notes };
}
function mapMaint(r) {
  return { id: r.id, customer: r.customer, serial: r.serial, desc: r.description,
    status: r.status, date: r.req_date, cost: parseFloat(r.cost) || 0, notes: r.notes };
}
function mapPayroll(r) {
  return { id: r.id, month: r.pay_month, empName: r.emp_name, empId: r.emp_id,
    salary: parseFloat(r.salary) || 0, additions: parseFloat(r.additions) || 0,
    deductions: parseFloat(r.deductions) || 0, net: parseFloat(r.net) || 0 };
}
function mapWfOrder(r) {
  return { id: r.id, date: r.ord_date, custId: r.cust_id, custName: r.cust_name,
    stage: r.stage, amount: parseFloat(r.amount) || 0, payMethod: r.pay_method,
    items: r.items || [], notes: r.notes };
}
function mapSerial(r) {
  return { sn: r.sn, itemCode: r.item_code, itemName: r.item_name, status: r.status,
    dateIn: r.date_in, poRef: r.po_ref, dateOut: r.date_out, invRef: r.inv_ref,
    customer: r.customer, notes: r.notes };
}
function mapUser(r) {
  return { id: r.id, username: r.username, pass: r.pass, name: r.full_name,
    role: r.role, perms: r.perms || {}, lastLogin: r.last_login };
}
function mapPermMod(r) { return { key: r.key, label: r.label }; }
function mapInstallment(r) {
  return { id: r.id, date: r.inst_date, custId: r.cust_id, custName: r.cust_name,
    invRef: r.inv_ref, totalAmt: parseFloat(r.total_amt) || 0,
    downPayment: parseFloat(r.down_payment) || 0,
    numInst: r.num_inst || 6, payments: r.payments || [] };
}
function mapItem(r) {
  return { code: r.code, name: r.name, cat: r.cat, unit: r.unit,
    price: parseFloat(r.price) || 0, min: parseFloat(r.min_qty) || 0,
    qty: parseFloat(r.qty) || 0, cost: parseFloat(r.cost) || 0,
    costMethod: r.cost_method || 'average',
    trackSerial: r.track_serial || false };
}

// ============================================================
// تحميل كل البيانات من PostgreSQL
// ============================================================
async function loadAllData() {
  const results = await Promise.all([
    pool.query('SELECT * FROM journal_entries ORDER BY entry_date DESC, id DESC'),
    pool.query('SELECT * FROM customers ORDER BY name'),
    pool.query('SELECT * FROM suppliers ORDER BY name'),
    pool.query('SELECT * FROM maint_requests ORDER BY req_date DESC'),
    pool.query('SELECT * FROM payroll_records ORDER BY pay_month DESC'),
    pool.query('SELECT * FROM wf_orders ORDER BY ord_date DESC'),
    pool.query('SELECT * FROM serials ORDER BY date_in DESC'),
    pool.query('SELECT * FROM app_users ORDER BY username'),
    pool.query('SELECT * FROM perm_modules ORDER BY sort_order, key'),
    pool.query('SELECT * FROM installments ORDER BY inst_date DESC'),
    pool.query('SELECT * FROM items ORDER BY cat, name'),
  ]);

  const ts = Date.now();
  await pool.query("UPDATE app_settings SET value=$1, updated_at=now() WHERE key='data_ts'", [ts.toString()]);

  return {
    v: 10,
    ts: ts,
    journal:   results[0].rows.map(mapJournal),
    customers: results[1].rows.map(mapCustomer),
    suppliers: results[2].rows.map(mapSupplier),
    maint:     results[3].rows.map(mapMaint),
    payroll:   results[4].rows.map(mapPayroll),
    wfOrders:  results[5].rows.map(mapWfOrder),
    serials:   results[6].rows.map(mapSerial),
    usersDb:   results[7].rows.map(mapUser),
    permMods:  results[8].rows.map(mapPermMod),
    instDb:    results[9].rows.map(mapInstallment),
    invItems:  results[10].rows.map(mapItem),
  };
}

// ============================================================
// حفظ البيانات في PostgreSQL (upsert)
// ============================================================
async function saveAllData(d) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Journal Entries ──────────────────────────────────
    if (d.journal && d.journal.length) {
      const ids = d.journal.map(function(r) { return r.id; });
      await client.query('DELETE FROM journal_entries WHERE id != ALL($1)', [ids]);
      for (const r of d.journal) {
        await client.query(
          `INSERT INTO journal_entries (id,entry_date,journal,ref,customer,customer_id,supplier,supplier_id,entry_type,method,narration,lines)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
           ON CONFLICT (id) DO UPDATE SET
             entry_date=$2,journal=$3,ref=$4,customer=$5,customer_id=$6,
             supplier=$7,supplier_id=$8,entry_type=$9,method=$10,narration=$11,lines=$12`,
          [r.id, r.date||null, r.journal||null, r.ref||null,
           r.customer||null, r.customerId||null, r.supplier||null, r.supplierId||null,
           r.type||null, r.method||null, r.narration||null, JSON.stringify(r.lines||[])]
        );
      }
    } else if (d.journal && d.journal.length === 0) {
      await client.query('DELETE FROM journal_entries');
    }

    // ── Customers ────────────────────────────────────────
    if (d.customers) {
      const ids = d.customers.filter(function(r){return r.id;}).map(function(r){return r.id;});
      if (ids.length) await client.query('DELETE FROM customers WHERE id != ALL($1)', [ids]);
      for (const r of d.customers) {
        if (!r.id) continue;
        await client.query(
          `INSERT INTO customers (id,code,name,account_code,phone,city,debt,notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET
             code=$2,name=$3,account_code=$4,phone=$5,city=$6,debt=$7,notes=$8`,
          [r.id, r.code||null, r.name||'', r.accountCode||null,
           r.phone||null, r.city||null, r.debt||0, r.notes||null]
        );
      }
    }

    // ── Suppliers ────────────────────────────────────────
    if (d.suppliers) {
      const ids = d.suppliers.filter(function(r){return r.id;}).map(function(r){return r.id;});
      if (ids.length) await client.query('DELETE FROM suppliers WHERE id != ALL($1)', [ids]);
      for (const r of d.suppliers) {
        if (!r.id) continue;
        await client.query(
          `INSERT INTO suppliers (id,code,name,account_code,phone,city,balance,notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET
             code=$2,name=$3,account_code=$4,phone=$5,city=$6,balance=$7,notes=$8`,
          [r.id, r.code||null, r.name||'', r.accountCode||null,
           r.phone||null, r.city||null, r.balance||0, r.notes||null]
        );
      }
    }

    // ── Maintenance ──────────────────────────────────────
    if (d.maint) {
      const ids = d.maint.filter(function(r){return r.id;}).map(function(r){return r.id;});
      if (ids.length) await client.query('DELETE FROM maint_requests WHERE id != ALL($1)', [ids]);
      else await client.query('DELETE FROM maint_requests');
      for (const r of d.maint) {
        if (!r.id) continue;
        await client.query(
          `INSERT INTO maint_requests (id,customer,serial,description,status,req_date,cost,notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET
             customer=$2,serial=$3,description=$4,status=$5,req_date=$6,cost=$7,notes=$8`,
          [r.id, r.customer||null, r.serial||null, r.desc||null,
           r.status||'open', r.date||null, r.cost||0, r.notes||null]
        );
      }
    }

    // ── Payroll ──────────────────────────────────────────
    if (d.payroll) {
      const ids = d.payroll.filter(function(r){return r.id;}).map(function(r){return r.id;});
      if (ids.length) await client.query('DELETE FROM payroll_records WHERE id != ALL($1)', [ids]);
      else await client.query('DELETE FROM payroll_records');
      for (const r of d.payroll) {
        if (!r.id) continue;
        await client.query(
          `INSERT INTO payroll_records (id,pay_month,emp_name,emp_id,salary,additions,deductions,net)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET
             pay_month=$2,emp_name=$3,emp_id=$4,salary=$5,additions=$6,deductions=$7,net=$8`,
          [r.id, r.month||null, r.empName||null, r.empId||null,
           r.salary||0, r.additions||0, r.deductions||0, r.net||0]
        );
      }
    }

    // ── WF Orders ────────────────────────────────────────
    if (d.wfOrders) {
      const ids = d.wfOrders.filter(function(r){return r.id;}).map(function(r){return r.id;});
      if (ids.length) await client.query('DELETE FROM wf_orders WHERE id != ALL($1)', [ids]);
      else await client.query('DELETE FROM wf_orders');
      for (const r of d.wfOrders) {
        if (!r.id) continue;
        await client.query(
          `INSERT INTO wf_orders (id,ord_date,cust_id,cust_name,stage,amount,pay_method,items,notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT (id) DO UPDATE SET
             ord_date=$2,cust_id=$3,cust_name=$4,stage=$5,amount=$6,pay_method=$7,items=$8,notes=$9`,
          [r.id, r.date||null, r.custId||null, r.custName||null,
           r.stage||'sales', r.amount||0, r.payMethod||null,
           JSON.stringify(r.items||[]), r.notes||null]
        );
      }
    }

    // ── Serials ──────────────────────────────────────────
    if (d.serials) {
      const sns = d.serials.filter(function(r){return r.sn;}).map(function(r){return r.sn;});
      if (sns.length) await client.query('DELETE FROM serials WHERE sn != ALL($1)', [sns]);
      else await client.query('DELETE FROM serials');
      for (const r of d.serials) {
        if (!r.sn) continue;
        await client.query(
          `INSERT INTO serials (sn,item_code,item_name,status,date_in,po_ref,date_out,inv_ref,customer,notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           ON CONFLICT (sn) DO UPDATE SET
             item_code=$2,item_name=$3,status=$4,date_in=$5,po_ref=$6,
             date_out=$7,inv_ref=$8,customer=$9,notes=$10`,
          [r.sn, r.itemCode||null, r.itemName||null, r.status||'stock',
           r.dateIn||null, r.poRef||null, r.dateOut||null, r.invRef||null,
           r.customer||null, r.notes||null]
        );
      }
    }

    // ── Users ────────────────────────────────────────────
    if (d.usersDb) {
      const ids = d.usersDb.filter(function(r){return r.id;}).map(function(r){return r.id;});
      if (ids.length) await client.query('DELETE FROM app_users WHERE id != ALL($1)', [ids]);
      for (const r of d.usersDb) {
        if (!r.id) continue;
        await client.query(
          `INSERT INTO app_users (id,username,pass,full_name,role,perms,last_login)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (id) DO UPDATE SET
             username=$2,pass=$3,full_name=$4,role=$5,perms=$6,last_login=$7`,
          [r.id, r.username||'', r.pass||'', r.name||'',
           r.role||'sales', JSON.stringify(r.perms||{}), r.lastLogin||null]
        );
      }
    }

    // ── Permission Modules ───────────────────────────────
    if (d.permMods) {
      const keys = d.permMods.map(function(r){return r.key;});
      if (keys.length) await client.query('DELETE FROM perm_modules WHERE key != ALL($1)', [keys]);
      else await client.query('DELETE FROM perm_modules');
      for (let i = 0; i < d.permMods.length; i++) {
        const r = d.permMods[i];
        await client.query(
          `INSERT INTO perm_modules (key,label,sort_order)
           VALUES ($1,$2,$3)
           ON CONFLICT (key) DO UPDATE SET label=$2, sort_order=$3`,
          [r.key, r.label||'', i]
        );
      }
    }

    // ── Installments ─────────────────────────────────────
    if (d.instDb) {
      const ids = d.instDb.filter(function(r){return r.id;}).map(function(r){return r.id;});
      if (ids.length) await client.query('DELETE FROM installments WHERE id != ALL($1)', [ids]);
      else await client.query('DELETE FROM installments');
      for (const r of d.instDb) {
        if (!r.id) continue;
        await client.query(
          `INSERT INTO installments (id,inst_date,cust_id,cust_name,inv_ref,total_amt,down_payment,num_inst,payments)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT (id) DO UPDATE SET
             inst_date=$2,cust_id=$3,cust_name=$4,inv_ref=$5,
             total_amt=$6,down_payment=$7,num_inst=$8,payments=$9`,
          [r.id, r.date||null, r.custId||null, r.custName||null, r.invRef||null,
           r.totalAmt||0, r.downPayment||0, r.numInst||6, JSON.stringify(r.payments||[])]
        );
      }
    }

    // ── Inventory Items (with cost method) ───────────────
    if (d.invItems) {
      for (const r of d.invItems) {
        if (!r.code) continue;
        await client.query(
          `INSERT INTO items (code,name,cat,unit,price,min_qty,qty,cost,cost_method,track_serial)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           ON CONFLICT (code) DO UPDATE SET
             name=$2,cat=$3,unit=$4,price=$5,min_qty=$6,qty=$7,cost=$8,
             cost_method=EXCLUDED.cost_method,
             track_serial=EXCLUDED.track_serial,
             updated_at=now()`,
          [r.code, r.name||'', r.cat||'', r.unit||'وحدة',
           r.price||0, r.min||0, r.qty||0, r.cost||0,
           r.costMethod||'average', r.trackSerial||false]
        );
      }
    }

    await client.query('COMMIT');
    console.log('[PG] تم حفظ البيانات ✔ | العملاء: ' + sseClients.length);
    return true;
  } catch(e) {
    await client.query('ROLLBACK');
    console.error('[PG] فشل الحفظ:', e.message);
    throw e;
  } finally {
    client.release();
  }
}

// ============================================================
// HTTP SERVER
// ============================================================
var server = http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  var urlParts = req.url.split('?');
  var urlPath  = urlParts[0];
  var query    = urlParts[1] || '';
  var clientId = '';
  query.split('&').forEach(function(p) {
    var kv = p.split('=');
    if (kv[0] === 'client') clientId = decodeURIComponent(kv[1] || '');
  });

  // ── SSE ──────────────────────────────────────────────────
  if (req.method === 'GET' && urlPath === '/api/events') {
    res.writeHead(200, {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache',
      'Connection':        'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    res.write(':connected\n\n');
    var client = { id: Date.now() + '_' + Math.random(), res: res };
    sseClients.push(client);
    console.log('[SSE] موظف اتصل — المتصلون: ' + sseClients.length);
    var hb = setInterval(function() {
      try { res.write(':ping\n\n'); } catch(e) { clearInterval(hb); }
    }, 20000);
    req.on('close', function() {
      clearInterval(hb);
      sseClients = sseClients.filter(function(c) { return c.id !== client.id; });
      console.log('[SSE] موظف انقطع — المتصلون: ' + sseClients.length);
    });
    return;
  }

  // ── GET /api/data ─────────────────────────────────────────
  if (req.method === 'GET' && urlPath === '/api/data') {
    loadAllData().then(function(data) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
    }).catch(function(e) {
      console.error('[API] خطأ في تحميل البيانات:', e.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    });
    return;
  }

  // ── POST /api/data ────────────────────────────────────────
  if (req.method === 'POST' && urlPath === '/api/data') {
    var body = '';
    req.on('data', function(chunk) { body += chunk.toString(); });
    req.on('end', function() {
      var d;
      try { d = JSON.parse(body); } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end('{"ok":false,"error":"Invalid JSON"}');
        return;
      }
      saveAllData(d).then(function() {
        broadcastChange(clientId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      }).catch(function(e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      });
    });
    return;
  }

  // ── GET /api/status ───────────────────────────────────────
  if (req.method === 'GET' && urlPath === '/api/status') {
    pool.query('SELECT COUNT(*) as jc FROM journal_entries').then(function(r) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ok: true, db: 'postgresql', clients: sseClients.length,
        journalEntries: parseInt(r.rows[0].jc), uptime: Math.floor(process.uptime()) + 's'
      }));
    }).catch(function() {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, db: 'postgresql', clients: sseClients.length }));
    });
    return;
  }

  // ── GET /api/items ── تحميل قائمة المواد مع تكاليفها ──────
  if (req.method === 'GET' && urlPath === '/api/items') {
    pool.query('SELECT * FROM items ORDER BY cat, name').then(function(r) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(r.rows.map(mapItem)));
    }).catch(function(e) {
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    });
    return;
  }

  // ── Static Files ──────────────────────────────────────────
  var filePath;
  if (urlPath === '/' || urlPath === '/index.html') {
    filePath = path.join(HTML_DIR, 'raya_odoo.html');
  } else {
    filePath = path.join(HTML_DIR, urlPath.replace(/^\//, ''));
  }
  if (!filePath.startsWith(HTML_DIR)) { res.writeHead(403); res.end('Forbidden'); return; }
  if (fs.existsSync(filePath)) {
    var ext  = path.extname(filePath).toLowerCase();
    var mime = MIME[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', function() {
  var ips = [];
  Object.values(os.networkInterfaces()).forEach(function(iface) {
    iface.forEach(function(addr) {
      if (addr.family === 'IPv4' && !addr.internal) ips.push(addr.address);
    });
  });
  console.log('');
  console.log('========================================');
  console.log('   الراية الزرقاء — PostgreSQL Server');
  console.log('========================================');
  console.log('  localhost  : http://localhost:' + PORT);
  ips.forEach(function(ip) {
    console.log('  للموظفين  : http://' + ip + ':' + PORT + '  <--');
  });
  console.log('  قاعدة البيانات : PostgreSQL raya_db');
  console.log('========================================');
  console.log('');
});

server.on('error', function(e) {
  if (e.code === 'EADDRINUSE') {
    console.error('المنفذ ' + PORT + ' مستخدم — أغلق النافذة القديمة');
  } else {
    console.error('خطأ: ' + e.message);
  }
  process.exit(1);
});
