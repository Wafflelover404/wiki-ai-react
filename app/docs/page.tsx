"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  BookOpen, 
  Code, 
  Settings, 
  Users,
  Shield,
  Zap,
  MessageSquare,
  FileText,
  ChevronRight,
  ExternalLink,
  Star,
  Clock
} from "lucide-react"

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Documentation", icon: <BookOpen className="w-4 h-4" /> },
    { id: "getting-started", name: "Getting Started", icon: <Zap className="w-4 h-4" /> },
    { id: "api", name: "API Reference", icon: <Code className="w-4 h-4" /> },
    { id: "guides", name: "Guides", icon: <FileText className="w-4 h-4" /> },
    { id: "admin", name: "Admin", icon: <Settings className="w-4 h-4" /> },
    { id: "security", name: "Security", icon: <Shield className="w-4 h-4" /> }
  ]

  const documentation = [
    {
      category: "getting-started",
      title: "Quick Start Guide",
      description: "Get up and running with WikiAI in minutes",
      icon: <Zap className="w-5 h-5" />,
      readTime: "5 min",
      difficulty: "Beginner",
      link: "/docs/quick-start"
    },
    {
      category: "getting-started",
      title: "Understanding the Dashboard",
      description: "Learn your way around the WikiAI interface",
      icon: <BookOpen className="w-5 h-5" />,
      readTime: "8 min",
      difficulty: "Beginner",
      link: "/docs/dashboard"
    },
    {
      category: "api",
      title: "Authentication API",
      description: "Secure user authentication and authorization",
      icon: <Shield className="w-5 h-5" />,
      readTime: "10 min",
      difficulty: "Intermediate",
      link: "/docs/api/auth"
    },
    {
      category: "api",
      title: "Search API Reference",
      description: "Integrate powerful search capabilities",
      icon: <Search className="w-5 h-5" />,
      readTime: "15 min",
      difficulty: "Intermediate",
      link: "/docs/api/search"
    },
    {
      category: "api",
      title: "Document Management API",
      description: "Upload, organize, and manage documents",
      icon: <FileText className="w-5 h-5" />,
      readTime: "12 min",
      difficulty: "Intermediate",
      link: "/docs/api/documents"
    },
    {
      category: "guides",
      title: "Advanced Search Techniques",
      description: "Master semantic search and filters",
      icon: <Search className="w-5 h-5" />,
      readTime: "20 min",
      difficulty: "Advanced",
      link: "/docs/guides/advanced-search"
    },
    {
      category: "guides",
      title: "Setting Up Teams",
      description: "Collaborate effectively with team features",
      icon: <Users className="w-5 h-5" />,
      readTime: "15 min",
      difficulty: "Intermediate",
      link: "/docs/guides/teams"
    },
    {
      category: "admin",
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <Users className="w-5 h-5" />,
      readTime: "18 min",
      difficulty: "Advanced",
      link: "/docs/admin/users"
    },
    {
      category: "admin",
      title: "System Configuration",
      description: "Configure WikiAI for your organization",
      icon: <Settings className="w-5 h-5" />,
      readTime: "25 min",
      difficulty: "Advanced",
      link: "/docs/admin/configuration"
    },
    {
      category: "security",
      title: "Security Overview",
      description: "Understanding WikiAI's security features",
      icon: <Shield className="w-5 h-5" />,
      readTime: "12 min",
      difficulty: "Intermediate",
      link: "/docs/security/overview"
    },
    {
      category: "security",
      title: "Compliance & Auditing",
      description: "Meet regulatory requirements",
      icon: <FileText className="w-5 h-5" />,
      readTime: "20 min",
      difficulty: "Advanced",
      link: "/docs/security/compliance"
    }
  ]

  const filteredDocs = documentation.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Documentation</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Everything You Need to
            <span className="text-primary"> Succeed</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive guides, API references, and tutorials to help you make the most of WikiAI.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <div className="text-primary">{doc.icon}</div>
                    </div>
                    <Badge className={getDifficultyColor(doc.difficulty)}>
                      {doc.difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {doc.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {doc.readTime}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doc.category.replace("-", " ")}
                    </Badge>
                  </div>
                  
                  <Button variant="ghost" className="p-0 h-auto font-normal text-sm">
                    Read documentation
                    <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredDocs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No documentation found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-6 py-16 border-y">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "API Reference", description: "Complete API documentation", icon: <Code className="w-5 h-5" />, link: "/docs/api" },
              { title: "SDKs & Libraries", description: "Official SDKs for popular languages", icon: <BookOpen className="w-5 h-5" />, link: "/docs/sdks" },
              { title: "Changelog", description: "Latest updates and releases", icon: <FileText className="w-5 h-5" />, link: "/docs/changelog" },
              { title: "Community", description: "Join our developer community", icon: <Users className="w-5 h-5" />, link: "/community" }
            ].map((link, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <div className="text-primary">{link.icon}</div>
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{link.description}</p>
                  <Button variant="ghost" className="p-0 h-auto font-normal text-sm">
                    Learn more
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community & Support */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our community and support team are here to help you succeed with WikiAI.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Community Forum</h3>
                    <p className="text-sm text-muted-foreground">Get help from other WikiAI users</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Discord Server</h3>
                    <p className="text-sm text-muted-foreground">Real-time chat with the community</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Support Team</h3>
                    <p className="text-sm text-muted-foreground">Get help from our expert team</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Popular Resources</h3>
                <div className="space-y-3">
                  {[
                    "Getting Started Tutorial",
                    "API Authentication Guide",
                    "Best Practices for Search",
                    "Troubleshooting Common Issues",
                    "Migration Guide"
                  ].map((resource, index) => (
                    <Link key={index} href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm">{resource}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
