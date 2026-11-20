import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { Skeleton } from '@/components/shared/States'

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' },
]

/** Catalogue filters. Categories come from GET /categories; filtering happens server-side. */
export default function FilterSidebar({
  categories = [],
  categoriesLoading,
  selectedCategories,
  onCategoryChange,
  sortBy,
  onSortChange,
  minPrice = '',
  maxPrice = '',
  onPriceChange,
  inStock,
  onInStockChange,
  onReset,
  className,
}) {
  const [range, setRange] = useState({ min: minPrice, max: maxPrice })
  useEffect(() => setRange({ min: minPrice, max: maxPrice }), [minPrice, maxPrice])

  const applyPrice = (e) => {
    e.preventDefault()
    onPriceChange(range.min, range.max)
  }

  return (
    <aside className={cn('space-y-6', className)} aria-label="Product filters">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-main">Categories</h3>
        <div className="space-y-2">
          {categoriesLoading &&
            Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-5 w-3/4" />)}
          {categories.map((cat) => (
            <label
              key={cat.id}
              className={cn('flex items-center gap-2 text-sm', cat.comingSoon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer')}
            >
              <input
                type="checkbox"
                disabled={cat.comingSoon}
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => onCategoryChange(cat.slug)}
                className="h-4 w-4 rounded border-border-subtle accent-[var(--theme-primary)]"
              />
              <span className="text-body">{cat.name}</span>
              {cat.comingSoon && <span className="text-xs text-brand-orange">Soon</span>}
            </label>
          ))}
        </div>
      </div>

      <form onSubmit={applyPrice}>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-main">Price (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price"
            value={range.min}
            onChange={(e) => setRange((r) => ({ ...r, min: e.target.value }))}
            className="input-field !py-2.5"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            aria-label="Maximum price"
            value={range.max}
            onChange={(e) => setRange((r) => ({ ...r, max: e.target.value }))}
            className="input-field !py-2.5"
          />
        </div>
        <button type="submit" className="btn-secondary mt-3 w-full !py-2.5">Apply price</button>
      </form>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => onInStockChange(e.target.checked)}
          className="h-4 w-4 accent-[var(--theme-primary)]"
        />
        In stock only
      </label>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-main">Sort By</h3>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="input-field" aria-label="Sort products">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {onReset && (
        <button type="button" onClick={onReset} className="text-sm font-semibold text-brand-primary hover:underline">
          Clear all filters
        </button>
      )}
    </aside>
  )
}
