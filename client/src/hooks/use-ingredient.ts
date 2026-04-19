import { useQuery } from '@tanstack/react-query'
import { getIngredients } from '@/api/ingredients/ingredients.ts'

const ingredientApi = getIngredients()

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredient'],
    queryFn: () => ingredientApi.getIngredients(),
  })
}
