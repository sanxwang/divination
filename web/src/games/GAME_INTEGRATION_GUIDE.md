# 🎮 游戏集成指南

## 项目结构

```
web/
├── src/
│   └── games/
│       ├── GameContainer.jsx          # 游戏容器组件（通用iframe加载器）
│       ├── ClumsyBirdGame.jsx          # Clumsy Bird 游戏组件
│       ├── gamesConfig.js              # 游戏配置和管理（所有游戏元数据）
│       └── [其他游戏组件].jsx
└── public/
    └── games/
        ├── clumsy-bird/               # Clumsy Bird 游戏文件
        │   ├── index.html
        │   ├── js/
        │   ├── css/
        │   ├── data/
        │   └── lib/
        └── [其他游戏]/
```

## 集成 Clumsy Bird

### 步骤 1: 下载游戏文件

```bash
cd /web/public/games
git clone https://github.com/ellisonleao/clumsy-bird.git
cd clumsy-bird
npm install
npm run build
```

### 步骤 2: 配置和优化

1. **修复跨域问题**（如有必要）
   - 检查 `index.html` 中的资源加载路径
   - 确保所有资源路径都是相对路径或正确的绝对路径

2. **自定义游戏配置**（可选）
   - 修改游戏难度
   - 改变游戏颜色主题
   - 调整游戏速度

### 步骤 3: 验证集成

访问: `http://localhost:5173/game` → 点击 "Clumsy Bird"

## 添加新游戏

### 快速步骤

#### 1. 更新 `gamesConfig.js`

```javascript
// 在 GAMES_CONFIG 中添加新游戏
'my-new-game': {
  id: 'my-new-game',
  name: '我的新游戏',
  category: 'puzzle',  // all: quick, puzzle, relax, multiplayer
  icon: '🎮',
  description: '游戏描述',
  duration: '游戏时长',
  status: 'released',  // coming-soon, released, new
  type: 'iframe',      // iframe or component
  url: '/games/my-new-game/index.html'
}
```

#### 2. 如果是 React Component 游戏

创建 `src/games/MyNewGameComponent.jsx`:

```javascript
import React from 'react'
import GameContainer from './GameContainer'

export default function MyNewGameGame({ onClose }) {
  return (
    <GameContainer
      gameId="my-new-game"
      gameName="我的新游戏"
      gameType="component"
      component={MyGameLogic}
      onClose={onClose}
    />
  )
}

// 你的游戏逻辑组件
function MyGameLogic() {
  return (
    <div className="my-game">
      {/* 游戏内容 */}
    </div>
  )
}
```

#### 3. 如果是 Iframe 游戏

1. 下载游戏文件到 `/web/public/games/my-new-game/`
2. 在 `gamesConfig.js` 中配置 `url: '/games/my-new-game/index.html'`

## 支持的游戏类型

### 1. Iframe 嵌入（推荐用于第三方独立游戏）
- ✅ 隔离度高，不影响主应用
- ✅ 易于集成现成的游戏
- ❌ 跨域通信复杂
- 例子: Clumsy Bird, Flappy Bird

### 2. React Component（推荐用于定制游戏）
- ✅ 可以访问整个应用状态
- ✅ 更好的集成度
- ❌ 需要React开发
- 例子: 排行榜、积分游戏

## 游戏状态管理

### 游戏配置属性

| 属性 | 值 | 说明 |
|------|-----|------|
| id | string | 唯一标识 |
| name | string | 游戏名称 |
| category | string | 分类 (quick/puzzle/relax/multiplayer) |
| status | string | 状态 (coming-soon/released/new) |
| type | string | 类型 (iframe/component) |
| url | string | iframe 游戏 URL |
| component | component | React 组件 |

## 后续扩展

### 积分系统
```javascript
// 在游戏组件中
window.postMessage({
  type: 'GAME_SCORE',
  score: 1000
}, '*')
```

### 排行榜集成
```javascript
// 调用排行榜 API
const leaderboard = await fetchLeaderboard('clumsy-bird')
```

### 多人游戏
- 使用 WebSocket 进行实时通信
- 在 GameContainer 中添加多人支持

## 常见问题

**Q: 游戏无法加载？**
A: 检查 `/web/public/games/` 文件夹结构和资源路径

**Q: 游戏崩溃？**
A: 查看浏览器控制台错误信息，可能是资源跨域问题

**Q: 如何自定义游戏？**
A: 编辑 `gamesConfig.js` 中的游戏配置，或对应的游戏文件

## 参考链接

- [Clumsy Bird GitHub](https://github.com/ellisonleao/clumsy-bird)
- [HTML5 Game Development](https://developer.mozilla.org/en-US/docs/Games)
