import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Wallet, PackageCheck } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import BannerImage from '@/components/shared/BannerImage'
import { cn } from '@/utils/cn'

const AUTOPLAY_MS = 5500
const SWIPE_DISTANCE = 60
const SWIPE_VELOCITY = 400
const EASE = [0.22, 1, 0.36, 1]

/* Lacy-inspired palettes: red / yellow / dark */
const THEMES = {
  red: {
    bg: 'bg-[#d71920]',
    rays: 'rgba(255,212,0,0.22)',
    title: 'text-white',
    accent: 'text-brand-yellow',
    body: 'text-white/85',
    badge: 'bg-brand-yellow text-[#1a1e2c]',
    cta: 'bg-brand-yellow text-[#1a1e2c] hover:bg-white',
    price: 'bg-white text-[#d71920]',
  },
  yellow: {
    bg: 'bg-brand-yellow',
    rays: 'rgba(215,25,32,0.14)',
    title: 'text-[#1a1e2c]',
    accent: 'text-[#d71920]',
    body: 'text-[#1a1e2c]/80',
    badge: 'bg-[#d71920] text-white',
    cta: 'bg-[#d71920] text-white hover:bg-[#1a1e2c]',
    price: 'bg-[#d71920] text-white',
  },
  dark: {
    bg: 'bg-[#1a1e2c]',
    rays: 'rgba(215,25,32,0.28)',
    title: 'text-white',
    accent: 'text-brand-yellow',
    body: 'text-white/75',
    badge: 'bg-[#d71920] text-white',
    cta: 'bg-[#d71920] text-white hover:bg-brand-yellow hover:text-[#1a1e2c]',
    price: 'bg-brand-yellow text-[#1a1e2c]',
  },
}
const THEME_ORDER = ['red', 'yellow', 'dark']

const isExternal = (url = '') => /^https?:\/\//i.test(url)

function SmartLink({ to = '/products', className, children, ...rest }) {
  if (isExternal(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={className} {...rest}>
      {children}
    </Link>
  )
}

/** Build slides from real home API data (admin hero images, promos, bundles, products). */
function buildSlides(home) {
  const slides = []

  const heroBanners = home.banners?.hero || []
  const showcase = (home.featuredProducts?.length ? home.featuredProducts : home.popularProducts || []).filter((p) => p.image)

  // Admin → Banners (Hero) is the source of truth: when hero banners exist, the slider shows
  // exactly those, in their display order. Auto-built slides are only a fallback.
  if (heroBanners.length || home.landingImages?.some((i) => i.slot === 'hero')) {
    heroBanners.forEach((b) => {
      if (b.imageUrl && !b.title) {
        // finished creative (heading/CTA baked into the artwork) — full-bleed, mobile art < 768px
        slides.push({ type: 'image', id: `banner-${b.id}`, url: b.imageUrl, mobileUrl: b.mobileImageUrl, link: b.link, alt: b.alt || b.badge })
      } else if (b.title) {
        slides.push({
          type: 'designed',
          id: `promo-${b.id}`,
          badge: b.badge,
          eyebrow: b.badge,
          title: b.title,
          subtitle: b.subtitle,
          images: b.imageUrl ? [{ src: b.imageUrl, alt: b.title, cover: true }] : showcase.slice(0, 3).map((p) => ({ src: p.image, alt: p.name })),
          bgImage: b.bgImageUrl || '',
          cta: b.cta || 'Shop Now',
          link: b.link || '/products',
        })
      }
    })
    ;(home.landingImages || [])
      .filter((img) => img.slot === 'hero' && img.url)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .forEach((img) => slides.push({ type: 'image', id: `img-${img.id}`, ...img }))
    return slides.map((sl, i) => ({ ...sl, theme: THEMES[THEME_ORDER[i % THEME_ORDER.length]] }))
  }

  // ---- Fallback (no hero banners yet): build slides from real catalogue data ----
  ;(home.landingImages || [])
    .filter((img) => img.slot === 'hero' && img.url)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .forEach((img) => slides.push({ type: 'image', id: `img-${img.id}`, ...img }))

  // 2. Bundle packs — charged at the admin-set bundle price (server re-prices at checkout).
  ;(home.bundles || [])
    .filter((b) => b.items?.length && (b.stock ?? 1) > 0)
    .slice(0, 2)
    .forEach((b) => {
      const off = b.mrp > b.price ? Math.round(((b.mrp - b.price) / b.mrp) * 100) : 0
      slides.push({
        type: 'designed',
        id: `bundle-${b.id}`,
        badge: off ? `${off}% OFF` : 'Combo Pack',
        eyebrow: 'Combo Deals',
        title: b.name,
        subtitle: b.tagline || b.items.map((i) => i.name).join(' + '),
        price: b.price,
        mrp: b.mrp > b.price ? b.mrp : null,
        images: b.items.slice(0, 3).map((i) => ({ src: i.image, alt: i.name })),
        cta: 'Shop Now',
        link: '/#bundles',
      })
    })

  // 4. Featured (else popular) products showcase — real uploaded product photos
  const popular = showcase
  if (popular.length) {
    const minPrice = Math.min(...popular.map((p) => Number(p.price ?? p.mrp) || 0).filter(Boolean))
    slides.splice(Math.min(1, slides.length), 0, {
      type: 'designed',
      id: 'popular',
      badge: home.featuredProducts?.length ? 'Featured' : 'Our Range',
      eyebrow: 'Crispy • Crunchy • Fresh',
      title: 'Your Favourite Snacks',
      subtitle: popular.slice(0, 3).map((p) => p.name).join(', ') + ' & more — delivered fresh.',
      price: Number.isFinite(minPrice) && minPrice > 0 ? minPrice : null,
      priceLabel: 'Starting at',
      images: popular.slice(0, 3).map((p) => ({ src: p.image, alt: p.name })),
      cta: 'Shop Now',
      link: '/products',
    })
  }

  return slides.map((s, i) => ({ ...s, theme: THEMES[THEME_ORDER[i % THEME_ORDER.length]] }))
}

const contentVariants = {
  enter: {},
  center: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  exit: {},
}
const itemVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

function Rays({ color }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-90"
      style={{
        background: `repeating-conic-gradient(from 0deg at 72% 55%, ${color} 0deg 7deg, transparent 7deg 18deg)`,
        maskImage: 'radial-gradient(circle at 72% 55%, #000 0%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(circle at 72% 55%, #000 0%, transparent 75%)',
      }}
    />
  )
}

