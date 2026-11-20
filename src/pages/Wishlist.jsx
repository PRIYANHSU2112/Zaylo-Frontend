import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Button from '@/components/ui/Button'
import SEO from '@/components/shared/SEO'
import PageHero from '@/components/shared/PageHero'
import ProductCard from '@/components/shared/ProductCard'
import { RevealStagger } from '@/components/shared/Reveal'
import { EmptyState } from '@/components/shared/States'
import { useStore } from '@/context/StoreContext'
import { useAuth } from '@/context/AuthContext'

export default function Wishlist() {
  const { wishlist, syncing } = useStore()
  const { isAuthenticated } = useAuth()

  return (
    <div className="bg-background">
      <SEO title="Wishlist" path="/wishlist" noindex />
      <PageHero title="My Wishlist" subtitle={wishlist.length ? `${wishlist.length} saved item${wishlist.length > 1 ? 's' : ''}` : undefined} />
      <div className="section-container py-12">
        {!isAuthenticated && wishlist.length > 0 && (
          <p className="mb-6 rounded-2xl bg-brand-primary-light px-4 py-3 text-sm text-main">
            <Link to="/login?next=/wishlist" className="font-semibold text-brand-primary">Log in</Link> to save your wishlist across devices.
          </p>
        )}
        {wishlist.length === 0 && !syncing ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            message="Tap the heart on any product to save it for later."
            action={<Link to="/products"><Button>Browse products</Button></Link>}
          />
        ) : (
          <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlist.map((p) => <ProductCard key={p.id} product={p} />)}
          </RevealStagger>
        )}
      </div>
    </div>
  )
}
