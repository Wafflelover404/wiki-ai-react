import { useState, useCallback } from "react"
import { UnifiedFileReader } from "@/components/ui/file-reader"

interface FileItem {
  filename: string
  size: number
  upload_date: string
  content_type: string
  metadata?: any
  indexed: boolean
}

export function useFileReader() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  const openFile = useCallback((file: FileItem) => {
    setSelectedFile(file)
    setIsOpen(true)
  }, [])

  const closeFile = useCallback(() => {
    setIsOpen(false)
    setSelectedFile(null)
  }, [])

  return {
    isOpen,
    selectedFile,
    openFile,
    closeFile,
    setIsOpen,
  }
}
