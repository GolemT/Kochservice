import { useInfiniteQuery, useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getRecipes } from '@/api/recipes/recipes.ts'
import type {
  CreateRecipeRequest,
  RecipeResponse,
  UpdateRecipeRequest,
} from '@/api/kochservice.schemas'

const recipeApi = getRecipes()

export function useInfiniteRecipes(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ['recipes'],
    queryFn: ({ pageParam }) =>
      recipeApi.getRecipes({ page: pageParam, page_size: pageSize }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.recipes.length < pageSize) return undefined
      return allPages.length
    },
    initialPageParam: 0,
  })
}

export function useRecipe(id: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const infiniteData = queryClient.getQueryData<any>(['recipes'])

      if (infiniteData?.pages) {
        for (const page of infiniteData.pages) {
          const recipe = page.data.recipes.find(
            (r: RecipeResponse) => r.id === id,
          )
          if (recipe) return { data: recipe, status: 200 }
        }
      }

      return recipeApi.getRecipe(id)
    },
    enabled: !!id,
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRecipeRequest) => recipeApi.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipeRequest }) =>
      recipeApi.updateRecipe(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.id] })
    },
  })
}
