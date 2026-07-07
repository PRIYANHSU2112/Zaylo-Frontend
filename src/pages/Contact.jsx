import { Link } from 'react-router-dom'
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { contactInfo } from '@/data/content'

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you! We will get back to you within 24 hours.')
  }

  return (
    <div className="bg-background">
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
          {[contactInfo.corporate, contactInfo.factory].map((office, i) => (
            <Reveal key={office.title} delay={i * 0.08}>
              <div className="h-full rounded-[1.75rem] border border-border-subtle/80 bg-surface p-7 shadow-card md:p-8">
                <h3 className="text-lg font-bold text-main">{office.title}</h3>
                <div className="mt-5 space-y-4">
                  <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                    {office.address}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-body">
                    <Phone className="h-4 w-4 text-brand-primary" /> {office.phone}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-body">
                    <Mail className="h-4 w-4 text-brand-primary" /> {office.email}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex flex-wrap gap-3">
          <a href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`} className="btn-primary gap-2">
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
          <a href={`tel:${contactInfo.corporate.phone}`} className="btn-secondary gap-2">
            <Phone className="h-4 w-4" /> Call Us
          </a>
        </Reveal>

        <Reveal className="mt-10 overflow-hidden rounded-[2rem] border border-border-subtle bg-surface shadow-card">
          <div className="flex h-56 items-center justify-center bg-surface-cream md:h-72">
            <div className="text-center">
              <MapPin className="mx-auto h-10 w-10 text-brand-primary/30" />
              <p className="mt-3 text-sm text-muted">Sonipat, Haryana — Manufacturing Hub</p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading title="Send an Inquiry" align="left" className="!mb-6" />
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" placeholder="Your name" required />
              <Input label="Email" type="email" placeholder="you@email.com" required />
              <Input label="Phone" type="tel" placeholder="+91 98765 43210" />
              <Input label="Subject" placeholder="How can we help?" />
              <Textarea label="Message" placeholder="Your message..." required />
              <Button type="submit">Send Message</Button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading title="Sales Team" align="left" className="!mb-6" />
            <div className="space-y-4">
              {contactInfo.salesTeam.map((team) => (
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
