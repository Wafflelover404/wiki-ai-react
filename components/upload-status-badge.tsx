import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Clock, Copy } from "lucide-react"
import type { UploadStatus } from "@/hooks/use-upload-status-poll"

const STATUS_STYLES: Record<UploadStatus, string> = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  indexing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  indexed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  duplicate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const STATUS_LABELS: Record<UploadStatus, string> = {
  pending: "Pending",
  indexing: "Indexing",
  indexed: "Indexed",
  duplicate: "Already indexed",
  failed: "Failed",
  error: "Error",
}

function StatusIcon({ status }: { status: UploadStatus }) {
  const className = "w-3.5 h-3.5"
  switch (status) {
    case "pending":
      return <Clock className={className} />
    case "indexing":
      return <Loader2 className={`${className} animate-spin`} />
    case "indexed":
      return <CheckCircle2 className={className} />
    case "duplicate":
      return <Copy className={className} />
    case "failed":
    case "error":
      return <XCircle className={className} />
  }
}

export function UploadStatusBadge({ status }: { status: UploadStatus }) {
  return (
    <Badge className={STATUS_STYLES[status]}>
      <div className="flex items-center gap-1">
        <StatusIcon status={status} />
        <span>{STATUS_LABELS[status]}</span>
      </div>
    </Badge>
  )
}
