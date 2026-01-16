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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
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
  Brain,
  Copy,
} from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"

// Enhanced File Viewer Component (reused from files page with search highlighting)
function FileViewerModal({ isOpen, onClose, document, searchChunk }: { isOpen: boolean; onClose: () => void; document: any; searchChunk?: string }) {
  const [fileContent, setFileContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    if (isOpen && document.title && token) {
      fetchFullContent()
    }
  }, [isOpen, document.title, token])

  const fetchFullContent = async () => {
    setIsLoading(true)
    try {
      // The search results show clean names (without temp_), but files in backend still have temp_ prefix
      // Try both clean name and temp_ prefixed name
      let result
      
      try {
        // First try with clean name
        result = await filesApi.getContent(token!, document.title)
      } catch (error) {
        // If that fails, try with temp_ prefix
        const tempFileName = `temp_${document.title}`
        result = await filesApi.getContent(token!, tempFileName)
      }
      
      if (result.status === 'success' && result.response) {
        let content = ''
        
        if (result.response.content) {
          if (result.response.content.startsWith('data:') || result.response.content.includes('base64')) {
            const base64Content = result.response.content.split(',')[1] || result.response.content
            content = atob(base64Content)
          } else {
            content = result.response.content
          }
        }
        
        setFileContent(content)
      } else {
        console.error('API returned error:', result)
        setFileContent('Content not available')
      }
    } catch (error) {
      console.error('Error fetching file content:', error)
      setFileContent('Error loading content')
    } finally {
      setIsLoading(false)
    }
  }

  const highlightSearchChunk = (content: string, chunk?: string) => {
    if (!chunk) return content
    
    const regex = new RegExp(`(${chunk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return content.replace(regex, '<mark>$1</mark>')
  }

  const getFileExtension = (filename: string) => {
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
  }

  if (!isOpen) return null

  const fileExt = getFileExtension(document.title)
  const isPdf = fileExt === 'pdf'
  const isWord = fileExt === 'doc' || fileExt === 'docx'
  const highlightedContent = searchChunk ? highlightSearchChunk(fileContent, searchChunk) : fileContent

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5" />
            <span className="truncate">{document.title}</span>
          </DialogTitle>
          <DialogDescription>Document preview with search highlighting</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-[500px] max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading document...</p>
              </div>
            </div>
          ) : (
            <div className="h-full">
              {isPdf ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">PDF preview not available in search results</p>
                  <p className="text-sm text-muted-foreground mt-2">Please open this file from the Files page for full viewing</p>
                </div>
              ) : isWord ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Word document preview not available in search results</p>
                  <p className="text-sm text-muted-foreground mt-2">Please open this file from the Files page for full viewing</p>
                </div>
              ) : (
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  {searchChunk ? (
                    <div 
                      className="text-sm font-mono whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: highlightedContent }}
                    />
                  ) : (
                    <pre className="text-sm font-mono whitespace-pre-wrap break-words">{fileContent}</pre>
                  )}
                </ScrollArea>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface Message {
  id: string
  role: "user" | "assistant" | "sources" | "overview"
  content: string
  sources?: string[]
  searchResults?: any[]
  timestamp: Date
}

interface Catalog {
  catalog_id: string
  shop_name: string
  total_products: number
}

export default function SearchPage() {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const [feedbackMessage, setFeedbackMessage] = useState<Message | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null)
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Settings states
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchType, setSearchType] = useState<'all' | 'documents' | 'opencart'>('all')
  const [enabledPlugins, setEnabledPlugins] = useState({
    documents: true,
    opencart: false,
  })
  const [loadingPlugins, setLoadingPlugins] = useState(false)
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [loadingCatalogs, setLoadingCatalogs] = useState(false)
  const [selectedCatalogs, setSelectedCatalogs] = useState<string[]>([])
  const [showAiOverview, setShowAiOverview] = useState(true)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    loadSettings()
    loadPluginStatus()
  }, [])

  const loadSettings = () => {
    const saved = localStorage.getItem('searchSettings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        setSearchType(settings.searchType || 'all')
        setShowAiOverview(settings.showAiOverview !== false)
        setSelectedCatalogs(settings.selectedCatalogs || [])
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }

  const saveSettings = () => {
    const settings = {
      searchType,
      showAiOverview,
      selectedCatalogs
    }
    localStorage.setItem('searchSettings', JSON.stringify(settings))
  }

  const loadPluginStatus = async () => {
    if (!token) return
    
    setLoadingPlugins(true)
    try {
      const result = await pluginsApi.status(token)
      if (result.status === 'success' && result.response) {
        setEnabledPlugins({
          documents: true,
          opencart: result.response.enabled || false,
        })
      }
    } catch (error) {
      console.error('Failed to load plugin status:', error)
    } finally {
      setLoadingPlugins(false)
    }
  }

  const loadCatalogs = async () => {
    if (!token) return
    
    setLoadingCatalogs(true)
    try {
      const result = await catalogsApi.list(token)
      if (result.status === 'success' && result.response) {
        setCatalogs(result.response.catalogs || [])
        if (selectedCatalogs.length === 0) {
          setSelectedCatalogs(result.response.catalogs?.map((c: Catalog) => c.catalog_id) || [])
        }
      }
    } catch (error) {
      console.error('Failed to load catalogs:', error)
    } finally {
      setLoadingCatalogs(false)
    }
  }

  // Handle document click to open/view content
  const handleDocumentClick = async (result: any) => {
    if (!token) return
    
    try {
      if (result.type === 'document') {
        // Open document viewer modal
        setSelectedDocument(result)
        setIsDocumentViewerOpen(true)
      } else if (result.type === 'product' && result.url) {
        // For products, open in new tab
        window.open(result.url, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error('Error opening document:', error)
      toast.error('Failed to open document')
    }
  }

  const handleSearchUpdate = (data: any) => {
    console.log('Search update received:', data)
    
    // Handle immediate search results (sources/snippets)
    if (data.type === 'immediate') {
      // Remove the "Searching..." message
      setMessages(prev => prev.filter(msg => msg.content !== "Searching across your Knowledge Base..."))
      
      const sourcesMessage: Message = {
        id: crypto.randomUUID(),
        role: "sources",
        content: `Found ${data.files?.length || 0} relevant sources:`,
        sources: data.files || [],
        searchResults: data.snippets?.map((snippet: any, index: number) => ({
          id: `doc-${index}`,
          type: 'document',
          title: snippet.source || `Document ${index + 1}`,
          content: snippet.content ? snippet.content.substring(0, 200) + '...' : 'No content available',
          source: 'document'
        })) || [],
        timestamp: new Date(Date.now()),
      }
      setMessages(prev => [...prev, sourcesMessage])
      
      // Add "Generating AI overview" message if overview is expected
      if (showAiOverview) {
        const overviewLoadingMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Generating AI overview...",
          timestamp: new Date(Date.now()),
        }
        setMessages(prev => [...prev, overviewLoadingMessage])
      }
    }
    
    // Handle AI overview when ready
    if (data.type === 'overview') {
      // Remove the "Generating..." message and add the actual overview
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.content !== "Generating AI overview...")
        return [...filtered, {
          id: crypto.randomUUID(),
          role: "overview",
          content: data.content || "",
          timestamp: new Date(Date.now()),
        }]
      })
    }
  }

  const handleQueryStatus = (data: any) => {
    console.log('Query status update:', data)
    // Update loading states or show progress
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !token || isLoading) return

    console.log('Starting search for:', input.trim())
    console.log('User:', user?.username, 'Session:', sessionId)

    try {
      // Use WebSocket for real-time search (like Vue implementation)
      if (typeof WebSocket !== 'undefined') {
        await performWebSocketQuery(input.trim())
      } else {
        // Fallback to HTTP
        await performHttpQuery(input.trim())
      }
    } catch (error) {
      console.error("Query error:", error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error while searching. Please try again.",
        timestamp: new Date(Date.now()),
      }
      setMessages((prev) => [...prev, errorMessage])
      setInput("")
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const performWebSocketQuery = async (query: string) => {
    return new Promise((resolve, reject) => {
      try {
        // Convert HTTP(S) URL to WS(S) URL (same as Vue)
        // Backend runs on port 9001, frontend on 3000
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${wsProtocol}//localhost:9001/ws/query?token=${encodeURIComponent(token || '')}`
        
        console.log('Connecting to WebSocket:', wsUrl)
        
        const ws = new WebSocket(wsUrl)
        let hasError = false
        let connectionTimeout: NodeJS.Timeout
        let immediateReceived = false
        let overviewReceived = false
        
        // Set connection timeout
        connectionTimeout = setTimeout(() => {
          if (!hasError && ws.readyState === WebSocket.CONNECTING) {
            hasError = true
            ws.close()
            reject(new Error('WebSocket connection timeout'))
          }
        }, 5000) // 5 second timeout
        
        ws.onopen = () => {
          clearTimeout(connectionTimeout)
          console.log('WebSocket connected, sending query')
          
          // Send query immediately (same format as Vue)
          ws.send(JSON.stringify({
            question: query,
            session_id: sessionId,
            model: null,
            humanize: true
          }))
        }
        
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log('WebSocket message received:', message)
            
            switch (message.type) {
              case 'status':
                // Processing status update (same as Vue)
                console.log('Status:', message.message)
                break
                
              case 'immediate':
                // Show search results immediately (same as Vue)
                immediateReceived = true
                setIsLoading(false) // Stop showing the loading indicator
                
                if (message.data && message.data.snippets) {
                  const sourcesMessage: Message = {
                    id: crypto.randomUUID(),
                    role: "sources",
                    content: `Found ${message.data.snippets.length} relevant sources:`,
                    sources: message.data.files || [],
                    searchResults: message.data.snippets.map((snippet: any, index: number) => ({
                      id: `doc-${index}`,
                      type: 'document',
                      title: snippet.source || `Document ${index + 1}`,
                      content: snippet.content ? snippet.content.substring(0, 200) + '...' : 'No content available',
                      source: 'document'
                    })),
                    timestamp: new Date(Date.now()),
                  }
                  setMessages(prev => [...prev, sourcesMessage])
                  
                  // Add "Generating AI overview" message if overview is expected
                  if (showAiOverview) {
                    const overviewLoadingMessage: Message = {
                      id: crypto.randomUUID(),
                      role: "assistant",
                      content: "Generating AI overview...",
                      timestamp: new Date(Date.now()),
                    }
                    setMessages(prev => [...prev, overviewLoadingMessage])
                  }
                }
                break
                
              case 'overview':
                // Replace "Generating..." with actual overview (same as Vue)
                overviewReceived = true
                setIsLoading(false) // Ensure loading is stopped
                setMessages(prev => {
                  const filtered = prev.filter(msg => msg.content !== "Generating AI overview...")
                  return [...filtered, {
                    id: crypto.randomUUID(),
                    role: "overview",
                    content: message.data || "",
                    timestamp: new Date(Date.now()),
                  }]
                })
                break
                
              case 'chunks':
                // Handle raw chunks (for non-humanized queries, same as Vue)
                console.log('Received chunks:', message.data)
                break
                
              case 'complete':
                // Query completed (same as Vue)
                console.log('Query completed')
                ws.close()
                resolve(message.data)
                break
                
              case 'error':
                hasError = true
                console.error('WebSocket error from server:', message.message)
                reject(new Error(message.message || 'WebSocket query error'))
                ws.close()
                break
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }
        
        ws.onerror = (error) => {
          clearTimeout(connectionTimeout)
          console.error('WebSocket error:', error)
          if (!hasError) {
            hasError = true
            reject(new Error('WebSocket connection error'))
          }
        }
        
        ws.onclose = (event) => {
          clearTimeout(connectionTimeout)
          console.log('WebSocket closed:', event.code, event.reason)
          if (!hasError && event.code !== 1000) {
            hasError = true
            reject(new Error(`WebSocket closed: ${event.reason || 'Unknown reason'} (code: ${event.code})`))
          }
        }
        
      } catch (error) {
        reject(error)
      }
    })
  }

  const performHttpQuery = async (query: string) => {
    if (!token) {
      throw new Error('No token available')
    }
    
    // Fallback HTTP implementation
    const result = await queryApi.query(token, query, {
      humanize: true,
    })
    
    // Process and display results (existing logic)
    if (result.status === 'success' && result.response) {
      const immediateData = result.response.immediate
      const snippets = immediateData?.snippets || []
      const files = immediateData?.files || []
      const aiAnswer = result.response.overview || ""
      
      if (snippets.length > 0) {
        const sourcesMessage: Message = {
          id: crypto.randomUUID(),
          role: "sources",
          content: `Found ${files.length} relevant sources:`,
          sources: files,
          searchResults: snippets.map((snippet: any, index: number) => ({
            id: `doc-${index}`,
            type: 'document',
            title: snippet.source || `Document ${index + 1}`,
            content: snippet.content ? snippet.content.substring(0, 200) + '...' : 'No content available',
            source: 'document'
          })),
          timestamp: new Date(Date.now()),
        }
        setMessages(prev => [...prev, sourcesMessage])
      }
      
      if (showAiOverview && aiAnswer) {
        const overviewMessage: Message = {
          id: crypto.randomUUID(),
          role: "overview",
          content: aiAnswer,
          timestamp: new Date(Date.now()),
        }
        setMessages(prev => [...prev, overviewMessage])
      }
    }
  }

  const handleFeedback = async () => {
    if (!token || !feedbackMessage || !feedbackText.trim()) return

    try {
      // Note: This would need to be adapted to the new API structure
      toast.success("Feedback submitted successfully")
      setIsFeedbackOpen(false)
      setFeedbackText("")
      setFeedbackMessage(null)
    } catch (error) {
      console.error("Feedback error:", error)
      toast.error("Failed to submit feedback")
    }
  }

  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`
    }
    if (typeof price === 'string' && !isNaN(parseFloat(price))) {
      return `$${parseFloat(price).toFixed(2)}`
    }
    return '$0.00'
  }

  const suggestedQuestions = [
    "What products do we have in stock?",
    "How do I configure the system settings?",
    "What are the main features of the platform?",
    "Show me recent order statistics",
  ]

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Search" }]} />
      <main className="flex-1 p-4 md:p-6">
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-100px)]">
          {/* Main Search Area - 70% initially */}
          <ResizablePanel defaultSize={70} minSize={40}>
            <div className="p-2 h-full overflow-hidden">
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Search Your Knowledge Base</h2>
                      <p className="text-muted-foreground mb-8">
                        Ask questions about your documents and get AI-powered answers with source references.
                      </p>

                      <div className="grid gap-3 w-full max-w-lg">
                        <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
                        {suggestedQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start h-auto py-3 px-4 text-left bg-transparent"
                            onClick={() => setInput(question)}
                          >
                            <MessageSquare className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span className="truncate">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message, index) => (
                        <div key={message.id} className="flex gap-4">
                          {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                          
                          {(message.role === "assistant" || message.role === "sources" || message.role === "overview") && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {message.role === "sources" && <FileText className="w-4 h-4 text-blue-600" />}
                              {message.role === "overview" && <Sparkles className="w-4 h-4 text-purple-600" />}
                              {message.role === "assistant" && <Bot className="w-4 h-4 text-primary" />}
                            </div>
                          )}
                          
                          <div className="flex-1 space-y-4">
                            {/* Sources Message */}
                            {message.role === "sources" && (
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  <span className="font-medium text-blue-900 dark:text-blue-100">Sources</span>
                                </div>
                                
                                {message.searchResults && message.searchResults.length > 0 && (
                                  <div className="space-y-3">
                                    {message.searchResults.map((result: any, resultIndex: number) => (
                                      <div 
                                        key={result.id} 
                                        className="border rounded-lg p-3 bg-background hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => handleDocumentClick(result)}
                                      >
                                        <div className="flex items-start justify-between mb-2">
                                          <h4 className="font-medium text-sm flex items-center gap-2">
                                            {result.type === 'document' && <FileText className="w-4 h-4 text-blue-500" />}
                                            {result.type === 'product' && <ShoppingCart className="w-4 h-4 text-green-500" />}
                                            {result.url ? (
                                              <a 
                                                href={result.url} 
                                                target="_blank" 
                                                rel="noopener"
                                                className="text-blue-600 hover:underline flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                {result.title}
                                                <ExternalLink className="w-3 h-3" />
                                              </a>
                                            ) : (
                                              <span className="flex items-center gap-2">
                                                {result.title}
                                                <Badge variant="secondary" className="text-xs">
                                                  {result.type}
                                                </Badge>
                                              </span>
                                            )}
                                          </h4>
                                          {result.type === 'document' && (
                                            <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                          )}
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                                          {result.content}
                                        </p>
                                        
                                        {result.price && (
                                          <div className="flex items-center gap-2 mb-2">
                                            {result.special_price ? (
                                              <>
                                                <span className="text-sm font-semibold text-green-600">
                                                  {formatPrice(result.special_price)}
                                                </span>
                                                <span className="text-xs text-muted-foreground line-through">
                                                  {formatPrice(result.price)}
                                                </span>
                                              </>
                                            ) : (
                                              <span className="text-sm font-semibold">
                                                {formatPrice(result.price)}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                        
                                        {result.shop_name && (
                                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            Shop: {result.shop_name}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {message.sources && message.sources.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                                    <p className="text-xs font-medium mb-2 text-blue-700 dark:text-blue-300">All Sources:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {message.sources.map((source: string, sourceIndex: number) => (
                                        <Badge key={sourceIndex} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                          {source}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Overview Message Moved to AI Response Sidebar */}
                            {/* {message.role === "overview" && (
                              <div className="max-w-2xl mx-auto">
                                <div className="flex items-center gap-2 mb-3">
                                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                  <span className="font-medium text-purple-900 dark:text-purple-100">AI Overview</span>
                                </div>
                                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground">
                                  <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                              </div>
                            )} */}

                            {/* Regular Assistant Message */}
                            {/* {message.role === "assistant" && (
                              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground">
                                {message.content === "Generating AI overview..." ? (
                                  <span className="animate-pulse">{message.content}</span>
                                ) : (
                                  <ReactMarkdown>{message.content}</ReactMarkdown>
                                )}
                              </div>
                            )} */}

                            {/* User Message */}
                            {message.role === "user" && (
                              <p>{message.content}</p>
                            )}

                            {/* Feedback button only for main assistant messages */}
                            {message.role === "assistant" && (
                              <div className="mt-3 flex items-center gap-2">
                                <Dialog
                                  open={isFeedbackOpen && feedbackMessage?.id === message.id}
                                  onOpenChange={setIsFeedbackOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-xs"
                                      onClick={() => setFeedbackMessage(message)}
                                    >
                                      <ThumbsDown className="w-3 h-3 mr-1" />
                                      Report Issue
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Report an Issue</DialogTitle>
                                      <DialogDescription>
                                        Help us improve by describing what was wrong with this response.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <Textarea
                                      placeholder="Describe the issue..."
                                      value={feedbackText}
                                      onChange={(e) => setFeedbackText(e.target.value)}
                                      rows={4}
                                    />
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setIsFeedbackOpen(false)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={handleFeedback} disabled={!feedbackText.trim()}>
                                        Submit Feedback
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                          <Card className="max-w-[80%] animate-pulse">
                            <CardContent className="p-4 flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Searching...</span>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Search Input Area */}
                <div className="border-t bg-background p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                    
                    {/* WebSocket Connection Status (hidden if not available) */}
                    {false && ( // Temporarily hide WebSocket status indicator
                      <div className="flex items-center gap-1 text-xs">
                        <Wifi className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">Real-time Search</span>
                      </div>
                    )}
                    
                    <div className="flex-1" />
                    <div className="text-xs text-muted-foreground">
                      {searchType === 'all' ? 'All' : searchType === 'documents' ? 'Documents' : 'Products'}
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your knowledge base..."
                        className="pl-12 pr-12 h-12 text-base"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        disabled={!input.trim() || isLoading}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </ResizablePanel>
          
          {/* Resizable Handle */}
          <ResizableHandle withHandle />

          {/* AI Response Sidebar - 30% initially */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <div className="h-full border-l bg-muted/20">
              <div className="p-4 h-full flex flex-col">
                {/* AI Response Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <Brain className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">AI Response</h3>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </div>

                {/* {message.role === "assistant" && (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground">
                    {message.content === "Generating AI overview..." ? (
                      <span className="animate-pulse">{message.content}</span>
                    ) : (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    )}
                  </div>
                )} */} 


                {/* AI Response Content */}
                <ScrollArea className="flex-1 pr-2">
                  {messages.length > 0 && (messages[messages.length - 1]?.role === "assistant" || messages[messages.length - 1]?.role === "overview") ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground">
                      {messages[messages.length - 1]?.content === "Generating AI overview..." ? (
                        <span className="animate-pulse">{messages[messages.length - 1]?.content}</span>
                      ) : (
                        <ReactMarkdown>{messages[messages.length - 1]?.content}</ReactMarkdown>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">AI responses will appear here</p>
                      <p className="text-xs mt-1">Ask a question to get started</p>
                    </div>
                  )}
                </ScrollArea>

                {/* AI Response Actions */}
                {messages.length > 0 && (messages[messages.length - 1]?.role === "assistant" || messages[messages.length - 1]?.role === "overview") && (
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const lastAssistantMessage = messages[messages.length - 1]
                        if (lastAssistantMessage?.content) {
                          navigator.clipboard.writeText(lastAssistantMessage.content)
                          toast.success("Response copied to clipboard")
                        }
                      }}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setMessages([])
                      }}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      
      {/* Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Settings</DialogTitle>
            <DialogDescription>
              Configure your search preferences and scope
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Search Scope */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Search Scope</h3>
              
              {loadingPlugins ? (
                <div className="text-muted-foreground">Loading available search options...</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="font-medium">All (Documents & Products)</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Search both knowledge base documents and OpenCart products</p>
                    </div>
                    <input
                      type="radio"
                      name="searchType"
                      value="all"
                      checked={searchType === 'all'}
                      onChange={(e) => {
                        setSearchType(e.target.value as any)
                        saveSettings()
                      }}
                      disabled={!enabledPlugins.documents || !enabledPlugins.opencart}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">Documents Only</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Search only knowledge base documents</p>
                      {!enabledPlugins.documents && (
                        <p className="text-sm text-red-600">Documents plugin is not enabled</p>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="searchType"
                      value="documents"
                      checked={searchType === 'documents'}
                      onChange={(e) => {
                        setSearchType(e.target.value as any)
                        saveSettings()
                      }}
                      disabled={!enabledPlugins.documents}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="font-medium">Products Only</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Search only OpenCart products</p>
                      {!enabledPlugins.opencart && (
                        <p className="text-sm text-red-600">OpenCart plugin is not enabled</p>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="searchType"
                      value="opencart"
                      checked={searchType === 'opencart'}
                      onChange={(e) => {
                        setSearchType(e.target.value as any)
                        saveSettings()
                      }}
                      disabled={!enabledPlugins.opencart}
                    />
                  </div>
                  
                  {/* Catalog Selection */}
                  {enabledPlugins.opencart && (searchType === 'opencart' || searchType === 'all') && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Select Catalogs to Search</h4>
                      
                      {loadingCatalogs ? (
                        <div className="text-muted-foreground">Loading catalogs...</div>
                      ) : catalogs.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          No catalogs available. Create one in the OpenCart plugin.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {catalogs.map((catalog) => (
                            <div key={catalog.catalog_id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`catalog-${catalog.catalog_id}`}
                                checked={selectedCatalogs.includes(catalog.catalog_id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCatalogs([...selectedCatalogs, catalog.catalog_id])
                                  } else {
                                    setSelectedCatalogs(selectedCatalogs.filter(id => id !== catalog.catalog_id))
                                  }
                                  saveSettings()
                                }}
                              />
                              <label 
                                htmlFor={`catalog-${catalog.catalog_id}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {catalog.shop_name}
                                <span className="text-muted-foreground ml-2">
                                  ({catalog.total_products} products)
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Display Options */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Display Options</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">Show AI Overview</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Display AI-generated summary of search results</p>
                </div>
                <Switch
                  checked={showAiOverview}
                  onCheckedChange={(checked) => {
                    setShowAiOverview(checked)
                    saveSettings()
                  }}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setSettingsOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Enhanced File Viewer Modal */}
      <FileViewerModal
        isOpen={isDocumentViewerOpen}
        onClose={() => {
          setIsDocumentViewerOpen(false)
          setSelectedDocument(null)
        }}
        document={selectedDocument || {}}
        searchChunk={selectedDocument?.content}
      />
    </>
  )
}
