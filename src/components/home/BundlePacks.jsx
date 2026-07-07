import { Heart, Minus, Plus } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import { RevealStagger, RevealItem } from '@/components/shared/Reveal'
import { useStore } from '@/context/StoreContext'
import { products } from '@/data/products'
import { cn } from '@/utils/cn'

const bundles = [
  {
    id: 'b1',
    name: 'Medium Box',
    tagline: 'Moon Lite, Katori, Zig Zac',
    price: 35,
    mrp: 35,
    items: [products[0], products[1], products[6]],
  },
  {
    id: 'b2',
    name: 'Big Pack',
    tagline: 'All 7 Premium Flavours',
    price: 65,
    mrp: 65,
    items: products,
  },
  {
    id: 'b3',
    name: 'Small Box',
    tagline: 'Noodles, 5PM Pasta',
    price: 25,
    mrp: 25,
    items: [products[3], products[4]],
  },
  {
    id: 'b4',
    name: 'Kids Box',
    tagline: 'Moon Lite, Noodles, Salted Pipe',
    price: 35,
    mrp: 35,
    items: [products[0], products[3], products[5]],
  },
  {
    id: 'b5',
    name: 'Spicy Box',
    tagline: 'Dhamal Chokdi, Zig Zac',
    price: 25,
    mrp: 25,
    items: [products[2], products[6]],
  },
  {
    id: 'b6',
    name: 'Italian Box',
    tagline: '5PM Pasta x 4',
    price: 20,
    mrp: 20,
    items: [products[4], products[4], products[4], products[4]],
  },
]

export default function BundlePacks() {
  return (
    <section className="section-padding bg-brand-primary-light/40 pt-10">
      <div className="section-container">
        <div className="mb-10 rounded-[2.5rem] bg-brand-primary-light/60 p-8 md:p-12 lg:p-16">
          <SectionHeading
            title="Popular Bundle Pack"
            align="left"
            className="!mb-8"
          />
          <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  )
}

function BundleCard({ bundle }) {
  const { cart, addToCart, updateCartItem, toggleWishlist, isInWishlist } = useStore()
  
  // Create a virtual bundle product for cart
  const bundleProduct = {
    id: bundle.id,
    name: bundle.name,
    tagline: bundle.tagline,
    price: bundle.price,
    mrp: bundle.mrp,
    image: bundle.items[0]?.image,
    slug: bundle.id,
    weight: `${bundle.items.length} items`,
  }
  
  const cartItem = cart.find(item => item.id === bundle.id)
  const qty = cartItem ? cartItem.quantity : 0
  const wishlisted = isInWishlist(bundle.id)

  return (
    <RevealItem className="bundle-card">
      <div className="relative mb-4 flex h-40 items-center justify-center rounded-xl bg-surface p-4 shadow-sm">
        <button
          type="button"
          onClick={() => toggleWishlist(bundleProduct)}
          className={cn(
            'absolute right-3 top-3 z-10 transition-colors duration-200',
            wishlisted ? 'text-brand-primary' : 'text-slate-300 hover:text-brand-primary'
          )}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn('h-5 w-5', wishlisted && 'fill-current')} />
        </button>
        <div className="flex w-full items-center justify-center gap-2">
          {bundle.items.slice(0, 3).map((item, i) => (
            <img
              key={`${item.id}-${i}`}
              src={item.image}
              alt={item.name}
              className="h-24 w-20 object-contain drop-shadow-md"
              style={{
                transform: `rotate(${i === 0 ? -10 : i === 2 ? 10 : 0}deg) scale(${i === 1 ? 1.1 : 0.9})`,
                zIndex: i === 1 ? 10 : 5,
              }}
            />
          ))}
          {bundle.items.length > 3 && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-light text-xs font-bold text-brand-primary">
              +{bundle.items.length - 3}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col px-2">
        <h3 className="text-lg font-bold text-main">{bundle.name}</h3>
        <p className="mt-1 truncate text-xs text-muted">{bundle.tagline}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-main">₹{bundle.price}</p>
          
          <div className="flex items-center">
            {qty > 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-brand-primary bg-brand-primary-light px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => updateCartItem(bundle.id, qty - 1)}
                  className="text-brand-primary transition-colors duration-200 hover:text-brand-primary-dark"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-4 text-center text-sm font-bold text-brand-primary">{qty}</span>
                <button
                  type="button"
                  onClick={() => updateCartItem(bundle.id, qty + 1)}
                  className="text-brand-primary transition-colors duration-200 hover:text-brand-primary-dark"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(bundleProduct)}
                className="flex items-center gap-1 rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-brand-primary-dark"
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
