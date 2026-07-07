import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Truck, ShieldCheck, Leaf } from 'lucide-react'
import { products } from '@/data/products'
import logo from '@/assets/brand/zaylo-logo.png'

const floatingProducts = [
  products.find((p) => p.slug === 'moon-lite'),
  products.find((p) => p.slug === 'katori'),
  products.find((p) => p.slug === 'zig-zac'),
  products.find((p) => p.slug === 'noodles'),
  products.find((p) => p.slug === '5pm-pasta'),
]

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const features = [
  { icon: Truck, label: 'Free Delivery' },
  { icon: ShieldCheck, label: '100% Quality' },
  { icon: Leaf, label: 'Pure Veg' },
]

export default function Hero() {
  return (
    <section className="relative -mt-[5.5rem] overflow-hidden pt-32 pb-16 md:-mt-[6.5rem] md:pt-40 md:pb-24 lg:pt-44 lg:pb-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-light via-surface-cream to-background" />
        
        {/* Blurred Background Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={logo} 
            alt="" 
            role="presentation"
            className="w-[90%] md:w-[70%] lg:w-[50%] h-auto object-contain opacity-25 blur-[2px]" 
          />
        </div>

        {/* Decorative blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-20 top-20 h-[500px] w-[500px] rounded-full bg-brand-primary/8 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-brand-primary/6 blur-3xl"
        />
        {/* Small floating circles */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[15%] top-[30%] h-4 w-4 rounded-full bg-brand-primary/30"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[25%] top-[20%] h-3 w-3 rounded-full bg-brand-yellow/40"
        />
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[40%] bottom-[20%] h-5 w-5 rounded-full bg-brand-primary/20"
        />
      </div>

      <div className="section-container relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-6">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-primary">
                <Leaf className="h-3.5 w-3.5" />
                100% Vegetarian Snacks
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl font-extrabold leading-[1.08] tracking-tight text-main md:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
            >
              Order your
              <br />
              <span className="text-gradient-brand">Daily Snacks</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-2 flex items-center gap-2 text-sm font-bold text-brand-primary md:text-base"
            >
              <Truck className="h-4 w-4" />
              #Free Delivery
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base"
            >
              Premium quality snacks at ₹5. Crispy, crunchy, and irresistibly delicious — delivered fresh to your doorstep.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={itemVariants} className="mt-8 max-w-lg">
              <div className="hero-search-bar">
                <Search className="h-5 w-5 shrink-0 text-muted" />
                <input
                  type="text"
                  placeholder="Search your daily snacks..."
                  className="flex-1 border-none bg-transparent py-1.5 text-sm text-main outline-none placeholder:text-muted"
                />
                <Link
                  to="/products"
                  className="shrink-0 rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-primary transition-all duration-300 hover:bg-brand-primary-dark hover:shadow-[0_12px_32px_-4px_rgba(46,181,108,0.5)]"
                >
                  Search
                </Link>
              </div>
            </motion.div>

            {/* Feature pills */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2.5 shadow-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-light">
                    <Icon className="h-4 w-4 text-brand-primary" />
                  </div>
                  <span className="text-xs font-semibold text-main md:text-sm">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Floating Products */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden h-[480px] lg:block"
          >
            {/* Main green circle background */}
            <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-primary/15 via-brand-primary/8 to-transparent" />

            {/* Center product (largest) */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <img
                src={floatingProducts[0]?.image}
                alt={`ZAY'LO ${floatingProducts[0]?.name}`}
                className="h-56 w-auto object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Orbiting products */}
            {floatingProducts.slice(1).map((product, i) => {
              const positions = [
                { left: '8%', top: '12%', size: 'h-36', delay: 0, rotate: -8 },
                { right: '5%', top: '8%', size: 'h-32', delay: 0.5, rotate: 12 },
                { left: '5%', bottom: '10%', size: 'h-32', delay: 1, rotate: -5 },
                { right: '8%', bottom: '12%', size: 'h-36', delay: 1.5, rotate: 8 },
              ]
              const pos = positions[i]
              return (
                <motion.div
                  key={product?.slug}
                  animate={{ y: [0, -12 - i * 3, 0], rotate: [pos.rotate, pos.rotate + 3, pos.rotate] }}
                  transition={{ duration: 3.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: pos.delay }}
                  className="absolute"
                  style={{
                    left: pos.left,
                    right: pos.right,
                    top: pos.top,
                    bottom: pos.bottom,
                  }}
                >
                  <img
                    src={product?.image}
                    alt={`ZAY'LO ${product?.name}`}
                    className={`${pos.size} w-auto object-contain drop-shadow-xl`}
                  />
                </motion.div>
              )
            })}

            {/* Floating price tags */}
            <motion.div
              animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[25%] left-[10%] z-20 rounded-xl bg-surface px-3 py-2 shadow-premium"
            >
              <p className="text-[10px] font-semibold text-muted">Starting at</p>
              <p className="text-lg font-extrabold text-brand-primary">₹5</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute right-[8%] top-[35%] z-20 rounded-xl bg-surface px-3 py-2 shadow-premium"
            >
              <p className="text-[10px] font-semibold text-muted">Products</p>
              <p className="text-lg font-extrabold text-main">7+</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile product scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex justify-center gap-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:hidden hide-scrollbar"
        >
          {floatingProducts.slice(0, 4).map((product, i) => (
            <motion.img
              key={product?.slug}
              src={product?.image}
              alt={`ZAY'LO ${product?.name}`}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              className="h-28 w-24 shrink-0 snap-center object-contain drop-shadow-xl"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
