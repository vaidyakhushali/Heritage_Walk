import { API_URL } from '../config/api'

export const authService = {
  async getProfile(token) {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Unauthorized')
    return res.json()
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    let data
    try {
      data = await res.json()
    } catch {
      throw new Error('Server returned an invalid response')
    }

    if (!res.ok) throw new Error(data.error?.message || 'Login failed')
    return data
  },

  async register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    let data
    try {
      data = await res.json()
    } catch {
      throw new Error('Server returned an invalid response')
    }

    if (!res.ok) throw new Error(data.error?.message || 'Registration failed')
    return data
  },

  async updateProfile(updates, token) {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    })

    let data
    try {
      data = await res.json()
    } catch {
      throw new Error('Server returned an invalid response')
    }

    if (!res.ok) throw new Error(data.error?.message || 'Update failed')
    return data
  },

  async toggleWishlist(siteId, token) {
    const res = await fetch(`${API_URL}/auth/wishlist/${siteId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })

    let data
    try {
      data = await res.json()
    } catch {
      throw new Error('Server returned an invalid response')
    }

    if (!res.ok) throw new Error(data.error?.message || 'Failed to update wishlist')
    return data
  }
}

