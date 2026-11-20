import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Star, Minus, Plus, ShoppingBag, Heart, Truck, ShieldCheck } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProductCard from '@/components/shared/ProductCard'
import SectionHeading from '@/components/shared/SectionHeading'
import { Breadcrumb } from '@/components/shared/PageHero'
import { RevealStagger } from '@/components/shared/Reveal'
import { ErrorState, Skeleton, formatINR } from '@/components/shared/States'
import { useStore } from '@/context/StoreContext'
import { useToast } from '@/context/ToastContext'
import { useProduct } from '@/hooks/useCatalog'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { cn } from '@/utils/cn'
import SEO from '@/components/shared/SEO'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const { settings } = useSiteSettings()
  const { data, isLoading, isError, error, refetch } = useProduct(slug)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Description')
  const [activeImage, setActiveImage] = useState(0)

  if (isLoading) {
    return (
      <div className="section-container grid gap-10 py-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-[2rem]" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </div>
    )
  }

  if (isError) {
    const notFound = error?.status === 404
    return (
      <div className="section-container py-20">
        <SEO title={notFound ? 'Product Not Found' : 'Product'} path={`/products/${slug}`} noindex />
        {notFound ? (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-main">Product Not Found</h1>
            <p className="mt-2 text-muted">This product may have been removed or is no longer available.</p>
            <Link to="/products" className="mt-4 text-brand-primary hover:underline">Back to Products</Link>
          </div>
        ) : (
          <ErrorState title="Couldn't load this product" error={error} onRetry={refetch} />
        )}
      </div>
    )
  }

  const { product, related = [] } = data
  const gallery = (product.images?.length ? product.images : [product.image]).filter(Boolean)
  const stock = product.stock ?? 0
  const outOfStock = stock <= 0
  const maxQty = Math.max(1, Math.min(stock, settings.commerce?.maxQtyPerItem || 99))
  const wishlisted = isInWishlist(product.id)
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0
  const siteUrl = (settings.brand?.siteUrl || '').replace(/\/+$/, '')

  const tabs = [
    { key: 'Description', show: Boolean(product.description) },
    { key: 'Nutrition', show: Boolean(product.nutrition?.calories || product.nutrition?.fat) },
    { key: 'Ingredients', show: product.ingredients?.length > 0 },
    { key: 'Storage', show: Boolean(product.storage) },
  ].filter((t) => t.show)
  const currentTab = tabs.some((t) => t.key === activeTab) ? activeTab : tabs[0]?.key

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image || undefined,
    description: product.description || product.tagline,
    brand: { '@type': 'Brand', name: settings.general?.siteName || undefined },
    offers: {
      '@type': 'Offer',
      url: siteUrl ? `${siteUrl}/products/${product.slug}` : undefined,
      priceCurrency: 'INR',
      price: product.price,
      availability: outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
    ...(product.reviewCount > 0
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount } }
      : {}),
  }

  const add = () => {
    addToCart(product, quantity)
    toast.success(`${product.name} × ${quantity} added to cart`)
  }

  const buyNow = () => {
    addToCart(product, quantity)
    navigate('/checkout')
  }

  return (
    <div className="bg-background">
      <SEO
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.description || product.tagline}
        path={`/products/${product.slug}`}
        ogType="product"
        ogImage={product.image}
        structuredData={productSchema}
      />

      <div className="section-container py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
          <div className="product-stage flex aspect-square items-center justify-center p-10">
            {gallery.length ? (
              <img
                key={gallery[activeImage]}
                src={gallery[activeImage]}
                alt={product.name}
                className="h-full w-full animate-[fadeIn_0.4s_ease-out] object-contain drop-shadow-2xl"
              />
            ) : (
              <span className="text-6xl font-extrabold text-brand-primary/30">{product.name[0]}</span>
            )}
            {discount > 0 && (
              <Badge className="absolute left-5 top-5 bg-brand-primary text-white">{discount}% OFF</Badge>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={i === activeImage}
                  aria-label={`Image ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-surface p-1 transition-colors',
                    i === activeImage ? 'border-brand-primary' : 'border-border-subtle hover:border-brand-primary/40',
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-contain" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.isNew && <Badge className="bg-brand-yellow text-main">New</Badge>}
              {product.isVeg && <Badge className="bg-emerald-50 text-emerald-700">Pure Veg</Badge>}
              {product.flavor && <span className="flavor-chip">{product.flavor}</span>}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-main md:text-4xl">{product.name}</h1>
            {product.tagline && <p className="mt-2 text-lg text-muted">{product.tagline}</p>}
            {product.sku && <p className="mt-1 text-xs uppercase tracking-wider text-muted">SKU: {product.sku}</p>}

            {product.reviewCount > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex text-brand-gold" aria-label={`Rated ${product.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={cn('h-4 w-4', i < Math.round(product.rating) && 'fill-current')} />
                  ))}
                </div>
                <span className="font-semibold text-main">{product.rating}</span>
                <span className="text-muted">({product.reviewCount} ratings)</span>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-main">{formatINR(product.price)}</span>
              {product.mrp > product.price && <span className="text-lg text-muted line-through">{formatINR(product.mrp)}</span>}
              {product.weight && <span className="text-sm text-muted">/ {product.weight}</span>}
            </div>
            <p className={cn('mt-2 text-sm font-semibold', outOfStock ? 'text-red-600' : stock <= 10 ? 'text-brand-orange' : 'text-emerald-600')}>
              {outOfStock ? 'Out of stock' : stock <= 10 ? `Only ${stock} left` : 'In stock'}
            </p>

            {!outOfStock && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-border-subtle bg-surface p-1">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="qty-btn !rounded-full" aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-main" aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    className="qty-btn !rounded-full disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button onClick={add} className="flex-1 sm:flex-none">
                  <ShoppingBag className="h-4 w-4" /> Add to Cart
                </Button>
                <Button variant="outline" onClick={buyNow}>Buy Now</Button>
              </div>
            )}

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={cn('mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors', wishlisted ? 'text-brand-primary' : 'text-muted hover:text-brand-primary')}
            >
              <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
              {wishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
            </button>

            {settings.commerce && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-4 text-sm">
                  <Truck className="h-5 w-5 text-brand-primary" />
                  {settings.commerce.freeShippingThreshold > 0
                    ? `Free delivery above ${formatINR(settings.commerce.freeShippingThreshold)}`
                    : `Delivery ${formatINR(settings.commerce.shippingFee)}`}
                </div>
                {settings.commerce.codEnabled && (
                  <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-4 text-sm">
                    <ShieldCheck className="h-5 w-5 text-brand-primary" /> Cash on Delivery available
                  </div>
                )}
              </div>
            )}

            {tabs.length > 0 && (
              <div className="mt-10">
                <div className="flex gap-1 overflow-x-auto border-b border-border-subtle" role="tablist">
                  {tabs.map(({ key }) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={currentTab === key}
                      onClick={() => setActiveTab(key)}
                      className={cn(
                        'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                        currentTab === key ? 'border-brand-primary text-brand-primary' : 'border-transparent text-muted hover:text-main',
                      )}
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <div className="py-6 text-sm leading-relaxed text-body" role="tabpanel">
                  {currentTab === 'Description' && <p>{product.description}</p>}
                  {currentTab === 'Nutrition' && (
                    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        ['Calories', product.nutrition.calories ? `${product.nutrition.calories} kcal` : ''],
                        ['Fat', product.nutrition.fat],
                        ['Carbs', product.nutrition.carbs],
                      ]
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <div key={k} className="rounded-xl bg-surface-cream p-3 text-center">
                            <dt className="text-xs text-muted">{k}</dt>
                            <dd className="font-bold text-main">{v}</dd>
                          </div>
                        ))}
                    </dl>
                  )}
                  {currentTab === 'Ingredients' && (
                    <ul className="list-inside list-disc space-y-1">
                      {product.ingredients.map((i) => <li key={i}>{i}</li>)}
                    </ul>
                  )}
                  {currentTab === 'Storage' && <p>{product.storage}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section-container section-padding-sm">
          <SectionHeading title="You may also like" align="left" />
          <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </RevealStagger>
        </section>
      )}
    </div>
  )
}
