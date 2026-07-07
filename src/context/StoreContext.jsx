import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { products } from '@/data/products'

const StoreContext = createContext()

export function StoreProvider({ children }) {
  // --- Cart State ---
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('zaylo-cart')
    return saved ? JSON.parse(saved) : []
  })

  // --- Wishlist State ---
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('zaylo-wishlist')
    return saved ? JSON.parse(saved) : []
  })

  // --- User State (Mock) ---
  const [user, setUser] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+91 98765 43210',
    addresses: [
      { id: 1, type: 'Home', address: '123 Palm Grove, Block B, New Delhi, 110001' },
      { id: 2, type: 'Work', address: 'Tech Park, Tower 4, Sector 15, Gurgaon' }
    ]
  })

  // --- Effects for Persistence ---
  useEffect(() => {
    localStorage.setItem('zaylo-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('zaylo-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // --- Cart Actions ---
  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter(item => item.id !== id))
  }, [])

  const updateCartItem = useCallback((id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }, [removeFromCart])

  const clearCart = useCallback(() => setCart([]), [])

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  // --- Wishlist Actions ---
  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) {
        return prev.filter(item => item.id !== product.id)
      }
      return [...prev, product]
    })
  }, [])

  const isInWishlist = useCallback((id) => wishlist.some(item => item.id === id), [wishlist])

  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    wishlist,
    toggleWishlist,
    isInWishlist,
    user
  }), [cart, addToCart, updateCartItem, removeFromCart, clearCart, cartTotal, cartCount, wishlist, toggleWishlist, isInWishlist, user])

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
