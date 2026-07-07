import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Reveal from '@/components/shared/Reveal'
import { cn } from '@/utils/cn'

export default function PromoBanner({ banner, productImage, bgImage, variant = 'default', className }) {
  const isDark = variant === 'dark'

  return (
    <Reveal className={cn('section-container', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]',
          !bgImage && (isDark
            ? 'bg-surface-dark'
            : `bg-gradient-to-br ${banner.gradient}`),
        )}
      >
        {bgImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${bgImage})` }} 
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </>
        )}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-surface/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-black/5 blur-2xl" />

        <div className="relative z-10 grid items-center gap-8 p-8 md:grid-cols-2 md:p-12 lg:p-14">
          <div className={cn('max-w-lg', productImage && 'md:pr-4')}>
            <Badge
              variant={isDark ? 'gold' : 'dark'}
              className={cn(
                'mb-5',
                !isDark && 'bg-surface/20 text-white backdrop-blur-sm',
              )}
            >
              {banner.badge}
            </Badge>
            <h3 className="text-2xl font-extrabold leading-tight text-white md:text-3xl lg:text-4xl">
              {banner.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
              {banner.subtitle}
            </p>
            <Link
              to={banner.link}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-main shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {banner.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {productImage && (
            <div className="relative flex justify-center md:justify-end">
              <div className="absolute inset-0 rounded-full bg-surface/10 blur-2xl" />
              <img
                src={productImage}
                alt=""
                className="relative z-10 h-48 w-auto object-contain drop-shadow-2xl md:h-64 lg:h-72"
              />
            </div>
          )}
        </div>
      </div>
    </Reveal>
  )
}
