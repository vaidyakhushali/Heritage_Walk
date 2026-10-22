import { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {}
})

const darkTheme = {
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {}
}

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  return (
    <ThemeContext.Provider value={darkTheme}>
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
