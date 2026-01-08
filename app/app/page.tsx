"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { metricsApi, filesApi, reportsApi } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, MessageSquare, TrendingUp, Clock, AlertCircle, ArrowRight, Loader2 } from "lucide-react"

interface MetricsSummary {
  total_queries: number
  successful_queries: number
  failed_queries: number
  avg_response_time: number
}

interface RecentQuery {
  question: string
  answer: string
  timestamp: string
}

export default function DashboardPage() {
  const { token, user } = useAuth()
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null)
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([])
  const [fileCount, setFileCount] = useState(0)
  const [reportCount, setReportCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!token) return

      try {
        const [metricsRes, filesRes, reportsRes, queriesRes] = await Promise.all([
          metricsApi.summary(token),
          filesApi.list(token),
          reportsApi.getAuto(token),
          metricsApi.queries(token, 5),
        ])

        if (metricsRes.status === "success" && metricsRes.response) {
          setMetrics(metricsRes.response)
        }
        if (filesRes.status === "success" && filesRes.response) {
          setFileCount(filesRes.response.documents?.length || 0)
        }
        if (reportsRes.status === "success" && reportsRes.response) {
          setReportCount(reportsRes.response.reports?.length || 0)
        }
        if (queriesRes.status === "success" && queriesRes.response) {
          setRecentQueries(queriesRes.response.queries || [])
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  const successRate = metrics ? Math.round((metrics.successful_queries / (metrics.total_queries || 1)) * 100) : 0

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.username}</h1>
          <p className="text-muted-foreground">{"Here's an overview of your knowledge base activity."}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
            <Link href="/app/search">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Search Knowledge</p>
                    <p className="text-sm text-muted-foreground">Query your documents</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
            <Link href="/app/files">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Manage Files</p>
                    <p className="text-sm text-muted-foreground">{fileCount} documents indexed</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
            <Link href="/app/catalogs">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center group-hover:bg-chart-3/20 transition-colors">
                    <MessageSquare className="w-6 h-6 text-chart-3" />
                  </div>
                  <div>
                    <p className="font-semibold">Catalogs</p>
                    <p className="text-sm text-muted-foreground">Product search</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
            <Link href="/app/plugins">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center group-hover:bg-chart-4/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-chart-4" />
                  </div>
                  <div>
                    <p className="font-semibold">OpenCart</p>
                    <p className="text-sm text-muted-foreground">Integration settings</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
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
              <p className="text-xs text-muted-foreground">All time queries processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-success" style={{ width: `${successRate}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.avg_response_time?.toFixed(2) || 0}s</div>
              <p className="text-xs text-muted-foreground">Average query latency</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportCount}</div>
              <p className="text-xs text-muted-foreground">Unanswered queries</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Queries</CardTitle>
                  <CardDescription>Latest questions from users</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/app/search">
                    View all <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentQueries.length > 0 ? (
                <div className="space-y-4">
                  {recentQueries.map((query, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{query.question}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{query.answer}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(query.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent queries</p>
                  <p className="text-sm mt-1">Start searching your knowledge base</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>System overview</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Indexed Documents</span>
                  </div>
                  <Badge variant="secondary">{fileCount}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm font-medium">Successful Queries</span>
                  </div>
                  <Badge variant="secondary">{metrics?.successful_queries || 0}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    </div>
                    <span className="text-sm font-medium">Failed Queries</span>
                  </div>
                  <Badge variant="secondary">{metrics?.failed_queries || 0}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-chart-3/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-chart-3" />
                    </div>
                    <span className="text-sm font-medium">Organization</span>
                  </div>
                  <Badge variant="outline">{user?.organization}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
