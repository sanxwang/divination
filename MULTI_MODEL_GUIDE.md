# 🤖 多模型支持实现指南

## 概述

本项目已成功集成**多个AI大模型**的支持，包括：
- ✅ **DeepSeek** (默认)
- ✅ **Xiaomi MiMo** (新增) 
- ✅ **OpenAI** (可选)

用户可以在运行时动态切换模型，无需修改代码。

---

## 🚀 快速开始

### 1. 环境配置 (.env)

```env
# DeepSeek (已有)
DEEPSEEK_API_KEY=sk-3e8f11c6cde74a6da9ce261d31dd69c9
DEEPSEEK_API_URL=https://api.deepseek.com/v1

# Xiaomi MiMo (新增)
MIMO_API_KEY=sk-c7ifo02tpf3oa0dlyaxbpwhwf43m5s4ogx56nk0r8j516b8x
MIMO_API_URL=https://api.xiaomimimo.com/v1
MIMO_MODEL=mimo-v2-pro

# 默认模型
DEFAULT_MODEL=deepseek
```

### 2. 数据库迁移

```bash
# 手动运行迁移脚本
cd server
psql -U user -d database_name -f migrations/002_add_model_provider.sql
```

或

```bash
# 通过环境变量
source .env
psql "$DATABASE_URL" -f server/migrations/002_add_model_provider.sql
```

### 3. 启动服务

```bash
cd server
npm install  # 如果之前未安装
npm start
```

后端将在 `localhost:3000` 启动，支持以下接口：
- `GET /api/models` - 获取可用模型列表
- `POST /api/prompt/:name?model=mimo` - 使用指定模型调用提示词

---

## 📖 使用方式

### 后端 API

#### 获取可用模型

```bash
curl http://localhost:3000/api/models
```

响应示例：
```json
{
  "ok": true,
  "models": [
    {
      "id": "deepseek",
      "name": "DeepSeek",
      "model": "deepseek-chat",
      "isDefault": true
    },
    {
      "id": "mimo",
      "name": "Xiaomi MiMo",
      "model": "mimo-v2-pro",
      "isDefault": false
    }
  ],
  "default": "deepseek"
}
```

#### 调用指定模型

**方式1: 查询参数**
```bash
curl -X POST "http://localhost:3000/api/prompt/random?model=mimo" \
  -H "Content-Type: application/json" \
  -H "X-DeepSeek-Key: your-key" \
  -d '{"userId":"user123","contextTags":["afternoon"]}'
```

**方式2: POST body**
```bash
curl -X POST "http://localhost:3000/api/prompt/random" \
  -H "Content-Type: application/json" \
  -H "X-DeepSeek-Key: your-key" \
  -d '{
    "userId":"user123",
    "model":"mimo",
    "contextTags":["afternoon"]
  }'
```

响应示例：
```json
{
  "ok": true,
  "parsed": { "recommendation": "芒果奶茶" },
  "model": "mimo"
}
```

---

### 前端集成

#### 1. 获取并显示模型列表

```javascript
import { getAvailableModels } from './api'

const data = await getAvailableModels()
console.log(data.models) // 可用模型列表
```

#### 2. 使用指定模型调用API

```javascript
import { callDivination } from './api'

// 使用Mimo模型
const result = await callDivination(payload, 'mimo')
console.log(result.model) // 输出: 'mimo'
```

#### 3. ModelSelector 组件

```jsx
import ModelSelector from '@/components/ModelSelector'
import { useState } from 'react'

export default function MyPage() {
  const [selectedModel, setSelectedModel] = useState(null)

  return (
    <>
      <ModelSelector 
        selectedModel={selectedModel} 
        onModelChange={setSelectedModel} 
      />
      {/* 使用 selectedModel 调用API */}
    </>
  )
}
```

---

## 🧪 测试

### 方式1: 使用测试脚本

```bash
# 使用提供的shell脚本测试所有模型
bash test_models.sh
```

### 方式2: 使用Web测试工具

```bash
# 在浏览器中打开测试页面
open test_models.html  # Mac
# 或在浏览器中访问
http://localhost:3000/../test_models.html
```

### 方式3: 使用curl

```bash
# 列出所有可用模型
curl http://localhost:3000/api/models | jq

# 使用Mimo模型
curl -X POST "http://localhost:3000/api/prompt/random?model=mimo" \
  -H "Content-Type: application/json" \
  -d '{"userId":"test"}'
```

