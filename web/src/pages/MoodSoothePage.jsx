import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 情绪抚慰页面
 * 
 * 核心概念：
 * "情绪抚慰型社交黑洞"
 * 
 * 功能规划：
 * 1. 情绪诊断 - 简单选择你的心情
 * 2. AI互动 - 根据心情提供不同的抚慰内容
 *    - 输了游戏 → AI安慰你
 *    - 赢了游戏 → AI狂吹你
 *    - 不开心？ → AI夸你
 * 3. 温暖话语库 - 随机生成/推荐温暖的话
 * 4. 音乐/视觉氛围 - 配合音乐和配色提升体验
 * 5. 分享朋友圈 - 用户可以分享自己的心情转变
 * 
 * 后续开发：
 * - 接入ChatGPT API进行真实对话
 * - 记录用户心情变化趋势
 * - 建立温暖社区（用户互相鼓励）
 * - 音乐推荐系统（根据心情）
 */

const MOODS = [
  {
    id: 'happy',
    emoji: '😊',
    label: '开心',
    description: '今天真不错！',
    color: '#FFD700',
    bgGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    aiResponse: [
      '太棒了！✨ 保持这份好心情哦~',
      '你的笑容就是我的快乐！😄',
      '这才是生活的味道，继续加油！💪'
    ]
  },
  {
    id: 'sad',
    emoji: '😢',
    label: '难受',
    description: '有点心累',
    color: '#87CEEB',
    bgGradient: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
    aiResponse: [
      '没事的，所有不开心都会过去💙',
      '你能撑到现在已经很勇敢了',
      '想喝杯奶茶，让自己开心一点吗？让我们一起奶茶疗愈！🍵'
    ]
  },
  {
    id: 'anxious',
    emoji: '😰',
    label: '焦虑',
    description: '有点紧张',
    color: '#FFA07A',
    bgGradient: 'linear-gradient(135deg, #FFA07A 0%, #FF6347 100%)',
    aiResponse: [
      '深呼吸，你能行的！🌬️',
      '焦虑会过去，你的能力不会',
      '来玩个游戏放松一下？转移压力最有效~🎮'
    ]
  },
  {
    id: 'bored',
    emoji: '😑',
    label: '无聊',
    description: '没有意思',
    color: '#ABC123',
    bgGradient: 'linear-gradient(135deg, #ABC123 0%, #7AB345 100%)',
    aiResponse: [
      '是时候来点新鲜刺激了！⚡',
      '无聊时最该尝试新东西',
      '来玩游戏或看漫人们的故事？这里有很多惊喜~🎲'
    ]
  },
  {
    id: 'angry',
    emoji: '😠',
    label: '生气',
    description: '有点烦躁',
    color: '#FF4500',
    bgGradient: 'linear-gradient(135deg, #FF4500 0%, #DC143C 100%)',
    aiResponse: [
      '生气的你还是很可爱啦😏',
      '发泄一下情绪，比如砸砸游戏~',
      '等等，有人对你不好吗？记得你值得更好的对待💛'
    ]
  },
  {
    id: 'stressed',
    emoji: '😫',
    label: '压力大',
    description: '快被压垮了',
    color: '#8B4513',
    bgGradient: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    aiResponse: [
      '休息一会，你不是超人❤️',
      '试试来玩个解压游戏？或者喝杯奶茶~',
      '记得，世界再大，也有人关心你。我们在这里哦~'
    ]
  }
]

