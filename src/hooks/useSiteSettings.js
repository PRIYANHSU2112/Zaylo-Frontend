import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const SITE_SETTINGS_QUERY_KEY = ['settings']

/** Empty structural shape so consumers can read nested keys while loading. No business data. */
const EMPTY = Object.freeze({
  corporate: {},
  factory: {},
  whatsapp: '',
  salesTeam: [],
  brand: {},
  social: {},
  footer: {},
  map: {},
  general: {},
  commerce: null,
  payments: { onlineEnabled: false },
})

function shape(data) {
  if (!data) return EMPTY
  return {
    ...EMPTY,
    ...data,
    corporate: data.corporate || {},
    factory: data.factory || {},
    brand: data.brand || {},
    social: data.social || {},
    footer: data.footer || {},
    map: data.map || {},
    general: data.general || {},
    salesTeam: Array.isArray(data.salesTeam) ? data.salesTeam : [],
  }
}

/** Shared site settings (company, footer, social, commerce rules) from GET /settings. */
export function useSiteSettings() {
  const query = useQuery({
    queryKey: SITE_SETTINGS_QUERY_KEY,
    queryFn: () => api.get('/settings'),
    staleTime: 120_000,
    gcTime: 600_000,
  })
  return {
    settings: shape(query.data),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
