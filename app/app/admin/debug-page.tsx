"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { metricsApi, reportsApi, filesApi, adminApi } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { redirect } from "next/navigation"

interface ApiStatus {
  endpoint: string
  status: "loading" | "success" | "error"
  data?: any
  error?: string
}

export default function DebugAdminPage() {
  const { token, isAdmin, isLoading: authLoading } = useAuth()
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    { endpoint: "metrics", status: "loading" },
    { endpoint: "autoReports", status: "loading" },
    { endpoint: "manualReports", status: "loading" },
    { endpoint: "files", status: "loading" },
    { endpoint: "accounts", status: "loading" },
  ])

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      redirect("/app")
    }
  }, [authLoading, isAdmin])

  useEffect(() => {
    if (isAdmin && token) {
      testAllEndpoints()
    }
  }, [isAdmin, token])

  const testAllEndpoints = async () => {
    if (!token) return

    const endpoints = [
      {
        name: "metrics",
        call: () => metricsApi.summary(token),
      },
      {
        name: "autoReports", 
        call: () => reportsApi.getAuto(token),
      },
      {
        name: "manualReports",
        call: () => reportsApi.getManual(token),
      },
      {
        name: "files",
        call: () => filesApi.list(token),
      },
      {
        name: "accounts",
        call: () => adminApi.listAccounts(token),
      },
    ]

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        try {
          const result = await endpoint.call()
          return { name: endpoint.name, status: "success" as const, data: result }
        } catch (error) {
          return { 
            name: endpoint.name, 
            status: "error" as const, 
            error: error instanceof Error ? error.message : String(error)
          }
        }
      })
    )

    setApiStatuses(results.map((result, index) => {
      if (result.status === "fulfilled") {
        return {
          endpoint: endpoints[index].name,
          status: result.value.status,
          data: result.value.data,
          error: result.value.error
        }
      } else {
        return {
          endpoint: endpoints[index].name,
          status: "error",
          error: result.reason?.message || String(result.reason)
        }
      }
    }))
  }

  if (authLoading) {
    return (
      <>
        <AppHeader breadcrumbs={[{ label: "Admin Debug" }]} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </>
    )
  }

  if (!isAdmin) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "loading":
        return <Badge variant="secondary">Loading...</Badge>
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Admin Debug" }]} />
      <main className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Debug Page</h1>
          <p className="text-muted-foreground">Test all admin API endpoints</p>
        </div>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            This page helps debug API endpoint issues. Check each endpoint status below.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {apiStatuses.map((api) => (
            <Card key={api.endpoint}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">{api.endpoint}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(api.status)}
                    {getStatusBadge(api.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {api.status === "loading" && (
                  <p className="text-sm text-muted-foreground">Testing endpoint...</p>
                )}
                
                {api.status === "success" && (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600">✅ Endpoint working</p>
                    {api.data && (
                      <div className="text-xs bg-muted p-2 rounded">
                        <strong>Response:</strong>
                        <pre className="mt-1 whitespace-pre-wrap">
                          {JSON.stringify(api.data, null, 2).substring(0, 500)}
                          {JSON.stringify(api.data, null, 2).length > 500 && "..."}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
                
                {api.status === "error" && (
                  <div className="space-y-2">
                    <p className="text-sm text-red-600">❌ Endpoint failed</p>
                    <div className="text-xs bg-red-50 p-2 rounded border border-red-200">
                      <strong>Error:</strong> {api.error}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={testAllEndpoints}>
            Retest All Endpoints
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/app/admin"}>
            Go to Analytics Dashboard
          </Button>
        </div>
      </main>
    </>
  )
}
