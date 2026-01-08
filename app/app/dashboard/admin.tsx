"use client"

import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/app-header"
import EnhancedAdminDashboard from "@/components/dashboard/AdminDashboardEnhanced"

export default function AdminDashboard() {
  const { token, user, isAdmin } = useAuth()

  if (!token) {
    return (
      <>
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to access the admin dashboard.</p>
          </div>
        </main>
      </>
    )
  }

  if (!isAdmin || !user) {
    return (
      <>
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need administrator privileges to view this dashboard.</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <EnhancedAdminDashboard />
    </>
  )
}
