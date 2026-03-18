const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { Pool } = require('pg');

// Load .env manually
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value;
      }
    }
  });
}

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-DeepSeek-Key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.PG_CONNECTION || '' });

function loadPrompt(name) {
  const p = path.join(__dirname, 'prompts', `${name}.json`);
  if (!fs.existsSync(p)) throw new Error(`prompt not found: ${name}`);
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

async function callDeepSeek(system, prompt, params = {}) {
  // Support both mock API format and real Deepseek API format
  const isRealAPI = DEEPSEEK_API_URL.includes('api.deepseek.com');
  
  if (isRealAPI) {
    // Real Deepseek API uses OpenAI-compatible format
    const body = {
      model: params.model || 'deepseek-chat',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt }
      ],
      temperature: params.temperature || 0.7,
      top_p: params.top_p || 0.9,
      max_tokens: params.max_tokens || 500
    };
    const res = await fetch(DEEPSEEK_API_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(body),
      timeout: params.timeoutMs || 20000
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`DeepSeek error ${res.status}: ${txt}`);
    }
    const j = await res.json();
    if (j.choices && j.choices[0] && j.choices[0].message) {
      return j.choices[0].message.content;
    }
    return JSON.stringify(j);
  } else {
    // Mock API format
    const body = {
      model: params.model || 'deepseek-mini',
      system,
      prompt,
      temperature: params.temperature || 0.7,
      top_p: params.top_p || 0.9
    };
    const res = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-DeepSeek-Key': DEEPSEEK_API_KEY
      },
      body: JSON.stringify(body),
      timeout: params.timeoutMs || 8000
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`DeepSeek error ${res.status}: ${txt}`);
    }
    const j = await res.json();
    if (typeof j.reply === 'string') return j.reply;
    if (j.output) return typeof j.output === 'string' ? j.output : JSON.stringify(j.output);
    return JSON.stringify(j);
  }
}

const promptsDir = path.join(__dirname, 'prompts');
function composeSystem(personaSys, promptSys) { return `${personaSys}\n\n${promptSys}`; }
let persona = { system_prompt: '' };
try { persona = loadPrompt('persona'); } catch (e) { console.warn('persona prompt missing'); }

// simple auth for proxy
const EXPECTED_KEY = process.env.PROMPT_PROXY_KEY || process.env.DEEPSEEK_API_KEY || '';
function checkKey(req, res, next) {
  const key = req.header('x-deepseek-key') || req.header('X-DeepSeek-Key');
  if (!EXPECTED_KEY) return next();
  if (!key || key !== EXPECTED_KEY) return res.status(401).json({ ok: false, error: 'invalid key' });
  return next();
}

