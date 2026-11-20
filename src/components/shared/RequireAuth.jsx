import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/shared/States'

/** Route guard for customer-only pages. Server enforces auth independently. */
export default function RequireAuth({ children }) {
  const { status } = useAuth()
  const location = useLocation()
  if (status === 'loading') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-brand-primary">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }
  if (status !== 'authenticated') {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }
  return children
}
