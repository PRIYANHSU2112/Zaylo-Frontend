import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { MapPin, Plus, Tag, CheckCircle2, Wallet, CreditCard, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import SEO from '@/components/shared/SEO'
import PageHero from '@/components/shared/PageHero'
import AddressForm, { addressLine } from '@/components/shared/AddressForm'
import { ErrorState, Skeleton, Spinner, formatINR } from '@/components/shared/States'
import { useStore } from '@/context/StoreContext'
import { useToast } from '@/context/ToastContext'
import { useAddresses, useAddressMutations, useCheckoutQuote } from '@/hooks/useAccount'
import { api } from '@/lib/api'
import { cn } from '@/utils/cn'

const newKey = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)

export default function Checkout() {
  const navigate = useNavigate()
  const toast = useToast()
  const qc = useQueryClient()
  const { cart, cartLines, clearCart } = useStore()
  const addresses = useAddresses()
  const { create } = useAddressMutations()

  const [addressId, setAddressId] = useState('')
  const [adding, setAdding] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [placing, setPlacing] = useState(false)
  const [placeError, setPlaceError] = useState('')
  // One key per checkout attempt → retries/double-clicks never create duplicate orders.
  const idemKey = useRef(newKey())

  const quote = useCheckoutQuote(cartLines, { couponCode: coupon, paymentMethod })
  const q = quote.data

  const list = useMemo(() => addresses.data || [], [addresses.data])
  useEffect(() => {
    if (!addressId && list.length) setAddressId((list.find((a) => a.isDefault) || list[0]).id)
    if (addresses.isSuccess && !list.length) setAdding(true)
  }, [list, addressId, addresses.isSuccess])

  useEffect(() => {
    if (q?.couponError && coupon) {
      toast.error(q.couponError)
      setCoupon('')
    }
  }, [q?.couponError, coupon, toast])

  // Selection changed → new attempt key
  useEffect(() => {
    idemKey.current = newKey()
  }, [cartLines.length, coupon, paymentMethod, addressId])

  if (!cart.length && !placing) return <Navigate to="/cart" replace />

  const codAvailable = q?.paymentMethods?.COD !== false
  const onlineAvailable = Boolean(q?.paymentMethods?.Razorpay)
  const blocking = (q?.issues || []).length > 0

  const saveAddress = async (body) => {
    try {
      const a = await create.mutateAsync(body)
      setAddressId(a.id)
      setAdding(false)
      toast.success('Address saved')
    } catch {
      /* error shown in form */
    }
  }

  const applyCoupon = (e) => {
    e.preventDefault()
    if (couponInput.trim()) setCoupon(couponInput.trim().toUpperCase())
  }

  const placeOrder = async () => {
    setPlaceError('')
    if (!addressId) return setPlaceError('Please select a delivery address')
    setPlacing(true)
    try {
      const order = await api.post(
        '/orders',
        { items: cartLines, addressId, couponCode: coupon || undefined, paymentMethod },
        { headers: { 'Idempotency-Key': idemKey.current } },
      )
      clearCart()
      qc.invalidateQueries({ queryKey: ['me', 'orders'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(`Order ${order.orderCode} placed`)
      navigate(`/orders/${order.id}?placed=1`, { replace: true })
    } catch (err) {
      setPlaceError(err.message)
      quote.refetch()
      setPlacing(false)
    }
  }

  return (
    <div className="bg-background">
      <SEO title="Checkout" path="/checkout" noindex />
      <PageHero title="Checkout" />
      <div className="section-container grid gap-10 py-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          {/* Address */}
          <section className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-main"><MapPin className="h-5 w-5 text-brand-primary" /> Delivery address</h2>
              {!adding && list.length > 0 && (
                <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary">
                  <Plus className="h-4 w-4" /> Add new
                </button>
              )}
            </div>
            {addresses.isLoading ? (
              <Skeleton className="h-20" />
            ) : addresses.isError ? (
              <ErrorState className="!py-6" error={addresses.error} onRetry={addresses.refetch} />
            ) : adding ? (
              <AddressForm
                submitLabel="Save & use this address"
                pending={create.isPending}
                serverError={create.error?.message}
                onSubmit={saveAddress}
                onCancel={list.length ? () => setAdding(false) : undefined}
              />
            ) : (
              <div className="grid gap-3">
                {list.map((a) => (
                  <label
                    key={a.id}
                    className={cn(
                      'flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors',
                      addressId === a.id ? 'border-brand-primary bg-brand-primary-light/50' : 'border-border-subtle hover:border-brand-primary/40',
                    )}
                  >
                    <input type="radio" name="address" checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-1 accent-[var(--theme-primary)]" />
                    <div className="text-sm">
                      <p className="font-semibold text-main">{a.name || a.type} <span className="ml-1 rounded-full bg-border-subtle/60 px-2 py-0.5 text-[10px] uppercase">{a.type}</span></p>
                      <p className="mt-1 text-muted">{addressLine(a)}</p>
                      {a.phone && <p className="text-muted">{a.phone}</p>}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-card">
            <h2 className="mb-4 text-lg font-bold text-main">Payment method</h2>
            <div className="grid gap-3">
              <PayOption
                checked={paymentMethod === 'COD'}
                disabled={!codAvailable}
                onSelect={() => setPaymentMethod('COD')}
                icon={Wallet}
                title="Cash on Delivery"
                note={codAvailable ? (q?.codFee ? `COD fee ${formatINR(q.codFee)}` : 'Pay when your order arrives') : 'Currently unavailable'}
              />
              <PayOption
                checked={paymentMethod === 'Razorpay'}
                disabled={!onlineAvailable}
                onSelect={() => setPaymentMethod('Razorpay')}
                icon={CreditCard}
                title="Pay online (UPI / Card)"
                note={onlineAvailable ? 'Secure payment via Razorpay' : 'Online payments are coming soon'}
              />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-border-subtle bg-surface p-6 shadow-card lg:sticky lg:top-32">
          <h2 className="text-lg font-bold text-main">Order summary</h2>
          {quote.isError ? (
            <ErrorState className="mt-4 !py-6" title="Couldn't price your order" error={quote.error} onRetry={quote.refetch} />
          ) : !q ? (
            <div className="mt-4 space-y-3"><Skeleton className="h-12" /><Skeleton className="h-5" /><Skeleton className="h-7" /></div>
          ) : (
            <>
              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {q.items.map((l) => (
                  <li key={l.id} className="flex items-center gap-3 text-sm">
                    <img src={l.image} alt="" className="h-12 w-12 rounded-lg bg-surface-cream object-contain p-1" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{l.name} × {l.quantity}</span>
                      {l.kind === 'bundle' && l.components?.length > 0 && (
                        <span className="block truncate text-xs text-muted">Pack: {l.components.map((c) => c.name).join(' + ')}</span>
                      )}
                    </span>
                    <span className="font-semibold">{formatINR(l.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              {q.issues?.length > 0 && (
                <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                  {q.issues.map((i) => <p key={i.productId}>{i.message}</p>)}
                  <Link to="/cart" className="mt-1 inline-block font-semibold underline">Update cart</Link>
                </div>
              )}

              <form onSubmit={applyCoupon} className="mt-5 flex gap-2">
                {coupon ? (
                  <div className="flex flex-1 items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
                    <span className="flex items-center gap-1.5 font-semibold"><CheckCircle2 className="h-4 w-4" /> {coupon} applied</span>
                    <button type="button" onClick={() => { setCoupon(''); setCouponInput('') }} aria-label="Remove coupon"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <>
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="input-field !py-2.5 !pl-9 uppercase" />
                    </div>
                    <Button type="submit" variant="secondary" className="!px-4 !py-2.5" disabled={!couponInput.trim() || quote.isFetching}>Apply</Button>
                  </>
                )}
              </form>

              <dl className="mt-5 space-y-2.5 text-sm">
                <Row label="Subtotal" value={formatINR(q.subtotal)} />
                {q.discount > 0 && <Row label="Discount" value={`−${formatINR(q.discount)}`} className="text-emerald-700" />}
                <Row label="Delivery" value={q.shippingFee ? formatINR(q.shippingFee) : 'Free'} />
                {q.codFee > 0 && <Row label="COD fee" value={formatINR(q.codFee)} />}
                {q.tax > 0 && <Row label="Tax" value={formatINR(q.tax)} />}
                <div className="flex justify-between border-t border-border-subtle pt-3 text-base">
                  <dt className="font-bold">Total</dt><dd className="font-extrabold">{formatINR(q.amount)}</dd>
                </div>
              </dl>
            </>
          )}

          {placeError && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{placeError}</p>}
          <Button
            className="mt-6 w-full"
            onClick={placeOrder}
            disabled={placing || !q || blocking || !addressId || adding || quote.isFetching || (paymentMethod === 'COD' ? !codAvailable : !onlineAvailable)}
          >
            {placing && <Spinner />} {paymentMethod === 'COD' ? 'Place order (Cash on Delivery)' : 'Continue to payment'}
          </Button>
          <p className="mt-3 text-center text-xs text-muted">Prices and stock are confirmed when you place the order.</p>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value, className }) {
  return (
    <div className={cn('flex justify-between', className)}>
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}

function PayOption({ checked, disabled, onSelect, icon: Icon, title, note }) {
  return (
    <label
      className={cn(
        'flex items-center gap-3 rounded-2xl border p-4 transition-colors',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        checked && !disabled ? 'border-brand-primary bg-brand-primary-light/50' : 'border-border-subtle',
      )}
    >
      <input type="radio" name="payment" checked={checked} disabled={disabled} onChange={onSelect} className="accent-[var(--theme-primary)]" />
      <Icon className="h-5 w-5 text-brand-primary" />
      <div className="text-sm">
        <p className="font-semibold text-main">{title}</p>
        <p className="text-muted">{note}</p>
      </div>
    </label>
  )
}
