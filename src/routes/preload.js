/**
 * Page chunks. Each loader is reused by React.lazy AND by preloadRoute(), so hovering a
 * link (or idle time) downloads the page code before the click — navigation feels instant.
 */
export const pages = {
  Home: () => import('@/pages/Home'),
  Products: () => import('@/pages/Products'),
  ProductDetail: () => import('@/pages/ProductDetail'),
  About: () => import('@/pages/About'),
  Contact: () => import('@/pages/Contact'),
  Dealer: () => import('@/pages/Dealer'),
  ComingSoon: () => import('@/pages/ComingSoon'),
  Cart: () => import('@/pages/Cart'),
  Wishlist: () => import('@/pages/Wishlist'),
  Checkout: () => import('@/pages/Checkout'),
  Profile: () => import('@/pages/Profile'),
  BulkOrder: () => import('@/pages/BulkOrder'),
  Blog: () => import('@/pages/Blog'),
  Gallery: () => import('@/pages/Gallery'),
  Login: () => import('@/pages/Login'),
  Register: () => import('@/pages/Register'),
  OrderDetail: () => import('@/pages/OrderDetail'),
}

/** path pattern → page chunk (first match wins) */
const PRELOAD_MAP = [
  [/^\/$/, 'Home'],
  [/^\/products\/?$/, 'Products'],
  [/^\/products\/[^/]+\/?$/, 'ProductDetail'],
  [/^\/about\/?$/, 'About'],
  [/^\/contact\/?$/, 'Contact'],
  [/^\/dealer\/?$/, 'Dealer'],
  [/^\/cart\/?$/, 'Cart'],
  [/^\/wishlist\/?$/, 'Wishlist'],
  [/^\/checkout\/?$/, 'Checkout'],
  [/^\/profile\/?$/, 'Profile'],
  [/^\/orders\/[^/]+\/?$/, 'OrderDetail'],
  [/^\/login\/?$/, 'Login'],
  [/^\/register\/?$/, 'Register'],
  [/^\/bulk-order\/?$/, 'BulkOrder'],
  [/^\/blog\/?$/, 'Blog'],
  [/^\/gallery\/?$/, 'Gallery'],
]
const preloaded = new Set()

/** Start downloading the page chunk for `pathname` (no-op if unknown or already loading). */
export function preloadRoute(pathname) {
  const hit = PRELOAD_MAP.find(([re]) => re.test(pathname))
  if (!hit || preloaded.has(hit[1])) return
  preloaded.add(hit[1])
  pages[hit[1]]().catch(() => preloaded.delete(hit[1])) // allow retry if offline
}

