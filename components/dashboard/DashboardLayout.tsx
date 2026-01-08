'use client'

import React, { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { AdminDashboard } from './AdminDashboard'
import { UserDashboard } from './UserDashboard'
import { Loader2 } from 'lucide-react'

interface DashboardLayoutProps {
  children?: ReactNode
}

/**
 * Unified dashboard layout that routes users based on their role
 * - Admins/Owners see admin dashboard with user/file/report management
 * - Editors/Viewers see user dashboard with file/query interface
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { token, user, isLoading: authLoading } = useAuth()
  const { sidebarOpen } = useDashboardStore()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login')
    }
  }, [token, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!token) {
    return null
  }

  // Determine if user has admin privileges
  const isAdmin = user?.role === 'admin' || user?.role === 'owner'

  // Choose dashboard based on role
  const dashboardContent = isAdmin ? (
    <AdminDashboard />
  ) : (
    <UserDashboard />
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <Sidebar isAdmin={isAdmin} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children || dashboardContent}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
