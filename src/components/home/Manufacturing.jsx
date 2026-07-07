import { Link } from 'react-router-dom'
import { Factory, Shield, Truck } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import Button from '@/components/ui/Button'

export default function Manufacturing() {
  return (
    <section id="manufacturing" className="section-padding bg-surface">
      <div className="section-container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-primary/20 via-brand-yellow/10 to-brand-primary/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <Factory className="h-24 w-24 text-brand-primary/30" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
              {[Shield, Factory, Truck].map((Icon, i) => (
                <div key={i} className="glass-card flex flex-col items-center p-3 text-center">
                  <Icon className="mb-1 h-5 w-5 text-brand-primary" />
                  <span className="text-[10px] font-semibold text-main">
                    {['ISO Certified', 'Modern Plant', 'Fast Delivery'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading
              subtitle="Our Factory"
              title="World-Class Manufacturing"
              align="left"
              className="!mb-6"
            />
            <p className="text-sm leading-relaxed text-muted md:text-base">
              Our state-of-the-art manufacturing facility in Sonipat, Haryana produces
              millions of packs monthly. ISO 22000 certified with rigorous quality control
              at every step — from raw materials to final packaging.
            </p>
            <Link to="/about" className="mt-6 inline-block">
              <Button variant="outline">Learn About Our Process</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
