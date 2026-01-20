"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { filesApi } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { UnifiedFileReader } from "@/components/ui/file-reader"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Upload,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Loader2,
  File,
  Image,
  FileCode,
  FileArchive,
  Calendar,
  User,
  HardDrive,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "@/src/i18n"

// Helper function to normalize PDF base64 content
function normalizePdfBase64Content(content: string): string {
  const trimmed = content.trim()
  
  if (trimmed.startsWith('data:application/pdf;base64,')) {
    return trimmed.split(',')[1]
  }
  
  if (!trimmed.includes(',') && trimmed.length > 0) {
    return trimmed
  }
  
  if (trimmed.includes(',')) {
    return trimmed.split(',')[1]
  }
  
  return trimmed
}

interface FileItem {
  id?: number
  filename: string
  size: number
  upload_date: string
  content_type: string
  metadata?: any
  indexed: boolean
}


export default function AdminFilesPage() {
  const { token, user } = useAuth()
  const { t } = useTranslation()
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<{filename: string, id?: number} | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingFile, setEditingFile] = useState<FileItem | null>(null)
  const [editMetadata, setEditMetadata] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Multi-select state
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set())
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  const fetchFiles = useCallback(async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await filesApi.list(token)
      if (response.status === "success" && response.response?.documents) {
        // Map API response to FileItem interface
        const mappedFiles = response.response.documents.map((doc: any) => ({
          id: doc.id,
          filename: doc.filename,
          size: doc.file_size || 0,
          upload_date: doc.upload_timestamp || new Date().toISOString(),
          content_type: "application/octet-stream",
          metadata: null,
          indexed: true
        }))
        setFiles(mappedFiles)
      }
    } catch (error) {
      toast.error(t('files.failedToFetchFiles'))
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // Filter files based on search query
  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFileUpload = async () => {
    if (!uploadedFiles.length || !token) return

    setUploading(true)
    const uploadPromises = uploadedFiles.map(async (file) => {
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
    setUploading(false)
    fetchFiles()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    setUploadedFiles(prev => [...prev, ...droppedFiles])
  }

  const handleDeleteFile = async () => {
    if (!fileToDelete || !token) return
    
    try {
      let result
      if (fileToDelete.id) {
        // Use delete by ID for better performance
        result = await filesApi.deleteById(token, fileToDelete.id.toString())
      } else {
        // Fallback to delete by filename
        result = await filesApi.deleteByFilename(token, fileToDelete.filename)
      }
      
      if (result.status === "success") {
        toast.success(t('files.fileDeletedSuccessfully'))
        fetchFiles()
      } else {
        toast.error(result.message || t('files.failedToDeleteFile'))
      }
    } catch (error) {
      console.error("Failed to delete file:", error)
      toast.error(t('files.failedToDeleteFile'))
    }
    setFileToDelete(null)
  }

  // Multi-select functions
  const handleFileSelect = (fileId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    setSelectedFiles(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id!).filter(id => id !== undefined)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0 || !token) return
    
    try {
      const deletePromises = Array.from(selectedFiles).map(fileId => 
        filesApi.deleteById(token, fileId.toString())
      )
      
      const results = await Promise.all(deletePromises)
      const successCount = results.filter(r => r.status === "success").length
      
      if (successCount === selectedFiles.size) {
        toast.success(`Successfully deleted ${successCount} files`)
      } else {
        toast.success(`Deleted ${successCount} out of ${selectedFiles.size} files`)
      }
      
      setSelectedFiles(new Set())
      setBulkDeleteDialogOpen(false)
      fetchFiles()
    } catch (error) {
      console.error("Failed to delete files:", error)
      toast.error(t('files.failedToDeleteSomeFiles'))
    }
  }

  const handleEditMetadata = async () => {
    if (!editingFile) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001'}/files/${editingFile.filename}/metadata`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          metadata: editMetadata ? JSON.parse(editMetadata) : {}
        }),
      })

      if (response.ok) {
        toast.success(t('files.fileMetadataUpdated'))
        fetchFiles()
        setEditDialogOpen(false)
        setEditingFile(null)
        setEditMetadata("")
      } else {
        toast.error("Failed to update metadata")
      }
    } catch (error) {
      toast.error("Failed to update metadata")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString()
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return <Image className="h-4 w-4" />
    if (contentType.includes("pdf")) return <FileText className="h-4 w-4" />
    if (contentType.includes("text") || contentType.includes("code")) return <FileCode className="h-4 w-4" />
    if (contentType.includes("zip") || contentType.includes("archive")) return <FileArchive className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const indexedCount = files.filter(file => file.indexed).length

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Admin" }, { label: "Files" }]} />
      <main className="flex-1 p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">File Management</h1>
          <p className="text-muted-foreground">
            Upload, view, and manage all documents in the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files.length}</div>
              <p className="text-xs text-muted-foreground">Documents uploaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
              <p className="text-xs text-muted-foreground">Storage used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Indexed</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{indexedCount}</div>
              <p className="text-xs text-muted-foreground">Searchable files</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upload Progress</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uploadedFiles.length}</div>
              <p className="text-xs text-muted-foreground">Files pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Upload documents to make them searchable and available for AI queries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    {isDragging ? "Drop files here" : "Drag and drop files here"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    or click the button below to select files
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
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
                    Select Files
                  </Button>
                  {uploadedFiles.length > 0 && (
                    <Button onClick={handleFileUpload} disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload {uploadedFiles.length} file(s)
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Selected Files:</h4>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <File className="h-4 w-4" />
                        <span>{file.name}</span>
                        <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Files</CardTitle>
                <CardDescription>
                  Manage and view all uploaded documents
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-shrink-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 h-10 bg-background border-input hover:border-primary/50 focus:border-primary transition-colors"
                  />
                </div>
                {filteredFiles.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-md border">
                    <Checkbox
                      checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {selectedFiles.size === filteredFiles.length ? 'Deselect All' : 'Select All'}
                    </span>
                    {selectedFiles.size > 0 && (
                      <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                        {selectedFiles.size} selected
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                {/* Bulk Actions Bar */}
                {selectedFiles.size > 0 && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 border-b mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFiles(new Set())}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Selection
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setBulkDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                )}
                
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {filteredFiles.map((file) => (
                      <div 
                        key={file.filename} 
                        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                          selectedFiles.has(file.id!) ? 'bg-muted/50 border-muted' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedFiles.has(file.id!)}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(selectedFiles)
                              if (checked) {
                                newSelected.add(file.id!)
                              } else {
                                newSelected.delete(file.id!)
                              }
                              setSelectedFiles(newSelected)
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          {getFileIcon(file.content_type)}
                          <div>
                            <h4 className="font-medium">{file.filename}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{formatDate(file.upload_date)}</span>
                            </div>
                          </div>
                        </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedFile(file)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`/api/files/download/${file.filename}`, "_blank")}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setEditingFile(file)
                            setEditMetadata(JSON.stringify(file.metadata || {}, null, 2))
                            setEditDialogOpen(true)
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Metadata
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setFileToDelete({filename: file.filename, id: file.id})
                              setDeleteDialogOpen(true)
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                  {filteredFiles.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      {searchQuery ? "No files found matching your search." : "No files uploaded yet."}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
            )}
          </CardContent>
        </Card>

        {/* File Viewer Dialog */}
        <UnifiedFileReader
          file={selectedFile}
          token={token}
          open={!!selectedFile}
          onOpenChange={(open) => !open && setSelectedFile(null)}
        />

        {/* Edit Metadata Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit File Metadata</DialogTitle>
              <DialogDescription>
                Update metadata for {editingFile?.filename}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="metadata">Metadata (JSON)</label>
                <Textarea
                  id="metadata"
                  value={editMetadata}
                  onChange={(e) => setEditMetadata(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditMetadata}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete File</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{fileToDelete?.filename}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteFile}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Delete Confirmation Dialog */}
        <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Multiple Files</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground">
                Delete {selectedFiles.size} File{selectedFiles.size !== 1 ? 's' : ''}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  )
}