export default function MoodSoothePage() {
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useState(null)
  const [aiResponse, setAiResponse] = useState(null)

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId)
    const mood = MOODS.find(m => m.id === moodId)
    if (mood) {
      // 随机选择一条AI回复
      const response = mood.aiResponse[Math.floor(Math.random() * mood.aiResponse.length)]
      setAiResponse(response)
    }
  }

  const selectedMoodData = MOODS.find(m => m.id === selectedMood)

  return (
    <div className="mood-soothe-page">
      <header className="mood-header">
        <h1>💙 情绪抚慰室</h1>
        <p className="tagline">一个温暖的地方等着你</p>
      </header>

      {!selectedMood ? (
        <>
          {/* 心情选择 */}
          <section className="mood-selection">
            <h2>今天的心情如何？</h2>
            <p className="sub-text">选择最接近你现在的感受 👇</p>
            
            <div className="mood-grid">
              {MOODS.map(mood => (
                <button
                  key={mood.id}
                  className="mood-btn"
                  style={{ background: mood.bgGradient }}
                  onClick={() => handleMoodSelect(mood.id)}
                  title={mood.description}
                >
                  <div className="mood-emoji">{mood.emoji}</div>
                  <div className="mood-label">{mood.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* 功能说明 */}
          <section className="features-intro">
            <h3>✨ 这里能做什么？</h3>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <div>
                  <strong>AI暖话</strong>
                  <p>根据你的心情，AI会给出温暖的回复</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎮</span>
                <div>
                  <strong>转移压力</strong>
                  <p>来玩游戏转移注意力，或者赢了听AI狂吹你</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎵</span>
                <div>
                  <strong>氛围沉浸</strong>
                  <p>配合音乐和配色，让整个体验更温暖</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <div>
                  <strong>分享故事</strong>
                  <p>记录心情变化，分享给朋友你的小确幸</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* 心情详情和AI回复 */}
          <section className="mood-detail" style={{ background: selectedMoodData?.bgGradient }}>
            <div className="mood-content">
              <div className="mood-emoji-large">{selectedMoodData?.emoji}</div>
              <h2>你现在 {selectedMoodData?.label}</h2>
              <p className="mood-desc">{selectedMoodData?.description}</p>
            </div>
          </section>

          {/* AI回复 */}
          {aiResponse && (
            <section className="ai-response">
              <div className="ai-bubble">
                <div className="ai-avatar">🤖</div>
                <div className="ai-message">
                  <p>{aiResponse}</p>
                </div>
              </div>
            </section>
          )}

          {/* 建议行动 */}
          <section className="suggested-actions">
            <h3>建议你...</h3>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => navigate('/game')}>
                <span>🎮</span>
                <span>来玩个游戏</span>
              </button>
              <button className="action-btn">
                <span>🎵</span>
                <span>听舒缓音乐</span>
              </button>
              <button className="action-btn">
                <span>☕</span>
                <span>喝杯奶茶</span>
              </button>
              <button className="action-btn">
                <span>💬</span>
                <span>看社区故事</span>
              </button>
            </div>
          </section>

          {/* 温暖话语库 */}
          <section className="warm-words">
            <h3>💬 温暖话语</h3>
            <div className="words-collection">
              <p>✨ "所有的困难都只是暂时的，你会度过的"</p>
              <p>✨ "不开心的日子也值得被好好对待"</p>
              <p>✨ "你已经比昨天的自己更好了"</p>
              <p>✨ "值得一杯好奶茶的你，值得一切好的东西"</p>
            </div>
          </section>

          {/* 返回按钮 */}
          <div style={{ textAlign: 'center', margin: '20px' }}>
            <button 
              className="primary-btn"
              onClick={() => {
                setSelectedMood(null)
                setAiResponse(null)
              }}
            >
              ← 重新选择心情
            </button>
          </div>
        </>
      )}

      {/* 开发说明 */}
      <section className="dev-section" style={{ fontSize: '12px', margin: '20px', opacity: 0.6 }}>
        <h3>📋 功能规划备注</h3>
        <ul>
          <li>✅ UI框架和心情选择交互</li>
          <li>⏳ 接入真实AI API（OpenAI/Deepseek）进行动态对话</li>
          <li>⏳ 用户心情数据存储和趋势分析</li>
          <li>⏳ 音乐推荐系统集成</li>
          <li>⏳ 社区分享功能（故事墙）</li>
          <li>⏳ 用户互相鼓励的反馈机制</li>
          <li>⏳ 长期心理援助资源链接</li>
        </ul>
      </section>
    </div>
  )
}
