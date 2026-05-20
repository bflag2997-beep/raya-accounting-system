// v25b patch: fix renderInvItems + table header
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
// Fix renderInvItems - replace full row return
// ================================================================
rep(
  "    return'<tr style=\"'+(it.qty===0?'background:#fff1f2':it.qty<it.min?'background:#fffbeb':'')+'\">'+" + "\n" +
  "    '<td class=\"code-cell\">'+it.code+'</td><td style=\"font-weight:700\">'+it.name+'</td>'+" + "\n" +
  "    '<td><span class=\"badge badge-gray\">'+it.cat+'</span></td>'+" + "\n" +
  "    '<td style=\"text-align:center;font-weight:800\">'+it.qty+'</td>'+" + "\n" +
  "    '<td style=\"text-align:center\">'+it.min+'</td><td>'+it.unit+'</td>'+" + "\n" +
  "    '<td style=\"text-align:center;font-family:monospace\">'+fmt(it.cost)+'</td>'+" + "\n" +
  "    '<td style=\"text-align:center;font-family:monospace;color:var(--odoo-green)\">'+fmt(it.price)+'</td>'+" + "\n" +
  "    '<td><span class=\"badge '+st+'\">'+it.qty+'</span></td>'+" + "\n" +
  "    '<td><button class=\"btn btn-secondary btn-xs\" onclick=\"selectTrackItem(\\''+it.code+'\\')\">🔄</button></td></tr>';",

  [
    "    var cmLabel = it.costMethod==='fifo'?'FIFO':it.costMethod==='batch'?'دفعة':'وسطي';",
    "    var cmBg    = it.costMethod==='fifo'?'#dbeafe':it.costMethod==='batch'?'#fef3c7':'#e8f5f6';",
    "    var cmColor = it.costMethod==='fifo'?'#1d4ed8':it.costMethod==='batch'?'#92400e':'var(--odoo-blue)';",
    "    var serialBtn = it.trackSerial",
    "      ? '<button class=\"btn btn-primary btn-xs\" onclick=\"openSerialOps(\\''+it.code+'\\',\\''+it.name.replace(/\\x27/g,'')+'\\')\">سيريل</button>'",
    "      : '<button class=\"btn btn-secondary btn-xs\" onclick=\"selectTrackItem(\\''+it.code+'\\')\">🔄</button>';",
    "    return '<tr style=\"'+(it.qty===0?'background:#fff1f2':it.qty<it.min?'background:#fffbeb':'')+'\">'+",
    "    '<td class=\"code-cell\">'+it.code+'</td><td style=\"font-weight:700\">'+it.name+'</td>'+",
    "    '<td><span class=\"badge badge-gray\">'+it.cat+'</span></td>'+",
    "    '<td style=\"text-align:center;font-weight:800\">'+it.qty+'</td>'+",
    "    '<td style=\"text-align:center\">'+it.min+'</td><td>'+it.unit+'</td>'+",
    "    '<td style=\"text-align:center;font-family:monospace\">'+fmt(it.cost)+'</td>'+",
    "    '<td style=\"text-align:center;font-family:monospace;color:var(--odoo-green)\">'+fmt(it.price)+'</td>'+",
    "    '<td><span class=\"badge '+st+'\">'+it.qty+'</span></td>'+",
    "    '<td style=\"text-align:center\"><span style=\"font-size:10px;padding:2px 8px;border-radius:4px;font-weight:600;background:'+cmBg+';color:'+cmColor+'\">'+cmLabel+'</span></td>'+",
    "    '<td>'+serialBtn+'</td></tr>';"
  ].join('\n'),
  'renderInvItems with cost badge + serial btn'
);

// ================================================================
// Fix table header - add التكلفة column
// ================================================================
rep(
  '<th>الحالة</th>\n          <th>إجراء</th>',
  '<th>الحالة</th>\n          <th style="text-align:center">طريقة التكلفة</th>\n          <th>إجراء</th>',
  'Table header - add cost method column'
);

if (ok) {
  fs.writeFileSync('raya_odoo.html', html, 'utf8');
  console.log('\nv25b patch applied!');
} else {
  console.error('\nPATCH FAILED');
  process.exit(1);
}
