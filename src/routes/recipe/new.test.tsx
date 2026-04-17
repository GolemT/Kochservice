import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NewRecipePage } from './new'

vi.mock('./use-new', () => ({
  useNew: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => () => ({}),
}))

import { useNew } from './use-new'

function makeState(override: Partial<ReturnType<typeof useNew>> = {}): ReturnType<typeof useNew> {
  return {
    form: null as any,
    ingredients: [],
    ingredientsLoading: false,
    tags: [],
    tagsLoading: false,
    createRecipe: { isPending: false, mutateAsync: vi.fn() } as any,
    ...override,
  }
}

describe('NewRecipePage', () => {
  describe('loading state', () => {
    it('renders a loading indicator while ingredients are loading', () => {
      vi.mocked(useNew).mockReturnValue(makeState({ ingredientsLoading: true }))
      render(<NewRecipePage />)
      expect(screen.getByText('Loading...')).toBeTruthy()
    })

    it('renders a loading indicator while tags are loading', () => {
      vi.mocked(useNew).mockReturnValue(makeState({ tagsLoading: true }))
      render(<NewRecipePage />)
      expect(screen.getByText('Loading...')).toBeTruthy()
    })

    it('does not render the form while loading', () => {
      vi.mocked(useNew).mockReturnValue(makeState({ ingredientsLoading: true }))
      render(<NewRecipePage />)
      expect(screen.queryByText('Create New Recipe')).toBeNull()
    })
  })
})
