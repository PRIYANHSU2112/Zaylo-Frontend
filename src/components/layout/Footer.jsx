import { Link } from 'react-router-dom'
import { Mail, Globe, MessageCircle } from 'lucide-react'
import Logo from '@/components/shared/Logo'

const socialLinks = [
  { Icon: Mail, label: 'Email us', href: 'mailto:info@zaylosnacks.com' },
  { Icon: Globe, label: 'Visit website', href: '#' },
  { Icon: MessageCircle, label: 'Chat with us', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1C1F25] text-white/80">
      <div className="section-container section-padding pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <Logo size="xl" link={false} className="mb-2" />
            <p className="mb-8 max-w-xs text-sm leading-relaxed text-white/50">
              Swad Jo Dil Jeet Le — Premium Indian snacks at ₹5. Quality you can trust, taste you'll love, delivered fresh to your door.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/10 transition-colors duration-200 hover:bg-brand-primary hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:gap-12">
            <nav aria-label="About links">
              <h4 className="mb-6 text-base font-bold text-white">About</h4>
              <ul className="space-y-4">
                {['How It Work', 'Our Packages', 'Promotions', 'Refer a Friend'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Delivery links">
              <h4 className="mb-6 text-base font-bold text-white">Delivery</h4>
              <ul className="space-y-4">
                {['Cost Of Delivery', 'Payment Method', 'Delivery Areas', 'Returns'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-sm text-white/50 transition-colors duration-200 hover:text-brand-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h4 className="mb-6 text-base font-bold text-white">Contact</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li className="leading-relaxed">
                  ZAY'LO Snacks Pvt. Ltd.<br />
                  Plot 45, Phase-II<br />
                  New Delhi - 110020
                </li>
                <li>
                  <a href="mailto:info@zaylosnacks.com" className="transition-colors duration-200 hover:text-brand-primary">
                    info@zaylosnacks.com
                  </a>
                </li>
                <li>
                  <a href="tel:+919876543210" className="transition-colors duration-200 hover:text-brand-primary">
                    +91 98765 43210
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} ZAY'LO Snacks Pvt. Ltd. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 text-xs text-white/40 md:mt-0">
            <Link to="#" className="transition-colors duration-200 hover:text-white">Privacy Policy</Link>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
