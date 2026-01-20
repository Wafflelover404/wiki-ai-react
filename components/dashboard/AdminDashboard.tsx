'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/src/i18n'
import { useAdminUsers, useAdminFiles, useAdminReports } from '@/hooks/useAdminData'
import { useAdminStore } from '@/lib/store/admin-store'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Plus, Trash2, Edit2, Users, FileText, BarChart3, Lock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DataTable, Column } from './DataTable'

interface AdminUser {
  id: string
  user_id?: string
  username: string
  email?: string
  role: string
  created_at?: string
}

interface AdminFile {
  id: string
  filename: string
  size?: number
  uploaded_at?: string
}

interface AdminReport {
  id: string
  name: string
  type: string
  created_at?: string
}

/**
 * Admin dashboard for managing users, files, and reports
 * STRICTLY restricted to admin/owner roles only
 */
export function AdminDashboard() {
  const { t } = useTranslation()
  const router = useRouter()
  const { token, user, isLoading: authLoading } = useAuth()
  const { addNotification } = useDashboardStore()
  
  // Strict permission check - must be admin or owner
  const isAuthorizedAdmin = user && ['admin', 'owner'].includes(user.role)

  // Redirect unauthorized users
  useEffect(() => {
    if (!authLoading && !isAuthorizedAdmin) {
      router.push('/dashboard')
    }
  }, [authLoading, isAuthorizedAdmin, router])

  // Show access denied if not authorized
  if (!authLoading && !isAuthorizedAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold">{t('status.error')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('admin.systemAnalyticsAndPerformanceMonitoring')}
            </p>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              {t('actions.back')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const {
    users,
    files,
    reports,
    setUsers,
    setFiles,
    setReports,
    selectedUsers,
    selectedFiles,
    selectedReports,
    toggleUserSelection,
    toggleFileSelection,
    toggleReportSelection,
    activeTab,
    setActiveTab,
    loadingUsers,
    loadingFiles,
    loadingReports,
  } = useAdminStore()

  // Fetch data with auto-refresh every 30 seconds
  const usersData = useAdminUsers(token || undefined, false, { autoRefreshInterval: 30000 })
  const filesData = useAdminFiles(token || undefined, false, { autoRefreshInterval: 30000 })
  const reportsData = useAdminReports(token || undefined, false, { autoRefreshInterval: 30000 })

  // Memoize data to prevent infinite loops
  const usersDataMemo = useMemo(() => usersData.data, [JSON.stringify(usersData.data)])
  const filesDataMemo = useMemo(() => filesData.data, [JSON.stringify(filesData.data)])
  const reportsDataMemo = useMemo(() => reportsData.data, [JSON.stringify(reportsData.data)])

  // Sync fetched data to store
  useEffect(() => {
    if (usersDataMemo) {
      setUsers(usersDataMemo as AdminUser[])
    }
  }, [usersDataMemo, setUsers])

  useEffect(() => {
    if (filesDataMemo) {
      setFiles(filesDataMemo as AdminFile[])
    }
  }, [filesDataMemo, setFiles])

  useEffect(() => {
    if (reportsDataMemo) {
      setReports(reportsDataMemo as AdminReport[])
    }
  }, [reportsDataMemo, setReports])

  // Show loading state
  const isLoading =
    usersData.loading || filesData.loading || reportsData.loading

  // User columns
  const userColumns: Column<AdminUser>[] = [
    {
      key: 'username',
      label: t('userManagement.username'),
      sortable: true,
      width: '30%',
    },
    {
      key: 'email',
      label: t('login.username'),
      sortable: true,
      width: '35%',
    },
    {
      key: 'role',
      label: t('userManagement.role'),
      sortable: true,
      width: '20%',
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
          {value || 'user'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: t('userManagement.lastLogin'),
      sortable: true,
      width: '15%',
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString()
          : '-',
    },
  ]

  // File columns
  const fileColumns: Column<AdminFile>[] = [
    {
      key: 'filename',
      label: t('dashboard.files'),
      sortable: true,
      width: '50%',
    },
    {
      key: 'size',
      label: t('files.size'),
      sortable: true,
      width: '20%',
      render: (value) =>
        value ? `${(value / 1024).toFixed(2)} KB` : '-',
    },
    {
      key: 'uploaded_at',
      label: t('dashboard.uploading'),
      sortable: true,
      width: '30%',
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString()
          : '-',
    },
  ]

  // Report columns
  const reportColumns: Column<AdminReport>[] = [
    {
      key: 'name',
      label: t('admin.reports'),
      sortable: true,
      width: '40%',
    },
    {
      key: 'type',
      label: t('status.info'),
      sortable: true,
      width: '30%',
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
          {value || 'general'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: t('userManagement.lastLogin'),
      sortable: true,
      width: '30%',
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString()
          : '-',
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('admin.systemAnalyticsAndPerformanceMonitoring')}
          </p>
        </div>
        <Button
          onClick={() => {
            usersData.refetch()
            filesData.refetch()
            reportsData.refetch()
          }}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t('actions.loading')}...
            </>
          ) : (
            <>
              <span>↻</span>
              {t('actions.view')}
            </>
          )}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">{t('admin.registeredAccounts')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.indexedDocuments')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.uploadDocumentsToBuildYourKnowledgeBase')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalReports')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">{t('admin.autoGeneratedAndManualFeedbackReports')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Errors */}
      {usersData.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('status.failed')} {t('userManagement.failedToLoadData')}: {usersData.error.message}
          </AlertDescription>
        </Alert>
      )}

      {filesData.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('dashboard.failedToFetchFiles')}: {filesData.error.message}
          </AlertDescription>
        </Alert>
      )}

      {reportsData.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('dashboard.failedToFetchFiles')}: {reportsData.error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>{t('userManagement.title')}</CardTitle>
          <CardDescription>
            {t('admin.systemAnalyticsAndPerformanceMonitoring')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">
                {t('navigation.admin')} ({users.length})
              </TabsTrigger>
              <TabsTrigger value="files">
                {t('navigation.files')} ({files.length})
              </TabsTrigger>
              <TabsTrigger value="reports">
                {t('admin.reports')} ({reports.length})
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {selectedUsers.length > 0 && (
                    <span>
                      {selectedUsers.length} {t('userManagement.title')}{selectedUsers.length !== 1 ? 's' : ''} {t('files.selected')}
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  {selectedUsers.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        addNotification(
                          'Delete users functionality coming soon',
                          'info'
                        )
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => {
                      addNotification(
                        'Create user form coming soon',
                        'info'
                      )
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              <DataTable
                data={users}
                columns={userColumns}
                loading={usersData.loading}
                selectable
                selectedRows={selectedUsers}
                onSelectRow={toggleUserSelection}
                emptyMessage="No users found"
              />
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {selectedFiles.length > 0 && (
                    <span>
                      {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  {selectedFiles.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        addNotification(
                          'Delete files functionality coming soon',
                          'info'
                        )
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </Button>
                  )}
                </div>
              </div>

              <DataTable
                data={files}
                columns={fileColumns}
                loading={filesData.loading}
                selectable
                selectedRows={selectedFiles}
                onSelectRow={toggleFileSelection}
                emptyMessage="No files found"
              />
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {selectedReports.length > 0 && (
                    <span>
                      {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
                    </span>
                  )}
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    addNotification(
                      'Generate report functionality coming soon',
                      'info'
                    )
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>

              <DataTable
                data={reports}
                columns={reportColumns}
                loading={reportsData.loading}
                selectable
                selectedRows={selectedReports}
                onSelectRow={toggleReportSelection}
                emptyMessage="No reports found"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
