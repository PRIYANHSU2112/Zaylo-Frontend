import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import SEO from '@/components/shared/SEO'
import { Spinner } from '@/components/shared/States'

/** Only allow same-site relative redirects (prevents open redirect). */
export const safeNext = (v) => (v && v.startsWith('/') && !v.startsWith('//') ? v : '/profile')

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  if (isAuthenticated) return <Navigate to={next} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      const user = await login({ email: form.email.trim(), password: form.password })
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(next, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to track orders, save addresses and check out faster.">
      <SEO title="Log in" path="/login" noindex />
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input label="Email" type="email" autoComplete="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" autoComplete="current-password" required minLength={4} value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        <Button type="submit" className="w-full" disabled={pending || !form.email || !form.password}>
          {pending ? <Spinner /> : <LogIn className="h-4 w-4" />} Log in
        </Button>
        <p className="text-center text-xs text-muted">
          Forgot your password? Please <Link to="/contact" className="font-semibold text-brand-primary">contact support</Link>.
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New here?{' '}
        <Link to={`/register?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-primary">Create an account</Link>
      </p>
    </AuthShell>
  )
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <section className="section-container flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-md rounded-[2rem] border border-border-subtle bg-surface p-8 shadow-premium md:p-10">
        <h1 className="text-2xl font-extrabold text-main md:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
