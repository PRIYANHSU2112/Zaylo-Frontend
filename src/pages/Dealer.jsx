import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import PromoBanner from '@/components/shared/PromoBanner'
import BannerImage from '@/components/shared/BannerImage'
import TestimonialCard from '@/components/shared/TestimonialCard'
import FAQAccordion from '@/components/shared/FAQAccordion'
import Reveal from '@/components/shared/Reveal'
import { Input, Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import SEO from '@/components/shared/SEO'
import { useCmsHome } from '@/hooks/useCmsHome'
import { useHome } from '@/hooks/useHome'
import { useBanners, useProducts } from '@/hooks/useCatalog'
import { useLeadForm } from '@/hooks/useLeadForm'

export default function Dealer() {
  const { cms } = useCmsHome()
  const { home } = useHome()
  const productsQuery = useProducts({ limit: 50, sort: 'name' })
  const lead = useLeadForm('/dealers', {
    successMessage: 'Application submitted! Our team will contact you soon.',
    map: ({ interestedProducts, ...v }) => ({ ...v, interestedProducts: interestedProducts ? [interestedProducts] : [] }),
  })

  const { data: dealerBanners = [] } = useBanners('dealer')
  const dealerPromo = dealerBanners[0]
  const benefits = cms?.dealerBenefits || []
  const faqs = (cms?.dealerFaqs || []).filter((f) => f.q && f.a)
  const stories = (home.testimonials || []).filter((t) => /distributor|retailer|dealer/i.test(t.role || ''))

  return (
    <div className="bg-background">
      <SEO
        title="Become a Distributor"
        description="Partner with us — submit your business details to join our distribution network."
        path="/dealer"
      />
      {dealerPromo ? (
        <PromoBanner
          banner={dealerPromo}
          products={home.featuredProducts?.length ? home.featuredProducts : home.popularProducts}
          className="pt-8"
        />
      ) : (
        <section className="section-container pt-8">
          <div className="rounded-[2rem] bg-surface-dark p-10 text-white md:p-14">
            <h1 className="text-3xl font-extrabold text-white md:text-4xl">Become a Distributor</h1>
            <p className="mt-3 max-w-xl text-white/75">Grow your business with our snacks range. Tell us about your business below.</p>
          </div>
        </section>
      )}

      <div className="section-container section-padding">
        {benefits.length > 0 && (
          <>
            <SectionHeading subtitle="Why Partner" title="Dealer Benefits" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, i) => (
                <Reveal key={benefit.title} delay={i * 0.06}>
                  <div className="h-full rounded-[1.75rem] border border-border-subtle/80 bg-surface p-7 shadow-card transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-hover">
                    <CheckCircle2 className="h-6 w-6 text-brand-primary" />
                    <h3 className="mt-3 text-lg font-bold text-main">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{benefit.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <Reveal className="scroll-mt-32" id="dealer-form">
            <SectionHeading title="Dealer Registration" align="left" className="!mb-6" />
            {lead.submitted ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-900">
                <CheckCircle2 className="h-8 w-8" />
                <p className="mt-3 text-lg font-bold">Application received</p>
                <p className="mt-1 text-sm">Our team will review your details and get in touch.</p>
                <Button variant="outline" className="mt-5" onClick={lead.reset}>Submit another</Button>
              </div>
            ) : (
              <form onSubmit={lead.onSubmit} className="space-y-4">
                <Input name="businessName" label="Business Name" required minLength={2} autoComplete="organization" />
                <Input name="name" label="Contact Person" required minLength={2} autoComplete="name" />
                <Input name="phone" label="Phone" type="tel" required pattern="[0-9+\-\s]{7,15}" autoComplete="tel" />
                <Input name="email" label="Email" type="email" required autoComplete="email" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input name="city" label="City" required autoComplete="address-level2" />
                  <Input name="state" label="State" required autoComplete="address-level1" />
                </div>
                <Select name="interestedProducts" label="Interested Products" disabled={productsQuery.isLoading}>
                  <option value="">Select product range</option>
                  {(productsQuery.data?.data || []).map((p) => (
                    <option key={p.id} value={p.slug}>{p.name}</option>
                  ))}
                  <option value="all">All Products</option>
                </Select>
                <Textarea name="message" label="Additional Details" placeholder="Tell us about your business..." />
                {lead.error && <p className="text-sm text-red-600" role="alert">{lead.error}</p>}
                <Button type="submit" className="w-full" disabled={lead.pending}>
                  {lead.pending ? 'Submitting…' : 'Submit Application'}
                </Button>
              </form>
            )}
          </Reveal>

          {stories.length > 0 && (
            <Reveal delay={0.1}>
              <SectionHeading title="Success Stories" align="left" className="!mb-6" />
              <div className="space-y-4">
                {stories.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
              </div>
            </Reveal>
          )}
        </div>

        {faqs.length > 0 && (
          <div className="mt-10">
            <SectionHeading title="Dealer FAQs" align="left" className="!mb-6" />
            <div className="mx-auto max-w-3xl">
              <FAQAccordion items={faqs} />
            </div>
          </div>
        )}

        <Reveal className="relative mt-14 overflow-hidden rounded-[2rem] p-10 text-center md:p-14">
          <BannerImage src="/images/dealer-bg.png" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />
          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold text-white md:text-3xl">Ready to join the family?</h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/75">Talk to our sales team about distribution in your region.</p>
            <Link to="/contact" className="mt-7 inline-block">
              <Button variant="dealer">Contact Sales Team</Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
