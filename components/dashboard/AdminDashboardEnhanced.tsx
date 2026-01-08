"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { metricsApi, filesApi, queryApi, dashboardApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Server, 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Loader2,
  Settings,
  Shield,
  Database,
  Activity,
  CheckCircle,
  XCircle,
  BarChart3,
  UserPlus,
  Lock,
  Zap,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff
} from "lucide-react"

interface SystemHealth {
  status: "healthy" | "warning" | "critical"
  uptime: number
  api_response_time: number
  error_rate: number
  active_connections: number
  database_status: "connected" | "disconnected" | "slow"
  storage_usage: {
    used: number
    total: number
    percentage: number
  }
}

interface UserAnalytics {
  total_users: number
  active_users_today: number
  new_registrations_today: number
  active_users_week: number
  user_growth_rate: number
  top_active_users: Array<{
    username: string
    queries: number
    last_active: string
  }>
  pending_approvals: number
}

interface ContentMetrics {
  total_documents: number
  documents_uploaded_today: number
  storage_used_gb: number
  popular_documents: Array<{
    filename: string
    views: number
    last_accessed: string
  }>
  flagged_content: number
  processing_queue: number
}

interface SecurityAlerts {
  failed_logins: number
  suspicious_activity: number
  permission_denials: number
  active_sessions: number
  api_key_usage: Array<{
    key_name: string
    usage: number
    last_used: string
  }>
}

interface BusinessIntelligence {
  search_trends: Array<{
    term: string
    frequency: number
    trend: "up" | "down" | "stable"
  }>
  department_usage: Array<{
    department: string
    queries: number
    users: number
  }>
  productivity_metrics: {
    avg_queries_per_user: number
    success_rate: number
    response_time_avg: number
  }
  cost_metrics: {
    cost_per_query: number
    daily_operational_cost: number
    monthly_projection: number
  }
}

