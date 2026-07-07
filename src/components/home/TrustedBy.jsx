import { motion } from 'framer-motion'
import { trustedBy } from '@/data/content'
import SectionHeading from '@/components/shared/SectionHeading'

export default function TrustedBy() {
  return (
    <section className="bg-surface py-12 md:py-16">
      <div className="section-container">
        <SectionHeading
          title="Our Trusted Partner"
          align="left"
          className="!mb-8"
        />
        <div className="flex flex-wrap items-center justify-between gap-6 opacity-70">
          {trustedBy.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="partner-text cursor-default"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
