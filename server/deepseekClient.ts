import fetch from 'node-fetch';
import AbortController from 'abort-controller';

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.example/v1/generate';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

// Simple in-memory circuit-breaker state
let failureCount = 0;
let circuitOpenUntil = 0; // timestamp ms
const CIRCUIT_THRESHOLD = Number(process.env.DEEPSEEK_CB_THRESHOLD || 5);
const CIRCUIT_COOLDOWN_MS = Number(process.env.DEEPSEEK_CB_COOLDOWN_MS || 60_000);

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function callDeepSeek(system: string, prompt: string, params: any = {}) {
  if (Date.now() < circuitOpenUntil) {
    throw new Error('DeepSeek circuit open - skipping request');
  }

  const body: any = {
    model: params.model || 'deepseek-mini',
    system: system,
    prompt: prompt,
    temperature: params.temperature ?? 0.7,
    top_p: params.top_p ?? 0.9
  };

  const maxAttempts = params.retries ?? 3;
  const baseDelay = params.baseDelay ?? 300; // ms
  const timeoutMs = params.timeoutMs ?? Number(process.env.DEEPSEEK_TIMEOUT_MS || 4000);

  let lastErr: any = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DeepSeek-Key': DEEPSEEK_API_KEY
        },
        body: JSON.stringify(body),
        signal: controller.signal as any
      });
      clearTimeout(id);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`DeepSeek request failed: ${res.status} ${text}`);
      }

      const json = await res.json();

      // Success -> reset circuit
      failureCount = 0;
      circuitOpenUntil = 0;

      if (typeof json.reply === 'string') return json.reply;
      if (json.output) return typeof json.output === 'string' ? json.output : JSON.stringify(json.output);
      return JSON.stringify(json);
    } catch (err) {
      clearTimeout(id);
      lastErr = err;
      failureCount += 1;
      if (failureCount >= CIRCUIT_THRESHOLD) {
        circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
      }
      const isLast = attempt === maxAttempts;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      if (isLast) break;
      await sleep(delay);
    }
  }
  throw lastErr;
}
