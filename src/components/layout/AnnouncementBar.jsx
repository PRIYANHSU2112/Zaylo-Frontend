import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { announcementBanners } from '@/data/banners'

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcementBanners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const banner = announcementBanners[index]

  return (
    <div
      className="relative bg-brand-primary py-2.5 text-center text-xs font-medium text-white md:text-sm"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          <Link to={banner.link} className="transition-opacity duration-200 hover:opacity-80">
            {banner.text}
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
