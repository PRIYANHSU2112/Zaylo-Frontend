export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Dealer', href: '/dealer' },
  { label: 'Contact', href: '/contact' },
]

export const secondaryNav = [
  { label: 'Categories', href: '/#categories' },
  { label: 'Manufacturing', href: '/about#manufacturing' },
  { label: 'Bulk Order', href: '/bulk-order' },
  { label: 'Blogs', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
]

export const mainNav = [...primaryNav, ...secondaryNav]

export const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Manufacturing', href: '/about#manufacturing' },
    { label: 'Careers', href: '/coming-soon' },
    { label: 'Media', href: '/coming-soon' },
  ],
  products: [
    { label: 'All Products', href: '/products' },
    { label: 'Moon Lite', href: '/products/moon-lite' },
    { label: 'Katori', href: '/products/katori' },
    { label: 'Zig Zac', href: '/products/zig-zac' },
  ],
  dealer: [
    { label: 'Become Dealer', href: '/dealer' },
    { label: 'Bulk Orders', href: '/bulk-order' },
    { label: 'Dealer Login', href: '/coming-soon' },
  ],
  support: [
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Gallery', href: '/gallery' },
  ],
}
