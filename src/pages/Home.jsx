import HeroCarousel from '@/components/home/HeroCarousel'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import ProductSection from '@/components/home/ProductSection'
import BundlePacks from '@/components/home/BundlePacks'
import CustomerReviews from '@/components/home/CustomerReviews'
import TrustedBy from '@/components/home/TrustedBy'
import PromoBanner from '@/components/shared/PromoBanner'
import SEO from '@/components/shared/SEO'
import { ErrorState, Skeleton } from '@/components/shared/States'
import { useHome } from '@/hooks/useHome'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function Home() {
  const { home, isLoading, isError, error, refetch } = useHome()
  const { settings } = useSiteSettings()

  // Admin → Banners placements (scheduled & active only, from GET /home)
  const middleBanner = home.banners?.['home-middle']?.[0]
  const bottomBanner = home.banners?.['home-bottom']?.[0]
  const bannerProducts = home.featuredProducts?.length ? home.featuredProducts : home.popularProducts

  const siteName = settings.general?.siteName || "ZAY'LO Snacks"
  const siteUrl = (settings.brand?.siteUrl || 'https://zaylosnacks.com').replace(/\/+$/, '')
  const logoUrl = settings.brand?.logoUrl || `${siteUrl}/assets/brand/zaylo-logo.png`

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: logoUrl,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  }

  return (
    <>
      <SEO
        title="Crispy Delight & Crunchy Namkeen"
        description={`Welcome to ${siteName}. Discover our premium range of crispy snacks and delicious Indian namkeen.`}
        path="/"
        structuredData={homeSchema}
      />
      {isLoading ? (
        <Skeleton className="h-[560px] w-full !rounded-none sm:h-[520px] md:h-[440px] lg:h-[520px] xl:h-[560px]" />
      ) : isError ? (
        <div className="section-container py-16">
          <ErrorState title="We couldn't load the store right now" error={error} onRetry={refetch} />
        </div>
      ) : (
        <HeroCarousel home={home} />
      )}
      <FeaturedCategories categories={home.categories} />
      <ProductSection id="featured" title="Featured Snacks" products={home.featuredProducts} seeAllHref="/products?featured=true" />
      <ProductSection title="Popular Products" products={home.popularProducts} tone={home.featuredProducts?.length ? 'cream' : 'surface'} />
      <ProductSection id="new-arrivals" title="New Arrivals" products={home.newArrivals} seeAllHref="/products?sort=newest" />
      {/* Best sellers only exist when there are real (non-cancelled) orders */}
      <ProductSection id="best-sellers" title="Best Sellers" products={home.bestSellers} tone="cream" />

      {middleBanner && <PromoBanner banner={middleBanner} products={bannerProducts} className="py-6 md:py-8" />}

      <BundlePacks bundles={home.bundles} />
      <CustomerReviews testimonials={home.testimonials} />

      {bottomBanner && <PromoBanner banner={bottomBanner} products={bannerProducts} className="pt-6 md:pt-8" />}

      <TrustedBy />
    </>
  )
}
