"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { filesApi, queryApi, pluginsApi, catalogsApi } from "@/lib/api"
import { useWebSocket } from "@/lib/use-websocket"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  Settings,
  FileText,
  ExternalLink,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  X,
  Loader2,
  User,
  Sparkles,
  Bot,
  ShoppingCart,
  Eye,
  Globe,
  Wifi,
  Upload,
} from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"

// Enhanced File Viewer Component (reused from files page with search highlighting)
interface FileViewerProps {
  file: any
  token: string | null
  searchQuery?: string
  onClose: () => void
}

const FileViewer: React.FC<FileViewerProps> = ({ file, token, searchQuery, onClose }) => {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      if (!token) return
      
      try {
        const response = await filesApi.getContent(token, file.filename)
        if (response.status === "success") {
          setContent(response.response.content || "")
        }
      } catch (error) {
        toast.error("Failed to load file content")
      } finally {
        setLoading(false)
      }
    }

    if (file.filename && token) {
      loadContent()
    }
  }, [file.filename, token])

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  if (loading) {
    return (
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="max-w-4xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {file.filename}
        </DialogTitle>
        <DialogDescription>
          File content with search highlighting
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-96 w-full border rounded-md p-4">
        <div className="prose prose-sm max-w-none">
          {searchQuery ? highlightText(content, searchQuery) : content}
        </div>
      </ScrollArea>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default function AdminSearchPage() {
  const { token, user } = useAuth()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [searchSettings, setSearchSettings] = useState({
    useReranking: true,
    useHybridSearch: true,
    topK: 10,
    includeMetadata: true,
  })
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({})
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
  const [streamingResponse, setStreamingResponse] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedCatalog, setSelectedCatalog] = useState<string>("all")
  const [catalogs, setCatalogs] = useState<any[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // WebSocket connection for real-time streaming
  const { lastMessage, sendMessage } = useWebSocket({
    url: token ? `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:9001'}/ws/${token}` : undefined,
    token: token || undefined
  })

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data)
        if (data.type === "search_response") {
          setResults(data.results)
          setLoading(false)
        } else if (data.type === "streaming_response") {
          setStreamingResponse(prev => prev + data.content)
        } else if (data.type === "stream_complete") {
          setIsStreaming(false)
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error)
      }
    }
  }, [lastMessage])

  useEffect(() => {
    fetchCatalogs()
  }, [])

  const fetchCatalogs = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001'
      const response = await fetch(`${apiUrl}/catalogs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCatalogs(data.response.catalogs || [])
        }
      }
    } catch (error) {
      console.error("Failed to fetch catalogs:", error)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setResults([])
    setStreamingResponse("")
    setIsStreaming(true)

    try {
      const searchParams = {
        query,
        top_k: searchSettings.topK,
        use_reranking: searchSettings.useReranking,
        use_hybrid_search: searchSettings.useHybridSearch,
        include_metadata: searchSettings.includeMetadata,
        catalog_id: selectedCatalog !== "all" ? selectedCatalog : undefined,
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001'
      const response = await fetch(`${apiUrl}/query/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(searchParams),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setResults(data.response.results || [])
          if (data.response.response) {
            setStreamingResponse(data.response.response)
            setIsStreaming(false)
          }
        }
      }
    } catch (error) {
      toast.error("Search failed. Please try again.")
    } finally {
      setLoading(false)
      setIsStreaming(false)
    }
  }

  const handleFileUpload = async (files: File[]) => {
    if (!files.length) return

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001'}/files/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          toast.success(`Uploaded ${file.name}`)
        } else {
          toast.error(`Failed to upload ${file.name}`)
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
      }
    })

    await Promise.all(uploadPromises)
    setUploadedFiles([])
  }

  const handleFeedback = async (resultId: string, type: "up" | "down") => {
    setFeedback(prev => ({ ...prev, [resultId]: type }))
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001'
      const response = await fetch(`${apiUrl}/query/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          result_id: resultId,
          feedback: type
        }),
      })

      if (response.ok) {
        toast.success("Feedback sent")
      } else {
        toast.error("Failed to send feedback")
      }
    } catch (error) {
      toast.error("Failed to send feedback")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Admin" }, { label: "Search" }]} />
      <main className="flex-1 p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Admin Search</h1>
          <p className="text-muted-foreground">
            Search across all documents and test search functionality
          </p>
        </div>

        {/* Search Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  Search
                </Button>
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Search Settings</DialogTitle>
                      <DialogDescription>
                        Configure search parameters and options
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label htmlFor="reranking">Use Reranking</label>
                        <Switch
                          id="reranking"
                          checked={searchSettings.useReranking}
                          onCheckedChange={(checked) =>
                            setSearchSettings(prev => ({ ...prev, useReranking: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="hybrid">Hybrid Search</label>
                        <Switch
                          id="hybrid"
                          checked={searchSettings.useHybridSearch}
                          onCheckedChange={(checked) =>
                            setSearchSettings(prev => ({ ...prev, useHybridSearch: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="metadata">Include Metadata</label>
                        <Switch
                          id="metadata"
                          checked={searchSettings.includeMetadata}
                          onCheckedChange={(checked) =>
                            setSearchSettings(prev => ({ ...prev, includeMetadata: checked }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="topk">Top K Results</label>
                        <Input
                          id="topk"
                          type="number"
                          min="1"
                          max="50"
                          value={searchSettings.topK}
                          onChange={(e) =>
                            setSearchSettings(prev => ({ ...prev, topK: parseInt(e.target.value) }))
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setShowSettings(false)}>Save Settings</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* File Upload */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => setUploadedFiles(Array.from(e.target.files || []))}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                {uploadedFiles.length > 0 && (
                  <Button onClick={() => handleFileUpload(uploadedFiles)}>
                    Upload {uploadedFiles.length} file(s)
                  </Button>
                )}
              </div>

              {/* Catalog Selection */}
              {catalogs.length > 0 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="catalog">Catalog:</label>
                  <select
                    id="catalog"
                    value={selectedCatalog}
                    onChange={(e) => setSelectedCatalog(e.target.value)}
                    className="px-3 py-1 border rounded-md"
                  >
                    <option value="all">All Catalogs</option>
                    {catalogs.map((catalog) => (
                      <option key={catalog.id} value={catalog.id}>
                        {catalog.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Search Results */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Search Results</h2>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {results.map((result, index) => (
                  <Card key={result.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{result.filename}</h3>
                        <Badge variant="outline">
                          Score: {(result.score * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {result.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(result)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(result.id, "up")}
                          disabled={feedback[result.id] === "up"}
                        >
                          <ThumbsUp className={`h-4 w-4 ${feedback[result.id] === "up" ? "text-green-600" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(result.id, "down")}
                          disabled={feedback[result.id] === "down"}
                        >
                          <ThumbsDown className={`h-4 w-4 ${feedback[result.id] === "down" ? "text-red-600" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {results.length === 0 && !loading && (
                  <div className="text-center text-muted-foreground py-8">
                    No results found. Try a different search query.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* AI Response */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">AI Response</h2>
            <Card className="p-4">
              {isStreaming ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating response...</span>
                </div>
              ) : streamingResponse ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{streamingResponse}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  AI responses will appear here when available.
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* File Viewer Dialog */}
        {selectedFile && (
          <FileViewer
            file={selectedFile}
            token={token}
            searchQuery={query}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </main>
    </>
  )
}
