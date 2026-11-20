import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, toQuery } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export function useAddresses() {
  const { isAuthenticated } = useAuth()
  return useQuery({ queryKey: ['me', 'addresses'], queryFn: () => api.get('/me/addresses'), enabled: isAuthenticated })
}

export function useAddressMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['me', 'addresses'] })
  return {
    create: useMutation({ mutationFn: (body) => api.post('/me/addresses', body), onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, ...body }) => api.patch(`/me/addresses/${id}`, body), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: (id) => api.delete(`/me/addresses/${id}`), onSuccess: invalidate }),
  }
}

export function useMyOrders(page = 1) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['me', 'orders', page],
    queryFn: () => api.list(`/orders/me${toQuery({ page, limit: 10 })}`),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  })
}

export function useOrder(id) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['me', 'order', id],
    queryFn: () => api.get(`/orders/${id}`),
    enabled: isAuthenticated && Boolean(id),
    retry: (n, err) => err?.status !== 404 && n < 1,
  })
}

/** POST /checkout/quote — authoritative server totals for the current cart. */
export function useCheckoutQuote(lines, { couponCode = '', paymentMethod = 'COD' } = {}) {
  return useQuery({
    queryKey: ['quote', lines, couponCode, paymentMethod],
    queryFn: () => api.post('/checkout/quote', { items: lines, couponCode, paymentMethod }),
    enabled: lines.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
}

/** Open the server-rendered invoice in a new tab for printing / saving as PDF. */
export async function openInvoice(orderId) {
  const win = window.open('', '_blank')
  try {
    const html = await api.html(`/orders/${orderId}/invoice`)
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    if (win) win.location.href = url
    else window.location.href = url
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (err) {
    win?.close()
    throw err
  }
}
