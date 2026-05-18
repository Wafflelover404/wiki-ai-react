"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi } from "./api"

interface User {
  username: string
  role: "admin" | "user" | "owner"
  organization: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAdmin: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  switchOrganization: (organizationId: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const validateAndSetToken = useCallback(async (storedToken: string) => {
    const result = await authApi.validateToken(storedToken)
    console.log("[v0] Token validation result:", result)
    if (result.status === "success" && (result.response?.valid || (result as any).valid)) {
      const data = result.response || result
      setToken(storedToken)
      setUser({
        username: (data as any).username || "User",
        role: ((data as any).role as User["role"]) || "user",
        organization: (data as any).organization_name || (data as any).organization || "",
      })
      return true
    }
    localStorage.removeItem("auth_token")
    return false
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      validateAndSetToken(storedToken).finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [validateAndSetToken])

  const login = async (username: string, password: string) => {
    console.log("[v0] Attempting login for:", username)
    const result = await authApi.login(username, password)
    console.log("[v0] Login result:", result)

    // Handle both Go backend format ({access_token, user, organization, memberships})
    // and legacy format ({status: "success", token: "..."})
    const token = (result as any).access_token || result.token
    if (token) {
      localStorage.setItem("auth_token", token)
      setToken(token)

      const userData = (result as any).user
      if (userData) {
        const membership = (result as any).memberships?.[0]
        setUser({
          username: userData.username || "User",
          role: (membership?.role || userData.role || "user") as "admin" | "user" | "owner",
          organization: (result as any).organization?.name || "",
        })
        return { success: true }
      }

      await validateAndSetToken(token)
      return { success: true }
    }

    if (result.status === "success" && result.token) {
      localStorage.setItem("auth_token", result.token)
      setToken(result.token)
      await validateAndSetToken(result.token)
      return { success: true }
    }

    return { success: false, error: result.message || "Login failed" }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setToken(null)
    setUser(null)
  }

  const switchOrganization = async (organizationId: string) => {
    if (!token) return false
    const result = await authApi.switchOrganization(token, { organization_id: organizationId })
    if (result.status === "success" && (result.response?.token || (result as any).token)) {
      const newToken = result.response?.token || (result as any).token
      localStorage.setItem("auth_token", newToken)
      await validateAndSetToken(newToken)
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: user?.role === "admin" || user?.role === "owner",
        login,
        logout,
        switchOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const PERMISSIONS = {
  VIEW_FILES: 'view_files',
  MANAGE_USERS: 'manage_users',
  MANAGE_ORGANIZATIONS: 'manage_organizations',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_PLUGINS: 'manage_plugins',
  ADMIN_ACCESS: 'admin_access'
} as const

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