---

## 📋 项目结构

```
divination/
├── server/
│   ├── modelManager.ts          # 🆕 模型管理器 - 统一接口
│   ├── promptService.ts         # ✏️ 已更新 - 支持modelProvider参数
│   ├── server.js                # ✏️ 已更新 - 新增/api/models路由
│   ├── deepseekClient.ts        # 保持现有实现
│   ├── db_schema.md             # ✏️ 已更新 - 记录model_provider列
│   └── migrations/
│       ├── 001_init.sql
│       └── 002_add_model_provider.sql  # 🆕 数据库迁移
│
├── web/src/
│   ├── api.js                   # ✏️ 已更新 - 支持model参数
│   └── components/
│       └── ModelSelector.jsx    # 🆕 模型选择器组件
│       └── pages/
│           └── HomePage.jsx     # ✏️ 已更新 - 集成ModelSelector
│
├── MODEL_CONFIG.md              # 🆕 配置指南
├── test_models.sh               # 🆕 Shell脚本测试工具
├── test_models.html             # 🆕 Web测试工具
└── .env                         # ✏️ 已更新 - MIMO配置
```

---

## 🔧 代码示例

### 添加新模型

在 `server/server.js` 中修改 `AVAILABLE_MODELS` 对象：

```javascript
const AVAILABLE_MODELS = {
  deepseek: { /* ... */ },
  mimo: { /* ... */ },
  openai: { /* ... */ },
  // 添加新模型
  newmodel: {
    name: 'New Model',
    endpoint: 'https://api.newmodel.com/v1',
    key: process.env.NEWMODEL_API_KEY || '',
    isAvailable: !!process.env.NEWMODEL_API_KEY,
    model: process.env.NEWMODEL_MODEL || 'model-name'
  }
}
```

### 在TypeScript中使用

```typescript
import { callModel, ModelProvider } from './modelManager'

const provider: ModelProvider = 'mimo'
const response = await callModel(provider, system, prompt, params)
```

---

## ⚠️ 注意事项

1. **API密钥安全**
   - 开发环境：存储在 `.env` 文件中（已在 `.gitignore` 中）
   - 生产环境：使用环境变量或密钥管理系统

2. **API速率限制**
   - 每个模型可能有不同的速率限制
   - 配置在 `promptMeta.recommended_params` 中

3. **错误处理**
   - 若API不可用，会自动fallback到默认模型
   - 详见 `server/server.js` 中的error handling

4. **数据库**
   - `prompt_logs` 表现在记录使用的模型
   - 可用于分析和统计

---

## 📊 监控和分析

查看各模型的使用统计：

```sql
SELECT model_provider, COUNT(*) as usage_count, 
       COUNT(CASE WHEN valid = true THEN 1 END) as success_count
FROM prompt_logs
GROUP BY model_provider;
```

---

## 🆘 故障排除

| 问题 | 原因 | 解决方案 |
|------|------|--------|
| `Model provider is not available` | 环境变量未设置 | 检查 `.env` 文件，确保有对应的 `XXX_API_KEY` |
| 模型列表为空 | 所有模型都不可用 | 至少需要一个模型的API Key |
| API请求超时 | 网络或服务器问题 | 检查 API endpoint 和网络连接 |
| 401 Unauthorized | API Key错误 | 验证 API Key 是否正确和有效期 |

---

## 📚 相关文档

- [MODEL_CONFIG.md](./MODEL_CONFIG.md) - 详细的配置指南
- [server/db_schema.md](./server/db_schema.md) - 数据库schema说明
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - 项目开发计划

---

## ✅ 功能清单

- [x] DeepSeek 模型支持
- [x] Xiaomi MiMo 模型支持
- [x] OpenAI 模型支持
- [x] 模型动态选择
- [x] 后端 API 增强
- [x] 前端 ModelSelector 组件
- [x] 数据库模型追踪
- [x] 测试工具
- [ ] 模型性能对比仪表板
- [ ] 自动 fallback 机制

---

## 📞 支持

遇到问题？检查以下内容：

1. ✅ 所有环境变量都正确设置
2. ✅ 后端服务正在运行
3. ✅ 数据库迁移已完成
4. ✅ 相关模型的 API Key 有效期未过期
5. ✅ 网络连接正常

---

**最后更新**: 2026-03-20  
**版本**: 1.0.0-multi-model
