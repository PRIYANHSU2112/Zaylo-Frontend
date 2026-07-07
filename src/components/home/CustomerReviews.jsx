import SectionHeading from '@/components/shared/SectionHeading'
import TestimonialCard from '@/components/shared/TestimonialCard'
import { testimonials } from '@/data/content'

// Duplicate testimonials to create an infinite scroll effect
const scrollItems = [...testimonials, ...testimonials, ...testimonials]

export default function CustomerReviews() {
  return (
    <section className="section-padding overflow-hidden bg-surface">
      <div className="section-container">
        <SectionHeading
          title="What Our Clients Say"
          align="center"
          className="!mb-12"
        />
        
        {/* Infinite auto-scrolling row — uses CSS animation for pause-on-hover */}
        <div className="relative overflow-hidden">
          {/* Gradient masks for fading edges */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent md:w-32" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent md:w-32" />
          
          <div
            className="flex gap-6 animate-marquee hover:[animation-play-state:paused]"
          >
            {scrollItems.map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          {testimonials.slice(0, 3).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors duration-200 ${i === 1 ? 'bg-brand-primary' : 'bg-border-subtle'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
