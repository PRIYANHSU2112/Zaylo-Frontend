import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api, toQuery } from '@/lib/api'

/** GET /products — server search, filter, sort, pagination. */
export function useProducts(params = {}, options = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: ({ signal }) => api.list(`/products${toQuery(params)}`, { signal }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    ...options,
  })
}

/** GET /products/:slug → { product, related } */
export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${encodeURIComponent(slug)}`),
    enabled: Boolean(slug),
    staleTime: 60_000,
    retry: (count, err) => err?.status !== 404 && count < 1,
  })
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: () => api.get('/categories'), staleTime: 300_000 })
}

export function useBlogs(params = {}) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: () => api.list(`/blogs${toQuery({ limit: 50, ...params })}`),
    staleTime: 300_000,
  })
}

export function useGallery(params = {}) {
  return useQuery({
    queryKey: ['gallery', params],
    queryFn: () => api.list(`/gallery${toQuery({ limit: 100, ...params })}`),
    staleTime: 300_000,
  })
}

/** Active, in-schedule banners for one placement (Admin → Banners). */
export function useBanners(placement) {
  return useQuery({
    queryKey: ['banners', placement],
    queryFn: () => api.get(`/banners${toQuery({ placement })}`),
    select: (d) => d?.banners || [],
    staleTime: 60_000,
  })
}
