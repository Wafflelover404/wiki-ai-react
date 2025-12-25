"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { apiKeysApi } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, Plus, Copy, Trash2, Loader2, Clock } from "lucide-react"
import { toast } from "sonner"
import { redirect } from "next/navigation"

interface ApiKey {
  id: string
  name: string
  created_at: string
  last_used: string
}

export default function ApiKeysPage() {
  const { token, isAdmin, isLoading: authLoading } = useAuth()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchKeys = useCallback(async () => {
    if (!token) return

    try {
      const result = await apiKeysApi.list(token)
      if (result.status === "success" && result.response) {
        setApiKeys(result.response.keys || [])
      }
    } catch (error) {
      console.error("Failed to fetch API keys:", error)
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
      fetchKeys()
    }
  }, [isAdmin, fetchKeys])

  const handleCreateKey = async () => {
    if (!token || !newKeyName.trim()) return

    setIsCreating(true)
    try {
      const result = await apiKeysApi.create(token, newKeyName.trim())

      if (result.status === "success" && result.response) {
        setNewKey(result.response.key)
        toast.success("API key created successfully")
        fetchKeys()
      } else {
        toast.error(result.message || "Failed to create API key")
      }
    } catch (error) {
      console.error("Create key error:", error)
      toast.error("Failed to create API key")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteKey = async () => {
    if (!token || !deleteKeyId) return

    setIsDeleting(true)
    try {
      const result = await apiKeysApi.delete(token, deleteKeyId)

      if (result.status === "success") {
        toast.success("API key deleted successfully")
        setDeleteKeyId(null)
        fetchKeys()
      } else {
        toast.error(result.message || "Failed to delete API key")
      }
    } catch (error) {
      console.error("Delete key error:", error)
      toast.error("Failed to delete API key")
    } finally {
      setIsDeleting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setNewKeyName("")
    setNewKey(null)
  }

  if (authLoading || isLoading) {
    return (
      <>
        <AppHeader breadcrumbs={[{ label: "Admin", href: "/app/admin" }, { label: "API Keys" }]} />
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
      <AppHeader breadcrumbs={[{ label: "Admin", href: "/app/admin" }, { label: "API Keys" }]} />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">API Key Management</h1>
            <p className="text-muted-foreground">Manage API keys for programmatic access</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>Create a new API key for programmatic access</DialogDescription>
              </DialogHeader>

              {newKey ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-sm font-medium text-success mb-2">API key created successfully!</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Copy this key now. You {"won't"} be able to see it again.
                    </p>
                    <div className="flex items-center gap-2">
                      <Input value={newKey} readOnly className="font-mono text-sm" />
                      <Button size="icon" variant="outline" onClick={() => copyToClipboard(newKey)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={closeDialog}>Done</Button>
                  </DialogFooter>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">Key Name</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g., Production API"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Give your API key a descriptive name to identify it later
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateKey} disabled={!newKeyName.trim() || isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Key"
                      )}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Keys for authenticating API requests</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {apiKeys.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-muted-foreground" />
                          {key.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(key.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {key.last_used ? new Date(key.last_used).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteKeyId(key.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Key className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No API keys yet</h3>
                <p className="text-muted-foreground mb-4">Create an API key to enable programmatic access</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Key
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteKeyId} onOpenChange={() => setDeleteKeyId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this API key? Any applications using this key will lose access.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteKey}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Key"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  )
}
