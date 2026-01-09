/* @jsx */
"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FileText,
  File,
  FileCode,
  FileArchive,
  Image,
  Download,
  Maximize2,
  Minimize2,
  Loader2,
  X,
  FileSpreadsheet,
} from "lucide-react"

interface FileItem {
  filename: string
  size: number
  upload_date: string
  content_type: string
  metadata?: any
  indexed: boolean
}

interface FileReaderProps {
  file: FileItem | null
  token: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  showDownload?: boolean
  className?: string
}

const getContentType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf': return 'application/pdf'
    case 'doc': return 'application/msword'
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case 'xls': return 'application/vnd.ms-excel'
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    case 'png': return 'image/png'
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'gif': return 'image/gif'
    case 'webp': return 'image/webp'
    case 'svg': return 'image/svg+xml'
    default: return 'application/octet-stream'
  }
}

const normalizeBase64Content = (content: string): string => {
  if (!content) return ""
  
  // Remove data URL prefix if present
  if (content.includes(',')) {
    content = content.split(',')[1]
  }
  
  // Remove any whitespace
  content = content.replace(/\s/g, '')
  
  // Ensure proper padding
  while (content.length % 4 !== 0) {
    content += '='
  }
  
  return content
}

// PDF Viewer Component
const PDFViewer: React.FC<{ filename: string; content: string }> = ({ filename, content }) => {
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadPDF = async () => {
      if (!content) return

      try {
        const base64Content = normalizeBase64Content(content)
        const binaryString = atob(base64Content)
        const bytes = new Uint8Array(binaryString.length)
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        
        setPdfUrl(url)
        setIsLoading(false)
        
        return () => {
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        setError(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setIsLoading(false)
      }
    }

    loadPDF()
  }, [content])

  const toggleFullscreen = () => {
    if (!viewerRef.current) return
    
    if (!isFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full" ref={viewerRef}>
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0 rounded"
        style={{ 
          minHeight: isFullscreen ? '100vh' : '500px',
          maxWidth: isFullscreen ? 'none' : '100%'
        }}
        title={`PDF: ${filename}`}
      />
    </div>
  )
}

// Word Document Viewer Component
const WordViewer: React.FC<{ filename: string; content: string }> = ({ filename, content }) => {
  const [docxUrl, setDocxUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadDocument = async () => {
      if (!content) return

      try {
        const base64Content = normalizeBase64Content(content)
        const binaryString = atob(base64Content)
        const bytes = new Uint8Array(binaryString.length)
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        const mimeType = filename.toLowerCase().endsWith('.doc') 
          ? 'application/msword' 
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        
        const blob = new Blob([bytes], { type: mimeType })
        const url = URL.createObjectURL(blob)
        
        setDocxUrl(url)
        setIsLoading(false)
        
        return () => {
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        setError(`Failed to load Word document: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [content, filename])

  const toggleFullscreen = () => {
    if (!viewerRef.current) return
    
    if (!isFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full" ref={viewerRef}>
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <iframe
        src={docxUrl}
        className="w-full h-full border-0 rounded"
        style={{ 
          minHeight: isFullscreen ? '100vh' : '400px',
          maxWidth: isFullscreen ? 'none' : '100%'
        }}
        title={`Word Document: ${filename}`}
      />
    </div>
  )
}

// Excel Viewer Component
const ExcelViewer: React.FC<{ filename: string; content: string }> = ({ filename, content }) => {
  const [excelUrl, setExcelUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadExcel = async () => {
      if (!content) return

      try {
        const base64Content = normalizeBase64Content(content)
        const binaryString = atob(base64Content)
        const bytes = new Uint8Array(binaryString.length)
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        const mimeType = filename.toLowerCase().endsWith('.xls') 
          ? 'application/vnd.ms-excel' 
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        
        const blob = new Blob([bytes], { type: mimeType })
        const url = URL.createObjectURL(blob)
        
        setExcelUrl(url)
        setIsLoading(false)
        
        return () => {
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        setError(`Failed to load Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setIsLoading(false)
      }
    }

    loadExcel()
  }, [content, filename])

  const toggleFullscreen = () => {
    if (!viewerRef.current) return
    
    if (!isFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full" ref={viewerRef}>
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <iframe
        src={excelUrl}
        className="w-full h-full border-0 rounded"
        style={{ 
          minHeight: isFullscreen ? '100vh' : '400px',
          maxWidth: isFullscreen ? 'none' : '100%'
        }}
        title={`Excel File: ${filename}`}
      />
    </div>
  )
}

// Image Viewer Component
const ImageViewer: React.FC<{ filename: string; content: string }> = ({ filename, content }) => {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadImage = async () => {
      if (!content) return

      try {
        let url: string
        
        if (content.startsWith('data:image')) {
          url = content
        } else {
          const base64Content = normalizeBase64Content(content)
          const binaryString = atob(base64Content)
          const bytes = new Uint8Array(binaryString.length)
          
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          
          const mimeType = `image/${filename.split('.').pop()?.toLowerCase() || 'png'}`
          const blob = new Blob([bytes], { type: mimeType })
          url = URL.createObjectURL(blob)
        }
        
        setImageUrl(url)
        setIsLoading(false)
        
        return () => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url)
          }
        }
      } catch (error) {
        setError(`Failed to load image: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setIsLoading(false)
      }
    }

    loadImage()
  }, [content, filename])

  const toggleFullscreen = () => {
    if (!viewerRef.current) return
    
    if (!isFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full" ref={viewerRef}>
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex items-center justify-center h-full">
        <img
          src={imageUrl}
          alt={filename}
          className="max-w-full max-h-full object-contain rounded"
          style={{ 
            maxHeight: isFullscreen ? '100vh' : '500px'
          }}
        />
      </div>
    </div>
  )
}

// Text/Code Viewer Component
const TextViewer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ScrollArea className="h-full rounded-md border p-4">
      <pre className="text-sm font-mono whitespace-pre-wrap break-words">{content}</pre>
    </ScrollArea>
  )
}

interface FileViewerContentProps {
  file: FileItem
  token: string | null
}

// Main File Content Viewer
const FileContentViewer: React.FC<FileViewerContentProps> = ({ file, token }) => {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const loadContent = async () => {
      if (!token) return
      
      try {
        // Import filesApi dynamically to avoid circular dependencies
        const { filesApi } = await import("@/lib/api")
        const response = await filesApi.getContent(token, file.filename)
        
        if (response.status === "success") {
          setContent(response.response.content || "")
        } else {
          setContent("Failed to load file content")
        }
      } catch (err) {
        console.error("Failed to load file content:", err)
        setContent("Error loading file content")
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    )
  }

  const filename = file.filename.toLowerCase()
  
  if (filename.endsWith('.pdf')) {
    return <PDFViewer filename={file.filename} content={content} />
  }
  
  if (filename.endsWith('.doc') || filename.endsWith('.docx')) {
    return <WordViewer filename={file.filename} content={content} />
  }
  
  if (filename.endsWith('.xls') || filename.endsWith('.xlsx')) {
    return <ExcelViewer filename={file.filename} content={content} />
  }
  
  if (file.content_type.startsWith('image/')) {
    return <ImageViewer filename={file.filename} content={content} />
  }
  
  return <TextViewer content={content} />
}

// Main FileReader Component
export const UnifiedFileReader: React.FC<FileReaderProps> = ({ 
  file, 
  token, 
  open, 
  onOpenChange, 
  showDownload = true,
  className 
}) => {
  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return <Image className="h-4 w-4" />
    if (contentType.includes("pdf")) return <FileText className="h-4 w-4" />
    if (contentType.includes("text") || contentType.includes("code")) return <FileCode className="h-4 w-4" />
    if (contentType.includes("sheet") || contentType.includes("excel")) return <FileSpreadsheet className="h-4 w-4" />
    if (contentType.includes("word") || contentType.includes("document")) return <FileText className="h-4 w-4" />
    if (contentType.includes("zip") || contentType.includes("archive")) return <FileArchive className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const handleDownload = async () => {
    if (file && token) {
      try {
        // Fetch the file as a blob for proper download
        const response = await fetch(`/files/content/${file.filename}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Download failed: ${response.statusText}`)
        }
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        
        // Create download link
        const link = document.createElement('a')
        link.href = url
        link.download = file.filename
        document.body.appendChild(link)
        link.click()
        
        // Cleanup
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Download failed:', err)
        // Fallback to opening in new tab
        window.open(`/files/content/${file.filename}`, '_blank')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-[95vw] md:max-w-4xl max-h-[90vh] w-full ${className}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {file && getFileIcon(file.content_type)}
            <span className="truncate">{file?.filename}</span>
          </DialogTitle>
          <DialogDescription>
            File content preview
          </DialogDescription>
        </DialogHeader>
        
        {file && (
          <div className="h-[50vh] md:h-[60vh]">
            <FileContentViewer file={file} token={token} />
          </div>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {showDownload && file && (
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UnifiedFileReader
