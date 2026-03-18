import React from 'react'

export default function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>🤖 AI奶茶研究所</h1>
        <p className="tagline">今天喝什么？</p>
      </header>

      <div className="features-grid">
        <button className="feature-btn primary" onClick={() => onNavigate('divination')}>
          <span className="icon">🔮</span>
          <span className="title">今日奶茶占卜</span>
          <span className="desc">命运安排的一杯</span>
        </button>

        <button className="feature-btn" onClick={() => onNavigate('random')}>
          <span className="icon">🎲</span>
          <span className="title">随机奶茶</span>
          <span className="desc">赌狗系统</span>
        </button>

        <button className="feature-btn" onClick={() => onNavigate('roast')}>
          <span className="icon">😈</span>
          <span className="title">AI吐槽推荐</span>
          <span className="desc">被调侃着推荐</span>
        </button>

        <button className="feature-btn" onClick={() => onNavigate('personality')}>
          <span className="icon">🧠</span>
          <span className="title">奶茶人格测试</span>
          <span className="desc">你是哪种奶茶人</span>
        </button>

        <button className="feature-btn" onClick={() => onNavigate('custom')}>
          <span className="icon">🧪</span>
          <span className="title">自制奶茶</span>
          <span className="desc">DIY你的完美搭配</span>
        </button>

        <button className="feature-btn" onClick={() => onNavigate('game')}>
          <span className="icon">🎮</span>
          <span className="title">等餐互动</span>
          <span className="desc">猜游戏</span>
        </button>

        <button className="feature-btn" onClick={() => onNavigate('duo')}>
          <span className="icon">❤️</span>
          <span className="title">双人模式</span>
          <span className="desc">一起更好玩</span>
        </button>

        <button className="feature-btn" onClick={() => onNavigate('products')}>
          <span className="icon">🛒</span>
          <span className="title">购物车</span>
          <span className="desc">直接点餐</span>
        </button>
      </div>

      <footer className="home-footer">
        <p>扫码开始体验</p>
      </footer>
    </div>
  )
}
