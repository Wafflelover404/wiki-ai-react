import { useState, useCallback, useEffect } from 'react'
import { useApiData } from './useApiData'
import { ApiError } from '@/lib/api-client'

interface AdminUser {
  id: string
  user_id?: string
  username: string
  email?: string
  role: string
  created_at?: string
  organization_id?: string
  last_login?: string
}

interface AdminFile {
  id: string
  filename: string
  original_filename?: string
  size?: number
  uploaded_at?: string
  uploaded_by?: string
  organization_id?: string
}

interface AdminReport {
  id: string
  name: string
  type: string
  created_at?: string
  created_by?: string
  data?: any
}

interface UseAdminDataOptions {
  token?: string
  skip?: boolean
  onError?: (error: ApiError) => void
  autoRefreshInterval?: number // Optional: auto-refresh interval in ms (0 = no auto-refresh)
}

/**
 * Hook for fetching admin-specific data (users, files, reports)
 * Wraps useApiData for admin endpoints with proper typing and defaults
 */
export function useAdminData(
  resource: 'users' | 'files' | 'reports' | null,
  options: UseAdminDataOptions = {}
) {
  const [filters, setFilters] = useState<Record<string, any>>({})

  const getEndpoint = useCallback(() => {
    if (!resource) return null

    switch (resource) {
      case 'users':
        return '/admin/users'
      case 'files':
        return '/admin/files'
      case 'reports':
        return '/admin/reports'
      default:
        return null
    }
  }, [resource])

  const endpoint = getEndpoint()
  const skip = !endpoint || options.skip

  // Use generic API hook with proper typing
  const apiResult = useApiData<any>(endpoint, {
    token: options.token,
    cache: true,
    cacheTTL: 1 * 60 * 1000, // 1 minute for admin data (more frequent)
    retryable: true,
    skip,
    onError: options.onError,
  })

  // Auto-refresh at specified interval
  useEffect(() => {
    if (!options.autoRefreshInterval || options.autoRefreshInterval <= 0) {
      return
    }

    const interval = setInterval(() => {
      apiResult.refetch()
    }, options.autoRefreshInterval)

    return () => clearInterval(interval)
  }, [options.autoRefreshInterval, apiResult])

  // Extract the specific resource data
  const getResourceData = useCallback(() => {
    if (!resource || !apiResult.data) return []

    // Handle both APIResponse format and direct data format
    let responseData = apiResult.data
    
    // If data has 'response' field (APIResponse format), extract it
    if (apiResult.data && typeof apiResult.data === 'object' && 'response' in apiResult.data) {
      responseData = apiResult.data.response || apiResult.data
    }

    // Handle both response.users and just users field
    const data = {
      users: responseData?.users || [],
      files: responseData?.files || [],
      reports: responseData?.reports || [],
    }

    // Debug logging
    if (resource === 'users') {
      console.log('[useAdminData] Users data:', data.users, 'Raw API data:', apiResult.data)
    }

    switch (resource) {
      case 'users':
        return (data.users || []) as AdminUser[]
      case 'files':
        return (data.files || []) as AdminFile[]
      case 'reports':
        return (data.reports || []) as AdminReport[]
      default:
        return []
    }
  }, [resource, apiResult.data])

  return {
    data: getResourceData(),
    loading: apiResult.loading,
    error: apiResult.error,
    refetch: apiResult.refetch,
    isLoading: apiResult.isLoading,
    filters,
    setFilters,
  }
}

/**
 * Hook for fetching list of users (admin endpoint)
 */
export function useAdminUsers(token?: string, skip?: boolean, options?: Partial<UseAdminDataOptions>) {
  return useAdminData('users', { token, skip, ...options })
}

/**
 * Hook for fetching list of files (admin endpoint)
 */
export function useAdminFiles(token?: string, skip?: boolean, options?: Partial<UseAdminDataOptions>) {
  return useAdminData('files', { token, skip, ...options })
}

/**
 * Hook for fetching list of reports (admin endpoint)
 */
export function useAdminReports(token?: string, skip?: boolean, options?: Partial<UseAdminDataOptions>) {
  return useAdminData('reports', { token, skip, ...options })
