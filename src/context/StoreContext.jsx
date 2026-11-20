import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

const StoreContext = createContext(null)
const CART_KEY = 'zaylo-cart-v2'
const WISH_KEY = 'zaylo-wishlist-v2'

// Legacy keys from the old static-data cart (numeric ids, fake prices) — discard.
localStorage.removeItem('zaylo-cart')
localStorage.removeItem('zaylo-wishlist')

const readLocal = (key) => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

/** Display snapshot of an API product. Prices shown are always re-validated by the server quote. */
const snapshot = (p) => ({
  id: String(p.id),
  slug: p.slug,
  name: p.name,
  image: p.image || '',
  price: p.price,
  mrp: p.mrp,
  weight: p.weight || '',
  stock: p.stock,
  kind: p.kind === 'bundle' ? 'bundle' : 'product',
  ...(p.kind === 'bundle'
    ? { components: p.components || (p.items || []).map((i) => ({ name: i.name, quantity: 1 })) }
    : {}),
})

const fromServerCart = (data) =>
  (data?.items || []).map((i) => ({ ...snapshot(i.product), quantity: i.quantity }))

/** Cart → API lines. Bundles (packs) are sent as `bundleId`; the server prices both. */
const toLines = (cart) =>
  cart.map((i) =>
    i.kind === 'bundle' ? { bundleId: i.id, quantity: i.quantity } : { productId: i.id, quantity: i.quantity },
  )

export function StoreProvider({ children }) {
  const { isAuthenticated, status } = useAuth()
  const toast = useToast()
  const [cart, setCart] = useState(() => readLocal(CART_KEY))
  const [wishlist, setWishlist] = useState(() => readLocal(WISH_KEY))
  const [syncing, setSyncing] = useState(false)
  const syncTimer = useRef(null)
  const latestCart = useRef(cart)
  latestCart.current = cart

  // Guest persistence
  useEffect(() => {
    if (status === 'guest') localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart, status])
  useEffect(() => {
    if (status === 'guest') localStorage.setItem(WISH_KEY, JSON.stringify(wishlist))
  }, [wishlist, status])

  // On login: merge guest cart/wishlist into the account, then use server state.
  useEffect(() => {
    if (!isAuthenticated) return undefined
    let alive = true
    const guestCart = readLocal(CART_KEY)
    const guestWish = readLocal(WISH_KEY)
    setSyncing(true)
    Promise.all([
      guestCart.length ? api.post('/me/cart/merge', { items: toLines(guestCart) }) : api.get('/me/cart'),
      guestWish.length
        ? api.post('/me/wishlist/merge', { productIds: guestWish.map((w) => w.id) })
        : api.get('/me/wishlist'),
    ])
      .then(([serverCart, serverWish]) => {
        if (!alive) return
        localStorage.removeItem(CART_KEY)
        localStorage.removeItem(WISH_KEY)
        setCart(fromServerCart(serverCart))
        setWishlist(serverWish.map(snapshot))
      })
      .catch((err) => alive && toast.error(err.message))
      .finally(() => alive && setSyncing(false))
    return () => {
      alive = false
    }
  }, [isAuthenticated, toast])

  // On logout: start from an empty guest cart.
  const prevAuth = useRef(isAuthenticated)
  useEffect(() => {
    if (prevAuth.current && !isAuthenticated && status === 'guest') {
      setCart([])
      setWishlist([])
    }
    prevAuth.current = isAuthenticated
  }, [isAuthenticated, status])

  /** Debounced full-cart sync for signed-in users; server response is the source of truth. */
  const scheduleSync = useCallback(() => {
    if (!isAuthenticated) return
    clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(async () => {
      try {
        const data = await api.put('/me/cart', { items: toLines(latestCart.current) })
        setCart(fromServerCart(data))
      } catch (err) {
        toast.error(err.message)
      }
    }, 350)
  }, [isAuthenticated, toast])

  useEffect(() => () => clearTimeout(syncTimer.current), [])

  const addToCart = useCallback(
    (product, quantity = 1) => {
      const id = String(product.id)
      setCart((prev) => {
        const existing = prev.find((i) => i.id === id)
        if (existing) return prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i))
        return [...prev, { ...snapshot(product), quantity }]
      })
      scheduleSync()
    },
    [scheduleSync],
  )

  const removeFromCart = useCallback(
    (id) => {
      setCart((prev) => prev.filter((i) => i.id !== String(id)))
      scheduleSync()
    },
    [scheduleSync],
  )

  const updateCartItem = useCallback(
    (id, quantity) => {
      if (quantity < 1) return removeFromCart(id)
      setCart((prev) => prev.map((i) => (i.id === String(id) ? { ...i, quantity: Math.min(99, quantity) } : i)))
      scheduleSync()
      return undefined
    },
    [removeFromCart, scheduleSync],
  )

  /** Local reset after an order (server already cleared the account cart). */
  const clearCart = useCallback(() => {
    setCart([])
    localStorage.removeItem(CART_KEY)
  }, [])

  const toggleWishlist = useCallback(
    async (product) => {
      const id = String(product.id)
      const has = wishlist.some((w) => w.id === id)
      setWishlist((prev) => (has ? prev.filter((w) => w.id !== id) : [...prev, snapshot(product)]))
      if (!isAuthenticated) return
      try {
        const data = has ? await api.delete(`/me/wishlist/${id}`) : await api.post(`/me/wishlist/${id}`)
        setWishlist(data.map(snapshot))
      } catch (err) {
        setWishlist((prev) => (has ? [...prev, snapshot(product)] : prev.filter((w) => w.id !== id)))
        toast.error(err.message)
      }
    },
    [wishlist, isAuthenticated, toast],
  )

  const isInWishlist = useCallback((id) => wishlist.some((w) => w.id === String(id)), [wishlist])

  const cartCount = cart.reduce((n, i) => n + i.quantity, 0)
  const cartTotal = cart.reduce((n, i) => n + (Number(i.price) || 0) * i.quantity, 0)

  const value = useMemo(
    () => ({
      cart,
      cartLines: toLines(cart),
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
      syncing,
    }),
    [cart, addToCart, updateCartItem, removeFromCart, clearCart, cartTotal, cartCount, wishlist, toggleWishlist, isInWishlist, syncing],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
