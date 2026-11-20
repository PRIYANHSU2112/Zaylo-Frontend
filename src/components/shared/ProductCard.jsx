import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Heart, Minus, Plus } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import Badge from '@/components/ui/Badge'
import { RevealItem } from '@/components/shared/Reveal'
import { cn } from '@/utils/cn'
import { formatINR } from '@/components/shared/States'

export default function ProductCard({ product, onQuickView, className, listView = false }) {
  const { cart, addToCart, updateCartItem, toggleWishlist, isInWishlist } = useStore()

  const cartItem = cart.find((item) => item.id === String(product.id))
  const outOfStock = product.stock !== undefined && product.stock <= 0
  const qty = cartItem ? cartItem.quantity : 0
  const isWishlisted = isInWishlist(product.id)
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <RevealItem
      className={cn(
        'grocery-product-card',
        listView && 'flex flex-row gap-5 p-4',
        !listView && 'p-4',
        className,
      )}
    >
      <div className="relative">
        <Link
          to={`/products/${product.slug}`}
          className={cn(
            'relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-brand-primary/5 to-transparent p-4',
            listView ? 'h-24 w-24 shrink-0' : 'aspect-square w-full',
          )}
        >
          {!imgLoaded && <span className="skeleton-shimmer absolute inset-3 rounded-lg" aria-hidden="true" />}
          <img
            src={product.image}
            alt={`ZAY'LO ${product.name}`}
            width={300}
            height={400}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={cn(
              'h-[80%] w-[80%] object-contain transition-[opacity,transform] duration-500 ease-out hover:scale-[1.06]',
              imgLoaded ? 'opacity-100' : 'opacity-0',
            )}
          />
        </Link>
        {product.isNew && (
          <Badge variant="new" className="absolute left-2 top-2 z-10 bg-brand-yellow text-main">
            New
          </Badge>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product)
          }}
          className={cn(
            "absolute right-2 top-2 z-10 rounded-full p-2 backdrop-blur-sm transition-all",
            isWishlisted ? "bg-brand-primary text-white" : "bg-surface/80 text-slate-300 hover:text-brand-primary"
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        </button>
        {onQuickView && !listView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-2 right-2 z-10 rounded-full bg-surface/90 p-2 text-muted shadow-sm backdrop-blur-sm transition-colors hover:text-brand-primary"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className={cn('flex flex-1 flex-col pt-4', listView && 'justify-center !pt-0')}>
        <div className="min-w-0 flex-1">
          <Link to={`/products/${product.slug}`}>
            <h3 className="truncate text-base font-bold text-main transition-colors hover:text-brand-primary">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-muted">
            {[product.tagline, product.weight].filter(Boolean).join(' • ')}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-main">{formatINR(product.price)}</p>
            {product.mrp > product.price && (
              <p className="text-xs text-muted line-through">{formatINR(product.mrp)}</p>
            )}
          </div>
          
          <div className="flex items-center">
            {qty > 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-brand-primary bg-brand-primary-light px-2 py-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    updateCartItem(String(product.id), qty - 1)
                  }}
                  className="flex h-8 w-8 items-center justify-center text-brand-primary transition-colors duration-200 hover:text-brand-primary-dark"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-4 text-center text-sm font-bold text-brand-primary">{qty}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    updateCartItem(String(product.id), qty + 1)
                  }}
                  disabled={product.stock !== undefined && qty >= product.stock}
                  className="flex h-8 w-8 items-center justify-center text-brand-primary transition-colors duration-200 hover:text-brand-primary-dark disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : outOfStock ? (
              <span className="rounded-lg bg-border-subtle/60 px-3 py-2 text-xs font-bold text-muted">Out of stock</span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  addToCart(product)
                }}
                className="flex items-center gap-1 rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-primary-dark"
              >
                Add <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </RevealItem>
  )
}
