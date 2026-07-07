import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import CategoryCard from '@/components/shared/CategoryCard'
import { categories } from '@/data/categories'
import { products } from '@/data/products'

export default function ProductCategories() {
  const productMap = Object.fromEntries(products.map((p) => [p.slug, p.image]))

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <SectionHeading subtitle="Full Range" title="All Product Categories" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              productImage={productMap[cat.slug]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function Recipes() {
  return (
    <section className="section-padding bg-surface">
      <div className="section-container">
        <SectionHeading
          subtitle="In The Kitchen"
          title="Snack Recipes"
          linkText="All Recipes"
          linkHref="/coming-soon"
          align="left"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: 'ZAY\'LO Chaat Bowl', desc: 'Mix Moon Lite with onions, chutney & sev.', time: '10 min' },
            { title: 'Spicy Zig Zac Nachos', desc: 'Top Zig Zac with cheese & salsa.', time: '15 min' },
            { title: 'Kids Snack Mix', desc: 'Combine Noodles & Salted Pipe.', time: '5 min' },
          ].map((recipe) => (
            <Link
              key={recipe.title}
              to="/coming-soon"
              className="bento-card group p-6 md:p-8"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/20 text-lg">
                🍽️
              </div>
              <h3 className="text-lg font-bold text-main group-hover:text-brand-primary">{recipe.title}</h3>
              <p className="mt-2 text-sm text-muted">{recipe.desc}</p>
              <p className="mt-3 text-xs font-semibold text-brand-primary">{recipe.time}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
