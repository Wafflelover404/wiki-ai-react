"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { filesApi, queryApi, aiAgentApi } from "@/lib/api"
import { useWebSocket } from "@/lib/use-websocket"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Settings, 
  FileText,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  X,
  Loader2,
  User,
  Sparkles,
  Bot,
  Globe,
  Wifi,
  Brain,
  Copy,
} from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"

interface SearchResult {
  id: string
  type: 'document' | 'product'
  title: string
  content: string
  source: string
  url?: string
  price?: number | string
  special_price?: number
  shop_name?: string
  score?: number
}

interface Message {
  id: string
  role: "user" | "assistant" | "sources" | "overview"
  content: string
  sources?: string[]
  searchResults?: SearchResult[]
  timestamp?: Date
}

export default function AdminSearchPage() {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, setSearchType] = useState<'all' | 'documents' | 'opencart'>('all')
  const [sessionId] = useState(() => crypto.randomUUID())
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // AI Agent states
  const [aiAgentInput, setAiAgentInput] = useState("")
  const [aiAgentOutput, setAiAgentOutput] = useState("")
  const [isAiAgentLoading, setIsAiAgentLoading] = useState(false)
  const [showAiAgentHelp, setShowAiAgentHelp] = useState(false)
  const [availableFiles, setAvailableFiles] = useState<Array<{id: number, filename: string}>>([])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleAiAgentCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiAgentInput.trim()) {
      toast.error("Please enter a command")
      return
    }

    setIsAiAgentLoading(true)
    setAiAgentOutput("Processing your command...")
    
    try {
      // Use the actual token from auth context
      if (!token) {
        throw new Error("No token available")
      }
      
      const result = await aiAgentApi.executeCommands(token, aiAgentInput)
      
      if (result.status === "success") {
        setAiAgentOutput(result.response || "Command executed successfully!")
        toast.success("AI Agent command executed successfully!")
        
        let searchResults: SearchResult[] = []; // Move searchResults declaration here
        
        // Handle both response structures
        if (result.response && (result.response.snippets || result.response.results)) {
          // Handle original API structure (snippets)
          if (result.response.snippets) {
            result.response.snippets.forEach((snippet: any, index: number) => {
              searchResults.push({
                id: `doc-${index}`,
                type: 'document',
                title: snippet.source || `Document ${index + 1}`,
                content: snippet.content ? snippet.content.substring(0, 200) + '...' : 'No content available',
                source: snippet.source || 'Unknown',
                score: snippet.score || 0
              })
            })
          }
          
          // Handle AI Agent API structure (results)
          if (result.response.results) {
            result.response.results.forEach((result: any, index: number) => {
              searchResults.push({
                id: `ai-${index}`,
                type: 'document',
                title: result.title || result.source || `AI Result ${index + 1}`,
                content: result.content || result.snippet || 'No content available',
                source: result.source || 'Unknown',
                score: result.score || 0
              })
            })
          }
        }
        
        // Create appropriate message
        if (result.response && (result.response.snippets || result.response.results)) {
          const searchMessage: Message = {
            id: crypto.randomUUID(),
            role: "sources",
            content: `Found ${searchResults.length} relevant sources`,
            sources: searchResults.map(r => r.source),
            searchResults: searchResults,
            timestamp: new Date(Date.now())
          }
          
          setMessages(prev => [...prev, searchMessage])
        } else {
          setAiAgentOutput(`Error: ${result.message || "Failed to execute command"}`)
          toast.error(result.message || "Failed to execute AI Agent command")
        }
      } else {
        setAiAgentOutput(`Error: ${result.message || "Failed to execute command"}`)
        toast.error(result.message || "Failed to execute AI Agent command")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error"
      setAiAgentOutput(`Error: ${errorMessage}`)
      toast.error(errorMessage)
    } finally {
      setIsAiAgentLoading(false)
    }
  }

  const loadAvailableFiles = async () => {
    if (!token) {
      toast.error("No token available")
      return
    }
    
    try {
      const result = await aiAgentApi.getAvailableFiles(token)
      
      if (result.status === "success") {
        setAvailableFiles(result.response?.files || [])
        toast.success("Files loaded successfully!")
      } else {
        toast.error(result.message || "Failed to load files")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load files")
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !token || isLoading) return
    
    setIsLoading(true)
    setMessages([]) // Clear previous messages for new search
    if (true) {
      const overviewLoadingMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Generating AI overview...",
        timestamp: new Date(Date.now()),
      }
      setMessages(prev => [...prev, overviewLoadingMessage])
    }
    
    try {
      // Use WebSocket for real-time search (like the Vue implementation)
      const result = await queryApi.queryWebSocket(token, input, {
        session_id: sessionId,
        onMessage: (message) => {
          console.log('Search message received:', message)
          
          // Handle different message types
          if (message.type === 'status') {
            // Optional: Show status updates
            console.log('Search status:', message.message)
          } else if (message.type === 'immediate') {
            // Show search results
            let searchResults: SearchResult[] = []
            
            // Handle both response structures
            if (message.data && (message.data.snippets || message.data.results)) {
              // Handle original API structure (snippets)
              if (message.data.snippets) {
                message.data.snippets.forEach((snippet: any, index: number) => {
                  searchResults.push({
                    id: `doc-${index}`,
                    type: 'document',
                    title: snippet.source || `Document ${index + 1}`,
                    content: snippet.content ? snippet.content.substring(0, 200) + '...' : 'No content available',
                    source: snippet.source || 'Unknown',
                    score: snippet.score || 0
                  })
                })
              }
              
              // Handle AI Agent API structure (results)
              if (message.data.results) {
                message.data.results.forEach((result: any, index: number) => {
                  searchResults.push({
                    id: `ai-${index}`,
                    type: 'document',
                    title: result.title || result.source || `AI Result ${index + 1}`,
                    content: result.content || result.snippet || 'No content available',
                    source: result.source || 'Unknown',
                    score: result.score || 0
                  })
                })
              }
            }
            
            const searchMessage: Message = {
              id: crypto.randomUUID(),
              role: "sources",
              content: `Found ${searchResults.length} relevant sources`,
              sources: searchResults.map(r => r.source),
              searchResults: searchResults,
              timestamp: new Date(Date.now())
            }
            
            setMessages(prev => [...prev, searchMessage])
          } else if (message.type === 'overview') {
            // Show AI overview
            const overviewMessage: Message = {
              id: crypto.randomUUID(),
              role: "overview",
              content: message.data || "No overview available",
              timestamp: new Date(Date.now())
            }
            
            setMessages(prev => [...prev, overviewMessage])
          } else if (message.type === 'complete') {
            // Search completed
            console.log('Search completed')
          }
        }
      })
      
      if (result.status === 'success') {
        toast.success("Search completed successfully!")
      } else {
        toast.error(result.message || "Search failed")
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error("Search failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Admin", href: "/admin" }]} />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin Search</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Powered by</span>
                  <Badge variant="secondary" className="ml-2">AI Agent</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regular Search */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Knowledge Base Search</h2>
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search documents, products, or ask questions..."
                        className="pl-10 pr-4 h-12"
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* AI Agent Interface */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">AI Agent Commands</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAiAgentHelp(!showAiAgentHelp)}
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      {showAiAgentHelp ? "Hide Help" : "Show Help"}
                    </Button>
                  </div>
                  
                  {showAiAgentHelp && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                      <h4 className="font-semibold mb-2">Available Commands:</h4>
                      <div className="space-y-1">
                        <p><code className="bg-background px-2 py-1 rounded">&lt;file-content&gt;filename.md&lt;/file-content&gt;</code> - Get file content</p>
                        <p><code className="bg-background px-2 py-1 rounded">&lt;file-id&gt;123&lt;/file-id&gt;</code> - Get file by ID</p>
                        <p><code className="bg-background px-2 py-1 rounded">&lt;fuzzy-search&gt;query&lt;/fuzzy-search&gt;</code> - Search filenames</p>
                        <p><code className="bg-background px-2 py-1 rounded">&lt;kb-search&gt;query&lt;/kb-search&gt;</code> - Search knowledge base</p>
                        <p><code className="bg-background px-2 py-1 rounded">&lt;semantic-search&gt;query&lt;/semantic-search&gt;</code> - AI-powered search</p>
                      </div>
                      <p className="text-muted-foreground">You can use multiple commands in one request!</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <textarea
                        id="ai-agent-input"
                        placeholder="Enter your AI agent command..."
                        value={aiAgentInput}
                        onChange={(e) => setAiAgentInput(e.target.value)}
                        disabled={isAiAgentLoading}
                        className="w-full min-h-[100px] bg-background/50 p-3 font-mono text-sm resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      onClick={handleAiAgentCommand} 
                      disabled={isAiAgentLoading || !aiAgentInput.trim()}
                      className="flex-1"
                    >
                      {isAiAgentLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Bot className="mr-2 h-4 w-4" />
                          Execute Command
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={loadAvailableFiles}
                      disabled={isAiAgentLoading}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Load Files
                    </Button>
                  </div>
                  
                  {aiAgentOutput && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        AI Agent Response
                      </h4>
                      <div className="bg-background p-3 rounded border text-sm font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {aiAgentOutput}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Messages Display */}
          {messages.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-lg font-semibold">Search Results & Messages</h3>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full" ref={scrollRef}>
                  {messages.map((message, index) => (
                    <div key={message.id} className={`mb-4 p-4 rounded-lg ${message.role === 'user' ? 'bg-blue-50 dark:bg-blue-950' : message.role === 'assistant' ? 'bg-green-50 dark:bg-green-950' : 'bg-muted'}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {message.role === 'user' && <User className="w-5 h-5 mt-1" />}
                          {message.role === 'assistant' && <Bot className="w-5 h-5 mt-1" />}
                          {message.role === 'sources' && <FileText className="w-5 h-5 mt-1" />}
                          {message.role === 'overview' && <Sparkles className="w-5 h-5 mt-1" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
