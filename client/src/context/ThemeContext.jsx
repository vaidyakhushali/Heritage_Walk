import { createContext, useContext, useState, useEffect } from 'react'

const THEME_STORAGE_KEY = 'heritagewalk-theme'

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {}
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    // 1. Check saved preference in localStorage
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
    // 2. Fallback to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    }
    // 3. Default to Day Mode
    return 'light'
  })

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
  }, [theme])

  // Listen to system preference changes if no manual preference is saved
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (!saved) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const setTheme = (newTheme) => {
    // Smooth transition class
    document.documentElement.classList.add('theme-transitioning')
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {}
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 450)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext

