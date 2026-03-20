import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { filterGamesByCategory, CATEGORIES, getGameConfig } from '../games/gamesConfig'
import GameContainer from '../games/GameContainer'

export default function GamesPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeGame, setActiveGame] = useState(null)

  const filteredGames = filterGamesByCategory(selectedCategory)

  if (activeGame) {
    const gameConfig = getGameConfig(activeGame)
    if (gameConfig?.component) {
      const GameComponent = gameConfig.component
      return <GameComponent onClose={() => setActiveGame(null)} />
    }
    return (
      <GameContainer
        gameId={activeGame}
        gameName={gameConfig?.name}
        gameType={gameConfig?.type}
        gameUrl={gameConfig?.url}
        onClose={() => setActiveGame(null)}
      />
    )
  }

  return (
    <div className="games-page">
      <header className="games-header">
        <h1>🎮 游戏中心</h1>
        <p className="tagline">等奶茶时的快乐系统</p>
      </header>

      {/* 分类导航 */}
      <div className="category-nav">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="icon">{cat.icon}</span>
            <span className="name">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 游戏网格 */}
      <div className="games-grid">
        {filteredGames.map(game => (
          <div key={game.id} className={`game-card ${game.status}`}>
            <div className="game-icon">{game.icon}</div>
            <div className="game-info">
              <h3>{game.name}</h3>
              <p className="description">{game.description}</p>
              <span className="duration">⏱️ {game.duration}</span>
            </div>
            <div className="badge">{
              game.status === 'coming-soon' ? '开发中' :
              game.status === 'new' ? '新游戏' : '可玩'
            }</div>
            
            <button
              className="play-btn"
              disabled={game.status === 'coming-soon'}
              onClick={() => setActiveGame(game.id)}
            >
              {game.status === 'coming-soon' ? '敬请期待' : '开始玩'}
            </button>
          </div>
        ))}
      </div>

      {/* 排行榜预告 */}
      <section className="leaderboard-preview">
        <h2>🏆 今日排行榜（敬请期待）</h2>
        <div className="leaderboard-placeholder">
          <p>🌟 Clumsy Bird 最高分排名</p>
          <p>🌟 2048 最高分排名</p>
          <p>首名用户将获得小料礼遇！</p>
        </div>
      </section>

      {/* 开发说明 */}
      <section className="dev-section" style={{ fontSize: '12px', margin: '20px', opacity: 0.6 }}>
        <h3>📋 集成状态</h3>
        <ul>
          <li>✅ 游戏框架和配置系统</li>
          <li>✅ Clumsy Bird 集成（iframe方式）</li>
          <li>⏳ 其他游戏陆续集成中</li>
          <li>⏳ 后端排行榜系统</li>
          <li>⏳ 游戏积分和奖励机制</li>
          <li>⏳ 多人游戏WebSocket支持</li>
        </ul>
      </section>
    </div>
  )
}
