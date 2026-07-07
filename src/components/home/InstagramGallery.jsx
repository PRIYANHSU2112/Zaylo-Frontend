import { products } from '@/data/products'
import SectionHeading from '@/components/shared/SectionHeading'

export default function InstagramGallery() {
  return (
    <section className="section-padding bg-surface">
      <div className="section-container">
        <SectionHeading subtitle="@zaylosnacks" title="Instagram Gallery" align="left" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`overflow-hidden rounded-2xl bg-gradient-to-br from-grey-soft/30 to-white ${
                i === 0 ? 'row-span-2 md:col-span-1' : ''
              }`}
            >
              <img
                src={product.image}
                alt={`ZAY'LO ${product.name} on Instagram`}
                width={300}
                height={400}
                loading="lazy"
                className="h-full w-full object-contain p-4 transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function NewsBlogs() {
  const posts = [
    { title: 'The Story Behind Swad Jo Dil Jeet Le', date: 'Jun 15, 2026', category: 'Brand' },
    { title: 'Why ₹5 Snacks Are Changing Indian FMCG', date: 'Jun 10, 2026', category: 'Industry' },
    { title: '5 Creative Ways to Enjoy Moon Lite', date: 'Jun 5, 2026', category: 'Recipes' },
  ]

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <SectionHeading subtitle="Latest Updates" title="News & Blogs" align="left" />
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="bento-card p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
                {post.category}
              </span>
              <h3 className="mt-2 text-lg font-bold text-main">{post.title}</h3>
              <p className="mt-2 text-xs text-muted">{post.date}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
