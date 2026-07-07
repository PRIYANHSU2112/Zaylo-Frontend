import { useMemo, useState } from 'react'
import { Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import ProductCard from '@/components/shared/ProductCard'
import FilterSidebar from '@/components/shared/FilterSidebar'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import PageHero from '@/components/shared/PageHero'
import { RevealStagger } from '@/components/shared/Reveal'
import { products } from '@/data/products'
import { categories } from '@/data/categories'
import { Link } from 'react-router-dom'

export default function Products() {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortBy, setSortBy] = useState('popular')
  const [listView, setListView] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const activeCategories = categories.filter((c) => !c.comingSoon)

  const filtered = useMemo(() => {
    let result = [...products]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.flavor.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q),
      )
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.slug))
    }
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount)
    }
    return result
  }, [search, selectedCategories, sortBy])

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
    // On mobile, clicking a filter might be intended to just toggle, but closing after selection is a UX preference
    // We'll let them keep it open to select multiple, so we won't close it automatically here.
  }

  return (
    <div className="bg-background">
      <PageHero
        title="All Products"
        subtitle="Seven iconic ZAY'LO flavours — premium quality, unbeatable ₹5 value."
        breadcrumb={
          <>
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link> / Products
          </>
        }
      />

      <div className="section-container section-padding !pt-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-lg flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by name, flavour..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-11"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2.5 text-sm font-medium text-body lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <span className="text-sm text-muted">{filtered.length} products</span>
            <div className="flex rounded-full border border-border-subtle bg-surface p-1">
              <button
                type="button"
                onClick={() => setListView(false)}
                className={`rounded-full p-2 transition-colors duration-200 ${!listView ? 'bg-brand-primary text-white' : 'text-muted hover:bg-brand-primary/10 hover:text-brand-primary'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setListView(true)}
                className={`rounded-full p-2 transition-colors duration-200 ${listView ? 'bg-brand-primary text-white' : 'text-muted hover:bg-brand-primary/10 hover:text-brand-primary'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            categories={activeCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={toggleCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            className={`${showFilters ? 'block' : 'hidden'} lg:block`}
          />

          <RevealStagger
            className={`grid gap-6 ${listView ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                listView={listView}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </RevealStagger>
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted">No products match your search.</p>
        )}
      </div>

      <Modal open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} title={quickViewProduct?.name}>
        {quickViewProduct && (
          <div className="text-center">
            <div className="product-stage mx-auto max-w-xs p-6">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="mx-auto h-56 object-contain" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{quickViewProduct.description}</p>
            <p className="mt-3 text-2xl font-extrabold text-brand-primary">₹{quickViewProduct.mrp}</p>
            <Link to={`/products/${quickViewProduct.slug}`} className="mt-5 inline-block">
              <Button>View Full Details</Button>
            </Link>
          </div>
        )}
      </Modal>
    </div>
  )
}
