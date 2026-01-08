'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useUserFiles } from '@/hooks/useUserData'
import { useUserStore } from '@/lib/store/user-store'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertCircle,
  Plus,
  Download,
  Trash2,
  FileText,
  Search,
  Send,
  Loader2,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DataTable, Column } from './DataTable'

interface UserFile {
  filename: string
  original_filename?: string
  size?: number
  uploaded_at?: string
  id?: string
}

/**
 * User dashboard for file management and queries
 */
export function UserDashboard() {
  const { token, user } = useAuth()
  const { addNotification } = useDashboardStore()
  const {
    files: storedFiles,
    setFiles,
    selectedFiles,
    toggleFileSelection,
    clearFileSelection,
    recentQueries,
    addRecentQuery,
  } = useUserStore()

  const [queryText, setQueryText] = useState('')
  const [isQueryLoading, setIsQueryLoading] = useState(false)

  // Fetch user files
  const filesData = useUserFiles(token || undefined)

  // Memoize data to prevent infinite loops
  const filesDataMemo = useMemo(() => filesData.data, [JSON.stringify(filesData.data)])

  // Sync fetched data to store
  useEffect(() => {
    if (filesDataMemo && Array.isArray(filesDataMemo)) {
      setFiles(filesDataMemo as UserFile[])
    }
  }, [filesDataMemo, setFiles])

  // File columns
  const fileColumns: Column<UserFile>[] = [
    {
      key: 'filename',
      label: 'Filename',
      sortable: true,
      width: '50%',
    },
    {
      key: 'size',
      label: 'Size',
      sortable: true,
      width: '20%',
      render: (value) =>
        value ? `${(value / 1024).toFixed(2)} KB` : '-',
    },
    {
      key: 'uploaded_at',
      label: 'Uploaded',
      sortable: true,
      width: '30%',
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString()
          : '-',
    },
  ]

  const handleQuery = async () => {
    if (!queryText.trim()) {
      addNotification('Please enter a question', 'warning')
      return
    }

    setIsQueryLoading(true)
    try {
      // TODO: Call query API when ready
      addRecentQuery(queryText)
      addNotification('Query submitted (backend integration pending)', 'info')
      setQueryText('')
    } catch (error) {
      addNotification(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      )
    } finally {
      setIsQueryLoading(false)
    }
  }

  const handleDownload = (filename: string) => {
    addNotification(`Download for "${filename}" coming soon`, 'info')
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.username}! Upload files and ask questions.
        </p>
      </div>

      {/* Query Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>
            Ask anything about your documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about your documents..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isQueryLoading) {
                  handleQuery()
                }
              }}
              disabled={isQueryLoading}
            />
            <Button
              onClick={handleQuery}
              disabled={isQueryLoading || !queryText.trim()}
            >
              {isQueryLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
          <CardDescription>
            Manage and search through your uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filesData.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load files: {filesData.error.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {selectedFiles.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      selectedFiles.forEach((filename: string) =>
                        handleDownload(filename)
                      )
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download ({selectedFiles.length})
                  </Button>

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
                    Delete ({selectedFiles.length})
                  </Button>
                </>
              )}

              <Button
                size="sm"
                onClick={() => {
                  addNotification('File upload coming soon', 'info')
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>

          <DataTable
            data={storedFiles}
            columns={fileColumns}
            loading={filesData.loading}
            selectable
            selectedRows={selectedFiles}
            onSelectRow={toggleFileSelection}
            onRowClick={(file) => {
              addNotification(
                `Opening "${file.filename}" (preview coming soon)`,
                'info'
              )
            }}
            emptyMessage="No files uploaded yet. Start by uploading a document."
          />
        </CardContent>
      </Card>

      {/* Recent Queries */}
      {recentQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Queries</CardTitle>
            <CardDescription>
              Your last {recentQueries.length} questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentQueries.map((query: any) => (
                <div
                  key={query.id}
                  className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium">{query.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(query.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UserDashboard
