import { useState, useRef, useCallback, useEffect } from "react"
import { filesApi, type FileUploadResult } from "@/lib/api"

export type UploadStatus = "pending" | "indexing" | "indexed" | "failed" | "duplicate" | "error"

export interface UploadItem {
  id: string
  fileName: string
  documentId: string | null
  status: UploadStatus
  error?: string
}

const POLL_INTERVAL_MS = 2000
const TERMINAL = new Set<UploadStatus>(["indexed", "failed", "duplicate", "error"])

// Tracks a set of just-uploaded files through pending -> indexing ->
// indexed/failed by polling filesApi.getStatus() for each one until it
// reaches a terminal state. One long-lived interval per mount (matching
// cms-system-health.tsx's always-on-heartbeat pattern) that's a no-op
// whenever nothing is in flight, rather than tearing an interval down and
// rebuilding it on every items change.
export function useUploadStatusPoll(token: string | null) {
  const [items, setItems] = useState<UploadItem[]>([])
  const itemsRef = useRef(items)
  itemsRef.current = items

  const addResults = useCallback((results: FileUploadResult[]) => {
    const newItems: UploadItem[] = results.map((r) => ({
      id: crypto.randomUUID(),
      fileName: r.file.name,
      documentId: r.documentId,
      status: r.documentId ? ((r.status as UploadStatus) || "pending") : "error",
      error: r.error,
    }))
    setItems((prev) => [...prev, ...newItems])
  }, [])

  const clearTerminal = useCallback(() => {
    setItems((prev) => prev.filter((i) => !TERMINAL.has(i.status)))
  }, [])

  useEffect(() => {
    if (!token) return

    const interval = setInterval(async () => {
      const inFlight = itemsRef.current.filter((i) => i.documentId && !TERMINAL.has(i.status))
      if (inFlight.length === 0) return

      const updates = await Promise.all(
        inFlight.map(async (item) => {
          const r = await filesApi.getStatus(token, item.documentId!)
          if (r.status === "success" && r.response?.document) {
            return { id: item.id, status: r.response.document.status as UploadStatus }
          }
          return null
        })
      )

      setItems((prev) =>
        prev.map((item) => {
          const update = updates.find((u) => u?.id === item.id)
          return update ? { ...item, status: update.status } : item
        })
      )
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [token])

  return { items, addResults, clearTerminal }
}
