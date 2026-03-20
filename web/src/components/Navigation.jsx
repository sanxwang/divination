import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * 全局导航组件
 * 支持快速返回首页、查看当前位置、以及模型切换
 */
export default function Navigation() {
  const location = useLocation()
  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem('selectedModel') || 'deepseek'
  )
  const [models, setModels] = useState([])

  // 加载可用模型
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const resp = await fetch('http://localhost:3000/api/models')
        const data = await resp.json()
        if (data.ok && data.models.length > 0) {
          setModels(data.models)
        } else {
          // 如果后端不可用，使用默认模型列表
          setModels([
            { id: 'deepseek', name: 'DeepSeek', isDefault: true },
            { id: 'mimo', name: 'Xiaomi MiMo', isDefault: false }
          ])
        }
      } catch (error) {
        console.error('Failed to load models:', error)
        // 默认模型列表
        setModels([
          { id: 'deepseek', name: 'DeepSeek', isDefault: true },
          { id: 'mimo', name: 'Xiaomi MiMo', isDefault: false }
        ])
      }
    }

    fetchModels()
  }, [])

  const handleToggleModel = () => {
    if (models.length < 2) return
    // 在可用模型之间切换
    const availableModels = models.filter(m => m.id !== 'openai') // 排除不可用的模型
    const currentIndex = availableModels.findIndex(m => m.id === selectedModel)
    const nextIndex = (currentIndex + 1) % availableModels.length
    const nextModel = availableModels[nextIndex].id
    
    setSelectedModel(nextModel)
    localStorage.setItem('selectedModel', nextModel)
  }

  const isHome = location.pathname === '/'
  const isDeepSeek = selectedModel === 'deepseek'
  const model1 = models.find(m => m.id === 'deepseek')?.name || 'DeepSeek'
  const model2 = 'MiMo'  // 显示简短的名称

  return (
    <nav className="global-nav">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '20px' }}>
        {/* 返回首页按钮 */}
        {!isHome && (
          <Link to="/" className="nav-home-btn">
            ← 首页
          </Link>
        )}
        {isHome && <div style={{ width: '60px' }} />}
        
        {/* 模型切换开关 */}
        {models.length > 1 && (
          <button
            onClick={handleToggleModel}
            className={`model-switch ${isDeepSeek ? 'switched-off' : 'switched-on'}`}
            title="切换模型"
            aria-label="切换模型"
          >
            <span className="switch-text">{isDeepSeek ? model1 : model2}</span>
            <span className="switch-thumb"></span>
          </button>
        )}

        {/* 面包屑 */}
        {!isHome && (
          <div style={{
            fontSize: '12px',
            color: '#999',
            flex: 1,
            textAlign: 'right'
          }}>
            {location.pathname}
          </div>
        )}
      </div>
    </nav>
  )
}
