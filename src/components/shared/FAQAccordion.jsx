import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

export default function FAQAccordion({ items, className }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={index} className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="pr-4 text-sm font-semibold text-main md:text-base">
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-brand-primary transition-transform duration-300',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="border-t border-border-subtle px-5 py-4 text-sm leading-relaxed text-muted">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
