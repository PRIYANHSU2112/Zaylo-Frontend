import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import SEO from '@/components/shared/SEO'
import { Spinner } from '@/components/shared/States'
import { AuthShell, safeNext } from '@/pages/Login'

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const { settings } = useSiteSettings()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)

  if (isAuthenticated) return <Navigate to={next} replace />
  const closed = settings.general?.allowRegistrations === false

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your full name'
    if (!EMAIL_RX.test(form.email.trim())) e.email = 'Enter a valid email'
    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number'
    if (form.password.length < 8) e.password = 'Use at least 8 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setPending(true)
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() })
      toast.success('Account created — welcome to ZAY\'LO!')
      navigate(next, { replace: true })
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setPending(false)
    }
  }

  const field = (key, props) => (
    <div>
      <Input {...props} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} aria-invalid={!!errors[key]} />
      {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
    </div>
  )

  return (
    <AuthShell title="Create your account" subtitle="Save addresses, track orders and reorder your favourites.">
      <SEO title="Create account" path="/register" noindex />
      {closed ? (
        <p className="rounded-xl bg-brand-primary-light px-4 py-3 text-sm text-main">New registrations are currently closed. Please check back later.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          {field('name', { label: 'Full name', autoComplete: 'name', required: true })}
          {field('email', { label: 'Email', type: 'email', autoComplete: 'email', required: true })}
          {field('phone', { label: 'Phone (optional)', type: 'tel', autoComplete: 'tel' })}
          {field('password', { label: 'Password', type: 'password', autoComplete: 'new-password', required: true })}
          {errors.form && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{errors.form}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Spinner /> : <UserPlus className="h-4 w-4" />} Create account
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-primary">Log in</Link>
      </p>
    </AuthShell>
  )
}
