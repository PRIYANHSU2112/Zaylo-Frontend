import { motion } from 'framer-motion'
import SectionHeading from '@/components/shared/SectionHeading'
import { useCmsHome } from '@/hooks/useCmsHome'

/** Partner names managed in admin CMS (cms.trustedBy). Hidden when none are configured. */
export default function TrustedBy() {
  const { cms } = useCmsHome()
  const partners = (cms?.trustedBy || []).filter(Boolean)
  if (!partners.length) return null

  return (
    <section className="bg-surface py-10 md:py-12">
      <div className="section-container">
        <SectionHeading title="Our Trusted Partners" align="left" className="!mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-6 opacity-70">
          {partners.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
