"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { adminApi } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Loader2, 
  Mail, 
  Calendar,
  Shield,
  User,
  Link,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import { toast } from "sonner"
import { redirect } from "next/navigation"

interface Invite {
  id: string
  token: string
  link: string
  email?: string
  role: string
  expires_at: string
  created_at: string
  created_by: string
  is_used: boolean
  organization_id?: string
}

export default function InvitesPage() {
  const { token, isAdmin, isLoading: authLoading, user: currentUser } = useAuth()
  const [invites, setInvites] = useState<Invite[]>([])
  const [filteredInvites, setFilteredInvites] = useState<Invite[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [allFiles, setAllFiles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Create invite state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("user")
  const [allowedFiles, setAllowedFiles] = useState<string[]>([])
  const [expiresInDays, setExpiresInDays] = useState(7)
  const [message, setMessage] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [createdInvite, setCreatedInvite] = useState<Invite | null>(null)

  // Delete invite state
  const [deleteInviteId, setDeleteInviteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    if (!token) return

    try {
      const invitesRes = await adminApi.listInvites(token)

      if (invitesRes.status === "success" && invitesRes.response) {
        setInvites(invitesRes.response.invites || [])
        setFilteredInvites(invitesRes.response.invites || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      redirect("/app")
    }
  }, [authLoading, isAdmin])

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin, fetchData])

  useEffect(() => {
    if (searchQuery) {
      const filtered = invites.filter(
        (invite) =>
          invite.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invite.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invite.created_by.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredInvites(filtered)
    } else {
      setFilteredInvites(invites)
    }
  }, [searchQuery, invites])

  const handleCreateInvite = async () => {
    if (!token) return

    setIsCreating(true)
    setCreateError("")
    try {
      const result = await adminApi.createInvite(token, {
        email: email.trim() || undefined,
        role,
        allowed_files: allowedFiles,
        expires_in_days: expiresInDays,
        message: message.trim() || undefined,
      })

      if (result.status === "success" && result.response) {
        toast.success("Invite link created successfully")
        // Transform the response to match the Invite interface
        const inviteData: Invite = {
          id: result.response.invite_id,
          token: result.response.token,
          link: result.response.link,
          email: result.response.email,
          role: result.response.role,
          expires_at: result.response.expires_at,
          created_at: new Date().toISOString(), // Use current time as created_at
          created_by: result.response.created_by,
          is_used: false,
          organization_id: result.response.organization_id
        }
        setCreatedInvite(inviteData)
        setIsCreateOpen(false)
        setEmail("")
        setRole("user")
        setAllowedFiles([])
        setExpiresInDays(7)
        setMessage("")
        setCreateError("")
        fetchData()
      } else {
        setCreateError(result.message || "Failed to create invite")
        toast.error(result.message || "Failed to create invite")
      }
    } catch (error) {
      console.error("Create invite error:", error)
      setCreateError("Network error occurred")
      toast.error("Failed to create invite")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success("Invite link copied to clipboard")
  }

  const handleDeleteInvite = async () => {
    if (!token || !deleteInviteId) return

    setIsDeleting(true)
    try {
      const result = await adminApi.revokeInvite(token, deleteInviteId)

      if (result.status === "success") {
        toast.success("Invite revoked successfully")
        setDeleteInviteId(null)
        fetchData()
      } else {
        toast.error(result.message || "Failed to revoke invite")
      }
    } catch (error) {
      console.error("Revoke invite error:", error)
      toast.error("Failed to revoke invite")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleFilePermission = (filename: string) => {
    setAllowedFiles((prev) =>
      prev.includes(filename) ? prev.filter((f) => f !== filename) : [...prev, filename]
    )
  }

  const toggleAllFiles = () => {
    if (allowedFiles.length === allFiles.length) {
      setAllowedFiles([])
    } else {
      setAllowedFiles(allFiles)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString()
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (authLoading || isLoading) {
    return (
      <>
        <AppHeader breadcrumbs={[{ label: "Admin", href: "/app/admin" }, { label: "Invites" }]} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Admin", href: "/app/admin" }, { label: "Invites" }]} />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invite Management</h1>
            <p className="text-muted-foreground">Create and manage user invitation links</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Invite
          </Button>
        </div>

        {/* Create Invite Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Create New Invite</h2>
                    <p className="text-sm text-muted-foreground">Generate an invitation link for new users</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="relative">
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isCreating}
                        className="w-full h-11 px-4 pr-10 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        <option value="user">👤 User</option>
                        <option value="admin">🛡️ Admin</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      {role === "admin" ? (
                        <>
                          <Shield className="w-3 h-3" />
                          Full system access and user management
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3" />
                          Standard user with assigned file permissions
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires In</Label>
                    <div className="relative">
                      <select
                        id="expires"
                        value={expiresInDays}
                        onChange={(e) => setExpiresInDays(Number(e.target.value))}
                        disabled={isCreating}
                        className="w-full h-11 px-4 pr-10 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        <option value={1}>🕐 1 Day</option>
                        <option value={3}>🕐 3 Days</option>
                        <option value={7}>🕐 1 Week</option>
                        <option value={14}>🕐 2 Weeks</option>
                        <option value={30}>🕐 1 Month</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <textarea
                      id="message"
                      placeholder="Welcome to our platform! We're excited to have you join us."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isCreating}
                      className="w-full h-20 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>
                  
                  {createError && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                      {createError}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isCreating} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateInvite} disabled={isCreating} className="flex-1">
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Invite"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Created Invite Success Modal */}
        {createdInvite && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-green-600">Invite Created!</h2>
                    <p className="text-sm text-muted-foreground">Share this link with your invitee</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setCreatedInvite(null)}>
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Link className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Invite Link</span>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <code className="text-xs break-all">{createdInvite.link}</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(createdInvite.link)}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Role:</span>
                      <div className="font-medium capitalize">{createdInvite.role}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expires:</span>
                      <div className="font-medium">{formatDate(createdInvite.expires_at)}</div>
                    </div>
                    {createdInvite.email && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Email:</span>
                        <div className="font-medium">{createdInvite.email}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button onClick={() => setCreatedInvite(null)} className="w-full">
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary">{filteredInvites.length} invites</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Invites
            </CardTitle>
            <CardDescription>All invitation links and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {invite.email || "No email"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={invite.role === "admin" ? "default" : "secondary"} className="capitalize">
                        {invite.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {invite.is_used ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Used</span>
                          </>
                        ) : isExpired(invite.expires_at) ? (
                          <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-red-600">Expired</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600">Active</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(invite.expires_at)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{invite.created_by}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCopyLink(invite.link)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          {!invite.is_used && !isExpired(invite.expires_at) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteInviteId(invite.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Revoke
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delete Invite Confirmation */}
        <AlertDialog open={!!deleteInviteId} onOpenChange={() => setDeleteInviteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke Invite</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke this invite? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteInvite}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  "Revoke Invite"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  )
}
