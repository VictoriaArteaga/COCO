/**
 * Base HTTP client for the COCO backend API.
 *
 * The base URL is read from the NEXT_PUBLIC_API_URL environment variable.
 * It must be set in .env.local for development.
 * It must NEVER be hardcoded here.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')

if (!API_BASE_URL && typeof window !== 'undefined') {
  // Warn at runtime in the browser; build-time check is handled by type-check script.
  console.warn('[COCO] NEXT_PUBLIC_API_URL is not set. API calls will fail.')
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  params?: Record<string, string | number | boolean | undefined | null>
}

/**
 * Internal fetch wrapper.
 * Adds JSON content-type, serialises the body, and maps HTTP errors to ApiError.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params } = options

  // Build query string
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured. Set it in web/.env.local.')
  }

  let url = `${API_BASE_URL}/${path.replace(/^\//, '')}`
  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    }
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // next.js cache — revalidate every 30 s for GET requests
    ...(method === 'GET' ? { next: { revalidate: 30 } } : {}),
  })

  if (!response.ok) {
    let errorBody: unknown
    try {
      errorBody = await response.json()
    } catch {
      errorBody = null
    }
    throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`, errorBody)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, params?: RequestOptions['params']) =>
    request<T>(path, { method: 'GET', params }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body }),
}
