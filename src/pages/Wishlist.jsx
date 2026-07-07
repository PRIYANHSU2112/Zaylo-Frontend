import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import Reveal from '@/components/shared/Reveal'
import PageHero from '@/components/shared/PageHero'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore()

  if (wishlist.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <PageHero
          title="Your Wishlist"
          subtitle="You haven't saved any items yet."
        />
        <div className="section-container flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-cream text-brand-primary mb-6">
            <Heart className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-main mb-3">Your wishlist is empty</h3>
          <p className="text-muted mb-8 max-w-sm mx-auto">
            Save your favorite snacks here so you can easily find them later!
          </p>
          <Link to="/products">
            <Button>Explore Snacks</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <PageHero
        title="Your Wishlist"
        subtitle={`You have ${wishlist.length} saved items.`}
      />
      
      <div className="section-container mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.05} className="group relative rounded-3xl bg-surface p-5 shadow-card border border-border-subtle hover:-translate-y-1 hover:shadow-hover transition-all duration-300">
            <button
              onClick={() => toggleWishlist(item)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-brand-primary backdrop-blur-sm transition-all hover:bg-brand-primary hover:text-white"
              aria-label="Remove from Wishlist"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <Link to={`/products/${item.slug}`} className="block">
              <div className="relative mb-5 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-surface-cream">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-3/4 w-auto object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-brand-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                  {item.category}
                </span>
                <span className="text-xs font-medium text-muted">{item.weight}</span>
              </div>

              <h3 className="text-lg font-bold leading-tight text-main">{item.name}</h3>
              <p className="mt-1 text-sm text-muted line-clamp-1">{item.tagline}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-brand-primary">₹{item.price}</span>
                  {item.mrp > item.price && (
                    <span className="text-xs font-medium text-muted line-through">₹{item.mrp}</span>
                  )}
                </div>
              </div>
            </Link>

            <Button 
              className="mt-5 w-full flex items-center justify-center gap-2"
              onClick={() => addToCart(item)}
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
