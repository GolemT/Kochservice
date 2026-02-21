import { useInfiniteQuery } from '@tanstack/react-query'
import {
  getRecipes,
  getRecipe,
  updateRecipe,
  createRecipe,
} from '@/api/recipes/recipes.ts'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import type {
  CreateRecipeRequest,
  RecipeResponse,
  UpdateRecipeRequest,
} from '@/api/kochservice.schemas'

export function useInfiniteRecipes(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ['recipes'],
    queryFn: ({ pageParam }) =>
      getRecipes({ page: pageParam, page_size: pageSize }),
    getNextPageParam: (lastPage, allPages) => {
      // If last page has fewer items than pageSize, we're done
      if (lastPage.data.recipes.length < pageSize) return undefined
      return allPages.length // next page number
    },
    initialPageParam: 0,
  })
}

export function useRecipe(id: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      // Check if recipe exists in infinite query cache
      const infiniteData = queryClient.getQueryData<any>(['recipes'])

      if (infiniteData?.pages) {
        for (const page of infiniteData.pages) {
          const recipe = page.data.recipes.find(
            (r: RecipeResponse) => r.id === id,
          )
          if (recipe) return { data: recipe, status: 200 }
        }
      }

      // Not in cache, fetch individually
      return getRecipe(id)
    },
    enabled: !!id,
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateRecipeRequest) => {
      await createRecipe(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateRecipeRequest
    }) => await updateRecipe(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.id] })
    },
  })
}
