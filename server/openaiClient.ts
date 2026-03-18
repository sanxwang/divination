import fetch from 'node-fetch';

const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export async function callChatModel(system: string, userPrompt: string, params: any = {}) {
  const body = {
    model: params.model || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userPrompt }
    ],
    temperature: params.temperature ?? 0.7,
    max_tokens: params.max_tokens ?? 300,
    top_p: params.top_p ?? 0.9,
    frequency_penalty: params.frequency_penalty ?? 0.4
  };

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM request failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  const reply = json.choices && json.choices[0] && json.choices[0].message ? json.choices[0].message.content : null;
  return reply;
}
