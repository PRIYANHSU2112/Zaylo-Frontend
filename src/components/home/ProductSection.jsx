import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import ProductCard from '@/components/shared/ProductCard'
import { RevealStagger } from '@/components/shared/Reveal'
import { cn } from '@/utils/cn'

/** Home product rail (featured / popular / new arrivals / best sellers). Hidden when empty. */
export default function ProductSection({ id, title, products = [], seeAllHref = '/products', tone = 'surface', className }) {
  const list = products.slice(0, 8)
  if (!list.length) return null

  return (
    <section id={id} className={cn('section-padding', tone === 'cream' ? 'bg-surface-cream' : 'bg-surface', className)}>
      <div className="section-container">
        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <SectionHeading title={title} align="left" className="!mb-0" />
          {seeAllHref && (
            <Link
              to={seeAllHref}
              className="rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-primary transition-colors hover:bg-brand-primary-dark"
            >
              See all
            </Link>
          )}
        </div>
        <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
