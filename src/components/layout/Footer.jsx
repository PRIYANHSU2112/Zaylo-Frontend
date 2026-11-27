import { Link } from 'react-router-dom'
import {
  ArrowRight,
  AtSign,
  Camera,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShoppingBag,
  Video,
} from 'lucide-react'
import Logo from '@/components/shared/Logo'
import { useSiteSettings } from '@/hooks/useSiteSettings'

function toTelHref(phone) {
  if (!phone) return '#'
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

function LegalLink({ href, children }) {
  if (!href) return null
  const cls = 'transition-colors duration-200 hover:text-brand-yellow'
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={cls}>
      {children}
    </Link>
  )
}

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'Our Story' },
      { to: '/dealer', label: 'Become a Distributor' },
      { to: '/bulk-order', label: 'Bulk Orders' },
      { to: '/contact', label: 'Contact Us' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { to: '/products', label: 'All Products' },
      { to: '/#categories', label: 'Range of Fullness' },
      { to: '/cart', label: 'My Cart' },
      { to: '/profile', label: 'Track Orders' },
    ],
  },
]

function FooterHeading({ children }) {
  return (
    <h4 className="mb-5 text-lg text-white">
      {children}
      <span className="mt-2 block h-0.5 w-8 rounded-full bg-gradient-to-r from-brand-yellow to-brand-orange" />
    </h4>
  )
}

export default function Footer() {
  const { settings } = useSiteSettings()
  const { brand, corporate, social, footer, general, whatsapp } = settings

  const socialLinks = [
    social?.instagram && { Icon: Camera, label: 'Instagram', href: social.instagram },
    social?.facebook && { Icon: Share2, label: 'Facebook', href: social.facebook },
    social?.youtube && { Icon: Video, label: 'YouTube', href: social.youtube },
    social?.linkedin && { Icon: AtSign, label: 'LinkedIn', href: social.linkedin },
    whatsapp && { Icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/${String(whatsapp).replace(/\D/g, '')}` },
    corporate?.email && { Icon: Mail, label: 'Email', href: `mailto:${corporate.email}` },
    brand?.siteUrl && { Icon: Globe, label: 'Website', href: brand.siteUrl },
  ].filter(Boolean)

  const tagline = general?.siteTagline || 'Swad Jo Dil Jeet Le'
  const blurb = brand?.shortDescription || `${tagline} — crunchy ZAY'LO namkeen in every ₹5 pack.`

  return (
    <footer className="relative isolate overflow-hidden bg-brand-dark text-white/75">
      {/* Brand backdrop: warm maroon gradient, soft red/yellow glows and fine diagonal stripes */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#2a0709] via-[#160406] to-brand-dark" />
      <div aria-hidden="true" className="absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-brand-red/25 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-40 -right-24 -z-10 h-96 w-96 rounded-full bg-brand-orange/15 blur-3xl" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 14px)' }}
      />
      <div aria-hidden="true" className="h-1 w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow" />

      <div className="section-container">
        {/* CTA band */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-10 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl text-white md:text-3xl">
              {tagline.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="text-brand-yellow">{tagline.split(' ').slice(-2).join(' ')}</span>
            </p>
            <p className="mt-1 text-sm text-white/55">Crunchy ZAY&apos;LO favourites, delivered to your door.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(215,25,32,0.7)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#e8242b]"
            >
              <ShoppingBag className="h-4 w-4" /> Shop Now
            </Link>
            <Link
              to="/dealer"
              className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/60 px-6 py-3 text-sm font-bold text-brand-yellow transition-colors duration-300 hover:bg-brand-yellow hover:text-brand-dark"
            >
              Become a Distributor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-12 py-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo size="footer" link={false} className="mb-5 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]" />
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/60">{blurb}</p>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-[transform,background-color,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-brand-red hover:bg-brand-red hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:gap-12">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <FooterHeading>{col.title}</FooterHeading>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                      >
                        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-brand-yellow opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                        <span className="-ml-5 transition-[margin] duration-200 group-hover:ml-0">{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="col-span-2 sm:col-span-1">
              <FooterHeading>Get in Touch</FooterHeading>
              <ul className="space-y-4 text-sm text-white/60">
                {(brand?.legalName || corporate?.address) && (
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" />
                    <span className="leading-relaxed">
                      {brand?.legalName && <span className="block font-semibold text-white/80">{brand.legalName}</span>}
                      {corporate?.address}
                    </span>
                  </li>
                )}
                {corporate?.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-brand-yellow" />
                    <a href={toTelHref(corporate.phone)} className="transition-colors hover:text-white">{corporate.phone}</a>
                  </li>
                )}
                {corporate?.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-brand-yellow" />
                    <a href={`mailto:${corporate.email}`} className="break-all transition-colors hover:text-white">{corporate.email}</a>
                  </li>
                )}
                {!corporate?.phone && !corporate?.email && !corporate?.address && (
                  <li>
                    <Link to="/contact" className="inline-flex items-center gap-2 text-brand-yellow hover:underline">
                      Contact us <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/45 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {footer?.copyrightText || brand?.legalName || "ZAY'LO Snacks"}
          </p>
          <div className="flex gap-6">
            <LegalLink href={footer?.privacyPolicyUrl}>Privacy Policy</LegalLink>
            <LegalLink href={footer?.termsUrl}>Terms of Service</LegalLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
