import { useState } from 'react'
import { Input, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Spinner } from '@/components/shared/States'

const EMPTY = { type: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false }

export function validateAddress(a) {
  const e = {}
  if ((a.name || '').trim().length < 2) e.name = 'Enter the recipient name'
  if (!/^[0-9+\-\s]{7,15}$/.test(a.phone || '')) e.phone = 'Enter a valid phone number'
  if ((a.line1 || '').trim().length < 3) e.line1 = 'Enter the street address'
  if ((a.city || '').trim().length < 2) e.city = 'Enter the city'
  if ((a.state || '').trim().length < 2) e.state = 'Enter the state'
  if (!/^[1-9][0-9]{5}$/.test(a.pincode || '')) e.pincode = 'Enter a valid 6-digit pincode'
  return e
}

export const addressLine = (a) =>
  [a.line1, a.line2, a.city, [a.state, a.pincode].filter(Boolean).join(' - ')].filter(Boolean).join(', ') || a.address

/** Structured address form (validated client-side; server validates again). */
export default function AddressForm({ initial, onSubmit, onCancel, submitLabel = 'Save address', pending, serverError }) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) })
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const errs = validateAddress(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    const { type, name, phone, line1, line2, city, state, pincode, isDefault } = form
    onSubmit({ type, name: name.trim(), phone: phone.trim(), line1: line1.trim(), line2: line2.trim(), city: city.trim(), state: state.trim(), pincode: pincode.trim(), isDefault })
  }

  const field = (k, props) => (
    <div>
      <Input {...props} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} />
      {errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>}
    </div>
  )

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      {field('name', { label: 'Full name', autoComplete: 'name' })}
      {field('phone', { label: 'Phone', type: 'tel', autoComplete: 'tel' })}
      <div className="sm:col-span-2">{field('line1', { label: 'House no., street', autoComplete: 'address-line1' })}</div>
      <div className="sm:col-span-2">{field('line2', { label: 'Landmark / area (optional)', autoComplete: 'address-line2' })}</div>
      {field('city', { label: 'City', autoComplete: 'address-level2' })}
      {field('state', { label: 'State', autoComplete: 'address-level1' })}
      {field('pincode', { label: 'Pincode', inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' })}
      <Select label="Address type" value={form.type} onChange={set('type')}>
        <option>Home</option>
        <option>Work</option>
        <option>Other</option>
      </Select>
      <label className="flex items-center gap-2 text-sm text-body sm:col-span-2">
        <input type="checkbox" checked={form.isDefault} onChange={set('isDefault')} className="h-4 w-4 accent-[var(--theme-primary)]" />
        Make this my default address
      </label>
      {serverError && <p className="text-sm text-red-600 sm:col-span-2" role="alert">{serverError}</p>}
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" disabled={pending}>{pending && <Spinner />} {submitLabel}</Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
