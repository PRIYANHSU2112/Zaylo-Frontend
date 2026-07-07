import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, Minus, Plus, ShoppingBag, Heart, RotateCcw } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProductCard from '@/components/shared/ProductCard'
import SectionHeading from '@/components/shared/SectionHeading'
import { Breadcrumb } from '@/components/shared/PageHero'
import { RevealStagger } from '@/components/shared/Reveal'
import { useStore } from '@/context/StoreContext'
import { getProductBySlug, getRelatedProducts } from '@/data/products'
import { cn } from '@/utils/cn'

const tabs = ['Description', 'Nutrition', 'Ingredients', 'Storage']

export default function ProductDetail() {
  const { slug } = useParams()
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const product = getProductBySlug(slug)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Description')

  if (!product) {
    return (
      <div className="section-container flex min-h-[50vh] flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold text-main">Product Not Found</h1>
        <Link to="/products" className="mt-4 text-brand-primary hover:underline">Back to Products</Link>
      </div>
    )
  }

  const related = getRelatedProducts(slug, 4)

  return (
    <div className="bg-background">
      <div className="border-b border-border-subtle bg-surface py-5">
        <div className="section-container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="section-container section-padding !pt-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="product-stage relative p-8 md:p-10">
              <span className="price-badge absolute left-6 top-6 z-10">₹{product.mrp}</span>
              {product.isNew && <Badge variant="new" className="absolute right-6 top-6 z-10">New</Badge>}
              <div className="absolute right-6 top-16 flex items-center gap-1 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-semibold text-muted shadow-sm backdrop-blur-sm">
                <RotateCcw className="h-3.5 w-3.5" /> 360° View
              </div>
              <img
                src={product.image}
                alt={`ZAY'LO ${product.name} snack pack`}
                width={500}
                height={600}
                className="mx-auto h-[380px] w-full object-contain md:h-[460px]"
              />
            </div>
          </div>

          <div>
            <span className="flavor-chip">{product.flavor}</span>
            <div className="mt-3 flex items-center gap-2">
              {product.isVeg && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm border-2 border-brand-primary">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
                </span>
              )}
              <span className="text-xs font-medium text-brand-primary">100% Vegetarian</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-main md:text-4xl lg:text-5xl">{product.name}</h1>
            <p className="mt-1 text-sm text-muted">{product.tagline} · {product.flavor}</p>

            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < Math.floor(product.rating) ? 'fill-brand-yellow text-brand-yellow' : 'text-grey-soft',
                  )}
                />
              ))}
              <span className="text-sm text-muted">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <p className="mt-6 text-3xl font-extrabold text-brand-primary">₹{product.mrp}</p>
            <p className="text-xs text-muted">MRP incl. of all taxes · {product.weight}</p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border-subtle">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-l-full px-4 py-2 flex items-center justify-center transition-colors hover:bg-border-subtle"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-r-full px-4 py-2 flex items-center justify-center transition-colors hover:bg-border-subtle"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button 
                type="button" 
                onClick={() => toggleWishlist(product)}
                className={cn(
                  "rounded-full p-2.5 flex items-center justify-center transition-all",
                  isInWishlist(product.id) ? "bg-brand-primary/10 text-brand-primary" : "bg-border-subtle/50 text-muted hover:bg-brand-primary/10 hover:text-brand-primary"
                )}
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-current")} />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="gap-2" onClick={() => addToCart({ ...product, quantity })}>
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </Button>
              <Button variant="outline" onClick={() => addToCart({ ...product, quantity })}>
                Buy Now
              </Button>
            </div>

            <Link to="/dealer" className="mt-4 inline-block text-sm font-semibold text-brand-primary hover:underline">
              Dealer Pricing Available →
            </Link>

            <div className="mt-8 border-t border-border-subtle pt-6">
              <div className="flex gap-1 border-b border-border-subtle relative">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-4 py-2.5 text-sm font-semibold transition-colors duration-200 relative',
                      activeTab === tab
                        ? 'text-brand-primary'
                        : 'text-muted hover:text-main',
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-brand-primary rounded-t-full transition-all duration-300" />
                    )}
                  </button>
                ))}
              </div>
              <div className="py-4 text-sm leading-relaxed text-muted">
                {activeTab === 'Description' && <p>{product.description}</p>}
                {activeTab === 'Nutrition' && (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(product.nutrition).map(([key, val]) => (
                      <div key={key} className="rounded-xl bg-border-subtle/50 p-3">
                        <p className="text-xs capitalize text-muted">{key}</p>
                        <p className="font-bold text-main">{val}</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'Ingredients' && (
                  <ul className="list-inside list-disc space-y-1">
                    {product.ingredients.map((ing) => (
                      <li key={ing}>{ing}</li>
                    ))}
                  </ul>
                )}
                {activeTab === 'Storage' && <p>{product.storage}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeading title="Related Products" align="left" className="!mb-8" />
          <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </RevealStagger>
        </div>

        <div className="mt-16">
          <SectionHeading title="Frequently Bought Together" align="left" className="!mb-8" />
          <div className="flex flex-wrap items-center justify-center gap-4 rounded-3xl bg-surface p-6 shadow-card md:p-8">
            {related.slice(0, 3).map((p, i) => (
              <div key={p.id} className="flex items-center gap-4">
                {i > 0 && <span className="text-2xl font-light text-slate-300">+</span>}
                <div className="text-center">
                  <img src={p.image} alt={p.name} className="h-24 object-contain" />
                  <p className="mt-1 text-xs font-semibold">{p.name}</p>
                  <p className="text-xs text-brand-primary">₹{p.mrp}</p>
                </div>
              </div>
            ))}
            <Button className="ml-4" onClick={() => {
              related.slice(0, 3).forEach((p) => addToCart(p))
            }}>Add Bundle — ₹15</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
