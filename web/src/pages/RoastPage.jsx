import React from 'react'

/**
 * AI吐槽推荐页面
 * 
 * 功能规划：
 * - AI根据你的信息，用调侃的语气推荐奶茶
 * - 不同的AI人设（毒舌、温柔、学霸等）
 * - 记录推荐理由，展示AI的"吐槽语录"
 * - 支持重新生成推荐
 */
export default function RoastPage() {
  return (
    <div className="feature-page">
      <div className="page-header">
        <h1>😈 AI吐槽推荐</h1>
        <p className="tagline">被调侃着推荐奶茶</p>
      </div>

      <div className="feature-content">
        <div className="feature-placeholder">
          <div className="icon">😈</div>
          <h2>毒舌AI助手</h2>
          <p>AI会用最扎心的语言告诉你该喝什么~ 不喜欢还可以换个AI人设！</p>
          
          <button className="action-btn">听AI吐槽我一次</button>
          
          <div className="feature-list">
            <h3>功能规划：</h3>
            <ul>
              <li>🤖 多种AI人设（毒舌、温柔、学霸、潮人）</li>
              <li>💬 动态吐槽文案生成</li>
              <li>⭐ 用户推荐评分反馈</li>
              <li>📖 吐槽语录集合（可分享）</li>
              <li>🎭 AI角色切换UI</li>
              <li>💾 保存喜欢的推荐理由</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
