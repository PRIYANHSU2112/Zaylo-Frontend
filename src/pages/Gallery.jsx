import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { galleryImages } from '@/data/gallery'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import { cn } from '@/utils/cn'

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  
  const categories = ['All', ...new Set(galleryImages.map(img => img.category))]
  
  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory)

  return (
    <div className="bg-background min-h-screen pb-24">
      <PageHero
        title="Our Gallery"
        subtitle="Explore the world of ZAY'LO through our lens."
      />

      <div className="section-container mt-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300",
                activeCategory === category
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                  : "bg-surface border border-border-subtle text-muted hover:border-brand-primary/50 hover:text-brand-primary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((image, i) => (
            <Reveal key={image.id} delay={i * 0.05} className="break-inside-avoid">
              <div className="group relative overflow-hidden rounded-[1.5rem] bg-surface shadow-card border border-border-subtle cursor-pointer">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="mb-2 inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md rounded-full w-fit">
                      {image.category}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-tight translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {image.title}
                    </h3>
                  </div>
                  
                  <div className="absolute top-4 right-4 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 -translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-muted">
            No images found in this category.
          </div>
        )}
      </div>
    </div>
  )
}