export default function AdminDashboard() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null)
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics | null>(null)
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlerts | null>(null)
  const [businessIntelligence, setBusinessIntelligence] = useState<BusinessIntelligence | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    async function fetchAdminData() {
      if (!token || user?.role !== "admin") return

      try {
        // Use the new enhanced admin dashboard API
        const dashboardRes = await dashboardApi.getAdminData(token)

        if (dashboardRes.status === "success" && dashboardRes.response) {
          const data = dashboardRes.response
          
          // Set all the dashboard data
          setSystemHealth(data.system_health)
          setUserAnalytics(data.user_analytics)
          setContentMetrics(data.content_metrics)
          setSecurityAlerts(data.security_alerts)
          setBusinessIntelligence(data.business_intelligence)
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error)
        // Fallback to mock data if API fails
        setSystemHealth({
          status: "healthy",
          uptime: 99.9,
          api_response_time: 120,
          error_rate: 0.2,
          active_connections: 45,
          database_status: "connected",
          storage_usage: {
            used: 15.6,
            total: 100,
            percentage: 15.6
          }
        })

        setUserAnalytics({
          total_users: 127,
          active_users_today: 34,
          new_registrations_today: 2,
          active_users_week: 89,
          user_growth_rate: 12.5,
          top_active_users: [
            { username: "john.doe", queries: 45, last_active: "2024-01-15T10:30:00Z" },
            { username: "jane.smith", queries: 38, last_active: "2024-01-15T09:45:00Z" },
            { username: "mike.wilson", queries: 32, last_active: "2024-01-15T11:15:00Z" }
          ],
          pending_approvals: 3
        })

        setContentMetrics({
          total_documents: 1847,
          documents_uploaded_today: 12,
          storage_used_gb: 15.6,
          popular_documents: [
            { filename: "Q4 Strategy.pdf", views: 234, last_accessed: "2024-01-15T10:30:00Z" },
            { filename: "Employee Handbook.docx", views: 189, last_accessed: "2024-01-15T09:15:00Z" },
            { filename: "Product Roadmap.pptx", views: 156, last_accessed: "2024-01-15T11:45:00Z" }
          ],
          flagged_content: 2,
          processing_queue: 5
        })

        setSecurityAlerts({
          failed_logins: 7,
          suspicious_activity: 2,
          permission_denials: 15,
          active_sessions: 45,
          api_key_usage: [
            { key_name: "production-api", usage: 1250, last_used: "2024-01-15T11:30:00Z" },
            { key_name: "integration-key", usage: 890, last_used: "2024-01-15T10:45:00Z" }
          ]
        })

        setBusinessIntelligence({
          search_trends: [
            { term: "company policy", frequency: 45, trend: "up" },
            { term: "product roadmap", frequency: 38, trend: "stable" },
            { term: "team meetings", frequency: 32, trend: "down" }
          ],
          department_usage: [
            { department: "Engineering", queries: 234, users: 45 },
            { department: "Sales", queries: 189, users: 23 },
            { department: "Marketing", queries: 156, users: 18 }
          ],
          productivity_metrics: {
            avg_queries_per_user: 12.5,
            success_rate: 94.2,
            response_time_avg: 120
          },
          cost_metrics: {
            cost_per_query: 0.023,
            daily_operational_cost: 45.67,
            monthly_projection: 1370.10
          }
        })

        setLastUpdated(new Date())
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdminData()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchAdminData, 30000)
    return () => clearInterval(interval)
  }, [token, user?.role])

  const getHealthColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-success"
      case "warning": return "text-warning"
      case "critical": return "text-destructive"
      default: return "text-muted-foreground"
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="w-5 h-5 text-success" />
      case "warning": return <AlertTriangle className="w-5 h-5 text-warning" />
      case "critical": return <XCircle className="w-5 h-5 text-destructive" />
      default: return <Activity className="w-5 h-5 text-muted-foreground" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need administrator privileges to view this dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System overview and administrative controls • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {systemHealth && systemHealth.status !== "healthy" && (
        <Alert className={systemHealth.status === "critical" ? "border-destructive" : "border-warning"}>
          {getHealthIcon(systemHealth.status)}
          <AlertDescription>
            System status is <strong>{systemHealth.status}</strong>. {systemHealth.status === "critical" ? 
              "Immediate attention required." : "Monitor closely."}
          </AlertDescription>
        </Alert>
      )}

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <div className="flex items-center gap-2 mt-2">
                  {getHealthIcon(systemHealth?.status || "unknown")}
                  <span className={`text-2xl font-bold ${getHealthColor(systemHealth?.status || "unknown")}`}>
                    {systemHealth?.status || "Unknown"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Uptime: {systemHealth?.uptime || 0}%
                </p>
              </div>
              <Server className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{userAnalytics?.active_users_today || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +{userAnalytics?.new_registrations_today || 0} new today
                </p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{contentMetrics?.total_documents || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +{contentMetrics?.documents_uploaded_today || 0} today
                </p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Response</p>
                <p className="text-2xl font-bold">{systemHealth?.api_response_time || 0}ms</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Error rate: {systemHealth?.error_rate || 0}%
                </p>
              </div>
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="group hover:border-primary/50 transition-all cursor-pointer shadow-sm">
          <Link href="/admin/users">
            <CardContent className="p-4 text-center">
              <UserPlus className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Users</p>
              <p className="text-xs text-muted-foreground">{userAnalytics?.pending_approvals || 0} pending</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="group hover:border-primary/50 transition-all cursor-pointer shadow-sm">
          <Link href="/admin/content">
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Content</p>
              <p className="text-xs text-muted-foreground">{contentMetrics?.flagged_content || 0} flagged</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="group hover:border-primary/50 transition-all cursor-pointer shadow-sm">
          <Link href="/admin/security">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-warning" />
              <p className="text-sm font-medium">Security</p>
              <p className="text-xs text-muted-foreground">{securityAlerts?.failed_logins || 0} alerts</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="group hover:border-primary/50 transition-all cursor-pointer shadow-sm">
          <Link href="/admin/organizations">
            <CardContent className="p-4 text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-chart-3" />
              <p className="text-sm font-medium">Orgs</p>
              <p className="text-xs text-muted-foreground">Manage tenants</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="group hover:border-primary/50 transition-all cursor-pointer shadow-sm">
          <Link href="/admin/api-keys">
            <CardContent className="p-4 text-center">
              <Lock className="w-6 h-6 mx-auto mb-2 text-chart-1" />
              <p className="text-sm font-medium">API Keys</p>
              <p className="text-xs text-muted-foreground">{securityAlerts?.api_key_usage?.length || 0} active</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="group hover:border-primary/50 transition-all cursor-pointer shadow-sm">
          <Link href="/admin/reports">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-chart-2" />
              <p className="text-sm font-medium">Reports</p>
              <p className="text-xs text-muted-foreground">View analytics</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Analytics */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  User Analytics
                </CardTitle>
                <CardDescription>User activity and growth metrics</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/users">
                  Manage <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{userAnalytics?.total_users || 0}</p>
                <p className="text-xs text-success">+{userAnalytics?.user_growth_rate || 0}% growth</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Active Today</p>
                <p className="text-2xl font-bold">{userAnalytics?.active_users_today || 0}</p>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics?.active_users_week || 0} this week
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Top Active Users</p>
              {userAnalytics?.top_active_users?.slice(0, 3).map((user, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.queries} queries</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(user.last_active).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-chart-1" />
                  System Performance
                </CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Status</span>
                <div className="flex items-center gap-2">
                  {systemHealth?.database_status === "connected" ? (
                    <><CheckCircle className="w-4 h-4 text-success" /><span className="text-sm">Connected</span></>
                  ) : (
                    <><XCircle className="w-4 h-4 text-destructive" /><span className="text-sm">Issues</span></>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Storage Usage</span>
                  <span>{systemHealth?.storage_usage.percentage || 0}%</span>
                </div>
                <Progress value={systemHealth?.storage_usage.percentage || 0} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {systemHealth?.storage_usage.used || 0} GB of {systemHealth?.storage_usage.total || 0} GB used
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Connections</span>
                <Badge variant="secondary">{systemHealth?.active_connections || 0}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <Badge variant={systemHealth?.error_rate && systemHealth.error_rate > 1 ? "destructive" : "secondary"}>
                  {systemHealth?.error_rate || 0}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Intelligence */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Search Trends */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-chart-2" />
              Search Trends
            </CardTitle>
            <CardDescription>Popular search terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {businessIntelligence?.search_trends?.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{trend.term}</p>
                  <p className="text-xs text-muted-foreground">{trend.frequency} searches</p>
                </div>
                <div className="flex items-center gap-1">
                  {trend.trend === "up" && <TrendingUp className="w-4 h-4 text-success" />}
                  {trend.trend === "down" && <TrendingUp className="w-4 h-4 text-danger rotate-180" />}
                  {trend.trend === "stable" && <div className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Department Usage */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-chart-3" />
              Department Usage
            </CardTitle>
            <CardDescription>Activity by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {businessIntelligence?.department_usage?.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{dept.department}</p>
                  <p className="text-xs text-muted-foreground">{dept.users} users</p>
                </div>
                <Badge variant="outline">{dept.queries} queries</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cost Metrics */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-chart-1" />
              Cost Metrics
            </CardTitle>
            <CardDescription>Operational costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cost per Query</span>
                <Badge variant="outline">${businessIntelligence?.cost_metrics.cost_per_query || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Cost</span>
                <Badge variant="secondary">${businessIntelligence?.cost_metrics.daily_operational_cost || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly Projection</span>
                <Badge variant="secondary">${businessIntelligence?.cost_metrics.monthly_projection || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Overview */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-warning" />
                Security Overview
              </CardTitle>
              <CardDescription>Security events and alerts</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/security">
                View details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">Failed Logins</span>
              </div>
              <p className="text-xl font-bold mt-1">{securityAlerts?.failed_logins || 0}</p>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Suspicious Activity</span>
              </div>
              <p className="text-xl font-bold mt-1">{securityAlerts?.suspicious_activity || 0}</p>
              <p className="text-xs text-muted-foreground">Needs review</p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-chart-3" />
                <span className="text-sm font-medium">Permission Denials</span>
              </div>
              <p className="text-xl font-bold mt-1">{securityAlerts?.permission_denials || 0}</p>
              <p className="text-xs text-muted-foreground">Access blocked</p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Active Sessions</span>
              </div>
              <p className="text-xl font-bold mt-1">{securityAlerts?.active_sessions || 0}</p>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
