"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi } from "./api"

interface User {
  username: string
  role: "admin" | "user"
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
        role: ((data as any).role as "admin" | "user") || "user",
        organization: (data as any).organization || "",
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

    if (result.status === "success" && result.token) {
      localStorage.setItem("auth_token", result.token)
      setToken(result.token)
      // Set user directly from login response
      setUser({
        username: username,
        role: result.role || "user",
        organization: "",
      })
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
        isAdmin: user?.role === "admin",
        login,
        logout,
        switchOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
