# 🔮 AI 奶茶占卜系统

一个融合AI与玄学的创新应用 — 基于实时条件（月相、季节、五行等）的个性化奶茶推荐系统。

![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)

## ✨ 功能特性

### 🌙 实时占卜条件
- **月相计算** - 基于当前日期自动计算8个真实月相阶段
- **时间分段** - 将24小时划分为6个能量时段（深夜、黎明、早晨、午后、傍晚、夜晚）
- **季节性质** - 根据当前月份识别季节及对应的五行属性
- **五行循环** - 日期模式对应5元素循环（木火土金水）
- **周期追踪** - 计算月份内的周数和星期几

### ♈ 12星座占卜
支持所有12个西方星座的个性化占卜推荐

### 🍵 AI 推荐系统
整合 **DeepSeek AI**，基于真实条件生成：
- 占卜标题（5字以内）
- 玄学推理逻辑
- 个性化茶品推荐
- 推荐理由
- 社交分享文案

### 🎨 高级UI效果
- **水晶球加载动画** - 紫粉色渐变、多层发光、脉动效果
- **网格卡片布局** - 精致的占卜条件展示
- **流畅过渡动画** - 从星座选择到占卜结果

### 📱 响应式设计
完美适配桌面、平板、手机等各种设备

## 🛠 技术栈

### 前端
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 快速打包编译
- **CSS3** - 高级样式与动画

### 后端
- **Express.js** - Web框架
- **Node.js 18+** - 运行环境
- **DeepSeek API** - AI能力

### 第三方服务
- **DeepSeek** - 大语言模型（占卜内容生成）

## 📦 项目结构

```
brendon2/
├── server/                          # 后端代码
│   ├── server.js                   # 主服务器文件
│   ├── apiServer.ts                # API服务配置
│   ├── deepseekClient.ts           # DeepSeek API客户端
│   ├── openaiClient.ts             # OpenAI API客户端
│   ├── promptService.ts            # 提示词服务
│   ├── validation.ts               # 数据验证
│   ├── logger.ts                   # 日志
│   ├── db.ts                       # 数据库连接
│   ├── prompts/                    # AI提示词模板
│   │   ├── divination.json         # 占卜提示词
│   │   └── ...其他prompt
│   ├── schemas/                    # 数据验证schema
│   ├── migrations/                 # 数据库迁移
│   └── seeds/                      # 数据库种子数据
│
├── web/                            # 前端代码
│   ├── src/
│   │   ├── main.tsx               # 入口文件
│   │   ├── App.tsx                # 主组件
│   │   ├── styles.css             # 全局样式
│   │   ├── components/            # 可复用组件
│   │   │   └── ProductCard.tsx
│   │   └── pages/                 # 页面组件
│   │       ├── HomePage.tsx
│   │       └── DivinationPage.tsx # 占卜页面（核心）
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── package.json                    # 根项目配置
└── README.md                       # 本文件
```

## 🚀 快速开始

### 环境要求
- **Node.js** 18.0 或更高版本
- **npm** 9.0 或更高版本

### 安装依赖

```bash
# 安装根项目依赖
npm install

# 安装后端依赖
cd server && npm install && cd ..

# 安装前端依赖
cd web && npm install && cd ..
```

### 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# DeepSeek API 配置
DEEPSEEK_API_URL=https://api.deepseek.com/v1
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 其他配置
NODE_ENV=development
PORT=3000
```

### 启动服务

#### 方式1：分别启动

**后端服务**（端口 3000）
```bash
cd server
npm start
```

**前端开发服务**（端口 5173）
```bash
cd web
npm run dev
```

#### 方式2：同时启动（需要终端支持后台运行）
```bash
npm start  # 同时启动前后端
```

### 访问应用

- **前端应用**: http://localhost:5173
- **后端API**: http://localhost:3000
- **占卜页面**: http://localhost:5173/divination

## 📖 使用指南

### 1. 启动应用
```bash
npm install
npm start
```

### 2. 进入占卜页面
访问 http://localhost:5173/divination

### 3. 选择星座
点击12个星座中的任意一个

### 4. 查看占卜结果
- 自动显示水晶球加载动画
- 完成后展示：
  - 占卜标题（源于月相+季节+五行+星座的组合）
  - 推荐茶品
  - 推荐理由
  - 社交分享文案

### 5. 查看占卜条件
点击"🔮 查看本次占卜条件"按钮展开，查看当前真实的占卜基础条件：
- 🌙 月相
- 🕐 时间段
- 🌳 季节
- ⚪ 五行
- 📅 日期与周数

## 🔧 API 端点

### 获取占卜条件
```
GET /api/divination-context

