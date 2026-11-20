import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { useStore } from '@/context/StoreContext'
import { useAuth } from '@/context/AuthContext'
import { primaryNav, secondaryNav } from '@/data/navigation'
import Button from '@/components/ui/Button'
import Logo from '@/components/shared/Logo'
import ThemeSelector from '@/components/ui/ThemeSelector'
import { cn } from '@/utils/cn'

export default function Header({ transparent = false }) {
  const scrolled = useScrollHeader(300)
  const { cartCount, wishlist } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const submitSearch = (e) => {
    e.preventDefault()
    const q = searchTerm.trim()
    setSearchOpen(false)
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isTransparent = transparent && isHome && !scrolled

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    if (href.startsWith('/#')) return false
    return location.pathname.startsWith(href)
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('scroll-locked')
    } else {
      document.body.classList.remove('scroll-locked')
    }
    return () => document.body.classList.remove('scroll-locked')
  }, [mobileOpen])

  // Escape key handlers
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (mobileOpen) setMobileOpen(false)
      if (moreOpen) setMoreOpen(false)
      if (searchOpen) setSearchOpen(false)
    }
  }, [mobileOpen, moreOpen, searchOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-200',
          scrolled
            ? 'border-b border-border-subtle/70 bg-surface/90 py-0 shadow-[0_4px_30px_-4px_rgba(11,11,15,0.06)] backdrop-blur-2xl'
            : isTransparent
              ? 'border-b border-transparent bg-transparent'
              : 'border-b border-border-subtle/50 bg-surface/80 backdrop-blur-xl',
        )}
      >
        <div className="section-container flex h-[4.75rem] items-center justify-between gap-6 md:h-24">
          <Logo size="nav" className="drop-shadow-sm" />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'nav-link',
                  isTransparent
                    ? 'text-main/80 hover:bg-brand-primary/10 hover:text-brand-primary'
                    : 'text-body hover:bg-brand-primary-light hover:text-brand-primary',
                  isActive(item.href) && (isTransparent ? 'font-semibold text-brand-primary' : 'nav-link-active text-brand-primary'),
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={cn(
                  'nav-link inline-flex items-center gap-1',
                  isTransparent
                    ? 'text-main/80 hover:bg-brand-primary/10'
                    : 'text-body hover:bg-brand-primary-light hover:text-brand-primary',
                )}
              >
                More
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', moreOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-border-subtle bg-surface py-2 shadow-premium"
                      role="menu"
                    >
                      {secondaryNav.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setMoreOpen(false)}
                          role="menuitem"
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-body transition-colors duration-200 hover:bg-brand-primary-light hover:text-brand-primary"
                        >
                          {item.label}
                          {item.comingSoon && (
                            <span className="text-[10px] font-medium text-brand-orange">Soon</span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-0.5 md:gap-1">
            <div className="mr-1 sm:mr-2">
              <ThemeSelector />
            </div>
            {[
              { Icon: Search, label: 'Search', to: '#' },
              { Icon: Heart, label: 'Wishlist', hide: 'max-sm:hidden', to: '/wishlist', badge: wishlist.length },
              { Icon: ShoppingBag, label: 'Cart', hide: '', to: '/cart', badge: cartCount },
            ].map(({ Icon, label, hide, to, badge }) => (
              to === '#' ? (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  aria-expanded={searchOpen}
                  onClick={() => setSearchOpen((v) => !v)}
                  className={cn(
                    'rounded-full p-2.5 transition-colors duration-200',
                    hide,
                    isTransparent
                      ? 'text-main/60 hover:bg-brand-primary/10 hover:text-brand-primary'
                      : 'text-muted hover:bg-brand-primary-light hover:text-brand-primary',
                  )}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
                </button>
              ) : (
                <Link
                  key={label}
                  to={to}
                  aria-label={label}
                  className={cn(
                    'relative rounded-full p-2.5 transition-colors duration-200',
                    hide,
                    isTransparent
                      ? 'text-main/60 hover:bg-brand-primary/10 hover:text-brand-primary'
                      : 'text-muted hover:bg-brand-primary-light hover:text-brand-primary',
                  )}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
                  {badge > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white shadow-sm">
                      {badge}
                    </span>
                  )}
                </Link>
              )
            ))}
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              title={isAuthenticated ? user?.name : 'Log in'}
              className={cn(
                'hidden rounded-full p-2.5 transition-colors duration-200 md:block',
                isTransparent
                  ? 'text-main/60 hover:bg-brand-primary/10 hover:text-brand-primary'
                  : 'text-muted hover:bg-brand-primary-light hover:text-brand-primary',
              )}
              aria-label={isAuthenticated ? 'My account' : 'Log in'}
            >
              <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
            </Link>
            <Link to="/dealer" className="ml-1 hidden md:block">
              <Button variant="primary" className="!px-5 !py-2.5 !text-xs">
                Become Dealer
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-full p-2.5 text-main lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              onSubmit={submitSearch}
              role="search"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full border-b border-border-subtle bg-surface shadow-card"
            >
              <div className="section-container flex items-center gap-3 py-3">
                <Search className="h-5 w-5 shrink-0 text-muted" />
                <input
                  autoFocus
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search snacks by name or flavour…"
                  aria-label="Search products"
                  className="flex-1 bg-transparent py-2 text-sm text-main outline-none placeholder:text-muted"
                />
                <Button type="submit" className="!px-5 !py-2 !text-xs">Search</Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu with slide animation */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-surface-dark/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 flex h-full w-[min(100vw-3rem,22rem)] flex-col bg-surface shadow-premium"
            >
              <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
                <Logo size="lg" link={false} />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 transition-colors duration-200 hover:bg-border-subtle"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto overscroll-none px-3 py-4" aria-label="Mobile navigation">
                {[...primaryNav, ...secondaryNav].map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-main transition-colors duration-200 hover:bg-brand-primary-light hover:text-brand-primary"
                  >
                    {item.label}
                    {item.comingSoon && <span className="text-[10px] text-brand-orange">Soon</span>}
                  </Link>
                ))}
              </nav>
              <div className="space-y-2 border-t border-border-subtle p-4">
                <Link to={isAuthenticated ? '/profile' : '/login'} onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" className="w-full">{isAuthenticated ? 'My account' : 'Log in / Sign up'}</Button>
                </Link>
                <Link to="/dealer" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full">Become Dealer</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
