import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function Modal({ open, onClose, title, children, className }) {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)

  // Body scroll lock + focus management
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement
      document.body.classList.add('scroll-locked')
      // Focus the modal after animation
      const timer = setTimeout(() => modalRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    } else {
      document.body.classList.remove('scroll-locked')
      // Restore focus to the element that triggered the modal
      previousActiveElement.current?.focus?.()
    }
    return () => document.body.classList.remove('scroll-locked')
  }, [open])

  // Escape key handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
    }
    // Focus trap
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Dialog'}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-surface-dark/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative z-10 w-full max-w-lg rounded-3xl bg-surface p-6 shadow-premium outline-none',
              className,
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              {title && <h3 className="text-lg font-bold text-main">{title}</h3>}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-muted transition-colors duration-200 hover:bg-border-subtle hover:text-main"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
