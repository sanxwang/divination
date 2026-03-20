/**
 * Model Manager - Unified interface for multiple LLM providers
 * Supports: DeepSeek, OpenAI, Xiaomi MiMo
 */

import fetch from 'node-fetch';
import AbortController from 'abort-controller';

export type ModelProvider = 'deepseek' | 'openai' | 'mimo';

interface ModelConfig {
  provider: ModelProvider;
  apiUrl: string;
  apiKey: string;
  model: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  timeout?: number;
}

interface CallParams {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  timeoutMs?: number;
  retries?: number;
  baseDelay?: number;
}

// Get model config from environment variables
function getModelConfig(provider: ModelProvider): ModelConfig {
  switch (provider) {
    case 'deepseek':
      return {
        provider: 'deepseek',
        apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1',
        apiKey: process.env.DEEPSEEK_API_KEY || '',
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        temperature: 0.7,
        max_tokens: 500
      };
    case 'openai':
      return {
        provider: 'openai',
        apiUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 500
      };
    case 'mimo':
      return {
        provider: 'mimo',
        apiUrl: process.env.MIMO_API_URL || 'https://api.xiaomimimo.com/v1',
        apiKey: process.env.MIMO_API_KEY || '',
        model: process.env.MIMO_MODEL || 'mimo-v2-pro',
        temperature: 0.7,
        max_tokens: 500
      };
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Simple in-memory circuit-breaker state per provider
const circuitState: Record<string, { failureCount: number; circuitOpenUntil: number }> = {};

function getCircuitState(provider: ModelProvider) {
  if (!circuitState[provider]) {
    circuitState[provider] = { failureCount: 0, circuitOpenUntil: 0 };
  }
  return circuitState[provider];
}

async function callModelAPI(
  provider: ModelProvider,
  system: string,
  prompt: string,
  params: CallParams = {}
): Promise<string> {
  const config = getModelConfig(provider);
  const circuit = getCircuitState(provider);

  const CIRCUIT_THRESHOLD = 5;
  const CIRCUIT_COOLDOWN_MS = 60_000;

  if (Date.now() < circuit.circuitOpenUntil) {
    throw new Error(`${provider} circuit open - skipping request`);
  }

  // OpenAI-compatible API format (used by DeepSeek, OpenAI, and Xiaomi MiMo)
  const body = {
    model: config.model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt }
    ],
    temperature: params.temperature ?? config.temperature ?? 0.7,
    max_tokens: params.max_tokens ?? config.max_tokens ?? 500,
    top_p: params.top_p ?? config.top_p ?? 0.9
  };

  const maxAttempts = params.retries ?? 3;
  const baseDelay = params.baseDelay ?? 300;
  const timeoutMs = params.timeoutMs ?? config.timeout ?? 20000;

  let lastErr: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const apiEndpoint = `${config.apiUrl}/chat/completions`;
      
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(body),
        signal: controller.signal as any
      });

      clearTimeout(id);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${provider} request failed: ${res.status} ${text}`);
      }

      const json = await res.json();

      // Success -> reset circuit
      circuit.failureCount = 0;
      circuit.circuitOpenUntil = 0;

      // Extract content from OpenAI-compatible response
      if (json.choices && json.choices[0] && json.choices[0].message) {
        return json.choices[0].message.content;
      }

      return JSON.stringify(json);
    } catch (err) {
      clearTimeout(id);
      lastErr = err;
      circuit.failureCount += 1;

      if (circuit.failureCount >= CIRCUIT_THRESHOLD) {
        circuit.circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
      }

      const isLast = attempt === maxAttempts;
      const delay = baseDelay * Math.pow(2, attempt - 1);

      if (isLast) break;
      await sleep(delay);
    }
  }

  throw lastErr;
}

export async function callModel(
  provider: ModelProvider,
  system: string,
  prompt: string,
  params: CallParams = {}
): Promise<string> {
  return callModelAPI(provider, system, prompt, params);
}

export function getAvailableModels(): ModelProvider[] {
  const available: ModelProvider[] = [];
  
  if (process.env.DEEPSEEK_API_KEY) available.push('deepseek');
  if (process.env.OPENAI_API_KEY) available.push('openai');
  if (process.env.MIMO_API_KEY) available.push('mimo');

  return available;
}

export function getDefaultModel(): ModelProvider {
  return (process.env.DEFAULT_MODEL as ModelProvider) || 'deepseek';
}

export function getModelInfo(provider: ModelProvider) {
  const config = getModelConfig(provider);
  return {
    provider: config.provider,
    model: config.model,
    apiUrl: config.apiUrl.replace(/\/$/, '') // Remove trailing slash for display
  };
}
