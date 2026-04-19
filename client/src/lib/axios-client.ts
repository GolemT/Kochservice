import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import * as Sentry from '@sentry/react'
import { toast } from 'sonner'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    successMessage?: string | false
  }
}

const SUCCESS_MESSAGES: Record<string, string> = {
  post: 'Created successfully',
  put: 'Updated successfully',
  patch: 'Updated successfully',
  delete: 'Deleted successfully',
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080',
  timeout: 10000,
})

instance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase()
    const successMessage = response.config.successMessage

    if (successMessage !== false && method && method in SUCCESS_MESSAGES) {
      toast.success(successMessage ?? SUCCESS_MESSAGES[method])
    }

    return response
  },
  (error) => {
    Sentry.captureException(error)

    const message =
      error.response?.data?.error ??
      error.message ??
      'Something went wrong'
    toast.error(message)

    return Promise.reject(error)
  },
)

export const axiosClient = <T>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return instance(config)
}
