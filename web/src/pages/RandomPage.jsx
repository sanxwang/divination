import React, { useState, useRef, useEffect } from 'react';

const PRODUCTS = [
  { id: 1, name: '奶香波霸', emoji: '🍵', desc: '浓郁奶香，经典之选' },
  { id: 2, name: '杨枝甘露', emoji: '🥭', desc: '清爽芒果，甜蜜暴击' },
  { id: 3, name: '柠檬绿茶', emoji: '🍃', desc: '清新酸爽，解腻解渴' },
  { id: 4, name: '黑糖珍珠鲜奶', emoji: '🧋', desc: '香甜软糯，快乐加倍' },
  { id: 5, name: '焦糖拿铁', emoji: '☕', desc: '温暖焦香，醇厚丝滑' },
  { id: 6, name: '芋圆鲜奶', emoji: '💜', desc: '软糯香甜，层次丰富' },
  { id: 7, name: '抹茶拿铁', emoji: '🍵', desc: '邂逅清香，回味悠长' },
  { id: 8, name: '草莓鲜奶', emoji: '🍓', desc: '酸甜恰好，粉红少女心' },
  { id: 9, name: '巧克力奶茶', emoji: '🍫', desc: '丝滑醇厚，浓郁享受' },
  { id: 10, name: '荔枝柚子茶', emoji: '🍊', desc: '清爽果香，夏日必备' },
  { id: 11, name: '蜜乳茶', emoji: '🍯', desc: '蜜甜顺滑，温柔细腻' },
  { id: 12, name: '冰淇淋奶茶', emoji: '🍦', desc: '冰爽交融，双重快乐' }
];

// 复制列表以制造足够长的滚动带
const SLOT_ITEMS = [
  ...PRODUCTS,
  ...PRODUCTS,
  ...PRODUCTS,
  ...PRODUCTS,
  ...PRODUCTS
];

export default function RandomPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [translateY, setTranslateY] = useState(0);
  const slotRef = useRef(null);

  // 卡片高度估算(基于我们稍后设置的CSS)
  const ITEM_HEIGHT = 160; 

  const handleStartRandom = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);

    // 回到起始位置的视觉欺骗(瞬间复位到第一组的随机位置然后再转去目标)
    // 保证每次点击都有很长的滚动距离
    const startIdx = Math.floor(Math.random() * PRODUCTS.length);
    setTranslateY(-(startIdx * ITEM_HEIGHT));

    // 使用 setTimeout 让我们有时间在一瞬间复位，然后再触发长滚动
    setTimeout(() => {
      // 落在第四组的某个位置以确保动画时间够长
      const targetGroupOffset = PRODUCTS.length * 3;
      const targetLocalIdx = Math.floor(Math.random() * PRODUCTS.length);
      const finalIdx = targetGroupOffset + targetLocalIdx;
      
      const targetY = -(finalIdx * ITEM_HEIGHT);
      setTranslateY(targetY);

      // 动画时间
      setTimeout(() => {
        setIsSpinning(false);
        setResult(PRODUCTS[targetLocalIdx]);
      }, 4000); // 必须和 CSS transition 匹配
    }, 50);
  };

  const handleConfirm = () => {
    alert(`已选择：${result.name} ${result.emoji}`);
  };

  return (
    <div className="random-page">
      <div className="page-header">
        <h1>🎲 命运盲盒</h1>
        <p className="tagline">不知道喝什么？让命运为你决定</p>
      </div>

      <div className="slot-game-container">
        {/* 老虎机的显示区 */}
        <div className="slot-window">
          <div className="slot-highlight-bar" />
          <div 
            className="slot-strip"
            ref={slotRef}
            style={{
              transform: `translateY(${translateY}px)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
            }}
          >
            {SLOT_ITEMS.map((item, idx) => (
              <div key={idx} className="slot-item">
                <span className="slot-emoji">{item.emoji}</span>
                <div className="slot-text-group">
                  <h3>{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部控制 */}
        <div className="slot-controls">
          <button 
            className={`btn-spin ${isSpinning ? 'spinning' : ''}`}
            onClick={handleStartRandom}
            disabled={isSpinning}
          >
            {isSpinning ? '命运抽取中...' : '揭晓命运 🎯'}
          </button>
        </div>

        {/* 结果呈现 */}
        {result && !isSpinning && (
          <div className="random-result-panel show">
            <div className="result-content">
              <div className="result-emoji">{result.emoji}</div>
              <h2>{result.name}</h2>
              <p className="result-desc">{result.desc}</p>
            </div>
            <div className="result-buttons">
              <button className="btn-secondary" onClick={handleStartRandom}>
                再抽一次 🔄
              </button>
              <button className="btn-confirm" onClick={handleConfirm}>
                就喝它了 ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
