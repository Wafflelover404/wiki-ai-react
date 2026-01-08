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
import { Users, Plus, Search, MoreVertical, Edit, Trash2, Loader2, Shield, User } from "lucide-react"
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
      const [usersRes, filesRes] = await Promise.all([adminApi.listAccounts(token), filesApi.list(token)])

      if (usersRes.status === "success" && usersRes.response) {
        setUsers(usersRes.response.accounts || [])
        setFilteredUsers(usersRes.response.accounts || [])
      }
      if (filesRes.status === "success" && filesRes.response) {
        setAllFiles((filesRes.response.documents || []).map((d: any) => d.filename).filter(Boolean))
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
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
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
                    <div className="relative">
                      <select
                        id="role"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
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
                      <Badge variant="outline">{user.allowed_files?.length || 0} files</Badge>
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
                    <div className="relative">
                      <select
                        id="edit-role"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        disabled={isSaving}
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
