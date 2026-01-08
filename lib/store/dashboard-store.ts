import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface DashboardState {
  // UI State
  sidebarOpen: boolean
  currentView: 'overview' | 'files' | 'queries' | 'reports' | 'settings'
  
  // Notification State
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    timestamp: number
  }>
  
  // Preferences
  theme: 'light' | 'dark' | 'auto'
  itemsPerPage: number
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  setCurrentView: (view: DashboardState['currentView']) => void
  toggleSidebar: () => void
  
  addNotification: (
    message: string,
    type?: DashboardState['notifications'][0]['type']
  ) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  setTheme: (theme: DashboardState['theme']) => void
  setItemsPerPage: (count: number) => void
}

/**
 * Global dashboard state store for UI and shared preferences
 */
export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarOpen: true,
        currentView: 'overview',
        notifications: [],
        theme: 'auto',
        itemsPerPage: 10,

        // Actions
        setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
        
        setCurrentView: (view: DashboardState['currentView']) => set({ currentView: view }),
        
        toggleSidebar: () =>
          set((state: DashboardState) => ({ sidebarOpen: !state.sidebarOpen })),

        addNotification: (message: string, type: DashboardState['notifications'][0]['type'] = 'info') =>
          set((state: DashboardState) => ({
            notifications: [
              ...state.notifications,
              {
                id: `${Date.now()}-${Math.random()}`,
                type,
                message,
                timestamp: Date.now(),
              },
            ],
          })),

        removeNotification: (id: string) =>
          set((state: DashboardState) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearNotifications: () =>
          set({ notifications: [] }),

        setTheme: (theme: DashboardState['theme']) => set({ theme }),
        
        setItemsPerPage: (count) => set({ itemsPerPage: count }),
      }),
      {
        name: 'dashboard-store',
        partialize: (state) => ({
          theme: state.theme,
          itemsPerPage: state.itemsPerPage,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    )
  )
)

export default useDashboardStore
