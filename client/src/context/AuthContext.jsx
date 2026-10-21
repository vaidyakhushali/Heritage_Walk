import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('hw_token'))
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem('hw_token')
    setToken(null)
    setUser(null)
  }, [])

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const data = await authService.getProfile(token)
      setUser(data)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [token, logout])

  useEffect(() => {
    if (token) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [token, fetchProfile])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    localStorage.setItem('hw_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password)
    localStorage.setItem('hw_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const updateProfile = async (updates) => {
    const data = await authService.updateProfile(updates, token)
    setUser(data.user)
    return data
  }

  const toggleWishlist = async (siteId) => {
    const data = await authService.toggleWishlist(siteId, token)
    setUser(prev => ({
      ...prev,
      wishlist: data.wishlist
    }))
    return data
  }

  const isWishlisted = (siteId) => {
    if (!user || !user.wishlist) return false
    return user.wishlist.some(
      w => (typeof w === 'string' ? w : w._id) === siteId
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        toggleWishlist,
        isWishlisted,
        fetchProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}