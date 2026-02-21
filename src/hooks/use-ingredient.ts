import { useQuery } from '@tanstack/react-query'
import { getIngredients } from '@/api/ingredients/ingredients.ts'

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredient'],
    queryFn: async () => {
      return getIngredients()
    },
  })
}
