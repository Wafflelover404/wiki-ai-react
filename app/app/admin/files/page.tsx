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

// PDF Viewer Component
function PDFViewer({ filename, content }: { filename: string; content: string }) {
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("PDFViewer: Starting to load PDF", { filename, contentLength: content?.length })

    setIsLoading(true)
    setError("")

    if (!content) {
      setError("No content available")
      setIsLoading(false)
      return
    }

    try {
      const base64Content = normalizePdfBase64Content(content)

      console.log("PDFViewer: Processing base64 content", { base64Length: base64Content.length })

      const binaryString = atob(base64Content)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      console.log("PDFViewer: Created blob URL", { url })
      setPdfUrl(url)
      setIsLoading(false)

      return () => {
        if (url) {
          URL.revokeObjectURL(url)
        }
      }
    } catch (err) {
      console.error("PDFViewer: Error loading PDF", err)
      setError(`Failed to load PDF: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }, [content, filename])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!viewerRef.current) return

    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-red-500 text-center">
          <FileText className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="flex items-center gap-1"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4" />
              Fullscreen
            </>
          )}
        </Button>
      </div>
      <div ref={viewerRef} className="flex-1 relative">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0 rounded"
          style={{
            minHeight: '400px',
            maxWidth: isFullscreen ? 'none' : '100%'
          }}
          title={`PDF: ${filename}`}
          onLoad={() => console.log("PDFViewer: PDF loaded successfully")}
          onError={(e) => console.error("PDFViewer: iframe error", e)}
        />
      </div>
    </div>
  )
}

// Enhanced Word Document Viewer Component
function WordViewer({ filename, content }: { filename: string; content: string }) {
  const [docxUrl, setDocxUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    console.log("WordViewer: Starting to load Word document", { filename, contentLength: content?.length })

    setIsLoading(true)
    setError("")

    if (!content) {
      setError("No content available")
      setIsLoading(false)
      return
    }

    try {
      const base64Content = normalizePdfBase64Content(content)

      console.log("WordViewer: Processing base64 content", { base64Length: base64Content.length })

      const binaryString = atob(base64Content)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      let mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      if (filename.toLowerCase().endsWith('.doc')) {
        mimeType = 'application/msword'
      }

      const blob = new Blob([bytes], { type: mimeType })
      const url = URL.createObjectURL(blob)

      console.log("WordViewer: Created blob URL", { url, mimeType })
      setDocxUrl(url)
      setIsLoading(false)

      return () => {
        if (url) {
          URL.revokeObjectURL(url)
        }
      }
    } catch (err) {
      console.error("WordViewer: Error loading Word document", err)
      setError(`Failed to load Word document: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }, [content, filename])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-red-500 text-center">
          <FileText className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full">
      <iframe
        src={docxUrl}
        className="w-full h-full border-0 rounded"
        style={{ minHeight: '400px' }}
        title={`Word Document: ${filename}`}
        onLoad={() => console.log("WordViewer: Document loaded successfully")}
        onError={(e) => console.error("WordViewer: iframe error", e)}
      />
    </div>
  )
}

interface FileItem {
  filename: string
  size: number
  upload_date: string
  content_type: string
  metadata?: any
  indexed: boolean
}

interface FileViewerProps {
  file: FileItem
  token: string | null
  onClose: () => void
}

interface FileViewerContentProps {
  file: FileItem
  token: string | null
}

const FileViewerContent: React.FC<FileViewerContentProps> = ({ file, token }) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[50vh] md:h-[60vh]">
      {file && (
        <>
          {file.filename.toLowerCase().endsWith('.pdf') ? (
            <PDFViewer filename={file.filename} content={content} />
          ) : file.filename.toLowerCase().endsWith('.doc') || file.filename.toLowerCase().endsWith('.docx') ? (
            <WordViewer filename={file.filename} content={content} />
          ) : (
            <ScrollArea className="h-full rounded-md border p-4">
              <pre className="text-sm font-mono whitespace-pre-wrap break-words">{content}</pre>
            </ScrollArea>
          )}
        </>
      )}
    </div>
  )
}

const FileViewer: React.FC<FileViewerProps> = ({ file, token, onClose }) => {
  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return <Image className="h-4 w-4" />
    if (contentType.includes("pdf")) return <FileText className="h-4 w-4" />
    if (contentType.includes("text") || contentType.includes("code")) return <FileCode className="h-4 w-4" />
    if (contentType.includes("zip") || contentType.includes("archive")) return <FileArchive className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon(file.content_type)}
            {file.filename}
          </DialogTitle>
          <DialogDescription>
            File content preview
          </DialogDescription>
        </DialogHeader>
        <FileViewerContent file={file} token={token} />
        <DialogFooter>
          <Button variant="outline" onClick={() => window.open(`/api/files/download/${file.filename}`, "_blank")}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminFilesPage() {
  const { token, user } = useAuth()
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingFile, setEditingFile] = useState<FileItem | null>(null)
  const [editMetadata, setEditMetadata] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchFiles = useCallback(async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await filesApi.list(token)
      if (response.status === "success" && response.response?.documents) {
        // Map API response to FileItem interface
        const mappedFiles = response.response.documents.map((doc: any) => ({
          filename: doc.filename,
          size: doc.size || 0,
          upload_date: doc.uploaded_at || new Date().toISOString(),
          content_type: doc.content_type || "application/octet-stream",
          metadata: doc.metadata,
          indexed: doc.indexed || false
        }))
        setFiles(mappedFiles)
      }
    } catch (error) {
      toast.error("Failed to fetch files")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

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

  const handleDeleteFile = async (filename: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001'}/files/${filename}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("File deleted successfully")
        fetchFiles()
      } else {
        toast.error("Failed to delete file")
      }
    } catch (error) {
      toast.error("Failed to delete file")
    }
    setDeleteDialogOpen(false)
    setFileToDelete(null)
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
        toast.success("File metadata updated")
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

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div key={file.filename} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.content_type)}
                        <div>
                          <h4 className="font-medium">{file.filename}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{formatDate(file.upload_date)}</span>
                            <Badge variant={file.indexed ? "default" : "secondary"}>
                              {file.indexed ? "Indexed" : "Not Indexed"}
                            </Badge>
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
                              setFileToDelete(file.filename)
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
            )}
          </CardContent>
        </Card>

        {/* File Viewer Dialog */}
        {selectedFile && (
          <Dialog open={!!selectedFile} onOpenChange={(open) => !open && setSelectedFile(null)}>
            <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] w-full">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getFileIcon(selectedFile.content_type)}
                  <span className="truncate">{selectedFile.filename}</span>
                </DialogTitle>
                <DialogDescription>
                  File content preview
                </DialogDescription>
              </DialogHeader>
              <FileViewerContent file={selectedFile} token={token} />
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => window.open(`/api/files/download/${selectedFile.filename}`, "_blank")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setSelectedFile(null)} className="w-full sm:w-auto">
                  <X className="h-4 h-4 mr-2" />
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

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
                Are you sure you want to delete "{fileToDelete}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => fileToDelete && handleDeleteFile(fileToDelete)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  )
}
