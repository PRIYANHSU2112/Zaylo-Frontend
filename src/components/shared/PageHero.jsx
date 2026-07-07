import { Link } from 'react-router-dom'
import Reveal from '@/components/shared/Reveal'
import { cn } from '@/utils/cn'

export default function PageHero({ title, subtitle, breadcrumb, children, className }) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-border-subtle bg-surface',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-primary/[0.04] blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-brand-yellow/[0.08] blur-3xl" />
      </div>
      <div className="section-container relative py-12 md:py-16 lg:py-20">
        <Reveal>
          {breadcrumb && (
            <p className="text-sm text-muted">{breadcrumb}</p>
          )}
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-main md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {subtitle}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  )
}

export function Breadcrumb({ items }) {
  return (
    <p className="text-sm text-muted">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && ' / '}
          {item.href ? (
            <Link to={item.href} className="transition-colors hover:text-brand-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-muted">{item.label}</span>
          )}
        </span>
      ))}
    </p>
  )
}
