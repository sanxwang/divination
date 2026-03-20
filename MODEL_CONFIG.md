# LLM Model Configuration Guide
# 多模型支持配置指南

## 支持的模型 / Supported Models

1. **DeepSeek** (默认/Default)
   - API: https://api.deepseek.com/v1/chat/completions
   - 模型: deepseek-chat
   - Key规则: Bearer token format
   
2. **Xiaomi MiMo** (新增/New)
   - API: https://api.xiaomimimo.com/v1/chat/completions
   - 模型: mimo-v2-pro
   - Key规则: Bearer token format (同DeepSeek)
   
3. **OpenAI**
   - API: https://api.openai.com/v1/chat/completions
   - 模型: gpt-4o-mini
   - Key规则: Bearer token format

## 环境变量配置 / Environment Variables

### DeepSeek
```env
DEEPSEEK_API_URL=https://api.deepseek.com/v1
DEEPSEEK_API_KEY=sk-xxx...
DEEPSEEK_MODEL=deepseek-chat
```

### Xiaomi MiMo (小米模型 - NEW)
```env
MIMO_API_URL=https://api.xiaomimimo.com/v1
MIMO_API_KEY=sk-c7ifo02tpf3oa0dlyaxbpwhwf43m5s4ogx56nk0r8j516b8x
MIMO_MODEL=mimo-v2-pro
```

### OpenAI
```env
OPENAI_API_URL=https://api.openai.com/v1
OPENAI_API_KEY=sk-xxx...
OPENAI_MODEL=gpt-4o-mini
```

### 默认配置 / Default Configuration
```env
DEFAULT_MODEL=deepseek  # 如果未指定模型，使用此默认值
```

## 使用方式 / Usage

### 前端 (Frontend)

通过查询参数选择模型：
```javascript
// 使用特定模型调用
const response = await callDivination(payload, 'mimo');

// 发送请求时指定模型
fetch('/api/prompt/divination?model=mimo', {
  method: 'POST',
  body: JSON.stringify(payload)
})
```

### 后端 (Backend)

模型管理器会自动：
1. 检测可用的环境变量
2. 根据请求参数选择模型
3. 使用OpenAI兼容格式调用API
4. 处理错误和重试

## API 端点 / API Endpoints

### 获取可用模型列表
```
GET /api/models
Response: {
  ok: true,
  models: [
    { id: 'deepseek', name: 'DeepSeek', model: 'deepseek-chat', isDefault: true },
    { id: 'mimo', name: 'Xiaomi MiMo', model: 'mimo-v2-pro', isDefault: false }
  ],
  default: 'deepseek'
}
```

### 调用提示词
```
POST /api/prompt/:name?model=mimo
Headers: {
  'X-DeepSeek-Key': 'your-key',
  'Content-Type': 'application/json'
}
Body: { ...payload }
Response: { ok: true, parsed: {...}, model: 'mimo' }
```

## 故障排除 / Troubleshooting

1. **模型接收429错误**: 检查速率限制，可配置timeout和重试参数
2. **模型未显示在列表中**: 检查对应的环境变量是否正确设置
3. **请求失败**: 确保API URL和Key格式正确

## 安全建议 / Security

- 开发环境下，将敏感的API Key存储在.env文件中（已添加到.gitignore）
- 生产环境使用环境变量或密钥存储系统
- 不要提交.env文件到版本控制
