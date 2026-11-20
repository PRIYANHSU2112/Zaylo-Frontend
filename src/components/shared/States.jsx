import { AlertTriangle, PackageOpen, RotateCw } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Error block with retry — used instead of silently showing fallback data. */
export function ErrorState({ title = 'Something went wrong', error, onRetry, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-3xl border border-border-subtle bg-surface px-6 py-12 text-center', className)} role="alert">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-main">{title}</h3>
      {error?.message && <p className="mt-1 max-w-md text-sm text-muted">{error.message}</p>}
      {onRetry && (
        <button type="button" onClick={() => onRetry()} className="btn-primary mt-6 !py-2.5">
          <RotateCw className="h-4 w-4" /> Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ icon: Icon = PackageOpen, title, message, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-3xl border border-dashed border-border-subtle bg-surface px-6 py-14 text-center', className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-border-subtle/50 text-muted">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-main">{title}</h3>
      {message && <p className="mt-1 max-w-md text-sm text-muted">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('skeleton-shimmer rounded-xl', className)} aria-hidden="true" />
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-subtle/80 bg-surface p-4">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="mt-4 h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-4 flex justify-between"><Skeleton className="h-6 w-14" /><Skeleton className="h-9 w-20" /></div>
    </div>
  )
}

export function Spinner({ className }) {
  return <span className={cn('inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent', className)} aria-label="Loading" />
}

export const formatINR = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
