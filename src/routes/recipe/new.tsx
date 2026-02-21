import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Plus, Trash2 } from 'lucide-react'
import { useNew } from './-use-new'

export const Route = createFileRoute('/recipe/new')({
  component: NewRecipePage,
})

export function NewRecipePage() {
  const {
    form,
    ingredients,
    ingredientsLoading,
    tags,
    tagsLoading,
    createRecipe
  } = useNew();
  
    if (ingredientsLoading || tagsLoading) {
        return <div>Loading...</div>
    }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Recipe</CardTitle>
          <CardDescription>Add a new recipe to your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="recipe-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            {/* Recipe Name */}
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  if (value.length < 5)
                    return 'Name must be at least 5 characters'
                  if (value.length > 200)
                    return 'Name must be less than 200 characters'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Recipe Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter recipe name"
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Ingredients */}
            <form.Field name="ingredients" mode="array">
              {(field) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Ingredients</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        field.pushValue({
                          ingredient_id: '',
                          amount: 0,
                          measurement: '',
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>

                  {field.state.value.map((_, i) => (
                    <div key={i} className="flex gap-2 items-end">
                      <form.Field name={`ingredients[${i}].ingredient_id`}>
                        {(subField) => (
                          <div className="flex-1 space-y-2">
                            <Label>Ingredient</Label>
                            <Select
                              value={subField.state.value}
                              onValueChange={(value) =>
                                subField.handleChange(value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select ingredient" />
                              </SelectTrigger>
                              <SelectContent>
                                {ingredients.map((ing) => (
                                  <SelectItem key={ing.id} value={ing.id}>
                                    {ing.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </form.Field>

                      <form.Field name={`ingredients[${i}].amount`}>
                        {(subField) => (
                          <div className="w-24 space-y-2">
                            <Label>Amount</Label>
                            <Input
                              type="number"
                              value={subField.state.value}
                              onChange={(e) =>
                                subField.handleChange(Number(e.target.value))
                              }
                              placeholder="0"
                            />
                          </div>
                        )}
                      </form.Field>

                      <form.Field name={`ingredients[${i}].measurement`}>
                        {(subField) => (
                          <div className="w-32 space-y-2">
                            <Label>Unit</Label>
                            <Input
                              value={subField.state.value}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                              placeholder="g, ml, etc"
                            />
                          </div>
                        )}
                      </form.Field>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => field.removeValue(i)}
                        disabled={field.state.value.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </form.Field>

            {/* Instructions */}
            <form.Field name="instructions" mode="array">
              {(field) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Instructions</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.pushValue('')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>

                  {field.state.value.map((_, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <form.Field name={`instructions[${i}]`}>
                          {(subField) => (
                            <Input
                              value={subField.state.value}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                              placeholder={`Step ${i + 1}`}
                            />
                          )}
                        </form.Field>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => field.removeValue(i)}
                        disabled={field.state.value.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </form.Field>

            {/* Tags - Multi-select */}
            <form.Field name="tag_ids" mode="array">
              {(field) => (
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isSelected = field.state.value.includes(tag.id)
                      return (
                        <Button
                          key={tag.id}
                          type="button"
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (isSelected) {
                              field.handleChange(
                                field.state.value.filter((id) => id !== tag.id),
                              )
                            } else {
                              field.handleChange([...field.state.value, tag.id])
                            }
                          }}
                        >
                          {tag.name}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}
            </form.Field>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            form="recipe-form"
            disabled={createRecipe.isPending}
          >
            {createRecipe.isPending ? 'Creating...' : 'Create Recipe'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
