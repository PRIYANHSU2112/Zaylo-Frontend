import SectionHeading from '@/components/shared/SectionHeading'
import TestimonialCard from '@/components/shared/TestimonialCard'

export default function CustomerReviews({ testimonials = [] }) {
  const list = testimonials.length ? testimonials : []
  const scrollItems = list.length ? [...list, ...list, ...list] : []

  if (!list.length) return null

  return (
    <section className="section-padding overflow-hidden bg-surface">
      <div className="section-container">
        <SectionHeading
          title="What Our Clients Say"
          align="center"
          className="!mb-8"
        />

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent md:w-32" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent md:w-32" />

          <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
            {scrollItems.map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
