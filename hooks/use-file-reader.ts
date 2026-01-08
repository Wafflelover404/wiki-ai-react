"use client"

import { useState } from "react"
import { UnifiedFileReader } from "@/components/ui/file-reader"

interface FileReaderItem {
  filename: string
  size: number
  upload_date: string
  content_type: string
  metadata?: any
  indexed: boolean
}

export function useFileReader() {
  const [selectedFile, setSelectedFile] = useState<FileReaderItem | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openFile = (file: FileReaderItem) => {
    setSelectedFile(file)
    setIsOpen(true)
  }

  const closeFile = () => {
    setIsOpen(false)
    // Delay clearing the file to allow close animation
    setTimeout(() => setSelectedFile(null), 300)
  }

  const FileReaderComponent = ({ token }: { token: string | null }) => (
    <UnifiedFileReader
      file={selectedFile}
      token={token}
      open={isOpen}
      onOpenChange={(open) => !open && closeFile()}
    />
  )

  return {
    openFile,
    closeFile,
    FileReaderComponent,
    selectedFile,
    isOpen
  }
}
