import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import Button from '@/components/ui/Button'
import { dealerContent } from '@/data/content'

export default function DealerBenefits() {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <SectionHeading subtitle="Partner With Us" title="Dealer Benefits" align="left" />
        <div className="grid gap-5 md:grid-cols-3">
          {dealerContent.benefits.slice(0, 3).map((benefit) => (
            <div key={benefit.title} className="bento-card p-6 md:p-8">
              <h3 className="text-lg font-bold text-main">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{benefit.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/dealer">
            <Button>Become a ZAY&apos;LO Dealer</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
