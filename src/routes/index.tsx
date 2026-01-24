import { createFileRoute } from '@tanstack/react-router'
import SearchBar from '@/components/search'
import RecipeViewSwitcher from '@/components/recipe-view-switcher'

export const Route = createFileRoute('/')({
  component: HomePage
})

export function HomePage() {

  return (
    <div
      className={
        'flex flex-col p-4 w-full h-fit justify-center items-center gap-8'
      }
    >
      <SearchBar />
      <RecipeViewSwitcher recipes={[]} />
    </div>
  )
}
