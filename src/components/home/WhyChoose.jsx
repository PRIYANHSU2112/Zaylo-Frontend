import { Award, Tag, Grid3X3, MapPin } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import { RevealStagger, RevealItem } from '@/components/shared/Reveal'
import { whyChoose } from '@/data/content'

const iconMap = { award: Award, tag: Tag, grid: Grid3X3, map: MapPin }

export default function WhyChoose() {
  return (
    <section className="section-padding bg-surface">
      <div className="section-container">
        <SectionHeading subtitle="Our Promise" title="Why Choose ZAY'LO" />
        <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChoose.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <RevealItem key={item.title}>
                <div className="h-full rounded-[1.75rem] border border-border-subtle/80 bg-surface p-7 shadow-card transition-all duration-500 hover:border-brand-primary/10 hover:shadow-hover">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary-light">
                    <Icon className="h-5 w-5 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-main">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </RevealItem>
            )
          })}
        </RevealStagger>
      </div>
    </section>
  )
}
