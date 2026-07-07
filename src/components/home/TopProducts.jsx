import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import ProductCard from '@/components/shared/ProductCard'
import { RevealStagger } from '@/components/shared/Reveal'
import { products } from '@/data/products'

export default function TopProducts() {
  return (
    <section className="section-padding bg-surface pt-10">
      <div className="section-container">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <SectionHeading
            title="Popular Product"
            align="left"
            className="!mb-0"
          />
          <Link
            to="/products"
            className="rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-primary transition-all hover:bg-brand-primary-dark"
          >
            See all
          </Link>
        </div>
        <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
