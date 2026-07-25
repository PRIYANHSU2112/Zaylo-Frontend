import Hero from '@/components/home/Hero'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import TopProducts from '@/components/home/TopProducts'
import BundlePacks from '@/components/home/BundlePacks'
import CustomerReviews from '@/components/home/CustomerReviews'
import TrustedBy from '@/components/home/TrustedBy'
import PromoBanner from '@/components/shared/PromoBanner'
import { promoBanners } from '@/data/banners'
import SEO from '@/components/shared/SEO'

export default function Home() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://zaylosnacks.com/#organization",
        "name": "ZAY'LO Snacks",
        "url": "https://zaylosnacks.com",
        "logo": "https://zaylosnacks.com/assets/brand/zaylo-logo.png"
      },
      {
        "@type": "WebSite",
        "@id": "https://zaylosnacks.com/#website",
        "url": "https://zaylosnacks.com",
        "name": "ZAY'LO Snacks",
        "publisher": { "@id": "https://zaylosnacks.com/#organization" }
      }
    ]
  }

  return (
    <>
      <SEO
        title="Crispy Delight & Crunchy Namkeen"
        description="Welcome to ZAY'LO Snacks. Discover our premium range of crispy cup-shaped snacks, Penne-shaped pasta snacks, crinkle-cut rectangular chips, and other delicious Indian namkeen."
        path="/"
        structuredData={homeSchema}
      />
      <Hero />
      <FeaturedCategories />
      <TopProducts />
      
      <div className="section-container section-padding">
        <PromoBanner 
          banner={promoBanners.find(b => b.id === 'festival')} 
          productImage="/images/festival-snacks.png" 
        />
      </div>

      <BundlePacks />
      <CustomerReviews />
      
      <div className="section-container section-padding pb-0">
        <PromoBanner 
          banner={promoBanners.find(b => b.id === 'dealer')} 
          variant="dark"
          bgImage="/images/dealer-bg.png"
        />
      </div>

      <TrustedBy />
    </>
  )
}
