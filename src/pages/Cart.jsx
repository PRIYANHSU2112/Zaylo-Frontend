import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button'
import SEO from '@/components/shared/SEO'
import PageHero from '@/components/shared/PageHero'
import { EmptyState, ErrorState, Skeleton, formatINR } from '@/components/shared/States'
import { useStore } from '@/context/StoreContext'
import { useCheckoutQuote } from '@/hooks/useAccount'

export default function Cart() {
  const { cart, cartLines, updateCartItem, removeFromCart } = useStore()
  const quote = useCheckoutQuote(cartLines)
  const q = quote.data
  const issuesById = Object.fromEntries((q?.issues || []).map((i) => [i.productId, i]))
  const blocking = (q?.issues || []).length > 0

  if (!cart.length) {
    return (
      <div className="section-container py-16">
        <SEO title="Your Cart" path="/cart" noindex />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Discover our crunchy range and add your favourites."
          action={<Link to="/products"><Button>Start shopping</Button></Link>}
        />
      </div>
    )
  }

  return (
    <div className="bg-background">
      <SEO title="Your Cart" path="/cart" noindex />
      <PageHero title="Shopping Cart" subtitle={`${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`} />
      <div className="section-container grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-4">
          {cart.map((item) => {
            const live = q?.items?.find((l) => l.id === item.id)
            const issue = issuesById[item.id]
            const price = live?.price ?? item.price
            const href = item.kind === 'bundle' ? '/#bundles' : '/products/' + item.slug
            return (
              <li key={item.id} className="flex gap-4 rounded-2xl border border-border-subtle bg-surface p-4 shadow-card">
                <Link to={href} className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-surface-cream p-2">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-contain" />}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={href} className="truncate font-bold text-main hover:text-brand-primary">{item.name}</Link>
                      {item.kind === 'bundle' && <span className="mr-2 rounded-full bg-brand-primary-light px-2 py-0.5 text-[10px] font-bold uppercase text-brand-primary">Pack</span>}
                      {item.weight && <span className="text-xs text-muted">{item.weight}</span>}
                      {(live?.components || item.components)?.length > 0 && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted">{(live?.components || item.components).map((c) => c.name + (c.quantity > 1 ? ' ×' + c.quantity : '')).join(' + ')}</p>
                      )}
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="rounded-full p-2 text-muted hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${item.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {issue && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                      <AlertTriangle className="h-3.5 w-3.5" /> {issue.message}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="qty-btn" onClick={() => updateCartItem(item.id, item.quantity - 1)} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center font-bold" aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn disabled:opacity-40"
                        disabled={live && item.quantity >= live.stock}
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-bold text-main">{formatINR(price * item.quantity)}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <aside className="h-fit rounded-3xl border border-border-subtle bg-surface p-6 shadow-card lg:sticky lg:top-32">
          <h2 className="text-lg font-bold text-main">Order summary</h2>
          {quote.isError ? (
            <ErrorState className="mt-4 !py-6" title="Couldn't price your cart" error={quote.error} onRetry={quote.refetch} />
          ) : !q ? (
            <div className="mt-4 space-y-3"><Skeleton className="h-5" /><Skeleton className="h-5" /><Skeleton className="h-7" /></div>
          ) : (
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-semibold">{formatINR(q.subtotal)}</dd></div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="font-semibold">{q.shippingFee ? formatINR(q.shippingFee) : 'Free'}</dd>
              </div>
              {q.tax > 0 && <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{formatINR(q.tax)}</dd></div>}
              {q.shippingFee > 0 && q.freeShippingThreshold > 0 && (
                <p className="rounded-xl bg-brand-primary-light px-3 py-2 text-xs text-brand-primary-dark">
                  Add {formatINR(q.freeShippingThreshold - q.subtotal)} more for free delivery
                </p>
              )}
              <div className="flex justify-between border-t border-border-subtle pt-3 text-base">
                <dt className="font-bold">Estimated total</dt><dd className="font-extrabold">{formatINR(q.amount - (q.codFee || 0))}</dd>
              </div>
              <p className="text-xs text-muted">Coupons and payment options are applied at checkout.</p>
            </dl>
          )}
          {blocking && <p className="mt-4 text-xs font-semibold text-red-600">Please fix the highlighted items to continue.</p>}
          <Link to={blocking ? '#' : '/checkout'} aria-disabled={blocking} onClick={(e) => blocking && e.preventDefault()}>
            <Button className="mt-6 w-full" disabled={blocking || !q}>
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/products" className="mt-3 block text-center text-sm font-semibold text-brand-primary">Continue shopping</Link>
        </aside>
      </div>
    </div>
  )
}
