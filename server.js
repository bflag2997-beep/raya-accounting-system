'use strict';
// =====================================================
//  نظام الراية الزرقاء — السيرفر المحلي
//  يحفظ الداتا على هارد D: ويوزعها على الموظفين
// =====================================================
const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ===== اعدادات — غير DATA_DIR فقط لو تريد مسار آخر =====
const PORT      = 3333;
const DATA_DIR  = 'D:\\raya_data';
const DATA_FILE = path.join(DATA_DIR, 'raya_data.json');
const BAK_FILE  = path.join(DATA_DIR, 'raya_data.bak.json');
const HTML_DIR  = __dirname;
// =========================================================

// تأكد من وجود مجلد الداتا
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('تم إنشاء مجلد الداتا: ' + DATA_DIR);
}

// ===== MIME types =====
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.ico':  'image/x-icon'
};

// ===== SERVER =====
const server = http.createServer(function(req, res) {
  // CORS — للسماح بالوصول من أي جهاز على الشبكة
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  var url = req.url.split('?')[0];

  // ===== API: تحميل الداتا =====
  if (req.method === 'GET' && url === '/api/data') {
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

  // ===== API: حفظ الداتا =====
  if (req.method === 'POST' && url === '/api/data') {
    var body = '';
    req.on('data', function(chunk) { body += chunk.toString(); });
    req.on('end', function() {
      try {
        JSON.parse(body); // تحقق من صحة JSON
        // نسخة احتياطية تلقائية قبل الحفظ
        if (fs.existsSync(DATA_FILE)) {
          fs.copyFileSync(DATA_FILE, BAK_FILE);
        }
        fs.writeFileSync(DATA_FILE, body, 'utf8');
        var now = new Date().toLocaleString('en-US');
        console.log('[' + now + '] تم حفظ الداتا (' + (body.length / 1024).toFixed(1) + ' KB)');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end('{"ok":false,"error":"Invalid JSON"}');
      }
    });
    return;
  }

  // ===== API: معلومات السيرفر =====
  if (req.method === 'GET' && url === '/api/status') {
    var size = fs.existsSync(DATA_FILE) ? fs.statSync(DATA_FILE).size : 0;
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      ok: true,
      dataFile: DATA_FILE,
      dataSize: size,
      uptime: Math.floor(process.uptime()) + 's',
      ts: Date.now()
    }));
    return;
  }

  // ===== Static files — تقديم ملفات البرنامج =====
  var filePath;
  if (url === '/' || url === '/index.html') {
    filePath = path.join(HTML_DIR, 'raya_odoo.html');
  } else {
    filePath = path.join(HTML_DIR, url.replace(/^\//, ''));
  }

  // منع الوصول خارج المجلد
  if (!filePath.startsWith(HTML_DIR)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  if (fs.existsSync(filePath)) {
    var ext  = path.extname(filePath).toLowerCase();
    var mime = MIME[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404); res.end('Not found: ' + url);
  }
});

// ===== تشغيل السيرفر =====
server.listen(PORT, '0.0.0.0', function() {
  var ips = [];
  Object.values(os.networkInterfaces()).forEach(function(iface) {
    iface.forEach(function(addr) {
      if (addr.family === 'IPv4' && !addr.internal) ips.push(addr.address);
    });
  });

  console.log('');
  console.log('========================================');
  console.log('   نظام الراية الزرقاء — السيرفر');
  console.log('========================================');
  console.log('  الرابط المحلي  : http://localhost:' + PORT);
  ips.forEach(function(ip) {
    console.log('  رابط الشبكة   : http://' + ip + ':' + PORT + '  <-- أرسل هذا للموظفين');
  });
  console.log('----------------------------------------');
  console.log('  مجلد الداتا   : ' + DATA_DIR);
  console.log('  ملف الداتا    : ' + DATA_FILE);
  console.log('========================================');
  console.log('  السيرفر يعمل... اضغط Ctrl+C للإيقاف');
  console.log('');
});

server.on('error', function(e) {
  if (e.code === 'EADDRINUSE') {
    console.error('خطأ: المنفذ ' + PORT + ' مستخدم من برنامج آخر');
    console.error('أوقف البرنامج الآخر أو غير PORT في server.js');
  } else {
    console.error('خطأ في السيرفر:', e.message);
  }
  process.exit(1);
});
