#!/usr/bin/env bash

# 🎯 多模型支持 - 快速参考指南
# Quick Reference Guide for Multi-Model Support

cat << 'EOF'

╔════════════════════════════════════════════════════════════════════════════╗
║                   🤖 AI奶茶研究所 - 多模型支持                             ║
║                   Multi-Model Integration Complete!                        ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 支持的模型 (Supported Models)
────────────────────────────────────────────────────────────────────────────
  ✅ DeepSeek (默认/Default)
     - Key: sk-3e8f11c6cde74a6da9ce261d31dd69c9
     - API: https://api.deepseek.com/v1
     
  ✅ Xiaomi MiMo (新增/NEW)
     - Key: sk-c7ifo02tpf3oa0dlyaxbpwhwf43m5s4ogx56nk0r8j516b8x
     - API: https://api.xiaomimimo.com/v1
     
  ✅ OpenAI (可选/Optional)
     - 需要设置: OPENAI_API_KEY 环境变量

🚀 快速开始 (Quick Start)
────────────────────────────────────────────────────────────────────────────

1️⃣  启动服务器
    $ cd server && npm start

2️⃣  获取可用模型
    $ curl http://localhost:3000/api/models

3️⃣  使用Mimo模型调用API
    $ curl -X POST "http://localhost:3000/api/prompt/random?model=mimo" \
      -H "Content-Type: application/json" \
      -d '{"userId":"test","contextTags":["afternoon"]}'

4️⃣  测试工具（选择一种）
    # Shell脚本
    $ bash test_models.sh
    
    # 或在浏览器打开
    $ open test_models.html

📝 API 接口 (API Endpoints)
────────────────────────────────────────────────────────────────────────────

GET /api/models
  返回所有可用模型列表
  Response: { ok: true, models: [...], default: "deepseek" }

POST /api/prompt/:name?model=mimo
  使用指定模型调用提示词
  参数: :name = random|divination|personality|roast_reco|custom_builder
  查询参数: model = deepseek|mimo|openai

💻 前端使用 (Frontend Usage)
────────────────────────────────────────────────────────────────────────────

// 导入API函数
import { getAvailableModels, callDivination } from './api'

// 获取模型列表
const { models } = await getAvailableModels()

// 使用指定模型调用
const result = await callDivination(payload, 'mimo')
console.log(result.model) // 输出: 'mimo'

// 使用ModelSelector组件
import ModelSelector from './components/ModelSelector'

function MyPage() {
  const [model, setModel] = useState(null)
  
  return (
    <>
      <ModelSelector 
        selectedModel={model} 
        onModelChange={setModel} 
      />
      {/* 使用 model 状态 */}
    </>
  )
}

📚 文档位置 (Documentation)
────────────────────────────────────────────────────────────────────────────
  
  ├─ MULTI_MODEL_GUIDE.md
  │  📖 详细的实现和使用指南
  │
  ├─ MODEL_CONFIG.md
  │  🔧 配置和环境变量说明
  │
  ├─ IMPLEMENTATION_SUMMARY.md
  │  ✅ 完成度总结和技术细节
  │
  ├─ server/db_schema.md
  │  📊 数据库schema（含model_provider列）
  │
  └─ server/modelManager.ts
     💻 模型管理器源代码

🧪 测试工具 (Testing Tools)
────────────────────────────────────────────────────────────────────────────

方式1: Shell脚本 (推荐用于自动化)
  $ bash test_models.sh

方式2: Web界面 (推荐用于手动测试)
  $ open test_models.html

方式3: curl命令 (推荐用于单个API调试)
  $ curl http://localhost:3000/api/models | jq

⚙️ 配置检查清单 (Configuration Checklist)
────────────────────────────────────────────────────────────────────────────

.env 文件中应包含:
  ☑ DEEPSEEK_API_KEY
  ☑ DEEPSEEK_API_URL
  ☑ MIMO_API_KEY (新增)
  ☑ MIMO_API_URL (新增)
  ☑ MIMO_MODEL (新增)
  ☑ DEFAULT_MODEL (新增)

数据库:
  ☑ prompt_logs 表有 model_provider 列
  ☑ 索引已创建

代码:
  ☑ server/server.js 已更新
  ☑ server/promptService.ts 已更新
  ☑ web/src/api.js 已更新
  ☑ ModelSelector.jsx 组件已创建

🎯 键值调用示例 (Key API Examples)
────────────────────────────────────────────────────────────────────────────

# 使用DeepSeek（默认）
curl -X POST http://localhost:3000/api/prompt/divination \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1"}'

# 使用MiMo
curl -X POST http://localhost:3000/api/prompt/divination?model=mimo \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1"}'

# 使用OpenAI
curl -X POST http://localhost:3000/api/prompt/divination?model=openai \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1"}'

# 获取模型列表
curl http://localhost:3000/api/models | jq '.'

🔍 调试技巧 (Debugging Tips)
────────────────────────────────────────────────────────────────────────────

1. 检查环境变量
   $ grep MIMO .env

2. 验证数据库迁移
   $ psql $DATABASE_URL -c "SELECT column_name FROM information_schema.columns WHERE table_name='prompt_logs'"

3. 查看模型使用统计
   $ psql $DATABASE_URL -c "SELECT model_provider, COUNT(*) FROM prompt_logs GROUP BY model_provider"

4. 测试API连接
   $ curl http://localhost:3000/api/models

5. 查看服务器日志
   $ tail -f logs/server.log

📖 常见问题 (FAQ)
────────────────────────────────────────────────────────────────────────────

Q: 如何添加新的模型？
A: 在 server/server.js 中修改 AVAILABLE_MODELS 对象，按照现有格式添加新条目。

Q: 模型列表为空？
A: 检查所有模型的 API_KEY 环境变量是否正确设置。

Q: 前端看不到ModelSelector？
A: 确保从 HomePage 正确导入了 ModelSelector 组件。

Q: 如何设置不同的默认模型？
A: 修改 .env 中的 DEFAULT_MODEL 环境变量。

Q: 数据库错误？
A: 运行迁移脚本: psql $DATABASE_URL -f server/migrations/002_add_model_provider.sql

✨ 下一步 (Next Steps)
────────────────────────────────────────────────────────────────────────────

1. 测试所有API接口
2. 在其他页面中集成ModelSelector
3. 实施模型性能监控
4. 部署到生产环境

╔════════════════════════════════════════════════════════════════════════════╗
║                      ✅ 实现完成！享受多模型支持！                          ║
║                    🎉 Implementation Complete! Happy Coding! 🎉           ║
╚════════════════════════════════════════════════════════════════════════════╝

最后更新 (Last Updated): 2026-03-20
版本 (Version): 1.0.0

EOF
