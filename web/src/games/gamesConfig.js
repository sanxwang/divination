/**
 * 游戏配置和管理
 * 
 * 集中管理所有游戏的配置信息
 * 便于扩展和维护
 */

import ClumsyBirdGame from './ClumsyBirdGame'

export const GAMES_CONFIG = {
  'clumsy-bird': {
    id: 'clumsy-bird',
    name: 'Clumsy Bird',
    category: 'quick',
    icon: '🦆',
    description: '手指不听使唤的快乐',
    duration: '30秒-2分钟/局',
    status: 'released',
    type: 'iframe',
    url: '/games/clumsy-bird/index.html',
    component: ClumsyBirdGame
  },
  'flappy': {
    id: 'flappy',
    name: 'Flappy Bird',
    category: 'quick',
    icon: '🕊️',
    description: '一秒懂，一秒死，超上瘾',
    duration: '30秒-2分钟/局',
    status: 'coming-soon',
    type: 'iframe',
    url: '/games/flappy/index.html'
  },
  '2048': {
    id: '2048',
    name: '2048',
    category: 'puzzle',
    icon: '🧩',
    description: '无限可玩的数字合并',
    duration: '5-10分钟/局',
    status: 'coming-soon',
    type: 'iframe'
  },
  'hextris': {
    id: 'hextris',
    name: 'Hextris',
    category: 'puzzle',
    icon: '⬡',
    description: '六边形俄罗斯方块',
    duration: '5-15分钟/局',
    status: 'coming-soon',
    type: 'iframe'
  },
  'bubble': {
    id: 'bubble',
    name: 'Bubble Shooter',
    category: 'relax',
    icon: '🫧',
    description: '爽感强，无需思考',
    duration: '10-20分钟/局',
    status: 'coming-soon',
    type: 'iframe'
  },
  'fruitninja': {
    id: 'fruitninja',
    name: 'Fruit Ninja',
    category: 'relax',
    icon: '🍎',
    description: '切水果的快乐',
    duration: '2-5分钟/局',
    status: 'coming-soon',
    type: 'iframe'
  },
  'tank': {
    id: 'tank',
    name: 'Tank Trouble',
    category: 'multiplayer',
    icon: '🎯',
    description: '情侣对喷的爆点💥',
    duration: '3-5分钟/局',
    status: 'coming-soon',
    type: 'iframe'
  },
  'random-basket': {
    id: 'random-basket',
    name: 'Basket Random',
    category: 'multiplayer',
    icon: '🏀',
    description: '随机疯狂篮球赛',
    duration: '2-3分钟/局',
    status: 'coming-soon',
    type: 'iframe'
  },
  'leaderboard': {
    id: 'leaderboard',
    name: '店内排行榜',
    category: 'multiplayer',
    icon: '🏆',
    description: '今日第一名是谁？',
    duration: '实时更新',
    status: 'coming-soon',
    type: 'component'
  }
}

export const GAMES_LIST = Object.values(GAMES_CONFIG)

export const CATEGORIES = [
  { id: 'all', name: '全部', icon: '🎮' },
  { id: 'quick', name: '手残快乐器', icon: '⚡' },
  { id: 'puzzle', name: '脑子爽一下', icon: '🧠' },
  { id: 'relax', name: '解压杀时间', icon: '😌' },
  { id: 'multiplayer', name: '双人互动', icon: '👥' }
]

export function filterGamesByCategory(category) {
  if (category === 'all') {
    return GAMES_LIST
  }
  return GAMES_LIST.filter(game => game.category === category)
}

export function getGameConfig(gameId) {
  return GAMES_CONFIG[gameId]
}
