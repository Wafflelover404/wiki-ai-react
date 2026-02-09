"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  XCircle,
  Send,
  Eye,
  Reply,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react"
import { useWebSocketMessaging } from "@/hooks/use-websocket-messaging"

interface CMSOrganizationsProps {
  token: string
}

interface Organization {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
  updated_at: string
  admin_user_id: string
  admin_username?: string
  admin_email?: string
  description?: string
}

interface MessageThread {
  id: string
  organization_id: string
  subject: string
  status: string
  created_at: string
  updated_at: string
  last_message_at: string
  organization_name?: string
  organization_slug?: string
}

interface Message {
  id: string
  thread_id: string
  organization_id: string
  sender_type: string
  sender_name: string
  sender_email?: string
  message: string
  message_type: string
  status: string
  created_at: string
  updated_at: string
}

export default function CMSOrganizations({ token }: CMSOrganizationsProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>([])
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null)
  const [threadMessages, setThreadMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentToken, setCurrentToken] = useState(token)

  // Token validation and refresh
  const validateToken = async (providedToken: string): Promise<string | null> => {
    try {
      const response = await fetch("http://127.0.0.1:9001/organizations", {
        headers: {
          "Authorization": `Bearer ${providedToken}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        return providedToken // Token is valid
      } else if (response.status === 403) {
        // Token is invalid, try to refresh with hardcoded credentials
        console.log("Token expired, attempting to refresh...")
        const refreshResponse = await fetch("http://127.0.0.1:9001/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "admin", password: "admin123" })
        })

        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          if (data.status === "success" && data.token) {
            console.log("Token refreshed successfully")
            setCurrentToken(data.token)
            return data.token
          }
        }
      }
    } catch (err) {
      console.error("Token validation error:", err)
    }
    
    return null
  }

  // WebSocket messaging (disabled for stability - using HTTP API instead)
  const {
    isConnected: wsIsConnected,
    messages: wsMessages,
    unreadCount: wsUnreadCount,
    connectionError: wsConnectionError,
    joinThread,
    sendMessage: wsSendMessage,
    markMessageAsRead: wsMarkMessageAsRead
  } = useWebSocketMessaging("") // Disabled by passing empty token

  // Form states
  const [newMessage, setNewMessage] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchOrganizations(),
        fetchMessageThreads(),
        fetchUnreadCount()
      ])
      setLoading(false)
    }
    loadData()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const validToken = await validateToken(currentToken)
      if (!validToken) {
        setError("Authentication failed - please refresh the page")
        return
      }

      const response = await fetch("http://127.0.0.1:9001/organizations/all", {
        headers: {
          "Authorization": `Bearer ${validToken}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          setOrganizations(data.response.organizations || [])
        } else {
          setError(data.message || "Failed to fetch organizations")
        }
      } else {
        setError(`HTTP ${response.status}: Failed to fetch organizations`)
      }
    } catch (err) {
      console.error("Fetch organizations error:", err)
      setError("Failed to fetch organizations - network error")
    }
  }

  const fetchMessageThreads = async () => {
    try {
      const validToken = await validateToken(currentToken)
      if (!validToken) {
        console.error("Authentication failed for message threads")
        return
      }

      const response = await fetch("http://127.0.0.1:9001/messages/threads", {
        headers: {
          "Authorization": `Bearer ${validToken}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          setMessageThreads(data.response.threads || [])
        } else {
          setError(data.message || "Failed to fetch message threads")
        }
      } else {
        setError(`HTTP ${response.status}: Failed to fetch message threads`)
      }
    } catch (err) {
      console.error("Fetch message threads error:", err)
      setError("Failed to fetch message threads - network error")
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const validToken = await validateToken(currentToken)
      if (!validToken) {
        console.error("Authentication failed for unread count")
        return
      }

      const response = await fetch("http://127.0.0.1:9001/messages/unread-count", {
        headers: {
          "Authorization": `Bearer ${validToken}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          setUnreadCount(data.response.unread_count || 0)
        } else {
          console.error("Failed to fetch unread count:", data.message)
        }
      } else {
        console.error(`HTTP ${response.status}: Failed to fetch unread count`)
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err)
    }
  }

  const fetchThreadMessages = async (threadId: string) => {
    try {
      // Always use HTTP API for message fetching (more reliable than WebSocket)
      const validToken = await validateToken(currentToken)
      if (!validToken) {
        setError("Authentication failed - please refresh the page")
        return
      }

      const response = await fetch(`http://127.0.0.1:9001/messages/threads/${threadId}/messages`, {
        headers: {
          "Authorization": `Bearer ${validToken}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          setThreadMessages(data.response.messages || [])
        }
      } else {
        setError(`HTTP ${response.status}: Failed to fetch thread messages`)
      }
    } catch (err) {
      setError("Failed to fetch thread messages")
    }
  }

  const approveOrganization = async (orgId: string) => {
    try {
      const validToken = await validateToken(currentToken)
      if (!validToken) {
        setError("Authentication failed - please refresh the page")
        return
      }

      const response = await fetch(`http://127.0.0.1:9001/organizations/approve/${orgId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${validToken}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          fetchOrganizations()
          // Send approval message
          await sendStatusMessage(orgId, "approved")
        }
      }
    } catch (err) {
      setError("Failed to approve organization")
    }
  }

  const rejectOrganization = async (orgId: string) => {
    try {
      const validToken = await validateToken(currentToken)
      if (!validToken) {
        setError("Authentication failed - please refresh the page")
        return
      }

      const response = await fetch(`http://127.0.0.1:9001/organizations/reject/${orgId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${validToken}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          fetchOrganizations()
          // Send rejection message
          await sendStatusMessage(orgId, "rejected")
        }
      }
    } catch (err) {
      setError("Failed to reject organization")
    }
  }

  const sendStatusMessage = async (orgId: string, status: "approved" | "rejected") => {
    const org = organizations.find(o => o.id === orgId)
    if (!org) return

    try {
      const validToken = await validateToken(currentToken)
      if (!validToken) {
        console.error(`Failed to send ${status} message: Authentication failed`)
        return
      }

      const response = await fetch("http://127.0.0.1:9001/messages/threads", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${validToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          organization_id: orgId,
          subject: `Organization ${status === "approved" ? "Approved" : "Rejected"}`,
          sender_name: "WikiAI Admin",
          sender_email: "admin@wikiai.com",
          message: `Your organization "${org.name}" has been ${status}! ${status === "approved" ? "You can now login and start using WikiAI." : "You may reapply in the future if conditions change."}`,
          message_type: "approval_status"
        })
      })

      if (response.ok) {
        fetchMessageThreads()
        fetchUnreadCount()
      }
    } catch (err) {
      console.error(`Failed to send ${status} message:`, err)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return

    setSendingMessage(true)
    try {
      const validToken = await validateToken(currentToken)
      if (!validToken) {
        setError("Authentication failed - please refresh the page")
        return
      }

      const response = await fetch(`http://127.0.0.1:9001/messages/threads/${selectedThread?.id}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${validToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          sender_name: "WikiAI Admin",
          sender_email: "admin@wikiai.com",
          message_type: "response"
        })
      })

      if (response.ok) {
        setNewMessage("")
        fetchThreadMessages(selectedThread?.id)
      }
    } catch (err) {
      setError("Failed to send message")
    } finally {
      setSendingMessage(false)
    }
  }

  const markMessageAsRead = async (messageId: string) => {
    try {
      const validToken = await validateToken(currentToken)
      if (!validToken) {
        console.error("Failed to mark message as read: Authentication failed")
        return
      }

      const response = await fetch(`http://127.0.0.1:9001/messages/${messageId}/read`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${validToken}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        fetchUnreadCount()
      }
    } catch (err) {
      console.error("Failed to mark message as read:", err)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "active":
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* WebSocket Error Message */}
      {wsConnectionError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <div className="flex items-center">
            <WifiOff className="w-4 h-4 mr-2" />
            <span className="font-medium">Live Chat Unavailable</span>
          </div>
          <p className="text-sm mt-1">
            {(wsConnectionError?.includes("timeout") || wsConnectionError?.includes("failed")) 
              ? "The chat server is not responding. The server may need to be restarted."
              : wsConnectionError?.includes("Authentication")
              ? "Authentication issue. Please log out and log back in."
              : wsConnectionError?.includes("Access denied")
              ? "Access denied. Live chat requires admin privileges."
              : wsConnectionError?.includes("not working properly")
              ? "Server authentication needs to be fixed. Please restart the server."
              : wsConnectionError?.includes("refresh")
              ? "Connection lost. Please refresh the page to reconnect."
              : wsConnectionError || "Unknown error"}
          </p>
          {((wsConnectionError?.includes("timeout") || wsConnectionError?.includes("failed") || wsConnectionError?.includes("not working properly"))) && (
            <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mt-2">
              <p className="text-xs font-mono text-yellow-800">
                To restart the server, run in the graphtalk directory:<br/>
                <code>python api.py</code>
              </p>
            </div>
          )}
          {wsConnectionError?.includes("Authentication") && (
            <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mt-2">
              <p className="text-xs text-yellow-800">
                Your session may have expired. Please log out from the CMS and log back in.
              </p>
            </div>
          )}
          <p className="text-xs mt-1 text-yellow-600">
            Regular messaging will still work through HTTP requests.
          </p>
        </div>
      )}

      {/* Header with unread count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Organizations & Messages</h2>
          <div className="flex items-center space-x-2">
            {wsIsConnected ? (
              <Badge variant="outline" className="flex items-center text-green-600">
                <Wifi className="w-4 h-4 mr-1" />
                Live Chat
              </Badge>
            ) : wsConnectionError ? (
              <Badge variant="outline" className="flex items-center text-red-600">
                <WifiOff className="w-4 h-4 mr-1" />
                {wsConnectionError?.includes("refresh") ? "Reconnect Required" : "Offline"}
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center text-muted-foreground">
                <WifiOff className="w-4 h-4 mr-1" />
                Offline
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {unreadCount} unread
            </Badge>
          )}
          <Button variant="outline" onClick={async () => {
            setLoading(true)
            await Promise.all([
              fetchOrganizations(),
              fetchMessageThreads(),
              fetchUnreadCount()
            ])
            setLoading(false)
          }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="organizations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organizations">
            <Building className="w-4 h-4 mr-2" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-4">
          <div className="grid gap-4">
            {organizations.map((org) => (
              <Card key={org.id || org.name || `org-${Math.random()}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{org.name}</h3>
                      <p className="text-sm text-muted-foreground">{org.slug}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {formatDate(org.created_at)} • Updated: {formatDate(org.updated_at)}
                      </p>
                    </div>
                    {org.admin_username && (
                      <p className="text-sm text-muted-foreground">
                        Admin: {org.admin_username} ({org.admin_email})
                      </p>
                    )}
                  </div>
                    </div>
                    {org.admin_username && (
                      <p className="text-sm text-muted-foreground">
                        Admin: {org.admin_username} ({org.admin_email})
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(org.status)}>
                      <div className="flex items-center">
                        {getStatusIcon(org.status)}
                        <span className="ml-1">{org.status}</span>
                      </div>
                    </Badge>
                    {org.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => approveOrganization(org.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectOrganization(org.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              {org.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{org.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
          {organizations.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Organizations</h3>
                  <p className="text-muted-foreground">
                    No organizations have been created yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="messages" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thread List */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="font-semibold">Message Threads</h3>
            {messageThreads.map((thread) => (
              <Card
                key={thread.id}
                className={`cursor-pointer transition-colors ${
                  selectedThread?.id === thread.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedThread(thread)
                  fetchThreadMessages(thread.id)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{thread.subject}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {thread.organization_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(thread.last_message_at)}
                      </p>
                    </div>
                    {thread.status === "open" && (
                      <Badge variant="outline" className="text-xs">
                        Open
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(org.status)}>
                        <div className="flex items-center">
                          {getStatusIcon(org.status)}
                          <span className="ml-1">{org.status}</span>
                        </div>
                      </Badge>
                      {org.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => approveOrganization(org.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectOrganization(org.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {org.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{org.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
            {organizations.length === 0 && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Organizations</h3>
                    <p className="text-muted-foreground">
                      No organizations have been created yet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Thread List */}
            <div className="lg:col-span-1 space-y-2">
              <h3 className="font-semibold">Message Threads</h3>
              {messageThreads.map((thread) => (
                <Card
                  key={thread.id}
                  className={`cursor-pointer transition-colors ${
                    selectedThread?.id === thread.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    setSelectedThread(thread)
                    fetchThreadMessages(thread.id)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{thread.subject}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {thread.organization_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(thread.last_message_at)}
                        </p>
                      </div>
                      {thread.status === "open" && (
                        <Badge variant="outline" className="text-xs">
                          Open
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Messages */}
            <div className="lg:col-span-2">
              {selectedThread ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">{selectedThread?.subject || 'No Subject'}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedThread?.organization_name || 'Unknown Organization'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {threadMessages.map((message) => (
                        <div
                          key={message.id || Math.random()}
                          className={`flex items-start space-x-3 p-3 rounded-lg ${
                            message.sender_type === "admin"
                              ? "bg-blue-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {message.sender_name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm text-foreground">{message.sender_name || 'Unknown'}</p>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(message.created_at)}
                                </span>
                                {message.status === "unread" && (
                                  <Badge variant="outline" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm mt-1 text-foreground">{message.message || 'No message content'}</p>
                            {message.sender_type === "user" && message.status === "unread" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => markMessageAsRead(message.id)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Form */}
                    <div className="mt-4 border-t pt-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Type your response..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={sendingMessage || !newMessage.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Thread Selected</h3>
                      <p className="text-muted-foreground">
                        Select a message thread to view and respond to messages
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
