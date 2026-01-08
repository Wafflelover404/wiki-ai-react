"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const { isAdmin, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      // Redirect admins to admin dashboard, users to user dashboard
      if (isAdmin) {
        redirect("/app/admin")
      } else {
        redirect("/app/dashboard/user")
      }
    }
  }, [isAdmin, isLoading])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return null
}
