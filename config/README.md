# 配置管理模块 (Config Module)

统一的静态配置管理，包含所有占卜系统的 prompts 和 schemas。

## 📁 文件结构

```
config/
├── index.js          # 主配置文件（所有prompts和schemas）
├── README.md         # 本文件
└── package.json      # 包管理（可选，用于发布为独立包）
```

## 🚀 使用方法

### 1. 导入配置

```javascript
// 导入整个配置模块
import config from './index.js';

// 或者导入特定的部分
import { prompts, schemas, getPrompt, getSchema } from './index.js';
```

### 2. 获取 prompt 配置

```javascript
// 方式1：直接访问
const divinationPrompt = config.prompts.divination;
const customBuilderPrompt = config.prompts.custom_builder;

// 方式2：使用 getPrompt 函数
const personality = config.getPrompt('personality');
```

### 3. 获取 schema 配置

```javascript
// 方式1：直接访问
const divinationSchema = config.schemas.divination;

// 方式2：使用 getSchema 函数
const roastSchema = config.getSchema('roast_reco');
```

### 4. 获取所有可用类型

```javascript
// 获取所有 prompt 类型
const promptTypes = config.getPromptKeys();
// ["divination", "custom_builder", "duo", "mini_game", "personality", "random", "roast_reco", "share", "persona"]

// 获取所有 schema 类型
const schemaTypes = config.getSchemaKeys();
// ["divination", "custom_builder", "duo", "mini_game", "personality", "random", "roast_reco"]
```

## 📋 可用的配置类型

### Prompts（9个）

| 类型 | 描述 |
|------|------|
| `divination` | 今日奶茶占卜 |
| `custom_builder` | 自制奶茶（DIY构建器） |
| `duo` | 双人模式 |
| `mini_game` | 等餐互动小游戏 |
| `personality` | 人格测试 |
| `random` | 随机推荐（老虎机式） |
| `roast_reco` | AI吐槽推荐 |
| `share` | 社交分享文案模板 |
| `persona` | 全局人格设定 |

### Schemas（7个）

| 类型 | 描述 |
|------|-------|
| `divination` | 占卜输出格式验证 |
| `custom_builder` | DIY输出格式验证 |
| `duo` | 双人模式输出格式验证 |
| `mini_game` | 游戏输出格式验证 |
| `personality` | 人格测试输出格式验证 |
| `random` | 随机推荐输出格式验证 |
| `roast_reco` | 吐槽推荐输出格式验证 |

## 🔧 在项目中使用

### Server 项目

```javascript
// server/promptService.js
import config from '../config/index.js';

export function getPromptSystemMessage(type) {
  const prompt = config.getPrompt(type);
  return prompt.system_prompt;
}

export function getSchema(type) {
  return config.getSchema(type);
}
```

### Web 项目

```javascript
// web/src/api.js
import config from '../../config/index.js';

export const SHARE_TEMPLATES = config.prompts.share.templates;

export function getSystemPersona() {
  return config.prompts.persona.system_prompt;
}
```

## 📝 配置结构

每个 prompt 配置包含：
- `name`: 配置名称
- `description`: 功能描述
- `system_prompt`: AI系统指令
- `example_user_input`: 用户输入示例
- `recommended_params`: 推荐的 API 参数（temperature, max_tokens 等）
- `example_output`: 预期输出示例

每个 schema 配置包含：
- `$id`: schema 标识符
- `type`: JSON Schema 类型
- `properties`: 字段定义
- `required`: 必需字段列表

## 🔄 维护指南

当需要更新配置时：

1. **修改原始 JSON 文件**（server/prompts/* 或 server/schemas/*）
2. **重新生成 config/index.js**
   ```bash
   node generate-config.js
   ```
3. **提交更新**到版本控制系统

> **注意**：目前 config/index.js 是通过脚本从 server/prompts 和 server/schemas 目录生成的。直接编辑此文件的更改可能在重新生成时被覆盖。

## 📦 导出为独立包（可选）

如果需要在其他项目中使用这些配置，可以将此模块发布为 NPM 包：

```bash
npm publish
```

然后在其他项目中安装：

```bash
npm install @yourname/divination-config
```

## 🎯 示例

### 完整的占卜流程示例

```javascript
import config from './config/index.js';

// 1. 获取占卜 prompt
const divinationConfig = config.getPrompt('divination');
console.log('System prompt:', divinationConfig.system_prompt);
console.log('Recommended params:', divinationConfig.recommended_params);

// 2. 调用 LLM API（例如 DeepSeek）
const response = await llmAPI.complete({
  system: divinationConfig.system_prompt,
  prompt: userInput,
  temperature: divinationConfig.recommended_params.temperature,
  max_tokens: divinationConfig.recommended_params.max_tokens
});

// 3. 验证输出（可选）
const schema = config.getSchema('divination');
const isValid = validateAgainstSchema(response, schema);

// 4. 返回给前端
return response;
```

## 📞 相关资源

- [Server 项目](../server/README.md)
- [Web 项目](../web/README.md)
- [项目开发计划](../DEVELOPMENT_PLAN.md)
