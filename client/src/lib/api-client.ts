export const apiClient = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const baseUrl = process.env.VITE_API_BASE || 'http://localhost:8080'
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`

    const response = await fetch(fullUrl, options)
    const body = [204, 205, 304].includes(response.status) ? null : await response.text()
    const data = body ? JSON.parse(body) : {}

    return {
        data,
        status: response.status,
        headers: response.headers,
    } as T
}