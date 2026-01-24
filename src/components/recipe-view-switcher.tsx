'use client'

import { RecipeResponse } from '@/api/kochservice.schemas'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import RecipeCard from '@/components/recipe-card'
import RecipeListItem from '@/components/recipe-list-item'

export default function RecipeViewSwitcher({
  recipes,
}: {
  recipes: Array<RecipeResponse>
}) {
  const [listView, setListView] = useState(false)

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        className={'hidden lg:flex absolute top-8 right-4 flex-row gap-2 w-48'}
      >
        <Label>Grid</Label>
        <Switch
          title={'LayoutSwitcher'}
          onClick={() => setListView(!listView)}
        />
        <Label>List</Label>
      </div>

      {listView ? (
        // 🔽 LIST VIEW
        <div title={'RecipeView'} className={'flex flex-col gap-4'}>
          {recipes.map((recipe: RecipeResponse, index: number) => (
            <Link key={index} href={`/recipe/${recipe.id}`}>
              <RecipeListItem
                title={recipe.name}
                imageURL={""}
                tags={recipe.tags}
              />
            </Link>
          ))}
        </div>
      ) : (
        // 🧱 GRID VIEW
        <div title={'RecipeView'} className={'grid lg:grid-cols-4 gap-6'}>
          {recipes.map((item: RecipeResponse, index: number) => (
            <Link key={index} href={`/recipe/${item.id}`}>
              <RecipeCard
                key={index}
                title={item.name}
                imageURL={""}
                tags={item.tags}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
