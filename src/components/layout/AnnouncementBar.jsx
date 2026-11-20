import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useHome } from '@/hooks/useHome'

export default function AnnouncementBar() {
  const { home } = useHome()
  const announcements = home.announcements || []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (announcements.length <= 1) return undefined
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [announcements.length])

  useEffect(() => {
    if (index >= announcements.length) setIndex(0)
  }, [announcements.length, index])

  if (!announcements.length) return null

  const banner = announcements[index] || announcements[0]

  return (
    <div
      // Fixed height + absolutely positioned text: swapping messages never changes layout height
      className="relative h-9 overflow-hidden bg-brand-primary text-center text-xs font-medium text-white md:h-10 md:text-sm"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={banner.id || index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center px-4"
        >
          <Link to={banner.link || '/products'} className="truncate transition-opacity duration-200 hover:opacity-80">
            {banner.text}
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
