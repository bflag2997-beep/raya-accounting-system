// TestSprite MCP runner via stdio JSON-RPC
const { spawn } = require('child_process');

const API_KEY = 'sk-user-YR2-SPShU7q5yPtxBsYWk2AbcxtNtZ8Vo__24H6_Viku9r6trxxbl-EtzFCOXrrDUrYep9FWe6Yh1dx9T_NKVaRHiFP2hkOW-OWFYmCJ7z7w-iZZ94xskOju6LorUWaPycs';
const APP_URL = 'http://localhost:3333/raya_odoo.html';

const proc = spawn('npx', ['@testsprite/testsprite-mcp@latest', 'server'], {
  env: { ...process.env, API_KEY },
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

let buffer = '';
let msgId = 1;

function send(msg) {
  proc.stdin.write(JSON.stringify(msg) + '\n');
}

proc.stdout.on('data', (chunk) => {
  buffer += chunk.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop(); // keep incomplete last line
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const msg = JSON.parse(trimmed);
      handleMsg(msg);
    } catch(e) {
      console.log('stdout raw:', trimmed);
    }
  }
});

proc.stderr.on('data', d => process.stderr.write(d));

let initialized = false;
let toolsList = [];

function handleMsg(msg) {
  if (msg.id === 1 && msg.result) {
    // initialize response
    initialized = true;
    console.log('✅ MCP Server initialized:', msg.result.serverInfo?.name || 'TestSprite');
    // List tools
    send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
  } else if (msg.id === 2 && msg.result) {
    toolsList = msg.result.tools || [];
    console.log('\n📋 Available tools:');
    toolsList.forEach(t => console.log(`  - ${t.name}: ${t.description}`));
    // Run test
    runTest();
  } else if (msg.id >= 10) {
    console.log('\n🧪 Test result:');
    if (msg.result) console.log(JSON.stringify(msg.result, null, 2));
    if (msg.error) console.log('Error:', JSON.stringify(msg.error, null, 2));
    proc.kill();
    process.exit(0);
  }
}

function runTest() {
  const testTool = toolsList.find(t =>
    t.name.toLowerCase().includes('test') ||
    t.name.toLowerCase().includes('generate') ||
    t.name.toLowerCase().includes('run')
  );
  if (!testTool) {
    console.log('\nNo test tool found. Available:', toolsList.map(t=>t.name).join(', '));
    proc.kill();
    return;
  }
  console.log(`\n🚀 Running: ${testTool.name} on ${APP_URL}`);
  send({
    jsonrpc: '2.0',
    id: 10,
    method: 'tools/call',
    params: {
      name: testTool.name,
      arguments: { url: APP_URL, appUrl: APP_URL, targetUrl: APP_URL }
    }
  });
}

// Wait for server to be ready, then initialize
setTimeout(() => {
  send({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: { roots: { listChanged: true }, sampling: {} },
      clientInfo: { name: 'raya-test-runner', version: '1.0.0' }
    }
  });
}, 2000);

setTimeout(() => {
  console.log('Timeout waiting for response');
  proc.kill();
  process.exit(1);
}, 30000);