// 玄学条件库 - 生成真实的客观条件
function generateRealMysticContext() {
  // 真实的月相数据
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  
  // 计算月相（简化农历月相）
  const moonPhases = [
    { name: '新月', emoji: '🌑', desc: '能量复苏，万物初生' },
    { name: '盈凸月', emoji: '🌒', desc: '能量上升，潜力激发' },
    { name: '上弦月', emoji: '🌓', desc: '能量建立，挑战期' },
    { name: '盈凸月', emoji: '🌔', desc: '能量积聚，接近圆满' },
    { name: '满月', emoji: '🌕', desc: '能量巅峰，情绪高涨' },
    { name: '亏凸月', emoji: '🌖', desc: '能量释放，实现期' },
    { name: '下弦月', emoji: '🌗', desc: '能量衰落，反思期' },
    { name: '亏凸月', emoji: '🌘', desc: '能量沉寂，修复期' }
  ];
  
  // 根据日期计算大约的月相（简化版）
  const moonIndex = Math.floor((day % 29.5) / 3.68);
  const moonPhase = moonPhases[Math.max(0, Math.min(7, moonIndex))];
  
  // 时间段对应的能量描述
  const timePhases = [
    { time: '0-4', name: '深夜寂静', emoji: '🌙', desc: '能量最低，思维清晰' },
    { time: '5-8', name: '晨曦初泽', emoji: '🌅', desc: '能量苏醒，精力恢复' },
    { time: '9-12', name: '上午活跃', emoji: '🌤️', desc: '能量上升，效率高峰' },
    { time: '13-17', name: '午后温暖', emoji: '☀️', desc: '能量稳定，执行力强' },
    { time: '18-21', name: '傍晚沉静', emoji: '🌆', desc: '能量转换，思考期' },
    { time: '22-23', name: '夜幕降临', emoji: '🌃', desc: '能量内敛，休息前奏' }
  ];
  const timePhase = timePhases[Math.floor(hour / 4)];
  
  // 季节特征
  const seasons = [
    { name: '冬季滋养', emoji: '❄️', desc: '以温暖治疗，储备能量' },
    { name: '冬季滋养', emoji: '❄️', desc: '以温暖治疗，储备能量' },
    { name: '春季生长', emoji: '🌱', desc: '新陈代谢快，需要清新' },
    { name: '春季生长', emoji: '🌱', desc: '新陈代谢快，需要清新' },
    { name: '春季生长', emoji: '🌱', desc: '新陈代谢快，需要清新' },
    { name: '夏季热烈', emoji: '🔥', desc: '火象旺盛，需要清凉解暑' },
    { name: '夏季热烈', emoji: '🔥', desc: '火象旺盛，需要清凉解暑' },
    { name: '夏季热烈', emoji: '🔥', desc: '火象旺盛，需要清凉解暑' },
    { name: '秋季收敛', emoji: '🍂', desc: '燥气入体，需要滋润' },
    { name: '秋季收敛', emoji: '🍂', desc: '燥气入体，需要滋润' },
    { name: '秋季收敛', emoji: '🍂', desc: '燥气入体，需要滋润' },
    { name: '冬季滋养', emoji: '❄️', desc: '以温暖治疗，储备能量' }
  ];
  const season = seasons[month - 1];
  
  // 五行对应的日期周期
  const fiveElements = ['木', '火', '土', '金', '水'];
  const element = fiveElements[day % 5];
  
  const elementDesc = {
    '木': { emoji: '🌳', desc: '生长与发展期，宜选生津的茶' },
    '火': { emoji: '🔥', desc: '热力与活力期，宜选清凉的茶' },
    '土': { emoji: '🌍', desc: '稳定与厚重期，宜选温和的茶' },
    '金': { emoji: '⚪', desc: '收敛与精进期，宜选清纯的茶' },
    '水': { emoji: '💧', desc: '流动与智慧期，宜选滋补的茶' }
  };
  
  return {
    date: `${month}月${day}日`,
    moonPhase,
    timePhase,
    season,
    element: {
      ...elementDesc[element],
      name: element + '象'
    },
    // 额外的客观条件组合
    dayOfWeek: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][now.getDay()],
    weekNumber: Math.ceil((day + new Date(year, 0, 1).getDay()) / 7),
    chineseZodiacIntro: '根据农历推算的宇宙能量'
  };
}

