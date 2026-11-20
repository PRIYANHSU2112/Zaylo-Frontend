import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, FileText, Package, Truck, XCircle, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'
import SEO from '@/components/shared/SEO'
import { Breadcrumb } from '@/components/shared/PageHero'
import { ErrorState, Skeleton, Spinner, formatINR } from '@/components/shared/States'
import { useOrder, openInvoice } from '@/hooks/useAccount'
import { useToast } from '@/context/ToastContext'
import { api } from '@/lib/api'
import { cn } from '@/utils/cn'

const STEPS = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered']
const STEP_LABEL = { Pending: 'Placed', Confirmed: 'Confirmed', Packed: 'Packed', Shipped: 'Shipped', Delivered: 'Delivered' }

export const statusTone = (s) =>
  ({
    Pending: 'bg-amber-50 text-amber-700',
    Confirmed: 'bg-blue-50 text-blue-700',
    Packed: 'bg-indigo-50 text-indigo-700',
    Shipped: 'bg-violet-50 text-violet-700',
    Delivered: 'bg-emerald-50 text-emerald-700',
    Cancelled: 'bg-red-50 text-red-700',
  })[s] || 'bg-border-subtle text-main'

export const paymentLabel = (o) =>
  o.paymentStatus === 'Paid'
    ? 'Paid'
    : o.paymentMethod === 'COD'
      ? o.status === 'Cancelled'
        ? 'Not charged'
        : 'Pay on delivery'
      : o.paymentStatus === 'Failed'
        ? 'Payment failed'
        : 'Payment pending'

