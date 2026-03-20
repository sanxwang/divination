import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 首页
 * 
 * 功能列表：
 * 1. 占卜系列 - 占卜、随机、吐槽
 * 2. 互动系列 - 人格测试、自制奶茶
 * 3. 娱乐系列 - 游戏中心、情绪抚慰室
 * 4. 社交系列 - 双人模式
 * 5. 商城 - 点餐购物
 */

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>🤖 AI奶茶研究所</h1>
        <p className="tagline">今天喝什么？</p>
      </header>

      <div className="features-grid">
        {/* 聊天系列 - 新增功能 */}
        <button className="feature-btn highlight" onClick={() => navigate('/chat')}>
          <span className="icon">💬</span>
          <span className="title">AI 聊天室</span>
          <span className="desc">测试模型能力，自由对话</span>
          <span className="badge">✨ 新功能</span>
        </button>

        {/* 占卜系列 - 核心功能 */}
        {/* <button className="feature-btn primary" onClick={() => navigate('/divination')}>
          <span className="icon">🔮</span>
          <span className="title">今日奶茶占卜</span>
          <span className="desc">命运安排的一杯</span>
        </button> */}

        <button className="feature-btn" onClick={() => navigate('/random')}>
          <span className="icon">🎲</span>
          <span className="title">随机奶茶</span>
          <span className="desc">不知道喝点啥，随机来一杯吧</span>
        </button>

        {/* <button className="feature-btn" onClick={() => navigate('/roast')}>
          <span className="icon">😈</span>
          <span className="title">AI吐槽推荐</span>
          <span className="desc">被调侃着推荐</span>
        </button> */}

        {/* 互动系列 */}
        {/* <button className="feature-btn" onClick={() => navigate('/personality')}>
          <span className="icon">🧠</span>
          <span className="title">奶茶人格测试</span>
          <span className="desc">你是哪种奶茶人</span>
        </button> */}

        <button className="feature-btn" onClick={() => navigate('/custom')}>
          <span className="icon">🧪</span>
          <span className="title">自制奶茶</span>
          <span className="desc">DIY你的完美搭配</span>
        </button>

        {/* 娱乐系列 - 新增功能 */}
        <button className="feature-btn highlight" onClick={() => navigate('/game')}>
          <span className="icon">🎮</span>
          <span className="title">游戏中心</span>
          <span className="desc">等餐的快乐系统</span>
          <span className="badge">✨ 新功能</span>
        </button>

        {/* <button className="feature-btn highlight" onClick={() => navigate('/mood')}>
          <span className="icon">💙</span>
          <span className="title">情绪抚慰室</span>
          <span className="desc">温暖的心灵港湾</span>
          <span className="badge">✨ 新功能</span>
        </button> */}

        {/* 社交系列 */}
        {/* <button className="feature-btn" onClick={() => navigate('/duo')}>
          <span className="icon">❤️</span>
          <span className="title">双人模式</span>
          <span className="desc">一起更好玩</span>
        </button> */}

        {/* 商城 */}
        {/* <button className="feature-btn" onClick={() => navigate('/products')}>
          <span className="icon">🛒</span>
          <span className="title">购物车</span>
          <span className="desc">直接点餐</span>
        </button> */}
      </div>

      <footer className="home-footer">
        <p>扫码开始体验</p>
      </footer>
    </div>
  )
}
