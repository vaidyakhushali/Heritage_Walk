import { API_URL } from '../config/api'

export const contributionService = {
  async getContributions(params = {}, token = null) {
    const query = new URLSearchParams(params).toString()
    const url = `${API_URL}/contributions${query ? `?${query}` : ''}`
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error('Failed to load contributions')
    return res.json()
  },

  async getUserContributions(token) {
    const res = await fetch(`${API_URL}/contributions/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to load user contributions')
    return res.json()
  },

  async submitContribution(formData, token = null) {
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_URL}/contributions`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!res.ok) {
      let message = 'Submission failed'
      try {
        const data = await res.json()
        message = data.error?.message || message
      } catch {
        // Non-JSON response
      }
      throw new Error(message)
    }

    return res.json()
  },

  async reviewContribution(id, { status, reviewNote }, token) {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_URL}/contributions/${id}/review`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status, reviewNote })
    })

    if (!res.ok) {
      let message = 'Review update failed'
      try {
        const data = await res.json()
        message = data.error?.message || message
      } catch {}
      throw new Error(message)
    }

    return res.json()
  },

  async deleteContribution(id, token) {
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_URL}/contributions/${id}`, {
      method: 'DELETE',
      headers
    })

    if (!res.ok) throw new Error('Failed to delete contribution')
    return res.json()
  }
}

