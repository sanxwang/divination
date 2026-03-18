import { spawn } from 'child_process';
import fetch from 'node-fetch';
import path from 'path';

async function waitUntil(url: string, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error('timeout waiting for mock server');
}

async function main() {
  const mockPath = path.join(__dirname, '..', 'mock_deepseek_server.js');
  const mock = spawn('node', [mockPath], { env: { ...process.env, MOCK_DEEPSEEK_PORT: '5001' }, stdio: ['ignore', 'pipe', 'pipe'] });

  mock.stdout.on('data', d => process.stdout.write(`[mock] ${d}`));
  mock.stderr.on('data', d => process.stderr.write(`[mock.err] ${d}`));

  const mockUrl = 'http://localhost:5001/v1/generate';
  await waitUntil('http://localhost:5001');

  // Point DeepSeek client to the mock server
  process.env.DEEPSEEK_API_URL = mockUrl;
  process.env.DEEPSEEK_API_KEY = 'test_key';

  // Import promptService dynamically after env is set
  const svc = await import('../promptService');

  console.log('Calling runDivination with sample payload...');
  const payload = { userId: 'test_user', contextTags: ['下午'], candidateIds: ['sku_mock1','sku_mock2'] };
  try {
    const result = await svc.runDivination(payload);
    console.log('runDivination result:', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Error calling runDivination:', e);
  }

  // Test other prompt functions
  const tests: Array<{name:string, fn:string, payload:any}> = [
    { name: 'random', fn: 'runRandomRoll', payload: { userId: 't', candidateIds: ['a','b'], seed: 1 } },
    { name: 'roast_reco', fn: 'runRoastReco', payload: { userId: 't', selectedTags: ['奶','浓郁'], freeText: '想补能量' } },
    { name: 'personality', fn: 'runPersonality', payload: { userId: 't', answers: [0,1,2], profileId: 'lazy_sweet' } },
    { name: 'custom_builder', fn: 'runCustomBuilder', payload: { userId: 't', flavor: ['水果'], feeling: ['清爽'], toppings: ['椰果'], candidateIds: ['sku2'] } },
    { name: 'mini_game', fn: 'runMiniGame', payload: { userId: 't', game: 'guess_age', candidateAnswers: [18,22,30], correct: 30 } },
    { name: 'duo', fn: 'runDuo', payload: { userA: { id: 'a1', name: 'A' }, userB: { id: 'b1', name: 'B' }, relationChoice: '情侣' } }
  ];

  for (const t of tests) {
    try {
      console.log(`Calling ${t.fn}...`);
      // @ts-ignore
      const out = await svc[t.fn](t.payload);
      console.log(`${t.fn} result:`, JSON.stringify(out, null, 2));
    } catch (e) {
      console.error(`Error calling ${t.fn}:`, e);
    }
  }

  mock.kill();
}

main().catch(e => { console.error(e); process.exit(1); });
