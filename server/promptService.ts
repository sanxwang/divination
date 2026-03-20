import { getPrompt } from './config';
import { callDeepSeek } from './deepseekClient';
import { callModel, ModelProvider, getDefaultModel } from './modelManager';

const persona = getPrompt('persona');

export async function runDivination(userPayload: any, modelProvider?: ModelProvider) {
  const promptMeta = getPrompt('divination');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  
  const provider = modelProvider || getDefaultModel();
  const reply = provider === 'deepseek' 
    ? await callDeepSeek(system, userPrompt, promptMeta.recommended_params)
    : await callModel(provider, system, userPrompt, promptMeta.recommended_params);
  
  try {
    return JSON.parse(reply || '{}');
  } catch (e) {
    // fallback: return raw text
    return { raw: reply };
  }
}

export async function runRandomRoll(userPayload: any, modelProvider?: ModelProvider) {
  const promptMeta = getPrompt('random');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  
  const provider = modelProvider || getDefaultModel();
  const reply = provider === 'deepseek' 
    ? await callDeepSeek(system, userPrompt, promptMeta.recommended_params)
    : await callModel(provider, system, userPrompt, promptMeta.recommended_params);
  
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runRoastReco(userPayload: any, modelProvider?: ModelProvider) {
  const promptMeta = getPrompt('roast_reco');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  
  const provider = modelProvider || getDefaultModel();
  const reply = provider === 'deepseek' 
    ? await callDeepSeek(system, userPrompt, promptMeta.recommended_params)
    : await callModel(provider, system, userPrompt, promptMeta.recommended_params);
  
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runPersonality(userPayload: any, modelProvider?: ModelProvider) {
  const promptMeta = getPrompt('personality');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  
  const provider = modelProvider || getDefaultModel();
  const reply = provider === 'deepseek' 
    ? await callDeepSeek(system, userPrompt, promptMeta.recommended_params)
    : await callModel(provider, system, userPrompt, promptMeta.recommended_params);
  
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runCustomBuilder(userPayload: any, modelProvider?: ModelProvider) {
  const promptMeta = getPrompt('custom_builder');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  
  const provider = modelProvider || getDefaultModel();
  const reply = provider === 'deepseek' 
    ? await callDeepSeek(system, userPrompt, promptMeta.recommended_params)
    : await callModel(provider, system, userPrompt, promptMeta.recommended_params);
  
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runMiniGame(userPayload: any, modelProvider?: ModelProvider) {
  const promptMeta = getPrompt('mini_game');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  
  const provider = modelProvider || getDefaultModel();
  const reply = provider === 'deepseek' 
    ? await callDeepSeek(system, userPrompt, promptMeta.recommended_params)
    : await callModel(provider, system, userPrompt, promptMeta.recommended_params);
  
  try { return JSON.parse(reply || '{}'); } catch { return { raw: reply }; }
}

export async function runDuo(userPayload: any, modelProvider?: ModelProvider) {
  const promptMeta = getPrompt('duo');
  const system = `${persona.system_prompt}\n\n${promptMeta.system_prompt}`;
  const userPrompt = JSON.stringify(userPayload);
  
  const provider = modelProvider || getDefaultModel();
  const reply = provider === 'deepseek' 
    ? await callDeepSeek(system, userPrompt, promptMeta.recommended_params)
    : await callModel(provider, system, userPrompt, promptMeta.recommended_params);
  
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
