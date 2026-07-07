import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'emerald'
  })
  
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('app-mode') || 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Handle dark mode class
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Handle theme dataset
    if (theme === 'emerald') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }

    localStorage.setItem('app-theme', theme)
    localStorage.setItem('app-mode', mode)
  }, [theme, mode])

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, toggleMode }}>
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
