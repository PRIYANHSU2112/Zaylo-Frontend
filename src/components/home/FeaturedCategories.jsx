import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import { RevealItem } from '@/components/shared/Reveal'
import { Link } from 'react-router-dom'
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

export default function FeaturedCategories({ categories = [] }) {
  const scrollRef = useRef(null)
  const list = categories.length ? categories : []
  if (!list.length) return null

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
        <div className="mb-6 flex items-center justify-between">
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
          {list.slice(0, 12).map((cat) => (
            <RevealItem key={cat.id || cat.slug} className="snap-start shrink-0">
              <Link
                to={cat.comingSoon ? '/coming-soon' : `/products?category=${encodeURIComponent(cat.slug)}`}
                className={cn('category-icon-card w-[120px]', cat.comingSoon && 'opacity-60')}
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-border-subtle/30 text-2xl">
                  {cat.image ? (
                    <img src={cat.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    categoryIcons[cat.slug] || '🛒'
                  )}
                </div>
                <p className="text-center text-xs font-semibold text-main">{cat.name}</p>
              </Link>
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  )
}
