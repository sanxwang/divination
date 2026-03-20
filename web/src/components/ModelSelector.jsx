import React, { useState, useEffect } from 'react'
import { getAvailableModels } from '../api'

export default function ModelSelector({ selectedModel, onModelChange }) {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getAvailableModels()
        if (data.ok && data.models.length > 0) {
          setModels(data.models)
          // Set default model if none selected
          if (!selectedModel && data.default) {
            onModelChange?.(data.default)
          }
        }
      } catch (error) {
        console.error('Failed to load models:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [selectedModel, onModelChange])

  if (loading || models.length === 0) {
    return null
  }

  if (models.length === 1) {
    return (
      <div style={{ 
        fontSize: '12px', 
        color: '#666',
        padding: '8px 0'
      }}>
        使用: <strong>{models[0].name}</strong>
      </div>
    )
  }

  return (
    <div style={{
      padding: '8px 12px',
      backgroundColor: '#f9f9f9',
      borderRadius: '6px',
      border: '1px solid #eee'
    }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '6px', 
        fontWeight: '500', 
        fontSize: '12px',
        color: '#333'
      }}>
        🤖 AI 模型:
      </label>
      <select
        value={selectedModel || ''}
        onChange={(e) => onModelChange?.(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 8px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '13px',
          fontFamily: 'inherit',
          backgroundColor: '#fff',
          cursor: 'pointer'
        }}
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name} {model.isDefault ? '(默认)' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
