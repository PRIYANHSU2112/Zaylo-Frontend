import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export default function TrustBadges({ stats, className }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4', className)}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border-subtle/80 bg-surface/90 px-4 py-5 text-center shadow-card backdrop-blur-sm md:px-6 md:py-6"
        >
          <p className="text-2xl font-extrabold text-brand-primary md:text-3xl">{stat.value}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted md:text-xs">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
