import SearchBar from '@/components/search'
import RecipeViewSwitcher from '@/components/recipe-view-switcher'
import {getAllRecipes} from "@/actions/recipes";

export default async function Page() {
  const result = await getAllRecipes({ page: 0, page_size: 20 })

  if (!result.success) {
    console.log(result.error)
  }

  return (
    <div
      className={
        'flex flex-col p-4 w-full h-fit justify-center items-center gap-8'
      }
    >
      <SearchBar />
      <RecipeViewSwitcher recipes={result.success ? result.data!.recipes : []} />
    </div>
  )
}

export const dynamic = 'force-dynamic'
