import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { preloadRoute } from '@/routes/preload'
import { api } from '@/lib/api'

const PRODUCT_PATH = /^\/products\/([^/?#]+)\/?$/

/**
 * Speculative loading on user intent (hover / touch / keyboard focus of a link):
 *  - downloads the target page's code chunk
 *  - for product links, prefetches the product data, so the page opens ready
 * Plus idle-time preloading of the most visited pages after first paint.
 */
export function useNavigationIntent() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const onIntent = (e) => {
      const a = e.target.closest?.('a[href]')
      if (!a) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      preloadRoute(url.pathname)
      const m = url.pathname.match(PRODUCT_PATH)
      if (m) {
        const slug = decodeURIComponent(m[1])
        queryClient.prefetchQuery({
          queryKey: ['product', slug],
          queryFn: () => api.get(`/products/${encodeURIComponent(slug)}`),
          staleTime: 60_000,
        })
      }
    }
    const opts = { capture: true, passive: true }
    document.addEventListener('pointerover', onIntent, opts)
    document.addEventListener('touchstart', onIntent, opts)
    document.addEventListener('focusin', onIntent, opts)

    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500))
    const id = idle(() => ['/products', '/products/x', '/cart', '/about', '/login'].forEach(preloadRoute))

    return () => {
      document.removeEventListener('pointerover', onIntent, opts)
      document.removeEventListener('touchstart', onIntent, opts)
      document.removeEventListener('focusin', onIntent, opts)
      if (window.cancelIdleCallback) window.cancelIdleCallback(id)
    }
  }, [queryClient])
}
