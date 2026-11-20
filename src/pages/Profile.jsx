import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LogOut, MapPin, Package, User, KeyRound, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import SEO from '@/components/shared/SEO'
import AddressForm, { addressLine } from '@/components/shared/AddressForm'
import { EmptyState, ErrorState, Skeleton, Spinner, formatINR } from '@/components/shared/States'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useAddresses, useAddressMutations, useMyOrders } from '@/hooks/useAccount'
import { statusTone, paymentLabel } from '@/pages/OrderDetail'
import { api } from '@/lib/api'
import { cn } from '@/utils/cn'

const TABS = [
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'security', label: 'Password', icon: KeyRound },
]

export default function Profile() {
  const { user, logout } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'orders'

  return (
    <div className="section-container py-10">
      <SEO title="My Account" path="/profile" noindex />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-main md:text-3xl">Hi, {user?.name?.split(' ')[0]}</h1>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>
        <Button variant="secondary" onClick={logout}><LogOut className="h-4 w-4" /> Log out</Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Account sections">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setParams({ tab: key })}
              aria-current={tab === key ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                tab === key ? 'bg-brand-primary text-white' : 'bg-surface text-body hover:bg-brand-primary-light',
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
        <div>
          {tab === 'orders' && <OrdersTab />}
          {tab === 'addresses' && <AddressesTab />}
          {tab === 'profile' && <ProfileTab />}
          {tab === 'security' && <PasswordTab />}
        </div>
      </div>
    </div>
  )
}

function OrdersTab() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error, refetch } = useMyOrders(page)
  if (isLoading) return <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>
  if (isError) return <ErrorState error={error} onRetry={refetch} />
  const orders = data?.data || []
  const meta = data?.meta
  if (!orders.length) {
    return <EmptyState icon={Package} title="No orders yet" message="Your orders will appear here." action={<Link to="/products"><Button>Start shopping</Button></Link>} />
  }
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <Link key={o.id} to={`/orders/${o.id}`} className="block rounded-2xl border border-border-subtle bg-surface p-5 shadow-card transition-colors hover:border-brand-primary/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-main">{o.orderCode}</p>
            <div className="flex gap-2">
              <span className={cn('rounded-full px-3 py-1 text-xs font-bold', statusTone(o.status))}>{o.status}</span>
              <span className="rounded-full bg-border-subtle/60 px-3 py-1 text-xs font-semibold">{paymentLabel(o)}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm text-muted">
            <span>{new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</span>
            <span className="font-bold text-main">{formatINR(o.amount)}</span>
          </div>
        </Link>
      ))}
      {meta?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="qty-btn disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm text-muted">Page {page} of {meta.totalPages}</span>
          <button type="button" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="qty-btn disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  )
}

function AddressesTab() {
  const toast = useToast()
  const { data, isLoading, isError, error, refetch } = useAddresses()
  const { create, update, remove } = useAddressMutations()
  const [editing, setEditing] = useState(null) // 'new' | address

  if (isLoading) return <Skeleton className="h-32" />
  if (isError) return <ErrorState error={error} onRetry={refetch} />
  const list = data || []

  const save = async (body) => {
    try {
      if (editing === 'new') await create.mutateAsync(body)
      else await update.mutateAsync({ id: editing.id, ...body })
      toast.success('Address saved')
      setEditing(null)
    } catch {
      /* shown in form */
    }
  }

  const del = async (a) => {
    if (!window.confirm('Delete this address?')) return
    try {
      await remove.mutateAsync(a.id)
      toast.success('Address deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (editing) {
    return (
      <div className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-card">
        <h2 className="mb-4 font-bold text-main">{editing === 'new' ? 'Add address' : 'Edit address'}</h2>
        <AddressForm
          initial={editing === 'new' ? undefined : { ...editing, line1: editing.line1 }}
          pending={create.isPending || update.isPending}
          serverError={(create.error || update.error)?.message}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Add new address</Button>
      {!list.length ? (
        <EmptyState icon={MapPin} title="No saved addresses" message="Add an address to check out faster." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between">
                <p className="font-bold text-main">{a.name || a.type} <span className="ml-1 rounded-full bg-border-subtle/60 px-2 py-0.5 text-[10px] uppercase">{a.type}</span></p>
                {a.isDefault && <span className="text-xs font-semibold text-brand-primary">Default</span>}
              </div>
              <p className="mt-2 text-sm text-muted">{addressLine(a)}</p>
              {a.phone && <p className="text-sm text-muted">{a.phone}</p>}
              <div className="mt-4 flex gap-2">
                <Button variant="ghost" className="!px-3" onClick={() => setEditing(a)}><Pencil className="h-4 w-4" /> Edit</Button>
                <Button variant="ghost" className="!px-3 text-red-600 hover:bg-red-50" onClick={() => del(a)}><Trash2 className="h-4 w-4" /> Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileTab() {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const save = async (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return setError('Enter your full name')
    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) return setError('Enter a valid phone number')
    setError('')
    setPending(true)
    try {
      const u = await api.patch('/me', { name: form.name.trim(), phone: form.phone.trim() })
      updateUser(u)
      toast.success('Profile updated')
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={save} className="max-w-lg space-y-4 rounded-3xl border border-border-subtle bg-surface p-6 shadow-card">
      <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Email" value={user?.email || ''} disabled readOnly />
      <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <Button type="submit" disabled={pending}>{pending && <Spinner />} Save changes</Button>
    </form>
  )
}

function PasswordTab() {
  const { applySession } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const save = async (e) => {
    e.preventDefault()
    if (form.newPassword.length < 8) return setError('New password must be at least 8 characters')
    if (form.newPassword !== form.confirm) return setError('Passwords do not match')
    setError('')
    setPending(true)
    try {
      const session = await api.patch('/me/password', { currentPassword: form.currentPassword, newPassword: form.newPassword })
      applySession(session) // other sessions are signed out server-side
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
      toast.success('Password updated')
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={save} className="max-w-lg space-y-4 rounded-3xl border border-border-subtle bg-surface p-6 shadow-card">
      <Input label="Current password" type="password" autoComplete="current-password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
      <Input label="New password" type="password" autoComplete="new-password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
      <Input label="Confirm new password" type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <Button type="submit" disabled={pending || !form.currentPassword}>{pending && <Spinner />} Update password</Button>
    </form>
  )
}
