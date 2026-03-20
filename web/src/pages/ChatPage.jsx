import React, { useState, useRef, useEffect } from 'react'
import { callChat } from '../api'

function getSelectedModel() {
  return localStorage.getItem('selectedModel') || 'deepseek'
}

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel] = useState(getSelectedModel())
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue('')

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const data = await callChat({
        message: userMessage,
        messageHistory: messages.map((m) => ({
          role: m.role,
          content: m.content
        }))
      }, selectedModel)

      if (data.ok && data.parsed) {
        const assistantMessage = data.parsed.message || '抱歉，没有获取到回复...'
        setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }])
      } else if (data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
      } else {
        console.error('API response error:', data)
        const errorMsg = data.error || data.details?.message || '服务器出错，请稍后重试'
        setMessages((prev) => [...prev, { role: 'assistant', content: `❌ ${errorMsg}` }])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages((prev) => [...prev, { role: 'assistant', content: '❌ 网络连接出错，请检查服务器是否运行' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div>
          <h1>💬 AI 聊天室</h1>
          <p>自由对话，测试模型能力</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>👋 开始聊天吧！</p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              你可以询问关于奶茶、美食、生活建议等任何问题
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
            <div className="message-content">
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <p className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的问题，按 Enter 发送..."
          disabled={loading}
          rows={3}
        />
        <button onClick={handleSendMessage} disabled={loading || !inputValue.trim()}>
          {loading ? '🔄 回复中...' : '📤 发送'}
        </button>
      </div>
    </div>
  )
}
