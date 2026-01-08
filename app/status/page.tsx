"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  Activity,
  Server,
  Database,
  Wifi,
  Shield,
  Zap,
  RefreshCw,
  ExternalLink
} from "lucide-react"

interface ServiceStatus {
  name: string
  status: "operational" | "degraded" | "down" | "maintenance"
  description: string
  lastChecked: string
  uptime: number
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "API Services",
      status: "operational",
      description: "Core API endpoints and authentication",
      lastChecked: "2 minutes ago",
      uptime: 99.9
    },
    {
      name: "Database",
      status: "operational",
      description: "Primary and replica database clusters",
      lastChecked: "1 minute ago",
      uptime: 99.95
    },
    {
      name: "Search Engine",
      status: "operational",
      description: "Semantic search and indexing services",
      lastChecked: "30 seconds ago",
      uptime: 99.8
    },
    {
      name: "AI Processing",
      status: "operational",
      description: "AI model inference and processing",
      lastChecked: "1 minute ago",
      uptime: 99.7
    },
    {
      name: "File Storage",
      status: "operational",
      description: "Document upload and storage services",
      lastChecked: "2 minutes ago",
      uptime: 99.9
    },
    {
      name: "Authentication",
      status: "operational",
      description: "User authentication and authorization",
      lastChecked: "30 seconds ago",
      uptime: 99.99
    }
  ])

  const [incidents, setIncidents] = useState([
    {
      id: 1,
      title: "Scheduled Maintenance - Database Optimization",
      status: "resolved",
      severity: "maintenance",
      startTime: "2024-12-10 02:00 UTC",
      endTime: "2024-12-10 04:00 UTC",
      description: "We performed scheduled maintenance to optimize database performance."
    },
    {
      id: 2,
      title: "Minor Search Performance Degradation",
      status: "resolved",
      severity: "minor",
      startTime: "2024-12-08 14:30 UTC",
      endTime: "2024-12-08 15:45 UTC",
      description: "Some users experienced slower search responses. Issue has been resolved."
    }
  ])

  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
      // Simulate real-time updates
      setServices(prev => prev.map(service => ({
        ...service,
        lastChecked: "Just now"
      })))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdated(new Date())
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "maintenance":
        return <Clock className="w-5 h-5 text-blue-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "degraded":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "down":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "maintenance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "major":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "minor":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "maintenance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const overallStatus = services.every(s => s.status === "operational") ? "operational" : 
                       services.some(s => s.status === "down") ? "down" : "degraded"

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">System Status</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              All Systems
              <span className={`ml-3 ${overallStatus === "operational" ? "text-green-500" : "text-yellow-500"}`}>
                {overallStatus === "operational" ? "Operational" : "Degraded"}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Real-time status of all WikiAI services and infrastructure.
            </p>
          </div>

          {/* Overall Status Card */}
          <Card className="border-0 shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                {getStatusIcon(overallStatus)}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {overallStatus === "operational" ? "All Systems Operational" : "Some Systems Degraded"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {overallStatus === "operational" 
                  ? "All services are functioning normally."
                  : "Some services may be experiencing issues."
                }
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-0 h-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Status */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Service Status</h2>
          <div className="grid gap-4">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {service.name.includes("API") && <Zap className="w-6 h-6 text-primary" />}
                        {service.name.includes("Database") && <Database className="w-6 h-6 text-primary" />}
                        {service.name.includes("Search") && <Activity className="w-6 h-6 text-primary" />}
                        {service.name.includes("AI") && <Shield className="w-6 h-6 text-primary" />}
                        {service.name.includes("Storage") && <Server className="w-6 h-6 text-primary" />}
                        {service.name.includes("Authentication") && <Shield className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(service.status)}
                        <Badge className={getStatusColor(service.status)}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {service.uptime}% uptime
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Checked {service.lastChecked}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="px-6 py-16 border-y">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Recent Incidents</h2>
          {incidents.length > 0 ? (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Card key={incident.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold mb-2">{incident.title}</h3>
                        <p className="text-muted-foreground">{incident.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Start: {new Date(incident.startTime).toLocaleString()}</div>
                      <div>End: {new Date(incident.endTime).toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Recent Incidents</h3>
                <p className="text-muted-foreground">All services have been running smoothly.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Uptime Metrics */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Uptime Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { period: "Last 24 hours", uptime: "100%" },
              { period: "Last 7 days", uptime: "99.9%" },
              { period: "Last 30 days", uptime: "99.8%" },
              { period: "Last 90 days", uptime: "99.7%" }
            ].map((metric, index) => (
              <Card key={index} className="border-0 shadow-sm text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary mb-2">{metric.uptime}</div>
                  <div className="text-sm text-muted-foreground">{metric.period}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="px-6 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Subscribe to status updates and get notified about incidents and maintenance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-md bg-background"
            />
            <Button>Subscribe</Button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              RSS Feed
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              API Status
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
