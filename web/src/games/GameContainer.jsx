/**
 * 游戏容器组件
 * 
 * 用于统一管理所有游戏的加载和展示
 * 支持多种游戏类型：
 * - iframe: 通过 iframe 嵌入外部游戏
 * - component: React 组件游戏
 */

import React, { useState, useEffect } from 'react'

export default function GameContainer({ 
  gameId, 
  gameName, 
  gameType = 'iframe',
  gameUrl,
  component: GameComponent,
  onClose
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (error) {
    return (
      <div className="game-container error">
        <div className="error-content">
          <h2>游戏加载失败</h2>
          <p>{error}</p>
          <button onClick={onClose}>返回游戏中心</button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="close-btn" onClick={onClose}>← 返回</button>
        <h2>{gameName}</h2>
        <div></div>
      </div>
      
      <div className="game-content">
        {isLoading && gameType === 'iframe' && (
          <div className="loading">
            <p>🎮 游戏加载中...</p>
          </div>
        )}

        {gameType === 'iframe' && gameUrl && (
          <iframe
            src={gameUrl}
            title={gameName}
            className="game-iframe"
            onLoad={() => setIsLoading(false)}
            onError={() => setError('iframe 加载失败')}
          />
        )}

        {gameType === 'component' && GameComponent && (
          <GameComponent />
        )}
      </div>
    </div>
  )
}
