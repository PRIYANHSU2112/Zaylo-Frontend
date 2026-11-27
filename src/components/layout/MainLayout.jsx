import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useHome } from '@/hooks/useHome'
import { useNavigationIntent } from '@/hooks/useNavigationIntent'
import RouteProgress from './RouteProgress'
import { Skeleton } from '@/components/shared/States'

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
  useNavigationIntent()

  return (
    <div className="flex min-h-svh flex-col">
      <RouteProgress />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {/* Page chunks load inside the layout: header/footer never disappear */}
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function PageFallback() {
  return (
    <div className="section-container space-y-6 py-10" aria-busy="true" aria-label="Loading page">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
