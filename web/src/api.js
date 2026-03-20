const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Get available LLM models
export async function getAvailableModels() {
  try {
    const resp = await fetch(`${API_BASE}/api/models`)
    return await resp.json()
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return { ok: false, models: [], default: 'deepseek' }
  }
}

// Get the selected model from localStorage
function getSelectedModel() {
  return localStorage.getItem('selectedModel') || null
}

export async function callDivination(payload, model = null) {
  const selectedModel = model || getSelectedModel()
  const url = new URL(`${API_BASE}/api/prompt/divination`)
  if (selectedModel) {
    url.searchParams.append('model', selectedModel)
  }
  
  const resp = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-DeepSeek-Key': 'sk-3e8f11c6cde74a6da9ce261d31dd69c9'
    },
    body: JSON.stringify(payload)
  })
  return resp.json()
}

export async function callRandomRoll(payload, model = null) {
  const selectedModel = model || getSelectedModel()
  const url = new URL(`${API_BASE}/api/prompt/random`)
  if (selectedModel) {
    url.searchParams.append('model', selectedModel)
  }
  
  const resp = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-DeepSeek-Key': 'sk-3e8f11c6cde74a6da9ce261d31dd69c9'
    },
    body: JSON.stringify(payload)
  })
  return resp.json()
}

export async function callCustomBuilder(payload, model = null) {
  const selectedModel = model || getSelectedModel()
  const url = new URL(`${API_BASE}/api/prompt/custom_builder`)
  if (selectedModel) {
    url.searchParams.append('model', selectedModel)
  }
  
  const resp = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-DeepSeek-Key': 'sk-3e8f11c6cde74a6da9ce261d31dd69c9'
    },
    body: JSON.stringify(payload)
  })
  return resp.json()
}

export async function callChat(payload, model = null) {
  const selectedModel = model || getSelectedModel()
  const url = new URL(`${API_BASE}/api/prompt/chat`)
  if (selectedModel) {
    url.searchParams.append('model', selectedModel)
  }
  
  const resp = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-DeepSeek-Key': 'sk-3e8f11c6cde74a6da9ce261d31dd69c9'
    },
    body: JSON.stringify(payload)
  })
  return resp.json()
}

export async function getProducts() {
  const resp = await fetch(`${API_BASE}/products`)
  return resp.json()
}
