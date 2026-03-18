import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { callDeepSeek } from './deepseekClient';
import { info, warn, error } from './logger';
import { query, getClient } from './db';
import crypto from 'crypto';

const app = express();
app.use(bodyParser.json());

const promptsDir = path.join(__dirname, 'prompts');

function loadPrompt(name: string) {
  const p = path.join(promptsDir, `${name}.json`);
  if (!fs.existsSync(p)) throw new Error(`prompt not found: ${name}`);
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function composeSystem(personaSys: string, promptSys: string) {
  return `${personaSys}\n\n${promptSys}`;
}

const persona = loadPrompt('persona');

// Fail-fast in production: require DEEPSEEK_API_KEY and PROMPT_PROXY_KEY
if (process.env.NODE_ENV === 'production') {
  const missing: string[] = [];
  if (!process.env.DEEPSEEK_API_KEY) missing.push('DEEPSEEK_API_KEY');
  if (!process.env.PROMPT_PROXY_KEY) missing.push('PROMPT_PROXY_KEY');
  if (missing.length > 0) {
    error('Missing required env in production:', missing.join(', '));
    process.exit(1);
  }
}

// Authentication middleware for prompt proxy
const EXPECTED_KEY = process.env.PROMPT_PROXY_KEY || process.env.DEEPSEEK_API_KEY || '';
function checkDeepSeekKey(req: any, res: any, next: any) {
  const key = req.header('x-deepseek-key') || req.header('X-DeepSeek-Key');
  if (!EXPECTED_KEY) {
    warn('No PROMPT_PROXY_KEY or DEEPSEEK_API_KEY set; skipping proxy auth');
    return next();
  }
  if (!key || key !== EXPECTED_KEY) {
    return res.status(401).json({ ok: false, error: 'invalid or missing X-DeepSeek-Key' });
  }
  return next();
}

// Generic prompt proxy: POST /api/prompt/:name -> loads prompt by name, composes system, calls DeepSeek
app.post('/api/prompt/:name', checkDeepSeekKey, async (req, res) => {
  try {
    const name = req.params.name;
    const promptMeta = loadPrompt(name);
    const system = composeSystem(persona.system_prompt, promptMeta.system_prompt);
    const userPrompt = JSON.stringify(req.body || {});
    const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params);
    try {
      const parsed = JSON.parse(reply || '{}');
      // validate against schema if available
      const { validate } = require('./validation');
      const v = validate(name, parsed);
      if (!v.valid) {
        return res.status(502).json({ ok: false, error: 'LLM output did not match schema', details: v.errors, raw: parsed });
      }
      // persist prompt log (non-blocking)
      try {
        const userId = req.body && req.body.userId ? req.body.userId : null;
        const sessionId = req.body && req.body.sessionId ? req.body.sessionId : null;
        await query(
          'INSERT INTO prompt_logs(user_id, session_id, prompt_name, user_payload, llm_response, valid) VALUES($1,$2,$3,$4,$5,$6)',
          [userId, sessionId, name, req.body || {}, parsed || {}, true]
        );
      } catch (logErr) {
        warn('Failed to insert prompt_log:', logErr);
      }
      return res.json({ ok: true, parsed });
    } catch (e) {
      return res.json({ ok: true, raw: reply });
    }
  } catch (err: any) {
    error(err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

// Business route: /api/divination - validate basic payload and call prompt
app.post('/api/divination', checkDeepSeekKey, async (req, res) => {
  const body = req.body || {};
  if (!body.userId || !Array.isArray(body.candidateIds) || body.candidateIds.length === 0) {
    return res.status(400).json({ ok: false, error: 'require userId and candidateIds[]' });
  }

  try {
    const promptMeta = loadPrompt('divination');
    const system = composeSystem(persona.system_prompt, promptMeta.system_prompt);
    const userPrompt = JSON.stringify(body);
    const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params);
    try {
      const parsed = JSON.parse(reply || '{}');
      const { validate } = require('./validation');
      const v = validate('divination', parsed);
      if (!v.valid) {
        return res.status(502).json({ ok: false, error: 'LLM output did not match divination schema', details: v.errors, raw: parsed });
      }
      // persist prompt log
      try {
        const userId = body.userId || null;
        const sessionId = body.sessionId || null;
        await query(
          'INSERT INTO prompt_logs(user_id, session_id, prompt_name, user_payload, llm_response, valid) VALUES($1,$2,$3,$4,$5,$6)',
          [userId, sessionId, 'divination', body || {}, parsed || {}, true]
        );
      } catch (logErr) {
        warn('Failed to insert prompt_log:', logErr);
      }
      return res.json({ ok: true, result: parsed });
    } catch (e) {
      return res.json({ ok: true, raw: reply });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => info(`Prompt proxy server listening on http://localhost:${port}`));

// Products endpoint (simple)
app.get('/products', async (req, res) => {
  try {
    const tag = req.query.tag as string | undefined;
    if (tag) {
      const r = await query('SELECT * FROM products WHERE available = TRUE AND tags @> $1::text[]', [[tag]]);
      return res.json(r.rows);
    } else {
      const r = await query('SELECT * FROM products WHERE available = TRUE ORDER BY updated_at DESC LIMIT 200');
      return res.json(r.rows);
    }
  } catch (err: any) {
    error(err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

// Start session
app.post('/session/start', async (req, res) => {
  try {
    const initial_scene = req.body && req.body.initial_scene ? req.body.initial_scene : 'home';
    const session_key = (crypto as any).randomUUID();
    const r = await query(
      'INSERT INTO sessions(session_key, users, relation, scene, state) VALUES($1,$2,$3,$4,$5) RETURNING id, session_key',
      [session_key, [], 'single', initial_scene, {}]
    );
    return res.status(201).json({ session_key: r.rows[0].session_key, session_id: r.rows[0].id });
  } catch (err: any) {
    error(err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

// Create order: expects { userId?, sessionId?, items: [{ id: string, quantity: number }] }
app.post('/orders', async (req, res) => {
  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : null;
  if (!items || items.length === 0) {
    return res.status(400).json({ ok: false, error: 'require items array with at least one item' });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');
    // load product prices
    const ids = items.map((it: any) => it.id);
    const r = await client.query('SELECT id, price_cents, available FROM products WHERE id = ANY($1)', [ids]);
    const priceMap: Record<string, any> = {};
    for (const row of r.rows) priceMap[row.id] = row;

    let total = 0;
    const normalizedItems: any[] = [];
    for (const it of items) {
      const pid = it.id;
      const qty = Number(it.quantity || 1);
      const prod = priceMap[pid];
      if (!prod) {
        await client.query('ROLLBACK');
        return res.status(400).json({ ok: false, error: `product not found: ${pid}` });
      }
      if (!prod.available) {
        await client.query('ROLLBACK');
        return res.status(400).json({ ok: false, error: `product not available: ${pid}` });
      }
      const line = (prod.price_cents || 0) * qty;
      total += line;
      normalizedItems.push({ id: pid, quantity: qty, unit_price_cents: prod.price_cents, line_price_cents: line });
    }

    const insert = await client.query(
      'INSERT INTO orders(user_id, total_cents, items, paid) VALUES($1,$2,$3,$4) RETURNING id, created_at',
      [body.userId || null, total, normalizedItems, false]
    );
    await client.query('COMMIT');
    return res.status(201).json({ ok: true, order_id: insert.rows[0].id, total_cents: total, created_at: insert.rows[0].created_at });
  } catch (err: any) {
    try {
      await client.query('ROLLBACK');
    } catch (e) {
      warn('rollback failed', e);
    }
    error(err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  } finally {
    client.release();
  }
});

// Mark order as paid (simple stub) POST /orders/:id/pay
app.post('/orders/:id/pay', async (req, res) => {
  const orderId = req.params.id;
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const r = await client.query('SELECT id, paid FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
    if (r.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ ok: false, error: 'order not found' });
    }
    const order = r.rows[0];
    if (order.paid) {
      await client.query('ROLLBACK');
      return res.status(400).json({ ok: false, error: 'order already paid' });
    }
    // In a real integration we'd call a payment provider here.
    await client.query('UPDATE orders SET paid = TRUE WHERE id = $1', [orderId]);
    await client.query('COMMIT');
    return res.json({ ok: true, order_id: orderId, paid: true });
  } catch (err: any) {
    try { await client.query('ROLLBACK'); } catch (e) { warn('rollback failed', e); }
    error(err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  } finally {
    client.release();
  }
});
