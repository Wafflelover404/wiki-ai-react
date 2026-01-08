"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { adminApi, filesApi, metricsApi, reportsApi } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Users,
  FileText,
  BarChart3,
  Upload,
  Search,
  Eye,
  Edit3,
  Download,
  Clock,
  TrendingUp,
  HardDrive,
  Activity,
  Plus,
  Filter,
  Grid3X3,
  List,
  Star,
  Calendar,
  Tag,
  AlertTriangle,
  CheckCircle,
  Settings,
  Database,
  Shield,
  Globe,
  Key,
  Plug,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalFiles: number
  totalQueries: number
  avgResponseTime: number
  systemHealth: number
  storageUsed: number
  storageTotal: number
}

interface RecentActivity {
  id: string
  type: "user" | "file" | "query" | "system"
  message: string
  timestamp: string
  user?: string
}

interface SystemAlert {
  id: string
  type: "warning" | "error" | "info"
  message: string
  timestamp: string
  resolved: boolean
}

export default function AdminDashboard() {
  const { token, user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalFiles: 0,
    totalQueries: 0,
    avgResponseTime: 0,
    systemHealth: 95,
    storageUsed: 0,
    storageTotal: 100,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const fetchSystemStats = async () => {
    if (!token) return

    try {
      const [usersRes, filesRes, metricsRes] = await Promise.all([
        adminApi.listAccounts(token),
        filesApi.list(token),
        metricsApi.summary(token, "24h", "global"),
      ])

      const totalUsers = usersRes.status === "success" ? usersRes.response?.accounts?.length || 0 : 0
      const totalFiles = filesRes.status === "success" ? filesRes.response?.documents?.length || 0 : 0
      const metrics = metricsRes.status === "success" ? metricsRes.response || {} : {}

      setStats({
        totalUsers,
        activeUsers: Math.floor(totalUsers * 0.7), // Simulate active users
        totalFiles,
        totalQueries: (metrics as any).total_queries || 0,
        avgResponseTime: (metrics as any).avg_response_time || 0,
        systemHealth: 95,
        storageUsed: totalFiles * 2.5, // Simulate storage
        storageTotal: 100,
      })
    } catch (error) {
      console.error("Failed to fetch system stats:", error)
    }
  }

  const fetchRecentActivity = async () => {
    if (!token) return

    // Simulate recent activity data
    const activity: RecentActivity[] = [
      {
        id: "1",
        type: "user",
        message: "New user registered",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user: "john_doe",
      },
      {
        id: "2",
        type: "file",
        message: "Document uploaded: product_catalog.pdf",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        user: "admin",
      },
      {
        id: "3",
        type: "query",
        message: "High volume of queries detected",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "4",
        type: "system",
        message: "System backup completed successfully",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ]
    setRecentActivity(activity)
  }

  const fetchAlerts = async () => {
    if (!token) return

    // Simulate system alerts
    const systemAlerts: SystemAlert[] = [
      {
        id: "1",
        type: "warning",
        message: "Storage usage approaching 80% capacity",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        resolved: false,
      },
      {
        id: "2",
        type: "info",
        message: "New system update available",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        resolved: false,
      },
    ]
    setAlerts(systemAlerts)
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSystemStats(),
        fetchRecentActivity(),
        fetchAlerts(),
      ])
      setIsLoading(false)
    }

    loadData()
  }, [token])

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-600"
    if (health >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getStoragePercentage = () => {
    return (stats.storageUsed / stats.storageTotal) * 100
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="w-4 h-4 text-blue-500" />
      case "file":
        return <FileText className="w-4 h-4 text-green-500" />
      case "query":
        return <Search className="w-4 h-4 text-purple-500" />
      case "system":
        return <Settings className="w-4 h-4 text-gray-500" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <>
        <AppHeader breadcrumbs={[{ label: "Admin Dashboard" }]} />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </>
    )
  }

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Admin Dashboard" }]} />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">System overview and management</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button asChild>
                <Link href="/app/admin">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Panel
                </Link>
              </Button>
              <Button asChild>
                <Link href="/app/admin/management">
                  <Settings className="w-4 h-4 mr-2" />
                  Management Panel
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {stats.activeUsers} active now
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFiles}</div>
              <p className="text-xs text-muted-foreground">In knowledge base</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQueries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time searches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHealthColor(stats.systemHealth)}`}>
                {stats.systemHealth}%
              </div>
              <Progress value={stats.systemHealth} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Storage Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>System storage utilization</CardDescription>
              </div>
              <Badge variant="outline">
                {stats.storageUsed.toFixed(1)} GB / {stats.storageTotal} GB
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={getStoragePercentage()} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{getStoragePercentage().toFixed(1)}% used</span>
                <span>{(stats.storageTotal - stats.storageUsed).toFixed(1)} GB available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>System performance overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Avg Response Time</span>
                    </div>
                    <Badge variant="secondary">{stats.avgResponseTime.toFixed(2)}s</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Query Success Rate</span>
                    </div>
                    <Badge variant="default">98.5%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Index Status</span>
                    </div>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">API Status</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Current system status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <Badge variant="outline">v2.1.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Environment</span>
                    <Badge variant="outline">Production</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Backup</span>
                    <Badge variant="outline">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <Badge variant="outline">15 days</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system events and user actions</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activity..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {activity.user && <span>User: {activity.user}</span>}
                            <span>•</span>
                            <span>{new Date(activity.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Active system notifications and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={alert.type === "error" ? "destructive" : alert.type === "warning" ? "secondary" : "outline"}
                      >
                        {alert.type}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {alert.resolved ? "View" : "Resolve"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quick-actions" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
                <Link href="/app/admin/management">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Manage Users</p>
                        <p className="text-sm text-muted-foreground">Add, edit, remove users</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
                <Link href="/app/admin/management">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">File Management</p>
                        <p className="text-sm text-muted-foreground">Upload and manage documents</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
                <Link href="/app/files">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <Upload className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Upload Files</p>
                        <p className="text-sm text-muted-foreground">Add new documents</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
                <Link href="/app/admin?tab=reports">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <BarChart3 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold">View Reports</p>
                        <p className="text-sm text-muted-foreground">System analytics</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
                <Link href="/app/admin/management">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <Key className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold">API Keys</p>
                        <p className="text-sm text-muted-foreground">Manage API access</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
                <Link href="/app/admin/management">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <Plug className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Integrations</p>
                        <p className="text-sm text-muted-foreground">Manage connected services</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
                <Link href="/app/settings">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <Settings className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Settings</p>
                        <p className="text-sm text-muted-foreground">System configuration</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}
