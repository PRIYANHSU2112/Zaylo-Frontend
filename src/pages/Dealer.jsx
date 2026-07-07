import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import PromoBanner from '@/components/shared/PromoBanner'
import TestimonialCard from '@/components/shared/TestimonialCard'
import FAQAccordion from '@/components/shared/FAQAccordion'
import Reveal from '@/components/shared/Reveal'
import { Input, Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { dealerContent, testimonials } from '@/data/content'
import { promoBanners } from '@/data/banners'
import { products } from '@/data/products'

export default function Dealer() {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Application submitted! Our team will contact you within 48 hours.')
  }

  return (
    <div className="bg-background">
      <PromoBanner
        banner={promoBanners.find((b) => b.id === 'dealer')}
        variant="dark"
        bgImage="/images/dealer-bg.png"
        className="pt-8"
      />

      <div className="section-container section-padding">
        <SectionHeading subtitle="Why Partner" title="Dealer Benefits" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dealerContent.benefits.map((benefit, i) => (
            <Reveal key={benefit.title} delay={i * 0.06}>
              <div className="h-full rounded-[1.75rem] border border-border-subtle/80 bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-hover">
                <h3 className="text-lg font-bold text-main">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{benefit.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading title="Dealer Registration" align="left" className="!mb-6" />
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Business Name" placeholder="Your business name" required />
              <Input label="Contact Person" placeholder="Full name" required />
              <Input label="Phone" type="tel" placeholder="+91 98765 43210" required />
              <Input label="Email" type="email" placeholder="business@email.com" required />
              <Input label="City / State" placeholder="e.g. Delhi, NCR" required />
              <Select label="Interested Products">
                <option value="">Select product range</option>
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
                <option value="all">All Products</option>
              </Select>
              <Textarea label="Additional Details" placeholder="Tell us about your business..." />
              <Button type="submit" className="w-full">Submit Application</Button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading title="Success Stories" align="left" className="!mb-6" />
            <div className="space-y-4">
              {testimonials
                .filter((t) => t.role.includes('Distributor') || t.role.includes('Retailer'))
                .map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-16">
          <SectionHeading title="Dealer FAQs" align="left" className="!mb-6" />
          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={dealerContent.faqs} />
          </div>
        </div>

        <Reveal className="relative mt-14 overflow-hidden rounded-[2rem] p-10 text-center md:p-14">
          <div className="absolute inset-0 bg-[url('/images/dealer-bg.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="relative z-10">
          <h3 className="text-2xl font-extrabold text-white md:text-3xl">
            Ready to Join the ZAY&apos;LO Family?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
            5000+ retailers trust ZAY&apos;LO. Start your journey today.
          </p>
          <Link to="/contact" className="mt-7 inline-block">
            <Button variant="dealer">Contact Sales Team</Button>
          </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
