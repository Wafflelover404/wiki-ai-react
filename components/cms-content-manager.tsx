"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Plus, Edit, Trash, Eye, Save, X, 
  FileText, Users, MessageSquare, TrendingUp,
  Search, Filter, RefreshCw, Building
} from "lucide-react"
import CMSOrganizations from "./cms-organizations"

interface CMSContentManagerProps {
  token: string
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  author: string
  category: string
  featured: boolean
  tags: string[]
  image_url?: string
  read_time?: string
  status: string
  views: number
  created_at: string
  updated_at: string
}

interface ContactSubmission {
  id: number
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  inquiry_type: string
  status: string
  priority: string
  created_at: string
}

interface SalesLead {
  id: number
  name: string
  email: string
  company?: string
  phone?: string
  source: string
  status: string
  score: number
  created_at: string
}

export default function CMSContentManager({ token }: CMSContentManagerProps) {
  const [activeTab, setActiveTab] = useState("blog")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Blog state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  
  // Contact state
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  
  // Sales state
  const [salesLeads, setSalesLeads] = useState<SalesLead[]>([])

  const API_BASE = "http://127.0.0.1:8000"

  // Fetch data
  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/cms/blog/posts`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const posts = await response.json()
        setBlogPosts(posts)
      }
    } catch (err) {
      setError("Failed to fetch blog posts")
    }
  }

  const fetchContactSubmissions = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/contact/submissions`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const submissions = await response.json()
        setContactSubmissions(submissions)
      }
    } catch (err) {
      setError("Failed to fetch contact submissions")
    }
  }

  const fetchSalesLeads = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/sales/leads`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const leads = await response.json()
        setSalesLeads(leads)
      }
    } catch (err) {
      setError("Failed to fetch sales leads")
    }
  }

  // Blog operations
  const createBlogPost = async (postData: Partial<BlogPost>) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/cms/blog/posts`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      })
      
      if (response.ok) {
        await fetchBlogPosts()
        setIsCreatingPost(false)
        setEditingPost(null)
      } else {
        setError("Failed to create blog post")
      }
    } catch (err) {
      setError("Failed to create blog post")
    } finally {
      setLoading(false)
    }
  }

  const updateBlogPost = async (id: number, postData: Partial<BlogPost>) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/cms/blog/posts/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      })
      
      if (response.ok) {
        await fetchBlogPosts()
        setEditingPost(null)
      } else {
        setError("Failed to update blog post")
      }
    } catch (err) {
      setError("Failed to update blog post")
    } finally {
      setLoading(false)
    }
  }

  const deleteBlogPost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return
    
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/cms/blog/posts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      if (response.ok) {
        await fetchBlogPosts()
      } else {
        setError("Failed to delete blog post")
      }
    } catch (err) {
      setError("Failed to delete blog post")
    } finally {
      setLoading(false)
    }
  }

  // Load data on tab change
  useEffect(() => {
    if (activeTab === "blog") {
      fetchBlogPosts()
    } else if (activeTab === "contacts") {
      fetchContactSubmissions()
    } else if (activeTab === "sales") {
      fetchSalesLeads()
    }
  }, [activeTab])

  const BlogPostForm = ({ post, onSave, onCancel }: { 
    post?: BlogPost, 
    onSave: (data: Partial<BlogPost>) => void,
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState({
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      author: post?.author || "",
      category: post?.category || "",
      featured: post?.featured || false,
      status: post?.status || "draft",
      tags: post?.tags?.join(", ") || ""
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const data = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      }
      onSave(data)
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{post ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <Input
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={10}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI & ML">AI & ML</SelectItem>
                    <SelectItem value="Product Updates">Product Updates</SelectItem>
                    <SelectItem value="Tutorials">Tutorials</SelectItem>
                    <SelectItem value="Company News">Company News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="AI, Machine Learning, Tutorial"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                  />
                  <label className="text-sm font-medium">Featured</label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="blog">
            <FileText className="w-4 h-4 mr-2" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="organizations">
            <Building className="w-4 h-4 mr-2" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Submissions
          </TabsTrigger>
          <TabsTrigger value="sales">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sales Leads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Blog Posts</h2>
            <Button onClick={() => setIsCreatingPost(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>

          {(isCreatingPost || editingPost) && (
            <BlogPostForm
              post={editingPost || undefined}
              onSave={(data) => {
                if (editingPost) {
                  updateBlogPost(editingPost.id, data)
                } else {
                  createBlogPost(data)
                }
              }}
              onCancel={() => {
                setIsCreatingPost(false)
                setEditingPost(null)
              }}
            />
          )}

          <div className="grid gap-4">
            {blogPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status}
                        </Badge>
                        {post.featured && <Badge variant="outline">Featured</Badge>}
                      </div>
                      <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                      <div className="text-sm text-muted-foreground">
                        <span>By {post.author}</span> • <span>{post.category}</span> • <span>{post.views} views</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingPost(post)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteBlogPost(post.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Contact Submissions</h2>
            <Button variant="outline" onClick={fetchContactSubmissions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {contactSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{submission.name}</h3>
                        <Badge variant="outline">{submission.inquiry_type}</Badge>
                        <Badge variant={submission.status === "new" ? "default" : "secondary"}>
                          {submission.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{submission.message}</p>
                      <div className="text-sm text-muted-foreground">
                        <span>{submission.email}</span>
                        {submission.company && <span> • {submission.company}</span>}
                        {submission.phone && <span> • {submission.phone}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Sales Leads</h2>
            <Button variant="outline" onClick={fetchSalesLeads}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {salesLeads.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{lead.name}</h3>
                        <Badge variant="outline">{lead.source}</Badge>
                        <Badge variant={lead.status === "new" ? "default" : "secondary"}>
                          {lead.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>{lead.email}</span>
                        {lead.company && <span> • {lead.company}</span>}
                        {lead.phone && <span> • {lead.phone}</span>}
                        <span> • Score: {lead.score}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <CMSOrganizations token={token} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
