import { cn } from '@/utils/cn'

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-brand-primary/10 text-brand-primary',
    new: 'bg-brand-primary/10 text-brand-primary',
    gold: 'bg-brand-gold/20 text-brand-gold',
    dark: 'bg-surface-dark text-white',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
