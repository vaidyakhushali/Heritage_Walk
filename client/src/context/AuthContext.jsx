import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('hw_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        logout()
      }
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Login failed')
    
    localStorage.setItem('hw_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const register = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Registration failed')
    
    localStorage.setItem('hw_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('hw_token')
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (updates) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Update failed')
    setUser(data.user)
    return data
  }

  const toggleWishlist = async (siteId) => {
    const res = await fetch(`/api/auth/wishlist/${siteId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Failed')
    setUser(prev => ({ ...prev, wishlist: data.wishlist }))
    return data
  }

  const isWishlisted = (siteId) => {
    if (!user || !user.wishlist) return false
    return user.wishlist.some(w => (typeof w === 'string' ? w : w._id) === siteId)
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, register, logout,
      updateProfile, toggleWishlist, isWishlisted, fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
