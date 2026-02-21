import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { NewRecipePage } from '../new'

// Mock the entire hook so the component has no real dependencies
vi.mock('../-use-new', () => ({
  useNew: vi.fn(),
}))

// Mock TanStack Router's createFileRoute so the module import doesn't fail
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => () => ({}),
}))

import { useNew } from '../-use-new'

function loadingState(override: Partial<ReturnType<typeof useNew>> = {}) {
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
  it('renders a loading indicator while ingredients are loading', () => {
    vi.mocked(useNew).mockReturnValue(loadingState({ ingredientsLoading: true }))

    render(<NewRecipePage />)

    expect(screen.getByText('Loading...')).toBeTruthy()
  })

  it('renders a loading indicator while tags are loading', () => {
    vi.mocked(useNew).mockReturnValue(loadingState({ tagsLoading: true }))

    render(<NewRecipePage />)

    expect(screen.getByText('Loading...')).toBeTruthy()
  })
})
