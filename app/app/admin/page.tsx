"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { metricsApi, reportsApi, filesApi, adminApi } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { redirect } from "next/navigation"

interface MetricsSummary {
  total_queries: number
  successful_queries: number
  failed_queries: number
  avg_response_time: number
}

interface Report {
  id: string
  question?: string
  feedback?: string
  timestamp: string
}

export default function AdminDashboardPage() {
  const { token, isAdmin, isLoading: authLoading } = useAuth()
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null)
  const [autoReports, setAutoReports] = useState<Report[]>([])
  const [manualReports, setManualReports] = useState<Report[]>([])
  const [fileCount, setFileCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!token || !isAdmin) return

    try {
      // Fetch basic admin data
      const [metricsRes, filesRes, usersRes] = await Promise.all([
        metricsApi.summary(token, "24h", "global"),
        filesApi.list(token),
        adminApi.listAccounts(token),
      ])
      
      if (metricsRes.status === "success" && metricsRes.response) {
        setMetrics(metricsRes.response)
      }
      if (filesRes.status === "success" && filesRes.response) {
        setFileCount(filesRes.response.documents?.length || 0)
      }
      if (usersRes.status === "success" && usersRes.response) {
        setUserCount(usersRes.response.accounts?.length || 0)
      }
      
      // Only fetch reports if user is admin
      if (isAdmin) {
        const [autoRes, manualRes] = await Promise.all([
          reportsApi.getAuto(token),
          reportsApi.getManual(token),
        ])
        
        if (autoRes.status === "success" && autoRes.response) {
          setAutoReports((autoRes.response as any).reports || [])
        }
        if (manualRes.status === "success" && manualRes.response) {
          setManualReports((manualRes.response as any).reports || [])
        }
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token, isAdmin])

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      redirect("/app")
    }
  }, [authLoading, isAdmin])

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin, fetchData])

  // Add 30-second polling for real-time updates
  useEffect(() => {
    if (!isAdmin || !token) return

    const interval = setInterval(() => {
      fetchData()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [isAdmin, token, fetchData])

  if (authLoading || isLoading) {
    return (
      <>
        <AppHeader breadcrumbs={[{ label: "Admin" }]} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </>
    )
  }

  if (!isAdmin) {
    return null
  }

  const successRate = metrics ? Math.round((metrics.successful_queries / (metrics.total_queries || 1)) * 100) : 0
  const failureRate = 100 - successRate

  const pieData = [
    { name: "Successful", value: metrics?.successful_queries || 0, color: "var(--color-success)" },
    { name: "Failed", value: metrics?.failed_queries || 0, color: "var(--color-destructive)" },
  ]

  // Mock chart data - in production this would come from actual metrics
  const chartData = [
    { date: "Mon", queries: 45, success: 42 },
    { date: "Tue", queries: 52, success: 48 },
    { date: "Wed", queries: 38, success: 35 },
    { date: "Thu", queries: 65, success: 60 },
    { date: "Fri", queries: 48, success: 45 },
    { date: "Sat", queries: 32, success: 30 },
    { date: "Sun", queries: 28, success: 26 },
  ]

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Admin Dashboard" }]} />
      <main className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">System analytics and performance monitoring</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.total_queries?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">All time processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-success transition-all" style={{ width: `${successRate}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.avg_response_time?.toFixed(2) || 0}s</div>
              <p className="text-xs text-muted-foreground">Average latency</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Query Volume</CardTitle>
              <CardDescription>Daily query trends over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                    <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="queries"
                      stroke="var(--color-primary)"
                      fillOpacity={1}
                      fill="url(#colorQueries)"
                    />
                    <Area
                      type="monotone"
                      dataKey="success"
                      stroke="var(--color-success)"
                      fillOpacity={1}
                      fill="url(#colorSuccess)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Query Distribution</CardTitle>
              <CardDescription>Success vs failure breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm">Successful ({metrics?.successful_queries || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm">Failed ({metrics?.failed_queries || 0})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Auto-generated and manual feedback reports</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Auto: {autoReports.length}
                </Badge>
                <Badge variant="outline">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Manual: {manualReports.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="auto">
              <TabsList>
                <TabsTrigger value="auto">Auto Reports ({autoReports.length})</TabsTrigger>
                <TabsTrigger value="manual">Manual Reports ({manualReports.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="auto" className="mt-4">
                <ScrollArea className="h-[300px]">
                  {autoReports.length > 0 ? (
                    <div className="space-y-3">
                      {autoReports.map((report) => (
                        <div key={report.id} className="p-4 rounded-lg border bg-muted/30">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                              <div>
                                <p className="font-medium">{report.question || "No question recorded"}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(report.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary">Auto</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success/50" />
                      <p className="text-muted-foreground">No auto-generated reports</p>
                      <p className="text-sm text-muted-foreground mt-1">All queries received answers</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="manual" className="mt-4">
                <ScrollArea className="h-[300px]">
                  {manualReports.length > 0 ? (
                    <div className="space-y-3">
                      {manualReports.map((report) => (
                        <div key={report.id} className="p-4 rounded-lg border bg-muted/30">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium">{report.feedback || "No feedback provided"}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(report.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary">Manual</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No manual reports</p>
                      <p className="text-sm text-muted-foreground mt-1">Users have not submitted feedback</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{fileCount}</p>
                  <p className="text-sm text-muted-foreground">Indexed Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userCount}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{autoReports.length + manualReports.length}</p>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
