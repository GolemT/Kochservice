import { useCreateRecipe } from '@/hooks/use-recipe.ts'
import { useIngredients } from '@/hooks/use-ingredient.ts'
import { useTags } from '@/hooks/use-tag.ts'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import type {
  CreateRecipeRequest,
  IngredientResponse,
  TagResponse,
} from '@/api/kochservice.schemas'

export function useNew() {
  const navigate = useNavigate()
  const createRecipe = useCreateRecipe()
  const { data: ingredientsData, isLoading: ingredientsLoading } =
    useIngredients()
  const { data: tagsData, isLoading: tagsLoading } = useTags()

  const defaultValues: CreateRecipeRequest = {
    name: '',
    ingredients: [{ ingredient_id: '', amount: 0, measurement: '' }],
    instructions: [''],
    tag_ids: [],
  }

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        const result = await createRecipe.mutateAsync(value)
        navigate({ to: '/recipe/$id', params: { id: result.data.id } })
      } catch {
        // error toast handled by axios interceptor
      }
    },
  })

  const ingredients: IngredientResponse[] =
    ingredientsData?.data?.ingredients ?? []
  const tags: TagResponse[] = tagsData?.data?.tags ?? []

  return {
    form,
    ingredients,
    ingredientsLoading,
    tags,
    tagsLoading,
    createRecipe,
  }
}
