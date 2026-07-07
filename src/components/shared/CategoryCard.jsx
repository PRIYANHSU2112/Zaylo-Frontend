import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function CategoryCard({ category, productImage, className }) {
  if (category.comingSoon) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-border-subtle bg-surface/40 p-6',
          className,
        )}
      >
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-border-subtle/40">
          <Lock className="h-5 w-5 text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-muted">{category.name}</p>
        <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
          Coming Soon
        </span>
      </div>
    )
  }

  return (
    <Link
      to={`/products/${category.slug}`}
      className={cn(
        'group flex flex-col items-center rounded-[1.75rem] border border-border-subtle/80 bg-surface p-5 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-brand-primary/15 hover:shadow-hover',
        className,
      )}
    >
      <div className="product-stage flex h-24 w-24 items-center justify-center rounded-2xl p-2">
        {productImage ? (
          <img
            src={productImage}
            alt={category.name}
            width={96}
            height={96}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="text-2xl font-bold text-brand-primary">{category.name[0]}</span>
        )}
      </div>
      <p className="mt-4 text-sm font-bold text-main transition-colors group-hover:text-brand-primary">
        {category.name}
      </p>
    </Link>
  )
}
