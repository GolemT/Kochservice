import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useNew } from './use-new'

vi.mock('@/api/ingredients/ingredients.ts', () => ({
  getIngredients: vi.fn().mockResolvedValue({
    data: { ingredients: [{ id: '1', name: 'Flour' }] },
  }),
}))

vi.mock('@/api/tags/tags.ts', () => ({
  getTags: vi.fn().mockResolvedValue({
    data: { tags: [{ id: '1', name: 'Vegetarian' }] },
  }),
}))

vi.mock('@/api/recipes/recipes.ts', () => ({
  createRecipe: vi.fn().mockResolvedValue({ data: { id: '1' } }),
  getRecipes: vi.fn(),
  getRecipe: vi.fn(),
  updateRecipe: vi.fn(),
  deleteRecipe: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useNew', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a form with correct default values', () => {
    const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

    const values = result.current.form.state.values
    expect(values.name).toBe('')
    expect(values.ingredients).toHaveLength(1)
    expect(values.ingredients[0]).toEqual({ ingredient_id: '', amount: 0, measurement: '' })
    expect(values.instructions).toHaveLength(1)
    expect(values.instructions[0]).toBe('')
    expect(values.tag_ids).toHaveLength(0)
  })

  it('exposes createRecipe mutation with mutateAsync', () => {
    const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

    expect(result.current.createRecipe).toBeDefined()
    expect(typeof result.current.createRecipe.mutateAsync).toBe('function')
  })

  it('is initially in a loading state', () => {
    const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

    // Both should start as loading before the mocked promises resolve
    expect(result.current.ingredientsLoading).toBe(true)
    expect(result.current.tagsLoading).toBe(true)
  })

  it('maps ingredients from API response after loading', async () => {
    const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.ingredientsLoading).toBe(false))
    expect(result.current.ingredients).toEqual([{ id: '1', name: 'Flour' }])
  })

  it('maps tags from API response after loading', async () => {
    const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.tagsLoading).toBe(false))
    expect(result.current.tags).toEqual([{ id: '1', name: 'Vegetarian' }])
  })

  it('falls back to empty arrays when API returns no data', async () => {
    const { getIngredients } = await import('@/api/ingredients/ingredients.ts')
    const { getTags } = await import('@/api/tags/tags.ts')
    vi.mocked(getIngredients).mockResolvedValueOnce({ data: null } as any)
    vi.mocked(getTags).mockResolvedValueOnce({ data: null } as any)

    const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.ingredientsLoading).toBe(false))
    expect(result.current.ingredients).toEqual([])
    expect(result.current.tags).toEqual([])
  })
})
