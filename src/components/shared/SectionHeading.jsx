import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import Reveal from '@/components/shared/Reveal'

export default function SectionHeading({
  title,
  subtitle,
  linkText,
  linkHref,
  align = 'center',
  className,
  dark = false,
}) {
  return (
    <Reveal
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className,
      )}
    >
      {subtitle && (
        <p
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]',
            dark ? 'text-brand-yellow' : 'text-brand-primary',
            align === 'center' && 'justify-center',
          )}
        >
          <span className={cn('h-px w-6', dark ? 'bg-brand-yellow/50' : 'bg-brand-primary/30')} />
          {subtitle}
          <span className={cn('h-px w-6', dark ? 'bg-brand-yellow/50' : 'bg-brand-primary/30')} />
        </p>
      )}
      <div
        className={cn(
          'flex items-end gap-6',
          align === 'center' && 'justify-center',
          align === 'left' && 'justify-between',
        )}
      >
        <h2
          className={cn(
            'text-3xl font-extrabold leading-tight tracking-tight md:text-4xl',
            dark ? 'text-white' : 'text-main',
          )}
        >
          {title}
        </h2>
        {linkText && linkHref && (
          <Link
            to={linkHref}
            className="group shrink-0 text-sm font-semibold text-brand-primary transition-colors hover:text-brand-primary-dark"
          >
            {linkText}
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </Reveal>
  )
}
