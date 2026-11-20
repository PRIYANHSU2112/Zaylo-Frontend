import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/shared/Reveal'
import BannerImage from '@/components/shared/BannerImage'
import { cn } from '@/utils/cn'

const isExternal = (url = '') => /^https?:\/\//i.test(url)
function CtaLink({ to = '/products', className, children }) {
  return isExternal(to) ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
  ) : (
    <Link to={to} className={className}>{children}</Link>
  )
}

/**
 * Admin-managed banner (any placement).
 * - Image-only banner (no heading): the uploaded creative fills the banner; separate
 *   mobile artwork is used below 768px when provided.
 * - Designed banner: Zaylo brand colours + heading/subtitle/CTA, with the uploaded side
 *   image, or a composition of real product photos when no image was uploaded.
 */
export default function PromoBanner({ banner, products = [], className }) {
  if (!banner) return null
  const dark = banner.variant === 'dark'
  const imageOnly = !banner.title && !banner.subtitle && banner.imageUrl

  if (imageOnly) {
    return (
      <Reveal className={cn('section-container', className)}>
        <CtaLink
          to={banner.link}
          className="relative block aspect-[4/5] overflow-hidden rounded-[1.5rem] shadow-card sm:aspect-[16/7] md:rounded-[2rem] lg:aspect-[16/6]"
        >
          <BannerImage src={banner.imageUrl} mobileSrc={banner.mobileImageUrl} alt={banner.badge || 'Offer'} />
        </CtaLink>
      </Reveal>
    )
  }

  const productShots = banner.imageUrl ? [] : products.filter((p) => p.image).slice(0, 3)

  return (
    <Reveal className={cn('section-container', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem]',
          dark ? 'bg-brand-dark' : 'bg-gradient-to-br from-brand-red via-[#e8341f] to-brand-orange',
        )}
      >
        {banner.bgImageUrl && (
          <>
            <BannerImage src={banner.bgImageUrl} mobileSrc={banner.mobileImageUrl} alt="" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/0" />
          </>
        )}
        {!banner.bgImageUrl && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'repeating-conic-gradient(from 0deg at 80% 50%, rgba(255,212,0,0.16) 0deg 7deg, transparent 7deg 18deg)',
              maskImage: 'radial-gradient(circle at 80% 50%, #000 0%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle at 80% 50%, #000 0%, transparent 70%)',
            }}
          />
        )}

        <div className="relative z-10 grid items-center md:grid-cols-2">
          <div className="max-w-lg p-7 md:p-12">
            {banner.badge && (
              <span className="mb-4 inline-flex rounded-full bg-brand-yellow px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-dark">
                {banner.badge}
              </span>
            )}
            {banner.title && <h3 className="text-3xl leading-tight text-white md:text-4xl lg:text-[2.75rem]">{banner.title}</h3>}
            {banner.subtitle && <p className="mt-3 text-sm leading-relaxed text-white/85 md:text-base">{banner.subtitle}</p>}
            {banner.cta && (
              <CtaLink
                to={banner.link}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-brand-dark shadow-lg transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                {banner.cta}
                <ArrowRight className="h-4 w-4" />
              </CtaLink>
            )}
          </div>

          {banner.imageUrl ? (
            <div className="relative min-h-[240px] overflow-hidden md:min-h-[340px]">
              <BannerImage src={banner.imageUrl} mobileSrc={banner.mobileImageUrl} alt={banner.title} imgClassName="object-contain p-4 md:p-8" />
            </div>
          ) : productShots.length > 0 ? (
            <div className="flex items-end justify-center gap-2 px-6 pb-8 md:justify-end md:pb-10 md:pr-12">
              {productShots.map((p, i) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className={cn(
                    'w-[30%] max-w-[150px] rounded-2xl bg-white p-1.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]',
                    i === 0 && '-rotate-6',
                    i === 1 && 'z-10 scale-110',
                    i === 2 && 'rotate-6',
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Reveal>
  )
}
