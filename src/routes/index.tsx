import { createFileRoute } from '@tanstack/react-router'
import SearchBar from '@/components/search'
import { useInfiniteRecipes } from '@/hooks/use-Recipe.ts'
import { HomeLoading } from '@/routes/-home-loading.tsx'
import VirtualizedRecipeView from '@/components/virtualized-recipe-view.tsx'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRecipes()

  const allRecipes = data?.pages.flatMap((page) => page.data.recipes) ?? []

  if (isLoading) return <HomeLoading />
  if (error) {
    console.error(error)
    return <div>Error loading recipes</div>
  }

  return (
    <div
      className={
        'flex flex-col p-4 w-full h-fit justify-center items-center gap-8'
      }
    >
      <SearchBar />
      <VirtualizedRecipeView
        recipes={allRecipes}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  )
}
