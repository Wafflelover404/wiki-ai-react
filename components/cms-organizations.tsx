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
  RefreshCw
} from "lucide-react"

interface CMSOrganizationsProps {
  token: string
}

interface Organization {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
  admin_user_id: string
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

  // Form states
  const [newMessage, setNewMessage] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    fetchOrganizations()
    fetchMessageThreads()
    fetchUnreadCount()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:9001/organizations/pending", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          setOrganizations(data.response.pending_organizations || [])
        }
      }
    } catch (err) {
      setError("Failed to fetch organizations")
    }
  }

  const fetchMessageThreads = async () => {
    try {
      const response = await fetch("http://127.0.0.1:9001/messages/threads", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          setMessageThreads(data.response.threads || [])
        }
      }
    } catch (err) {
      setError("Failed to fetch message threads")
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("http://127.0.0.1:9001/messages/unread-count", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          setUnreadCount(data.response.unread_count || 0)
        }
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err)
    }
  }

  const fetchThreadMessages = async (threadId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:9001/messages/threads/${threadId}/messages`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          setThreadMessages(data.response.messages || [])
        }
      }
    } catch (err) {
      setError("Failed to fetch thread messages")
    }
  }

  const approveOrganization = async (orgId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:9001/organizations/approve/${orgId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "success") {
          fetchOrganizations()
          // Send approval message
          await sendApprovalMessage(orgId)
        }
      }
    } catch (err) {
      setError("Failed to approve organization")
    }
  }

  const sendApprovalMessage = async (orgId: string) => {
    const org = organizations.find(o => o.id === orgId)
    if (!org) return

    try {
      const response = await fetch("http://127.0.0.1:9001/messages/threads", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          organization_id: orgId,
          subject: "Organization Approved",
          sender_name: "WikiAI Admin",
          sender_email: "admin@wikiai.com",
          message: `Your organization "${org.name}" has been approved! You can now login and start using WikiAI.`,
          message_type: "approval_status"
        })
      })

      if (response.ok) {
        fetchMessageThreads()
        fetchUnreadCount()
      }
    } catch (err) {
      console.error("Failed to send approval message:", err)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return

    setSendingMessage(true)
    try {
      const response = await fetch(`http://127.0.0.1:9001/messages/threads/${selectedThread.id}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          thread_id: selectedThread.id,
          sender_name: "WikiAI Admin",
          sender_email: "admin@wikiai.com",
          message: newMessage,
          message_type: "response"
        })
      })

      if (response.ok) {
        setNewMessage("")
        fetchThreadMessages(selectedThread.id)
        fetchMessageThreads()
      }
    } catch (err) {
      setError("Failed to send message")
    } finally {
      setSendingMessage(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:9001/messages/${messageId}/read`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        fetchThreadMessages(selectedThread?.id || "")
        fetchUnreadCount()
      }
    } catch (err) {
      console.error("Failed to mark message as read:", err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
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
      {/* Header with unread count */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Organizations & Messages</h2>
        <div className="flex items-center space-x-4">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {unreadCount} unread
            </Badge>
          )}
          <Button variant="outline" onClick={() => {
            fetchOrganizations()
            fetchMessageThreads()
            fetchUnreadCount()
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
              <Card key={org.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">{org.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Created: {formatDate(org.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(org.status)}>
                        <div className="flex items-center">
                          {getStatusIcon(org.status)}
                          <span className="ml-1">{org.status}</span>
                        </div>
                      </Badge>
                      {org.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => approveOrganization(org.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
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
                    <CardTitle>{selectedThread.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedThread.organization_name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {threadMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-3 p-3 rounded-lg ${
                            message.sender_type === "admin"
                              ? "bg-blue-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {message.sender_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{message.sender_name}</p>
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
                            <p className="text-sm mt-1">{message.message}</p>
                            {message.sender_type === "user" && message.status === "unread" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => markAsRead(message.id)}
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
