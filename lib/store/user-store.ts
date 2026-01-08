import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UserFile {
  filename: string
  original_filename?: string
  size?: number
  uploaded_at?: string
  id?: string
  organization_id?: string
}

interface UserState {
  // Data
  files: UserFile[]
  
  // Selection/Filters
  selectedFiles: string[]
  
  // Filters
  fileFilters: {
    search?: string
    sortBy?: 'name' | 'date' | 'size'
    sortOrder?: 'asc' | 'desc'
  }
  
  // Loading state
  loadingFiles: boolean
  
  // Recent queries
  recentQueries: Array<{
    id: string
    question: string
    timestamp: number
    sessionId?: string
  }>
  
  // Actions
  setFiles: (files: UserFile[]) => void
  
  toggleFileSelection: (filename: string) => void
  clearFileSelection: () => void
  
  setFileFilters: (filters: UserState['fileFilters']) => void
  
  setLoadingFiles: (loading: boolean) => void
  
  addRecentQuery: (question: string, sessionId?: string) => void
  clearRecentQueries: () => void
}

/**
 * User dashboard state store for managing user-specific data
 */
export const useUserStore = create<UserState>()(
  devtools((set) => ({
    // Initial state
    files: [],
    selectedFiles: [],
    
    fileFilters: {
      sortBy: 'date',
      sortOrder: 'desc',
    },
    
    loadingFiles: false,
    
    recentQueries: [],
    
    // Actions
    setFiles: (files: UserFile[]) => set({ files }),
    
    toggleFileSelection: (filename: string) =>
      set((state: UserState) => ({
        selectedFiles: state.selectedFiles.includes(filename)
          ? state.selectedFiles.filter((f) => f !== filename)
          : [...state.selectedFiles, filename],
      })),
    
    clearFileSelection: () => set({ selectedFiles: [] }),
    
    setFileFilters: (filters: UserState['fileFilters']) =>
      set((state: UserState) => ({
        fileFilters: { ...state.fileFilters, ...filters },
      })),
    
    setLoadingFiles: (loading: boolean) => set({ loadingFiles: loading }),
    
    addRecentQuery: (question: string, sessionId?: string) =>
      set((state: UserState) => {
        // Keep only last 10 queries
        const newQuery = {
          id: `${Date.now()}-${Math.random()}`,
          question,
          timestamp: Date.now(),
          sessionId,
        }
        
        return {
          recentQueries: [newQuery, ...state.recentQueries].slice(0, 10),
        }
      }),
    
    clearRecentQueries: () => set({ recentQueries: [] }),
  }))
)

export default useUserStore
