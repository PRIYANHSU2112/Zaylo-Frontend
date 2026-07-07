import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, ChevronRight, CreditCard, Banknote, Truck } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import Reveal from '@/components/shared/Reveal'
import PageHero from '@/components/shared/PageHero'
import Button from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

export default function Checkout() {
  const { cart, cartTotal, user, clearCart } = useStore()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(user.addresses[0]?.id || '')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)

  const deliveryFee = cartTotal > 500 ? 0 : 50
  const finalTotal = cartTotal + (cart.length > 0 ? deliveryFee : 0)

  if (cart.length === 0 && step !== 3) {
    navigate('/cart')
    return null
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      clearCart()
      setStep(3)
    }, 1500)
  }

  if (step === 3) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-6 text-center pb-32">
        <Reveal className="max-w-md w-full bg-surface rounded-[2rem] p-10 shadow-card border border-border-subtle flex flex-col items-center">
          <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-main mb-3">Order Placed!</h2>
          <p className="text-muted mb-8">
            Thank you for shopping with ZAY'LO. Your delicious snacks are on their way and will reach you soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link to="/profile" className="flex-1">
              <Button variant="outline" className="w-full">View Order</Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="border-b border-border-subtle bg-surface/50 sticky top-[5.5rem] md:top-[6.5rem] z-30 backdrop-blur-md">
        <div className="section-container py-4 flex items-center text-sm font-medium">
          <button 
            onClick={() => setStep(1)} 
            className={cn("transition-colors", step >= 1 ? "text-brand-primary" : "text-muted")}
          >
            Delivery
          </button>
          <ChevronRight className="h-4 w-4 mx-2 text-muted" />
          <button 
            className={cn("transition-colors", step >= 2 ? "text-brand-primary" : "text-muted")}
          >
            Payment
          </button>
          <ChevronRight className="h-4 w-4 mx-2 text-muted" />
          <span className={cn("transition-colors", step === 3 ? "text-brand-primary" : "text-muted")}>
            Confirmation
          </span>
        </div>
      </div>

      <div className="section-container mt-10 grid gap-10 lg:grid-cols-3">
        
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <Reveal className="space-y-8">
              <div className="rounded-[1.75rem] bg-surface p-6 sm:p-8 shadow-card border border-border-subtle">
                <h3 className="text-xl font-bold text-main mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-brand-primary" /> Delivery Address
                </h3>
                
                <div className="space-y-4">
                  {user.addresses.map(addr => (
                    <label 
                      key={addr.id} 
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        selectedAddress === addr.id ? "border-brand-primary bg-brand-primary/5" : "border-border-subtle hover:border-brand-primary/50"
                      )}
                    >
                      <input 
                        type="radio" 
                        name="address" 
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-1 h-4 w-4 text-brand-primary accent-brand-primary"
                      />
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-surface-cream text-brand-primary mb-1">
                          {addr.type}
                        </span>
                        <p className="text-sm font-medium text-main">{user.name} • {user.phone}</p>
                        <p className="text-sm text-muted mt-1">{addr.address}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-8 border-t border-border-subtle pt-8">
                  <h4 className="text-sm font-bold text-main mb-4">Add New Address</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Full Name" placeholder={user.name} />
                    <Input label="Phone Number" placeholder={user.phone} />
                    <div className="sm:col-span-2">
                      <Input label="Address Line 1" placeholder="Flat, House no., Building, Company" />
                    </div>
                    <Input label="City" placeholder="e.g. New Delhi" />
                    <Input label="PIN Code" placeholder="e.g. 110001" />
                  </div>
                </div>

                <Button className="w-full mt-8" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            </Reveal>
          )}

          {step === 2 && (
            <Reveal className="space-y-8">
              <div className="rounded-[1.75rem] bg-surface p-6 sm:p-8 shadow-card border border-border-subtle">
                <h3 className="text-xl font-bold text-main mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand-primary" /> Payment Method
                </h3>
                
                <div className="space-y-4">
                  <label 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                      paymentMethod === 'card' ? "border-brand-primary bg-brand-primary/5" : "border-border-subtle hover:border-brand-primary/50"
                    )}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="h-4 w-4 text-brand-primary accent-brand-primary"
                    />
                    <CreditCard className="h-5 w-5 text-main" />
                    <span className="font-medium text-main">Credit / Debit Card</span>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="pl-12 pr-4 pb-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Input label="Card Number" placeholder="0000 0000 0000 0000" />
                      </div>
                      <Input label="Expiry (MM/YY)" placeholder="MM/YY" />
                      <Input label="CVV" type="password" placeholder="123" />
                    </div>
                  )}

                  <label 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                      paymentMethod === 'upi' ? "border-brand-primary bg-brand-primary/5" : "border-border-subtle hover:border-brand-primary/50"
                    )}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="h-4 w-4 text-brand-primary accent-brand-primary"
                    />
                    <div className="h-5 w-5 font-bold text-main">UPI</div>
                    <span className="font-medium text-main">UPI ID / QR</span>
                  </label>

                  <label 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                      paymentMethod === 'cod' ? "border-brand-primary bg-brand-primary/5" : "border-border-subtle hover:border-brand-primary/50"
                    )}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 text-brand-primary accent-brand-primary"
                    />
                    <Banknote className="h-5 w-5 text-main" />
                    <span className="font-medium text-main">Cash on Delivery</span>
                  </label>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">
                    Back
                  </Button>
                  <Button className="w-2/3" onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay ₹${finalTotal}`}
                  </Button>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <Reveal delay={0.2} className="lg:sticky lg:top-[11rem] h-fit z-20">
          <div className="rounded-[1.75rem] bg-surface p-6 shadow-card border border-border-subtle">
            <h3 className="font-bold text-main mb-4">Order Details</h3>
            
            <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="h-12 w-12 rounded-lg bg-surface-cream p-1 flex-shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-main line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-main">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm pt-4 border-t border-border-subtle">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-main">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery</span>
                <span className="font-semibold text-main">
                  {deliveryFee === 0 ? <span className="text-brand-primary">Free</span> : `₹${deliveryFee}`}
                </span>
              </div>
              
              <div className="my-2 border-t border-border-subtle" />
              
              <div className="flex justify-between text-lg font-extrabold text-main">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
