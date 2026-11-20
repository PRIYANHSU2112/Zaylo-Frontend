import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import Button from '@/components/ui/Button'
import PromoBanner from '@/components/shared/PromoBanner'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import { useHome } from '@/hooks/useHome'
import { useBanners } from '@/hooks/useCatalog'
import SEO from '@/components/shared/SEO'
import { useCmsHome } from '@/hooks/useCmsHome'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function About() {
  const { about } = useCmsHome()
  const { settings } = useSiteSettings()
  const siteName = settings.general?.siteName || "ZAY'LO Snacks"
  const siteUrl = (settings.brand?.siteUrl || 'https://zaylosnacks.com').replace(/\/+$/, '')
  const logoUrl = settings.brand?.logoUrl || `${siteUrl}/assets/brand/zaylo-logo.png`

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${siteName}`,
    description:
      'Discover our story, mission, and dedication to delicious, high-quality zero-waste manufacturing puffed snacks.',
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: logoUrl,
    },
  }

  const { home } = useHome()
  const { data: aboutBanners = [] } = useBanners('about')
  const corporateBanner = aboutBanners[0]

  return (
    <div className="bg-background">
      <SEO
        title="Our Story & Zero-Waste Manufacturing"
        description={`Learn about ${siteName}' history, our team, our mission, and our zero-waste manufacturing processes. Quality, crunch, and sustainability combined.`}
        path="/about"
        structuredData={aboutSchema}
      />
      <PageHero
        title="Our Story"
        subtitle={about.story}
        breadcrumb={
          <>
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link> / About
          </>
        }
      />

      <div className="section-container section-padding !pt-12">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[1.75rem] border border-brand-primary/10 bg-brand-primary/5 p-8 md:p-10">
              <h2 className="text-xl font-extrabold text-brand-primary">Our Mission</h2>
              <p className="mt-4 text-sm leading-relaxed text-body md:text-base">{about.mission}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-[1.75rem] border border-brand-orange/10 bg-brand-yellow/10 p-8 md:p-10">
              <h2 className="text-xl font-extrabold text-brand-orange">Our Vision</h2>
              <p className="mt-4 text-sm leading-relaxed text-body md:text-base">{about.vision}</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          <SectionHeading subtitle="Our Journey" title="Timeline" />
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-4 top-0 h-full w-px bg-brand-primary/15 md:left-1/2" />
            {(about.timeline || []).map((item, i) => (
              <Reveal key={item.year} delay={i * 0.05}>
                <div className={`relative mb-10 flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="hidden flex-1 md:block" />
                  <div className="absolute left-4 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-brand-primary text-[11px] font-bold text-white md:left-1/2">
                    {String(item.year).slice(2)}
                  </div>
                  <div className="ml-12 flex-1 md:ml-0">
                    <div className="rounded-[1.75rem] border border-border-subtle/80 bg-surface p-6 shadow-card">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">{item.year}</p>
                      <h3 className="mt-1 text-lg font-bold text-main">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <SectionHeading subtitle="What We Stand For" title="Brand Values" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(about.values || []).map((val, i) => (
              <Reveal key={val.title} delay={i * 0.06}>
                <div className="rounded-[1.75rem] border border-border-subtle/80 bg-surface p-7 text-center shadow-card">
                  <h3 className="font-bold text-main">{val.title}</h3>
                  <p className="mt-2 text-sm text-muted">{val.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <SectionHeading subtitle="Recognition" title="Awards & Achievements" />
          <div className="flex flex-wrap justify-center gap-3">
            {(about.awards || []).map((award) => (
              <span
                key={award}
                className="rounded-full border border-brand-gold/20 bg-brand-gold/10 px-5 py-2.5 text-sm font-semibold text-brand-gold"
              >
                {award}
              </span>
            ))}
          </div>
        </div>

        <div id="manufacturing" className="mt-12">
          <SectionHeading subtitle="Quality" title="Manufacturing Excellence" align="left" />
          <div className="grid gap-5 md:grid-cols-3">
            {['ISO 22000 Certified', 'FSSAI Approved', 'HACCP Compliant'].map((cert) => (
              <div key={cert} className="flex items-center gap-4 rounded-[1.75rem] border border-border-subtle/80 bg-surface p-6 shadow-card">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/10 text-lg text-brand-primary">
                  ✓
                </div>
                <p className="font-semibold text-main">{cert}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link to="/contact">
            <Button>Get In Touch</Button>
          </Link>
        </div>
      </div>

      {corporateBanner && (
        <PromoBanner
          banner={corporateBanner}
          products={home.featuredProducts?.length ? home.featuredProducts : home.popularProducts}
          className="pb-16"
        />
      )}
    </div>
  )
}
