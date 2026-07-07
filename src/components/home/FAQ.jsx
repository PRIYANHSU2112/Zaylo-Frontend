import SectionHeading from '@/components/shared/SectionHeading'
import FAQAccordion from '@/components/shared/FAQAccordion'
import Button from '@/components/ui/Button'
import Reveal from '@/components/shared/Reveal'
import { faqs } from '@/data/content'

export default function FAQ() {
  return (
    <section id="faq" className="section-padding bg-surface-cream">
      <div className="section-container">
        <SectionHeading subtitle="Got Questions?" title="Frequently Asked Questions" />
        <Reveal className="mx-auto max-w-3xl">
          <FAQAccordion items={faqs} />
        </Reveal>
      </div>
    </section>
  )
}

export function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-surface-dark py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-brand-yellow/10 blur-3xl" />
      </div>
      <div className="section-container relative text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
            Stay in the Loop
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/55 md:text-base">
            Subscribe for exclusive offers, new product launches, and snack recipes delivered to your inbox.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-full border border-white/10 bg-surface/5 px-5 py-3.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-yellow/40 focus:ring-2 focus:ring-brand-yellow/20"
            />
            <Button variant="dealer" className="shrink-0">Subscribe</Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function FactoryTour() {
  const steps = ['Raw Materials', 'Extrusion', 'Frying', 'Seasoning', 'Packaging', 'Quality Check']
  return (
    <section className="section-padding bg-surface-cream">
      <div className="section-container">
        <SectionHeading subtitle="Behind The Scenes" title="Factory Tour" align="left" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {steps.map((step, i) => (
            <div
              key={step}
              className="rounded-[1.75rem] border border-border-subtle/80 bg-surface p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary-light text-sm font-extrabold text-brand-primary">
                {String(i + 1).padStart(2, '0')}
              </div>
              <p className="text-xs font-semibold text-main md:text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
