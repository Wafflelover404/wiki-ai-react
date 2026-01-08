import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient, ApiError, ApiResponse } from '@/lib/api-client'

interface UseApiDataOptions {
  token?: string
  cache?: boolean
  cacheTTL?: number
  retryable?: boolean
  skip?: boolean
  onError?: (error: ApiError) => void
  onSuccess?: (data: any) => void
}

interface UseApiDataResult<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
  isLoading: boolean
}

/**
 * Generic hook for fetching data from the API with caching and retry logic
 * @param url - API endpoint URL
 * @param options - Configuration options (token, cache, retryable, etc)
 * @returns Object with data, loading state, error, and refetch function
 */
export function useApiData<T = unknown>(
  url: string | null,
  options: UseApiDataOptions = {}
): UseApiDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const {
    token,
    cache = true,
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    retryable = true,
    skip = false,
    onError,
    onSuccess,
  } = options

  const fetchData = useCallback(async () => {
    // Skip if no URL or skip is true
    if (!url || skip) {
      setLoading(false)
      return
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.request<T>({
        url,
        method: 'GET',
        token,
        cache,
        cacheTTL,
        retryable,
      })

      if (response.status === 'error') {
        const apiError = new ApiError(
          400,
          response.message || 'Unknown error',
          { code: 'API_ERROR', detail: response.detail }
        )
        setError(apiError)
        onError?.(apiError)
        return
      }

      const responseData = response as T
      setData(responseData)
      onSuccess?.(responseData)
    } catch (err) {
      const apiError = err instanceof ApiError
        ? err
        : new ApiError(
            500,
            err instanceof Error ? err.message : 'Unknown error',
            { code: 'FETCH_ERROR' }
          )

      setError(apiError)
      onError?.(apiError)
    } finally {
      setLoading(false)
    }
  }, [url, token, cache, cacheTTL, retryable, skip, onError, onSuccess])

  // Auto-fetch on mount and when URL changes
  useEffect(() => {
    fetchData()

    return () => {
      // Cleanup: abort request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    isLoading: loading, // Alias for convenience
  }
}

export default useApiData
