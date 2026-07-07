import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function TestimonialCard({ testimonial, className }) {
  // Use generic avatars based on name initials, but styled cleanly
  return (
    <div className={cn('testimonial-slide', className)}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-light text-sm font-bold text-brand-primary-dark">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-main">{testimonial.name}</p>
          <p className="text-xs text-muted">{testimonial.role}</p>
        </div>
      </div>
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < testimonial.rating
                ? 'fill-brand-yellow text-brand-yellow'
                : 'fill-border-subtle text-border-subtle'
            )}
          />
        ))}
      </div>
      <p className="text-xs leading-relaxed text-muted">
        &ldquo;{testimonial.text}&rdquo;
      </p>
    </div>
  )
}
