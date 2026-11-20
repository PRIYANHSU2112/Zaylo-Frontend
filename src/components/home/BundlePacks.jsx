import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import { RevealStagger, RevealItem } from '@/components/shared/Reveal'
import { useStore } from '@/context/StoreContext'
import { useToast } from '@/context/ToastContext'
import { formatINR } from '@/components/shared/States'

/**
 * Popular Bundle Packs from GET /home (admin → Bundle Packs).
 * A pack is a real cart item charged at the admin-set bundle price; the server
 * re-prices it and reserves stock for every product inside it at checkout.
 */
export default function BundlePacks({ bundles = [] }) {
  const list = bundles.filter((b) => b.items?.length)
  if (!list.length) return null

  return (
    <section id="bundles" className="section-padding scroll-mt-32 bg-brand-primary-light/40">
      <div className="section-container">
        <div className="rounded-[2.5rem] bg-brand-primary-light/60 p-6 md:p-10 lg:p-12">
          <SectionHeading title="Popular Bundle Pack" align="left" className="!mb-6" />
          <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  )
}

function BundleCard({ bundle }) {
  const { cart, addToCart, updateCartItem } = useStore()
  const toast = useToast()
  const inCart = cart.find((i) => i.kind === 'bundle' && i.id === String(bundle.id))
  const qty = inCart?.quantity || 0
  const stock = bundle.stock ?? 0
  const soldOut = stock <= 0
  const off = bundle.mrp > bundle.price ? Math.round(((bundle.mrp - bundle.price) / bundle.mrp) * 100) : 0
  const items = bundle.items

  const add = () => {
    addToCart({ ...bundle, kind: 'bundle', image: bundle.image || items[0]?.image }, 1)
    toast.success(`${bundle.name} added to cart`)
  }

  return (
    <RevealItem className="bundle-card">
      <div className="relative mb-4 flex h-40 items-center justify-center rounded-xl bg-surface p-4 shadow-sm">
        {off > 0 && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-brand-primary px-2.5 py-1 text-[11px] font-extrabold text-white">
            {off}% OFF
          </span>
        )}
        <div className="flex w-full items-center justify-center gap-2">
          {items.slice(0, 3).map((item, i) => (
            <Link key={`${item.id}-${i}`} to={`/products/${item.slug}`} aria-label={item.name}>
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-24 w-20 object-contain drop-shadow-md"
                style={{
                  transform: `rotate(${i === 0 ? -10 : i === 2 ? 10 : 0}deg) scale(${i === 1 ? 1.1 : 0.9})`,
                  zIndex: i === 1 ? 10 : 5,
                }}
              />
            </Link>
          ))}
          {items.length > 3 && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-light text-xs font-bold text-brand-primary">
              +{items.length - 3}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col px-2">
        <h3 className="text-lg font-bold text-main">{bundle.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted">
          {bundle.tagline || items.map((i) => i.name).join(' + ')}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-main">{formatINR(bundle.price)}</p>
              {bundle.mrp > bundle.price && <p className="text-xs text-muted line-through">{formatINR(bundle.mrp)}</p>}
            </div>
            <p className="text-[11px] text-muted">
              {items.length} items{!soldOut && stock <= 5 ? ` · only ${stock} left` : ''}
            </p>
          </div>

          {soldOut ? (
            <span className="rounded-lg bg-border-subtle/60 px-3 py-2 text-xs font-bold text-muted">Out of stock</span>
          ) : qty > 0 ? (
            <div className="flex items-center gap-3 rounded-lg border border-brand-primary bg-brand-primary-light px-2 py-1.5">
              <button
                type="button"
                onClick={() => updateCartItem(bundle.id, qty - 1)}
                className="text-brand-primary transition-colors duration-200 hover:text-brand-primary-dark"
                aria-label="Remove one pack"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-4 text-center text-sm font-bold text-brand-primary">{qty}</span>
              <button
                type="button"
                onClick={() => updateCartItem(bundle.id, qty + 1)}
                disabled={qty >= stock}
                className="text-brand-primary transition-colors duration-200 hover:text-brand-primary-dark disabled:opacity-40"
                aria-label="Add one more pack"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={add}
              className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-brand-primary-dark"
            >
              <ShoppingBag className="h-4 w-4" /> Add pack
            </button>
          )}
        </div>
      </div>
    </RevealItem>
  )
}
