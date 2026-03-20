import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import DivinationPage from './pages/DivinationPage'
import RandomPage from './pages/RandomPage'
import RoastPage from './pages/RoastPage'
import PersonalityPage from './pages/PersonalityPage'
import CustomPage from './pages/CustomPage'
import GamesPage from './pages/GamesPage'
import MoodSoothePage from './pages/MoodSoothePage'
import DuoPage from './pages/DuoPage'
import ProductsPage from './pages/ProductsPage'
import ChatPage from './pages/ChatPage'

/**
 * 应用主组件
 * 
 * 路由结构：
 * / - 首页
 * /chat - 聊天室
 * /divination - 占卜
 * /random - 随机推荐
 * /roast - AI吐槽
 * /personality - 人格测试
 * /custom - DIY配置
 * /game - 游戏中心
 * /mood - 情绪抚慰
 * /duo - 双人模式
 * /products - 购物车
 */
export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/divination" element={<DivinationPage />} />
        <Route path="/random" element={<RandomPage />} />
        <Route path="/roast" element={<RoastPage />} />
        <Route path="/personality" element={<PersonalityPage />} />
        <Route path="/custom" element={<CustomPage />} />
        <Route path="/game" element={<GamesPage />} />
        <Route path="/mood" element={<MoodSoothePage />} />
        <Route path="/duo" element={<DuoPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
