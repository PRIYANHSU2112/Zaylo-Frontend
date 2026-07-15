import { motion } from 'framer-motion'
import { CheckCircle2, Apple, Play } from 'lucide-react'
import Reveal from '@/components/shared/Reveal'

export default function DownloadApp() {
  return (
    <section className="section-padding bg-surface pt-0">
      <div className="section-container">
        <Reveal className="app-section">
          <div className="green-dot -left-20 -top-20" />
          <div className="green-dot -bottom-32 -right-32" />

          
          
          <div className="relative z-10 grid items-center gap-12 p-8 md:grid-cols-2 md:p-16 lg:p-20">
            {/* Left: Phone mockup */}
            <div className="relative flex justify-center md:justify-end md:pr-10">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 h-[400px] w-[200px] rounded-[2.5rem] border-[6px] border-surface-dark bg-surface shadow-premium md:h-[500px] md:w-[250px]"
              >
                {/* Phone screen content simulation */}
                <div className="h-full w-full overflow-hidden rounded-[2rem] bg-surface-cream p-4">
                  <div className="mb-4 h-6 w-full rounded-full bg-border-subtle/50" />
                  <div className="mb-6 h-32 w-full rounded-xl bg-brand-primary-light" />
                  <div className="mb-2 h-4 w-2/3 rounded bg-border-subtle/50" />
                  <div className="mb-6 h-4 w-1/3 rounded bg-border-subtle/50" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-xl bg-surface shadow-sm" />
                    <div className="h-24 rounded-xl bg-surface shadow-sm" />
                    <div className="h-24 rounded-xl bg-surface shadow-sm" />
                    <div className="h-24 rounded-xl bg-surface shadow-sm" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Content */}
            <div className="max-w-md text-center md:text-left">
              <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-main md:text-4xl lg:text-5xl">
                Download App
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-muted md:text-base">
                Get the best snack delivery experience. Enjoy exclusive offers, real-time tracking, and lightning-fast delivery to your doorstep.
              </p>
              
              <div className="mb-10 space-y-3 text-left">
                {['Exclusive app-only discounts', 'Real-time order tracking', 'Fastest delivery guaranteed'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                    <span className="text-sm font-medium text-main">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl bg-surface-dark px-5 py-2.5 text-white transition-all hover:bg-black active:scale-95"
                >
                  <Apple className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-[10px] text-white/70">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl bg-surface-dark px-5 py-2.5 text-white transition-all hover:bg-black active:scale-95"
                >
                  <Play className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-[10px] text-white/70">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
