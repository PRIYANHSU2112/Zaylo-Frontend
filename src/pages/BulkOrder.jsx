import { useState } from 'react'
import { CheckCircle2, Package, Building2, Truck, Users } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import Button from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'

export default function BulkOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  const features = [
    { icon: Building2, title: 'Direct from Factory', desc: 'No middlemen. Get fresh stock straight from our manufacturing unit.' },
    { icon: Package, title: 'Wholesale Pricing', desc: 'Unbeatable margins for distributors, corporate events, and retailers.' },
    { icon: Truck, title: 'Pan-India Delivery', desc: 'Fast, reliable shipping across all states with real-time tracking.' },
    { icon: Users, title: 'Dedicated Support', desc: 'A personal account manager for all your queries and re-orders.' },
  ]

  return (
    <div className="bg-background min-h-screen pb-20">
      <PageHero
        title="Corporate & Bulk Orders"
        subtitle="Premium Indian snacks for your events, office pantry, or wholesale distribution."
      />

      <div className="section-container mt-12 grid gap-12 lg:grid-cols-2">
        {/* Left Side: Info */}
        <Reveal className="space-y-10">
          <div>
            <h2 className="text-3xl font-extrabold text-main mb-4">Partner with ZAY'LO</h2>
            <p className="text-muted leading-relaxed max-w-md">
              Whether you are stocking up for a retail chain, organizing a massive corporate event, or looking for high-quality export products, we have the capacity and quality to meet your demands.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, i) => (
              <div key={i} className="rounded-[1.5rem] bg-surface p-6 shadow-card border border-border-subtle hover:shadow-hover transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-main mb-2">{feature.title}</h4>
                <p className="text-sm text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Right Side: Form */}
        <Reveal delay={0.2} className="relative z-10">
          <div className="rounded-[2rem] bg-surface p-8 md:p-10 shadow-premium border border-border-subtle relative overflow-hidden">
            
            <div className="absolute top-0 right-0 h-40 w-40 bg-brand-primary/5 blur-3xl rounded-full" />
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-10 h-full min-h-[400px]">
                <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-main mb-3">Request Submitted!</h3>
                <p className="text-muted mb-8 max-w-sm">
                  Thank you for your interest in ZAY'LO. Our bulk order team will review your requirements and get back to you within 24 hours.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-main mb-6 relative z-10">Request a Quote</h3>
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Full Name" placeholder="John Doe" required />
                    <Input label="Company Name" placeholder="ABC Corp" required />
                  </div>
                  
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Email Address" type="email" placeholder="john@example.com" required />
                    <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" required />
                  </div>

                  <Select label="Inquiry Type" required>
                    <option value="">Select an option</option>
                    <option value="corporate">Corporate Gifting / Office Pantry</option>
                    <option value="wholesale">Wholesale / Distribution</option>
                    <option value="export">International Export</option>
                    <option value="events">Weddings / Events</option>
                  </Select>

                  <Select label="Estimated Order Value (₹)" required>
                    <option value="">Select range</option>
                    <option value="10k-50k">10,000 - 50,000</option>
                    <option value="50k-1L">50,000 - 1,00,000</option>
                    <option value="1L+">1,00,000+</option>
                  </Select>

                  <Textarea label="Additional Details" placeholder="Tell us about specific products, quantities, or packaging requirements..." required />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
