import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AdminUser {
  id: string
  user_id?: string
  username: string
  email?: string
  role: string
  created_at?: string
  organization_id?: string
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

interface AdminState {
  // Data
  users: AdminUser[]
  files: AdminFile[]
  reports: AdminReport[]
  
  // Selection/Filters
  selectedUsers: string[]
  selectedFiles: string[]
  selectedReports: string[]
  
  activeTab: 'users' | 'files' | 'reports' | 'activity'
  
  // Filters
  userFilters: {
    role?: string
    search?: string
  }
  fileFilters: {
    search?: string
    uploadedBy?: string
  }
  reportFilters: {
    type?: string
    search?: string
  }
  
  // Loading state
  loadingUsers: boolean
  loadingFiles: boolean
  loadingReports: boolean
  
  // Actions
  setUsers: (users: AdminUser[]) => void
  setFiles: (files: AdminFile[]) => void
  setReports: (reports: AdminReport[]) => void
  
  toggleUserSelection: (userId: string) => void
  toggleFileSelection: (fileId: string) => void
  toggleReportSelection: (reportId: string) => void
  
  clearSelection: (type: 'users' | 'files' | 'reports' | 'all') => void
  
  setActiveTab: (tab: AdminState['activeTab']) => void
  
  setUserFilters: (filters: AdminState['userFilters']) => void
  setFileFilters: (filters: AdminState['fileFilters']) => void
  setReportFilters: (filters: AdminState['reportFilters']) => void
  
  setLoadingUsers: (loading: boolean) => void
  setLoadingFiles: (loading: boolean) => void
  setLoadingReports: (loading: boolean) => void
}

/**
 * Admin panel state store for managing users, files, and reports
 */
export const useAdminStore = create<AdminState>()(
  devtools((set) => ({
    // Initial state
    users: [],
    files: [],
    reports: [],
    
    selectedUsers: [],
    selectedFiles: [],
    selectedReports: [],
    
    activeTab: 'users',
    
    userFilters: {},
    fileFilters: {},
    reportFilters: {},
    
    loadingUsers: false,
    loadingFiles: false,
    loadingReports: false,
    
    // Actions
    setUsers: (users: AdminUser[]) => set({ users }),
    setFiles: (files: AdminFile[]) => set({ files }),
    setReports: (reports: AdminReport[]) => set({ reports }),
    
    toggleUserSelection: (userId: string) =>
      set((state: AdminState) => ({
        selectedUsers: state.selectedUsers.includes(userId)
          ? state.selectedUsers.filter((id) => id !== userId)
          : [...state.selectedUsers, userId],
      })),
    
    toggleFileSelection: (fileId: string) =>
      set((state: AdminState) => ({
        selectedFiles: state.selectedFiles.includes(fileId)
          ? state.selectedFiles.filter((id) => id !== fileId)
          : [...state.selectedFiles, fileId],
      })),
    
    toggleReportSelection: (reportId: string) =>
      set((state: AdminState) => ({
        selectedReports: state.selectedReports.includes(reportId)
          ? state.selectedReports.filter((id) => id !== reportId)
          : [...state.selectedReports, reportId],
      })),
    
    clearSelection: (type: 'users' | 'files' | 'reports' | 'all') =>
      set((state: AdminState) => {
        if (type === 'all') {
          return {
            selectedUsers: [],
            selectedFiles: [],
            selectedReports: [],
          }
        }
        
        return {
          [type === 'users' ? 'selectedUsers' : type === 'files' ? 'selectedFiles' : 'selectedReports']: [],
        }
      }),
    
    setActiveTab: (tab: AdminState['activeTab']) => set({ activeTab: tab }),
    
    setUserFilters: (filters: AdminState['userFilters']) =>
      set((state: AdminState) => ({
        userFilters: { ...state.userFilters, ...filters },
      })),
    
    setFileFilters: (filters: AdminState['fileFilters']) =>
      set((state: AdminState) => ({
        fileFilters: { ...state.fileFilters, ...filters },
      })),
    
    setReportFilters: (filters: AdminState['reportFilters']) =>
      set((state: AdminState) => ({
        reportFilters: { ...state.reportFilters, ...filters },
      })),
    
    setLoadingUsers: (loading: boolean) => set({ loadingUsers: loading }),
    setLoadingFiles: (loading: boolean) => set({ loadingFiles: loading }),
    setLoadingReports: (loading: boolean) => set({ loadingReports: loading }),
  }))
)

export default useAdminStore
