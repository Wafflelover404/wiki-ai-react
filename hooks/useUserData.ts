import { useState, useCallback } from 'react'
import { useApiData } from './useApiData'
import { ApiError } from '@/lib/api-client'

interface UserFile {
  filename: string
  original_filename?: string
  size?: number
  uploaded_at?: string
  id?: string
  organization_id?: string
}

interface UserProfile {
  user_id: string
  username: string
  email?: string
  role: string
  organization_id?: string
  created_at?: string
}

interface UseUserDataOptions {
  token?: string
  skip?: boolean
  onError?: (error: ApiError) => void
}

/**
 * Hook for fetching user-specific data (profile, files, etc)
 * Wraps useApiData for user endpoints with proper typing
 */
export function useUserData(
  resource: 'profile' | 'files' | null,
  options: UseUserDataOptions = {}
) {
  const [filters, setFilters] = useState<Record<string, any>>({})

  const getEndpoint = useCallback(() => {
    if (!resource) return null

    switch (resource) {
      case 'profile':
        return '/user/profile'
      case 'files':
        return '/files/list' // User's files
      default:
        return null
    }
  }, [resource])

  const endpoint = getEndpoint()
  const skip = !endpoint || options.skip

  // Use generic API hook with proper typing
  const apiResult = useApiData<{
    user?: UserProfile
    documents?: UserFile[]
    files?: UserFile[]
  }>(endpoint, {
    token: options.token,
    cache: true,
    cacheTTL: 5 * 60 * 1000, // 5 minutes default
    retryable: true,
    skip,
    onError: options.onError,
  })

  // Extract the specific resource data
  const getResourceData = useCallback(() => {
    if (!resource || !apiResult.data) return resource === 'profile' ? null : []

    switch (resource) {
      case 'profile':
        return apiResult.data.user || null
      case 'files':
        // Handle both 'documents' and 'files' response formats
        return (apiResult.data.documents || apiResult.data.files || []) as UserFile[]
      default:
        return resource === 'profile' ? null : []
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
 * Hook for fetching user profile
 */
export function useUserProfile(token?: string, skip?: boolean) {
  return useUserData('profile', { token, skip })
}

/**
 * Hook for fetching user's files
 */
export function useUserFiles(token?: string, skip?: boolean) {
  const result = useUserData('files', { token, skip })
  return {
    ...result,
    data: result.data as (UserFile[] | null),
  }
}

export default useUserData
