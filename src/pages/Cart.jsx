import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import Reveal from '@/components/shared/Reveal'
import PageHero from '@/components/shared/PageHero'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export default function Cart() {
  const { cart, updateCartItem, removeFromCart, cartTotal } = useStore()
  const navigate = useNavigate()

  const deliveryFee = cartTotal > 500 ? 0 : 50
  const finalTotal = cartTotal + (cart.length > 0 ? deliveryFee : 0)

  if (cart.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <PageHero
          title="Your Cart"
          subtitle="It looks like you haven't added anything yet."
        />
        <div className="section-container flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-cream text-brand-primary mb-6">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-main mb-3">Your cart is empty</h3>
          <p className="text-muted mb-8 max-w-sm mx-auto">
            Browse our delicious snacks and fill up your cart with joy!
          </p>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <PageHero
        title="Your Cart"
        subtitle="Review your items before checkout."
      />
      
      <div className="section-container mt-12 grid gap-8 lg:grid-cols-3">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05} className="flex flex-col sm:flex-row gap-4 sm:items-center rounded-2xl bg-surface p-4 shadow-card border border-border-subtle">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-surface-cream flex items-center justify-center">
                <img src={item.image} alt={item.name} className="h-20 w-auto object-contain" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-lg font-bold text-main">{item.name}</h4>
                <p className="text-sm text-muted">{item.weight}</p>
                <div className="mt-2 font-bold text-brand-primary text-lg">
                  ₹{item.price} <span className="text-sm text-muted line-through font-normal ml-1">₹{item.mrp}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-muted hover:text-brand-primary transition-colors p-2"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-3 rounded-full border border-border-subtle bg-background px-3 py-1.5">
                  <button
                    onClick={() => updateCartItem(item.id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-main hover:bg-surface-cream hover:text-brand-primary active:scale-95 transition-all duration-200"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-4 text-center text-sm font-semibold text-main">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-main hover:bg-surface-cream hover:text-brand-primary active:scale-95 transition-all duration-200"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Order Summary */}
        <Reveal delay={0.2} className="lg:sticky lg:top-32 h-fit">
          <div className="rounded-[1.75rem] bg-surface p-6 sm:p-8 shadow-card border border-border-subtle">
            <h3 className="text-xl font-bold text-main mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-semibold text-main">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery Fee</span>
                <span className="font-semibold text-main">
                  {deliveryFee === 0 ? <span className="text-brand-primary">Free</span> : `₹${deliveryFee}`}
                </span>
              </div>
              
              <div className="my-4 border-t border-border-subtle" />
              
              <div className="flex justify-between text-lg font-extrabold text-main">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <Button 
              className="w-full mt-8 group flex items-center justify-center gap-2"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <p className="mt-4 text-center text-xs text-muted">
              Secure checkout • Free delivery above ₹500
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
