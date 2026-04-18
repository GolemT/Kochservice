import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { RecipeIngredientResponse } from '@/api/kochservice.schemas'

export function IngredientBar({
  ingredients,
}: {
  ingredients: Array<RecipeIngredientResponse>
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div
      title={'ingredient-sidebar'}
      className={`fixed right-4 h-11/12 top-1/2 transform -translate-y-1/2 p-4 rounded-lg transition-all duration-300 
                ${isOpen ? 'w-64 bg-muted' : 'w-0 bg-background'}`}
    >
      {isOpen && (
        <>
          <h2 className="text-2xl font-semibold mb-12">Ingredients</h2>
          <ul title={'ingredients'} className="space-y-4 w-full">
            {ingredients.map((item, i) => (
              <li key={i} className="flex justify-between w-full h-4">
                <span className={'text-left'}>{item.ingredient_name}: </span>
                <div>
                  <span className={'text-right'}>{item.amount}</span>
                  <span className={'text-right'}>{item.measurement}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-14 top-1/2 text-primary bg-background transform -translate-y-1/2 hover:bg-accent"
      >
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </Button>
    </div>
  )
}
