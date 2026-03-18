import React, { useState } from 'react'
import HomePage from './pages/HomePage'
import DivinationPage from './pages/DivinationPage'
import ProductsPage from './pages/ProductsPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="app-root">
      {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
      {currentPage === 'divination' && <DivinationPage onBack={() => setCurrentPage('home')} />}
      {currentPage === 'products' && <ProductsPage />}
      
      {/* Placeholder pages for future features */}
      {['random', 'roast', 'personality', 'custom', 'game', 'duo'].includes(currentPage) && (
        <div className="placeholder-page">
          <button onClick={() => setCurrentPage('home')}>← 返回</button>
          <h2>🚧 功能开发中...</h2>
          <p>页面: {currentPage}</p>
        </div>
      )}
    </div>
  )
}
