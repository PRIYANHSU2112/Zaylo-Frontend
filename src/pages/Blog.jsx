import { useState } from 'react'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { blogPosts } from '@/data/blog'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import { cn } from '@/utils/cn'

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))]
  
  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory)

  // Use the first post as the featured post if 'All' is selected
  const featuredPost = activeCategory === 'All' ? blogPosts[0] : null
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts

  return (
    <div className="bg-background min-h-screen pb-24">
      <PageHero
        title="Our Blog"
        subtitle="Insights, recipes, and news from the ZAY'LO family."
      />

      <div className="section-container mt-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                activeCategory === category
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                  : "bg-surface border border-border-subtle text-muted hover:border-brand-primary/50 hover:text-brand-primary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post (only on 'All') */}
        {featuredPost && (
          <Reveal className="mb-12">
            <div className="group relative overflow-hidden rounded-[2rem] bg-surface shadow-card border border-border-subtle grid md:grid-cols-2 min-h-[400px]">
              <div className="relative h-64 md:h-full overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="mb-4 inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 rounded-full w-fit">
                  {featuredPost.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-main leading-tight mb-4 transition-colors group-hover:text-brand-primary">
                  {featuredPost.title}
                </h2>
                <p className="text-muted leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border-subtle">
                  <div className="flex items-center gap-4 text-xs font-medium text-muted">
                    <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {featuredPost.date}</div>
                    <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {featuredPost.readTime}</div>
                  </div>
                  <button className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-primary text-white transition-transform group-hover:translate-x-2 shadow-sm">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Regular Posts Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.1}>
              <div className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface shadow-card border border-border-subtle hover:shadow-hover transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-main bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-main leading-tight mb-3 transition-colors group-hover:text-brand-primary">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-subtle">
                    <div className="flex items-center gap-3 text-[11px] font-medium text-muted">
                      <span>{post.date}</span>
                      <span className="h-1 w-1 rounded-full bg-border-subtle" />
                      <span>{post.readTime}</span>
                    </div>
                    <span className="text-brand-primary font-bold text-sm flex items-center gap-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-muted">
            No articles found in this category.
          </div>
        )}
      </div>
    </div>
  )
}
