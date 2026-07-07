import { cn } from '@/utils/cn'

export default function FilterSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  sortBy,
  onSortChange,
  className,
}) {
  return (
    <aside className={cn('space-y-6', className)}>
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-main">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => onCategoryChange(cat.id)}
                className="h-4 w-4 rounded border-border-subtle text-brand-primary focus:ring-brand-primary/20"
              />
              <span className="text-body">{cat.name}</span>
              {cat.comingSoon && (
                <span className="text-xs text-brand-orange">Soon</span>
              )}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-main">
          Price
        </h3>
        <p className="text-sm text-muted">₹5 MRP (All products)</p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-main">
          Sort By
        </h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-field"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest First</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
    </aside>
  )
}
