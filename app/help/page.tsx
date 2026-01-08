"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  HelpCircle, 
  MessageSquare, 
  BookOpen, 
  Video,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Clock,
  Users,
  Zap,
  Shield
} from "lucide-react"

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Help", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "getting-started", name: "Getting Started", icon: <Zap className="w-4 h-4" /> },
    { id: "account", name: "Account & Billing", icon: <Users className="w-4 h-4" /> },
    { id: "features", name: "Features", icon: <BookOpen className="w-4 h-4" /> },
    { id: "technical", name: "Technical Support", icon: <Shield className="w-4 h-4" /> }
  ]

  const helpArticles = [
    {
      category: "getting-started",
      title: "How to create my first knowledge base",
      description: "Step-by-step guide to setting up your first knowledge base",
      views: "2.3k",
      helpful: "89%",
      readTime: "3 min"
    },
    {
      category: "getting-started",
      title: "Inviting team members to WikiAI",
      description: "Learn how to add and manage team members",
      views: "1.8k",
      helpful: "92%",
      readTime: "2 min"
    },
    {
      category: "account",
      title: "How to upgrade my subscription",
      description: "Upgrade your plan to unlock more features",
      views: "956",
      helpful: "87%",
      readTime: "4 min"
    },
    {
      category: "account",
      title: "Managing billing and invoices",
      description: "View, download, and manage your billing information",
      views: "742",
      helpful: "91%",
      readTime: "5 min"
    },
    {
      category: "features",
      title: "Using advanced search filters",
      description: "Master the search functionality with filters",
      views: "1.2k",
      helpful: "94%",
      readTime: "6 min"
    },
    {
      category: "features",
      title: "Setting up document permissions",
      description: "Control who can access and edit your documents",
      views: "892",
      helpful: "88%",
      readTime: "4 min"
    },
    {
      category: "technical",
      title: "Troubleshooting login issues",
      description: "Common login problems and their solutions",
      views: "1.5k",
      helpful: "90%",
      readTime: "3 min"
    },
    {
      category: "technical",
      title: "API connection troubleshooting",
      description: "Fix common API integration issues",
      views: "623",
      helpful: "85%",
      readTime: "8 min"
    }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const videoTutorials = [
    {
      title: "WikiAI Quick Start (5 min)",
      description: "Get started with WikiAI in just 5 minutes",
      duration: "5:23",
      thumbnail: "/api/placeholder/320/180"
    },
    {
      title: "Advanced Search Tutorial",
      description: "Learn advanced search techniques",
      duration: "12:45",
      thumbnail: "/api/placeholder/320/180"
    },
    {
      title: "Team Collaboration Guide",
      description: "Master team features and collaboration",
      duration: "8:15",
      thumbnail: "/api/placeholder/320/180"
    }
  ]

  const contactOptions = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      availability: "Available 24/7",
      action: "Start Chat",
      priority: "high"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 24 hours",
      action: "Send Email",
      priority: "medium"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      availability: "Mon-Fri, 9AM-6PM EST",
      action: "Call Now",
      priority: "medium"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Help Center</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            How Can We
            <span className="text-primary"> Help You?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Find answers, get support, and learn how to make the most of WikiAI.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => (
              <Card key={index} className={`border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${
                option.priority === "high" ? "ring-2 ring-primary/20" : ""
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{option.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{option.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">{option.availability}</p>
                  <Button className="w-full">{option.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories and Articles */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="lg:w-64">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.icon}
                        <span className="ml-2">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Articles */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {categories.find(c => c.id === selectedCategory)?.name || "All Articles"}
                </h2>
                <p className="text-muted-foreground">
                  {filteredArticles.length} articles found
                </p>
              </div>

              <div className="space-y-4">
                {filteredArticles.map((article, index) => (
                  <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground mb-3">{article.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {article.readTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {article.views} views
                            </div>
                            <div className="flex items-center gap-1">
                              <HelpCircle className="w-4 h-4" />
                              {article.helpful} helpful
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No articles found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="px-6 py-16 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Tutorials</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Watch step-by-step video guides to learn WikiAI features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-purple/20 rounded-t-lg flex items-center justify-center">
                    <Video className="w-12 h-12 text-primary/50" />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Topics</h2>
            <p className="text-muted-foreground text-lg">
              Quick access to the most requested help topics.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Account Setup",
              "Document Upload",
              "Search Tips",
              "Team Management",
              "Billing Questions",
              "API Integration",
              "Security Settings",
              "Data Export"
            ].map((topic, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <HelpCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium">{topic}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="px-6 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Our support team is here to help you succeed with WikiAI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Contact Support
              <MessageSquare className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Call
              <Phone className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
