Usage: prompts + example backend calls

Files are placed in `server/prompts/*.json` and a small service `server/promptService.ts` demonstrates how to load them and call the model.

Setup:

1. Add environment variable `DEEPSEEK_API_KEY` (and optionally `DEEPSEEK_API_URL` if you have a custom endpoint).
2. Install dependencies (node-fetch & types):

```bash
npm install node-fetch@2
npm install -D @types/node-fetch
```

3. Run the example (uses DeepSeek client):

```bash
DEEPSEEK_API_KEY=your_key node --loader ts-node/esm server/promptService.ts
```

Notes:
 - `deepseekClient.ts` is provided as a minimal DeepSeek wrapper; replace `DEEPSEEK_API_URL` and `DEEPSEEK_API_KEY` with your credentials.
 
Run local Express proxy server (example):

```bash
npm install
DEEPSEEK_API_KEY=your_key PROMPT_PROXY_KEY=proxy_key node --loader ts-node/esm server/apiServer.ts
```

Then POST to `http://localhost:3000/api/divination` with JSON body:

```json
{
	"userId": "demo_user",
	"contextTags": ["下午","想要甜"],
	"candidateIds": ["sku1","sku2","sku3"]
}
```

The server will forward the composed system + prompt to DeepSeek and return parsed JSON when possible.
Note: both the generic proxy `/api/prompt/:name` and the business route `/api/divination` require the header `X-DeepSeek-Key` to match `PROMPT_PROXY_KEY` (or `DEEPSEEK_API_KEY` if `PROMPT_PROXY_KEY` is not set).
- Each prompt JSON contains `system_prompt`, `recommended_params` and `output_schema`. The service composes `persona.system_prompt` + specific prompt `system_prompt` to form the final system role.
- Always validate LLM JSON before trusting fields: the service currently attempts `JSON.parse(reply)` and falls back to raw text.
 - The proxy now validates LLM responses against JSON Schemas in `server/schemas/*.schema.json` using `ajv`.
 - If the LLM output doesn't match the expected schema the proxy returns HTTP 502 with validation errors and the raw parsed output.
 - Production safety:
	 - If `NODE_ENV=production` the server will fail-fast at startup unless both `DEEPSEEK_API_KEY` and `PROMPT_PROXY_KEY` are set.
	 - The DeepSeek client includes a request `timeout` (configurable via `DEEPSEEK_TIMEOUT_MS`) and a simple circuit-breaker that opens after several consecutive failures (`DEEPSEEK_CB_THRESHOLD`, `DEEPSEEK_CB_COOLDOWN_MS`).
 - Tuning:
	 - `DEEPSEEK_TIMEOUT_MS` (ms) default 4000
	 - `DEEPSEEK_CB_THRESHOLD` default 5
	 - `DEEPSEEK_CB_COOLDOWN_MS` default 60000
