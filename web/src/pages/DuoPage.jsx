import React from 'react'

/**
 * 双人模式页面
 * 
 * 功能规划：
 * - 两个人各自做一个选择（占卜/测试/游戏等）
 * - 对比两个人的结果，显示"配对度"
 * - 适合情侣、朋友一起互动
 * - 可以玩双人对战游戏
 */
export default function DuoPage() {
  return (
    <div className="feature-page">
      <div className="page-header">
        <h1>❤️ 双人模式</h1>
        <p className="tagline">一起更好玩</p>
      </div>

      <div className="feature-content">
        <div className="feature-placeholder">
          <div className="icon">❤️</div>
          <h2>双人互动系统</h2>
          <p>邀请朋友一起参加，看看你们的配对度有多高~ 游戏PK、占卜对比都很有意思！</p>
          
          <button className="action-btn">生成游戏码邀请朋友</button>
          
          <div className="feature-list">
            <h3>功能规划：</h3>
            <ul>
              <li>🔗 游戏码邀请机制</li>
              <li>🎮 双人对战游戏模式</li>
              <li>🔮 双人占卜对比</li>
              <li>👥 性格测试配对度分析</li>
              <li>💕 配对指数和建议</li>
              <li>📊 对战记录和排行榜</li>
              <li>📸 合照分享功能</li>
              <li>🎁 双人互动奖励</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
