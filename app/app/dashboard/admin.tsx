"use client"

import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/app-header"
import { useTranslation } from '@/src/i18n'
import EnhancedAdminDashboard from "@/components/dashboard/AdminDashboardEnhanced"

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { token, user, isAdmin } = useAuth()

  if (!token) {
    return (
      <>
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{t('status.authenticationRequired')}</h2>
            <p className="text-muted-foreground">{t('admin.pleaseLogInToAccessAdminDashboard')}</p>
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
            <h2 className="text-2xl font-bold mb-2">{t('status.accessDenied')}</h2>
            <p className="text-muted-foreground">{t('admin.accessDeniedMessage')}</p>
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
