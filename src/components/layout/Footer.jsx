import { Link } from 'react-router-dom'
import { Mail, Globe, MessageCircle, AtSign, Share2, Camera, Video } from 'lucide-react'
import Logo from '@/components/shared/Logo'
import { useSiteSettings } from '@/hooks/useSiteSettings'

function toTelHref(phone) {
  if (!phone) return '#'
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

function LegalLink({ href, children }) {
  if (!href) return null
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a href={href} className="transition-colors duration-200 hover:text-white" target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className="transition-colors duration-200 hover:text-white">
      {children}
    </Link>
  )
}

export default function Footer() {
  const { settings } = useSiteSettings()
  const { brand, corporate, social, footer, general, whatsapp } = settings

  const socialLinks = [
    corporate?.email && { Icon: Mail, label: 'Email us', href: `mailto:${corporate.email}` },
    brand?.siteUrl && { Icon: Globe, label: 'Visit website', href: brand.siteUrl },
    whatsapp && {
      Icon: MessageCircle,
      label: 'Chat on WhatsApp',
      href: `https://wa.me/${String(whatsapp).replace(/\D/g, '')}`,
    },
    social?.instagram && { Icon: Camera, label: 'Instagram', href: social.instagram },
    social?.facebook && { Icon: Share2, label: 'Facebook', href: social.facebook },
    social?.youtube && { Icon: Video, label: 'YouTube', href: social.youtube },
    social?.linkedin && { Icon: AtSign, label: 'LinkedIn', href: social.linkedin },
  ].filter(Boolean)

  const blurb =
    brand?.shortDescription ||
    `${general?.siteTagline || "Swad Jo Dil Jeet Le"} — Premium Indian snacks at ₹5.`

  const addressLines = (corporate?.address || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="section-container pb-10 pt-12 md:pt-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo size="footer" link={false} className="mb-6" />
            <p className="mb-8 max-w-xs text-sm leading-relaxed text-white/50">{blurb}</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/10 transition-colors duration-200 hover:bg-brand-primary hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:gap-12">
            <nav aria-label="About links">
              <h4 className="mb-6 text-base font-bold text-white">About</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/about" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/dealer" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                    Become a Dealer
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Delivery links">
              <h4 className="mb-6 text-base font-bold text-white">Shop</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/products" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/bulk-order" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                    Bulk Orders
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                    Blog
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <h4 className="mb-6 text-base font-bold text-white">Contact</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li className="leading-relaxed">
                  {brand?.legalName && (
                    <>
                      {brand.legalName}
                      <br />
                    </>
                  )}
                  {addressLines.length
                    ? addressLines.map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))
                    : null}
                </li>
                {corporate?.email && (
                  <li>
                    <a href={`mailto:${corporate.email}`} className="transition-colors duration-200 hover:text-brand-primary">
                      {corporate.email}
                    </a>
                  </li>
                )}
                {corporate?.phone && (
                  <li>
                    <a href={toTelHref(corporate.phone)} className="transition-colors duration-200 hover:text-brand-primary">
                      {corporate.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {footer?.copyrightText || brand?.legalName || "ZAY'LO Snacks"}
          </p>
          <div className="mt-4 flex gap-6 text-xs text-white/40 md:mt-0">
            <LegalLink href={footer?.privacyPolicyUrl}>Privacy Policy</LegalLink>
            <LegalLink href={footer?.termsUrl}>Terms of Service</LegalLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
