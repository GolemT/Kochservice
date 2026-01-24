import { useRef, useEffect, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Link } from '@tanstack/react-router'
import type { RecipeResponse } from '@/api/kochservice.schemas'
import RecipeCard from '@/components/recipe-card'
import RecipeListItem from '@/components/recipe-list-item'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface IVirtualizedRecipeViewProps {
  recipes: RecipeResponse[]
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

export default function VirtualizedRecipeView({
  recipes,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: IVirtualizedRecipeViewProps) {
  const [listView, setListView] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)

  // For grid: calculate number of rows (4 items per row)
  const gridRows = Math.ceil(recipes.length / 4)
  const itemCount = listView ? recipes.length : gridRows

  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (listView ? 100 : 350), // List items ~100px, grid rows ~350px
    overscan: 5,
  })

  // Fetch next page when scrolling near bottom
  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse()

    if (!lastItem) return

    if (lastItem.index >= itemCount - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    itemCount,
    isFetchingNextPage,
    virtualizer.getVirtualItems(),
  ])

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* View Switcher */}
      <div className="hidden lg:flex absolute top-8 right-4 flex-row gap-2 w-48">
        <Label>Grid</Label>
        <Switch
          title="LayoutSwitcher"
          checked={listView}
          onCheckedChange={setListView}
        />
        <Label>List</Label>
      </div>

      {/* Virtualized Container */}
      <div ref={parentRef} className="w-full h-screen overflow-auto">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            if (listView) {
              // LIST VIEW - one item per row
              const recipe = recipes[virtualRow.index]
              if (!recipe) return null

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Link to="/recipe/$id" params={{ id: recipe.id }}>
                    <RecipeListItem
                      title={recipe.name}
                      imageURL=""
                      tags={recipe.tags}
                    />
                  </Link>
                </div>
              )
            } else {
              // GRID VIEW - 4 items per row
              const startIdx = virtualRow.index * 4
              const rowRecipes = recipes.slice(startIdx, startIdx + 4)

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="grid grid-cols-4 gap-6 px-4"
                >
                  {rowRecipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      to="/recipe/$id"
                      params={{ id: recipe.id }}
                    >
                      <RecipeCard
                        title={recipe.name}
                        imageURL=""
                        tags={recipe.tags}
                      />
                    </Link>
                  ))}
                </div>
              )
            }
          })}
        </div>
      </div>

      {isFetchingNextPage && <div>Loading more...</div>}
      {!hasNextPage && recipes.length > 0 && <div>No more recipes</div>}
    </div>
  )
}
