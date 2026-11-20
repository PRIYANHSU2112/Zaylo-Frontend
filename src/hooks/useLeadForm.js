import { useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

/**
 * Submit an uncontrolled <form> (inputs carry `name`) to a public lead endpoint.
 * Success is shown only after the API confirms the record was saved.
 */
export function useLeadForm(endpoint, { map = (v) => v, successMessage } = {}) {
  const toast = useToast()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.reportValidity()) return
    const values = Object.fromEntries(
      [...new FormData(form).entries()].map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
    )
    setPending(true)
    setError('')
    try {
      await api.post(endpoint, map(values))
      form.reset()
      setSubmitted(true)
      if (successMessage) toast.success(successMessage)
    } catch (err) {
      setError(err.details?.length ? err.details.join(', ') : err.message)
    } finally {
      setPending(false)
    }
  }

  return { onSubmit, pending, error, submitted, reset: () => setSubmitted(false) }
}
