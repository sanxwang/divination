import fs from 'fs';
import path from 'path';
import { callDeepSeek } from './deepseekClient';

const promptsDir = path.join(__dirname, 'prompts');

function loadPromptJSON(name: string) {
  const p = path.join(promptsDir, `${name}.json`);
  const raw = fs.readFileSync(p, 'utf-8');
  return JSON.parse(raw);
}

const persona = loadPromptJSON('persona');

export async function runDivination(userPayload: any) {
  const promptMeta = loadPromptJSON('divination');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params);
  try {
    return JSON.parse(reply || '{}');
  } catch (e) {
    // fallback: return raw text
    return { raw: reply };
  }
}

export async function runRandomRoll(userPayload: any) {
  const promptMeta = loadPromptJSON('random');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params);
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runRoastReco(userPayload: any) {
  const promptMeta = loadPromptJSON('roast_reco');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params);
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runPersonality(userPayload: any) {
  const promptMeta = loadPromptJSON('personality');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params);
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runCustomBuilder(userPayload: any) {
  const promptMeta = loadPromptJSON('custom_builder');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params);
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runMiniGame(userPayload: any) {
  const promptMeta = loadPromptJSON('mini_game');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params);
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runDuo(userPayload: any) {
  const promptMeta = loadPromptJSON('duo');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  const reply = await callDeepSeek(system, userPrompt, promptMeta.recommended_params);
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

// Example usage helper
export async function example() {
  const res = await runDivination({ userId: 'demo', contextTags: ['下午', '想要甜'], candidateIds: ['sku1','sku2'] });
  console.log('divination result:', res);
}

// If run directly
if (require.main === module) {
  example().catch(e => console.error(e));
}
