import Hero from '@/components/home/Hero'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import TopProducts from '@/components/home/TopProducts'
import BundlePacks from '@/components/home/BundlePacks'
import CustomerReviews from '@/components/home/CustomerReviews'
import TrustedBy from '@/components/home/TrustedBy'
import PromoBanner from '@/components/shared/PromoBanner'
import { promoBanners } from '@/data/banners'

export default function Home() {
  return (
    <>
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
