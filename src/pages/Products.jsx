import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/shared/ProductCard'
import FilterSidebar from '@/components/shared/FilterSidebar'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import PageHero from '@/components/shared/PageHero'
import SEO from '@/components/shared/SEO'
import { RevealStagger } from '@/components/shared/Reveal'
import { EmptyState, ErrorState, ProductCardSkeleton, formatINR } from '@/components/shared/States'
import { useBanners, useCategories, useProducts } from '@/hooks/useCatalog'
import PromoBanner from '@/components/shared/PromoBanner'
import { cn } from '@/utils/cn'

const PAGE_SIZE = 12

export default function Products() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const sort = params.get('sort') || 'popular'
  const page = Math.max(1, Number(params.get('page')) || 1)
  const category = params.get('category') || ''
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const inStock = params.get('inStock') === 'true'
  const featured = params.get('featured') === 'true'
  const selected = useMemo(() => category.split(',').filter(Boolean), [category])

  const [search, setSearch] = useState(q)
  const [listView, setListView] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [quickView, setQuickView] = useState(null)

  useEffect(() => setSearch(q), [q])

  const update = (patch, { resetPage = true } = {}) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v === '' || v == null || v === false ? next.delete(k) : next.set(k, String(v))))
    if (resetPage) next.delete('page')
    setParams(next, { replace: false })
  }

  // Debounced search → URL
  useEffect(() => {
    if (search === q) return undefined
    const t = setTimeout(() => update({ q: search.trim() }), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const query = { q, sort, page, limit: PAGE_SIZE, category, minPrice, maxPrice, inStock: inStock || undefined, featured: featured || undefined }
  const bannersQuery = useBanners('products')
  // Category-specific banner (link contains ?category=<slug>) wins over the generic one
  const topBanner =
    (category && bannersQuery.data?.find((b) => b.link?.includes('category=' + selected[0]))) ||
    bannersQuery.data?.find((b) => !b.link?.includes('category='))
  const { data, isLoading, isError, error, refetch, isFetching } = useProducts(query)
  const categoriesQuery = useCategories()
  const products = data?.data || []
  const meta = data?.meta

  const toggleCategory = (slug) => {
    const next = selected.includes(slug) ? selected.filter((c) => c !== slug) : [...selected, slug]
    update({ category: next.join(',') })
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const hasFilters = q || category || minPrice || maxPrice || inStock || featured || sort !== 'popular'

  return (
    <div className="bg-background">
      <SEO
        title="Shop Crispy Namkeen & Puffed Snacks"
        description="Explore the full ZAY'LO snacks range — search, filter by category and price, and order online."
        path="/products"
      />
      <PageHero
        title="All Products"
        subtitle={meta ? `${meta.total} product${meta.total === 1 ? '' : 's'} available` : 'Browse our complete range'}
        breadcrumb={
          <>
            <Link to="/" className="transition-colors hover:text-brand-primary">Home</Link> / Products
          </>
        }
      />

      {topBanner && <PromoBanner banner={topBanner} products={products} className="pt-6" />}

      <div className="section-container section-padding !pt-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-lg flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search by name, flavour..."
              aria-label="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-11"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2.5 text-sm font-medium text-body lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            {meta && <span className="text-sm text-muted">{meta.total} products</span>}
            <div className="flex rounded-full border border-border-subtle bg-surface p-1">
              {[
                { v: false, Icon: LayoutGrid, label: 'Grid view' },
                { v: true, Icon: List, label: 'List view' },
              ].map(({ v, Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  aria-pressed={listView === v}
                  onClick={() => setListView(v)}
                  className={cn(
                    'rounded-full p-2 transition-colors duration-200',
                    listView === v ? 'bg-brand-primary text-white' : 'text-muted hover:bg-brand-primary/10 hover:text-brand-primary',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            categories={categoriesQuery.data || []}
            categoriesLoading={categoriesQuery.isLoading}
            selectedCategories={selected}
            onCategoryChange={toggleCategory}
            sortBy={sort}
            onSortChange={(v) => update({ sort: v === 'popular' ? '' : v })}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={(min, max) => update({ minPrice: min, maxPrice: max })}
            inStock={inStock}
            onInStockChange={(v) => update({ inStock: v ? 'true' : '' })}
            onReset={hasFilters ? () => setParams(new URLSearchParams()) : undefined}
            className={cn(showFilters ? 'block' : 'hidden', 'lg:block')}
          />

          <div className={cn('transition-opacity duration-300', isFetching && !isLoading && 'opacity-60')}>
            {isError ? (
              <ErrorState title="Couldn't load products" error={error} onRetry={refetch} />
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                message="Try a different search or clear the filters."
                action={hasFilters && <Button variant="secondary" onClick={() => setParams(new URLSearchParams())}>Clear filters</Button>}
              />
            ) : (
              <RevealStagger
                key={`${q}|${category}|${sort}|${page}|${minPrice}|${maxPrice}|${inStock}`}
                className={cn('grid gap-6', listView ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3')}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} listView={listView} onQuickView={setQuickView} />
                ))}
              </RevealStagger>
            )}

            {meta && meta.totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => update({ page: page - 1 }, { resetPage: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <span key={p} className="flex items-center gap-2">
                      {i > 0 && p - arr[i - 1] > 1 && <span className="text-muted">…</span>}
                      <button
                        type="button"
                        onClick={() => update({ page: p }, { resetPage: false })}
                        aria-current={p === page ? 'page' : undefined}
                        className={cn(
                          'h-10 min-w-10 rounded-full px-3 text-sm font-semibold',
                          p === page ? 'bg-brand-primary text-white' : 'border border-border-subtle bg-surface text-main hover:border-brand-primary',
                        )}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => update({ page: page + 1 }, { resetPage: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      <Modal open={!!quickView} onClose={() => setQuickView(null)} title={quickView?.name}>
        {quickView && (
          <div className="text-center">
            <div className="product-stage mx-auto max-w-xs p-6">
              <img src={quickView.image} alt={quickView.name} className="mx-auto h-56 object-contain" />
            </div>
            {quickView.tagline && <p className="mt-4 text-sm leading-relaxed text-muted">{quickView.tagline}</p>}
            <p className="mt-3 text-2xl font-extrabold text-brand-primary">{formatINR(quickView.price)}</p>
            <Link to={`/products/${quickView.slug}`} className="mt-5 inline-block" onClick={() => setQuickView(null)}>
              <Button>View Full Details</Button>
            </Link>
          </div>
        )}
      </Modal>
    </div>
  )
}
