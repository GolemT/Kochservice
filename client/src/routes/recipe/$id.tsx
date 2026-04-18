import { createFileRoute } from '@tanstack/react-router'
import { IngredientBar } from '@/components/ingredient-sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { RecipeResponse } from '@/api/kochservice.schemas'
import { useRecipe } from '@/hooks/use-recipe.ts'
import { RecipeLoading } from '@/routes/recipe/-recipe-loading.tsx'

export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
})

function RecipePage() {
  const { id } = Route.useParams()

  const { data, isLoading, error } = useRecipe(id)

  if (isLoading) return <RecipeLoading />

  if (error) {
    console.error(error)
  }

  const recipe: RecipeResponse = data?.data
  const ingredients = recipe.ingredients

  return (
    <>
      {/* Layout for Small Screens */}
      <div
        className={
          'flex flex-col p-4 justify-center items-center gap-8 lg:hidden'
        }
      >
        {/*<Image src={recipe.imageURL} alt={recipe.title} className={"w-full"} height={100} width={100}/>*/}
        <h1 title={'title'} className={'text-2xl'}>
          {recipe.name}
        </h1>
        <Separator />
        <h2 className="text-2xl font-semibold mb-6">Zutaten</h2>
        <ul
          title={'ingredients'}
          className="space-y-4 flex flex-col justify-center items-center w-full"
        >
          {recipe.ingredients.map((item, i) => (
            <li key={i} className="flex justify-between  w-1/2 h-4">
              <span className={'text-left'}>{item.ingredient_name}: </span>
              <span className={'text-right'}>{item.amount}</span>
              <span className={'text-right'}>{item.measurement}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <div title={'instructions'}>
          {recipe.instructions.map((instruction, i) => (
            <div key={i} className={'w-11/12 p-2'}>
              {instruction}
            </div>
          ))}
        </div>
      </div>

      {/* Layout for Large Screens */}
      <div className={'hidden lg:flex'}>
        <IngredientBar ingredients={ingredients} />
        <div
          className={
            'flex flex-col items-center justify-center gap-4 h-fit mb-12 p-4'
          }
        >
          <div className="relative w-5/12 h-72 rounded-4xl border-muted border-2 shadow-2xs overflow-hidden">
            {/* Hintergrundbild */}
            <img
              src={''}
              alt={recipe.name}
              className={'object-cover w-full h-full'}
              width={300}
              height={250}
            />
            {/* Text-Container */}
            <div className="absolute bottom-0 left-0 w-full p-4 z-20 text-primary bg-background">
              <Button className={'absolute right-6 top-4'}>
                <Bookmark />
              </Button>
              <h1 title={'title'} className="text-2xl font-semibold">
                {recipe.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {recipe.tags.map((tag, index) => (
                  <Badge key={index} className="">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div
            className={
              'flex flex-col items-center justify-center gap-4 h-fit mb-12 p-4'
            }
          >
            {recipe.instructions.map((instruction, i) => (
              <div key={i} className={'w-4/12 p-2'}>
                {instruction}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
