import { motion } from 'framer-motion'

// Industry-standard entrance: ~0.7s ease-out-expo, short travel, gentle stagger.
const EASE = [0.22, 1, 0.36, 1]
const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -60px 0px' }

export default function Reveal({ children, className, delay = 0, y = 24, once = true, id }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ ...VIEWPORT, once }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealStagger({ children, className, stagger = 0.08 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
