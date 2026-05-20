'use strict';
// =====================================================
//  نظام الراية الزرقاء — السيرفر المحلي
//  Real-Time Sync عبر SSE (Server-Sent Events)
//  الداتا على D:\raya_data — تُرسل لكل الموظفين فوراً
// =====================================================
const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ===== إعدادات =====
const PORT      = 3333;
const DATA_DIR  = 'D:\\raya_data';
const DATA_FILE = path.join(DATA_DIR, 'raya_data.json');
const BAK_FILE  = path.join(DATA_DIR, 'raya_data.bak.json');
const HTML_DIR  = __dirname;
// ===================

// تأكد من وجود مجلد الداتا
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('تم إنشاء مجلد الداتا: ' + DATA_DIR);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico':  'image/x-icon'
};

// ===== قائمة عملاء SSE المتصلين =====
var sseClients = [];

function broadcastChange(fromClientId) {
  var dead = [];
  sseClients.forEach(function(c) {
    try {
      c.res.write('event: datachanged\ndata: ' + (fromClientId || '') + '\n\n');
    } catch(e) {
      dead.push(c.id);
    }
  });
  // نظّف العملاء المنقطعين
  if (dead.length) {
    sseClients = sseClients.filter(function(c) { return dead.indexOf(c.id) < 0; });
  }
}

// ===== SERVER =====
var server = http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // استخرج URL والـ query string
  var urlParts = req.url.split('?');
  var urlPath  = urlParts[0];
  var query    = urlParts[1] || '';
  var clientId = '';
  query.split('&').forEach(function(p) {
    var kv = p.split('=');
    if (kv[0] === 'client') clientId = decodeURIComponent(kv[1] || '');
  });

  // ===== SSE: اشتراك العميل =====
  if (req.method === 'GET' && urlPath === '/api/events') {
    res.writeHead(200, {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    // إرسال أول رسالة للتأكيد
    res.write(':connected\n\n');

    var client = { id: Date.now() + '_' + Math.random(), res: res };
    sseClients.push(client);
    console.log('[SSE] موظف اتصل — المتصلون: ' + sseClients.length);

    // Heartbeat كل 20 ثانية (يمنع انقطاع الاتصال)
    var hb = setInterval(function() {
      try { res.write(':ping\n\n'); }
      catch(e) { clearInterval(hb); }
    }, 20000);

    req.on('close', function() {
      clearInterval(hb);
      sseClients = sseClients.filter(function(c) { return c.id !== client.id; });
      console.log('[SSE] موظف انقطع — المتصلون: ' + sseClients.length);
    });
    return;
  }

  // ===== API: تحميل الداتا =====
  if (req.method === 'GET' && urlPath === '/api/data') {
    if (fs.existsSync(DATA_FILE)) {
      var data = fs.readFileSync(DATA_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('null');
    }
    return;
  }

  // ===== API: حفظ الداتا + بث التغيير =====
  if (req.method === 'POST' && urlPath === '/api/data') {
    var body = '';
    req.on('data', function(chunk) { body += chunk.toString(); });
    req.on('end', function() {
      try {
        JSON.parse(body); // تحقق من صحة JSON
        if (fs.existsSync(DATA_FILE)) fs.copyFileSync(DATA_FILE, BAK_FILE);
        fs.writeFileSync(DATA_FILE, body, 'utf8');
        var now  = new Date().toLocaleString('en-US');
        var size = (body.length / 1024).toFixed(1);
        console.log('[' + now + '] حُفظت الداتا (' + size + ' KB) | العملاء: ' + sseClients.length + ' | من: ' + (clientId || 'unknown'));

        // أرسل للجميع فوراً (ما عدا المرسِل نفسه — يتعامل معه المتصفح)
        broadcastChange(clientId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end('{"ok":false}');
      }
    });
    return;
  }

  // ===== API: حالة السيرفر =====
  if (req.method === 'GET' && urlPath === '/api/status') {
    var sz = fs.existsSync(DATA_FILE) ? fs.statSync(DATA_FILE).size : 0;
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, clients: sseClients.length, dataSize: sz, uptime: Math.floor(process.uptime()) + 's' }));
    return;
  }

  // ===== Static Files =====
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
  console.log('   الراية الزرقاء — Real-Time Server');
  console.log('========================================');
  console.log('  localhost     : http://localhost:' + PORT);
  ips.forEach(function(ip) {
    console.log('  للموظفين     : http://' + ip + ':' + PORT + '  <--');
  });
  console.log('  الداتا       : ' + DATA_FILE);
  console.log('========================================');
  console.log('');
});

server.on('error', function(e) {
  if (e.code === 'EADDRINUSE') {
    console.error('المنفذ ' + PORT + ' مستخدم — أغلق النافذة القديمة أو غير PORT');
  } else {
    console.error('خطأ: ' + e.message);
  }
  process.exit(1);
});