function ProductStack({ images, priority }) {
  const cover = images.length === 1 && images[0].cover
  if (cover) {
    return (
      <motion.div
        variants={itemVariants}
        className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-4 ring-white/40"
      >
        <BannerImage src={images[0].src} alt={images[0].alt} priority={priority} imgClassName="scale-[1.15]" />
      </motion.div>
    )
  }

  const layout = [
    'z-10 -rotate-6 translate-x-6 translate-y-4',
    'z-20 scale-110',
    'z-10 rotate-6 -translate-x-6 translate-y-4',
  ]
  return (
    <div className="relative flex items-end justify-center">
      {images.map((img, i) => (
        <motion.div
          key={`${img.src}-${i}`}
          variants={itemVariants}
          className={cn(
            'relative w-[30%] max-w-[170px] rounded-2xl bg-white p-1.5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] sm:p-2',
            images.length === 1 ? 'w-[55%] max-w-[260px]' : layout[i],
          )}
        >
          <img
            src={img.src}
            alt={img.alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="aspect-[4/5] w-full rounded-xl object-contain"
          />
        </motion.div>
      ))}
    </div>
  )
}

function DesignedSlide({ slide, priority }) {
  const t = slide.theme
  const HeadingTag = priority ? 'h1' : 'h2'
  return (
    <div className={cn('absolute inset-0', t.bg)}>
      {slide.bgImage ? (
        <>
          <BannerImage src={slide.bgImage} priority={priority} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1e2c]/90 via-[#1a1e2c]/55 to-transparent" />
        </>
      ) : (
        <Rays color={t.rays} />
      )}
      {/* diagonal accent stripe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 hidden h-24 w-[60%] -skew-x-[20deg] bg-white/10 md:block"
      />

      <motion.div
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="section-container relative grid h-full items-center gap-6 py-10 md:grid-cols-[1.1fr_1fr] md:py-0"
      >
        <div className={cn('max-w-xl text-center md:text-left', slide.bgImage && 'text-white')}>
          {slide.badge && (
            <motion.span
              variants={itemVariants}
              className={cn(
                'inline-flex rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] shadow-sm md:text-xs',
                t.badge,
              )}
            >
              {slide.badge}
            </motion.span>
          )}
          {slide.eyebrow && slide.eyebrow !== slide.badge && (
            <motion.p
              variants={itemVariants}
              className={cn('mt-4 font-display text-sm font-bold uppercase tracking-widest', t.accent)}
            >
              {slide.eyebrow}
            </motion.p>
          )}
          <motion.div variants={itemVariants}>
            <HeadingTag
              className={cn(
                'mt-3 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl',
                slide.bgImage ? 'text-white' : t.title,
              )}
            >
              {slide.title}
            </HeadingTag>
          </motion.div>
          {slide.subtitle && (
            <motion.p
              variants={itemVariants}
              className={cn(
                'mx-auto mt-4 line-clamp-2 max-w-md text-sm leading-relaxed md:mx-0 md:text-base',
                slide.bgImage ? 'text-white/85' : t.body,
              )}
            >
              {slide.subtitle}
            </motion.p>
          )}

          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start"
          >
            <SmartLink
              to={slide.link}
              className={cn(
                'group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide shadow-[0_12px_28px_-8px_rgba(0,0,0,0.45)] transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 active:scale-[0.98]',
                t.cta,
              )}
            >
              {slide.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </SmartLink>
            {slide.price != null && (
              <div className={cn('flex items-baseline gap-2 rounded-2xl px-4 py-2 shadow-lg', t.price)}>
                {slide.priceLabel && (
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                    {slide.priceLabel}
                  </span>
                )}
                {slide.mrp && <span className="text-sm font-semibold line-through opacity-60">₹{slide.mrp}</span>}
                <span className="font-display text-2xl font-extrabold leading-none">₹{slide.price}</span>
              </div>
            )}
          </motion.div>
        </div>

        {slide.images?.length > 0 && (
          <div className="flex justify-center md:justify-end">
            <ProductStack images={slide.images} priority={priority} />
          </div>
        )}
      </motion.div>
    </div>
  )
}

function ImageSlide({ slide, priority }) {
  return (
    <SmartLink to={slide.link} className="absolute inset-0 block" aria-label={slide.alt || 'View offer'}>
      <BannerImage src={slide.url} mobileSrc={slide.mobileUrl} alt={slide.alt} priority={priority} />
    </SmartLink>
  )
}

/** Trust strip built from the store's real checkout rules (Admin → Settings → Shipping & Checkout). */
function trustFeatures(commerce) {
  if (!commerce) return []
  const list = []
  if (commerce.freeShippingThreshold > 0) list.push({ icon: Truck, label: `Free delivery above ₹${commerce.freeShippingThreshold}` })
  else if (commerce.shippingFee > 0) list.push({ icon: Truck, label: `Delivery ₹${commerce.shippingFee}` })
  else list.push({ icon: Truck, label: 'Free delivery' })
  if (commerce.codEnabled) list.push({ icon: Wallet, label: 'Cash on Delivery' })
  list.push({ icon: PackageCheck, label: 'Track your order' })
  return list
}

export default function HeroCarousel({ home }) {
  const slides = useMemo(() => buildSlides(home), [home])
  const { settings } = useSiteSettings()
  const features = trustFeatures(settings.commerce)
  const count = slides.length
  const allArtwork = count > 0 && slides.every((sl) => sl.type === 'image')
  const hasSlides = count > 0
  const reduceMotion = useReducedMotion()
  const [[index, direction], setState] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const [onScreen, setOnScreen] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  const sectionRef = useRef(null)
  const draggedRef = useRef(false)

  const active = count ? ((index % count) + count) % count : 0

  const paginate = useCallback(
    (dir) => setState(([i]) => [i + dir, dir]),
    [],
  )
  const goTo = useCallback(
    (target) => setState(([i]) => {
      const current = ((i % count) + count) % count
      return target === current ? [i, 1] : [i + (target - current), target > current ? 1 : -1]
    }),
    [count],
  )

  // Pause when off-screen or tab hidden
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [hasSlides])

  // Autoplay always runs (also for reduced-motion users — they get a fade instead of a slide).
  // Pauses only while swiping, when scrolled off-screen, or when the browser tab is hidden.
  const running = count > 1 && !paused && onScreen && tabVisible

  useEffect(() => {
    if (!running) return undefined
    const id = setTimeout(() => paginate(1), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [running, index, paginate])

  // Preload next slide's main image for seamless transitions
  useEffect(() => {
    if (count < 2) return
    const next = slides[(active + 1) % count]
    const src = next.type === 'image' ? next.url : next.bgImage || next.images?.[0]?.src
    if (src) {
      const img = new Image()
      img.src = src
    }
  }, [active, count, slides])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') paginate(-1)
    if (e.key === 'ArrowRight') paginate(1)
  }

  if (!count) return null
  const slide = slides[active]

  const slideVariants = {
    enter: (dir) => ({ x: reduceMotion ? 0 : dir > 0 ? '6%' : '-6%', opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.8, ease: EASE } },
    exit: (dir) => ({
      x: reduceMotion ? 0 : dir > 0 ? '-6%' : '6%',
      opacity: 0,
      transition: { duration: 0.6, ease: EASE },
    }),
  }

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured offers"
      className="relative bg-background"
      onKeyDown={onKeyDown}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-[#d71920]',
          allArtwork
            ? 'aspect-[4/5] md:aspect-[16/6]'
            : 'h-[560px] sm:h-[520px] md:h-[440px] lg:h-[520px] xl:h-[560px]',
        )}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`${slide.id}-${index}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragStart={() => {
              draggedRef.current = true
              setPaused(true)
            }}
            onClickCapture={(e) => {
              if (draggedRef.current) {
                e.preventDefault()
                e.stopPropagation()
                draggedRef.current = false
              }
            }}
            onDragEnd={(_, { offset, velocity }) => {
              setPaused(false)
              setTimeout(() => { draggedRef.current = false }, 80)
              if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) paginate(1)
              else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) paginate(-1)
            }}
            className="absolute inset-0 touch-pan-y select-none will-change-transform"
            role="group"
            aria-roledescription="slide"
            aria-label={`${active + 1} of ${count}`}
          >
            {slide.type === 'image' ? (
              <ImageSlide slide={slide} priority={active === 0} />
            ) : (
              <DesignedSlide slide={slide} priority={active === 0} />
            )}
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <div
              className={cn(
                'absolute inset-x-0 z-20 items-center justify-center gap-3',
                // phone artwork has its button near the bottom — controls move below the slide there
                allArtwork ? 'bottom-6 hidden md:flex' : 'bottom-4 flex md:bottom-6',
              )}
            >
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label="Previous slide"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-md transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-white/30 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 rounded-full bg-black/15 px-3 py-2 backdrop-blur-md">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === active}
                  className={cn(
                    'relative h-2 overflow-hidden rounded-full bg-white/50 transition-[width,background-color] duration-500 ease-out',
                    i === active ? 'w-8 bg-white/40' : 'w-2 hover:bg-white/80',
                  )}
                >
                  {i === active && (
                    <motion.span
                      key={`${index}-${running}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-white"
                      initial={{ width: running ? '0%' : '100%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: running ? AUTOPLAY_MS / 1000 : 0, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
              </div>
              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label="Next slide"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-md transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-white/30 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {allArtwork && count > 1 && (
        <div className="flex items-center justify-center gap-2 bg-surface py-3 md:hidden" aria-label="Choose slide">
          {slides.map((sl, i) => (
            <button
              key={sl.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'h-2 rounded-full transition-[width,background-color] duration-500 ease-out',
                i === active ? 'w-7 bg-brand-primary' : 'w-2 bg-border-subtle',
              )}
            />
          ))}
        </div>
      )}

      {/* Trust strip (real store rules only) */}
      {features.length > 0 && (
      <div className="border-b border-border-subtle bg-surface">
        <div className="section-container flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs font-semibold text-main md:text-sm">
              <Icon className="h-4 w-4 text-[#d71920]" />
              {label}
            </div>
          ))}
        </div>
      </div>
      )}
    </section>
  )
}
