"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  BookOpen
} from "lucide-react"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Posts", icon: <BookOpen className="w-4 h-4" /> },
    { id: "ai", name: "AI & ML", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "product", name: "Product Updates", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "tutorials", name: "Tutorials", icon: <MessageSquare className="w-4 h-4" /> }
  ]

  const posts = [
    {
      id: 1,
      title: "The Future of AI-Powered Knowledge Management",
      excerpt: "Explore how artificial intelligence is revolutionizing the way organizations manage and access their collective knowledge.",
      author: "Sarah Chen",
      date: "2024-12-15",
      readTime: "8 min read",
      category: "ai",
      image: "/api/placeholder/600/400",
      featured: true,
      tags: ["AI", "Knowledge Management", "Innovation"]
    },
    {
      id: 2,
      title: "New Feature: Real-time Collaboration is Here",
      excerpt: "We're excited to announce our latest feature that enables teams to collaborate on knowledge bases in real-time.",
      author: "Marcus Johnson",
      date: "2024-12-10",
      readTime: "5 min read",
      category: "product",
      image: "/api/placeholder/600/400",
      featured: false,
      tags: ["Product", "Collaboration", "Features"]
    },
    {
      id: 3,
      title: "Getting Started with Advanced Search Filters",
      excerpt: "Learn how to use our powerful search filters to find exactly what you need in seconds.",
      author: "Emily Rodriguez",
      date: "2024-12-05",
      readTime: "6 min read",
      category: "tutorials",
      image: "/api/placeholder/600/400",
      featured: false,
      tags: ["Tutorial", "Search", "Tips"]
    },
    {
      id: 4,
      title: "How AI is Transforming Enterprise Knowledge Sharing",
      excerpt: "Discover the impact of artificial intelligence on enterprise knowledge sharing and collaboration.",
      author: "Sarah Chen",
      date: "2024-11-28",
      readTime: "10 min read",
      category: "ai",
      image: "/api/placeholder/600/400",
      featured: true,
      tags: ["AI", "Enterprise", "Knowledge Sharing"]
    },
    {
      id: 5,
      title: "Best Practices for Organizing Your Knowledge Base",
      excerpt: "Essential tips and strategies for creating an organized and efficient knowledge base that your team will love.",
      author: "Emily Rodriguez",
      date: "2024-11-20",
      readTime: "7 min read",
      category: "tutorials",
      image: "/api/placeholder/600/400",
      featured: false,
      tags: ["Best Practices", "Organization", "Tips"]
    },
    {
      id: 6,
      title: "Security First: How We Protect Your Data",
      excerpt: "A deep dive into our security measures and compliance standards that keep your knowledge safe.",
      author: "Marcus Johnson",
      date: "2024-11-15",
      readTime: "9 min read",
      category: "product",
      image: "/api/placeholder/600/400",
      featured: false,
      tags: ["Security", "Compliance", "Privacy"]
    }
  ]

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPosts = posts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">WikiAI Blog</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Insights, Updates, and
            <span className="text-primary"> Best Practices</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay up to date with the latest in AI-powered knowledge management, 
            product updates, and expert tips from our team.
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
                placeholder="Search posts..."
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

      {/* Featured Posts */}
      {selectedCategory === "all" && !searchTerm && featuredPosts.length > 0 && (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Featured Posts</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple/20 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-primary/50" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">Featured</Badge>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" className="p-0 h-auto font-normal">
                        Read more
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">
            {selectedCategory !== "all" ? `${categories.find(c => c.id === selectedCategory)?.name}` : "Recent Posts"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple/10 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary/30" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-3">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    <Button variant="ghost" className="p-0 h-auto font-normal text-sm">
                      Read more
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Get the latest posts and updates delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="flex-1" />
            <Button>Subscribe</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  )
}
