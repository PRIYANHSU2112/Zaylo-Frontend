import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const HOME_QUERY_KEY = ['home']

const EMPTY_HOME = Object.freeze({
  announcements: [],
  promos: [],
  landingImages: [],
  categories: [],
  popularProducts: [],
  bundles: [],
  testimonials: [],
  banners: {},
  featuredProducts: [],
  newArrivals: [],
  bestSellers: [],
})

/** Curated home aggregate from GET /home. No static fallback — callers render loading/error states. */
export function useHome() {
  const query = useQuery({
    queryKey: HOME_QUERY_KEY,
    queryFn: () => api.get('/home'),
    staleTime: 120_000,
    gcTime: 600_000,
  })
  return {
    home: query.data ? { ...EMPTY_HOME, ...query.data } : EMPTY_HOME,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
