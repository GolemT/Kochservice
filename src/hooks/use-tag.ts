import { useQuery } from '@tanstack/react-query'
import { getTags } from '@/api/tags/tags.ts'

export function useTags() {
  return useQuery({
    queryKey: ['tag'],
    queryFn: async () => {
      return getTags()
    },
  })
}
