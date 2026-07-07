import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Palette } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/utils/cn'

const themes = [
  { id: 'emerald', name: 'Emerald', color: '#1F9355' },
  { id: 'blue', name: 'Ocean', color: '#2563eb' },
  { id: 'purple', name: 'Amethyst', color: '#9333ea' },
  { id: 'orange', name: 'Sunset', color: '#f97316' },
]

export default function ThemeSelector() {
  const { theme, setTheme, mode, toggleMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const currentIndex = themes.findIndex(t => t.id === theme)
      const nextIndex = (currentIndex + 1) % themes.length
      setTheme(themes[nextIndex].id)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const currentIndex = themes.findIndex(t => t.id === theme)
      const prevIndex = (currentIndex - 1 + themes.length) % themes.length
      setTheme(themes[prevIndex].id)
    }
  }, [isOpen, theme, setTheme])

  return (
    <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-main shadow-sm ring-1 ring-border-subtle transition-all duration-200 hover:bg-brand-primary-light hover:text-brand-primary"
        aria-label="Theme Settings"
      >
        <Palette className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border-subtle bg-surface p-4 shadow-premium z-50"
            role="menu"
          >
            <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-4">
              <span className="text-sm font-semibold text-main">Dark Mode</span>
              <button
                type="button"
                onClick={toggleMode}
                role="switch"
                aria-checked={mode === 'dark'}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                  mode === 'dark' ? 'bg-brand-primary' : 'bg-muted/30'
                )}
              >
                <span className="sr-only">Toggle Dark Mode</span>
                <span
                  className={cn(
                    "inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white transition-transform duration-200",
                    mode === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  )}
                >
                  {mode === 'dark' ? (
                    <Moon className="h-2.5 w-2.5 text-brand-primary" />
                  ) : (
                    <Sun className="h-2.5 w-2.5 text-muted" />
                  )}
                </span>
              </button>
            </div>

            <div>
              <span className="mb-3 block text-sm font-semibold text-main">Color Theme</span>
              <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Color theme">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    role="radio"
                    aria-checked={theme === t.id}
                    aria-label={`${t.name} theme`}
                    className={cn(
                      "group flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition-all duration-200 hover:bg-muted/10",
                      theme === t.id && "bg-muted/10"
                    )}
                  >
                    <span
                      className={cn(
                        "h-6 w-6 rounded-full shadow-sm ring-2 ring-offset-2 transition-all duration-200 ring-offset-surface",
                        theme === t.id ? "ring-brand-primary scale-110" : "ring-transparent group-hover:scale-110"
                      )}
                      style={{ backgroundColor: t.color }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
