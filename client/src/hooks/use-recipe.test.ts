import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import {
  useInfiniteRecipes,
  useRecipe,
  useUpdateRecipe,
  useCreateRecipe,
} from './use-recipe'
import type { UpdateRecipeRequest, CreateRecipeRequest } from '@/api/kochservice.schemas'

// --- Hoisted mocks ---
const mockGetRecipes = vi.hoisted(() => vi.fn())
const mockGetRecipe = vi.hoisted(() => vi.fn())
const mockCreateRecipe = vi.hoisted(() => vi.fn())
const mockUpdateRecipe = vi.hoisted(() => vi.fn())
const mockDeleteRecipe = vi.hoisted(() => vi.fn())

vi.mock('@/api/recipes/recipes.ts', () => ({
  getRecipes: vi.fn().mockReturnValue({
    getRecipes: mockGetRecipes,
    getRecipe: mockGetRecipe,
    createRecipe: mockCreateRecipe,
    updateRecipe: mockUpdateRecipe,
    deleteRecipe: mockDeleteRecipe,
  }),
}))

function createWrapper(queryClient?: QueryClient) {
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children)
}

// --- useInfiniteRecipes ---
describe('useInfiniteRecipes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetRecipes.mockResolvedValue({
      data: { recipes: [{ id: '1', name: 'Pasta' }] },
    })
  })

  it('fetches the first page on mount', async () => {
    const { result } = renderHook(() => useInfiniteRecipes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetRecipes).toHaveBeenCalledWith({ page: 0, page_size: 20 })
  })

  it('respects a custom page size', async () => {
    const { result } = renderHook(() => useInfiniteRecipes(5), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetRecipes).toHaveBeenCalledWith({ page: 0, page_size: 5 })
  })

  it('signals no more pages when the page has fewer items than pageSize', async () => {
    mockGetRecipes.mockResolvedValue({ data: { recipes: [{ id: '1' }] } })

    const { result } = renderHook(() => useInfiniteRecipes(20), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.hasNextPage).toBe(false)
  })

  it('signals more pages when the page is full', async () => {
    const fullPage = Array.from({ length: 3 }, (_, i) => ({ id: String(i) }))
    mockGetRecipes.mockResolvedValue({ data: { recipes: fullPage } })

    const { result } = renderHook(() => useInfiniteRecipes(3), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.hasNextPage).toBe(true)
  })
})

// --- useRecipe ---
describe('useRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetRecipe.mockResolvedValue({ data: { id: '42', name: 'Pasta' } })
  })

  it('fetches the recipe from the API when not in cache', async () => {
    const { result } = renderHook(() => useRecipe('42'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetRecipe).toHaveBeenCalledWith('42')
  })

  it('is disabled when id is empty', () => {
    const { result } = renderHook(() => useRecipe(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockGetRecipe).not.toHaveBeenCalled()
  })

  it('returns the cached recipe without fetching when found in infinite query cache', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    queryClient.setQueryData(['recipes'], {
      pages: [{ data: { recipes: [{ id: '99', name: 'Cached Recipe' }] } }],
      pageParams: [0],
    })

    const { result } = renderHook(() => useRecipe('99'), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual({ data: { id: '99', name: 'Cached Recipe' }, status: 200 })
    expect(mockGetRecipe).not.toHaveBeenCalled()
  })
})

// --- useCreateRecipe ---
describe('useCreateRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateRecipe.mockResolvedValue({ data: { id: 'new-1', name: 'New Recipe' } })
  })

  it('calls createRecipe with the provided data', async () => {
    const { result } = renderHook(() => useCreateRecipe(), {
      wrapper: createWrapper(),
    })

    const payload: CreateRecipeRequest = {
      name: 'New Recipe',
      ingredients: [],
      instructions: [],
      tag_ids: [],
    }

    await act(async () => {
      await result.current.mutateAsync(payload)
    })

    expect(mockCreateRecipe).toHaveBeenCalledWith(payload)
  })

  it('is not pending initially', () => {
    const { result } = renderHook(() => useCreateRecipe(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isPending).toBe(false)
  })
})

// --- useUpdateRecipe ---
describe('useUpdateRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateRecipe.mockResolvedValue({ data: { id: '1', name: 'Updated' } })
  })

  it('calls updateRecipe with the correct id and data', async () => {
    const { result } = renderHook(() => useUpdateRecipe(), {
      wrapper: createWrapper(),
    })

    const data: UpdateRecipeRequest = {
      name: 'Updated',
      ingredients: [],
      instructions: [],
      tag_ids: [],
    }

    await act(async () => {
      await result.current.mutateAsync({ id: '1', data })
    })

    expect(mockUpdateRecipe).toHaveBeenCalledWith('1', data)
  })

  it('is not pending initially', () => {
    const { result } = renderHook(() => useUpdateRecipe(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isPending).toBe(false)
  })
})
