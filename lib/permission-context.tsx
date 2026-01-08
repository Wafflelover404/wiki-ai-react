"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuth, PERMISSIONS } from "@/lib/auth-context"

interface PermissionContextType {
  canViewFiles: boolean
  canUploadFiles: boolean
  canDownloadFiles: boolean
  canSearchFiles: boolean
  canManageUsers: boolean
  canManageFiles: boolean
  canDeleteFiles: boolean
  canEditFiles: boolean
  canViewSystemStats: boolean
  canManageApiKeys: boolean
  canViewReports: boolean
  canManageOrganizations: boolean
}

const PermissionContext = createContext<PermissionContextType | null>(null)

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { hasPermission } = useAuth()

  const permissions: PermissionContextType = {
    canViewFiles: hasPermission(PERMISSIONS.VIEW_FILES),
    canUploadFiles: hasPermission(PERMISSIONS.UPLOAD_FILES),
    canDownloadFiles: hasPermission(PERMISSIONS.DOWNLOAD_FILES),
    canSearchFiles: hasPermission(PERMISSIONS.SEARCH_FILES),
    canManageUsers: hasPermission(PERMISSIONS.MANAGE_USERS),
    canManageFiles: hasPermission(PERMISSIONS.MANAGE_FILES),
    canDeleteFiles: hasPermission(PERMISSIONS.DELETE_FILES),
    canEditFiles: hasPermission(PERMISSIONS.EDIT_FILES),
    canViewSystemStats: hasPermission(PERMISSIONS.VIEW_SYSTEM_STATS),
    canManageApiKeys: hasPermission(PERMISSIONS.MANAGE_API_KEYS),
    canViewReports: hasPermission(PERMISSIONS.VIEW_REPORTS),
    canManageOrganizations: hasPermission(PERMISSIONS.MANAGE_ORGANIZATIONS),
  }

  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider")
  }
  return context
}

// Permission-based component wrapper
interface PermissionGuardProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (hasPermission(permission)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

// Role-based component wrapper
interface RoleGuardProps {
  roles: ("admin" | "user" | "editor" | "viewer" | "owner")[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuth()

  if (user && roles.includes(user.role)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

// File access guard
interface FileAccessGuardProps {
  filename: string
  children: ReactNode
  fallback?: ReactNode
}

export function FileAccessGuard({ filename, children, fallback = null }: FileAccessGuardProps) {
  const { canAccessFile } = useAuth()

  if (canAccessFile(filename)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
