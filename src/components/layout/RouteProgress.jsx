import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'

const SHOW_DELAY = 120 // ms — fast transitions never flash the loader
const MIN_VISIBLE = 350 // ms — once shown, stay long enough to be perceived
const SAFETY = 10_000 // ms — never get stuck if a click was cancelled

/**
 * Page-change loader: a large, thin circular spinner (brand colours) in the centre of the
 * screen, shown ONLY between clicking an internal link and the new page appearing.
 * (React Router keeps the old page during that transition, so nothing else gives feedback.)
 * Data loading is NOT covered here — pages show skeletons for that — and buttons that save
 * (checkout, forms) show their own spinners, so loaders never double up.
 * It never blocks clicks (pointer-events: none).
 */
export default function RouteProgress() {
  const location = useLocation()
  const [navigating, setNavigating] = useState(false)
  const [visible, setVisible] = useState(false)
  const shownAt = useRef(0)
  const timers = useRef({})

  // Internal link clicks start the loader immediately (before the router commits)
  useEffect(() => {
    const onClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href]')
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.getAttribute('aria-disabled') === 'true') return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      setNavigating(true)
      clearTimeout(timers.current.safety)
      timers.current.safety = setTimeout(() => setNavigating(false), SAFETY)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  // New page committed → navigation part is done
  useEffect(() => {
    setNavigating(false)
  }, [location.pathname, location.search])

  const active = navigating

  useEffect(() => {
    const t = timers.current
    if (active) {
      clearTimeout(t.hide)
      t.show = setTimeout(() => {
        if (!shownAt.current) shownAt.current = Date.now()
        setVisible(true)
      }, SHOW_DELAY)
    } else {
      clearTimeout(t.show)
      if (shownAt.current) {
        const wait = Math.max(0, MIN_VISIBLE - (Date.now() - shownAt.current))
        t.hide = setTimeout(() => {
          setVisible(false)
          shownAt.current = 0
        }, wait)
      }
    }
  }, [active])

  useEffect(() => {
    const t = timers.current
    return () => Object.values(t).forEach((id) => clearTimeout(id))
  }, [])

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-200',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div
        className={cn(
          'flex h-24 w-24 items-center justify-center rounded-full bg-surface/90 shadow-premium backdrop-blur-sm transition-transform duration-200',
          visible ? 'scale-100' : 'scale-90',
        )}
      >
        <svg className="h-[4.5rem] w-[4.5rem] animate-spin [animation-duration:0.9s]" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="zaylo-loader-arc" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D71920" />
              <stop offset="0.55" stopColor="#FF7A00" />
              <stop offset="1" stopColor="#FFD400" />
            </linearGradient>
          </defs>
          {/* track */}
          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.6" className="text-border-subtle/70" />
          {/* arc */}
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="url(#zaylo-loader-arc)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="60 101"
          />
        </svg>
        {visible && <span className="sr-only">Loading…</span>}
      </div>
    </div>
  )
}
