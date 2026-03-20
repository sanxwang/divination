import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { callDivination } from '../api'

const ZODIAC_SIGNS = [
  { name: '白羊', emoji: '♈', value: 'aries' },
  { name: '金牛', emoji: '♉', value: 'taurus' },
  { name: '双子', emoji: '♊', value: 'gemini' },
  { name: '巨蟹', emoji: '♋', value: 'cancer' },
  { name: '狮子', emoji: '♌', value: 'leo' },
  { name: '处女', emoji: '♍', value: 'virgo' },
  { name: '天秤', emoji: '♎', value: 'libra' },
  { name: '天蝎', emoji: '♏', value: 'scorpio' },
  { name: '射手', emoji: '♐', value: 'sagittarius' },
  { name: '摩羯', emoji: '♑', value: 'capricorn' },
  { name: '水瓶', emoji: '♒', value: 'aquarius' },
  { name: '双鱼', emoji: '♓', value: 'pisces' }
]

export default function DivinationPage() {
  const navigate = useNavigate()
  const [selectedZodiac, setSelectedZodiac] = useState(null)
  const [zodiacName, setZodiacName] = useState('')
  const [step, setStep] = useState('zodiac')
  const [mysticContext, setMysticContext] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showConditions, setShowConditions] = useState(false)

  const handleZodiacSelect = async (zodiac, name) => {
    setSelectedZodiac(zodiac)
    setZodiacName(name)
    setStep('result')  // 立即跳转到结果页
    setLoading(true)
    setError(null)
    try {
      // 获取真实的玄学条件
      const contextResp = await fetch('http://localhost:3000/api/divination-context')
      const contextData = await contextResp.json()

      if (contextData.ok && contextData.context) {
        const context = contextData.context
        setMysticContext(context)

        // 立即开始占卜
        const contextTags = [
          name,
          '今日运势',
          context.date,
          context.dayOfWeek,
          context.moonPhase.name,
          context.timePhase.name,
          context.season.name,
          context.element.name
        ].filter(Boolean)

        const payload = {
          userId: 'user_' + Math.random().toString(36).slice(2),
          contextTags,
          candidateIds: ['tea_001', 'tea_002', 'tea_003', 'tea_004', 'tea_005']
        }

        const divResp = await fetch('http://localhost:3000/api/prompt/divination', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-DeepSeek-Key': 'sk-3e8f11c6cde74a6da9ce261d31dd69c9'
          },
          body: JSON.stringify(payload)
        })

        const divData = await divResp.json()
        if (divData.ok && divData.parsed) {
          setResult({
            headline: divData.parsed.headline,
            mystic_reason: divData.parsed.mystic_reason,
            recommendation: divData.parsed.recommendation,
            cta: divData.parsed.cta,
            share_text: divData.parsed.share_text
          })
          setStep('result')
        } else {
          setError(divData.error || '占卜失败')
        }
      } else {
        setError('无法获取占卜条件')
      }
    } catch (err) {
      setError('出错了: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="divination-page">
      {step === 'zodiac' && (
        <div className="divination-container">
          <h2 className="divination-title">🔮 今日奶茶占卜</h2>
          <p className="divination-subtitle">选择你的星座，揭晓命中注定的那杯</p>

          <div className="zodiac-grid">
            {ZODIAC_SIGNS.map((sign) => (
              <button
                key={sign.value}
                className="zodiac-btn"
                onClick={() => handleZodiacSelect(sign.value, sign.name)}
                disabled={loading}
              >
                <span className="zodiac-emoji">{sign.emoji}</span>
                <span className="zodiac-name">{sign.name}</span>
              </button>
            ))}
          </div>

          {error && <p className="error">{error}</p>}
        </div>
      )}

      {step === 'result' && (
        <div className="divination-result">
          {loading || !result ? (
            // Loading state
            <>
              <div className="loading-wrapper">
                <div className="crystal-ball">
                  <div className="orb"></div>
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                </div>
                <p className="loading-text">水晶球正在感应你的命运...</p>
              </div>
              {error && <p className="error">{error}</p>}
            </>
          ) : (
            // Result content
            <>
              <div className="result-header">
                {/* <span className="result-emoji">🌙</span> */}
                <h2>今日奶茶占卜</h2>
              </div>

              <div className="recommendation-card">
                <div className="drink-name">🍹 {result.recommendation.name}</div>
                <div className="drink-reason">{result.recommendation.reason}</div>
                <div className="drink-tags">
                  {result.recommendation.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <p className="share-text">
                <span className="quote">「</span>
                {result.share_text}
                <span className="quote">」</span>
              </p>

              {/* 折叠的占卜条件框 */}
              <div className="conditions-collapse">
                <button
                  className="collapse-trigger"
                  onClick={() => setShowConditions(!showConditions)}
                >
                  <span className="collapse-icon">{showConditions ? '▼' : '▶'}</span>
                  <span className="collapse-text">🔮 查看本次占卜条件</span>
                </button>

                {showConditions && mysticContext && (
                  <div className="conditions-details">
                    <div className="condition-row">
                      <span className="condition-emoji">{mysticContext.moonPhase.emoji}</span>
                      <div className="condition-text">
                        <div className="condition-title">{mysticContext.moonPhase.name}</div>
                      </div>
                    </div>

                    <div className="condition-row">
                      <span className="condition-emoji">{mysticContext.timePhase.emoji}</span>
                      <div className="condition-text">
                        <div className="condition-title">{mysticContext.timePhase.name}</div>
                      </div>
                    </div>

                    <div className="condition-row">
                      <span className="condition-emoji">{mysticContext.season.emoji}</span>
                      <div className="condition-text">
                        <div className="condition-title">{mysticContext.season.name}</div>
                      </div>
                    </div>

                    <div className="condition-row">
                      <span className="condition-emoji">{mysticContext.element.emoji}</span>
                      <div className="condition-text">
                        <div className="condition-title">{mysticContext.element.name}</div>
                      </div>
                    </div>

                    <div className="condition-row">
                      <span className="condition-emoji">📅</span>
                      <div className="condition-text">
                        <div className="condition-title">{mysticContext.date} {mysticContext.dayOfWeek}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="result-actions">
                <button className="btn-cta" disabled={loading}>{result.cta}</button>
                <button className="btn-again" onClick={() => { setResult(null); setStep('zodiac'); setShowConditions(false); }} disabled={loading}>
                  🔄 再占一次
                </button>
                <button className="btn-back" onClick={() => navigate('/')} disabled={loading}>🏠 回首页</button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  )
}
