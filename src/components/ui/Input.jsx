import { useId } from 'react'
import { cn } from '@/utils/cn'

export function Input({ label, className, id: externalId, ...props }) {
  const autoId = useId()
  const id = externalId || autoId

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-main">
          {label}
        </label>
      )}
      <input id={id} className={cn('input-field', className)} {...props} />
    </div>
  )
}

export function Textarea({ label, className, id: externalId, rows = 4, ...props }) {
  const autoId = useId()
  const id = externalId || autoId

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-main">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn('input-field resize-none', className)}
        rows={rows}
        {...props}
      />
    </div>
  )
}

export function Select({ label, children, className, id: externalId, ...props }) {
  const autoId = useId()
  const id = externalId || autoId

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-main">
          {label}
        </label>
      )}
      <select id={id} className={cn('input-field appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2364748b%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")] pr-10', className)} {...props}>
        {children}
      </select>
    </div>
  )
}
