import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const CMS_HOME_QUERY_KEY = ['cms', 'home']

/** Home/About CMS content from GET /cms/home. */
export function useCmsHome() {
  const query = useQuery({
    queryKey: CMS_HOME_QUERY_KEY,
    queryFn: () => api.get('/cms/home'),
    staleTime: 300_000,
    gcTime: 900_000,
  })
  const about = query.data?.about || {}
  return {
    cms: query.data,
    about: {
      ...about,
      timeline: about.timeline || [],
      values: about.values || [],
      awards: about.awards || [],
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
