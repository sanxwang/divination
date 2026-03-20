/**
 * Clumsy Bird 游戏组件
 * 
 * 通过 iframe 嵌入 Clumsy Bird 游戏
 */

import React from 'react'
import GameContainer from './GameContainer'

export default function ClumsyBirdGame({ onClose }) {
  return (
    <GameContainer
      gameId="clumsy-bird"
      gameName="Clumsy Bird"
      gameType="iframe"
      gameUrl="/games/clumsy-bird/index.html"
      onClose={onClose}
    />
  )
}