响应示例:
{
  "ok": true,
  "context": {
    "date": "3月18日",
    "dayOfWeek": "周三",
    "moonPhase": { "emoji": "🌕", "name": "满月", "desc": "..." },
    "timePhase": { "emoji": "🌆", "name": "傍晚沉静", "desc": "..." },
    "season": { "emoji": "🌱", "name": "春季生长", "desc": "..." },
    "element": { "emoji": "⚪", "name": "金象", "desc": "..." },
    "weekNumber": 12
  }
}
```

### 执行占卜
```
POST /api/prompt/divination

请求体:
{
  "userId": "user_xxxxx",
  "contextTags": ["白羊", "今日运势", "3月18日", "周一", "满月", ...],
  "candidateIds": ["tea_001", "tea_002", "tea_003", "tea_004", "tea_005"]
}

响应示例:
{
  "ok": true,
  "parsed": {
    "type": "divination",
    "headline": "满月破金",
    "mystic_reason": "根据今天的满月...",
    "recommendation": {
      "id": "tea_003",
      "name": "茉香青提冰萃",
      "reason": "满月让你上头，金象让你憋屈...",
      "tags": ["清爽", "解郁", "春季特调"]
    },
    "cta": "喝它冷静",
    "share_text": "满月+金象日，我快炸了..."
  }
}
```

## 🌙 条件计算说明

### 月相计算
基于 **朔望周期 (Lunar Month = 29.5天)**：
- 当前月份日期 % 29.5 ÷ 3.68 → 8个月相阶段
- 新月 → 上弦月 → 满月 → 下弦月 → 新月（循环）

### 时间分段
24小时划分为6段：
- **深夜** (00-04) - 阴气重、能量低
- **黎明** (05-08) - 阳气初生、能量启动
- **早晨** (09-12) - 阳气充沛、活力高
- **午后** (13-17) - 午火旺盛、热情高涨
- **傍晚** (18-21) - 阳气开始内收、需安抚
- **夜晚** (22-23) - 阴气归位、休息时刻

### 季节周期
```
1-3月  →  春季生长（木象）
4-6月  →  夏季热烈（火象）
7-9月  →  秋季收敛（金象）
10-12月 →  冬季潜伏（水象）
```

### 五行循环
日期 % 5 映射到五行循环：
```
0 → 水象  1 → 木象  2 → 火象  3 → 金象  4 → 土象
```

## 🎨 设计亮点

### Loading 动画
- **紫粉渐变球** - 多层box-shadow模拟宝石感
- **旋转光环** - 两层环形边框，独立旋转
- **脉动效果** - 亮度+缩放综合变化
- **字幕脉动** - 文字上下浮动+渐显渐隐

### 条件卡片
- 从列表改为网格布局
- 悬停时提升+发光效果
- 简洁的emoji + 条件名称展示

## 🔌 环境变量配置

| 变量 | 说明 | 示例 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 | `sk-xxxxx` |
| `DEEPSEEK_API_URL` | DeepSeek API地址 | `https://api.deepseek.com/v1` |
| `PORT` | 后端服务端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` / `production` |

## 📝 开发说明

### 修改占卜提示词
编辑 `server/prompts/divination.json`：
```json
{
  "system": "你是一位神秘的茶叶占卜师...",
  "user": "基于这些条件为${zodiac}占卜一杯奶茶..."
}
```

### 添加新的茶品
在 `server/seeds/seed_products.sql` 中添加记录

### 修改UI样式
编辑 `web/src/styles.css`

## 🐛 常见问题

### Q: 后端连接不上DeepSeek API
**A:** 检查 `.env` 文件中的 `DEEPSEEK_API_KEY` 是否正确，确保网络连接正常

### Q: 占卜条件计算不对
**A:** 条件基于服务器当前时间计算，确保服务器时间设置正确

### Q: 前端无法连接后端
**A:** 确保后端服务运行在 `http://localhost:3000`，检查网络连接

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📮 联系方式

如有问题或建议，欢迎通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至 support@example.com

## 🙏 致谢

感谢以下项目和服务：
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Express.js](https://expressjs.com)
- [DeepSeek](https://deepseek.com)

---

**享受神秘的奶茶占卜体验！** ☕✨
