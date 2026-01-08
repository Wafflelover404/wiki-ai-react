import { useState, useMemo, useCallback } from 'react'

interface PaginationConfig {
  pageSize?: number
  maxPages?: number
}

interface PaginationState {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Hook for managing pagination state for data tables
 * Provides current page, page size, and navigation functions
 */
export function usePagination<T>(
  items: T[],
  config: PaginationConfig = {}
) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = config.pageSize || 10
  const maxPages = config.maxPages || undefined

  // Calculate pagination state
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const actualMaxPages = maxPages ? Math.min(maxPages, totalPages) : totalPages

  // Validate current page
  const validatedPage = Math.min(Math.max(1, currentPage), actualMaxPages || 1)
  if (validatedPage !== currentPage) {
    setCurrentPage(validatedPage)
  }

  // Get current page data
  const startIndex = (validatedPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  )

  // Pagination state
  const state: PaginationState = {
    currentPage: validatedPage,
    pageSize,
    totalItems,
    totalPages: actualMaxPages || totalPages,
    hasNextPage: validatedPage < (actualMaxPages || totalPages),
    hasPreviousPage: validatedPage > 1,
  }

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, actualMaxPages || totalPages)))
  }, [actualMaxPages, totalPages])

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, actualMaxPages || totalPages))
  }, [actualMaxPages, totalPages])

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }, [])

  const reset = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    // Data
    currentItems,
    
    // State
    ...state,
    
    // Navigation
    goToPage,
    nextPage,
    previousPage,
    reset,
  }
}

/**
 * Hook for managing sorting state
 */
export function useSorting<T>(
  items: T[],
  defaultKey?: string
) {
  const [sortKey, setSortKey] = useState<string | null>(defaultKey || null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const sortedItems = useMemo(() => {
    if (!sortKey) return items

    return [...items].sort((a, b) => {
      const aVal = (a as any)[sortKey]
      const bVal = (b as any)[sortKey]

      if (aVal === bVal) return 0
      
      const comparison = aVal < bVal ? -1 : 1
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [items, sortKey, sortOrder])

  const toggleSort = useCallback((key: string) => {
    if (sortKey === key) {
      // Toggle order if same key
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // New key, start with asc
      setSortKey(key)
      setSortOrder('asc')
    }
  }, [sortKey])

  const reset = useCallback(() => {
    setSortKey(null)
    setSortOrder('asc')
  }, [])

  return {
    sortedItems,
    sortKey,
    sortOrder,
    toggleSort,
    reset,
  }
}

/**
 * Hook combining pagination and sorting
 */
export function usePaginatedSorting<T>(
  items: T[],
  paginationConfig: PaginationConfig = {},
  defaultSortKey?: string
) {
  const sorting = useSorting(items, defaultSortKey)
  const pagination = usePagination(sorting.sortedItems, paginationConfig)

  return {
    // Pagination methods
    currentItems: pagination.currentItems,
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.hasNextPage,
    hasPreviousPage: pagination.hasPreviousPage,
    goToPage: pagination.goToPage,
    nextPage: pagination.nextPage,
    previousPage: pagination.previousPage,

    // Sorting methods
    sortKey: sorting.sortKey,
    sortOrder: sorting.sortOrder,
    toggleSort: sorting.toggleSort,

    // Combined reset
    reset: () => {
      pagination.reset()
      sorting.reset()
    },
  }
}

export default usePagination
