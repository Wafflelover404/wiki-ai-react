"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { adminApi, filesApi } from "@/lib/api"
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
  DialogTrigger,
  DialogPortal,
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
import { Users, Plus, Search, MoreVertical, Edit, Trash2, Loader2, Shield, User, Mail, Link, Copy } from "lucide-react"
import { toast } from "sonner"
import { redirect } from "next/navigation"

interface UserAccount {
  id?: number
  username: string
  role: string
  organization_id?: string
  allowed_files?: string[]
  created_at?: string
}

export default function UsersPage() {
  const { token, isAdmin, isLoading: authLoading, user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserAccount[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [allFiles, setAllFiles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Create user state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState("user")
  const [newAllowedFiles, setNewAllowedFiles] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const createDialogRef = useRef<HTMLDivElement>(null)
  const editDialogRef = useRef<HTMLDivElement>(null)

  // Create invite state
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("user")
  const [inviteExpiresInDays, setInviteExpiresInDays] = useState(7)
  const [inviteMessage, setInviteMessage] = useState("")
  const [isCreatingInvite, setIsCreatingInvite] = useState(false)
  const [inviteError, setInviteError] = useState("")
  const [createdInvite, setCreatedInvite] = useState<any>(null)

  // Edit user state
  const [editUser, setEditUser] = useState<UserAccount | null>(null)
  const [editRole, setEditRole] = useState("")
  const [editPermittedFiles, setEditPermittedFiles] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Delete user state
  const [deleteUsername, setDeleteUsername] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    if (!token) return

    try {
      const [usersRes, filesRes] = await Promise.all([
        adminApi.listAccounts(token), 
        filesApi.list(token)
      ])

      if (usersRes.status === "success" && usersRes.response) {
        setUsers(usersRes.response.accounts || [])
        setFilteredUsers(usersRes.response.accounts || [])
      }
      
      if (filesRes.status === "success" && filesRes.response) {
        setAllFiles(filesRes.response.documents?.map((doc: any) => doc.filename) || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to load data")
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

  // Add 30-second polling for real-time updates
  useEffect(() => {
    if (!isAdmin || !token) return

    const interval = setInterval(() => {
      fetchData()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [isAdmin, token, fetchData])

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const handleCreateUser = async () => {
    if (!token || !newUsername.trim() || !newPassword.trim()) {
      setCreateError("Username and password are required")
      return
    }

    if (newPassword.length < 6) {
      setCreateError("Password must be at least 6 characters long")
      return
    }

    setIsCreating(true)
    setCreateError("")
    try {
      const result = await adminApi.createUser(token, {
        username: newUsername.trim(),
        password: newPassword,
        role: newRole,
        allowed_files: newAllowedFiles,
      })

      if (result.status === "success") {
        toast.success("User created successfully")
        setIsCreateOpen(false)
        setNewUsername("")
        setNewPassword("")
        setNewRole("user")
        setNewAllowedFiles([])
        setCreateError("")
        fetchData()
      } else {
        setCreateError(result.message || "Failed to create user")
        toast.error(result.message || "Failed to create user")
      }
    } catch (error) {
      console.error("Create user error:", error)
      setCreateError("Network error occurred")
      toast.error("Failed to create user")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateInvite = async () => {
    if (!token) return

    setIsCreatingInvite(true)
    setInviteError("")
    try {
      const result = await adminApi.createInvite(token, {
        email: inviteEmail.trim() || undefined,
        role: inviteRole,
        expires_in_days: inviteExpiresInDays,
        message: inviteMessage.trim() || undefined,
      })

      if (result.status === "success" && result.response) {
        toast.success("Invite link created successfully")
        setCreatedInvite(result.response)
        setIsInviteOpen(false)
        setInviteEmail("")
        setInviteRole("user")
        setInviteExpiresInDays(7)
        setInviteMessage("")
        setInviteError("")
      } else {
        setInviteError(result.message || "Failed to create invite")
        toast.error(result.message || "Failed to create invite")
      }
    } catch (error) {
      console.error("Create invite error:", error)
      setInviteError("Network error occurred")
      toast.error("Failed to create invite")
    } finally {
      setIsCreatingInvite(false)
    }
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success("Invite link copied to clipboard")
  }

  const handleEditUser = (user: UserAccount) => {
    setEditUser(user)
    setEditRole(user.role)
    setEditPermittedFiles(user.allowed_files || [])
  }

  const handleSaveUser = async () => {
    if (!token || !editUser) return

    setIsSaving(true)
    try {
      const result = await adminApi.editUser(token, {
        username: editUser.username,
        role: editRole,
        allowed_files: editPermittedFiles,
      })

      if (result.status === "success") {
        toast.success("User updated successfully")
        setEditUser(null)
        fetchData()
      } else {
        toast.error(result.message || "Failed to update user")
      }
    } catch (error) {
      console.error("Update user error:", error)
      toast.error("Failed to update user")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!token || !deleteUsername) return

    setIsDeleting(true)
    try {
      const result = await adminApi.deleteUser(token, deleteUsername)

      if (result.status === "success") {
        toast.success("User deleted successfully")
        setDeleteUsername(null)
        fetchData()
      } else {
        toast.error(result.message || "Failed to delete user")
      }
    } catch (error) {
      console.error("Delete user error:", error)
      toast.error("Failed to delete user")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleFilePermission = (filename: string, isCreating = false) => {
    if (isCreating) {
      setNewAllowedFiles((prev) =>
        prev.includes(filename) ? prev.filter((f) => f !== filename) : [...prev, filename]
      )
    } else {
      setEditPermittedFiles((prev) =>
        prev.includes(filename) ? prev.filter((f) => f !== filename) : [...prev, filename]
      )
    }
  }

  const toggleAllFiles = (isCreating = false) => {
    if (isCreating) {
      if (newAllowedFiles.length === allFiles.length) {
        setNewAllowedFiles([])
      } else {
        setNewAllowedFiles(allFiles)
      }
    } else {
      if (editPermittedFiles.length === allFiles.length) {
        setEditPermittedFiles([])
      } else {
        setEditPermittedFiles(allFiles)
      }
    }
  }

  if (authLoading || isLoading) {
    return (
      <>
        <AppHeader breadcrumbs={[{ label: "Admin", href: "/app/admin" }, { label: "Users" }]} />
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
      <AppHeader breadcrumbs={[{ label: "Admin", href: "/app/admin" }, { label: "Users" }]} />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
            <Button variant="outline" onClick={() => setIsInviteOpen(true)}>
              <Mail className="w-4 h-4 mr-2" />
              Create Invite
            </Button>
          </div>
        </div>

        {/* Create User Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Create New User</h2>
                    <p className="text-sm text-muted-foreground">Add a new user to the system</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password (min 6 characters)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newRole} onValueChange={setNewRole} disabled={isCreating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            User
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      {newRole === "admin" ? (
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
                    <div className="flex items-center justify-between">
                      <Label>File Permissions</Label>
                      {allFiles.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAllFiles(true)}
                          disabled={isCreating}
                          className="text-xs"
                        >
                          {newAllowedFiles.length === allFiles.length ? "Deselect All" : "Select All"}
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                      {allFiles.length > 0 ? (
                        <div className="space-y-2">
                          {allFiles.map((file) => (
                            <div key={file} className="flex items-center gap-2">
                              <Checkbox
                                id={`create-${file}`}
                                checked={newAllowedFiles.includes(file)}
                                onCheckedChange={() => toggleFilePermission(file, true)}
                                disabled={isCreating}
                              />
                              <label htmlFor={`create-${file}`} className="text-sm cursor-pointer truncate">
                                {file}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No files available</p>
                      )}
                    </div>
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
                  <Button 
                    onClick={handleCreateUser} 
                    disabled={!newUsername.trim() || !newPassword.trim() || newPassword.length < 6 || isCreating}
                    className="flex-1"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary">{filteredUsers.length} users</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users
            </CardTitle>
            <CardDescription>All registered user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Files Access</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.role === "admin" ? (
                          <Shield className="w-4 h-4 text-primary" />
                        ) : (
                          <User className="w-4 h-4 text-muted-foreground" />
                        )}
                        {user.username}
                        {user.username === currentUser?.username && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.organization_id || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{(user.role === "admin") ? "all" : (user.allowed_files?.length || 0)} files</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {user.username !== currentUser?.username && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteUsername(user.username)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
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

        {/* Edit User Modal */}
        {editUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Edit User: {editUser.username}</h2>
                    <p className="text-sm text-muted-foreground">Update user role and file permissions</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setEditUser(null)}>
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input value={editUser.username} disabled className="bg-muted" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select value={editRole} onValueChange={setEditRole} disabled={isSaving}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            User
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      {editRole === "admin" ? (
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
                    <div className="flex items-center justify-between">
                      <Label>File Permissions</Label>
                      {allFiles.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAllFiles(false)}
                          disabled={isSaving}
                          className="text-xs"
                        >
                          {editPermittedFiles.length === allFiles.length ? "Deselect All" : "Select All"}
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                      {allFiles.length > 0 ? (
                        <div className="space-y-2">
                          {allFiles.map((file) => (
                            <div key={file} className="flex items-center gap-2">
                              <Checkbox
                                id={`edit-${file}`}
                                checked={editPermittedFiles.includes(file)}
                                onCheckedChange={() => toggleFilePermission(file, false)}
                                disabled={isSaving}
                              />
                              <label htmlFor={`edit-${file}`} className="text-sm cursor-pointer truncate">
                                {file}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No files available</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" onClick={() => setEditUser(null)} disabled={isSaving} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveUser} disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Invite Modal */}
        {isInviteOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Create Invite Link</h2>
                    <p className="text-sm text-muted-foreground">Generate an invitation link for new users</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsInviteOpen(false)}>
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email (Optional)</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="user@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      disabled={isCreatingInvite}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole} disabled={isCreatingInvite}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            User
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      {inviteRole === "admin" ? (
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
                    <Label htmlFor="invite-expires">Expires In</Label>
                    <Select value={inviteExpiresInDays.toString()} onValueChange={(value) => setInviteExpiresInDays(Number(value))} disabled={isCreatingInvite}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select expiration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex items-center gap-2">
                            <span>🕐</span>
                            1 Day
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex items-center gap-2">
                            <span>🕐</span>
                            3 Days
                          </div>
                        </SelectItem>
                        <SelectItem value="7">
                          <div className="flex items-center gap-2">
                            <span>🕐</span>
                            1 Week
                          </div>
                        </SelectItem>
                        <SelectItem value="14">
                          <div className="flex items-center gap-2">
                            <span>🕐</span>
                            2 Weeks
                          </div>
                        </SelectItem>
                        <SelectItem value="30">
                          <div className="flex items-center gap-2">
                            <span>🕐</span>
                            1 Month
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invite-message">Message (Optional)</Label>
                    <textarea
                      id="invite-message"
                      placeholder="Welcome to our platform! We're excited to have you join us."
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      disabled={isCreatingInvite}
                      className="w-full h-20 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>
                  
                  {inviteError && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                      {inviteError}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)} disabled={isCreatingInvite} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateInvite} disabled={isCreatingInvite} className="flex-1">
                    {isCreatingInvite ? (
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
                      <div className="font-medium">{new Date(createdInvite.expires_at).toLocaleDateString()}</div>
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

        {/* Delete User Confirmation */}
        <AlertDialog open={!!deleteUsername} onOpenChange={() => setDeleteUsername(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{deleteUsername}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  )
}
