import { useLeadForm } from '@/hooks/useLeadForm'
import { Link } from 'react-router-dom'
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import SEO from '@/components/shared/SEO'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function Contact() {
  const { settings } = useSiteSettings()
  const { corporate, factory, whatsapp, salesTeam, map, brand, general } = settings
  const siteName = general?.siteName || "ZAY'LO Snacks"
  const siteUrl = (brand?.siteUrl || 'https://zaylosnacks.com').replace(/\/+$/, '')
  const logoUrl = brand?.logoUrl || `${siteUrl}/assets/brand/zaylo-logo.png`

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${siteName}`,
    description: `Get in touch with the team at ${siteName} for corporate, distribution, or customer support questions.`,
    url: `${siteUrl}/contact`,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: logoUrl,
    },
  }

  const lead = useLeadForm('/contacts', { successMessage: 'Thank you! We will get back to you shortly.' })

  const offices = [corporate, factory].filter((o) => o?.title || o?.address)

  return (
    <div className="bg-background">
      <SEO
        title="Get in Touch"
        description={`Have questions or feedback? Contact ${siteName} corporate offices, manufacturing unit, or customer support team today.`}
        path="/contact"
        structuredData={contactSchema}
      />
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you — whether you're a customer, retailer, or potential dealer partner."
        breadcrumb={
          <>
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link> / Contact
          </>
        }
      />

      <div className="section-container section-padding !pt-12">
        <div className="grid gap-6 md:grid-cols-2">
          {offices.map((office, i) => (
            <Reveal key={office.title || i} delay={i * 0.08}>
              <div className="h-full rounded-[1.75rem] border border-border-subtle/80 bg-surface p-7 shadow-card md:p-8">
                <h3 className="text-lg font-bold text-main">{office.title}</h3>
                <div className="mt-5 space-y-4">
                  {office.address && (
                    <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                      {office.address}
                    </p>
                  )}
                  {office.phone && (
                    <p className="flex items-center gap-3 text-sm text-body">
                      <Phone className="h-4 w-4 text-brand-primary" /> {office.phone}
                    </p>
                  )}
                  {office.email && (
                    <p className="flex items-center gap-3 text-sm text-body">
                      <Mail className="h-4 w-4 text-brand-primary" /> {office.email}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex flex-wrap gap-3">
          {whatsapp && (
            <a href={`https://wa.me/${String(whatsapp).replace(/\D/g, '')}`} className="btn-primary gap-2">
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          )}
          {corporate?.phone && (
            <a href={`tel:${corporate.phone.replace(/[^\d+]/g, '')}`} className="btn-secondary gap-2">
              <Phone className="h-4 w-4" /> Call Us
            </a>
          )}
        </Reveal>

        <Reveal className="mt-10 overflow-hidden rounded-[2rem] border border-border-subtle bg-surface shadow-card">
          {map?.embedUrl ? (
            <iframe
              title={map.label || 'Location map'}
              src={map.embedUrl}
              className="h-56 w-full border-0 md:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-56 items-center justify-center bg-surface-cream md:h-72">
              <div className="text-center">
                <MapPin className="mx-auto h-10 w-10 text-brand-primary/30" />
                <p className="mt-3 text-sm text-muted">{map?.label || 'Our manufacturing hub'}</p>
              </div>
            </div>
          )}
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading title="Send an Inquiry" align="left" className="!mb-6" />
            <form onSubmit={lead.onSubmit} className="space-y-4">
              <Input name="name" label="Full Name" placeholder="Your name" required minLength={2} autoComplete="name" />
              <Input name="email" label="Email" type="email" placeholder="you@email.com" required autoComplete="email" />
              <Input name="phone" label="Phone" type="tel" pattern="[0-9+-s]{7,15}" autoComplete="tel" />
              <Input name="subject" label="Subject" placeholder="How can we help?" required />
              <Textarea name="message" label="Message" placeholder="Your message..." required minLength={5} />
              {lead.error && <p className="text-sm text-red-600" role="alert">{lead.error}</p>}
              {lead.submitted && !lead.error && <p className="text-sm font-semibold text-emerald-700" role="status">Message sent — our team will contact you soon.</p>}
              <Button type="submit" disabled={lead.pending}>{lead.pending ? 'Sending…' : 'Send Message'}</Button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading title="Sales Team" align="left" className="!mb-6" />
            <div className="space-y-4">
              {(salesTeam || []).map((team) => (
                <div key={team.name} className="rounded-[1.75rem] border border-border-subtle/80 bg-surface p-5 shadow-card">
                  <h4 className="font-bold text-main">{team.name}</h4>
                  <p className="mt-1 text-sm text-muted">{team.contact}</p>
                  <p className="text-sm font-semibold text-brand-primary">{team.phone}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
