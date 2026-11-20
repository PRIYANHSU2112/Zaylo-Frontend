import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useHome } from '@/hooks/useHome'

/**
 * Scroll to `#hash` targets (e.g. /#bundles, /#categories) once the section has
 * rendered from API data; otherwise scroll to top on route change.
 */
function useScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return undefined
    }
    let tries = 0
    const timer = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      tries += 1
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        clearInterval(timer)
      } else if (tries > 40) {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [pathname, hash])
}

export default function MainLayout() {
  // Warm shared caches for Footer / Contact / SEO / Home sections
  useSiteSettings()
  useHome()
  useScrollToHash()

  return (
    <div className="flex min-h-svh flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
