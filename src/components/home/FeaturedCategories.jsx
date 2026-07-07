import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import { RevealItem } from '@/components/shared/Reveal'
import { categories } from '@/data/categories'
import { cn } from '@/utils/cn'

// Example icons for categories to match the eGrocery style
const categoryIcons = {
  'namkeen': '🥨',
  'ready-to-eat': '🍛',
  'chips': '🥔',
  'noodles': '🍜',
  'frozen': '🧊',
  'healthy': '🥗',
  'kids': '👶',
  'beverages': '🧃',
  'biscuits': '🍪',
  'seasonal': '🌟',
  'moon-lite': '🌙',
  'katori': '🥣',
  'dhamal-chokdi': '❌',
  '5pm-pasta': '🍝',
  'salted-pipe': '🧪',
  'zig-zac': '〰️',
}

export default function FeaturedCategories() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section id="categories" className="section-padding bg-surface">
      <div className="section-container relative">
        <div className="mb-10 flex items-center justify-between">
          <SectionHeading
            title="Category"
            align="left"
            className="!mb-0"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll categories left"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-border-subtle/50 text-main transition-all duration-200 hover:bg-brand-primary hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll categories right"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white shadow-primary transition-all duration-200 hover:bg-brand-primary-dark"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="hide-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
        >
          {categories.slice(0, 10).map((cat, i) => (
            <RevealItem key={cat.id} className="snap-start shrink-0">
              <button
                type="button"
                className={cn(
                  'category-icon-card w-[120px]',
                  i === 1 ? 'active' : ''
                )}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-border-subtle/30 text-2xl">
                  {categoryIcons[cat.slug] || '🛒'}
                </div>
                <p className="text-center text-xs font-semibold text-main">{cat.name}</p>
              </button>
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  )
}
