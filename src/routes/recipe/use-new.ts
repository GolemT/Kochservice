import { useCreateRecipe } from '@/hooks/use-recipe.ts'
import { useIngredients } from '@/hooks/use-ingredient.ts'
import { useTags } from '@/hooks/use-tag.ts'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import type { CreateRecipeRequest } from '@/api/kochservice.schemas'

export function useNew () {
    const createRecipe = useCreateRecipe()
    const { data: ingredientsData, isLoading: ingredientsLoading } = useIngredients()
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
            await createRecipe.mutateAsync(value)
            toast.success('Recipe created successfully!')
            form.reset()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            toast.error(`Failed to create recipe: ${message}`)
        }
        },
    })

    const ingredients = ingredientsData?.data?.ingredients || []
    const tags = tagsData?.data?.tags || []

    return {
        form,
        ingredients,
        ingredientsLoading,
        tags,
        tagsLoading,
        createRecipe,
    }
}
