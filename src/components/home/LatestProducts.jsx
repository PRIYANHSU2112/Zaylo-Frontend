import SectionHeading from '@/components/shared/SectionHeading'
import ProductCard from '@/components/shared/ProductCard'
import { RevealStagger } from '@/components/shared/Reveal'
import { products } from '@/data/products'

export default function LatestProducts() {
  const latest = [...products]
    .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    .slice(0, 4)

  return (
    <section className="section-padding bg-surface-cream">
      <div className="section-container">
        <SectionHeading subtitle="Just Arrived" title="Latest Products" align="left" />
        <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
