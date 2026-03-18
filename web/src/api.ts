const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface DivinationResponse {
  ok: boolean
  parsed?: {
    type: string
    headline: string
    mystic_reason: string
    recommendation: {
      id: string
      name: string
      reason: string
      tags: string[]
    }
    cta: string
    share_text: string
  }
  error?: string
}

export async function callDivination(payload: any): Promise<DivinationResponse> {
  const resp = await fetch(`${API_BASE}/api/prompt/divination`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-DeepSeek-Key': 'sk-3e8f11c6cde74a6da9ce261d31dd69c9'
    },
    body: JSON.stringify(payload)
  })
  return resp.json()
}

export async function getProducts(): Promise<any[]> {
  const resp = await fetch(`${API_BASE}/products`)
  return resp.json()
}
