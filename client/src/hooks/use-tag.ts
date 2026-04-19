import { useQuery } from '@tanstack/react-query'
import { getTags } from '@/api/tags/tags.ts'

const tagApi = getTags()

export function useTags() {
  return useQuery({
    queryKey: ['tag'],
    queryFn: () => tagApi.getTags(),
  })
}
