import { API_URL } from '../config/api'

export const siteService = {
  async getSites(params = {}) {
    const query = new URLSearchParams(params).toString()
    const url = `${API_URL}/sites${query ? `?${query}` : ''}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch heritage sites')
    return res.json()
  },

  async getFeaturedSites() {
    const res = await fetch(`${API_URL}/sites/featured`)
    if (!res.ok) throw new Error('Failed to fetch featured sites')
    return res.json()
  },

  async getSiteTypes() {
    const res = await fetch(`${API_URL}/sites/types`)
    if (!res.ok) throw new Error('Failed to fetch site types')
    return res.json()
  },

  async getSiteBySlug(slug) {
    const res = await fetch(`${API_URL}/sites/${encodeURIComponent(slug)}`)
    if (!res.ok) {
      if (res.status === 404) throw new Error('Heritage site not found')
      throw new Error('Failed to fetch site details')
    }
    return res.json()
  }
}

