/**
 * Stale-while-revalidate for public content across visits.
 * Successful responses of public queries (home, settings, categories, CMS, banners) are
 * saved to localStorage; on the next visit they render instantly while React Query
 * refetches fresh data in the background (they are marked with their original fetch time,
 * so they are already "stale" and always revalidated). Only real API responses are stored.
 */
const STORAGE_KEY = 'zaylo-public-cache-v1'
const MAX_AGE = 24 * 60 * 60 * 1000
const PERSISTED_ROOTS = new Set(['home', 'settings', 'categories', 'cms', 'banners'])

const isPersisted = (query) => PERSISTED_ROOTS.has(query.queryKey?.[0]) && query.state.status === 'success'

export function restorePersistedQueries(queryClient) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const now = Date.now()
    for (const entry of saved) {
      if (!entry?.key || now - entry.updatedAt > MAX_AGE) continue
      queryClient.setQueryData(entry.key, entry.data, { updatedAt: entry.updatedAt })
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function persistQueries(queryClient) {
  let timer
  const save = () => {
    const entries = queryClient
      .getQueryCache()
      .getAll()
      .filter(isPersisted)
      .map((q) => ({ key: q.queryKey, data: q.state.data, updatedAt: q.state.dataUpdatedAt }))
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      /* quota exceeded / private mode — caching is best effort */
    }
  }
  return queryClient.getQueryCache().subscribe((event) => {
    if (event.type !== 'updated' || event.action?.type !== 'success' || !isPersisted(event.query)) return
    clearTimeout(timer)
    timer = setTimeout(save, 500)
  })
}
