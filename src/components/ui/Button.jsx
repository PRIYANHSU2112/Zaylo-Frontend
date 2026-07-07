import { cn } from '@/utils/cn'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  dealer: 'btn-dealer',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-main transition-all duration-200 hover:bg-border-subtle active:scale-95',
  outline: 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-primary px-6 py-3 text-sm font-semibold text-brand-primary transition-all duration-200 hover:bg-brand-primary hover:text-white active:scale-95',
}

export default function Button({
  children,
  variant = 'primary',
  className,
  disabled,
  as: Component = 'button',
  ...props
}) {
  return (
    <Component
      className={cn(
        variants[variant],
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      disabled={Component === 'button' ? disabled : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}
