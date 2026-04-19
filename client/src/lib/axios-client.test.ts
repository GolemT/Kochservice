import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()
const mockCaptureException = vi.fn()

vi.mock('sonner', () => ({ toast: { success: mockToastSuccess, error: mockToastError } }))
vi.mock('@sentry/react', () => ({ captureException: mockCaptureException }))

// Import after mocks are set up
const { axiosClient } = await import('./axios-client')

function makeResponse(
  method: string,
  overrides: Partial<InternalAxiosRequestConfig> = {},
): AxiosResponse {
  return {
    data: { id: '1' },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { method, ...overrides } as InternalAxiosRequestConfig,
  }
}

function makeError(
  data: unknown = { error: 'Something failed' },
  message = 'Request failed',
) {
  return Object.assign(new Error(message), {
    response: { data },
    isAxiosError: true,
  })
}

// Access interceptors by importing the internal instance via the module
// We test interceptor behaviour indirectly by verifying axiosClient side-effects
// using a mock adapter approach: spy on the instance internals.
// Since we can't export the private instance, we test through the public API
// by mocking at the axios level.

import axios from 'axios'

const mockAxiosInstance = vi.spyOn(axios, 'create')

describe('axios-client interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('success interceptor', () => {
    it('shows a success toast for POST requests', async () => {
      // Re-import to get a fresh module with our mocks active
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [onFulfilled] = capturedInterceptors[0]
      const response = makeResponse('post')
      onFulfilled(response)

      expect(mockToastSuccess).toHaveBeenCalledWith('Created successfully')
    })

    it('shows "Updated successfully" for PUT requests', async () => {
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [onFulfilled] = capturedInterceptors[0]
      onFulfilled(makeResponse('put'))

      expect(mockToastSuccess).toHaveBeenCalledWith('Updated successfully')
    })

    it('shows "Deleted successfully" for DELETE requests', async () => {
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [onFulfilled] = capturedInterceptors[0]
      onFulfilled(makeResponse('delete'))

      expect(mockToastSuccess).toHaveBeenCalledWith('Deleted successfully')
    })

    it('does not show a toast for GET requests', async () => {
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [onFulfilled] = capturedInterceptors[0]
      onFulfilled(makeResponse('get'))

      expect(mockToastSuccess).not.toHaveBeenCalled()
    })

    it('uses a custom successMessage when provided', async () => {
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [onFulfilled] = capturedInterceptors[0]
      onFulfilled(makeResponse('post', { successMessage: 'Logged in!' }))

      expect(mockToastSuccess).toHaveBeenCalledWith('Logged in!')
    })

    it('suppresses the toast when successMessage is false', async () => {
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [onFulfilled] = capturedInterceptors[0]
      onFulfilled(makeResponse('post', { successMessage: false }))

      expect(mockToastSuccess).not.toHaveBeenCalled()
    })
  })

  describe('error interceptor', () => {
    it('shows an error toast with the server error message', async () => {
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [, onRejected] = capturedInterceptors[0]

      try {
        await onRejected(makeError({ error: 'Resource not found' }))
      } catch {}

      expect(mockToastError).toHaveBeenCalledWith('Resource not found')
    })

    it('falls back to the error message when no response body', async () => {
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [, onRejected] = capturedInterceptors[0]
      const error = Object.assign(new Error('Network Error'), { isAxiosError: true })

      try {
        await onRejected(error)
      } catch {}

      expect(mockToastError).toHaveBeenCalledWith('Network Error')
    })

    it('reports the error to Sentry', async () => {
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [, onRejected] = capturedInterceptors[0]
      const error = makeError()

      try {
        await onRejected(error)
      } catch {}

      expect(mockCaptureException).toHaveBeenCalledWith(error)
    })

    it('re-throws the error after handling it', async () => {
      vi.resetModules()
      const axiosMock = await import('axios')
      const capturedInterceptors: Array<[(r: AxiosResponse) => AxiosResponse, (e: unknown) => unknown]> = []

      vi.spyOn(axiosMock.default, 'create').mockReturnValue({
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              capturedInterceptors.push([onFulfilled, onRejected])
            }),
          },
        },
      } as any)

      await import('./axios-client')

      const [, onRejected] = capturedInterceptors[0]
      const error = makeError()

      await expect(onRejected(error)).rejects.toThrow()
    })
  })
})