app.get('/api/divination-context', (req, res) => {
  try {
    const context = generateRealMysticContext();
    res.json({
      ok: true,
      context
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post('/api/prompt/:name', checkKey, async (req, res) => {
  try {
    const name = req.params.name;
    const promptMeta = loadPrompt(name);
    const system = composeSystem(persona.system_prompt, promptMeta.system_prompt);
    const userPrompt = JSON.stringify(req.body || {});
    const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params || {});
    try {
      // Clean markdown code blocks if present
      let cleanedReply = reply.trim();
      if (cleanedReply.startsWith('```')) {
        // Remove markdown code block markers
        cleanedReply = cleanedReply.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }
      const parsed = JSON.parse(cleanedReply || '{}');
      // best-effort persist
      try { await pool.query('INSERT INTO prompt_logs(user_id, session_id, prompt_name, user_payload, llm_response, valid) VALUES($1,$2,$3,$4,$5,$6)', [req.body.userId||null, req.body.sessionId||null, name, req.body||{}, parsed||{}, true]); } catch (e) { console.warn('log failed', e.message); }
      return res.json({ ok: true, parsed });
    } catch (e) { return res.json({ ok: true, raw: reply }); }
  } catch (err) { console.error(err); return res.status(500).json({ ok: false, error: String(err) }); }
});

app.get('/products', async (req, res) => {
  try {
    const tag = req.query.tag;
    if (tag) {
      const r = await pool.query('SELECT * FROM products WHERE available = TRUE AND tags @> $1::text[]', [[tag]]);
      return res.json(r.rows);
    }
    const r = await pool.query('SELECT * FROM products WHERE available = TRUE ORDER BY updated_at DESC LIMIT 200');
    return res.json(r.rows);
  } catch (e) { console.error(e); return res.status(500).json({ ok: false, error: String(e) }); }
});

app.post('/session/start', async (req, res) => {
  try {
    const initial_scene = req.body && req.body.initial_scene ? req.body.initial_scene : 'home';
    const session_key = require('crypto').randomUUID();
    const r = await pool.query('INSERT INTO sessions(session_key, users, relation, scene, state) VALUES($1,$2,$3,$4,$5) RETURNING id, session_key', [session_key, [], 'single', initial_scene, {}]);
    return res.status(201).json({ session_key: r.rows[0].session_key, session_id: r.rows[0].id });
  } catch (e) { console.error(e); return res.status(500).json({ ok: false, error: String(e) }); }
});

app.post('/orders', async (req, res) => {
  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : null;
  if (!items || items.length === 0) return res.status(400).json({ ok: false, error: 'require items' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const ids = items.map(it => it.id);
    const r = await client.query('SELECT id, price_cents, available FROM products WHERE id = ANY($1)', [ids]);
    const priceMap = {};
    for (const row of r.rows) priceMap[row.id] = row;
    let total = 0; const normalized = [];
    for (const it of items) {
      const pid = it.id; const qty = Number(it.quantity || 1);
      const prod = priceMap[pid];
      if (!prod) { await client.query('ROLLBACK'); return res.status(400).json({ ok: false, error: `product not found: ${pid}` }); }
      if (!prod.available) { await client.query('ROLLBACK'); return res.status(400).json({ ok: false, error: `not available: ${pid}` }); }
      const line = (prod.price_cents || 0) * qty; total += line; normalized.push({ id: pid, quantity: qty, unit_price_cents: prod.price_cents, line_price_cents: line });
    }
    const insert = await client.query('INSERT INTO orders(user_id, total_cents, items, paid) VALUES($1,$2,$3,$4) RETURNING id, created_at', [body.userId||null, total, normalized, false]);
    await client.query('COMMIT');
    return res.status(201).json({ ok: true, order_id: insert.rows[0].id, total_cents: total, created_at: insert.rows[0].created_at });
  } catch (e) { try { await client.query('ROLLBACK'); } catch(_){} console.error(e); return res.status(500).json({ ok: false, error: String(e) }); } finally { client.release(); }
});

app.post('/orders/:id/pay', async (req, res) => {
  const orderId = req.params.id; const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const r = await client.query('SELECT id, paid FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
    if (r.rowCount === 0) { await client.query('ROLLBACK'); return res.status(404).json({ ok: false, error: 'order not found' }); }
    if (r.rows[0].paid) { await client.query('ROLLBACK'); return res.status(400).json({ ok: false, error: 'already paid' }); }
    await client.query('UPDATE orders SET paid = TRUE WHERE id = $1', [orderId]);
    await client.query('COMMIT');
    return res.json({ ok: true, order_id: orderId, paid: true });
  } catch (e) { try { await client.query('ROLLBACK'); } catch(_){} console.error(e); return res.status(500).json({ ok: false, error: String(e) }); } finally { client.release(); }
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => console.log(`Server listening http://localhost:${port}`));
