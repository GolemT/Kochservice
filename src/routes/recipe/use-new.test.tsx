import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useNew } from './use-new'

// --- Hoisted mocks (must be before vi.mock calls) ---
const mockCreateRecipeApi = vi.hoisted(() => vi.fn())
const mockNavigate = vi.hoisted(() => vi.fn())
const mockToastSuccess = vi.hoisted(() => vi.fn())
const mockToastError = vi.hoisted(() => vi.fn())

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
  createRecipe: mockCreateRecipeApi,
  getRecipes: vi.fn(),
  getRecipe: vi.fn(),
  updateRecipe: vi.fn(),
  deleteRecipe: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('sonner', () => ({
  toast: { success: mockToastSuccess, error: mockToastError },
}))

// --- Helpers ---
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useNew', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateRecipeApi.mockResolvedValue({ data: { id: 'new-1' } })
  })

  // --- Default form values ---
  describe('form default values', () => {
    it('initialises name as empty string', () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      expect(result.current.form.state.values.name).toBe('')
    })

    it('initialises with one empty ingredient row', () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      expect(result.current.form.state.values.ingredients).toEqual([
        { ingredient_id: '', amount: 0, measurement: '' },
      ])
    })

    it('initialises with one empty instruction', () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      expect(result.current.form.state.values.instructions).toEqual([''])
    })

    it('initialises with no tags selected', () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      expect(result.current.form.state.values.tag_ids).toHaveLength(0)
    })
  })

  // --- Loading states ---
  describe('loading states', () => {
    it('starts in a loading state for both ingredients and tags', () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      expect(result.current.ingredientsLoading).toBe(true)
      expect(result.current.tagsLoading).toBe(true)
    })

    it('resolves loading after both fetches complete', async () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      await waitFor(() => {
        expect(result.current.ingredientsLoading).toBe(false)
        expect(result.current.tagsLoading).toBe(false)
      })
    })
  })

  // --- Data mapping ---
  describe('data mapping', () => {
    it('maps ingredients from the API response', async () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      await waitFor(() => expect(result.current.ingredientsLoading).toBe(false))
      expect(result.current.ingredients).toEqual([{ id: '1', name: 'Flour' }])
    })

    it('maps tags from the API response', async () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      await waitFor(() => expect(result.current.tagsLoading).toBe(false))
      expect(result.current.tags).toEqual([{ id: '1', name: 'Vegetarian' }])
    })

    it('falls back to empty arrays when the API returns no data', async () => {
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

  // --- Form submission ---
  describe('form submission', () => {
    it('calls the API with the current form values on submit', async () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

      act(() => {
        result.current.form.setFieldValue('name', 'Chocolate Cake Recipe')
      })

      await act(async () => {
        await result.current.form.handleSubmit()
      })

      expect(mockCreateRecipeApi).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Chocolate Cake Recipe' }),
      )
    })

    it('shows a success toast after a successful submission', async () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.form.handleSubmit()
      })

      expect(mockToastSuccess).toHaveBeenCalledWith('Recipe created successfully!')
    })

    it('navigates to the new recipe page after a successful submission', async () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.form.handleSubmit()
      })

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/recipe/$id',
        params: { id: 'new-1' },
      })
    })

    it('shows an error toast with the error message when the API fails', async () => {
      mockCreateRecipeApi.mockRejectedValueOnce(new Error('Internal server error'))

      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.form.handleSubmit()
      })

      expect(mockToastError).toHaveBeenCalledWith(
        'Failed to create recipe: Internal server error',
      )
    })

    it('shows a generic error message when the thrown value is not an Error instance', async () => {
      mockCreateRecipeApi.mockRejectedValueOnce('plain string error')

      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.form.handleSubmit()
      })

      expect(mockToastError).toHaveBeenCalledWith('Failed to create recipe: Unknown error')
    })

    it('does not navigate after a failed submission', async () => {
      mockCreateRecipeApi.mockRejectedValueOnce(new Error('Server error'))

      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

      act(() => {
        result.current.form.setFieldValue('name', 'My Recipe Draft')
      })

      await act(async () => {
        await result.current.form.handleSubmit()
      })

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('does not show a success toast after a failed submission', async () => {
      mockCreateRecipeApi.mockRejectedValueOnce(new Error('Server error'))

      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.form.handleSubmit()
      })

      expect(mockToastSuccess).not.toHaveBeenCalled()
    })
  })

  // --- createRecipe mutation state ---
  describe('createRecipe mutation', () => {
    it('is not pending initially', () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      expect(result.current.createRecipe.isPending).toBe(false)
    })

    it('exposes mutateAsync', () => {
      const { result } = renderHook(() => useNew(), { wrapper: createWrapper() })
      expect(typeof result.current.createRecipe.mutateAsync).toBe('function')
    })
  })
})