export default function OrderDetail() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const toast = useToast()
  const qc = useQueryClient()
  const { data: order, isLoading, isError, error, refetch } = useOrder(id)
  const [busy, setBusy] = useState('')

  if (isLoading) {
    return (
      <div className="section-container space-y-4 py-12">
        <Skeleton className="h-8 w-1/3" /><Skeleton className="h-24" /><Skeleton className="h-64" />
      </div>
    )
  }
  if (isError) {
    return (
      <div className="section-container py-16">
        <ErrorState title={error?.status === 404 ? 'Order not found' : "Couldn't load this order"} error={error} onRetry={error?.status === 404 ? undefined : refetch} />
      </div>
    )
  }

  const cancelled = order.status === 'Cancelled'
  const stepIndex = STEPS.indexOf(order.status)

  const cancel = async () => {
    if (!window.confirm('Cancel this order?')) return
    setBusy('cancel')
    try {
      await api.post(`/orders/${order.id}/cancel`, {})
      toast.success('Order cancelled')
      qc.invalidateQueries({ queryKey: ['me'] })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy('')
    }
  }

  const invoice = async () => {
    setBusy('invoice')
    try {
      await openInvoice(order.id)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="section-container py-10">
      <SEO title={`Order ${order.orderCode}`} path={`/orders/${order.id}`} noindex />
      <Breadcrumb items={[{ label: 'Account', href: '/profile' }, { label: 'Orders', href: '/profile?tab=orders' }, { label: order.orderCode }]} />

      {params.get('placed') && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Thank you! Your order has been placed.</p>
            <p className="text-sm">
              {order.paymentMethod === 'COD'
                ? `Please keep ${formatINR(order.amount)} ready at delivery.`
                : 'Complete payment to confirm your order.'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-main md:text-3xl">Order {order.orderCode}</h1>
          <p className="mt-1 text-sm text-muted">Placed on {new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={cn('rounded-full px-3 py-1 text-xs font-bold', statusTone(order.status))}>{order.status}</span>
          <span className={cn('rounded-full px-3 py-1 text-xs font-bold', order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-border-subtle/60 text-main')}>
            {paymentLabel(order)}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <section className="mt-8 rounded-3xl border border-border-subtle bg-surface p-6 shadow-card">
        {cancelled ? (
          <p className="flex items-center gap-2 font-semibold text-red-700"><XCircle className="h-5 w-5" /> This order was cancelled.</p>
        ) : (
          <ol className="grid grid-cols-5 gap-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex flex-col items-center text-center">
                <span className={cn('flex h-9 w-9 items-center justify-center rounded-full text-white', i <= stepIndex ? 'bg-brand-primary' : 'bg-border-subtle text-muted')}>
                  {i <= stepIndex ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-4 w-4" />}
                </span>
                <span className={cn('mt-2 text-[11px] font-semibold sm:text-xs', i <= stepIndex ? 'text-main' : 'text-muted')}>{STEP_LABEL[s]}</span>
              </li>
            ))}
          </ol>
        )}
        {(order.courier || order.trackingNumber) && (
          <p className="mt-6 flex items-center gap-2 rounded-xl bg-surface-cream px-4 py-3 text-sm">
            <Truck className="h-4 w-4 text-brand-primary" />
            {order.courier && <span className="font-semibold">{order.courier}</span>}
            {order.trackingNumber && <span>Tracking no. <span className="font-mono font-semibold">{order.trackingNumber}</span></span>}
          </p>
        )}
        {order.history?.length > 0 && (
          <ul className="mt-6 space-y-2 border-t border-border-subtle pt-4 text-sm">
            {[...order.history].reverse().map((h, i) => (
              <li key={i} className="flex justify-between gap-4">
                <span><span className="font-semibold text-main">{h.kind === 'payment' ? `Payment: ${h.value}` : h.value}</span>{h.note && <span className="text-muted"> — {h.note}</span>}</span>
                <span className="shrink-0 text-muted">{new Date(h.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-main"><Package className="h-5 w-5 text-brand-primary" /> Items</h2>
          <ul className="divide-y divide-border-subtle">
            {order.items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 py-3">
                {i.image && <img src={i.image} alt="" className="h-14 w-14 rounded-lg bg-surface-cream object-contain p-1" />}
                <div className="min-w-0 flex-1">
                  {i.slug ? <Link to={`/products/${i.slug}`} className="font-semibold text-main hover:text-brand-primary">{i.name}</Link> : <p className="font-semibold">{i.name}</p>}
                  {i.kind === 'bundle' && i.components?.length > 0 && (
                    <p className="text-xs text-muted">Pack: {i.components.map((c) => c.name + (c.quantity > 1 ? ' ×' + c.quantity : '')).join(' + ')}</p>
                  )}
                  <p className="text-xs text-muted">{formatINR(i.price)} × {i.quantity}</p>
                </div>
                <p className="font-semibold">{formatINR(i.lineTotal || i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="h-fit space-y-6 rounded-3xl border border-border-subtle bg-surface p-6 shadow-card">
          <dl className="space-y-2 text-sm">
            {order.subtotal > 0 && <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>}
            {order.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount {order.couponCode && `(${order.couponCode})`}</dt><dd>−{formatINR(order.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{order.shippingFee ? formatINR(order.shippingFee) : 'Free'}</dd></div>
            {order.codFee > 0 && <div className="flex justify-between"><dt className="text-muted">COD fee</dt><dd>{formatINR(order.codFee)}</dd></div>}
            {order.tax > 0 && <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{formatINR(order.tax)}</dd></div>}
            <div className="flex justify-between border-t border-border-subtle pt-2 text-base font-extrabold"><dt>Total</dt><dd>{formatINR(order.amount)}</dd></div>
          </dl>
          <div className="text-sm">
            <p className="font-semibold text-main">Delivering to</p>
            <p className="mt-1 text-muted">{order.shippingAddress}</p>
            {order.customerPhone && <p className="text-muted">{order.customerPhone}</p>}
          </div>
          <div className="flex flex-col gap-2">
            {order.invoiceAvailable && (
              <Button variant="secondary" onClick={invoice} disabled={busy === 'invoice'}>
                {busy === 'invoice' ? <Spinner /> : <FileText className="h-4 w-4" />} Download invoice
              </Button>
            )}
            {order.canCancel && (
              <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={cancel} disabled={busy === 'cancel'}>
                {busy === 'cancel' && <Spinner />} Cancel order
              </Button>
            )}
          </div>
          {!order.invoiceAvailable && !cancelled && (
            <p className="text-xs text-muted">The invoice becomes available once your order is confirmed.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
